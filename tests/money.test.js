// /tests/money.test.js
import { formatGHS } from "../js/utils/money.js";

export async function suiteMoney(t) {
  t.equal("formatGHS basic", formatGHS(120000), "GHS 1,200.00");
  t.equal("formatGHS zero", formatGHS(0), "GHS 0.00");
  t.equal("formatGHS cents rounding", formatGHS(85), "GHS 0.85");
}
