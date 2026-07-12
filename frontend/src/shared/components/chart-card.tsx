"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { chartFadeIn } from "@/shared/lib/animations";

interface ChartCardProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
  headerAction?: React.ReactNode;
}

export function ChartCard({
  title,
  subtitle,
  children,
  className,
  headerAction,
}: ChartCardProps) {
  return (
    <motion.div variants={chartFadeIn} initial="hidden" animate="visible">
      <Card
        className={cn(
          "border-zinc-200 bg-white rounded-2xl overflow-hidden",
          className
        )}
      >
        <CardHeader className="pb-2 px-6 pt-6">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <CardTitle className="text-base font-semibold text-zinc-950">
                {title}
              </CardTitle>
              {subtitle && (
                <p className="text-xs text-zinc-500">{subtitle}</p>
              )}
            </div>
            {headerAction && (
              <div className="flex items-center gap-2 flex-shrink-0">
                {headerAction}
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent className="px-6 pb-6">{children}</CardContent>
      </Card>
    </motion.div>
  );
}
