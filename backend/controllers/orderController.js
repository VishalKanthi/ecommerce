const Order = require("../models/Order");
const Product = require("../models/Product");
const User = require("../models/User");
const { sendOrderConfirmationEmail, sendOrderStatusEmail } = require("../utils/emailService"); // ← ADD

const createOrder = async (req, res) => {
  try {
    const { items, address } = req.body;
    let total = 0;

    for (const item of items) {
      total += item.price * item.quantity;
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: -item.quantity }
      });
    }

    const order = await Order.create({
      user: req.user.id,
      items,
      total,
      address
    });

    // ── Send order confirmation email ──
    const user = await User.findById(req.user.id);
    sendOrderConfirmationEmail(user.email, user.name, order); // ← ADD

    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate("user", "name email").sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    ).populate("user", "name email");

    // ── Send status update email ──
    if (order.user) {
      sendOrderStatusEmail(
        order.user.email,
        order.user.name,
        order._id.toString(),
        req.body.status
      ); // ← ADD
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createOrder, getMyOrders, getAllOrders, updateOrderStatus };