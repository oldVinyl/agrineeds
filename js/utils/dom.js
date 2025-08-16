// js/utils/dom.js
export const qs = (sel, root = document) => root.querySelector(sel);
export const qsa = (sel, root = document) => [...root.querySelectorAll(sel)];
export const ce = (tag, props = {}, ...children) => {
  const el = Object.assign(document.createElement(tag), props);
  children.forEach(c => el.append(c));
  return el;
};

export function toast(msg) {
  const t = ce("div", { className: "toast", textContent: msg });
  Object.assign(t.style, {
    position: "fixed", right: "16px", bottom: "16px",
    background: "#222", color: "#fff", padding: "10px 14px",
    borderRadius: "8px", opacity: "0.95", zIndex: 9999
  });
  document.body.appendChild(t);
  setTimeout(() => t.remove(), 2200);
}
