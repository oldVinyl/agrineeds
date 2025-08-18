// js/utils/notify.js

/**
 * resendNotification(order)
 *  - stub: logs & returns success
 *  - later: POST to `${BASE_URL}/orders/:id/notify`
 */
export async function resendNotification(order) {
  // simulate async call
  await new Promise(r => setTimeout(r, 150));
  // eslint-disable-next-line no-console
  console.log("Stub: resend notification for order", order?.id);
  return { ok: true };
}
