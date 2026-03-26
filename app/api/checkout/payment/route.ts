import { NextResponse } from 'next/server';
import stripe from '@/lib/stripe';
import { reserveTickets } from '@/lib/state';

interface PaymentRequest {
  qty: number;
  couponCode?: string;
  cardName: string;
  cardNumber: string;
  cardExpiry: string;
  cardCvc: string;
}

function isMockKey(key: string | undefined): boolean {
  return !!key && key.startsWith('sk_test_mockkey');
}

export async function POST(request: Request) {
  const body = await request.json() as PaymentRequest;
  const { qty, couponCode, cardName } = body;

  if (!qty || qty < 1 || qty > 4) {
    return NextResponse.json({ error: 'Invalid ticket quantity (1–4).' }, { status: 400 });
  }

  const reserved = reserveTickets(qty);
  if (!reserved) {
    return NextResponse.json({ error: 'Sorry, tickets are sold out.', code: 'SOLD_OUT' }, { status: 409 });
  }

  if (isMockKey(process.env.Stripe_CHANEL_SECRET)) {
    const orderId = `NV2026-${Date.now().toString(36).toUpperCase()}`;
    return NextResponse.json({
      success: true,
      orderId,
      paymentIntentId: `pi_mock_${Date.now()}`,
      amount: qty * 2800,
      currency: 'twd',
      status: 'succeeded',
    });
  }

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: qty * 2800,
      currency: 'twd',
      payment_method_types: ['card'],
      description: `NOVA World Tour 2026 Taipei — ${qty} ticket(s)`,
      metadata: {
        qty: String(qty),
        couponCode: couponCode ?? 'none',
        cardholderName: cardName,
      },
    });

    const orderId = `NV2026-${Date.now().toString(36).toUpperCase()}`;

    return NextResponse.json({
      success: true,
      orderId,
      paymentIntentId: paymentIntent.id,
      amount: paymentIntent.amount,
      currency: paymentIntent.currency,
      status: paymentIntent.status,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Payment processing failed';
    console.error('[payment] Stripe error:', error);

    return NextResponse.json(
      { error: `Payment failed: ${message}`, code: 'PAYMENT_ERROR' },
      { status: 500 }
    );
  }
}
