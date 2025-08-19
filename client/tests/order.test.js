// /tests/order.test.js
import { confirmOrder } from "../js/utils/order.js";

export async function suiteOrder(t) {
  const product = { id: "p1", name: "Urea (50kg)", priceCents: 120000, stock: 7 };

  const ok = confirmOrder(product, 2, "leave at gate");
  t.truthy("confirmOrder ok", ok.ok === true);
  t.deepEqual(
    "confirmOrder payload shape",
    Object.keys(ok.payload).sort(),
    ["items","note","status"].sort()
  );
  t.equal("confirmOrder status PENDING", ok.payload.status, "PENDING");
  t.deepEqual(
    "confirmOrder items[0]",
    ok.payload.items[0],
    { productId: "p1", name: "Urea (50kg)", priceCents: 120000, qty: 2 }
  );

  // invalid quantity
  const badQty = confirmOrder(product, 0, "");
  t.truthy("confirmOrder rejects qty 0", badQty.ok === false);

  // over stock
  const over = confirmOrder(product, 100, "");
  t.truthy("confirmOrder rejects qty > stock", over.ok === false);

  // missing product
  const none = confirmOrder(null, 1, "");
  t.truthy("confirmOrder rejects missing product", none.ok === false);
}
