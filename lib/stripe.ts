import Stripe from 'stripe';

let _stripe: Stripe | null = null;

export function getStripe(): Stripe {
  if (!_stripe) {
    const stripeSecretKey = process.env.Stripe_CHANEL_SECRET;
    _stripe = new Stripe(stripeSecretKey!, {
      apiVersion: '2026-03-25.dahlia',
      timeout: 10_000, // 10s — prevent indefinite hangs on Stripe API
      maxNetworkRetries: 2, // automatic retry on transient network errors
    });
  }
  return _stripe;
}
