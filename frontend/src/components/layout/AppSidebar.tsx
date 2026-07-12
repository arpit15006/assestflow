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
  ChevronLeft,
  ChevronRight,
  LogOut,
  User as UserIcon
} from "lucide-react";
import { SidebarItem } from "./SidebarItem";
import { SidebarSection } from "./SidebarSection";
import { Logo } from "../ui/Logo";
import { usePathname } from "next/navigation";
import { useAuth } from "../../lib/auth/AuthContext";
import { getNavSections } from "../../lib/rbac/permissions";

interface AppSidebarProps {
  collapsed?: boolean;
  onToggle?: () => void;
  activePath?: string;
}

const ICON_MAP: Record<string, any> = {
  "Dashboard": LayoutDashboard,
  "Assets": Package,
  "Allocation & Transfer": Share2,
  "Resource Booking": CalendarRange,
  "Maintenance": Wrench,
  "Audit Cycles": ClipboardCheck,
  "Organization Setup": Building2,
  "Reports": BarChart3,
  "Notifications": Bell,
};

export function AppSidebar({
  collapsed = false,
  onToggle,
  activePath: propActivePath,
}: AppSidebarProps) {
  const pathname = usePathname();
  const activePath = propActivePath || pathname || "/";
  const { user, logout, isLoading } = useAuth();

  const sections = user ? getNavSections(user.role) : [];

  if (isLoading) {
    return (
      <aside
        className={`fixed inset-y-0 left-0 z-30 flex h-full flex-col bg-card border-r border-border transition-all duration-300
          ${collapsed ? "w-16" : "w-64"}
        `}
      >
        <div className="flex h-16 items-center justify-center border-b border-border shrink-0">
          <div className="h-6 w-6 animate-pulse rounded-full bg-muted" />
        </div>
        <div className="flex-1 space-y-4 p-4">
          <div className="h-4 w-3/4 animate-pulse rounded-md bg-muted" />
          <div className="h-4 w-1/2 animate-pulse rounded-md bg-muted" />
        </div>
      </aside>
    );
  }

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-30 flex h-full flex-col bg-card border-r border-border transition-all duration-300 ease-in-out
        ${collapsed ? "w-16" : "w-64"}
      `}
      aria-label="Main Navigation"
    >
      {/* Brand logo header */}
      <div className="flex h-16 items-center justify-between px-4 border-b border-border shrink-0">
        <div className="flex items-center gap-3 overflow-hidden">
          <Logo className="h-8 w-8 shrink-0" />
          {!collapsed && (
            <span className="font-semibold text-foreground text-base tracking-tight whitespace-nowrap">
              AssetFlow
            </span>
          )}
        </div>

        {/* Toggle Button for Desktop */}
        {onToggle && (
          <button
            type="button"
            onClick={onToggle}
            className="hidden md:flex h-7 w-7 items-center justify-center rounded-lg border border-border text-muted-foreground hover:text-foreground hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring transition-all shrink-0"
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </button>
        )}
      </div>

      {/* Main links list with scroll area */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
        {sections.map((section, idx) => (
          <SidebarSection key={section.title || idx} title={section.title} collapsed={collapsed}>
            {section.items.map((item) => {
              const Icon = ICON_MAP[item.label] || Package;
              return (
                <SidebarItem
                  key={item.label}
                  label={item.label}
                  icon={Icon}
                  href={item.href}
                  active={activePath === item.href}
                  collapsed={collapsed}
                />
              );
            })}
          </SidebarSection>
        ))}
      </div>

      {/* Sidebar user footer info panel */}
      {user && !collapsed && (
        <div className="px-4 py-2 border-t border-border flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold border border-primary/20 shrink-0">
            {user.avatarUrl ? (
              <img src={user.avatarUrl} alt={user.name} className="w-full h-full rounded-full object-cover" />
            ) : (
              user.name.split(' ').map(n => n[0]).join('')
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-foreground truncate">{user.name}</p>
            <p className="text-[9px] text-muted-foreground truncate">{user.role.replace("_", " ")}</p>
          </div>
        </div>
      )}

      <div className="p-3 border-t border-border shrink-0">
        <button
          type="button"
          onClick={logout}
          className={`group flex items-center gap-3 w-full rounded-lg p-2.5 text-sm font-medium text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-destructive
            ${collapsed ? "justify-center" : ""}
          `}
          aria-label="Logout"
        >
          <LogOut className="h-5 w-5 shrink-0 text-muted-foreground group-hover:text-destructive transition-colors" />
          {!collapsed && <span>Sign Out</span>}
        </button>
      </div>
    </aside>
  );
}
