import supertest from "supertest";
import dotenv from "dotenv";
import mongoose from "mongoose";
import server from "../src/server";
import usersModel from "../src/api/users/model";
import { describe, expect, test } from "@jest/globals";
import { verifyAccessToken } from "../src/api/lib/auth/tools";

dotenv.config();

const client = supertest(server);

const validUser = {
  email: "testuser@test.com",
  password: "password1234",
  role: "Host",
};

const validUserLogin = {
  email: "testuser@test.com",
  password: "password1234",
};

const validUserWrongLogin = {
  email: "testuser@test.com",
  password: "password",
};

const anotherValidUser = {
  email: "test2@tester.com",
  password: "password1234",
  role: "User",
};

const notValidUser = {
  email: "dfgdfd@rgedf.com",
};

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URL_TEST!);
  const user = new usersModel(validUser);
  await user.save();
});

afterAll(async () => {
  await usersModel.deleteMany();
  await mongoose.connection.close();
});

// let accessToken: string;

describe("Test User Endpoints", () => {
  it("Should test that post /register returns 201 and a valid access token", async () => {
    const response = await client
      .post("/users/register")
      .send(anotherValidUser)
      .expect(201);
    expect(response.body.accessToken).toBeDefined();
    const validAccessToken = verifyAccessToken(response.body.accessToken);
    expect(validAccessToken);
  });

  it("Should test that post /register returns 200 with valid login and returns a valid JWT", async () => {
    const response = await client
      .post("/users/login")
      .send(validUserLogin)
      .expect(200);
    expect(response.body.accessToken).toBeDefined();
    const validAccessToken = verifyAccessToken(response.body.accessToken);
    expect(validAccessToken);
  });

  it("Should test that post /login returns 200 and valid JWT with valid login", async () => {
    const response = await client
      .post("/users/login")
      .send(validUserLogin)
      .expect(200);
    expect(response.body.accessToken).toBeDefined();
    const validAccessToken = verifyAccessToken(response.body.accessToken);
    expect(validAccessToken);
  });

  it("Should test that post /login returns 401 with an invalid login", async () => {
    const response = await client
      .post("/users/login")
      .send(validUserWrongLogin)
      .expect(401);
  });
});
