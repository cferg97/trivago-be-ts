"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const mongoose_2 = require("mongoose");
const accomodationSchema = new mongoose_2.Schema({
    name: { type: String, required: true },
    host: { type: mongoose_2.Schema.Types.ObjectId, ref: "users", required: true },
    description: { type: String, required: true },
    maxGuests: { type: Number, required: true },
    city: { type: String, required: true },
    country: { type: String, required: true },
}, {
    timestamps: true,
});
const accomodationModel = mongoose_1.default.model("accomodation", accomodationSchema);
exports.default = accomodationModel;
