"use client";

import * as React from "react";
import { Card, CardContent } from "../ui/Card";
import { mockUpcomingTasks } from "@/lib/mock/dashboard";
import { Checkbox } from "../ui/Checkbox";
import { Calendar } from "lucide-react";

export function UpcomingTasks() {
  const [taskStates, setTaskStates] = React.useState<Record<string, boolean>>({});

  const handleTaskToggle = (id: string, checked: boolean) => {
    setTaskStates((prev) => ({
      ...prev,
      [id]: checked,
    }));
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High":
        return "text-destructive bg-destructive/5 border-destructive/10 dark:bg-destructive/10";
      case "Medium":
        return "text-amber-600 bg-amber-500/5 border-amber-500/10 dark:bg-amber-500/10";
      default:
        return "text-muted-foreground bg-muted border-border";
    }
  };

  return (
    <Card className="flex flex-col h-full rounded-xl border border-border bg-card shadow-xs">
      <div className="h-16 flex items-center justify-between px-6 border-b border-border">
        <h2 className="text-base font-semibold tracking-tight text-foreground">
          Today's Schedule & Tasks
        </h2>
        <Calendar className="h-4.5 w-4.5 text-muted-foreground" />
      </div>

      <CardContent className="p-5 flex-1 overflow-y-auto">
        <div className="space-y-3">
          {mockUpcomingTasks.map((task) => {
            const isCompleted = !!taskStates[task.id];
            return (
              <div
                key={task.id}
                className={`flex items-start gap-3 p-3 rounded-xl border border-border bg-card shadow-2xs transition-all duration-150
                  ${isCompleted ? "opacity-60 bg-muted/50" : ""}
                `}
              >
                <div className="pt-0.5">
                  <Checkbox
                    id={`task-${task.id}`}
                    checked={isCompleted}
                    onCheckedChange={(checked) => handleTaskToggle(task.id, checked === true)}
                  />
                </div>

                <div className="flex-1 min-w-0 space-y-1">
                  <label
                    htmlFor={`task-${task.id}`}
                    className={`text-xs font-semibold text-foreground leading-normal block cursor-pointer select-none
                      ${isCompleted ? "line-through text-muted-foreground" : ""}
                    `}
                  >
                    {task.title}
                  </label>
                  <div className="flex flex-wrap items-center gap-2 text-[10px] text-muted-foreground font-medium">
                    <span>{task.time}</span>
                    <span>•</span>
                    <span
                      className={`rounded-sm px-1.5 py-0.2 text-[9px] font-semibold border
                        ${getPriorityColor(task.priority)}
                      `}
                    >
                      {task.priority} Priority
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
