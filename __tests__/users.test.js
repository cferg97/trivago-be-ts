"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const dotenv_1 = __importDefault(require("dotenv"));
const mongoose_1 = __importDefault(require("mongoose"));
const server_1 = __importDefault(require("../src/server"));
const model_1 = __importDefault(require("../src/api/users/model"));
const globals_1 = require("@jest/globals");
const tools_1 = require("../src/api/lib/auth/tools");
dotenv_1.default.config();
const client = (0, supertest_1.default)(server_1.default);
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
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield mongoose_1.default.connect(process.env.MONGO_URL_TEST);
    const user = new model_1.default(validUser);
    yield user.save();
}));
afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield model_1.default.deleteMany();
    yield mongoose_1.default.connection.close();
}));
// let accessToken: string;
(0, globals_1.describe)("Test User Endpoints", () => {
    it("Should test that post /register returns 201 and a valid access token", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield client
            .post("/users/register")
            .send(anotherValidUser)
            .expect(201);
        (0, globals_1.expect)(response.body.accessToken).toBeDefined();
        const validAccessToken = (0, tools_1.verifyAccessToken)(response.body.accessToken);
        (0, globals_1.expect)(validAccessToken);
    }));
    it("Should test that post /register returns 200 with valid login", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield client
            .post("/users/login")
            .send(validUserLogin)
            .expect(200);
    }));
    it("Should test that post /register returns 401 with an invalid login", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield client
            .post("/users/login")
            .send(validUserWrongLogin)
            .expect(401);
    }));
});
