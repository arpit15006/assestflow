import * as React from "react";
import { Card } from "../ui/Card";
import { Package, UserCheck, Wrench, Calendar, Repeat, Clock } from "lucide-react";

const iconMap = {
  Package,
  UserCheck,
  Wrench,
  Calendar,
  Repeat,
  Clock,
};

export interface StatCardProps {
  title: string;
  value: number;
  trend?: string;
  description?: string;
  iconName: keyof typeof iconMap;
}

export function StatCard({ title, value, trend, description, iconName }: StatCardProps) {
  const IconComponent = iconMap[iconName];

  return (
    <Card className="p-4 rounded-xl border border-border transition-all bg-card cursor-default group hover:shadow-xs hover:border-zinc-300 duration-200">
      <div className="flex justify-between items-start">
        <span className="text-xs font-medium text-muted-foreground">{title}</span>
        <div className="p-2 bg-muted rounded-lg group-hover:bg-muted/80 transition-colors">
          <IconComponent className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
        </div>
      </div>
      <div className="mt-2">
        <div className="text-2xl font-semibold tracking-tight text-foreground">{value}</div>
        <div className="flex items-center gap-1.5 mt-1">
          {trend && (
            <span
              className={`text-xs font-semibold ${
                trend.startsWith("+") ? "text-green-600" : "text-red-600"
              }`}
            >
              {trend}
            </span>
          )}
          {description && (
            <span className="text-xs text-muted-foreground font-normal">
              {description}
            </span>
          )}
        </div>
      </div>
    </Card>
  );
}
