// js/utils/whatsapp.js

// ✏️ set your business WhatsApp number here (or leave blank to open the generic wa.me screen)
export const SHOP_PHONE = "233203774464"; // e.g., "2335XXXXXXX" (no +)

export function buildProductMessage({ name, priceCents, sku }, qty = 1) {
  const price = ((priceCents || 0) / 100).toFixed(2);
  const parts = [
    `Hello! I'd like to order:`,
    `• ${name || "Product"}${sku ? ` (SKU: ${sku})` : ""}`,
    `• Qty: ${qty}`,
    `• Approx total: GHS ${(qty * (priceCents || 0) / 100).toFixed(2)}`,
    ``,
    `Please confirm availability. Thank you!`
  ];
  return parts.join("\n");
}

export function buildWhatsappLink(message, phone = SHOP_PHONE) {
  const text = encodeURIComponent(message);
  const base = phone ? `https://wa.me/${phone}` : "https://wa.me/";
  return `${base}?text=${text}`;
}
