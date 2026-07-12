"use client";

import * as React from "react";
import { AlertCircle, ArrowRight } from "lucide-react";
import { Button } from "../ui/Button";
import { mockNotifications } from "@/lib/mock/notifications";

export function AlertBanner() {
  const overdueAlert = mockNotifications.find((n) => n.type === "OVERDUE");

  if (!overdueAlert) return null;

  const handleAction = () => {
    alert("Reminder notification sent to employee! (Mock Operation)");
  };

  return (
    <div
      role="alert"
      className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl border border-destructive/10 bg-destructive/5 text-destructive shadow-2xs animate-in fade-in duration-200"
    >
      <div className="flex items-start sm:items-center gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-destructive/10 text-destructive">
          <AlertCircle className="h-5 w-5" />
        </div>
        <div className="space-y-0.5">
          <h4 className="text-sm font-semibold tracking-tight text-destructive">
            {overdueAlert.title}
          </h4>
          <p className="text-xs text-destructive/80 leading-normal">
            {overdueAlert.description}
          </p>
        </div>
      </div>

      <div className="flex items-center shrink-0">
        <Button
          type="button"
          variant="destructive"
          size="sm"
          className="shadow-sm active:scale-95 transition-all duration-200"
          onClick={handleAction}
        >
          <span>Send Reminder</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  );
}