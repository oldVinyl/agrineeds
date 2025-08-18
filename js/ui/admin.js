// js/ui/admin.js
import { ce, toast } from "../utils/dom.js";
import * as api from "../api.js";
import { state, setState, subscribe } from "../state.js";
import { renderDashboard } from "./dashboard.js";

export function renderAdminView() {
  const wrap = ce("section", { className: "view admin" });

  if (!state.auth?.token) {
    wrap.innerHTML = `
      <div class="container">
        <div class="section-header">
          <h2>Admin Login</h2>
          <p>Sign in to manage products and orders.</p>
        </div>
        <form id="login-form" class="admin-login" novalidate>
          <div class="form-row">
            <label for="username">Username</label>
            <input id="username" name="username" type="text" required placeholder="admin" />
          </div>
          <div class="form-row">
            <label for="password">Password</label>
            <input id="password" name="password" type="password" required placeholder="••••••••" />
          </div>
          <label class="remember">
            <input id="remember" type="checkbox" /> Remember me on this device
          </label>
          <div class="form-actions">
            <button class="btn" type="submit">Login</button>
          </div>
        </form>
      </div>
    `;

    const form = wrap.querySelector("#login-form");
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const username = form.username.value.trim();
      const password = form.password.value.trim();
      const remember = form.querySelector("#remember").checked;
      if (!username || !password) return toast("Please enter username and password.");

      try {
        const res = await api.login({ username, password }); // mock returns token
        setState({ auth: res });
        if (remember) {
          localStorage.setItem("auth", JSON.stringify(res));
        }
        toast("Welcome back!");
        // re-render as the admin panel
        const next = renderAdminView();
        wrap.replaceWith(next);
      } catch (err) {
        console.error(err);
        toast("Login failed.");
      }
    });

    return wrap;
  }

  // Logged-in admin panel
  wrap.innerHTML = `
    <div class="container admin-shell">
      <div class="admin-topbar">
        <div class="admin-user">Signed in as <strong>${state.auth?.user?.username || "admin"}</strong></div>
        <button id="logout" class="btn btn-light">Logout</button>
      </div>

      <div class="admin-tabs" role="tablist" aria-label="Admin sections">
        <button class="tab active" data-tab="dashboard">Dashboard</button>
        <button class="tab" data-tab="products">Products</button>
        <button class="tab" data-tab="orders">Orders</button>
      </div>

      <div id="admin-content" class="admin-content"></div>
    </div>
  `;

  const content = wrap.querySelector("#admin-content");
  const tabs = [...wrap.querySelectorAll(".admin-tabs .tab")];
  const logoutBtn = wrap.querySelector("#logout");

  function setActive(name) {
    tabs.forEach(t => t.classList.toggle("active", t.dataset.tab === name));
    if (name === "dashboard") {
      content.innerHTML = "";
      content.appendChild(renderDashboard());
    } else if (name === "products") {
      content.innerHTML = `
        <div class="section-header"><h3>Products</h3></div>
        <p>Products CRUD arrives in the next phase. You’ll be able to add/edit/delete and update stock.</p>
      `;
    } else if (name === "orders") {
      content.innerHTML = `
        <div class="section-header"><h3>Orders</h3></div>
        <p>Orders table and status updates arrive in the next phase.</p>
      `;
    }
  }

  tabs.forEach(btn => {
    btn.addEventListener("click", () => setActive(btn.dataset.tab));
  });

  logoutBtn.addEventListener("click", () => {
    localStorage.removeItem("auth");
    setState({ auth: null });
    toast("Signed out.");
    const next = renderAdminView();
    wrap.replaceWith(next);
  });

  // initial tab
  setActive("dashboard");

  // keep dashboard reactive if state changes
  const unsub = subscribe(() => {
    const active = tabs.find(t => t.classList.contains("active"))?.dataset.tab || "dashboard";
    if (active === "dashboard") {
      setActive("dashboard");
    }
  });
  wrap.addEventListener("DOMNodeRemoved", () => unsub());

  return wrap;
}
