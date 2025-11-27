"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface ToastProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  description?: string;
}

export const Toast = React.forwardRef<HTMLDivElement, ToastProps>(
  ({ className, title, description, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "pointer-events-auto flex w-full max-w-sm flex-col gap-1 rounded-lg bg-white px-4 py-3 shadow-lg border",
          className
        )}
        {...props}
      >
        {title && <strong className="text-sm font-semibold">{title}</strong>}
        {description && <p className="text-sm text-gray-600">{description}</p>}
      </div>
    );
  }
);

Toast.displayName = "Toast";
