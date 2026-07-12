"use client";

import { SectionCard, StatusBadge } from "@/shared/components";
import { formatDate } from "@/shared/lib/utils";
import type { MaintenanceItem, RetirementAsset } from "@/shared/types";
import { Wrench, CalendarClock } from "lucide-react";

interface MaintenanceDueListProps {
  data: MaintenanceItem[];
}

export function MaintenanceDueList({ data }: MaintenanceDueListProps) {
  return (
    <SectionCard title="Maintenance Due" subtitle="Upcoming & overdue maintenance tasks">
      <div className="space-y-3">
        {data.map((item) => (
          <div
            key={item.id}
            className="flex items-center gap-4 p-3.5 rounded-xl bg-zinc-50/50 border border-zinc-200/50 hover:border-zinc-200 transition-colors"
          >
            <div className="rounded-lg bg-warning-muted p-2">
              <Wrench className="h-4 w-4 text-amber-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-zinc-950 truncate">{item.asset}</p>
              <p className="text-[11px] text-zinc-500">{item.type} · Due {formatDate(item.dueDate)}</p>
            </div>
            <StatusBadge status={item.priority} />
          </div>
        ))}
      </div>
    </SectionCard>
  );
}

interface RetirementAssetsListProps {
  data: RetirementAsset[];
}

export function RetirementAssetsList({ data }: RetirementAssetsListProps) {
  return (
    <SectionCard title="Near Retirement" subtitle="Assets approaching end of lifecycle">
      <div className="space-y-3">
        {data.map((asset) => (
          <div
            key={asset.id}
            className="flex items-center gap-4 p-3.5 rounded-xl bg-zinc-50/50 border border-zinc-200/50 hover:border-zinc-200 transition-colors"
          >
            <div className="rounded-lg bg-info-muted p-2">
              <CalendarClock className="h-4 w-4 text-info" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-zinc-950 truncate">{asset.name}</p>
              <p className="text-[11px] text-zinc-500">
                {asset.department} · Retires {formatDate(asset.retirementDate)}
              </p>
            </div>
            <span className="text-sm font-medium text-zinc-950 flex-shrink-0">{asset.currentValue}</span>
          </div>
        ))}
      </div>
    </SectionCard>
  );
}
