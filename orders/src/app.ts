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
import { deleteOrderRouter } from "./routes/delete";
import { indexOrderRouter } from "./routes";
import { newOrderRouter } from "./routes/new";
import { showOrderRouter } from "./routes/show";

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

// Middleware
app.use(currentUser);

// Router
app.use(deleteOrderRouter);
app.use(indexOrderRouter);
app.use(newOrderRouter);
app.use(showOrderRouter);
app.all("*", async (req, res, next) => {
  throw new NotFoundError();
});

// Error handler
app.use(errorHandler);

export { app };
