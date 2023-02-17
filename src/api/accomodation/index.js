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
const jwtAuth_1 = require("../lib/auth/jwtAuth");
const hostOnly_1 = require("../lib/auth/hostOnly");
const model_1 = __importDefault(require("./model"));
const accomRouter = express_1.default.Router();
accomRouter.get("/", jwtAuth_1.JWTAuthMiddleware, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const accom = yield model_1.default.find({}).populate({
            path: "host",
            select: "email -_id",
        });
        res.send(accom);
    }
    catch (err) {
        next(err);
    }
}));
accomRouter.get("/:id", jwtAuth_1.JWTAuthMiddleware, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const accom = yield model_1.default.findById(req.params.id).populate({
            path: "host",
            select: "email -_id",
        });
        if (accom) {
            res.send(accom);
        }
        else {
            next((0, http_errors_1.default)(404, `Accomodation with ID ${req.params.id} not found.`));
        }
    }
    catch (err) {
        next(err);
    }
}));
accomRouter.post("/", jwtAuth_1.JWTAuthMiddleware, hostOnly_1.hostOnlyMiddleware, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const newAccom = new model_1.default(Object.assign(Object.assign({}, req.body), { host: req.user._id }));
        const { _id } = yield newAccom.save();
        res.status(201).send({ id: _id });
    }
    catch (err) {
        next(err);
    }
}));
accomRouter.put("/:id", jwtAuth_1.JWTAuthMiddleware, hostOnly_1.hostOnlyMiddleware, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const accom = yield model_1.default.findOne({ _id: req.params.id });
        if (accom) {
            if (req.user._id === accom.host.toString()) {
                yield model_1.default.findByIdAndUpdate(req.params.id, req.body, {
                    new: true,
                    runValidators: true,
                });
                res.status(204).send();
            }
            else {
                next((0, http_errors_1.default)(403, "You are not authorized to carry out this action."));
            }
        }
        else {
            next((0, http_errors_1.default)(404, `Accomodation with ID ${req.params.id} not found.`));
        }
    }
    catch (err) {
        next(err);
    }
}));
accomRouter.delete("/:id", jwtAuth_1.JWTAuthMiddleware, hostOnly_1.hostOnlyMiddleware, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const accom = yield model_1.default.findOne({ _id: req.params.id });
        if (accom) {
            if (req.user._id === accom.host.toString()) {
                const deletedAccom = yield model_1.default.findByIdAndDelete(req.params.id);
                if (deletedAccom) {
                    res.status(204).send();
                }
                else {
                    next((0, http_errors_1.default)(404, `Cannot find accomodation with ID ${req.params.id}`));
                }
            }
        }
        else {
            next((0, http_errors_1.default)(403, `You are not authorized to carry out this action.`));
        }
    }
    catch (err) {
        next(err);
    }
}));
exports.default = accomRouter;
