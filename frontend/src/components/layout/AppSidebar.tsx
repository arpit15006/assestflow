"use client";

import * as React from "react";
import {
  LayoutDashboard,
  Building2,
  Package,
  Share2,
  CalendarRange,
  Wrench,
  ClipboardCheck,
  BarChart3,
  Bell,
  Settings,
  Menu,
  ChevronLeft,
  ChevronRight,
  LogOut,
} from "lucide-react";
import { SidebarItem } from "./SidebarItem";
import { SidebarSection } from "./SidebarSection";
import { Logo } from "../ui/Logo";

interface AppSidebarProps {
  collapsed?: boolean;
  onToggle?: () => void;
  activePath?: string;
}

import { usePathname } from "next/navigation";

export function AppSidebar({
  collapsed = false,
  onToggle,
  activePath: propActivePath,
}: AppSidebarProps) {
  const pathname = usePathname();
  const activePath = propActivePath || pathname || "/";

  // Navigation mapping
  const coreNavItems = [
    { label: "Dashboard", icon: LayoutDashboard, href: "/" },
    { label: "Assets", icon: Package, href: "#assets" },
    { label: "Allocation & Transfer", icon: Share2, href: "/allocations", badge: 7 },
    { label: "Resource Booking", icon: CalendarRange, href: "/bookings" },
  ];

  const adminNavItems = [
    { label: "Organization Setup", icon: Building2, href: "#org-setup" },
  ];

  const operationalNavItems = [
    { label: "Maintenance", icon: Wrench, href: "/maintenance", badge: 12 },
    { label: "Audit Cycles", icon: ClipboardCheck, href: "/audit" },
  ];

  const utilityNavItems = [
    { label: "Reports", icon: BarChart3, href: "/reports" },
    { label: "Notifications", icon: Bell, href: "/notifications", badge: 4 },
    { label: "Settings", icon: Settings, href: "#settings" },
  ];

  const renderItems = (items: typeof coreNavItems) => {
    return items.map((item) => (
      <SidebarItem
        key={item.label}
        label={item.label}
        icon={item.icon}
        href={item.href}
        active={activePath === item.href}
        badge={item.badge}
        collapsed={collapsed}
      />
    ));
  };

  return (
    <aside
      className={`fixed top-0 left-0 bottom-0 z-30 flex flex-col border-r border-zinc-200/80 bg-white transition-all duration-300
        ${collapsed ? "w-16" : "w-64"}
      `}
      aria-label="Main Navigation"
    >
      {/* Brand logo header */}
      <div className="flex h-16 items-center justify-between px-4 border-b border-zinc-200/80 shrink-0">
        <div className="flex items-center gap-3 overflow-hidden">
          <Logo className="h-8 w-8 shrink-0" />
          {!collapsed && (
            <span className="font-bold text-zinc-900 text-base tracking-tight whitespace-nowrap">
              AssetFlow <span className="text-primary">AI</span>
            </span>
          )}
        </div>

        {/* Toggle Button for Desktop */}
        {onToggle && (
          <button
            type="button"
            onClick={onToggle}
            className="hidden md:flex h-7 w-7 items-center justify-center rounded-lg border border-zinc-200 text-zinc-400 hover:text-zinc-600 hover:bg-zinc-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 transition-all shrink-0"
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </button>
        )}
      </div>

      {/* Main links list with scroll area */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
        <SidebarSection collapsed={collapsed}>
          {renderItems(coreNavItems)}
        </SidebarSection>

        <SidebarSection title="Operations" collapsed={collapsed}>
          {renderItems(operationalNavItems)}
        </SidebarSection>

        <SidebarSection title="Administration" collapsed={collapsed}>
          {renderItems(adminNavItems)}
        </SidebarSection>

        <SidebarSection title="System" collapsed={collapsed}>
          {renderItems(utilityNavItems)}
        </SidebarSection>
      </div>

      {/* Sidebar user footer info panel */}
      <div className="p-3 border-t border-zinc-200/80 shrink-0">
        <button
          type="button"
          onClick={() => alert("Logout flow is a frontend mock.")}
          className={`group flex items-center gap-3 w-full rounded-lg p-2.5 text-sm font-medium text-zinc-500 hover:bg-red-50 hover:text-red-600 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400
            ${collapsed ? "justify-center" : ""}
          `}
          aria-label="Logout"
        >
          <LogOut className="h-5 w-5 shrink-0 text-zinc-400 group-hover:text-red-500 transition-colors" />
          {!collapsed && <span>Sign Out</span>}
        </button>
      </div>
    </aside>
  );
}
