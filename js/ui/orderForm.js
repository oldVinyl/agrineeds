// js/ui/orderForm.js
import { ce, toast } from "../utils/dom.js";
import { state, setState, subscribe } from "../state.js";
import * as api from "../api.js";
import { isNonEmptyString, isPositiveInt } from "../utils/validation.js";
import { buildProductMessage, buildWhatsappLink } from "../utils/whatsapp.js";

export function renderOrderFormView() {
  const wrap = ce("section", { className: "view order" });
  wrap.innerHTML = `
    <div class="container">
      <div class="section-header">
        <h2>Place an Order</h2>
        <p>Fill in your details and we’ll confirm availability.</p>
      </div>

      <form id="order-form" class="order-form" novalidate>
        <div class="form-row">
          <label for="custName">Your Name</label>
          <input id="custName" name="custName" type="text" required placeholder="e.g., Ama Mensah" />
          <small class="err" data-for="custName"></small>
        </div>

        <div class="form-row">
          <label for="custPhone">Phone (WhatsApp)</label>
          <input id="custPhone" name="custPhone" type="tel" required placeholder="+233..." />
          <small class="err" data-for="custPhone"></small>
        </div>

        <div class="form-row">
          <label for="productId">Product</label>
          <select id="productId" name="productId" required></select>
          <small class="err" data-for="productId"></small>
        </div>

        <div class="form-row">
          <label for="qty">Quantity</label>
          <input id="qty" name="qty" type="number" min="1" step="1" required value="1" />
          <small class="err" data-for="qty"></small>
        </div>

        <div class="form-row">
          <label for="note">Note (optional)</label>
          <textarea id="note" name="note" rows="3" placeholder="Any delivery notes or questions?"></textarea>
        </div>

        <div class="form-actions">
          <button class="btn" type="submit">Submit Order</button>
          <button class="btn btn-light" type="button" id="waPreview">WhatsApp Preview</button>
        </div>
      </form>

      <p class="order-help">
        We’ll try to open WhatsApp after submitting. If it fails, we’ll copy your order message so you can paste it manually.
      </p>
    </div>
  `;

  const form = wrap.querySelector("#order-form");
  const sel = form.querySelector("#productId");
  const qtyEl = form.querySelector("#qty");
  const nameEl = form.querySelector("#custName");
  const phoneEl = form.querySelector("#custPhone");
  const noteEl = form.querySelector("#note");
  const waPreviewBtn = wrap.querySelector("#waPreview");

  // populate product dropdown
  function paintProducts(products) {
    sel.innerHTML = `<option value="">Select a product</option>` +
      (products || []).filter(p => p.isActive !== false)
        .map(p => `<option value="${p.id}">${p.name}</option>`)
        .join("");
    // preselect if coming from product card
    if (state.selectedProductId) {
      sel.value = state.selectedProductId;
      setState({ selectedProductId: null });
    }
  }

  const unsub = subscribe(s => {
    if (sel.options.length <= 1 && s.products && s.products.length) {
      paintProducts(s.products);
    }
  });

  (async () => {
    if (!state.products || state.products.length === 0) {
      try {
        const products = await api.getProducts();
        setState({ products });
      } catch (e) {
        toast("Could not load products for order form.");
        console.error(e);
      }
    } else {
      paintProducts(state.products);
    }
  })();

  function showErr(input, msg) {
    const id = input.getAttribute("id");
    const el = form.querySelector(`.err[data-for="${id}"]`);
    if (el) el.textContent = msg || "";
  }

  function validate() {
    let ok = true;

    if (!isNonEmptyString(nameEl.value)) {
      showErr(nameEl, "Please enter your name.");
      ok = false;
    } else showErr(nameEl, "");

    // simple phone presence check; we can add a stricter regex later
    if (!isNonEmptyString(phoneEl.value)) {
      showErr(phoneEl, "Please enter your WhatsApp number.");
      ok = false;
    } else showErr(phoneEl, "");

    if (!isNonEmptyString(sel.value)) {
      showErr(sel, "Please select a product.");
      ok = false;
    } else showErr(sel, "");

    const qty = parseInt(qtyEl.value, 10);
    if (!isPositiveInt(qty)) {
      showErr(qtyEl, "Quantity must be a positive whole number.");
      ok = false;
    } else showErr(qtyEl, "");

    // stock check if we have product
    const product = (state.products || []).find(p => p.id === sel.value);
    if (product && typeof product.stock === "number" && qty > product.stock) {
      showErr(qtyEl, `Only ${product.stock} in stock.`);
      ok = false;
    }

    return ok;
  }

  async function submitOrder(openWhatsappAfter = true) {
    if (!validate()) return;

    const product = state.products.find(p => p.id === sel.value);
    const payload = {
      items: [{ productId: product.id, name: product.name, priceCents: product.priceCents, qty: parseInt(qtyEl.value, 10) }],
      customer: { name: nameEl.value.trim(), phone: phoneEl.value.trim() },
      note: noteEl.value.trim(),
      status: "PENDING",
    };

    try {
      const created = await api.createOrder(payload);
      
      // remember order in state so dashboard metrics update
      const current = Array.isArray(state.orders) ? state.orders : [];
      setState({ orders: [...current, created] });

      toast("Order received. We’ll confirm shortly.");

      if (openWhatsappAfter) {
        const msg = buildProductMessage(product, payload.items[0].qty) + (payload.note ? `\n\nNote: ${payload.note}` : "");
        const link = buildWhatsappLink(msg);
        try {
          const win = window.open(link, "_blank", "noopener");
          if (!win) throw new Error("Popup blocked");
        } catch {
          // fallback: try web WhatsApp, then copy
          try {
            const web = window.open(`https://web.whatsapp.com/send?text=${encodeURIComponent(msg)}`, "_blank", "noopener");
            if (!web) throw new Error("Popup blocked");
          } catch {
            await navigator.clipboard?.writeText(msg);
            toast("WhatsApp blocked. Message copied to clipboard.");
          }
        }
      }
      form.reset();
    } catch (e) {
      toast("Could not submit order. Please try again.");
      console.error(e);
    }
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    submitOrder(true);
  });

  waPreviewBtn.addEventListener("click", (e) => {
    e.preventDefault();
    if (!validate()) return;
    const product = state.products.find(p => p.id === sel.value);
    const msg = buildProductMessage(product, parseInt(qtyEl.value, 10)) + (noteEl.value.trim() ? `\n\nNote: ${noteEl.value.trim()}` : "");
    const link = buildWhatsappLink(msg);
    window.open(link, "_blank", "noopener");
  });

  // clean up (defensive)
  wrap.addEventListener("DOMNodeRemoved", () => unsub());

  return wrap;
}
