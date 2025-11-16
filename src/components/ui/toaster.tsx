"use client";

import { useToast } from "@/components/ui/use-toast";
import { Toast } from "@/components/ui/toast";

export function Toaster() {
  const { toasts } = useToast();

  return (
    <div className="fixed inset-0 flex flex-col items-start justify-end px-4 py-6 pointer-events-none z-50">
      {toasts.map(({ id, ...props }) => (
        <Toast key={id} {...props} />
      ))}
    </div>
  );
}
