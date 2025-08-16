// js/ui/productCard.js
import { ce } from "../utils/dom.js";
import { formatGHS } from "../utils/money.js";

export function productCard(p) {
  const card = ce("article", { className: "product-card" });

  const img = ce("img", {
    src: p.imageUrl || "",
    alt: p.name || "Product image",
    loading: "lazy"
  });

  const badge = (typeof p.stock === "number") ? (p.stock > 0 ? `Stock: ${p.stock}` : `Stock: 0`) : "";

  card.innerHTML = `
    <div class="product-thumb"></div>
    <h3>${p.name || "Unnamed product"}</h3>
    <p class="price">${formatGHS(p.priceCents || 0)}</p>
    <p class="stock">${badge}</p>
    <p class="desc">${p.description || ""}</p>
  `;
  card.querySelector(".product-thumb").append(img);
  return card;
}
