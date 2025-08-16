// js/ui/catalog.js
import { ce } from "../utils/dom.js";

export function renderCatalogView() {
  // reuse your 'products' styling so the page looks native
  const wrap = ce("section", { className: "view products" });
  wrap.innerHTML = `
    <div class="container">
      <div class="section-header">
        <h2>Our Products</h2>
        <p>Full catalog. (Becomes dynamic in Phase 1)</p>
      </div>

      <!-- grid that will be populated next phase -->
      <div id="catalog-grid" class="product-grid"></div>
    </div>
  `;
  return wrap;
}
