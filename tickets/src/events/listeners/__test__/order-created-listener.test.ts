import { OrderCreatedEvent, OrderStatus } from "@keil0-tickets/common";
import mongoose from "mongoose";
import { Message } from "node-nats-streaming";

// Models
import { Ticket } from "../../../models/ticket";

// NATS
import { natsWrapper } from "../../../nats-wrapper";

import { OrderCreatedListener } from "../order-created-listener";

const setup = async () => {
  // Create a instance of the listener
  const listener = new OrderCreatedListener(natsWrapper.client);

  // Create and save a ticket
  const ticket = Ticket.build({
    title: "Concert",
    price: 20,
    userId: "asdf",
  });
  await ticket.save();

  // Create the fake data event
  const data: OrderCreatedEvent["data"] = {
    id: mongoose.Types.ObjectId().toHexString(),
    version: 0,
    status: OrderStatus.Created,
    userId: "asdf",
    expiresAt: "tasa",
    ticket: {
      id: ticket.id,
      price: ticket.price,
    },
  };

  // Create the fake message object
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, data, msg, ticket };
};

it("sets the orderId of the ticket", async () => {
  const { listener, data, msg, ticket } = await setup();

  await listener.onMessage(data, msg);

  const updatedTicket = await Ticket.findById(ticket.id);

  expect(updatedTicket!.orderId).toEqual(data.id);
});

it("acks the message", async () => {
  const { listener, data, msg, ticket } = await setup();

  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});

it("publishes a ticket updated event", async () => {
  const { listener, data, msg, ticket } = await setup();

  await listener.onMessage(data, msg);

  expect(natsWrapper.client.publish).toHaveBeenCalled();

  // Get mock function call parameters
  const ticketUpdatedData = JSON.parse(
    (natsWrapper.client.publish as jest.Mock).mock.calls[0][1]
  );

  expect(data.id).toEqual(ticketUpdatedData.orderId);
});
