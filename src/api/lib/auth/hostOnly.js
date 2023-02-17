"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.hostOnlyMiddleware = void 0;
const http_errors_1 = __importDefault(require("http-errors"));
const hostOnlyMiddleware = (req, res, next) => {
    var _a;
    if (((_a = req.user) === null || _a === void 0 ? void 0 : _a.role) === "Host") {
        next();
    }
    else {
        next((0, http_errors_1.default)(403, "You are not authorized to perform this action"));
    }
};
exports.hostOnlyMiddleware = hostOnlyMiddleware;
