import Stripe from 'stripe';

let _stripe: Stripe | null = null;

export function getStripe(): Stripe {
  if (!_stripe) {
    const stripeSecretKey = process.env.Stripe_CHANEL_SECRET;
    _stripe = new Stripe(stripeSecretKey!, {
      apiVersion: '2026-03-25.dahlia',
    });
  }
  return _stripe;
}
