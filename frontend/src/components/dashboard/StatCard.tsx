import * as React from "react";
import { Card, CardContent } from "../ui/Card";
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
    <Card className="hover:border-zinc-300 transition-all hover:shadow-xs group duration-200">
      <CardContent className="p-5 flex flex-col justify-between h-full space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
            {title}
          </span>
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-50 border border-zinc-100 text-zinc-400 group-hover:bg-primary/5 group-hover:text-primary group-hover:border-primary/10 transition-colors">
            <IconComponent className="h-4.5 w-4.5" />
          </div>
        </div>

        <div className="space-y-1">
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-zinc-950 tracking-tight">
              {value}
            </span>
            {trend && (
              <span
                className={`text-xs font-semibold ${
                  trend.startsWith("+") ? "text-green-600" : "text-red-600"
                }`}
              >
                {trend}
              </span>
            )}
          </div>
          {description && (
            <p className="text-[11px] text-zinc-400 font-medium">
              {description}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
