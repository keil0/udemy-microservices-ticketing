import express, { Request, Response } from "express";
import { currentUser } from "@keil0-tickets/common";


const router = express.Router();

router.get(
  "/api/users/currentuser",
  currentUser,
  (req: Request, res: Response) => {
    res.send({ currentUser: req.currentUser });
  }
);

export { router as currentUserRouter };
