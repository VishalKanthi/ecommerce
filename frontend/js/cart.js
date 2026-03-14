const getCart = () => {
  const c = localStorage.getItem("cart");
  return c ? JSON.parse(c) : [];
};

const saveCart = (cart) => {
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();
};

const addToCart = (product) => {
  const cart = getCart();
  const existing = cart.find(i => i.productId === product._id);
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({
      productId: product._id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1
    });
  }
  saveCart(cart);
  showToast(`${product.name} added to cart 🛒`);
};

const removeFromCart = (productId) => {
  saveCart(getCart().filter(i => i.productId !== productId));
};

const clearCart = () => {
  localStorage.removeItem("cart");
  updateCartCount();
};

const getCartTotal = () => getCart().reduce((s, i) => s + i.price * i.quantity, 0);

const getCartCount = () => getCart().reduce((s, i) => s + i.quantity, 0);

const updateCartCount = () => {
  const el = document.getElementById("cart-count");
  if (el) el.textContent = getCartCount();
};