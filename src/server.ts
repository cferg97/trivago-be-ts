import express from "express";
import cors from "cors";
import usersRouter from "./api/users";
import {
  badRequestHandler,
  unauthorizedHandler,
  genericErrorHandler,
} from "./errorHandlers";

const server = express();

server.use(cors());
server.use(express.json());

server.use("/users", usersRouter);

server.use(badRequestHandler);
server.use(unauthorizedHandler);
server.use(genericErrorHandler);

export default server;
