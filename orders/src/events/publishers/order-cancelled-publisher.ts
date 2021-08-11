import {
  OrderCancelledEvent,
  Publisher,
  Subjects,
} from "@keil0-tickets/common";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  readonly subject = Subjects.OrderCancelled;
}
