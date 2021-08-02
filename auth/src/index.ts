import express from "express";
import "express-async-errors";
import { json } from "body-parser";
import mongoose from "mongoose";
import cookieSession from "cookie-session";

// Middlewares
import { errorHandler } from "./middlewares/error-handlers";

// Routes
import { currentUserRouter } from "./routes/current-user";
import { signinRouter } from "./routes/signin";
import { signoutRouter } from "./routes/signout";
import { signupRouter } from "./routes/signup";

// Errors
import { NotFoundError } from "./errors/not-found-error";

const app = express();
// Traffic pass through proxy ingress-nginx
app.set("trust proxy", true);
app.use(json());

// Service use cookie
app.use(
  cookieSession({
    signed: false,
    secure: true,
  })
);

// Router
app.use(currentUserRouter);
app.use(signinRouter);
app.use(signoutRouter);
app.use(signupRouter);
app.all("*", async (req, res, next) => {
  throw new NotFoundError();
});

// Error handler
app.use(errorHandler);

// Database
const start = async () => {
  // Check environment variables
  if (!process.env.JWT_KEY) {
    throw new Error("JWT_KEY must be defined");
  }

  // Connect to database
  try {
    await mongoose.connect("mongodb://auth-mongo-srv:27017/auth", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });

    console.log("Connected to MongoDB");
  } catch (e) {
    console.log(e);
  }

  app.listen(3000, () => {
    console.log("Listening on port 3000");
  });
};

start();
