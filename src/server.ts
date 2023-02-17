import express from "express";
import cors from "cors";
import usersRouter from "./api/users";
import accomRouter from "./api/accomodation";
import {
  badRequestHandler,
  unauthorizedHandler,
  genericErrorHandler,
  forbiddenHandler,
} from "./errorHandlers";

const server = express();

server.use(cors());
server.use(express.json());

server.use("/users", usersRouter);
server.use("/accomodation", accomRouter);

server.use(badRequestHandler);
server.use(unauthorizedHandler);
server.use(forbiddenHandler);
server.use(genericErrorHandler);

export default server;
