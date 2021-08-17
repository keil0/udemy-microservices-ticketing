import Queue, { Job } from "bull";

// Nats
import { natsWrapper } from "../nats-wrapper";

// Publisher
import { ExpirationCompletePublisher } from "../events/publishers/expiration-complete-publisher";

interface Payload {
  orderId: string;
}

const expirationQueue = new Queue<Payload>("order:expiration", {
  redis: {
    host: process.env.REDIS_HOST,
  },
});

expirationQueue.process(async (job: Job) => {
  new ExpirationCompletePublisher(natsWrapper.client).publish({
    orderId: job.data.orderId,
  });
});

export { expirationQueue };
