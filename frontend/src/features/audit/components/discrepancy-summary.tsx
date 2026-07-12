"use client";

import { SectionCard, Timeline } from "@/shared/components";
import type { AuditOverview, TimelineEvent } from "@/shared/types";
import { AlertTriangle, PackageX, Wrench } from "lucide-react";

interface DiscrepancySummaryProps {
  stats: AuditOverview["stats"];
  timeline: TimelineEvent[];
}

import { useAuditStore } from "../store/audit-store";

export function DiscrepancySummary({ stats, timeline }: DiscrepancySummaryProps) {
  const setFilter = useAuditStore((s) => s.setFilter);

  return (
    <div className="flex flex-col gap-6">
      {/* Discrepancy Cards */}
      <SectionCard title="Discrepancy Summary" subtitle="Assets requiring attention">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <DiscrepancyRow
            icon={PackageX}
            label="Missing Assets"
            count={stats.missing}
            description="Assets not found at expected locations"
            color="text-red-600"
            bgColor="bg-danger-muted"
            onClick={() => setFilter("missing")}
          />
          <DiscrepancyRow
            icon={Wrench}
            label="Damaged Assets"
            count={stats.damaged}
            description="Assets with reported physical damage"
            color="text-amber-600"
            bgColor="bg-warning-muted"
            onClick={() => setFilter("damaged")}
          />
          <DiscrepancyRow
            icon={AlertTriangle}
            label="Location Mismatch"
            count={8}
            description="Assets found at different locations"
            color="text-info"
            bgColor="bg-info-muted"
            onClick={() => setFilter("location_mismatch")}
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
  onClick,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  count: number;
  description: string;
  color: string;
  bgColor: string;
  onClick?: () => void;
}) {
  return (
    <div 
      onClick={onClick}
      className="flex items-center gap-4 p-4 rounded-xl bg-zinc-50/50 border border-zinc-200/50 hover:border-zinc-200 transition-colors cursor-pointer hover:bg-zinc-100"
    >
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
