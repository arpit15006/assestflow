"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { ChartCard } from "@/shared/components";

interface MaintenanceChartProps {
  data: { name: string; preventive: number; corrective: number; emergency: number }[];
}

function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ dataKey: string; value: number; color: string }>; label?: string }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-zinc-200 bg-white px-4 py-3 shadow-xl">
      <p className="text-sm font-medium text-zinc-950 mb-2">{label}</p>
      {payload.map((p) => (
        <div key={p.dataKey} className="flex items-center gap-2 text-xs text-zinc-500">
          <span className="h-2 w-2 rounded-full" style={{ backgroundColor: p.color }} />
          <span className="capitalize">{p.dataKey}:</span>
          <span className="text-zinc-950 font-medium">{p.value}</span>
        </div>
      ))}
    </div>
  );
}

export function MaintenanceChart({ data }: MaintenanceChartProps) {
  return (
    <ChartCard title="Maintenance Frequency" subtitle="Maintenance events by category over time">
      <div className="h-[300px] mt-4">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 4, right: 8, left: -12, bottom: 0 }}>
            <defs>
              <linearGradient id="preventiveGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#4F46E5" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="correctiveGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#F59E0B" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="emergencyGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#EF4444" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#EF4444" stopOpacity={0} />
              </linearGradient>
            </defs>
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
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              iconType="circle"
              iconSize={8}
              wrapperStyle={{ paddingTop: "16px", fontSize: "12px", color: "#A1A1AA" }}
            />
            <Area
              type="monotone"
              dataKey="preventive"
              stroke="#4F46E5"
              strokeWidth={2}
              fill="url(#preventiveGrad)"
            />
            <Area
              type="monotone"
              dataKey="corrective"
              stroke="#F59E0B"
              strokeWidth={2}
              fill="url(#correctiveGrad)"
            />
            <Area
              type="monotone"
              dataKey="emergency"
              stroke="#EF4444"
              strokeWidth={2}
              fill="url(#emergencyGrad)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </ChartCard>
  );
}
