"use client";

import React from "react";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface InteractiveHoverButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export function InteractiveHoverButton({
  children,
  className,
  ...props
}: InteractiveHoverButtonProps) {
  return (
    <button
      className={cn(
        "group relative inline-flex cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-xl border border-white/20 bg-white px-8 py-3 font-semibold text-gray-900 transition-all duration-300",
        className
      )}
      {...props}
    >
      {/* sliding bg fill */}
      <div className="absolute inset-0 -translate-x-full bg-gray-900 transition-transform duration-300 ease-out group-hover:translate-x-0" />

      <span className="relative z-10 transition-colors duration-300 group-hover:text-white">
        {children}
      </span>
      <ArrowRight
        size={16}
        className="relative z-10 translate-x-0 opacity-0 transition-all duration-300 group-hover:translate-x-1 group-hover:opacity-100 group-hover:text-white"
      />
    </button>
  );
}
