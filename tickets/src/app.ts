import express from "express";
import "express-async-errors";
import { json } from "body-parser";
import cookieSession from "cookie-session";
import {
  errorHandler,
  NotFoundError,
  currentUser,
} from "@keil0-tickets/common";

// Routes
import { createTicketRouter } from "./routes/new";
import { showTicketRouter } from "./routes/show";

const app = express();
// Traffic pass through proxy ingress-nginx
app.set("trust proxy", true);
app.use(json());

// Service use cookie
app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== "test",
  })
);

// Middleware
app.use(currentUser);

// Router
app.use(createTicketRouter);
app.use(showTicketRouter);
app.all("*", async (req, res, next) => {
  throw new NotFoundError();
});

// Error handler
app.use(errorHandler);

export { app };
