import mongoose from "mongoose";

import { app } from "./app";

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
