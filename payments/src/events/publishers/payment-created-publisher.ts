import {
  PaymentCreatedEvent,
  Publisher,
  Subjects,
} from "@keil0-tickets/common";

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  readonly subject = Subjects.PaymentCreated;
}
