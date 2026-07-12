import * as React from "react";
import { Logo } from "../ui/Logo";

export function LoginHeader() {
  return (
    <div className="flex flex-col items-center space-y-3.5 text-center select-none font-sans">
      {/* Brand Icon Circle */}
      <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-zinc-50 border border-zinc-200 shadow-xs">
        <Logo className="w-7 h-7 text-primary" />
      </div>
      
      <div className="space-y-1">
        <h2 className="text-xl font-bold tracking-tight text-zinc-950 font-heading">
          Welcome Back
        </h2>
        <p className="text-xs text-zinc-500 font-medium leading-normal">
          Enter your credentials to access your ERP dashboard
        </p>
      </div>
    </div>
  );
}
