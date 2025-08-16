// js/ui/catalog.js
import { ce } from "../utils/dom.js";

export function renderCatalogView() {
  const wrap = ce("section", { className: "view catalog" });
  wrap.innerHTML = `
    <h2>Our Products</h2>
    <p>Catalog is getting ready… (Phase 1 will load dynamic products)</p>
    <p><em>Next:</em> search, filter, pagination, prices, and per-product WhatsApp.</p>
  `;
  return wrap;
}
