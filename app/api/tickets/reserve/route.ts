import { NextResponse } from 'next/server';
import { reserveTickets, getAvailableTickets } from '@/lib/state';

export async function POST(request: Request) {
  const body = await request.json() as { qty: number };
  const { qty } = body;

  if (!qty || typeof qty !== 'number' || qty < 1 || qty > 4) {
    return NextResponse.json(
      { error: 'Quantity must be between 1 and 4.' },
      { status: 400 }
    );
  }

  const success = reserveTickets(qty);

  if (!success) {
    return NextResponse.json(
      {
        error: 'Not enough tickets available.',
        available: getAvailableTickets(),
      },
      { status: 409 }
    );
  }

  return NextResponse.json({
    reserved: qty,
    remaining: getAvailableTickets(),
    reservationId: `RSV-${Date.now().toString(36).toUpperCase()}`,
  });
}
