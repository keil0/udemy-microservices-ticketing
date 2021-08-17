import {
  ExpirationCompleteEvent,
  Publisher,
  Subjects,
} from "@keil0-tickets/common";

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
  readonly subject = Subjects.ExpirationComplete;
}
