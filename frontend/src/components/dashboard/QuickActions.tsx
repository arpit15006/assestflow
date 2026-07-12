"use client";

import * as React from "react";
import { Plus, CalendarPlus, ShieldAlert, LucideIcon } from "lucide-react";
import { Card, CardContent } from "../ui/Card";
import { Button } from "../ui/Button";

interface ActionItem {
  title: string;
  description: string;
  icon: LucideIcon;
  actionText: string;
  onClick: () => void;
}

export function QuickActions() {
  const actions: ActionItem[] = [
    {
      title: "Register Asset",
      description: "Onboard new hardware or equipment into the registry.",
      icon: Plus,
      actionText: "New Asset",
      onClick: () => alert("Register Asset dialog is a mockup."),
    },
    {
      title: "Book Resource",
      description: "Schedule vehicle slots, meeting rooms, or cameras.",
      icon: CalendarPlus,
      actionText: "Reserve",
      onClick: () => alert("Book Resource dialog is a mockup."),
    },
    {
      title: "Raise Maintenance Request",
      description: "Report damaged assets and schedule repairs.",
      icon: ShieldAlert,
      actionText: "Report Issue",
      onClick: () => alert("Raise Maintenance request dialog is a mockup."),
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {actions.map((action) => {
        const IconComponent = action.icon;
        return (
          <Card
            key={action.title}
            className="hover:border-zinc-300 transition-all hover:shadow-xs group duration-200"
          >
            <CardContent className="p-5 flex flex-col justify-between h-full space-y-4">
              <div className="space-y-1.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/5 text-primary">
                  <IconComponent className="h-5 w-5" />
                </div>
                <h4 className="text-sm font-bold text-zinc-800 tracking-tight">
                  {action.title}
                </h4>
                <p className="text-xs text-zinc-500 leading-normal">
                  {action.description}
                </p>
              </div>

              <Button
                type="button"
                variant="outline"
                size="sm"
                className="w-full text-xs font-semibold group-hover:bg-primary group-hover:text-white group-hover:border-primary transition-all duration-200"
                onClick={action.onClick}
              >
                {action.actionText}
              </Button>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
