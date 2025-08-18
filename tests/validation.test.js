// /tests/validation.test.js
import { safeInt, nonNegativeInt, isNonEmptyString, isPositiveInt, validateStock } from "../js/utils/validation.js";

export async function suiteValidation(t) {
  t.equal("safeInt parses 42", safeInt("42"), 42);
  t.equal("safeInt invalid → fallback", safeInt("x", 7), 7);

  t.equal("nonNegativeInt clamps -3 → 0", nonNegativeInt(-3), 0);
  t.equal("nonNegativeInt keeps 5", nonNegativeInt(5), 5);

  t.truthy("isNonEmptyString true", isNonEmptyString("hello"));
  t.truthy("isNonEmptyString false", !isNonEmptyString("   "));

  t.truthy("isPositiveInt true", isPositiveInt(3));
  t.truthy("isPositiveInt false (0)", !isPositiveInt(0));
  t.truthy("isPositiveInt false (float)", !isPositiveInt(2.2));

  // validateStock
  t.deepEqual(
    "validateStock ok (5 stock, want 2)",
    validateStock({ currentStock: 5, requestedQty: 2 }),
    { ok: true }
  );
  t.truthy(
    "validateStock denies negative/invalid stock",
    validateStock({ currentStock: -1, requestedQty: 1 }).ok === false
  );
  t.truthy(
    "validateStock denies qty > stock",
    validateStock({ currentStock: 2, requestedQty: 3 }).ok === false
  );
}
