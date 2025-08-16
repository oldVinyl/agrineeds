// js/ui/catalog.js
import { ce, toast } from "../utils/dom.js";
import { state, setState, subscribe } from "../state.js";
import * as api from "../api.js";
import { productCard } from "./productCard.js";

export function renderCatalogView() {
  const wrap = ce("section", { className: "view products" });
  wrap.innerHTML = `
    <div class="container">
      <div class="section-header">
        <h2>Our Products</h2>
        <p>Full catalog. (Dynamic data loaded from /mock/products.json in Phase 1)</p>
      </div>
      <div id="catalog-status" class="catalog-status">Loading products…</div>
      <div id="catalog-grid" class="product-grid"></div>
    </div>
  `;

  const grid = wrap.querySelector("#catalog-grid");
  const status = wrap.querySelector("#catalog-status");

  function paint(products) {
    grid.innerHTML = "";
    if (!products || products.length === 0) {
      status.textContent = "No products found.";
      return;
    }
    status.textContent = "";
    products.forEach(p => grid.appendChild(productCard(p)));
  }

  // keep it reactive if state changes
  const unsubscribe = subscribe(s => {
    paint(s.products);
  });

  // initial load (only if empty)
  (async () => {
    try {
      if (!state.products || state.products.length === 0) {
        const products = await api.getProducts();
        setState({ products });
      } else {
        paint(state.products);
      }
    } catch (err) {
      status.textContent = "Failed to load products.";
      toast("Could not load products.");
      console.error(err);
    }
  })();

  // clean up when view is replaced
  // (router is simple; this is defensive)
  wrap.addEventListener("DOMNodeRemoved", () => unsubscribe());

  return wrap;
}
