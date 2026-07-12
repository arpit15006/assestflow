"use client";

import * as React from "react";
import { Role } from "../rbac/roles";
import { useToast } from "@/components/ui/Toast";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatarUrl?: string;
  department?: { id: string; name: string };
}

interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  switchUser: (role: Role) => Promise<void>;
  hasPermission: (permission: string) => boolean;
  register: (name: string, email: string, password: string, departmentId?: string) => Promise<void>;
}

const AuthContext = React.createContext<AuthContextType | undefined>(undefined);

const ROLE_EMAILS: Record<Role, string> = {
  ADMIN: 'admin@assetflow.ai',
  ASSET_MANAGER: 'manager@assetflow.ai',
  DEPARTMENT_HEAD: 'head@assetflow.ai',
  EMPLOYEE: 'employee@assetflow.ai',
  AUDITOR: 'auditor@assetflow.ai',
  TECHNICIAN: 'technician@assetflow.ai',
};

import { api } from "../api/client";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const { toast } = useToast();

  const fetchMe = async () => {
    try {
      const response = await api.get('/auth/me');
      if (response.data?.success) {
        setUser(response.data.data);
      } else {
        setUser(null);
      }
    } catch (err) {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    fetchMe();
  }, []);

  const login = async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password });
    if (response.data?.success) {
      setUser(response.data.data.user);
      toast({ type: 'success', title: 'Login successful', description: `Welcome back, ${response.data.data.user.name}!` });
      window.location.href = '/';
    } else {
      throw new Error(response.data?.message || 'Login failed');
    }
  };

  const register = async (name: string, email: string, password: string, departmentId?: string) => {
    const response = await api.post('/auth/register', { name, email, password, departmentId });
    if (response.data?.success) {
      toast({ type: 'success', title: 'Registration successful', description: 'Your Employee account has been created. Please log in.' });
    } else {
      throw new Error(response.data?.message || 'Registration failed');
    }
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (err) {
      console.error('Logout request failed', err);
    } finally {
      setUser(null);
      toast({ type: 'info', title: 'Logged out', description: 'You have been signed out.' });
      window.location.href = '/login';
    }
  };

  const switchUser = async (role: Role) => {
    setIsLoading(true);
    try {
      const email = ROLE_EMAILS[role];
      const response = await api.post('/auth/login', { email, password: 'Password123!' });
      if (response.data?.success) {
        setUser(response.data.data.user);
        toast({ type: 'success', title: 'Switched Role', description: `Now logged in as ${response.data.data.user.name} (${role})` });
        window.location.href = '/';
      }
    } catch (err) {
      toast({ type: 'error', title: 'Role switch failed', description: 'Ensure the backend is running and seeded.' });
    } finally {
      setIsLoading(false);
    }
  };

  const hasPermission = (permission: string): boolean => {
    if (!user) return false;
    const { ROLE_PERMISSIONS } = require("../rbac/roles");
    return ROLE_PERMISSIONS[user.role]?.includes(permission) ?? false;
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, switchUser, hasPermission, register }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
