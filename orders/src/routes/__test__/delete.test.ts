import request from "supertest";
import { OrderStatus } from "@keil0-tickets/common";
import mongoose from "mongoose";

// Models
import { Ticket } from "../../models/ticket";
import { Order } from "../../models/order";

// NATS
import { natsWrapper } from "../../nats-wrapper";

import { app } from "../../app";

it("marks an order as cancelled", async () => {
  // Create a ticket
  const ticket = Ticket.build({
    id: mongoose.Types.ObjectId().toHexString(),
    title: "Concert",
    price: 20,
  });
  await ticket.save();

  // Make a request to create an order
  const user = global.signin();
  const { body: order } = await request(app)
    .post("/api/orders")
    .set("Cookie", user)
    .send({ ticketId: ticket.id })
    .expect(201);

  // Make a request to cancel this order
  await request(app)
    .delete(`/api/orders/${order.id}`)
    .set("Cookie", user)
    .send()
    .expect(204);

  // Expectation to make sur the thing is cancelled
  const updatedOrder = await Order.findById(order.id);
  expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);
});

it("emits an order cancelled event", async () => {
  // Create a ticket
  const ticket = Ticket.build({
    id: mongoose.Types.ObjectId().toHexString(),
    title: "Concert",
    price: 20,
  });
  await ticket.save();

  // Make a request to create an order
  const user = global.signin();
  const { body: order } = await request(app)
    .post("/api/orders")
    .set("Cookie", user)
    .send({ ticketId: ticket.id })
    .expect(201);

  // Make a request to cancel this order
  await request(app)
    .delete(`/api/orders/${order.id}`)
    .set("Cookie", user)
    .send()
    .expect(204);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
