// js/ui/admin.js
import { ce } from "../utils/dom.js";

export function renderAdminView() {
  const wrap = ce("section", { className: "view admin" });
  wrap.innerHTML = `
    <div class="container">
      <div class="section-header">
        <h2>Admin</h2>
        <p>Login + Products + Orders will appear here in later phases.</p>
      </div>

      <div class="admin-placeholder">
        <ul>
          <li>Products (CRUD)</li>
          <li>Orders (status updates)</li>
          <li>Dashboard (totals)</li>
        </ul>
      </div>
    </div>
  `;
  return wrap;
}
