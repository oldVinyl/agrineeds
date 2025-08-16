// js/state.js
export const state = {
  products: [],
  orders: [],
  auth: null,
  _subs: new Set(),
};

export function setState(partial) {
  Object.assign(state, partial);
  state._subs.forEach(fn => fn(state));
}

export function subscribe(fn) {
  state._subs.add(fn);
  return () => state._subs.delete(fn);
}
