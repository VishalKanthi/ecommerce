const formatDate = (dateStr) => {
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric'
  });
};

const renderOrders = (orders) => {
  const container = document.getElementById("orders-container");
  if (!orders.length) {
    container.innerHTML = `
      <div class="empty-state">
        <div class="icon">📦</div>
        <h3>No orders yet</h3>
        <p>Your orders will appear here once you make a purchase</p>
        <a href="/index.html" class="btn btn-primary">Start Shopping</a>
      </div>`;
    return;
  }
  container.innerHTML = orders.map(o => `
    <div class="order-card">
      <div class="order-header">
        <div>
          <div class="order-id">Order #${o._id.slice(-8).toUpperCase()}</div>
          <div class="order-date">${formatDate(o.createdAt)}</div>
        </div>
        <span class="status-badge status-${o.status}">${o.status}</span>
      </div>
      <div style="color:var(--text2);font-size:0.88rem;margin-bottom:0.8rem;">
        ${o.items.map(i => `${i.name} × ${i.quantity}`).join(' &nbsp;·&nbsp; ')}
      </div>
      <div style="display:flex;justify-content:space-between;align-items:center;">
        <div style="color:var(--text3);font-size:0.82rem;">
          📍 ${o.address.substring(0,60)}${o.address.length>60?'...':''}
        </div>
        <div class="order-total">₹${o.total.toLocaleString('en-IN')}</div>
      </div>
    </div>
  `).join('');
};