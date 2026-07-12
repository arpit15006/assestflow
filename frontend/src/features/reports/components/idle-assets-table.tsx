"use client";

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

interface IdleAssetsTableProps {
  data: IdleAsset[];
}

export function IdleAssetsTable({ data }: IdleAssetsTableProps) {
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
            {data.map((asset) => (
              <TableRow key={asset.id} className="border-zinc-200/50 hover:bg-zinc-50/40">
                <TableCell className="py-3 pl-6 text-sm font-medium text-zinc-950">{asset.name}</TableCell>
                <TableCell className="py-3 text-sm text-zinc-500">{asset.department}</TableCell>
                <TableCell className="py-3 text-sm text-zinc-500">{formatDate(asset.lastUsed)}</TableCell>
                <TableCell className={cn("py-3 pr-6 text-sm font-medium text-right", asset.daysIdle > 60 ? "text-red-600" : asset.daysIdle > 30 ? "text-amber-600" : "text-zinc-500")}>
                  {asset.daysIdle}d
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </SectionCard>
  );
}
