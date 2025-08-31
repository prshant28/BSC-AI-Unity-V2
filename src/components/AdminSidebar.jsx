import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  BookCopy,
  HelpCircle,
  Users,
  BarChart2,
  Settings,
  ShieldCheck,
  FileText,
  Calendar,
} from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";

const adminNavLinks = [
  { to: "/admin/dashboard/overview", label: "Overview", icon: LayoutDashboard },
  {
    to: "/admin/dashboard/content",
    label: "Content Management",
    icon: FileText,
  },
  {
    to: "/admin/dashboard/subjects",
    label: "Subjects & Quizzes",
    icon: BookCopy,
  },
  { to: "/admin/dashboard/questions", label: "Questions", icon: HelpCircle },
  { to: "/admin/dashboard/responses", label: "Student Responses", icon: Users },
  { to: "/admin/dashboard/leaderboard", label: "Leaderboard", icon: BarChart2 },
  {
    to: "/admin/dashboard/concerns",
    label: "User Concerns",
    icon: ShieldCheck,
  },
  // { to: '/admin/dashboard/settings', label: 'Settings', icon: Settings },
];

const AdminSidebar = () => {
  const location = useLocation();

  return (
    <aside className="sticky top-16 h-[calc(100vh-4rem)] w-64 flex-col border-r bg-background p-4 space-y-4 hidden md:flex">
      <nav className="flex-grow space-y-1">
        {adminNavLinks.map((link) => {
          const Icon = link.icon;
          const isActive =
            location.pathname === link.to ||
            (link.to !== "/admin/dashboard/overview" &&
              location.pathname.startsWith(link.to));
          return (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive: navLinkIsActive }) =>
                cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary hover:bg-primary/10",
                  (isActive || navLinkIsActive) &&
                    "bg-primary/10 text-primary font-medium",
                )
              }
            >
              <Icon className="h-5 w-5" />
              {link.label}
            </NavLink>
          );
        })}
      </nav>
      <div className="mt-auto pt-4 border-t">
        <ThemeToggle />
        <p className="text-xs text-muted-foreground mt-2 text-center">
          © {new Date().getFullYear()} BScAI Unity
        </p>
      </div>
    </aside>
  );
};

export default AdminSidebar;