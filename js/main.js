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

// highlight active nav link
(function navActiveHighlight() {
  const links = document.querySelectorAll(".nav-links a");
  function updateActive() {
    const hash = window.location.hash || "#home";
    links.forEach(link => {
      link.classList.toggle("active", link.getAttribute("href") === hash);
    });
  }
  window.addEventListener("hashchange", updateActive);
  updateActive(); // run on load
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

  links.addEventListener("click", (e) => {
    if (e.target.tagName === "A") setOpen(false);
  });
  window.addEventListener("hashchange", () => setOpen(false));
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

// ====== error overlay (append-only) ======
(function errorOverlay(){
  function show(msg){
    const box = document.createElement("div");
    Object.assign(box.style, {
      position: "fixed", left: "12px", bottom: "12px",
      maxWidth: "90vw",
      background: "#fff3f3", color: "#b00020",
      border: "1px solid #ffcdd2", borderRadius: "10px",
      padding: "10px 14px", zIndex: 99999, fontFamily: "ui-sans-serif, system-ui",
      boxShadow: "0 8px 22px rgba(0,0,0,0.15)", whiteSpace: "pre-wrap"
    });
    box.textContent = "App error: " + msg;
    document.body.appendChild(box);
    setTimeout(()=> box.remove(), 8000);
  }
  window.addEventListener("error", e => show(e.message || String(e.error||e)));
  window.addEventListener("unhandledrejection", e => show(e.reason?.message || String(e.reason||e)));
})();

// ====== a11y: focus & esc for mobile nav (append-only) ======
(function navA11y() {
  const toggle = document.querySelector(".nav-toggle");
  const linksWrap = document.querySelector(".nav-links");
  if (!toggle || !linksWrap) return;

  function isOpen() { return linksWrap.classList.contains("show"); }
  function firstLink() { return linksWrap.querySelector("a"); }

  // When opening, move focus to first link; on Esc, close and return focus to button
  document.addEventListener("keydown", (e) => {
    if (!isOpen()) return;
    if (e.key === "Escape") {
      linksWrap.classList.remove("show");
      toggle.setAttribute("aria-expanded", "false");
      toggle.focus();
    }
  });

  // After opening via the button, shift focus to first link (if present)
  toggle.addEventListener("click", () => {
    setTimeout(() => { if (isOpen()) firstLink()?.focus(); }, 0);
  });
})();
