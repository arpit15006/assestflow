"use client";

import { motion } from "framer-motion";
import { staggerItem } from "@/shared/lib/animations";
import { Card, CardContent } from "@/components/ui/Card";
import { cn } from "@/lib/utils";
import type { StatCardData } from "@/shared/types";
import { formatChange } from "@/shared/lib/utils";
import { ArrowUpRight, ArrowDownRight, Minus } from "lucide-react";

interface StatCardProps extends StatCardData {
  className?: string;
  onClick?: () => void;
  isActive?: boolean;
}

export function StatCard({
  title,
  value,
  change,
  changeLabel,
  icon: Icon,
  trend = "neutral",
  className,
  onClick,
  isActive,
}: StatCardProps) {
  const trendConfig = {
    up: {
      icon: ArrowUpRight,
      color: "text-green-600",
      bg: "bg-success-muted",
    },
    down: {
      icon: ArrowDownRight,
      color: "text-red-600",
      bg: "bg-danger-muted",
    },
    neutral: {
      icon: Minus,
      color: "text-zinc-500",
      bg: "bg-muted",
    },
  };

  const { icon: TrendIcon, color, bg } = trendConfig[trend];

  return (
    <motion.div variants={staggerItem}>
      <Card
        onClick={onClick}
        className={cn(
          "group relative overflow-hidden border-zinc-200 bg-white transition-all duration-300 rounded-2xl",
          onClick && "cursor-pointer hover:shadow-md hover:-translate-y-1",
          isActive ? "ring-2 ring-primary border-primary/50" : "hover:border-zinc-300",
          className
        )}
      >
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div className="space-y-3">
              <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">
                {title}
              </p>
              <p className="text-3xl font-semibold tracking-tight text-zinc-950">
                {value}
              </p>
              {change !== undefined && (
                <div className="flex items-center gap-1.5">
                  <span
                    className={cn(
                      "inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-xs font-medium",
                      bg,
                      color
                    )}
                  >
                    <TrendIcon className="h-3 w-3" />
                    {formatChange(change)}
                  </span>
                  {changeLabel && (
                    <span className="text-xs text-zinc-500">
                      {changeLabel}
                    </span>
                  )}
                </div>
              )}
            </div>
            <div className="rounded-xl bg-indigo-50 p-3 transition-colors group-hover:bg-primary/15">
              <Icon className="h-5 w-5 text-indigo-600" />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
