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
  el.innerHTML = `<section class="hero"><h1>Welcome</h1><p>Home template not found.</p></section>`;
  return el;
}

export function navigate(hash) {
  if (!hash.startsWith("#")) hash = `#${hash}`;
  window.location.hash = hash;
}

export function initRouter() {
  const app = document.getElementById("app");
  function render() {
    try {
      const hash = window.location.hash || "#home";
      const factory = routes[hash] || renderHome;
      const view = factory();
      app.innerHTML = "";
      app.appendChild(view);
    } catch (err) {
      console.error("Route render failed:", err);
      app.innerHTML = `
        <section class="view">
          <h2>We hit a snag loading this page.</h2>
          <p>${(err && err.message) ? err.message : String(err)}</p>
          <p><a href="#home">Go Home</a></p>
        </section>`;
    }
  }
  window.addEventListener("hashchange", render);
  render();
}
