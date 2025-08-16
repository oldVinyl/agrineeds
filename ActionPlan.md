# QuantumLoop — Frontend Action Plan (Backend-ready, gentle mode)

## Target Folder Structure (so everything stays tidy)
- /index.html
- /style.css
- /js/
  - main.js                 (bootstraps the app)
  - router.js               (tiny hash router)
  - api.js                  (fetch wrappers; backend plug-and-play)
  - state.js                (central in-memory store)
  - ui/
    - catalog.js            (customer product list)
    - productCard.js        (renders one product)
    - orderForm.js          (customer order form)
    - admin.js              (admin shell + route guard)
    - adminProducts.js      (admin product CRUD)
    - adminOrders.js        (admin orders + statuses)
    - dashboard.js          (analytics cards)
  - utils/
    - validation.js         (field rules, stock checks)
    - dom.js                (qs(), ce(), toasts)
    - money.js              (GHS formatting)
    - whatsapp.js           (deep-link helpers)
- /mock/
  - products.json
  - orders.json
  - auth.json

## Standard API Contracts (so backend is plug-and-play later)
- Product
  {
    "id": "p_123", "sku": "AGR-001", "name": "Urea 50kg",
    "description": "...", "priceCents": 120000,
    "imageUrl": "/img/urea.jpg", "stock": 7,
    "category": "Fertilizers", "isActive": true,
    "createdAt": "...", "updatedAt": "..."
  }
- Order
  {
    "id": "o_123",
    "items": [{"productId":"p_123","name":"Urea 50kg","priceCents":120000,"qty":2}],
    "customer": {"name":"Ama","phone":"+233..."},
    "note":"call before delivery",
    "status":"PENDING", // CONFIRMED|PACKED|EN_ROUTE|DELIVERED|CANCELLED
    "createdAt":"...", "updatedAt":"..."
  }
- Auth
  { "token":"jwt-or-mock", "user": { "id": "u1", "role": "ADMIN" } }

- Endpoints (same later for real backend)
  GET   /products?search=&category=&page=&limit=
  POST  /products
  PATCH /products/:id
  DELETE /products/:id
  GET   /orders?status=
  POST  /orders
  PATCH /orders/:id
  POST  /auth/login
  POST  /auth/logout

---

## Phase 0 — Gentle Setup (foundation)
**Goal:** prepare structure without changing visuals.

**Steps**
- [ ] Create `/js` subfolders and empty module files listed above.
- [ ] In `api.js`, add `const BASE_URL = window.API_BASE_URL || "/mock"; const USE_MOCK = BASE_URL === "/mock";`
- [ ] In `api.js`, export helpers: `getProducts()`, `createOrder()`, etc. Point to `/mock/*.json` when `USE_MOCK` is true.
- [ ] In `state.js`, create `state = { products: [], orders: [], auth: null }` and simple setters/getters.
- [ ] In `router.js`, implement very small hash router: `#home`, `#catalog`, `#admin`.

**Definition of Done**
- App still looks the same.
- `main.js` boots, router switches sections, no console errors.

**Checklist lift**
- “RESTful API (placeholders)” from 0% → **20%**
- “Scalability-friendly design” from 20% → **40%**

---

## Phase 1 — Dynamic Catalog (customer)
**Goal:** replace hard-coded products with data-driven render.

**Steps**
- [ ] Put sample products in `/mock/products.json`.
- [ ] `api.getProducts()` reads from mock file; `state.products = [...]`.
- [ ] `ui/catalog.js` renders cards from `state.products`.
- [ ] `ui/productCard.js` ensures each card shows name, description, **formatted price (GHS)**, image, and **stock**.

**Definition of Done**
- All product cards come from data, not static HTML.
- Prices show like `GHS 1,200.00`.

**Checklist lift**
- “Browse catalog” **70 → 85%**
- “Clear pricing visibility” **50 → 90%**
- “See product details” **60 → 80%**

---

## Phase 2 — Search, Filter, Pagination, Out-of-Stock, WhatsApp (per product)
**Steps**
- [ ] Add search input + category select; filter `state.products` in `ui/catalog.js`.
- [ ] Client-side pagination (page size 9/12).
- [ ] “Out of stock” badge when `stock <= 0`; disable order button.
- [ ] `utils/whatsapp.js`: `buildProductMessage(product, qty)` and `buildLink(message)`.
- [ ] Each card gets its own WhatsApp button (prefill product name + qty=1 by default).

**Definition of Done**
- Search/filter/pagination work without reloads.
- Visible “Out of stock”.
- Clicking per-product WhatsApp opens prefilled chat.

**Checklist lift**
- Search/filter **0 → 80%**
- Pagination **10 → 80%**
- Out-of-stock **0 → 80%**
- WhatsApp per-product **70 → 95%**

---

## Phase 3 — Website Order Form (customer)
**Steps**
- [ ] `ui/orderForm.js` with fields: name, phone, product, qty, notes.
- [ ] `utils/validation.js` for required fields & positive qty.
- [ ] On submit: `api.createOrder(orderPayload)` (mock) → success/fail toast.
- [ ] If WhatsApp fails to open, show fallback (copy message or open web WhatsApp).

**Definition of Done**
- Valid forms submit to mock and show a success toast.
- Proper validation errors (no empty/negative).

**Checklist lift**
- Website order request **20 → 80%**
- Validation **30 → 70%**
- Error messages/fallback **0 → 60%**

---

## Phase 4 — Admin Shell + Route Guard (mock auth)
**Steps**
- [ ] `ui/admin.js` with login form → `api.login()` (mock) returns token.
- [ ] Store token in `state.auth`; guard `#admin` routes.
- [ ] Admin tabs: Dashboard | Products | Orders.

**Definition of Done**
- Must login to view Admin.
- Logout clears token and returns to Home.

**Checklist lift**
- Authentication **0 → 60%**
- Admin dashboard (shell) **0 → 40%**

---

## Phase 5 — Admin: Products CRUD + Stock
**Steps**
- [ ] `ui/adminProducts.js`: table + form to **Create**, **Edit**, **Delete** product (calls `api.*`).
- [ ] Stock inc/dec buttons (no negatives).
- [ ] Option to hide inactive products from catalog.

**Definition of Done**
- You can add/edit/delete products and update stock from the Admin.
- Catalog reflects changes instantly.

**Checklist lift**
- Add/Edit/Delete products **0/15/0 → 85%+**
- Manage stock **0 → 80%**

---

## Phase 6 — Admin: Orders + Status Flow
**Steps**
- [ ] `ui/adminOrders.js`: table with filters by status.
- [ ] Status buttons: PENDING → CONFIRMED → PACKED → EN_ROUTE → DELIVERED; also CANCELLED.
- [ ] `api.updateOrderStatus()` persists in mock.

**Definition of Done**
- Orders visible with live status updates.
- Pending count visible.

**Checklist lift**
- View/manage orders **0 → 80%**
- Pending orders w/ statuses **0 → 80%**
- Update order status **0 → 80%**

---

## Phase 7 — Dashboard Analytics
**Steps**
- [ ] `ui/dashboard.js`: cards for **Total Products**, **Total Orders**, **Pending Orders**.
- [ ] Compute from `state`.

**Definition of Done**
- Cards update when products/orders change.

**Checklist lift**
- Basic analytics **10 → 80%**

---

## Phase 8 — Reliability Hooks (stubs)
**Steps**
- [ ] Add `confirmOrder()` and `validateStock()` helpers (used by both customer and admin flows).
- [ ] Add “Resend push notification” **button** (stub) on order rows.

**Definition of Done**
- Shared helpers used in flows (even if push is stubbed).

**Checklist lift**
- Future extensibility **20 → 60%**
- Resend push (UI stub) **0 → 30%**

---

## Phase 9 — Testing (light + valuable)
**Steps**
- [ ] Add Jest; test `validation.js`, `money.js`, and status transition logic.
- [ ] Add a basic DOM test for product card render.

**Definition of Done**
- `npm test` (or simple runner) passes.

**Checklist lift**
- Automated tests **10 → 50%**

---

## Phase 10 — Performance & A11y polish
**Steps**
- [ ] Lazy-load images; `defer` scripts; minify assets (simple build or manual).
- [ ] Labels for inputs, focus outlines, ARIA on toasts/modals.

**Definition of Done**
- Lighthouse perf/a11y scores noticeably higher.

**Checklist lift**
- Fast loading **40 → 80%**
- UX polish overall up a notch

---

## Optional Phase 11 — Payments & Notifications (when ready)
**Steps**
- [ ] Payment gateway button (UI + stub), later hits real backend.
- [ ] Push/SMS toggle (UI + stub), later hits real backend.

**Definition of Done**
- Buttons exist, disabled until backend is wired.

**Checklist lift**
- Payments **0 → 20–50% (UI ready)**
- Notifications **0 → 20–50% (UI ready)**
