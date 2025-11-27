"use client";

import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { usePathname } from "next/navigation";
import { Toaster } from "@/components/ui/toaster";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const hideLayout = pathname?.startsWith("/dashboard");

  return (
    <>
      {!hideLayout && <Header />}
      <main className="flex-1">{children}</main>
      <Footer />
      <Toaster />
    </>
  );
}
