import { NextResponse } from 'next/server';

const getStatusProviderUrl = () => {
  return process.env.STATUS_PROVIDER_URL ?? 'http://localhost:8787/status';
};

async function fetchWithRetry(url: string, maxRetries = 3, delayMs = 500) {
  let lastError: unknown;

  for (let i = 0; i <= maxRetries; i++) {
    try {
      const res = await fetch(url, { cache: 'no-store', signal: AbortSignal.timeout(5000) });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (e) {
      lastError = e;
      if (i < maxRetries) {
        await new Promise((r) => setTimeout(r, delayMs * (i + 1)));
      }
    }
  }

  throw lastError;
}

export async function GET() {
  try {
    const data = await fetchWithRetry(getStatusProviderUrl());
    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { error: 'Failed to fetch activity status after multiple retries' },
      { status: 503 }
    );
  }
}
