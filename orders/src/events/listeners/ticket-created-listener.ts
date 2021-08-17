import { Message } from "node-nats-streaming";
import { Listener, Subjects, TicketCreatedEvent } from "@keil0-tickets/common";

// Models
import { Ticket } from "../../models/ticket";

// Queue
import { queueGroupName } from "./queue-group-name";

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: TicketCreatedEvent["data"], msg: Message) {
    const { id, title, price } = data;

    const ticket = await Ticket.build({ id, title, price });
    await ticket.save();

    msg.ack();
  }
}
