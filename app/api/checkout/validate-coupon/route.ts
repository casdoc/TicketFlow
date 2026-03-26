import { NextResponse } from 'next/server';

interface ValidateCouponRequest {
  code: string;
}

const VALID_CODES: Record<string, number> = {
  'EARLY-2026': 0.20,
  'VVIP-50': 0.50,
  'SUPERFAN': 0.15,
};

const DISCOUNT_CODE_REGEX = /^([a-zA-Z0-9]+-?)*$/;

export async function POST(request: Request) {
  const body = await request.json() as ValidateCouponRequest;
  const { code } = body;

  if (!code || typeof code !== 'string') {
    return NextResponse.json({ valid: false, message: 'Please enter a discount code.' }, { status: 400 });
  }

  const isFormatValid = DISCOUNT_CODE_REGEX.test(code);

  if (!isFormatValid) {
    return NextResponse.json({ valid: false, message: 'Invalid discount code format.' });
  }

  const discount = VALID_CODES[code.toUpperCase()];
  if (discount === undefined) {
    return NextResponse.json({ valid: false, message: 'Discount code not found or expired.' });
  }

  return NextResponse.json({
    valid: true,
    discount,
    message: `${discount * 100}% discount applied.`,
  });
}
