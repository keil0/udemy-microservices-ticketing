import express, { Request, Response } from "express";
import { body } from "express-validator";
import jwt from "jsonwebtoken";
import { BadRequestError, validateRequest } from "@keil0-tickets/common";

// Models
import { User } from "../models/user";

// Services
import { Password } from "../services/password";

const router = express.Router();

router.post(
  "/api/users/signin",
  [
    body("email").isEmail().withMessage("Email must be valid"),
    body("password")
      .trim()
      .notEmpty()
      .withMessage("You must supply a password"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { email, password } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      throw new BadRequestError("Invalid credentials.");
    }

    // Check password
    const passwordMatch = await Password.compare(
      existingUser.password,
      password
    );
    if (!passwordMatch) {
      throw new BadRequestError("Invalid credentials.");
    }

    // Generate JWT & store it in session object
    const userJWT = jwt.sign(
      { id: existingUser.id, email },
      process.env.JWT_KEY!
    );
    req.session = {
      jwt: userJWT,
    };

    return res.status(200).send(existingUser);
  }
);

export { router as signinRouter };
