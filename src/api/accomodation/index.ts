import express, { Request, Response, NextFunction } from "express";
import createHttpError from "http-errors";
import { JWTAuthMiddleware } from "../lib/auth/jwtAuth";
import { hostOnlyMiddleware } from "../lib/auth/hostOnly";
import accomModel from "./model";

const accomRouter = express.Router();

accomRouter.get("/", JWTAuthMiddleware, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const accom = await accomModel.find({}).populate({
      path: "host",
      select: "email -_id",
    });
    res.send(accom);
  } catch (err) {
    next(err);
  }
});

accomRouter.get("/:id", JWTAuthMiddleware, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const accom = await accomModel.findById(req.params.id).populate({
      path: "host",
      select: "email -_id",
    });
    if (accom) {
      res.send(accom);
    } else {
      next(
        createHttpError(404, `Accomodation with ID ${req.params.id} not found.`)
      );
    }
  } catch (err) {
    next(err);
  }
});

accomRouter.post(
  "/",
  JWTAuthMiddleware,
  hostOnlyMiddleware,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const newAccom = new accomModel({ ...req.body, host: req.user?._id });
      const { _id } = await newAccom.save();
      res.status(201).send({ id: _id });
    } catch (err) {
      next(err);
    }
  }
);

accomRouter.put(
  "/:id",
  JWTAuthMiddleware,
  hostOnlyMiddleware,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const accom = await accomModel.findOne({ _id: req.params.id });

      if (accom) {
        if (req.user?._id === accom.host.toString()) {
          await accomModel.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
          });
          res.status(204).send();
        } else {
          next(
            createHttpError(
              403,
              "You are not authorized to carry out this action."
            )
          );
        }
      } else {
        next(
          createHttpError(
            404,
            `Accomodation with ID ${req.params.id} not found.`
          )
        );
      }
    } catch (err) {
      next(err);
    }
  }
);

accomRouter.delete(
  "/:id",
  JWTAuthMiddleware,
  hostOnlyMiddleware,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const accom = await accomModel.findOne({ _id: req.params.id });
      if (accom) {
        if (req.user?._id === accom.host.toString()) {
          const deletedAccom = await accomModel.findByIdAndDelete(
            req.params.id
          );
          if (deletedAccom) {
            res.status(204).send();
          } else {
            next(
              createHttpError(
                404,
                `Cannot find accomodation with ID ${req.params.id}`
              )
            );
          }
        }
      } else {
        next(
          createHttpError(
            403,
            `You are not authorized to carry out this action.`
          )
        );
      }
    } catch (err) {
      next(err);
    }
  }
);

export default accomRouter;
