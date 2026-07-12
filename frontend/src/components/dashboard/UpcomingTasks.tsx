"use client";

import * as React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/Card";
import { mockUpcomingTasks } from "@/lib/mock/dashboard";
import { Checkbox } from "../ui/Checkbox";
import { Calendar, AlertCircle } from "lucide-react";

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
        return "text-red-700 bg-red-50 border-red-100";
      case "Medium":
        return "text-amber-700 bg-amber-50 border-amber-100";
      default:
        return "text-zinc-600 bg-zinc-50 border-zinc-100";
    }
  };

  return (
    <Card className="flex flex-col h-full">
      <CardHeader className="border-b border-zinc-100 px-6 py-4 flex flex-row items-center justify-between">
        <CardTitle className="text-sm font-bold text-zinc-900 tracking-tight">
          Today's Schedule & Tasks
        </CardTitle>
        <Calendar className="h-4.5 w-4.5 text-zinc-400" />
      </CardHeader>

      <CardContent className="p-4 sm:p-5 flex-1 overflow-y-auto">
        <div className="space-y-3">
          {mockUpcomingTasks.map((task) => {
            const isCompleted = !!taskStates[task.id];
            return (
              <div
                key={task.id}
                className={`flex items-start gap-3 p-3 rounded-xl border border-zinc-100/80 bg-white shadow-3xs transition-all duration-150
                  ${isCompleted ? "opacity-60 bg-zinc-50/50" : ""}
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
                    className={`text-xs font-semibold text-zinc-800 leading-normal block cursor-pointer select-none
                      ${isCompleted ? "line-through text-zinc-400" : ""}
                    `}
                  >
                    {task.title}
                  </label>
                  <div className="flex flex-wrap items-center gap-2 text-[10px] text-zinc-400 font-medium">
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
