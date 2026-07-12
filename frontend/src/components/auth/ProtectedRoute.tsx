"use client";

import * as React from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "../../lib/auth/AuthContext";
import { Role } from "../../lib/rbac/roles";
import { canAccessRoute } from "../../lib/rbac/permissions";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: Role[];
}

export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  React.useEffect(() => {
    if (!isLoading) {
      if (!user) {
        router.push("/login");
      } else if (allowedRoles && !allowedRoles.includes(user.role)) {
        router.push("/403");
      } else if (!canAccessRoute(user.role, pathname || "/")) {
        router.push("/403");
      }
    }
  }, [user, isLoading, allowedRoles, pathname, router]);

  if (isLoading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-xs font-medium text-muted-foreground">Verifying session...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  if (allowedRoles && !allowedRoles.includes(user.role)) return null;
  if (!canAccessRoute(user.role, pathname || "/")) return null;

  return <>{children}</>;
}
