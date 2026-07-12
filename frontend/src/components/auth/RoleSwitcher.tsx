"use client";

import * as React from "react";
import { useAuth } from "../../lib/auth/AuthContext";
import { Role } from "../../lib/rbac/roles";
import { Users, ChevronUp } from "lucide-react";

export function RoleSwitcher() {
  const { user, switchUser } = useAuth();
  const [open, setOpen] = React.useState(false);
  const [isDev, setIsDev] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      setIsDev(true);
    }
  }, []);

  // Close on outside click
  React.useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  if (!isDev) return null;

  return (
    <div ref={ref} className="fixed bottom-4 right-4 z-50">
      {open && (
        <div className="mb-2 w-56 rounded-xl border border-border bg-popover shadow-2xl p-1.5 animate-in fade-in-80 slide-in-from-bottom-2">
          <div className="px-2.5 py-1.5 border-b border-border mb-1">
            <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">Dev Role Switcher</p>
            {user && (
              <p className="text-[10px] text-primary font-semibold truncate mt-0.5">{user.name} · {user.role}</p>
            )}
          </div>
          {Object.values(Role).map((role) => (
            <button
              key={role}
              onClick={() => { switchUser(role); setOpen(false); }}
              className={`flex w-full items-center justify-between rounded-lg px-2.5 py-2 text-xs transition-colors cursor-pointer
                ${user?.role === role
                  ? "bg-primary/10 text-primary font-bold"
                  : "text-foreground hover:bg-muted font-medium"
                }
              `}
            >
              <span>{role.replace(/_/g, " ")}</span>
              {user?.role === role && <span className="h-1.5 w-1.5 rounded-full bg-primary" />}
            </button>
          ))}
        </div>
      )}

      <button
        onClick={() => setOpen((o) => !o)}
        className="flex h-10 w-10 items-center justify-center rounded-full bg-background border border-border shadow-lg hover:bg-muted active:scale-95 transition-all"
        aria-label="Switch User Role (Dev)"
      >
        {open ? (
          <ChevronUp className="h-5 w-5 text-primary" />
        ) : (
          <Users className="h-5 w-5 text-primary" />
        )}
      </button>
    </div>
  );
}
