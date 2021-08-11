import { OrderCreatedEvent, Publisher, Subjects } from "@keil0-tickets/common";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated;
}
