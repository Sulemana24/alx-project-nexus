"use client";

import { useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import AdminDashboard from "@/components/dashboard/admin/AdminDashboard";

export default function AdminDashboardPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && (!user || user.role !== "admin")) {
      router.push("/auth/admin");
    }
  }, [user, isLoading, router]);

  if (isLoading || !user) return <div>Loading...</div>;

  return (
    <AdminDashboard
      userName={`${user.firstName} ${user.lastName}`}
      userEmail={user.email}
    />
  );
}
