"use client";

import * as React from "react";
import { AlertCircle, ArrowRight } from "lucide-react";
import { Button } from "../ui/Button";
import { mockNotifications } from "@/lib/mock/notifications";

export function AlertBanner() {
  // Extract overdue returns alert item
  const overdueAlert = mockNotifications.find((n) => n.type === "OVERDUE");

  if (!overdueAlert) return null;

  const handleAction = () => {
    alert("Reminder notification sent to employee! (Mock Operation)");
  };

  return (
    <div
      role="alert"
      className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl border border-red-100 bg-red-50/50 text-red-900 shadow-2xs animate-in fade-in duration-200"
    >
      <div className="flex items-start sm:items-center gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-red-100 text-red-600">
          <AlertCircle className="h-5 w-5" />
        </div>
        <div className="space-y-0.5">
          <h4 className="text-sm font-semibold tracking-tight text-red-950">
            {overdueAlert.title}
          </h4>
          <p className="text-xs text-red-800 leading-normal">
            {overdueAlert.description}
          </p>
        </div>
      </div>

      <div className="flex items-center shrink-0">
        <Button
          type="button"
          size="sm"
          className="bg-red-600 text-white hover:bg-red-700 shadow-xs font-semibold"
          onClick={handleAction}
        >
          <span>Send Reminder</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  );
}
