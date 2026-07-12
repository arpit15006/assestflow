"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { staggerContainer } from "@/shared/lib/animations";
import { PageHeader, ExportDropdown, ConfirmationDialog } from "@/shared/components";
import { Button } from "@/components/ui/Button";
import { FileBarChart, Lock } from "lucide-react";
import { AuditOverviewCard } from "./components/audit-overview-card";
import { VerificationTable } from "./components/verification-table";
import { DiscrepancySummary } from "./components/discrepancy-summary";
import { auditOverview, auditAssets, auditTimeline } from "./data/mock-data";

export default function AuditPage() {
  const [showCloseDialog, setShowCloseDialog] = useState(false);

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="space-y-8 p-6 lg:p-8 max-w-[1600px] mx-auto"
    >
      {/* Header */}
      <PageHeader
        title="Audit Cycle"
        subtitle="Track, verify and close organizational asset audits."
      >
        <ExportDropdown />
        <Button
          variant="outline"
          size="sm"
          className="h-9 border-zinc-200 bg-zinc-50 hover:bg-zinc-100 rounded-lg gap-2 text-sm"
        >
          <FileBarChart className="h-4 w-4" />
          Generate Report
        </Button>
        <Button
          size="sm"
          className="h-9 bg-danger hover:bg-danger/90 text-white rounded-lg gap-2 text-sm"
          onClick={() => setShowCloseDialog(true)}
        >
          <Lock className="h-4 w-4" />
          Close Audit
        </Button>
      </PageHeader>

      {/* Audit Overview */}
      <AuditOverviewCard data={auditOverview} />

      {/* Verification Table */}
      <VerificationTable data={auditAssets} />

      {/* Bottom Panel */}
      <DiscrepancySummary stats={auditOverview.stats} timeline={auditTimeline} />

      {/* Close Audit Confirmation */}
      <ConfirmationDialog
        open={showCloseDialog}
        onOpenChange={setShowCloseDialog}
        title="Close Audit Cycle"
        description="This will finalize the Q3 2025 audit cycle. 416 pending assets will be marked as unverified. This action cannot be undone."
        confirmLabel="Close Audit"
        onConfirm={() => setShowCloseDialog(false)}
        variant="destructive"
      />
    </motion.div>
  );
}
