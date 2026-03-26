"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface GlowButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export function GlowButton({ children, className, ...props }: GlowButtonProps) {
  return (
    <button
      className={cn(
        "relative inline-flex items-center justify-center gap-2 rounded-xl",
        "bg-gradient-to-r from-violet-600 to-fuchsia-600 font-semibold text-white",
        "transition-all duration-300",
        "shadow-[0_4px_32px_rgba(139,92,246,0.45)]",
        "hover:from-violet-500 hover:to-fuchsia-500",
        "hover:shadow-[0_4px_52px_rgba(139,92,246,0.7)]",
        "hover:scale-[1.02] active:scale-[0.98]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-950",
        "disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:scale-100 disabled:hover:shadow-[0_4px_32px_rgba(139,92,246,0.45)]",
        "motion-reduce:transition-none motion-reduce:hover:scale-100",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
