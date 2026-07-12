"use client";

import { cn } from "@/lib/utils";
import { relativeTime } from "@/shared/lib/utils";
import type { TimelineEvent } from "@/shared/types";

interface TimelineProps {
  events: TimelineEvent[];
  className?: string;
}

export function Timeline({ events, className }: TimelineProps) {
  return (
    <div className={cn("relative space-y-0", className)}>
      {events.map((event, index) => (
        <div key={event.id} className="relative flex gap-4 pb-6 last:pb-0">
          {index < events.length - 1 && (
            <div className="absolute left-[11px] top-6 bottom-0 w-px bg-border/50" />
          )}
          <div className="relative z-10 flex-shrink-0 mt-1.5">
            <div className="h-[9px] w-[9px] rounded-full bg-primary ring-4 ring-background" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-zinc-950 leading-snug">{event.title}</p>
            <p className="text-xs text-zinc-500 mt-0.5 leading-relaxed">{event.description}</p>
            <div className="flex items-center gap-2 mt-1.5">
              <span className="text-[11px] text-zinc-500/70">{relativeTime(event.timestamp)}</span>
              {event.actor && (
                <>
                  <span className="text-zinc-500/30">·</span>
                  <span className="text-[11px] text-zinc-500/70">{event.actor}</span>
                </>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
