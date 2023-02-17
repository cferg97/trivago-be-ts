import supertest from "supertest";
import dotenv from "dotenv";
import mongoose from "mongoose";
import server from "../src/server";
import accomodationModel from "../src/api/accomodation/model";
import usersModel from "../src/api/users/model"
import { describe, expect, test } from "@jest/globals";
import { verifyAccessToken } from "../src/api/lib/auth/tools";

dotenv.config();

const client = supertest(server);

let validJWT:string 

const validAccomodation = {
    name: "Test Accomodation",
    description: "very good",
    maxGuests: 5,
    city: "Edinburgh",
    country: "Scotland"
}

const validUser = {
    email: "test@test.com",
    password: 'test123'
}

beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URL_TEST!)
    const user = new usersModel(validUser)
    await user.save()
})

afterAll(async () => {
    await accomodationModel.deleteMany()
    await mongoose.connection.close()
})

describe("Test accomodation endpoints", () => {
    it("Should test that returned body is an array", async () => {
        const response = await client.get("/accomodation").set('Authorization', 'Bearer ' + validJWT).expect(200)
        expect(typeof response.body).toBe("array")
    })
})