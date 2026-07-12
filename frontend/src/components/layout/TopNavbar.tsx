"use client";

import * as React from "react";
import { Bell, Menu, Search, LogOut, User, Settings } from "lucide-react";
import { Breadcrumbs } from "./Breadcrumbs";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { useAuth } from "../../lib/auth/AuthContext";
import { usePathname, useRouter } from "next/navigation";
import { useToast } from "@/components/ui/Toast";

interface TopNavbarProps {
  onMobileMenuToggle: () => void;
  collapsed: boolean;
}

export function TopNavbar({ onMobileMenuToggle, collapsed }: TopNavbarProps) {
  const { user, logout } = useAuth();
  const [searchValue, setSearchValue] = React.useState("");
  const [bellAnimated, setBellAnimated] = React.useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { toast } = useToast();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchValue.trim()) return;
    toast({
      type: "info",
      title: `Searching: "${searchValue}"`,
      description: "Global search across assets, bookings, and allocations.",
    });
  };

  const handleBellClick = () => {
    setBellAnimated(true);
    setTimeout(() => setBellAnimated(false), 600);
    router.push("/notifications");
  };

  const getBreadcrumbs = () => {
    if (pathname === "/assets") {
      return [{ label: "Dashboard", href: "/" }, { label: "Assets" }];
    }
    if (pathname === "/org-setup") {
      return [{ label: "Dashboard", href: "/" }, { label: "Organization Setup" }];
    }
    if (pathname === "/allocations") {
      return [{ label: "Dashboard", href: "/" }, { label: "Allocation & Transfer" }];
    }
    if (pathname === "/bookings") {
      return [{ label: "Dashboard", href: "/" }, { label: "Resource Booking" }];
    }
    if (pathname === "/maintenance") {
      return [{ label: "Dashboard", href: "/" }, { label: "Maintenance Management" }];
    }
    if (pathname === "/audit") {
      return [{ label: "Dashboard", href: "/" }, { label: "Audit Cycles" }];
    }
    if (pathname === "/reports") {
      return [{ label: "Dashboard", href: "/" }, { label: "Reports" }];
    }
    if (pathname === "/notifications") {
      return [{ label: "Dashboard", href: "/" }, { label: "Notifications" }];
    }
    return [{ label: "Dashboard" }];
  };

  const getRoleBadgeStyle = (role: string) => {
    switch (role) {
      case 'ADMIN': return 'bg-red-50 text-red-700 border-red-200';
      case 'ASSET_MANAGER': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'DEPARTMENT_HEAD': return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'EMPLOYEE': return 'bg-zinc-50 text-zinc-700 border-zinc-200';
      case 'AUDITOR': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'TECHNICIAN': return 'bg-orange-50 text-orange-700 border-orange-200';
      default: return 'bg-zinc-50 text-zinc-700 border-zinc-200';
    }
  };

  const initials = user?.name 
    ? user.name.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase() 
    : 'U';

  return (
    <header className="sticky top-0 right-0 z-20 flex h-16 w-full items-center justify-between border-b border-border bg-background/95 px-6 backdrop-blur-md transition-colors duration-300">
      {/* Left side: Hamburger (Mobile) + Breadcrumbs */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onMobileMenuToggle}
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-muted-foreground hover:bg-muted hover:text-foreground md:hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring transition-colors"
          aria-label="Open mobile menu"
        >
          <Menu className="h-5 w-5" />
        </button>
 
        <div className="hidden sm:block">
          <Breadcrumbs items={getBreadcrumbs()} />
        </div>
      </div>
 
      {/* Right side: Search + Bell + Avatar */}
      <div className="flex items-center gap-4">
        {/* Search */}
        <form onSubmit={handleSearchSubmit} className="relative hidden md:block w-72">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
          <input
            type="search"
            placeholder="Search assets, bookings, updates..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="w-full h-9 pl-9 pr-4 rounded-full border border-border bg-muted/50 hover:bg-muted focus:bg-background text-xs focus:outline-none focus:ring-2 focus:ring-ring focus:border-border transition-all font-medium text-foreground placeholder:text-muted-foreground"
          />
        </form>
 
        {/* Notifications Bell */}
        <button
          type="button"
          onClick={handleBellClick}
          className={`relative flex h-9 w-9 items-center justify-center rounded-lg border border-border text-muted-foreground hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring transition-colors ${bellAnimated ? "animate-bounce" : ""}`}
          aria-label="Notifications"
        >
          <Bell className="h-4 w-4" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-destructive" />
        </button>
 
        {/* User Profile Dropdown */}
        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <button
              type="button"
              className="flex h-10 items-center gap-3 focus:outline-none rounded-lg p-1 hover:bg-muted transition-colors focus-visible:ring-2 focus-visible:ring-ring text-left"
              aria-label="User profile settings"
            >
              <div className="hidden lg:flex flex-col text-right">
                <span className="text-xs font-bold text-foreground leading-none">
                  {user?.name}
                </span>
                <div className="flex items-center gap-1.5 mt-1">
                  {user?.department?.name && (
                    <span className="text-[9px] text-muted-foreground font-bold uppercase tracking-wider leading-none">
                      {user.department.name}
                    </span>
                  )}
                  <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded leading-none shrink-0 border ${getRoleBadgeStyle(user?.role || '')}`}>
                    {user?.role?.replace("_", " ")}
                  </span>
                </div>
              </div>
              {user?.avatarUrl ? (
                <img src={user.avatarUrl} alt={user.name} className="w-8 h-8 rounded-full object-cover border border-border" />
              ) : (
                <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-xs font-bold text-primary">
                  {initials}
                </div>
              )}
            </button>
          </DropdownMenu.Trigger>

          <DropdownMenu.Portal>
            <DropdownMenu.Content
              className="z-50 min-w-[200px] rounded-xl border border-border bg-popover p-1.5 text-foreground shadow-md animate-in fade-in-80 slide-in-from-top-1"
              align="end"
              sideOffset={5}
            >
              <div className="px-2.5 py-2 border-b border-border mb-1">
                <p className="text-xs font-bold text-foreground">{user?.name}</p>
                <p className="text-[10px] text-muted-foreground truncate mt-1">{user?.email}</p>
              </div>

              <DropdownMenu.Item
                onClick={() => router.push("/org-setup")}
                className="flex items-center gap-2 rounded-lg px-2.5 py-2 text-xs font-medium text-muted-foreground hover:bg-muted hover:text-foreground cursor-pointer focus-visible:outline-none focus-visible:bg-muted"
              >
                <User className="h-3.5 w-3.5 text-muted-foreground" />
                Profile Info
              </DropdownMenu.Item>

              <DropdownMenu.Item
                onClick={() => router.push("/org-setup")}
                className="flex items-center gap-2 rounded-lg px-2.5 py-2 text-xs font-medium text-muted-foreground hover:bg-muted hover:text-foreground cursor-pointer focus-visible:outline-none focus-visible:bg-muted"
              >
                <Settings className="h-3.5 w-3.5 text-muted-foreground" />
                System Settings
              </DropdownMenu.Item>

              <DropdownMenu.Separator className="h-px bg-border my-1" />

              <DropdownMenu.Item
                onClick={logout}
                className="flex items-center gap-2 rounded-lg px-2.5 py-2 text-xs font-medium text-destructive hover:bg-destructive/10 focus-visible:outline-none cursor-pointer"
              >
                <LogOut className="h-3.5 w-3.5 text-destructive" />
                Sign Out
              </DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>
      </div>
    </header>
  );
}
