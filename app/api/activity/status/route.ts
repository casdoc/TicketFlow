import { NextResponse } from 'next/server';

const getInternalStatusUrl = () => {
  const base = process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000';
  return `${base}/api/internal/status-provider`;
};

async function fetchWithRetry(url: string, maxRetries = 100) {
  let lastError: unknown;

  for (let i = 0; i < maxRetries; i++) {
    try {
      const res = await fetch(url, { cache: 'no-store' });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (e) {
      lastError = e;
    }
  }

  throw lastError;
}

export async function GET() {
  try {
    const data = await fetchWithRetry(getInternalStatusUrl());
    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { error: 'Failed to fetch activity status after multiple retries' },
      { status: 503 }
    );
  }
}
