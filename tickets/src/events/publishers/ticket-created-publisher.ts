import { Publisher, Subjects, TicketCreatedEvent } from "@keil0-tickets/common";

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated;
}
