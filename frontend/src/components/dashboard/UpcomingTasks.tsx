"use client";

import * as React from "react";
import { Card, CardContent } from "../ui/Card";
import { Checkbox } from "../ui/Checkbox";
import { Calendar, Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { bookingsApi } from "@/lib/api/bookings";

const MOCK_TASKS = [
  { id: 'mock-1', title: 'HP LaserJet Pro M404dn calibration', time: '09:00 — Today', asset: 'HP LaserJet Pro M404dn' },
  { id: 'mock-2', title: 'Canon imageRUNNER 2630 paper jam repair', time: '11:00 — Today', asset: 'Canon imageRUNNER 2630' },
  { id: 'mock-3', title: 'Epson WorkForce Pro WF-4820 ink replacement', time: '14:00 — Today', asset: 'Epson WorkForce Pro WF-4820' },
  { id: 'mock-4', title: 'Conference Room A setup', time: '10:00 — Today', asset: 'Conference Room A' },
  { id: 'mock-5', title: 'Xiaomi Projector V1 calibration', time: '15:00 — Today', asset: 'Projector Screen Xiaomi V1' },
  { id: 'mock-6', title: 'MacBook Pro 16" system diagnostic', time: '16:30 — Today', asset: 'MacBook Pro 16"' }
];

export function UpcomingTasks() {
  const [taskStates, setTaskStates] = React.useState<Record<string, boolean>>({});

  const { data: bookingData, isLoading } = useQuery({
    queryKey: ["upcoming-tasks-bookings"],
    queryFn: () => bookingsApi.list(),
  });

  const handleTaskToggle = (id: string, checked: boolean) => {
    setTaskStates((prev) => ({ ...prev, [id]: checked }));
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High": return "text-destructive bg-destructive/5 border-destructive/10 dark:bg-destructive/10";
      case "Medium": return "text-amber-600 bg-amber-500/5 border-amber-500/10 dark:bg-amber-500/10";
      default: return "text-muted-foreground bg-muted border-border";
    }
  };

  // Build task list from upcoming bookings
  const tasks = React.useMemo(() => {
    if (!bookingData) return MOCK_TASKS;
    const items = Array.isArray(bookingData) ? bookingData : [];
    
    // Get today and next 2 days of bookings  
    const now = new Date();
    const twoDaysOut = new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000);
    
    const filtered = items
      .filter((b: any) => {
        const start = new Date(b.startTime);
        return start >= now && start <= twoDaysOut && b.status !== 'CANCELLED';
      })
      .slice(0, 6)
      .map((b: any) => {
        let timeStr = 'All Day';
        try {
          const startDate = new Date(b.startTime);
          if (!isNaN(startDate.getTime())) {
            timeStr = startDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + 
                      ' — ' + startDate.toLocaleDateString([], { month: 'short', day: 'numeric' });
          }
        } catch {}
        return {
          id: b.id,
          title: b.title || b.asset?.name || 'Resource Booking',
          time: timeStr,
          priority: 'Medium',
          asset: b.asset?.name,
        };
      });

    return filtered.length > 0 ? filtered : MOCK_TASKS;
  }, [bookingData]);

  return (
    <Card className="flex flex-col rounded-xl border border-border bg-card shadow-xs">
      <div className="h-16 flex items-center justify-between px-6 border-b border-border">
        <h2 className="text-base font-semibold tracking-tight text-foreground">
          Today's Schedule & Tasks
        </h2>
        <Calendar className="h-4.5 w-4.5 text-muted-foreground" />
      </div>

      <CardContent className="p-5 flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="flex items-center justify-center py-10">
            <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {tasks.map((task) => {
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
                      {task.asset && (
                        <>
                          <span>•</span>
                          <span className="truncate max-w-[120px]">{task.asset}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
