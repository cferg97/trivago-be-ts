"use strict";
// import createHttpError from "http-errors";
// import { RequestHandler, Request } from "express";
// import { verifyAccessToken } from "./tools";
// import { TokenPayload } from "./tools";
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
exports.JWTAuthMiddleware = void 0;
// interface UserRequest extends Request {
//   user?: TokenPayload;
// }
// export const JWTAuthMiddleware: RequestHandler = async (
//   req: UserRequest,
//   res,
//   next
// ) => {
//   if (!req.headers.authorization) {
//     next(
//       createHttpError(
//         401,
//         "Please provide Bearer Token in the authorization header!"
//       )
//     );
//   } else {
//     try {
//       const accessToken = req.headers.authorization.replace("Bearer ", "");
//       const payload = await verifyAccessToken(accessToken);
//       req.user = {
//         _id: payload._id,
//         role: payload.role,
//       };
//       next();
//     } catch (error) {
//       console.log(error);
//       next(createHttpError(401, "Token not valid!"));
//     }
//   }
// };
const http_errors_1 = __importDefault(require("http-errors"));
const tools_1 = require("./tools");
const JWTAuthMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // 1. Check if authorization header is in the request, if it is not --> 401
    if (!req.headers.authorization) {
        next((0, http_errors_1.default)(401, "Please provide Bearer Token in the authorization header!"));
    }
    else {
        try {
            // 2. If authorization header is there, we should extract the token from it
            // ("Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjA5ZTJiMGViLTczY2QtNGIzZC1iZGMxLTk3MWJmZWE5Yzc0MyIsInJ1b2xvIjoiVXNlciIsImlhdCI6MTY3Mzk3NjIzMywiZXhwIjoxNjc0NTgxMDMzfQ.WGA-F9D_WeO96SJ2MzamSemg-emLjHv_N8_hYx3ipIw")
            const accessToken = req.headers.authorization.replace("Bearer ", "");
            // 3. Verify token (check the integrity and check expiration date)
            const payload = yield (0, tools_1.verifyAccessToken)(accessToken);
            // 4. If everything is fine we should get back the payload and no errors --> next
            req.user = {
                _id: payload._id,
                role: payload.role,
            };
            next();
        }
        catch (error) {
            console.log(error);
            // 5. If token is NOT ok, or in any case jsonwebtoken will throw some error --> 401
            next((0, http_errors_1.default)(401, "Token not valid!"));
        }
    }
});
exports.JWTAuthMiddleware = JWTAuthMiddleware;
