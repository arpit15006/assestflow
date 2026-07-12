"use client";

import * as React from "react";
import { LucideIcon } from "lucide-react";

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
    <a
      href={href}
      onClick={(e) => {
        if (onClick) {
          e.preventDefault();
          onClick();
        }
      }}
      className={`group flex items-center justify-between rounded-lg p-2.5 text-sm font-medium transition-all duration-150 relative focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40
        ${
          active
            ? "bg-primary/5 text-primary"
            : "text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900"
        }
      `}
      aria-current={active ? "page" : undefined}
    >
      <div className="flex items-center gap-3">
        <Icon
          className={`h-5 w-5 shrink-0 transition-colors ${
            active ? "text-primary" : "text-zinc-400 group-hover:text-zinc-600"
          }`}
        />
        {!collapsed && <span className="truncate">{label}</span>}
      </div>

      {!collapsed && badge && (
        <span
          className={`rounded-full px-2 py-0.5 text-xxs font-semibold shadow-2xs border
            ${
              active
                ? "bg-primary text-white border-primary"
                : "bg-zinc-100 text-zinc-600 border-zinc-200"
            }
          `}
        >
          {badge}
        </span>
      )}

      {/* Collapsed Tooltip helper mapping on hover */}
      {collapsed && (
        <div className="absolute left-14 bg-zinc-900 text-white text-xs font-semibold rounded-md py-1 px-2.5 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-150 shadow-md whitespace-nowrap z-50">
          {label}
        </div>
      )}
    </a>
  );
}
