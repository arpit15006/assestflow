"use client";

import * as React from "react";
import { AppSidebar } from "./AppSidebar";
import { TopNavbar } from "./TopNavbar";
import { X } from "lucide-react";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  // Sidebar collapsed on desktop state
  const [collapsed, setCollapsed] = React.useState(false);
  // Mobile drawer open state
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const toggleSidebar = () => {
    setCollapsed((prev) => !prev);
  };

  const toggleMobileMenu = () => {
    setMobileOpen((prev) => !prev);
  };

  const closeMobileMenu = () => {
    setMobileOpen(false);
  };

  return (
    <div className="min-h-screen bg-zinc-50/50 text-zinc-950 font-sans">
      {/* 1. Desktop Sidebar Container */}
      <div className="hidden md:block">
        <AppSidebar collapsed={collapsed} onToggle={toggleSidebar} />
      </div>

      {/* 2. Mobile Drawer Navigation Overlay Panel */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 md:hidden flex">
          {/* Backdrop overlay */}
          <div
            className="fixed inset-0 bg-zinc-900/40 backdrop-blur-xs transition-opacity"
            onClick={closeMobileMenu}
          />

          {/* Sliding sidebar container */}
          <div className="relative flex w-64 max-w-xs flex-col bg-white animate-in slide-in-from-left duration-250">
            {/* Close button inside drawer */}
            <div className="absolute top-4 right-4 z-50">
              <button
                type="button"
                onClick={closeMobileMenu}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-200 text-zinc-400 hover:text-zinc-600 hover:bg-zinc-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 transition-colors"
                aria-label="Close mobile navigation"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <AppSidebar activePath="/" collapsed={false} />
          </div>
        </div>
      )}

      {/* 3. Main content body panel */}
      <div
        className={`flex flex-col min-h-screen transition-all duration-300
          ${collapsed ? "md:pl-16" : "md:pl-64"}
        `}
      >
        <TopNavbar onMobileMenuToggle={toggleMobileMenu} collapsed={collapsed} />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-6">
          {children}
        </main>
      </div>
    </div>
  );
}
