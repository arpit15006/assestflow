"use client";

import { SectionCard } from "@/shared/components";
import { motion } from "framer-motion";
import { progressAnimation } from "@/shared/lib/animations";
import type { TopAsset } from "@/shared/types";

interface TopAssetsListProps {
  data: TopAsset[];
}

export function TopAssetsList({ data }: TopAssetsListProps) {
  return (
    <SectionCard title="Top Used Assets" subtitle="Highest utilization rate this period">
      <div className="space-y-4">
        {data.map((asset, index) => (
          <div key={asset.id} className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 min-w-0">
                <span className="text-xs text-zinc-500 font-mono w-5 text-right flex-shrink-0">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-zinc-950 truncate">{asset.name}</p>
                  <p className="text-[11px] text-zinc-500">{asset.department} · {asset.bookings} bookings</p>
                </div>
              </div>
              <span className="text-sm font-semibold text-zinc-950 flex-shrink-0 ml-3">{asset.utilization}%</span>
            </div>
            <div className="ml-8 h-1.5 rounded-full bg-muted overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{
                  background: asset.utilization >= 85
                    ? "linear-gradient(90deg, #22C55E, #16a34a)"
                    : asset.utilization >= 70
                    ? "linear-gradient(90deg, #4F46E5, #6366f1)"
                    : "linear-gradient(90deg, #F59E0B, #d97706)",
                }}
                initial={progressAnimation.initial}
                animate={progressAnimation.animate(asset.utilization)}
              />
            </div>
          </div>
        ))}
      </div>
    </SectionCard>
  );
}
