// js/main.js
import { initRouter, navigate } from "./router.js";
import { state } from "./state.js";
import * as api from "./api.js";

(function boot() {
  document.getElementById("year").textContent = new Date().getFullYear();

  // expose for later backend switch (just change window.API_BASE_URL)
  window.API_BASE_URL = window.API_BASE_URL || "/mock";

  // keep a reference if needed elsewhere
  window.app = { state, api, navigate };

  initRouter();
})();

// ====== mobile nav toggle (append-only) ======
(function mobileNav() {
  const toggle = document.querySelector(".nav-toggle");
  const links = document.querySelector(".nav-links");
  if (!toggle || !links) return;

  function setOpen(open) {
    links.classList.toggle("show", open);
    toggle.setAttribute("aria-expanded", String(open));
  }

  toggle.addEventListener("click", () => {
    const isOpen = links.classList.contains("show");
    setOpen(!isOpen);
  });

  // close when a link is clicked
  links.addEventListener("click", (e) => {
    if (e.target.tagName === "A") setOpen(false);
  });

  // close when route changes
  window.addEventListener("hashchange", () => setOpen(false));

  // close when clicking outside
  document.addEventListener("click", (e) => {
    const withinNav = e.target.closest(".nav");
    if (!withinNav) setOpen(false);
  });
})();

// restore persisted auth if present
try {
  const raw = localStorage.getItem("auth");
  if (raw) {
    const parsed = JSON.parse(raw);
    if (parsed?.token) {
      import("./state.js").then(({ setState }) => setState({ auth: parsed }));
    }
  }
} catch {}



