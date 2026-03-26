"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

function SuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId") ?? "ORDER-UNKNOWN";
  const qty = Number(searchParams.get("qty") ?? "1");
  const amount = Number(searchParams.get("amount") ?? "0");

  return (
    <div className="mx-auto w-full max-w-md text-center">
      {/* Animated check */}
      <div className="mb-8 inline-flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 shadow-[0_0_40px_rgba(16,185,129,0.4)] text-4xl">
        ✓
      </div>

      <h1 className="mb-2 text-3xl font-black tracking-tight text-white">
        Order Confirmed!
      </h1>
      <p className="mb-8 text-sm text-gray-400">
        Your tickets are reserved. A QR code has been sent to your email.
      </p>

      {/* Order card */}
      <div className="mb-8 rounded-2xl border border-white/10 bg-white/4 p-6 text-left backdrop-blur-sm">
        <div className="mb-5 border-b border-white/8 pb-4">
          <p className="text-xs font-medium uppercase tracking-widest text-gray-600">Order ID</p>
          <p className="mt-1 font-mono text-sm text-violet-400">{orderId}</p>
        </div>

        <dl className="space-y-3 text-sm">
          <div className="flex justify-between">
            <dt className="text-gray-500">Event</dt>
            <dd className="text-white">NOVA World Tour 2026</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-gray-500">Venue</dt>
            <dd className="text-white">Taipei Arena</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-gray-500">Date</dt>
            <dd className="text-white">May&nbsp;17, 2026</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-gray-500">Tickets</dt>
            <dd className="tabular-nums text-white">{qty}</dd>
          </div>
          {amount > 0 && (
            <div className="flex justify-between border-t border-white/8 pt-3 font-semibold">
              <dt className="text-gray-400">Amount Paid</dt>
              <dd className="tabular-nums text-violet-300">NT${amount.toLocaleString()}</dd>
            </div>
          )}
        </dl>
      </div>

      <Link
        href="/"
        className="inline-block rounded-xl border border-white/12 px-8 py-3 text-sm font-medium text-gray-400 transition-all hover:border-white/25 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-950"
      >
        ← Back to Home
      </Link>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <main className="relative flex min-h-screen items-center justify-center bg-gray-950 px-4 py-16">
      <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 left-1/2 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-emerald-700/10 blur-[120px]" />
      </div>
      <Suspense fallback={<div className="text-sm text-gray-500">Loading…</div>}>
        <SuccessContent />
      </Suspense>
    </main>
  );
}
