// js/router.js
import { renderCatalogView } from "./ui/catalog.js";
import { renderAdminView } from "./ui/admin.js";

const routes = {
  "#home": renderHome,
  "#catalog": renderCatalogView,
  "#admin": renderAdminView,
};

function renderHome() {
  const el = document.createElement("div");
  el.className = "view home";
  el.innerHTML = `
    <section class="hero">
      <h1>Welcome to Agrineeds Agro Service</h1>
      <p>Your one-stop shop for fertilizers, pesticides, and farm tools.</p>
      <p><a href="#catalog" class="btn">Browse Products</a></p>
    </section>
  `;
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
  render(); // first paint
}
