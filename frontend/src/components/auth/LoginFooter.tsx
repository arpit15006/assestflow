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
    <div className="flex flex-col space-y-4 font-sans select-none">
      <Separator className="bg-zinc-200/60" />

      <div className="space-y-3.5">
        
        {/* Safe Registration Note */}
        <div className="flex items-start gap-3 rounded-xl border border-zinc-200/60 bg-zinc-50/60 p-3.5 text-left text-zinc-600">
          <Info className="h-4.5 w-4.5 shrink-0 text-zinc-500 mt-0.5" />
          <div className="space-y-0.5">
            <p className="text-xs font-bold text-zinc-900 leading-tight">
              Enterprise Access Restrictions
            </p>
            <p className="text-[10px] leading-normal text-zinc-500 font-medium">
              Self-registered accounts start with Employee permissions. Administrator approval is required for role promotions.
            </p>
          </div>
        </div>

        <Button
          type="button"
          variant="outline"
          className="w-full font-bold py-2 px-4 rounded-xl border border-zinc-200 hover:bg-zinc-50 active:scale-[0.99] transition-all text-xs"
          onClick={onCreateAccount}
          disabled={loading}
        >
          Create Employee Account
        </Button>
      </div>
    </div>
  );
}
