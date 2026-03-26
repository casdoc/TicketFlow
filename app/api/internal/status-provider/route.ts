import { NextResponse } from 'next/server';
import { getChaosMode, getAvailableTickets } from '@/lib/state';

export async function GET() {
  if (getChaosMode()) {
    // Simulate a degraded upstream dependency that responds very slowly.
    // Each retry in the caller must wait for this response before it can fail
    // and attempt the next iteration — ensuring every retry costs real time.
    await new Promise<void>((resolve) => setTimeout(resolve, 800));
    return NextResponse.json(
      { error: 'Internal service temporarily unavailable' },
      { status: 503 }
    );
  }

  return NextResponse.json({
    availableTickets: getAvailableTickets(),
    status: 'on_sale',
    eventName: 'NOVA World Tour 2026 — Taipei',
    eventDate: '2026-05-17T19:00:00+08:00',
    venue: 'Taipei Dome',
    pricePerTicket: 2800,
    maxPerOrder: 4,
  });
}
