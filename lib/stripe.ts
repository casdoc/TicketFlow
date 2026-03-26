import Stripe from 'stripe';

const stripeSecretKey = process.env.Stripe_CHANEL_SECRET;

const stripe = new Stripe(stripeSecretKey!, {
  apiVersion: '2026-03-25.dahlia',
});

export default stripe;
