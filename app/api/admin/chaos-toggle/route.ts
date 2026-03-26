import { NextResponse } from 'next/server';
import { getChaosMode, setChaosMode, resetTickets } from '@/lib/state';

export async function POST(request: Request) {
  const body = await request.json() as { chaos?: boolean; resetTickets?: boolean };

  if (typeof body.chaos !== 'boolean') {
    return NextResponse.json(
      { error: 'Request body must be { "chaos": true | false }' },
      { status: 400 }
    );
  }

  setChaosMode(body.chaos);

  if (body.resetTickets) {
    resetTickets();
  }

  return NextResponse.json({
    chaosMode: getChaosMode(),
    message: body.chaos
      ? 'Chaos mode enabled.'
      : 'Chaos mode disabled.',
  });
}

export async function GET() {
  return NextResponse.json({
    chaosMode: getChaosMode(),
  });
}
