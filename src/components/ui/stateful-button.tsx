"use client";

import React from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

type StatefulButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  loading?: boolean;
  variant?: "primary" | "secondary";
};

export const Button = React.forwardRef<HTMLButtonElement, StatefulButtonProps>(
  ({ loading, disabled, className, children, variant = "primary", ...props }, ref) => {
    const baseStyles = "inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
    // Unified color for all buttons
    const unified = "bg-violet-600 text-white hover:bg-violet-500 focus:ring-violet-500";
    const variants: Record<string, string> = {
      primary: unified,
      secondary: unified,
    };

    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(baseStyles, variants[variant], className)}
        {...props}
      >
        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {children}
      </button>
    );
  },
);

Button.displayName = "StatefulButton";


