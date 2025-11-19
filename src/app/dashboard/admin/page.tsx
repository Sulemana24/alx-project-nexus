// app/dashboard/admin/page.tsx
"use client";

import { AdminDashboard } from "@/components/dashboard/admin/AdminDashboard";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AdminDashboardPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  /* useEffect(() => {
    if (!isLoading && (!user || user?.role !== "admin")) {
      router.push("/auth");
    }
  }, [user, isLoading, router]); */

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <AdminDashboard
      userName={`${user.firstName} ${user.lastName}`}
      userEmail={user.email}
    />
  );
}
