"use client";

import { Suspense, useTransition, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { BorderBeam } from "@/components/magicui/border-beam";
import { GlowButton } from "@/components/magicui/glow-button";

interface CouponResult {
  valid: boolean;
  discount?: number;
  message: string;
}

function CheckoutForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const qty = Math.min(4, Math.max(1, Number(searchParams.get("qty") ?? "1")));
  const basePrice = qty * 2800;

  const [couponCode, setCouponCode] = useState("");
  const [couponResult, setCouponResult] = useState<CouponResult | null>(null);
  const [paymentError, setPaymentError] = useState<string | null>(null);

  // rule 5.11 — useTransition for non-urgent async state updates
  const [isValidating, startValidation] = useTransition();
  const [isPaying, startPayment] = useTransition();

  const discount = couponResult?.valid ? (couponResult.discount ?? 0) : 0;
  const finalPrice = Math.round(basePrice * (1 - discount));

  function handleValidateCoupon() {
    if (!couponCode.trim()) return;
    setCouponResult(null);
    startValidation(async () => {
      try {
        const res = await fetch("/api/checkout/validate-coupon", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ code: couponCode.trim() }),
        });
        const data: CouponResult = await res.json();
        setCouponResult(data);
      } catch {
        setCouponResult({ valid: false, message: "Validation failed. Please try again." });
      }
    });
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPaymentError(null);
    const form = e.currentTarget;
    const data = new FormData(form);

    startPayment(async () => {
      try {
        const res = await fetch("/api/checkout/payment", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            qty,
            couponCode: couponResult?.valid ? couponCode : undefined,
            cardName: data.get("cardName"),
            cardNumber: data.get("cardNumber"),
            cardExpiry: data.get("cardExpiry"),
            cardCvc: data.get("cardCvc"),
          }),
        });
        const result = await res.json();
        if (!res.ok || !result.success) {
          setPaymentError(result.error ?? "Payment failed. Please try again.");
          return;
        }
        router.push(`/success?orderId=${result.orderId}&qty=${qty}&amount=${finalPrice}`);
      } catch {
        setPaymentError("Network error. Please try again.");
      }
    });
  }

  return (
    <div className="relative mx-auto w-full max-w-lg rounded-3xl border border-white/10 bg-white/4 p-8 backdrop-blur-sm">
      <BorderBeam colorFrom="#7c3aed" colorTo="#d946ef" duration={5} borderWidth={1.5} />

      {/* Order Summary */}
      <div className="mb-8">
        <h2 className="mb-4 text-lg font-bold text-white">Order Summary</h2>
        <dl className="space-y-2 rounded-xl border border-white/8 bg-white/4 p-4">
          <div className="flex justify-between text-sm">
            <dt className="text-gray-400">NOVA World Tour 2026&nbsp;×&nbsp;{qty}</dt>
            <dd className="tabular-nums text-white">NT${basePrice.toLocaleString()}</dd>
          </div>
          {discount > 0 && (
            <div className="flex justify-between text-sm">
              <dt className="text-emerald-400">Discount ({Math.round(discount * 100)}%)</dt>
              <dd className="tabular-nums text-emerald-400">
                −NT${(basePrice - finalPrice).toLocaleString()}
              </dd>
            </div>
          )}
          <div className="flex justify-between border-t border-white/8 pt-2 font-bold">
            <dt className="text-white">Total</dt>
            <dd className="tabular-nums text-lg text-violet-300">
              NT${finalPrice.toLocaleString()}
            </dd>
          </div>
        </dl>
      </div>

      {/* Discount Code */}
      <fieldset className="mb-8">
        <legend className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
          Discount Code <span className="normal-case font-normal text-gray-600">(optional)</span>
        </legend>
        <div className="flex gap-2">
          <input
            id="couponCode"
            type="text"
            value={couponCode}
            onChange={(e) => { setCouponCode(e.target.value); setCouponResult(null); }}
            onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleValidateCoupon())}
            placeholder="e.g. EARLY-2026"
            autoComplete="off"
            spellCheck={false}
            aria-label="Discount code"
            aria-describedby={couponResult ? "coupon-feedback" : undefined}
            className="min-w-0 flex-1 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-gray-600 transition-colors focus-visible:border-violet-500/60 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-violet-500/40"
          />
          <button
            type="button"
            onClick={handleValidateCoupon}
            disabled={isValidating || !couponCode.trim()}
            className="rounded-xl border border-violet-500/40 px-4 py-2.5 text-sm font-medium text-violet-400 transition-all hover:bg-violet-500/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-950 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {isValidating ? "Checking…" : "Apply"}
          </button>
        </div>
        {couponResult && (
          <p
            id="coupon-feedback"
            role="status"
            className={`mt-2 text-sm ${couponResult.valid ? "text-emerald-400" : "text-red-400"}`}
          >
            {couponResult.valid ? "✓" : "✗"}&nbsp;{couponResult.message}
          </p>
        )}
      </fieldset>

      {/* Payment Form */}
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500">
          Payment Details
        </h3>

        <div>
          <label htmlFor="cardName" className="mb-1.5 block text-xs text-gray-500">
            Cardholder Name
          </label>
          <input
            id="cardName"
            name="cardName"
            type="text"
            required
            autoComplete="cc-name"
            placeholder="FIRSTNAME LASTNAME"
            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-gray-600 transition-colors focus-visible:border-violet-500/60 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-violet-500/40"
          />
        </div>

        <div>
          <label htmlFor="cardNumber" className="mb-1.5 block text-xs text-gray-500">
            Card Number
          </label>
          <input
            id="cardNumber"
            name="cardNumber"
            type="text"
            inputMode="numeric"
            required
            autoComplete="cc-number"
            spellCheck={false}
            placeholder="4242 4242 4242 4242"
            maxLength={19}
            onInput={(e) => {
              const el = e.currentTarget;
              el.value = el.value.replace(/\D/g, "").replace(/(.{4})/g, "$1 ").trim().slice(0, 19);
            }}
            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 font-mono text-sm tabular-nums text-white placeholder-gray-600 transition-colors focus-visible:border-violet-500/60 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-violet-500/40"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="cardExpiry" className="mb-1.5 block text-xs text-gray-500">
              Expiry Date
            </label>
            <input
              id="cardExpiry"
              name="cardExpiry"
              type="text"
              inputMode="numeric"
              required
              autoComplete="cc-exp"
              spellCheck={false}
              placeholder="MM/YY"
              maxLength={5}
              onInput={(e) => {
                const el = e.currentTarget;
                const v = el.value.replace(/\D/g, "").slice(0, 4);
                el.value = v.length > 2 ? `${v.slice(0, 2)}/${v.slice(2)}` : v;
              }}
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 font-mono text-sm tabular-nums text-white placeholder-gray-600 transition-colors focus-visible:border-violet-500/60 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-violet-500/40"
            />
          </div>
          <div>
            <label htmlFor="cardCvc" className="mb-1.5 block text-xs text-gray-500">
              CVC
            </label>
            <input
              id="cardCvc"
              name="cardCvc"
              type="text"
              inputMode="numeric"
              required
              autoComplete="cc-csc"
              spellCheck={false}
              placeholder="123"
              maxLength={4}
              onInput={(e) => {
                e.currentTarget.value = e.currentTarget.value.replace(/\D/g, "").slice(0, 4);
              }}
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 font-mono text-sm tabular-nums text-white placeholder-gray-600 transition-colors focus-visible:border-violet-500/60 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-violet-500/40"
            />
          </div>
        </div>

        {paymentError && (
          <div
            role="alert"
            className="rounded-xl border border-red-500/25 bg-red-950/30 p-4"
          >
            <p className="text-sm font-semibold text-red-400">Payment Failed</p>
            <p className="mt-1 font-mono text-xs text-red-300/70">{paymentError}</p>
          </div>
        )}

        <GlowButton
          type="submit"
          disabled={isPaying}
          className="mt-2 w-full py-4 text-base"
        >
          {isPaying
            ? "Processing…"
            : `Confirm Payment — NT$${finalPrice.toLocaleString()}`}
        </GlowButton>

        <p className="text-center text-xs text-gray-600">
          Secured with SSL&nbsp;encryption
        </p>
      </form>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <main className="min-h-screen bg-gray-950 px-4 py-16">
      {/* Ambient gradient */}
      <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 left-1/2 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-violet-700/12 blur-[100px]" />
      </div>

      <div className="mx-auto max-w-lg">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-black tracking-tight text-white">Checkout</h1>
          <p className="mt-2 text-sm text-gray-500">
            NOVA World Tour 2026&nbsp;·&nbsp;Taipei Arena
          </p>
        </div>
        <Suspense fallback={<div className="text-center text-sm text-gray-500">Loading…</div>}>
          <CheckoutForm />
        </Suspense>
      </div>
    </main>
  );
}
