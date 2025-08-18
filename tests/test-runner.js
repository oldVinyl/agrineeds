// /tests/test-runner.js
import { suiteValidation } from "./validation.test.js";
import { suiteMoney } from "./money.test.js";
import { suiteOrder } from "./order.test.js";

// minimal asserts
const R = [];
function record(name, ok, msg = "") {
  R.push({ name, ok, msg });
  console[ok ? "log" : "error"](`[${ok ? "PASS" : "FAIL"}] ${name}`, msg || "");
}
export const t = {
  equal(name, got, expected) {
    const ok = Object.is(got, expected);
    record(name, ok, ok ? "" : `Expected: ${expected}\nGot: ${got}`);
  },
  truthy(name, value) {
    const ok = !!value;
    record(name, ok, ok ? "" : `Value was falsy: ${value}`);
  },
  deepEqual(name, got, expected) {
    const ok = JSON.stringify(got) === JSON.stringify(expected);
    record(name, ok, ok ? "" : `Expected: ${JSON.stringify(expected)}\nGot: ${JSON.stringify(got)}`);
  }
};

async function run() {
  await suiteValidation(t);
  await suiteMoney(t);
  await suiteOrder(t);

  // paint results
  const pass = R.filter(x => x.ok).length;
  const fail = R.length - pass;
  const sum = document.getElementById("summary");
  sum.innerHTML = `Total: ${R.length} &nbsp; <span class="ok">Pass: ${pass}</span> &nbsp; <span class="fail">Fail: ${fail}</span>`;

  const out = document.getElementById("results");
  out.innerHTML = "";
  R.forEach(r => {
    const div = document.createElement("div");
    div.className = "case";
    div.innerHTML = `
      <div class="name ${r.ok ? "ok" : "fail"}">${r.ok ? "✓" : "✗"} ${r.name}</div>
      ${r.msg ? `<div class="msg">${r.msg}</div>` : ""}
    `;
    out.appendChild(div);
  });
}

run().catch(e => {
  document.getElementById("summary").textContent = "Runner crashed";
  console.error(e);
});
