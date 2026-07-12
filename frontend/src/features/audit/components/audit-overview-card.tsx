"use client";

import { motion } from "framer-motion";
import { staggerItem } from "@/shared/lib/animations";
import { Card, CardContent } from "@/components/ui/Card";
import { Progress } from "@/shared/ui/progress";
import { Avatar, AvatarFallback } from "@/shared/ui/avatar";
import { StatusBadge } from "@/shared/components";
import { formatDate, getInitials } from "@/shared/lib/utils";
import { Calendar, Users } from "lucide-react";
import type { AuditOverview } from "@/shared/types";

interface AuditOverviewCardProps {
  data: AuditOverview;
}

export function AuditOverviewCard({ data }: AuditOverviewCardProps) {
  return (
    <motion.div variants={staggerItem}>
      <Card className="border-zinc-200 bg-white rounded-2xl overflow-hidden">
        <CardContent className="p-6">
          {/* Top row */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <h2 className="text-xl font-semibold text-zinc-950">{data.name}</h2>
                <StatusBadge status={data.status} dot />
              </div>
              <div className="flex items-center gap-4 text-xs text-zinc-500">
                <span className="flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5" />
                  {formatDate(data.startDate)} — {formatDate(data.endDate)}
                </span>
                <span className="flex items-center gap-1.5">
                  <Users className="h-3.5 w-3.5" />
                  {data.department}
                </span>
              </div>
            </div>
            {/* Auditors */}
            <div className="flex items-center -space-x-2">
              {data.auditors.map((auditor) => (
                <Avatar key={auditor.id} className="h-8 w-8 border-2 border-card">
                  <AvatarFallback className="bg-primary/15 text-indigo-600 text-[10px] font-medium">
                    {getInitials(auditor.name)}
                  </AvatarFallback>
                </Avatar>
              ))}
              <div className="pl-3 text-xs text-zinc-500">
                {data.auditors.length} auditors
              </div>
            </div>
          </div>

          {/* Progress */}
          <div className="space-y-2 mb-6">
            <div className="flex items-center justify-between">
              <span className="text-xs text-zinc-500 font-medium">Overall Progress</span>
              <span className="text-sm font-semibold text-zinc-950">{data.progress}%</span>
            </div>
            <div className="relative">
              <Progress value={data.progress} className="h-2 bg-muted" />
            </div>
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <StatMini label="Verified" value={data.stats.verified} color="text-green-600" bgColor="bg-success-muted" />
            <StatMini label="Missing" value={data.stats.missing} color="text-red-600" bgColor="bg-danger-muted" />
            <StatMini label="Damaged" value={data.stats.damaged} color="text-amber-600" bgColor="bg-warning-muted" />
            <StatMini label="Pending" value={data.stats.pending} color="text-zinc-500" bgColor="bg-muted" />
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function StatMini({ label, value, color, bgColor }: { label: string; value: number; color: string; bgColor: string }) {
  return (
    <div className={`rounded-xl ${bgColor} px-4 py-3`}>
      <p className="text-[11px] font-medium text-zinc-500 uppercase tracking-wider mb-1">{label}</p>
      <p className={`text-2xl font-semibold ${color}`}>{value.toLocaleString()}</p>
    </div>
  );
}
