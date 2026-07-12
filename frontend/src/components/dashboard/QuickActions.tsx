"use client";

import * as React from "react";
import { Plus, CalendarPlus, ShieldAlert, LucideIcon } from "lucide-react";
import { Card } from "../ui/Card";
import { Button } from "../ui/Button";
import { useRouter } from "next/navigation";

interface QuickActionsProps {
  onRegisterClick?: () => void;
}

export function QuickActions({ onRegisterClick }: QuickActionsProps) {
  const router = useRouter();

  const actions = [
    {
      title: "Register Asset",
      description: "Onboard new hardware or equipment into the registry.",
      icon: Plus,
      actionText: "New Asset",
      onClick: () => onRegisterClick?.(),
    },
    {
      title: "Book Resource",
      description: "Schedule vehicle slots, meeting rooms, or cameras.",
      icon: CalendarPlus,
      actionText: "Reserve",
      onClick: () => router.push("/bookings"),
    },
    {
      title: "Raise Maintenance Request",
      description: "Report damaged assets and schedule repairs.",
      icon: ShieldAlert,
      actionText: "Report Issue",
      onClick: () => router.push("/maintenance"),
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {actions.map((action) => {
        const IconComponent = action.icon;
        return (
          <Card
            key={action.title}
            className="p-5 flex flex-col justify-between h-full space-y-4 hover:border-zinc-300 hover:shadow-xs group duration-200 cursor-default"
          >
            <div className="space-y-2">
              <div className="p-2 bg-muted rounded-lg w-fit group-hover:bg-muted/80 transition-colors text-muted-foreground group-hover:text-foreground">
                <IconComponent className="h-4.5 w-4.5" />
              </div>
              <h4 className="text-sm font-semibold tracking-tight text-foreground">
                {action.title}
              </h4>
              <p className="text-xs text-muted-foreground leading-normal">
                {action.description}
              </p>
            </div>

            <Button
              type="button"
              variant="outline"
              size="sm"
              className="w-full text-xs font-medium border border-border text-foreground hover:bg-muted bg-background shadow-sm active:scale-95 transition-all duration-200"
              onClick={action.onClick}
            >
              {action.actionText}
            </Button>
          </Card>
        );
      })}
    </div>
  );
}
