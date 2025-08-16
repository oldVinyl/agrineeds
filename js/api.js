// js/api.js
const BASE_URL = window.API_BASE_URL || "/mock";
const USE_MOCK = BASE_URL === "/mock";

async function mock(data) {
  // tiny delay so UI feels realistic
  await new Promise(r => setTimeout(r, 120));
  return structuredClone(data);
}

// ----- PRODUCTS -----
export async function getProducts(params = {}) {
  if (USE_MOCK) {
    // Phase 0: return empty array; Phase 1 will load /mock/products.json
    return mock([]);
  }
  const qs = new URLSearchParams(params).toString();
  const res = await fetch(`${BASE_URL}/products${qs ? "?" + qs : ""}`);
  if (!res.ok) throw new Error("Failed to load products");
  return res.json();
}

export async function createProduct(payload) {
  if (USE_MOCK) return mock({ id: crypto.randomUUID(), ...payload });
  const res = await fetch(`${BASE_URL}/products`, {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Failed to create product");
  return res.json();
}

export async function updateProduct(id, payload) {
  if (USE_MOCK) return mock({ id, ...payload });
  const res = await fetch(`${BASE_URL}/products/${id}`, {
    method: "PATCH", headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Failed to update product");
  return res.json();
}

export async function deleteProduct(id) {
  if (USE_MOCK) return mock({ ok: true });
  const res = await fetch(`${BASE_URL}/products/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete product");
  return res.json();
}

// ----- ORDERS -----
export async function getOrders(params = {}) {
  if (USE_MOCK) return mock([]);
  const qs = new URLSearchParams(params).toString();
  const res = await fetch(`${BASE_URL}/orders${qs ? "?" + qs : ""}`);
  if (!res.ok) throw new Error("Failed to load orders");
  return res.json();
}

export async function createOrder(payload) {
  if (USE_MOCK) return mock({ id: crypto.randomUUID(), status: "PENDING", ...payload });
  const res = await fetch(`${BASE_URL}/orders`, {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Failed to create order");
  return res.json();
}

export async function updateOrderStatus(id, status) {
  if (USE_MOCK) return mock({ id, status });
  const res = await fetch(`${BASE_URL}/orders/${id}`, {
    method: "PATCH", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
  });
  if (!res.ok) throw new Error("Failed to update order status");
  return res.json();
}

// ----- AUTH -----
export async function login({ username, password }) {
  if (USE_MOCK) return mock({ token: "mock-token", user: { id: "u1", role: "ADMIN", username } });
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
  if (!res.ok) throw new Error("Login failed");
  return res.json();
}

export async function logout() {
  if (USE_MOCK) return mock({ ok: true });
  const res = await fetch(`${BASE_URL}/auth/logout`, { method: "POST" });
  if (!res.ok) throw new Error("Logout failed");
  return res.json();
}
