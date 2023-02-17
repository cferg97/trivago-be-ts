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
const mongoose_1 = __importDefault(require("mongoose"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const { Schema, model } = mongoose_1.default;
const usersSchema = new Schema({
    email: { type: String, required: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["User", "Host"], default: "User" },
}, {
    timestamps: true,
});
usersSchema.pre("save", function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        const currentUser = this;
        if (currentUser.isModified("password")) {
            const plainPW = currentUser.password;
            const hash = yield bcrypt_1.default.hash(plainPW, 11);
            currentUser.password = hash;
        }
        next();
    });
});
usersSchema.methods.toJSON = function () {
    const userDoc = this;
    const user = userDoc.toObject();
    delete user.password;
    delete user.createdAt;
    delete user.updatedAt;
    delete user.__v;
    return user;
};
usersSchema.static("checkCredentials", function (email, password) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = yield this.findOne({ email });
        if (user) {
            const passwordMatch = yield bcrypt_1.default.compare(password, user.password);
            if (passwordMatch) {
                return user;
            }
            else {
                return null;
            }
        }
        else {
            return null;
        }
    });
});
exports.default = model("users", usersSchema);
