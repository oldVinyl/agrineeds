// js/utils/order.js
import { validateStock, sanitizeText, nonNegativeInt } from "./validation.js";

/**
 * confirmOrder(product, qty, note)
 * - validates stock & fields
 * - normalizes payload the backend expects
 */
export function confirmOrder(product, qty, note = "") {
  if (!product || !product.id) {
    return { ok: false, reason: "Please select a valid product." };
  }
  const q = nonNegativeInt(qty, 0);
  const stockCheck = validateStock({ currentStock: product.stock ?? 0, requestedQty: q });
  if (!stockCheck.ok) return stockCheck;

  const payload = {
    items: [{
      productId: product.id,
      name: product.name,
      priceCents: product.priceCents || 0,
      qty: q,
    }],
    note: sanitizeText(note, 500),
    status: "PENDING",
  };
  return { ok: true, payload };
}
