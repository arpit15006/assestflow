"use client";

import * as React from "react";
import { LucideIcon } from "lucide-react";
import Link from "next/link";

interface SidebarItemProps {
  label: string;
  icon: LucideIcon;
  href?: string;
  active?: boolean;
  badge?: string | number;
  onClick?: () => void;
  collapsed?: boolean;
}

export function SidebarItem({
  label,
  icon: Icon,
  href = "#",
  active = false,
  badge,
  onClick,
  collapsed = false,
}: SidebarItemProps) {
  return (
    <Link
      href={href}
      onClick={(e) => {
        if (onClick) {
          onClick();
        }
      }}
      className={`group flex items-center justify-between rounded-lg px-2.5 py-2 text-sm font-medium transition-all relative focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring
        ${
          active
            ? "bg-muted text-foreground font-semibold shadow-sm"
            : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
        }
      `}
      aria-current={active ? "page" : undefined}
    >
      <div className="flex items-center gap-3">
        <Icon
          className={`h-5 w-5 shrink-0 transition-colors ${
            active ? "text-foreground" : "text-muted-foreground group-hover:text-foreground"
          }`}
        />
        {!collapsed && <span className="truncate">{label}</span>}
      </div>

      {!collapsed && badge && (
        <span
          className={`rounded-full px-2 py-0.5 text-xxs font-semibold shadow-3xs border
            ${
              active
                ? "bg-primary text-primary-foreground border-transparent"
                : "bg-muted text-muted-foreground border-border"
            }
          `}
        >
          {badge}
        </span>
      )}

      {/* Collapsed Tooltip helper mapping on hover */}
      {collapsed && (
        <div className="absolute left-14 bg-foreground text-background text-[11px] font-semibold rounded-md py-1.5 px-2.5 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-150 shadow-md whitespace-nowrap z-50">
          {label}
        </div>
      )}
    </Link>
  );
}
