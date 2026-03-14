const renderProducts = (products) => {
  const grid = document.getElementById("products-grid");
  if (!products.length) {
    grid.innerHTML = `
      <div class="empty-state" style="grid-column:1/-1">
        <div class="icon">🔍</div>
        <h3>No products found</h3>
        <p>Try a different search or category</p>
      </div>`;
    return;
  }
  grid.innerHTML = products.map(p => `
    <div class="product-card" onclick="window.location.href='/product.html?id=${p._id}'">
      <div class="product-img-wrap">
        <img src="${p.image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&q=80'}"
          alt="${p.name}" loading="lazy" />
        ${p.stock === 0 ? '<span class="product-badge out-badge">Out of Stock</span>' : ''}
        ${p.stock > 0 && p.stock <= 5 ? '<span class="product-badge">Only ' + p.stock + ' left</span>' : ''}
      </div>
      <div class="product-body">
        <div class="product-category">${p.category || 'General'}</div>
        <div class="product-name">${p.name}</div>
        <div class="product-footer">
          <div class="product-price">₹${p.price.toLocaleString('en-IN')}</div>
          ${p.stock > 0
            ? `<button class="add-btn"
                onclick="event.stopPropagation();
                handleAddToCart('${p._id}','${p.name}',${p.price},'${p.image||''}')"
                title="Add to cart">+</button>`
            : `<button class="add-btn" style="background:var(--surface2);cursor:not-allowed;" disabled>✕</button>`
          }
        </div>
      </div>
    </div>
  `).join('');
};

const loadProducts = async (query = "") => {
  const grid = document.getElementById("products-grid");
  grid.innerHTML = Array(8).fill(`
    <div class="product-card" style="pointer-events:none;">
      <div class="skeleton" style="aspect-ratio:1;"></div>
      <div class="product-body">
        <div class="skeleton" style="height:12px;width:60%;margin-bottom:0.5rem;"></div>
        <div class="skeleton" style="height:16px;width:90%;margin-bottom:1rem;"></div>
        <div class="skeleton" style="height:12px;width:40%;"></div>
      </div>
    </div>`).join('');
  try {
    const products = await productAPI.getAll(query);
    renderProducts(products);
  } catch (err) {
    grid.innerHTML = `
      <div class="empty-state" style="grid-column:1/-1">
        <div class="icon">⚠️</div>
        <h3>Failed to load products</h3>
        <p>${err.message}</p>
      </div>`;
  }
};

const handleAddToCart = (id, name, price, image) => {
  addToCart({ _id: id, name, price, image });
};

let searchTimeout;
const searchProducts = () => {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    const search = document.getElementById("search-input")?.value || "";
    const category = document.getElementById("category-filter")?.value || "";
    const params = [];
    if (search) params.push(`search=${encodeURIComponent(search)}`);
    if (category) params.push(`category=${encodeURIComponent(category)}`);
    loadProducts(params.length ? "?" + params.join("&") : "");
  }, 300);
};