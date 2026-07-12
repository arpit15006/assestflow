"use client";

import { SectionCard, Timeline } from "@/shared/components";
import type { AuditOverview, TimelineEvent } from "@/shared/types";
import { AlertTriangle, PackageX, Wrench } from "lucide-react";

interface DiscrepancySummaryProps {
  stats: AuditOverview["stats"];
  timeline: TimelineEvent[];
}

export function DiscrepancySummary({ stats, timeline }: DiscrepancySummaryProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Discrepancy Cards */}
      <SectionCard title="Discrepancy Summary" subtitle="Assets requiring attention">
        <div className="space-y-4">
          <DiscrepancyRow
            icon={PackageX}
            label="Missing Assets"
            count={stats.missing}
            description="Assets not found at expected locations"
            color="text-red-600"
            bgColor="bg-danger-muted"
          />
          <DiscrepancyRow
            icon={Wrench}
            label="Damaged Assets"
            count={stats.damaged}
            description="Assets with reported physical damage"
            color="text-amber-600"
            bgColor="bg-warning-muted"
          />
          <DiscrepancyRow
            icon={AlertTriangle}
            label="Location Mismatch"
            count={8}
            description="Assets found at different locations"
            color="text-info"
            bgColor="bg-info-muted"
          />
        </div>
      </SectionCard>

      {/* Timeline */}
      <SectionCard title="Verification Timeline" subtitle="Recent audit activity">
        <Timeline events={timeline} />
      </SectionCard>
    </div>
  );
}

function DiscrepancyRow({
  icon: Icon,
  label,
  count,
  description,
  color,
  bgColor,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  count: number;
  description: string;
  color: string;
  bgColor: string;
}) {
  return (
    <div className="flex items-center gap-4 p-4 rounded-xl bg-zinc-50/50 border border-zinc-200/50 hover:border-zinc-200 transition-colors">
      <div className={`rounded-xl ${bgColor} p-2.5`}>
        <Icon className={`h-4 w-4 ${color}`} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-zinc-950">{label}</p>
        <p className="text-xs text-zinc-500">{description}</p>
      </div>
      <span className={`text-2xl font-semibold ${color}`}>{count}</span>
    </div>
  );
}
