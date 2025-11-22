import {
  LayoutDashboard,
  ClipboardList,
  BookOpen,
  Dumbbell,
  GraduationCap,
  BarChart3,
  Settings as SettingsIcon,
  Book,
} from "lucide-react";
import { ReactNode } from "react";

export interface AdminSidebarItem {
  id: string;
  label: string;
  icon: ReactNode;
}

export const adminSidebarItems: AdminSidebarItem[] = [
  { id: "dashboard", label: "Dashboard", icon: <LayoutDashboard size={20} /> },
  {
    id: "user-management",
    label: "User Management",
    icon: <ClipboardList size={20} />,
  },
  { id: "revenue", label: "Revenue & Billing", icon: <BookOpen size={20} /> },
  {
    id: "content-moderation",
    label: "Content Moderation",
    icon: <Dumbbell size={20} />,
  },
  {
    id: "system-analytics",
    label: "System Analytics",
    icon: <BarChart3 size={20} />,
  },
  {
    id: "institutional-mgmt",
    label: "Institutional Mgmt",
    icon: <GraduationCap size={20} />,
  },
  {
    id: "past-questions",
    label: "Past Questions",
    icon: <Book size={20} />,
  },
  { id: "settings", label: "Settings", icon: <SettingsIcon size={20} /> },
];
