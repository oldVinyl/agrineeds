// js/router.js
import { renderCatalogView } from "./ui/catalog.js";
import { renderAdminView } from "./ui/admin.js";
import { renderOrderFormView } from "./ui/orderForm.js";

const routes = {
  "#home": renderHome,
  "#catalog": renderCatalogView,
  "#admin": renderAdminView,
  "#order": renderOrderFormView,
};

function renderHome() {
  const tpl = document.getElementById("home-template");
  if (tpl && tpl.content) return tpl.content.cloneNode(true);
  const el = document.createElement("div");
  el.className = "view home";
  el.innerHTML = `<section class="hero"><h1>Welcome</h1></section>`;
  return el;
}

export function navigate(hash) {
  if (!hash.startsWith("#")) hash = `#${hash}`;
  window.location.hash = hash;
}

export function initRouter() {
  const app = document.getElementById("app");
  function render() {
    const hash = window.location.hash || "#home";
    const view = (routes[hash] || renderHome)();
    app.innerHTML = "";
    app.appendChild(view);
  }
  window.addEventListener("hashchange", render);
  render();
}
