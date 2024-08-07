import mongoose from "mongoose";

import { app } from "./app";

// Database
const start = async () => {
  console.log("Starting auth service....");
  // Check environment variables
  if (!process.env.JWT_KEY) {
    throw new Error("JWT_KEY must be defined");
  }
  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI must be defined");
  }

  // Connect to database
  try {
    await mongoose.connect(process.env.MONGO_URI, {
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
