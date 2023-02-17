"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_list_endpoints_1 = __importDefault(require("express-list-endpoints"));
const mongoose_1 = __importDefault(require("mongoose"));
const server_1 = __importDefault(require("./server"));
const port = process.env.PORT;
mongoose_1.default.connect(process.env.MONGO_URL);
mongoose_1.default.connection.on("connected", () => {
    server_1.default.listen(port, () => {
        console.log("Server is running on port:", port);
        console.table((0, express_list_endpoints_1.default)(server_1.default));
    });
});
