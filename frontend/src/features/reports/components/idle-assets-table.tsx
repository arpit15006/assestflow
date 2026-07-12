"use client";

import { useState } from "react";
import { SectionCard } from "@/shared/components";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/ui/table";
import type { IdleAsset } from "@/shared/types";
import { formatDate } from "@/shared/lib/utils";
import { cn } from "@/lib/utils";
import { AssetDetailsDialog } from "./report-dialogs";

interface IdleAssetsTableProps {
  data: IdleAsset[];
}

export function IdleAssetsTable({ data }: IdleAssetsTableProps) {
  const [selectedAsset, setSelectedAsset] = useState<IdleAsset | null>(null);

  return (
    <SectionCard title="Idle Assets" subtitle="Assets with no recent usage" noPadding>
      <div className="border-t border-zinc-200">
        <Table>
          <TableHeader>
            <TableRow className="border-zinc-200/50 hover:bg-transparent">
              <TableHead className="text-xs font-medium text-zinc-500 uppercase tracking-wider h-9 bg-zinc-50/50 pl-6">Asset</TableHead>
              <TableHead className="text-xs font-medium text-zinc-500 uppercase tracking-wider h-9 bg-zinc-50/50">Dept</TableHead>
              <TableHead className="text-xs font-medium text-zinc-500 uppercase tracking-wider h-9 bg-zinc-50/50">Last Used</TableHead>
              <TableHead className="text-xs font-medium text-zinc-500 uppercase tracking-wider h-9 bg-zinc-50/50 pr-6 text-right">Days Idle</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((asset) => {
              let severityClass = "bg-zinc-100 text-zinc-600";
              if (asset.daysIdle > 60) severityClass = "bg-red-50 text-red-600 ring-1 ring-red-200";
              else if (asset.daysIdle > 30) severityClass = "bg-amber-50 text-amber-600 ring-1 ring-amber-200";

              return (
                <TableRow 
                  key={asset.id} 
                  className="border-zinc-200/50 hover:bg-zinc-50/40 cursor-pointer transition-colors"
                  onClick={() => setSelectedAsset(asset)}
                >
                  <TableCell className="py-3 pl-6 text-sm font-medium text-zinc-950">{asset.name}</TableCell>
                  <TableCell className="py-3 text-sm text-zinc-500">{asset.department}</TableCell>
                  <TableCell className="py-3 text-sm text-zinc-500">{formatDate(asset.lastUsed)}</TableCell>
                  <TableCell className="py-3 pr-6 text-sm font-medium text-right">
                    <span className={cn("px-2 py-1 rounded-md text-xs font-medium inline-block", severityClass)}>
                      {asset.daysIdle} days
                    </span>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
      <AssetDetailsDialog asset={selectedAsset} onClose={() => setSelectedAsset(null)} />
    </SectionCard>
  );
}
