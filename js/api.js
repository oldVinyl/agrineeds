// js/api.js
const BASE_URL = window.API_BASE_URL || "/mock";
const USE_MOCK = BASE_URL === "/mock";

const LS_KEYS = {
  products: "mock_products",
  orders: "mock_orders"
};

async function mock(data) {
  await new Promise(r => setTimeout(r, 120));
  return structuredClone(data);
}

// ------- helpers for mock store -------
function lsGet(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}
function lsSet(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}
async function fetchMockJson(path) {
  const res = await fetch(path, { headers: { "Content-Type": "application/json" } });
  if (!res.ok) throw new Error(`Mock fetch failed: ${path}`);
  return res.json();
}
async function ensureSeedProducts() {
  let items = lsGet(LS_KEYS.products, null);
  if (!items) {
    items = await fetchMockJson("/mock/products.json");
    lsSet(LS_KEYS.products, items);
  }
  return items;
}

// ===== PRODUCTS =====
export async function getProducts(params = {}) {
  if (USE_MOCK) {
    const items = await ensureSeedProducts();
    // simple param filtering can be added here later (search, category, pagination server-side)
    return mock(items);
  }
  const qs = new URLSearchParams(params).toString();
  const res = await fetch(`${BASE_URL}/products${qs ? "?" + qs : ""}`);
  if (!res.ok) throw new Error("Failed to load products");
  return res.json();
}

export async function createProduct(payload) {
  if (USE_MOCK) {
    const items = await ensureSeedProducts();
    const id = crypto.randomUUID();
    const now = new Date().toISOString();
    const doc = { id, isActive: true, createdAt: now, updatedAt: now, ...payload };
    items.push(doc);
    lsSet(LS_KEYS.products, items);
    return mock(doc);
  }
  const res = await fetch(`${BASE_URL}/products`, {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Failed to create product");
  return res.json();
}

export async function updateProduct(id, payload) {
  if (USE_MOCK) {
    const items = await ensureSeedProducts();
    const idx = items.findIndex(p => p.id === id);
    if (idx === -1) throw new Error("Product not found");
    items[idx] = { ...items[idx], ...payload, updatedAt: new Date().toISOString() };
    lsSet(LS_KEYS.products, items);
    return mock(items[idx]);
  }
  const res = await fetch(`${BASE_URL}/products/${id}`, {
    method: "PATCH", headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Failed to update product");
  return res.json();
}

export async function deleteProduct(id) {
  if (USE_MOCK) {
    let items = await ensureSeedProducts();
    const before = items.length;
    items = items.filter(p => p.id !== id);
    if (items.length === before) throw new Error("Product not found");
    lsSet(LS_KEYS.products, items);
    return mock({ ok: true });
  }
  const res = await fetch(`${BASE_URL}/products/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete product");
  return res.json();
}

// ===== ORDERS =====
export async function getOrders(params = {}) {
  if (USE_MOCK) {
    const items = lsGet(LS_KEYS.orders, []);
    return mock(items);
  }
  const qs = new URLSearchParams(params).toString();
  const res = await fetch(`${BASE_URL}/orders${qs ? "?" + qs : ""}`);
  if (!res.ok) throw new Error("Failed to load orders");
  return res.json();
}

export async function createOrder(payload) {
  if (USE_MOCK) {
    const items = lsGet(LS_KEYS.orders, []);
    const doc = { id: crypto.randomUUID(), createdAt: new Date().toISOString(), ...payload };
    items.push(doc);
    lsSet(LS_KEYS.orders, items);
    return mock(doc);
  }
  const res = await fetch(`${BASE_URL}/orders`, {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Failed to create order");
  return res.json();
}

export async function updateOrderStatus(id, status) {
  if (USE_MOCK) {
    const items = lsGet(LS_KEYS.orders, []);
    const idx = items.findIndex(o => o.id === id);
    if (idx === -1) throw new Error("Order not found");
    items[idx] = { ...items[idx], status, updatedAt: new Date().toISOString() };
    lsSet(LS_KEYS.orders, items);
    return mock(items[idx]);
  }
  const res = await fetch(`${BASE_URL}/orders/${id}`, {
    method: "PATCH", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
  });
  if (!res.ok) throw new Error("Failed to update order status");
  return res.json();
}

// ===== AUTH =====
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