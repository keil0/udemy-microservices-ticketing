import express, { Request, Response } from "express";
import {
  NotAuthorizedError,
  NotFoundError,
  requireAuth,
} from "@keil0-tickets/common";

// NATS
import { natsWrapper } from "../nats-wrapper";

// Order
import { Order, OrderStatus } from "../models/order";

// Publisher
import { OrderCancelledPublisher } from "../events/publishers/order-cancelled-publisher";

const router = express.Router();

router.delete(
  "/api/orders/:orderId",
  requireAuth,
  async (req: Request, res: Response) => {
    const { orderId } = req.params;

    const order = await Order.findById(orderId).populate("ticket");

    if (!order) {
      throw new NotFoundError();
    }

    if (order.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }

    order.status = OrderStatus.Cancelled;
    await order.save();

    // Send event
    new OrderCancelledPublisher(natsWrapper.client).publish({
      id: order.id,
      version: order.version,
      ticket: {
        id: order.ticket.id,
      },
    });

    res.status(204).send();
  }
);

export { router as deleteOrderRouter };
