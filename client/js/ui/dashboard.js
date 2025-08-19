// js/ui/dashboard.js
import { ce } from "../utils/dom.js";
import { state, setState } from "../state.js";
import * as api from "../api.js";

function countBy(arr, keyFn) {
  return (arr || []).reduce((acc, x) => {
    const k = keyFn(x);
    acc[k] = (acc[k] || 0) + 1;
    return acc;
  }, {});
}

function ghstime(iso) {
  if (!iso) return "-";
  try { return new Date(iso).toLocaleString(); } catch { return iso; }
}

export function renderDashboard() {
  const wrap = ce("div", { className: "dashboard" });

  const products = state.products || [];
  const orders = state.orders || [];

  const totalProducts = products.length;
  const activeProducts = products.filter(p => p.isActive !== false).length;
  const oos = products.filter(p => typeof p.stock === "number" && p.stock <= 0);
  const low = products
    .filter(p => typeof p.stock === "number" && p.stock > 0 && p.stock <= 5)
    .sort((a,b) => a.stock - b.stock)
    .slice(0, 5);

  const totalOrders = orders.length;
  const statusCounts = countBy(orders, o => o.status || "UNKNOWN");
  const pendingOrders = statusCounts["PENDING"] || 0;

  // category distribution (top 4)
  const catCounts = countBy(products, p => p.category || "Uncategorized");
  const topCats = Object.entries(catCounts)
    .sort((a,b) => b[1]-a[1])
    .slice(0,4);

  // recent orders (last 5)
  const recent = [...orders]
    .sort((a,b) => new Date(b.createdAt||0) - new Date(a.createdAt||0))
    .slice(0,5);

  wrap.innerHTML = `
    <div class="section-header">
      <h3>Overview</h3>
      <p>Key metrics for your store (auto-updates from current data).</p>
    </div>

    <div class="cards">
      <div class="card"><div class="kpi">${activeProducts}/${totalProducts}</div><div class="label">Active / All Products</div></div>
      <div class="card"><div class="kpi">${oos.length}</div><div class="label">Out of Stock</div></div>
      <div class="card"><div class="kpi">${pendingOrders}/${totalOrders}</div><div class="label">Pending / All Orders</div></div>
    </div>

    <div class="dash-grid">
      <section class="panel">
        <h4>Low Stock (≤5)</h4>
        ${low.length === 0 ? `<p class="muted">No low-stock items.</p>` : `
          <ul class="list">
            ${low.map(p => `<li><strong>${p.name}</strong> — Stock: ${p.stock}</li>`).join("")}
          </ul>
        `}
      </section>

      <section class="panel">
        <h4>By Status</h4>
        <ul class="list">
          ${["PENDING","CONFIRMED","PACKED","EN_ROUTE","DELIVERED","CANCELLED"]
            .map(s => `<li><strong>${s}:</strong> ${statusCounts[s] || 0}</li>`).join("")}
        </ul>
      </section>

      <section class="panel">
        <h4>Top Categories</h4>
        ${topCats.length === 0 ? `<p class="muted">No categories yet.</p>` : `
          <ul class="list">
            ${topCats.map(([c,n]) => `<li><strong>${c}:</strong> ${n}</li>`).join("")}
          </ul>
        `}
      </section>
    </div>

    <section class="panel">
      <h4>Recent Orders</h4>
      <div class="table-wrap">
        <table class="table">
          <thead>
            <tr><th>Created</th><th>Customer</th><th>Items</th><th>Status</th></tr>
          </thead>
          <tbody>
            ${recent.length === 0 ? `
              <tr><td colspan="4" class="muted">No orders yet.</td></tr>
            ` : recent.map(o => `
              <tr>
                <td>${ghstime(o.createdAt)}</td>
                <td>${o.customer?.name || "-"}<br><small>${o.customer?.phone || ""}</small></td>
                <td>${(o.items||[]).map(i => `${i.name} × ${i.qty}`).join(", ")}</td>
                <td><strong>${o.status || "-"}</strong></td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      </div>
    </section>
  `;

  // ensure data exists at least once (mock)
  (async () => {
    try {
      if (!products.length) {
        const ps = await api.getProducts();
        setState({ products: ps });
      }
      if (!orders.length) {
        const os = await api.getOrders();
        setState({ orders: os });
      }
    } catch {}
  })();

  return wrap;
}