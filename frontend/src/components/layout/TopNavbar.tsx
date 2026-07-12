"use client";

import * as React from "react";
import { Bell, Menu, Search, Sun, Moon, LogOut, User, Settings } from "lucide-react";
import { Breadcrumbs } from "./Breadcrumbs";
import { Input } from "../ui/Input";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { currentUser } from "@/lib/mock/users";
import { usePathname } from "next/navigation";

interface TopNavbarProps {
  onMobileMenuToggle: () => void;
  collapsed: boolean;
}

export function TopNavbar({ onMobileMenuToggle, collapsed }: TopNavbarProps) {
  const [searchValue, setSearchValue] = React.useState("");
  const pathname = usePathname();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Searching for: "${searchValue}" (Mock Search Operation)`);
  };

  // Basic route mapping for breadcrumbs
  const getBreadcrumbs = () => {
    if (pathname === "/allocations") {
      return [{ label: "Dashboard", href: "/" }, { label: "Allocation & Transfer" }];
    }
    if (pathname === "/bookings") {
      return [{ label: "Dashboard", href: "/" }, { label: "Resource Booking" }];
    }
    if (pathname === "/maintenance") {
      return [{ label: "Dashboard", href: "/" }, { label: "Maintenance Management" }];
    }
    return [{ label: "Dashboard" }];
  };

  return (
    <header className="sticky top-0 right-0 z-20 flex h-16 w-full items-center justify-between border-b border-zinc-200/80 bg-white/95 px-4 backdrop-blur-md">
      {/* Left side: Hamburger (Mobile) + Breadcrumbs */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onMobileMenuToggle}
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-200 text-zinc-500 hover:bg-zinc-50 hover:text-zinc-700 md:hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 transition-colors"
          aria-label="Open mobile menu"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="hidden sm:block">
          <Breadcrumbs items={getBreadcrumbs()} />
        </div>
      </div>

      {/* Right side: Search bar + Theme Toggle + Notification Bell + User Avatar Dropdown */}
      <div className="flex items-center gap-4">
        {/* Search Input Box */}
        <form onSubmit={handleSearchSubmit} className="relative hidden md:block w-72">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400 pointer-events-none" />
          <Input
            type="search"
            placeholder="Search assets, bookings, updates..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="pl-9 h-9 text-xs"
          />
        </form>

        {/* Notifications Icon Button */}
        <button
          type="button"
          onClick={() => alert("Notification panel toggling is a mock flow.")}
          className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-200 text-zinc-500 hover:bg-zinc-50 hover:text-zinc-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 transition-colors"
          aria-label="Notifications"
        >
          <Bell className="h-4 w-4" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
        </button>

        {/* User Profile Radix Dropdown Menu */}
        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <button
              type="button"
              className="flex h-9 items-center gap-2.5 rounded-full border border-zinc-200 bg-zinc-50 pl-1.5 pr-3 py-1 hover:bg-zinc-100/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 transition-colors text-left"
              aria-label="User profile settings"
            >
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-semibold uppercase">
                {currentUser.name.split(" ").map((n) => n[0]).join("")}
              </div>
              <div className="hidden lg:block">
                <p className="text-xs font-bold text-zinc-800 leading-none">
                  {currentUser.name}
                </p>
                <p className="text-[10px] text-zinc-400 font-medium">
                  {currentUser.role.replace("_", " ")}
                </p>
              </div>
            </button>
          </DropdownMenu.Trigger>

          <DropdownMenu.Portal>
            <DropdownMenu.Content
              className="z-50 min-w-[200px] rounded-xl border border-zinc-200/80 bg-white p-1.5 text-zinc-950 shadow-md animate-in fade-in-80 slide-in-from-top-1"
              align="end"
              sideOffset={5}
            >
              <div className="px-2.5 py-2 border-b border-zinc-100 mb-1">
                <p className="text-xs font-bold text-zinc-800">{currentUser.name}</p>
                <p className="text-[10px] text-zinc-400 truncate">{currentUser.email}</p>
              </div>

              <DropdownMenu.Item
                onClick={() => alert("Profile navigation is a mockup.")}
                className="flex items-center gap-2 rounded-lg px-2.5 py-2 text-xs font-medium text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 cursor-pointer focus-visible:outline-none focus-visible:bg-zinc-50"
              >
                <User className="h-3.5 w-3.5 text-zinc-400" />
                Profile Info
              </DropdownMenu.Item>

              <DropdownMenu.Item
                onClick={() => alert("Settings navigation is a mockup.")}
                className="flex items-center gap-2 rounded-lg px-2.5 py-2 text-xs font-medium text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 cursor-pointer focus-visible:outline-none focus-visible:bg-zinc-50"
              >
                <Settings className="h-3.5 w-3.5 text-zinc-400" />
                System Settings
              </DropdownMenu.Item>

              <DropdownMenu.Separator className="h-px bg-zinc-100 my-1" />

              <DropdownMenu.Item
                onClick={() => alert("Logout flow is a mockup.")}
                className="flex items-center gap-2 rounded-lg px-2.5 py-2 text-xs font-medium text-red-600 hover:bg-red-50 focus-visible:outline-none focus-visible:bg-red-50 cursor-pointer"
              >
                <LogOut className="h-3.5 w-3.5 text-red-400" />
                Sign Out
              </DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>
      </div>
    </header>
  );
}
