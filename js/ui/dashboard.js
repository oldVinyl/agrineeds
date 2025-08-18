// js/ui/dashboard.js
import { ce } from "../utils/dom.js";
import { state } from "../state.js";

export function renderDashboard() {
  const totalProducts = (state.products || []).length;
  const totalOrders = (state.orders || []).length;
  const pendingOrders = (state.orders || []).filter(o => o.status === "PENDING").length;

  const wrap = ce("div", { className: "dashboard" });
  wrap.innerHTML = `
    <div class="section-header">
      <h3>Overview</h3>
      <p>Key metrics for your store.</p>
    </div>
    <div class="cards">
      <div class="card"><div class="kpi">${totalProducts}</div><div class="label">Total Products</div></div>
      <div class="card"><div class="kpi">${totalOrders}</div><div class="label">Total Orders</div></div>
      <div class="card"><div class="kpi">${pendingOrders}</div><div class="label">Pending Orders</div></div>
    </div>
  `;
  return wrap;
}
