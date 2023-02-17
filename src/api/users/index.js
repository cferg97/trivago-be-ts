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
const express_1 = __importDefault(require("express"));
const http_errors_1 = __importDefault(require("http-errors"));
const model_js_1 = __importDefault(require("./model.js"));
const model_js_2 = __importDefault(require("../accomodation/model.js"));
// import q2m from "query-to-mongo";
const tools_1 = require("../lib/auth/tools");
const jwtAuth_1 = require("../lib/auth/jwtAuth");
const hostOnly_1 = require("../lib/auth/hostOnly");
const usersRouter = express_1.default.Router();
usersRouter.post("/register", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const newUser = new model_js_1.default(req.body);
        const { _id, role } = yield newUser.save();
        const payload = { _id, role };
        const accessToken = yield (0, tools_1.createAccessToken)(payload);
        res.status(201).send({ accessToken });
    }
    catch (err) {
        next(err);
    }
}));
usersRouter.post("/login", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const user = yield model_js_1.default.checkCredentials(email, password);
        if (user) {
            const payload = { _id: user._id, role: user.role };
            const accessToken = yield (0, tools_1.createAccessToken)(payload);
            res.send({ accessToken });
        }
        else {
            next((0, http_errors_1.default)(401, "Please check your credentials are correct"));
        }
    }
    catch (err) {
        next(err);
    }
}));
usersRouter.get("/me/accomodation", jwtAuth_1.JWTAuthMiddleware, hostOnly_1.hostOnlyMiddleware, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const accom = yield model_js_2.default.find({ host: (_a = req.user) === null || _a === void 0 ? void 0 : _a._id }, "-createdAt -updatedAt -__v -host");
        if (accom.length === 0) {
            next((0, http_errors_1.default)(404, "This user has no posted accomodation."));
        }
        if (accom.length >= 1) {
            res.send(accom);
        }
    }
    catch (err) {
        next(err);
    }
}));
usersRouter.get("/me", jwtAuth_1.JWTAuthMiddleware, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    try {
        const me = yield model_js_1.default.findById((_b = req.user) === null || _b === void 0 ? void 0 : _b._id);
        res.send(me);
    }
    catch (err) {
        next(err);
    }
}));
exports.default = usersRouter;
