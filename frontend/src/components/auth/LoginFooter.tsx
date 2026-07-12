import * as React from "react";
import { Separator } from "../ui/Separator";
import { Button } from "../ui/Button";
import { Info } from "lucide-react";

interface LoginFooterProps {
  onCreateAccount: () => void;
  loading?: boolean;
}

export function LoginFooter({ onCreateAccount, loading }: LoginFooterProps) {
  return (
    <div className="flex flex-col space-y-6">
      <Separator />

      <div className="space-y-4">
        <div className="text-center">
          <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
            New to AssetFlow?
          </span>
        </div>

        {/* Informational Disclaimer Box */}
        <div className="flex items-start gap-3 rounded-lg border border-blue-100 bg-blue-50/40 p-4 text-left text-zinc-600 shadow-2xs">
          <Info className="h-5 w-5 shrink-0 text-blue-600" />
          <div className="space-y-1">
            <p className="text-xs font-semibold text-zinc-800">
              Employee-only Registration
            </p>
            <p className="text-[11px] leading-normal text-zinc-500">
              New signups are registered as standard Employee accounts. Role elevations (e.g. Department Head, Asset Manager) are assigned by an Administrator.
            </p>
          </div>
        </div>

        <Button
          type="button"
          variant="outline"
          className="w-full font-medium"
          onClick={onCreateAccount}
          disabled={loading}
        >
          Create Account
        </Button>
      </div>
    </div>
  );
}
