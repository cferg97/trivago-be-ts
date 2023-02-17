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
const model_1 = __importDefault(require("../src/api/accomodation/model"));
const globals_1 = require("@jest/globals");
dotenv_1.default.config();
const client = (0, supertest_1.default)(server_1.default);
const validJWT = process.env.VALID_JWT;
const validAccomodation = {
    name: "Test Accomodation",
    description: "very good",
    maxGuests: 5,
    city: "Edinburgh",
    country: "Scotland"
};
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield mongoose_1.default.connect(process.env.MONGO_URL_TEST);
}));
afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield model_1.default.deleteMany();
    yield mongoose_1.default.connection.close();
}));
(0, globals_1.describe)("Test accomodation endpoints", () => {
    it("Should test that returned body is an array", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield client.get("/accomodation").expect(200);
        (0, globals_1.expect)(typeof response.body).toBe("array");
    }));
});
