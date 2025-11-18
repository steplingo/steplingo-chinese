export async function onRequestPost(context) {
  const request = context.request;
  const secret = STRIPE_WEBHOOK_SECRET; // 後で Cloudflare の Environment Variables に設定します
  const signature = request.headers.get("stripe-signature");

  const body = await request.text();

  // Stripe 署名検証
  let event;
  try {
    event = Stripe.webhooks.constructEvent(body, signature, secret);
  } catch (err) {
    return new Response(`Webhook Error: ${err.message}`, { status: 400 });
  }

  // イベントが "payment_link.completed" または "checkout.session.completed" の場合
  if (
    event.type === "payment_link.completed" ||
    event.type === "checkout.session.completed"
  ) {
    return Response.redirect("https://steplingo.net/pricing/success.html", 302);
  }

  return new Response("OK", { status: 200 });
}

// Stripe SDK (Pages Functions / Workers 用)
import Stripe from "stripe";
