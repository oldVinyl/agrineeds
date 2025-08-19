// js/utils/validation.js

/** Basic checks */
export function isNonEmptyString(v) {
  return typeof v === "string" && v.trim().length > 0;
}
export function isPositiveInt(v) {
  return Number.isInteger(v) && v > 0;
}

/** Defensive helpers for inputs coming from form fields */
export function safeInt(v, fallback = 0) {
  const n = Number.parseInt(v, 10);
  return Number.isFinite(n) ? n : fallback;
}
export function nonNegativeInt(v, fallback = 0) {
  const n = safeInt(v, fallback);
  return n < 0 ? 0 : n;
}
export function sanitizeText(v, maxLen = 1000) {
  if (typeof v !== "string") return "";
  return v.replace(/\s+/g, " ").trim().slice(0, maxLen);
}

/** Stock validation (shared by customer + admin) */
export function validateStock({ currentStock, requestedQty }) {
  if (!Number.isInteger(currentStock) || currentStock < 0) {
    return { ok: false, reason: "Invalid stock value." };
  }
  if (!isPositiveInt(requestedQty)) {
    return { ok: false, reason: "Quantity must be a positive whole number." };
  }
  if (requestedQty > currentStock) {
    return { ok: false, reason: `Only ${currentStock} in stock.` };
  }
  return { ok: true };
}
