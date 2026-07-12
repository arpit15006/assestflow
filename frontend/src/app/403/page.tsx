import Link from "next/link";
import { ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function AccessDeniedPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-6 text-center">
      <div className="flex max-w-md flex-col items-center gap-6">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10 text-destructive animate-pulse">
          <ShieldAlert className="h-8 w-8" />
        </div>

        <div className="space-y-2">
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
            403 - Access Denied
          </h1>
          <p className="text-sm text-muted-foreground">
            You do not have the required permissions to access this module. Please contact your organization administrator if you believe this is an error.
          </p>
        </div>

        <div className="flex gap-3">
          <Link href="/">
            <Button size="sm" className="font-semibold shadow-xs">
              Go to Dashboard
            </Button>
          </Link>
          <Link href="/login">
            <Button size="sm" variant="outline" className="font-semibold">
              Sign In as Another User
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
