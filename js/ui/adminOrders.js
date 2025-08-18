// js/ui/adminOrders.js
import { ce, toast } from "../utils/dom.js";
import { state, setState, subscribe } from "../state.js";
import * as api from "../api.js";
import { resendNotification } from "../utils/notify.js";   // ← NEW

const STATUSES = ["PENDING", "CONFIRMED", "PACKED", "EN_ROUTE", "DELIVERED", "CANCELLED"];
const NEXT_STATUS = { PENDING: "CONFIRMED", CONFIRMED: "PACKED", PACKED: "EN_ROUTE", EN_ROUTE: "DELIVERED" };

export function renderAdminOrders() {
  const wrap = ce("div", { className: "admin-orders" });
  wrap.innerHTML = `
    <div class="section-header">
      <h3>Orders</h3>
      <p>Review and update order statuses.</p>
    </div>

    <form class="order-filters">
      <label>
        Status
        <select id="statusFilter">
          <option value="">All</option>
          ${STATUSES.map(s => `<option value="${s}">${s}</option>`).join("")}
        </select>
      </label>
    </form>

    <div class="table-wrap">
      <table class="table">
        <thead>
          <tr>
            <th>Created</th>
            <th>Customer</th>
            <th>Items</th>
            <th>Status</th>
            <th>Note</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody id="ordersTbody"></tbody>
      </table>
    </div>
  `;

  const tbody = wrap.querySelector("#ordersTbody");
  const statusFilter = wrap.querySelector("#statusFilter");

  function formatDate(iso) {
    if (!iso) return "-";
    try {
      const d = new Date(iso);
      return d.toLocaleString();
    } catch { return iso; }
  }

  function itemsSummary(items = []) {
    if (!items.length) return "-";
    return items.map(i => `${i.name} × ${i.qty}`).join(", ");
  }


  function row(o) {
    const tr = ce("tr");
    tr.innerHTML = `
      <td>${formatDate(o.createdAt)}</td>
      <td><div><strong>${o.customer?.name || "-"}</strong></div><div>${o.customer?.phone || ""}</div></td>
      <td>${itemsSummary(o.items)}</td>
      <td><strong>${o.status}</strong></td>
      <td>${o.note ? o.note : ""}</td>
      <td class="actions"></td>
    `;
    const actions = tr.querySelector(".actions");

    const next = NEXT_STATUS[o.status];
    if (next) {
      const advanceBtn = ce("button", { className: "btn", textContent: `Mark ${next}` });
      advanceBtn.addEventListener("click", async () => {
        try {
          const updated = await api.updateOrderStatus(o.id, next);
          await reloadOrders();
          toast(`Order → ${updated.status}`);
        } catch (e) { console.error(e); toast("Update failed."); }
      });
      actions.appendChild(advanceBtn);
    }

    if (o.status !== "DELIVERED" && o.status !== "CANCELLED") {
      const cancelBtn = ce("button", { className: "btn btn-light", textContent: "Cancel" });
      cancelBtn.addEventListener("click", async () => {
        if (!confirm("Cancel this order?")) return;
        try {
          await api.updateOrderStatus(o.id, "CANCELLED");
          await reloadOrders();
          toast("Order cancelled.");
        } catch (e) { console.error(e); toast("Cancel failed."); }
      });
      actions.appendChild(cancelBtn);
    }

    // centralized resend stub
    const resendBtn = ce("button", { className: "btn btn-light", textContent: "Resend notification" });
    resendBtn.addEventListener("click", async () => {
      try {
        const res = await resendNotification(o);
        if (res?.ok) toast("Notification resent (stub).");
        else toast("Failed to resend (stub).");
      } catch (e) { console.error(e); toast("Failed to resend (stub)."); }
    });
    actions.appendChild(resendBtn);

    return tr;
  }


  function applyFilter(list) {
    const sel = statusFilter.value;
    if (!sel) return list;
    return list.filter(o => o.status === sel);
  }

  async function reloadOrders() {
    const items = await api.getOrders();
    setState({ orders: items });
  }

  async function paint() {
    const rows = applyFilter(state.orders || []);
    tbody.innerHTML = "";
    rows.forEach(o => tbody.appendChild(row(o)));
  }

  statusFilter.addEventListener("change", paint);

  // on mount, ensure orders loaded
  (async () => {
    const needsLoad = !Array.isArray(state.orders) || state.orders.length === 0;
    if (needsLoad) {
      try { await reloadOrders(); } catch (e) { console.error(e); }
    } else {
      paint();
    }
  })();

  const unsub = subscribe(() => paint());
  wrap.addEventListener("DOMNodeRemoved", () => unsub && unsub());

  return wrap;
}
