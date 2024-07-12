import { Order, OrderItem } from "../models/orderM.js";
import Book from "../models/bookM.js";

class orderC {
  async createOrder(req, res) {
    const { items } = req.body;
    if (!items || !items.length) return res.status(400).json({ message: "Order items are required" });

    try {
      let totalAmount = 0;
      for (const item of items) {
        const book = await Book.findByPk(item.bookId);
        if (!book) return res.status(400).json({ message: `Book with id ${item.bookId} not found` });
        totalAmount += book.price * item.quantity;
      }

      const order = await Order.create({ userId: req.userId, totalAmount });
      for (const item of items) {
        await OrderItem.create({ orderId: order.id, bookId: item.bookId, quantity: item.quantity, price: item.price });
      }

      res.status(201).json(order);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }

  async getOrders(req, res) {
    const orders = await Order.findAll({ where: { userId: req.userId }, include: [OrderItem] });
    res.json(orders);
  }

  async getAllOrders(req, res) {
    if (req.userRole !== 'admin') return res.status(403).json({ message: "Access denied" });
    const orders = await Order.findAll({ include: [OrderItem] });
    res.json(orders);
  }
}

export default new orderC();
