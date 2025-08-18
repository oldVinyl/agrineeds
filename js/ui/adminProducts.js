// js/ui/adminProducts.js
import { ce, toast } from "../utils/dom.js";
import { state, setState } from "../state.js";
import * as api from "../api.js";

export function renderAdminProducts() {
  const wrap = ce("div", { className: "admin-products" });
  wrap.innerHTML = `
    <div class="section-header">
      <h3>Products</h3>
      <p>Create, edit, delete, and manage stock.</p>
    </div>

    <div class="admin-products-grid">
      <section>
        <h4 id="formTitle">Add Product</h4>
        <form id="prodForm" class="admin-form" autocomplete="off">
          <input type="hidden" id="prodId" />
          <div class="form-row">
            <label for="name">Name</label>
            <input id="name" required placeholder="Urea (50kg)" />
          </div>
          <div class="form-row">
            <label for="sku">SKU</label>
            <input id="sku" placeholder="AGR-URE-50" />
          </div>
          <div class="form-row">
            <label for="category">Category</label>
            <input id="category" placeholder="Fertilizers" />
          </div>
          <div class="form-row">
            <label for="priceCents">Price (GHS × 100)</label>
            <input id="priceCents" type="number" min="0" step="1" required placeholder="120000" />
          </div>
          <div class="form-row">
            <label for="stock">Stock</label>
            <input id="stock" type="number" min="0" step="1" required placeholder="10" />
          </div>
          <div class="form-row">
            <label for="imageUrl">Image URL</label>
            <input id="imageUrl" type="url" placeholder="https://…" />
          </div>
          <div class="form-row">
            <label for="description">Description</label>
            <textarea id="description" rows="3" placeholder="Short description…"></textarea>
          </div>
          <div class="form-row">
            <label for="isActive">Active</label>
            <select id="isActive">
              <option value="true" selected>Yes</option>
              <option value="false">No</option>
            </select>
          </div>
          <div class="form-actions">
            <button class="btn" type="submit">Save</button>
            <button class="btn btn-light" type="button" id="resetForm">Reset</button>
          </div>
        </form>
      </section>

      <section>
        <h4>All Products</h4>
        <div class="table-wrap">
          <table class="table">
            <thead>
              <tr>
                <th>Name</th><th>SKU</th><th>Category</th>
                <th>Price</th><th>Stock</th><th>Active</th><th>Actions</th>
              </tr>
            </thead>
            <tbody id="prodTbody"></tbody>
          </table>
        </div>
      </section>
    </div>
  `;

  const form = wrap.querySelector("#prodForm");
  const formTitle = wrap.querySelector("#formTitle");
  const resetBtn = wrap.querySelector("#resetForm");
  const tbody = wrap.querySelector("#prodTbody");

  function asBool(v) { return String(v) === "true"; }
  function getFormData() {
    return {
      name: form.name.value.trim(),
      sku: form.sku.value.trim(),
      category: form.category.value.trim(),
      priceCents: Number(form.priceCents.value || 0),
      stock: Number(form.stock.value || 0),
      imageUrl: form.imageUrl.value.trim(),
      description: form.description.value.trim(),
      isActive: asBool(form.isActive.value),
    };
  }
  function setFormData(p = {}) {
    form.prodId.value = p.id || "";
    form.name.value = p.name || "";
    form.sku.value = p.sku || "";
    form.category.value = p.category || "";
    form.priceCents.value = typeof p.priceCents === "number" ? p.priceCents : "";
    form.stock.value = typeof p.stock === "number" ? p.stock : "";
    form.imageUrl.value = p.imageUrl || "";
    form.description.value = p.description || "";
    form.isActive.value = String(p.isActive !== false);
    formTitle.textContent = p.id ? "Edit Product" : "Add Product";
  }
  function resetForm() { setFormData({}); }

  async function reloadProducts() {
    const items = await api.getProducts();
    setState({ products: items });
  }

  function row(p) {
    const tr = ce("tr");
    tr.innerHTML = `
      <td>${p.name || "-"}</td>
      <td>${p.sku || "-"}</td>
      <td>${p.category || "-"}</td>
      <td>${typeof p.priceCents === "number" ? (p.priceCents/100).toFixed(2) : "-"}</td>
      <td>${typeof p.stock === "number" ? p.stock : "-"}</td>
      <td>${p.isActive === false ? "No" : "Yes"}</td>
      <td class="actions"></td>
    `;
    const actions = tr.querySelector(".actions");

    // Edit
    const editBtn = ce("button", { className: "btn", textContent: "Edit" });
    editBtn.addEventListener("click", () => setFormData(p));

    // Delete
    const delBtn = ce("button", { className: "btn btn-light", textContent: "Delete" });
    delBtn.addEventListener("click", async () => {
      if (!confirm("Delete this product?")) return;
      try {
        await api.deleteProduct(p.id);
        toast("Product deleted.");
        await reloadProducts();
      } catch (e) {
        console.error(e);
        toast("Delete failed.");
      }
    });

    // Stock +
    const incBtn = ce("button", { className: "btn btn-light", textContent: "+ Stock" });
    incBtn.addEventListener("click", async () => {
      try {
        await api.updateProduct(p.id, { stock: (p.stock || 0) + 1 });
        await reloadProducts();
      } catch (e) { console.error(e); toast("Update failed."); }
    });

    // Stock -
    const decBtn = ce("button", { className: "btn btn-light", textContent: "− Stock" });
    decBtn.addEventListener("click", async () => {
      const next = Math.max(0, (p.stock || 0) - 1);
      try {
        await api.updateProduct(p.id, { stock: next });
        await reloadProducts();
      } catch (e) { console.error(e); toast("Update failed."); }
    });

    // Toggle Active
    const toggleBtn = ce("button", { className: "btn btn-light", textContent: p.isActive === false ? "Activate" : "Deactivate" });
    toggleBtn.addEventListener("click", async () => {
      try {
        await api.updateProduct(p.id, { isActive: !(p.isActive === false) ? false : true });
        await reloadProducts();
      } catch (e) { console.error(e); toast("Toggle failed."); }
    });

    actions.append(editBtn, delBtn, incBtn, decBtn, toggleBtn);
    return tr;
  }

  async function paint() {
    const products = state.products || [];
    tbody.innerHTML = "";
    products.forEach(p => tbody.appendChild(row(p)));
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const id = form.prodId.value;
    const payload = getFormData();
    if (!payload.name) return toast("Name is required");
    if (payload.priceCents < 0 || payload.stock < 0) return toast("Price/stock cannot be negative");

    try {
      if (id) {
        await api.updateProduct(id, payload);
        toast("Product updated.");
      } else {
        await api.createProduct(payload);
        toast("Product created.");
      }
      resetForm();
      await reloadProducts();
    } catch (err) {
      console.error(err);
      toast("Save failed.");
    }
  });

  resetBtn.addEventListener("click", (e) => {
    e.preventDefault();
    resetForm();
  });

  // initial mount
  (async () => {
    if (!state.products || state.products.length === 0) {
      await reloadProducts();
    } else {
      await paint();
    }
  })();

  // repaint when products change
  const unsub = subscribe(() => {
    paint();
  });


  // clean up
  wrap.addEventListener("DOMNodeRemoved", () => unsub && unsub());

  return wrap;
}
