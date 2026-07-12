"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { ChartCard } from "@/shared/components";

interface DeptUtilizationChartProps {
  data: { name: string; utilization: number; total: number }[];
}

function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number; payload: { total: number } }>; label?: string }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-zinc-200 bg-white px-4 py-3 shadow-xl">
      <p className="text-sm font-medium text-zinc-950 mb-1">{label}</p>
      <p className="text-xs text-zinc-500">
        Utilization: <span className="text-zinc-950 font-medium">{payload[0].value}%</span>
      </p>
      <p className="text-xs text-zinc-500">
        Total Assets: <span className="text-zinc-950 font-medium">{payload[0].payload.total}</span>
      </p>
    </div>
  );
}

export function DeptUtilizationChart({ data }: DeptUtilizationChartProps) {
  const getBarColor = (utilization: number) => {
    if (utilization >= 85) return "#22C55E";
    if (utilization >= 70) return "#4F46E5";
    if (utilization >= 55) return "#F59E0B";
    return "#EF4444";
  };

  return (
    <ChartCard title="Department Utilization" subtitle="Asset usage across departments">
      <div className="h-[300px] mt-4">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 4, right: 8, left: -12, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#27272A" strokeOpacity={0.5} vertical={false} />
            <XAxis
              dataKey="name"
              tick={{ fill: "#A1A1AA", fontSize: 12 }}
              axisLine={{ stroke: "#27272A" }}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: "#A1A1AA", fontSize: 12 }}
              axisLine={false}
              tickLine={false}
              domain={[0, 100]}
              tickFormatter={(v) => `${v}%`}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(79, 70, 229, 0.06)" }} />
            <Bar dataKey="utilization" radius={[6, 6, 0, 0]} maxBarSize={48}>
              {data.map((entry, index) => (
                <Cell key={index} fill={getBarColor(entry.utilization)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </ChartCard>
  );
}
