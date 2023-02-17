"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HostOnlyMiddleware = void 0;
const http_errors_1 = __importDefault(require("http-errors"));
const HostOnlyMiddleware = (req, res, next) => {
    if (req.user.role === "Host") {
        next();
    }
    else {
        next((0, http_errors_1.default)(403, "You are not authorized to carry out this action"));
    }
};
exports.HostOnlyMiddleware = HostOnlyMiddleware;
