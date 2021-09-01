import express from "express";
import "express-async-errors";
import { json } from "body-parser";
import cookieSession from "cookie-session";
import { errorHandler, NotFoundError } from "@keil0-tickets/common";

// Routes
import { currentUserRouter } from "./routes/current-user";
import { signinRouter } from "./routes/signin";
import { signoutRouter } from "./routes/signout";
import { signupRouter } from "./routes/signup";

const app = express();
// Traffic pass through proxy ingress-nginx
app.set("trust proxy", true);
app.use(json());

// Service use cookie
app.use(
  cookieSession({
    signed: false,
    secure: false,
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

export { app };
