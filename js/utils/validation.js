// js/utils/validation.js
export function isNonEmptyString(v) {
  return typeof v === "string" && v.trim().length > 0;
}
export function isPositiveInt(v) {
  return Number.isInteger(v) && v > 0;
}
