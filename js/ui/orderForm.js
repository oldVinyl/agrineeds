// js/ui/orderForm.js
import { ce, toast } from "../utils/dom.js";
import { state, setState, subscribe } from "../state.js";
import * as api from "../api.js";
import { isNonEmptyString, safeInt } from "../utils/validation.js";
import { buildProductMessage, buildWhatsappLink } from "../utils/whatsapp.js";
import { confirmOrder } from "../utils/order.js";

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
  
  // Make inline errors announced by screen readers
  form.querySelectorAll(".err").forEach(el => {
    el.setAttribute("role", "alert");
    el.setAttribute("aria-live", "polite");
  });

  const sel = form.querySelector("#productId");
  const qtyEl = form.querySelector("#qty");
  const nameEl = form.querySelector("#custName");
  const phoneEl = form.querySelector("#custPhone");
  const noteEl = form.querySelector("#note");
  const waPreviewBtn = wrap.querySelector("#waPreview");

  function showErr(input, msg) {
    const id = input.getAttribute("id");
    const el = form.querySelector(`.err[data-for="${id}"]`);
    if (el) el.textContent = msg || "";
  }

  function clearErrs() {
    form.querySelectorAll(".err").forEach(e => (e.textContent = ""));
  }

  function validateBasic() {
    let ok = true;
    if (!isNonEmptyString(nameEl.value)) { showErr(nameEl, "Please enter your name."); ok = false; }
    else showErr(nameEl, "");
    if (!isNonEmptyString(phoneEl.value)) { showErr(phoneEl, "Please enter your WhatsApp number."); ok = false; }
    else showErr(phoneEl, "");
    if (!isNonEmptyString(sel.value)) { showErr(sel, "Please select a product."); ok = false; }
    else showErr(sel, "");
    const qty = safeInt(qtyEl.value, 0);
    if (!(qty >= 1)) { showErr(qtyEl, "Quantity must be a positive whole number."); ok = false; }
    else showErr(qtyEl, "");
    return ok;
  }

  function paintProducts(products) {
    sel.innerHTML = `<option value="">Select a product</option>` +
      (products || []).filter(p => p.isActive !== false)
        .map(p => `<option value="${p.id}">${p.name}</option>`).join("");
    if (state.selectedProductId) {
      sel.value = state.selectedProductId;
      setState({ selectedProductId: null });
    }
  }

  const unsub = subscribe(s => {
    if (sel.options.length <= 1 && s.products?.length) paintProducts(s.products);
  });

  (async () => {
    if (!state.products?.length) {
      try { setState({ products: await api.getProducts() }); }
      catch (e) { console.error(e); }
    } else paintProducts(state.products);
  })();

  async function submitOrder(openWhatsappAfter = true) {
    clearErrs();
    if (!validateBasic()) return;

    const product = (state.products || []).find(p => p.id === sel.value);
    const qty = safeInt(qtyEl.value, 0);
    const check = confirmOrder(product, qty, noteEl.value);
    if (!check.ok) {
      if (check.reason?.toLowerCase().includes("stock")) showErr(qtyEl, check.reason);
      toast(check.reason || "Could not confirm order.");
      return;
    }

    // enrich with customer
    const payload = {
      ...check.payload,
      customer: { name: nameEl.value.trim(), phone: phoneEl.value.trim() }
    };

    try {
      const created = await api.createOrder(payload);
      // Update state so dashboard/orders refresh
      const current = Array.isArray(state.orders) ? state.orders : [];
      setState({ orders: [created, ...current] });

      toast("Order received. We’ll confirm shortly.");

      if (openWhatsappAfter) {
        const msg = buildProductMessage(product, qty) + (payload.note ? `\n\nNote: ${payload.note}` : "");
        const link = buildWhatsappLink(msg);
        try {
          const win = window.open(link, "_blank", "noopener");
          if (!win) throw new Error("Popup blocked");
        } catch {
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
      console.error(e);
      toast("Could not submit order. Please try again.");
    }
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    submitOrder(true);
  });

  waPreviewBtn.addEventListener("click", (e) => {
    e.preventDefault();
    if (!validateBasic()) return;
    const product = state.products.find(p => p.id === sel.value);
    const qty = safeInt(qtyEl.value, 0);
    const msg = buildProductMessage(product, qty) + (noteEl.value.trim() ? `\n\nNote: ${noteEl.value.trim()}` : "");
    const link = buildWhatsappLink(msg);
    window.open(link, "_blank", "noopener");
  });

  wrap.addEventListener("DOMNodeRemoved", () => unsub && unsub());
  return wrap;
}
