"use client";

import { TeacherDashboard } from "@/components/dashboard/teacher/TeacherDashboard";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function TeacherDashboardPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && (!user || user.role !== "teacher")) {
      router.push("/auth");
    }
  }, [user, isLoading, router]);

  if (isLoading || !user) {
    return <div>Loading...</div>;
  }

  return (
    <TeacherDashboard
      userName={`${user.firstName} ${user.lastName}`}
      userEmail={user.email}
      userPlan="free"
    />
  );
}
