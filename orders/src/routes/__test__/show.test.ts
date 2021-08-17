import request from "supertest";
import mongoose from "mongoose";

// Models
import { Ticket } from "../../models/ticket";

import { app } from "../../app";

it("fetches the order", async () => {
  const user = global.signin();

  // Create a ticket
  const ticket = Ticket.build({
    id: mongoose.Types.ObjectId().toHexString(),
    title: "Concert",
    price: 10,
  });
  await ticket.save();

  // Make a request to build an order with this ticket
  const { body: order } = await request(app)
    .post("/api/orders")
    .set("Cookie", user)
    .send({ ticketId: ticket.id })
    .expect(201);

  // Make request to fetch the order
  const { body: fetchedOrder } = await request(app)
    .get(`/api/orders/${order.id}`)
    .set("Cookie", user)
    .send()
    .expect(200);

  expect(fetchedOrder.id).toEqual(order.id);
});

it("returns an error if one user tries to fetch another user's order", async () => {
  const user = global.signin();

  // Create a ticket
  const ticket = Ticket.build({
    id: mongoose.Types.ObjectId().toHexString(),
    title: "Concert",
    price: 10,
  });
  await ticket.save();

  // Make a request to build an order with this ticket
  const { body: order } = await request(app)
    .post("/api/orders")
    .set("Cookie", user)
    .send({ ticketId: ticket.id })
    .expect(201);

  // Make request to fetch the order
  await request(app)
    .get(`/api/orders/${order.id}`)
    .set("Cookie", global.signin())
    .expect(401);
});
