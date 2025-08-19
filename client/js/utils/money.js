// js/utils/money.js
const fmt = new Intl.NumberFormat("en-GH", { style: "currency", currency: "GHS" });
export const formatGHS = (cents) => fmt.format((cents || 0) / 100);
