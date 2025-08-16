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
