import { natsWrapper } from "./nats-wrapper";

// Listeners
import { OrderCreatedListener } from "./events/listeners/order-created-listener";

// Starting service
const start = async () => {
  console.log("Starting expiration service....");
  // Check environment variables
  if (!process.env.NATS_CLIENT_ID) {
    throw new Error("NATS_CLIENT_ID must be defined");
  }
  if (!process.env.NATS_URL) {
    throw new Error("NATS_URL must be defined");
  }
  if (!process.env.NATS_CLUSTER_ID) {
    throw new Error("NATS_CLUSTER_ID must be defined");
  }

  try {
    // Connect to NATS
    await natsWrapper.connect(
      process.env.NATS_CLUSTER_ID,
      process.env.NATS_CLIENT_ID,
      process.env.NATS_URL
    );

    natsWrapper.client.on("close", () => {
      console.log("NATS connection closed");
      process.exit();
    });

    process.on("SIGINT", () => natsWrapper.client.close());
    process.on("SIGTERM", () => natsWrapper.client.close());

    // Run listeners
    new OrderCreatedListener(natsWrapper.client).listen();
  } catch (e) {
    console.log(e);
  }
};

start();
