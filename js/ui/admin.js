// js/ui/admin.js
import { ce } from "../utils/dom.js";

export function renderAdminView() {
  const wrap = ce("section", { className: "view admin" });
  wrap.innerHTML = `
    <h2>Admin Area</h2>
    <p>Admin shell is scaffolded. We’ll add login and tabs in Phase 4.</p>
  `;
  return wrap;
}
