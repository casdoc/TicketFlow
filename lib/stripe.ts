import Stripe from 'stripe';

let _stripe: Stripe | null = null;

export function getStripe(): Stripe {
  if (!_stripe) {
    const stripeSecretKey = process.env.Stripe_CHANNEL_SECRET;
    if (!stripeSecretKey) {
      throw new Error("Stripe secret key is missing. Set Stripe_CHANNEL_SECRET in your environment.");
    }
    _stripe = new Stripe(stripeSecretKey, {
      apiVersion: '2026-03-25.dahlia',
    });
  }
  return _stripe;
}
