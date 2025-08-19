// /tests/money.test.js
import { formatGHS } from "../js/utils/money.js";

export async function suiteMoney(t) {
  t.equal("formatGHS basic", formatGHS(120000), "GH₵1,200.00");
  t.equal("formatGHS zero", formatGHS(0), "GH₵0.00");
  t.equal("formatGHS cents rounding", formatGHS(85), "GH₵0.85");
}
