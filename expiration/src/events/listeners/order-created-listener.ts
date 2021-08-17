import { Listener, OrderCreatedEvent, Subjects } from "@keil0-tickets/common";
import { Message } from "node-nats-streaming";

// Queue
import { queueGroupName } from "./queue-group-name";

// Job queue
import { expirationQueue } from "../../queues/expiration-queue";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderCreatedEvent["data"], msg: Message) {
    await expirationQueue.add({
      orderId: data.id,
    });

    msg.ack();
  }
}
