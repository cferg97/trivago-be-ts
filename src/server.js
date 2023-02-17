"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const users_1 = __importDefault(require("./api/users"));
const errorHandlers_1 = require("./errorHandlers");
const server = (0, express_1.default)();
server.use((0, cors_1.default)());
server.use(express_1.default.json());
server.use("/users", users_1.default);
server.use(errorHandlers_1.badRequestHandler);
server.use(errorHandlers_1.unauthorizedHandler);
server.use(errorHandlers_1.genericErrorHandler);
exports.default = server;
