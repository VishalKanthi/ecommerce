// Cart is stored in localStorage on frontend
// This controller handles cart-to-order validation only

const Product = require("../models/Product");

// POST /api/cart/validate
// Frontend sends cart items, backend checks stock & returns updated prices
const validateCart = async (req, res) => {
  try {
    const { items } = req.body; // [{ productId, quantity }]
    const validated = [];

    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product) return res.status(404).json({ message: `Product not found: ${item.productId}` });
      if (product.stock < item.quantity) {
        return res.status(400).json({ message: `Not enough stock for: ${product.name}` });
      }
      validated.push({
        product: product._id,
        name: product.name,
        price: product.price,
        quantity: item.quantity
      });
    }

    res.json({ valid: true, items: validated });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { validateCart };