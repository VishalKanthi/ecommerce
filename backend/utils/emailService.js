const nodemailer = require("nodemailer");

// Create transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS
  }
});

// ── Welcome Email ──
const sendWelcomeEmail = async (to, name) => {
  try {
    await transporter.sendMail({
      from: `"${process.env.STORE_NAME}" <${process.env.GMAIL_USER}>`,
      to,
      subject: `Welcome to ${process.env.STORE_NAME}! 🎉`,
      html: `
        <div style="font-family:'Segoe UI',sans-serif;max-width:600px;margin:0 auto;background:#0a0a0f;color:#f0f0f8;border-radius:12px;overflow:hidden;">
          <div style="background:linear-gradient(135deg,#1a1a2e,#16213e);padding:40px;text-align:center;">
            <h1 style="font-size:2rem;margin:0;color:#fff;">Shop<span style="color:#ff6b35;">Easy</span></h1>
          </div>
          <div style="padding:40px;">
            <h2 style="color:#ff6b35;">Welcome, ${name}! 👋</h2>
            <p style="color:#9090a8;line-height:1.7;">
              Thank you for joining ShopEasy! We're excited to have you on board.
              Start exploring our premium collection of products.
            </p>
            <div style="text-align:center;margin:30px 0;">
              <a href="${process.env.FRONTEND_URL}"
                style="background:#ff6b35;color:white;padding:14px 32px;border-radius:8px;text-decoration:none;font-weight:600;font-size:1rem;">
                Start Shopping →
              </a>
            </div>
            <p style="color:#5a5a72;font-size:0.85rem;text-align:center;">
              © 2025 ShopEasy. All rights reserved.
            </p>
          </div>
        </div>
      `
    });
    console.log(`Welcome email sent to ${to}`);
  } catch (error) {
    console.error("Welcome email error:", error.message);
  }
};

// ── Order Confirmation Email ──
const sendOrderConfirmationEmail = async (to, name, order) => {
  try {
    const itemsHTML = order.items.map(item => `
      <tr>
        <td style="padding:10px;border-bottom:1px solid #1a1a24;color:#f0f0f8;">${item.name}</td>
        <td style="padding:10px;border-bottom:1px solid #1a1a24;color:#9090a8;text-align:center;">${item.quantity}</td>
        <td style="padding:10px;border-bottom:1px solid #1a1a24;color:#ff6b35;text-align:right;">₹${(item.price * item.quantity).toLocaleString('en-IN')}</td>
      </tr>
    `).join('');

    await transporter.sendMail({
      from: `"${process.env.STORE_NAME}" <${process.env.GMAIL_USER}>`,
      to,
      subject: `Order Confirmed! #${order._id.toString().slice(-8).toUpperCase()} 🎉`,
      html: `
        <div style="font-family:'Segoe UI',sans-serif;max-width:600px;margin:0 auto;background:#0a0a0f;color:#f0f0f8;border-radius:12px;overflow:hidden;">
          <div style="background:linear-gradient(135deg,#1a1a2e,#16213e);padding:40px;text-align:center;">
            <h1 style="font-size:2rem;margin:0 0 10px;color:#fff;">Shop<span style="color:#ff6b35;">Easy</span></h1>
            <p style="color:#9090a8;margin:0;">Order Confirmation</p>
          </div>
          <div style="padding:40px;">
            <h2 style="color:#4ade80;">✓ Order Placed Successfully!</h2>
            <p style="color:#9090a8;">Hi ${name}, your order has been confirmed.</p>

            <div style="background:#16161f;border:1px solid rgba(255,255,255,0.07);border-radius:8px;padding:20px;margin:20px 0;">
              <p style="color:#9090a8;margin:0 0 5px;font-size:0.85rem;">ORDER ID</p>
              <p style="color:#ff6b35;font-weight:700;margin:0;font-family:monospace;">#${order._id.toString().slice(-8).toUpperCase()}</p>
            </div>

            <table style="width:100%;border-collapse:collapse;">
              <thead>
                <tr style="border-bottom:1px solid #1a1a24;">
                  <th style="padding:10px;text-align:left;color:#5a5a72;font-size:0.85rem;">PRODUCT</th>
                  <th style="padding:10px;text-align:center;color:#5a5a72;font-size:0.85rem;">QTY</th>
                  <th style="padding:10px;text-align:right;color:#5a5a72;font-size:0.85rem;">PRICE</th>
                </tr>
              </thead>
              <tbody>${itemsHTML}</tbody>
              <tfoot>
                <tr>
                  <td colspan="2" style="padding:15px 10px;font-weight:700;color:#f0f0f8;">Total</td>
                  <td style="padding:15px 10px;font-weight:700;color:#ff6b35;text-align:right;font-size:1.1rem;">₹${order.total.toLocaleString('en-IN')}</td>
                </tr>
              </tfoot>
            </table>

            <div style="background:#16161f;border:1px solid rgba(255,255,255,0.07);border-radius:8px;padding:20px;margin:20px 0;">
              <p style="color:#9090a8;margin:0 0 5px;font-size:0.85rem;">DELIVERY ADDRESS</p>
              <p style="color:#f0f0f8;margin:0;">${order.address}</p>
            </div>

            <div style="text-align:center;margin:30px 0;">
              <a href="${process.env.FRONTEND_URL}/orders.html"
                style="background:#ff6b35;color:white;padding:14px 32px;border-radius:8px;text-decoration:none;font-weight:600;">
                Track My Order →
              </a>
            </div>

            <p style="color:#5a5a72;font-size:0.85rem;text-align:center;">
              © 2025 ShopEasy. All rights reserved.
            </p>
          </div>
        </div>
      `
    });
    console.log(`Order confirmation email sent to ${to}`);
  } catch (error) {
    console.error("Order confirmation email error:", error.message);
  }
};

// ── Order Status Update Email ──
const sendOrderStatusEmail = async (to, name, orderId, status) => {
  const statusMessages = {
    shipped: {
      emoji: "🚚",
      title: "Your Order is on the Way!",
      message: "Your order has been shipped and is on its way to you.",
      color: "#60a5fa"
    },
    delivered: {
      emoji: "✅",
      title: "Order Delivered!",
      message: "Your order has been delivered successfully. Enjoy your purchase!",
      color: "#4ade80"
    },
    cancelled: {
      emoji: "❌",
      title: "Order Cancelled",
      message: "Your order has been cancelled. Contact us if you have any questions.",
      color: "#f87171"
    }
  };

  const statusInfo = statusMessages[status] || {
    emoji: "📦",
    title: "Order Update",
    message: `Your order status has been updated to: ${status}`,
    color: "#ff6b35"
  };

  try {
    await transporter.sendMail({
      from: `"${process.env.STORE_NAME}" <${process.env.GMAIL_USER}>`,
      to,
      subject: `${statusInfo.emoji} Order #${orderId.slice(-8).toUpperCase()} - ${statusInfo.title}`,
      html: `
        <div style="font-family:'Segoe UI',sans-serif;max-width:600px;margin:0 auto;background:#0a0a0f;color:#f0f0f8;border-radius:12px;overflow:hidden;">
          <div style="background:linear-gradient(135deg,#1a1a2e,#16213e);padding:40px;text-align:center;">
            <h1 style="font-size:2rem;margin:0 0 10px;color:#fff;">Shop<span style="color:#ff6b35;">Easy</span></h1>
          </div>
          <div style="padding:40px;text-align:center;">
            <div style="font-size:4rem;margin-bottom:20px;">${statusInfo.emoji}</div>
            <h2 style="color:${statusInfo.color};">${statusInfo.title}</h2>
            <p style="color:#9090a8;line-height:1.7;">Hi ${name}, ${statusInfo.message}</p>

            <div style="background:#16161f;border:1px solid rgba(255,255,255,0.07);border-radius:8px;padding:20px;margin:20px 0;display:inline-block;">
              <p style="color:#9090a8;margin:0 0 5px;font-size:0.85rem;">ORDER ID</p>
              <p style="color:#ff6b35;font-weight:700;margin:0;font-family:monospace;">#${orderId.slice(-8).toUpperCase()}</p>
            </div>

            <div style="margin:30px 0;">
              <a href="${process.env.FRONTEND_URL}/orders.html"
                style="background:#ff6b35;color:white;padding:14px 32px;border-radius:8px;text-decoration:none;font-weight:600;">
                View My Orders →
              </a>
            </div>

            <p style="color:#5a5a72;font-size:0.85rem;">
              © 2025 ShopEasy. All rights reserved.
            </p>
          </div>
        </div>
      `
    });
    console.log(`Status email sent to ${to}`);
  } catch (error) {
    console.error("Status email error:", error.message);
  }
};

module.exports = { sendWelcomeEmail, sendOrderConfirmationEmail, sendOrderStatusEmail };