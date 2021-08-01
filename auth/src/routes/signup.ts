import express, { Request, Response } from "express";
import { body, validationResult } from "express-validator";

// Errors
import { RequestValidationError } from "../errors/request-validation-error";
import { BadRequestError } from "../errors/bad-request-error";

// Models
import { User } from "../models/user";

const router = express.Router();

router.post(
  "/api/users/signup",
  [
    body("email").isEmail().withMessage("Email must be valid"),
    body("password")
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage("Password must be between 4 and 20 characters"),
  ],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      throw new RequestValidationError(errors.array());
    }

    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });

    // Check if email is already in use
    if (existingUser) {
      throw new BadRequestError("Email already in use");
    }

    // Create & save user
    const user = User.build({ email, password });
    await user.save();

    return res.status(201).send(user);
  }
);

export { router as signupRouter };
