"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { GlowButton } from "@/components/magicui/glow-button";

export function TicketSelector() {
  const [qty, setQty] = useState(1);
  const router = useRouter();

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="flex items-center gap-5">
        <button
          onClick={() => setQty((q) => Math.max(1, q - 1))}
          aria-label="Decrease ticket quantity"
          className="flex h-11 w-11 items-center justify-center rounded-full border border-white/20 text-xl font-bold text-white/70 transition-all duration-200 hover:border-violet-500/60 hover:bg-violet-500/20 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-950"
        >
          −
        </button>

        <div className="min-w-[4rem] text-center">
          <div className="text-5xl font-black tabular-nums text-white">{qty}</div>
          <div className="mt-1 text-xs text-gray-500">
            ticket{qty > 1 ? "s" : ""}
          </div>
        </div>

        <button
          onClick={() => setQty((q) => Math.min(4, q + 1))}
          aria-label="Increase ticket quantity"
          className="flex h-11 w-11 items-center justify-center rounded-full border border-white/20 text-xl font-bold text-white/70 transition-all duration-200 hover:border-violet-500/60 hover:bg-violet-500/20 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-950"
        >
          +
        </button>
      </div>

      <p className="text-sm text-gray-500">Maximum 4&nbsp;tickets per order</p>

      <GlowButton
        className="px-12 py-4 text-lg"
        onClick={() => router.push(`/checkout?qty=${qty}`)}
        onMouseEnter={() => router.prefetch(`/checkout?qty=${qty}`)}
      >
        Buy&nbsp;Tickets&nbsp;—&nbsp;NT${(qty * 2800).toLocaleString()}
      </GlowButton>
    </div>
  );
}
