// js/ui/productCard.js
import { ce } from "../utils/dom.js";
import { formatGHS } from "../utils/money.js";
import { buildProductMessage, buildWhatsappLink } from "../utils/whatsapp.js";

export function productCard(p) {
  const out = typeof p.stock === "number" && p.stock <= 0;

  const card = ce("article", { className: "product-card" });
  const thumb = ce("div", { className: "product-thumb" });
  const img = ce("img", {
    src: p.imageUrl || "",
    alt: p.name || "Product image",
    loading: "lazy",
  });
  thumb.append(img);

  const title = ce("h3", { textContent: p.name || "Unnamed product" });
  const price = ce("p", { className: "price", textContent: formatGHS(p.priceCents || 0) });
  const stock = ce("p", {
    className: "stock" + (out ? " oos" : ""),
    textContent: out ? "Out of stock" : `Stock: ${p.stock ?? "-"}`,
  });
  const desc = ce("p", { className: "desc", textContent: p.description || "" });

  const actions = ce("div", { className: "card-actions" });
  const waBtn = ce("a", {
    className: "btn wa-btn" + (out ? " disabled" : ""),
    role: "button",
    href: "#",
    textContent: out ? "Unavailable" : "WhatsApp",
    onclick: (e) => {
      e.preventDefault();
      if (out) return;
      const msg = buildProductMessage(p, 1);
      const link = buildWhatsappLink(msg);
      window.open(link, "_blank", "noopener");
    }
  });

  actions.append(waBtn);
  card.append(thumb, title, price, stock, desc, actions);
  
  // Order button → preselect product and navigate to #order
  const orderBtn = ce("a", {
    className: "btn",
    href: "#",
    textContent: "Order",
    onclick: (e) => {
      e.preventDefault();
      if (out) return;
      // put selected product into state for the form to preselect
      if (window.app?.state) {
        window.app.state.selectedProductId = p.id;
      }
      if (window.app?.navigate) window.app.navigate("#order");
      else window.location.hash = "#order";
    }
  });
  actions.append(orderBtn);
  
  return card;
}
