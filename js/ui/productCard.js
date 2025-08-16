// js/ui/productCard.js
import { ce } from "../utils/dom.js";
import { formatGHS } from "../utils/money.js";

export function productCard(p) {
  const card = ce("article", { className: "product-card" });
  card.innerHTML = `
    <div class="product-thumb"><img src="${p.imageUrl || ""}" alt="${p.name || ""}" /></div>
    <h3>${p.name || "Unnamed product"}</h3>
    <p class="price">${formatGHS(p.priceCents || 0)}</p>
    <p class="stock">${typeof p.stock === "number" ? `Stock: ${p.stock}` : ""}</p>
    <button class="btn">Details</button>
  `;
  return card;
}
