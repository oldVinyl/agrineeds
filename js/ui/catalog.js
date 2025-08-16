// js/ui/catalog.js
import { ce, toast } from "../utils/dom.js";
import { state, setState, subscribe } from "../state.js";
import * as api from "../api.js";
import { productCard } from "./productCard.js";

const PAGE_SIZE = 9;

export function renderCatalogView() {
  const wrap = ce("section", { className: "view products" });
  wrap.innerHTML = `
    <div class="container">
      <div class="section-header">
        <h2>Our Products</h2>
        <p>Browse all items. Use search & filters to find what you need.</p>
      </div>

      <!-- Controls -->
      <form id="catalog-controls" class="catalog-controls" autocomplete="off">
        <input id="q" type="search" placeholder="Search products…" aria-label="Search products" />
        <select id="cat" aria-label="Filter by category">
          <option value="">All categories</option>
        </select>
      </form>

      <div id="catalog-status" class="catalog-status">Loading products…</div>
      <div id="catalog-grid" class="product-grid"></div>

      <nav id="pager" class="pager" aria-label="Catalog pagination"></nav>
    </div>
  `;

  const grid = wrap.querySelector("#catalog-grid");
  const status = wrap.querySelector("#catalog-status");
  const qInput = wrap.querySelector("#q");
  const catSelect = wrap.querySelector("#cat");
  const pager = wrap.querySelector("#pager");

  // local UI state for this view (separate from global)
  let view = {
    q: "",
    cat: "",
    page: 1,
  };

  // derive categories from products
  function buildCategories(products) {
    const cats = Array.from(new Set((products || [])
      .map(p => (p.category || "").trim())
      .filter(Boolean)
    )).sort();
    catSelect.innerHTML = `<option value="">All categories</option>` +
      cats.map(c => `<option value="${c}">${c}</option>`).join("");
  }

  function applyFilters(products) {
    let rows = (products || []).filter(p => p.isActive !== false);
    const q = view.q.trim().toLowerCase();
    if (q) {
      rows = rows.filter(p =>
        (p.name || "").toLowerCase().includes(q) ||
        (p.description || "").toLowerCase().includes(q) ||
        (p.sku || "").toLowerCase().includes(q)
      );
    }
    if (view.cat) {
      rows = rows.filter(p => (p.category || "") === view.cat);
    }
    return rows;
  }

  function renderGrid(products) {
    const rows = applyFilters(products);
    const total = rows.length;

    // pagination math
    const pageCount = Math.max(1, Math.ceil(total / PAGE_SIZE));
    if (view.page > pageCount) view.page = pageCount;
    const start = (view.page - 1) * PAGE_SIZE;
    const pageRows = rows.slice(start, start + PAGE_SIZE);

    // paint grid
    grid.innerHTML = "";
    if (pageRows.length === 0) {
      status.textContent = (total === 0) ? "No products found." : "No items on this page.";
    } else {
      status.textContent = "";
      pageRows.forEach(p => grid.appendChild(productCard(p)));
    }

    // paint pager
    pager.innerHTML = "";
    if (pageCount > 1) {
      // Prev
      pager.appendChild(pagerBtn("‹ Prev", view.page > 1, () => {
        view.page -= 1; renderGrid(products); scrollToTop();
      }));
      // Numbers (compact)
      for (let i = 1; i <= pageCount; i++) {
        // show first, last, current, and neighbors
        if (i === 1 || i === pageCount || Math.abs(i - view.page) <= 1) {
          pager.appendChild(pagerBtn(String(i), true, () => {
            view.page = i; renderGrid(products); scrollToTop();
          }, i === view.page));
        } else if (i === 2 && view.page > 3) {
          pager.appendChild(ellipsis());
        } else if (i === pageCount - 1 && view.page < pageCount - 2) {
          pager.appendChild(ellipsis());
        }
      }
      // Next
      pager.appendChild(pagerBtn("Next ›", view.page < pageCount, () => {
        view.page += 1; renderGrid(products); scrollToTop();
      }));
    }
  }

  function pagerBtn(label, enabled, onClick, active = false) {
    const a = ce("button", {
      className: "page-btn" + (active ? " active" : ""),
      type: "button",
      disabled: !enabled,
      textContent: label
    });
    a.addEventListener("click", onClick);
    return a;
  }
  function ellipsis() {
    return ce("span", { className: "page-ellipsis", textContent: "…" });
  }
  function scrollToTop() {
    wrap.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  // react to global state
  const unsubscribe = subscribe(s => {
    // only rebuild categories once on first load
    if (catSelect.options.length <= 1 && s.products && s.products.length) {
      buildCategories(s.products);
    }
    renderGrid(s.products || []);
  });

  // wire controls
  qInput.addEventListener("input", (e) => {
    view.q = e.target.value;
    view.page = 1;
    renderGrid(state.products || []);
  });
  catSelect.addEventListener("change", (e) => {
    view.cat = e.target.value;
    view.page = 1;
    renderGrid(state.products || []);
  });

  // initial load
  (async () => {
    try {
      if (!state.products || state.products.length === 0) {
        const products = await api.getProducts();
        setState({ products });
      } else {
        renderGrid(state.products);
      }
    } catch (err) {
      status.textContent = "Failed to load products.";
      toast("Could not load products.");
      console.error(err);
    }
  })();

  // cleanup (defensive with simple router)
  wrap.addEventListener("DOMNodeRemoved", () => unsubscribe());

  return wrap;
}
