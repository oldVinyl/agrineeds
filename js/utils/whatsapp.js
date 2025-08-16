// js/utils/whatsapp.js
export function buildProductMessage({ name, priceCents }, qty = 1) {
  const price = (priceCents / 100).toFixed(2);
  return `Hello! I'm interested in "${name}" (qty: ${qty}) — approx GHS ${price}.`;
}
export function buildWhatsappLink(message, phone = "") {
  const text = encodeURIComponent(message);
  const base = phone ? `https://wa.me/${phone}` : "https://wa.me/";
  return `${base}?text=${text}`;
}
