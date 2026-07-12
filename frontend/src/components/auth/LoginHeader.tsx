import * as React from "react";
import { Logo } from "../ui/Logo";

export function LoginHeader() {
  return (
    <div className="flex flex-col items-center space-y-3 text-center">
      {/* AF Logo Avatar shape */}
      <div className="flex items-center justify-center w-16 h-16 rounded-full bg-zinc-50 border border-zinc-100 shadow-inner">
        <Logo className="w-10 h-10" />
      </div>
      <div className="space-y-1.5">
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900">
          AssetFlow AI
        </h1>
        <p className="text-sm text-zinc-500">
          Enterprise Asset & Resource Management
        </p>
      </div>
    </div>
  );
}
