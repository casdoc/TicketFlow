"use client";

import React from "react";
import { cn } from "@/lib/utils";

export interface RainbowButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

export function RainbowButton({
  children,
  className,
  ...props
}: RainbowButtonProps) {
  return (
    <button
      className={cn(
        "group relative inline-flex cursor-pointer items-center justify-center rounded-xl border-0 bg-[length:200%] px-8 py-3 font-semibold text-white transition-colors",
        "[background-clip:padding-box,border-box,border-box] [background-origin:border-box]",
        "[border:2px_solid_transparent]",
        "animate-rainbow",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50",
        "disabled:pointer-events-none disabled:opacity-50",
        // glow underneath
        "before:absolute before:bottom-[-20%] before:left-1/2 before:z-0",
        "before:h-1/5 before:w-3/5 before:-translate-x-1/2",
        "before:animate-rainbow",
        "before:bg-[linear-gradient(90deg,hsl(var(--color-1)),hsl(var(--color-2)),hsl(var(--color-3)),hsl(var(--color-4)),hsl(var(--color-5)))]",
        "before:[filter:blur(0.8rem)]",
        // dark fill + rainbow border
        "bg-[linear-gradient(#0d0d12,#0d0d12),linear-gradient(#0d0d12_50%,rgba(13,13,18,0.6)_80%,rgba(13,13,18,0)),linear-gradient(90deg,hsl(var(--color-1)),hsl(var(--color-2)),hsl(var(--color-3)),hsl(var(--color-4)),hsl(var(--color-5)))]",
        className
      )}
      {...props}
    >
      <span className="relative z-10">{children}</span>
    </button>
  );
}
