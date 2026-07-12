"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { staggerContainer } from "@/shared/lib/animations";
import { PageHeader, ExportDropdown, ConfirmationDialog } from "@/shared/components";
import { Button } from "@/components/ui/Button";
import { FileBarChart, Lock } from "lucide-react";
import { AuditOverviewCard } from "./components/audit-overview-card";
import { VerificationTable } from "./components/verification-table";
import { DiscrepancySummary } from "./components/discrepancy-summary";
import { useAuditStore } from "./store/audit-store";
import { auditApi } from "@/lib/api/audit";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

export default function AuditPage() {
  const [showCloseDialog, setShowCloseDialog] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const { overview, assets, timeline, isLoading, fetchAudit, closeAudit } = useAuditStore();

  useEffect(() => {
    fetchAudit();
  }, [fetchAudit]);

  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async (format: "pdf" | "excel" | "csv") => {
    setIsExporting(true);
    toast.loading(`Exporting as ${format.toUpperCase()}...`, { id: "export" });
    try {
      const { exportCsv, exportExcel, exportPdf } = await import("./utils/export");
      if (format === "csv") await exportCsv(assets);
      else if (format === "excel") await exportExcel(assets);
      else if (format === "pdf" && overview) await exportPdf(overview, assets, timeline);
      
      toast.success(`Exported ${format.toUpperCase()} successfully`, { id: "export" });
    } catch (e) {
      toast.error(`Failed to export ${format.toUpperCase()}`, { id: "export" });
    } finally {
      setIsExporting(false);
    }
  };

  const handleCloseAudit = async () => {
    setIsClosing(true);
    try {
      await closeAudit();
      toast.success("Audit closed successfully");
      setShowCloseDialog(false);
    } catch (e) {
      toast.error("Failed to close audit");
    } finally {
      setIsClosing(false);
    }
  };

  const handleGenerateReport = async () => {
    setIsGenerating(true);
    toast.info("Generating report...");
    try {
      await auditApi.generateReport();
      toast.success("Report generated and downloaded");
    } catch (e) {
      toast.error("Failed to generate report");
    } finally {
      setIsGenerating(false);
    }
  };

  if (isLoading || !overview) {
    return (
      <div className="space-y-6 w-full p-6 lg:p-8">
        <Skeleton className="h-24 w-full rounded-xl" />
        <Skeleton className="h-[400px] w-full rounded-xl" />
      </div>
    );
  }

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="space-y-6 w-full"
    >
      {/* Header */}
      <PageHeader
        title="Audit Cycle"
        subtitle="Track, verify and close organizational asset audits."
      >
        <ExportDropdown onExport={handleExport} disabled={isExporting} />
        <Button
          variant="outline"
          size="sm"
          disabled={isGenerating}
          onClick={handleGenerateReport}
          className="h-9 border-zinc-200 bg-zinc-50 hover:bg-zinc-100 rounded-lg gap-2 text-sm"
        >
          <FileBarChart className="h-4 w-4" />
          {isGenerating ? "Generating..." : "Generate Report"}
        </Button>
        <Button
          size="sm"
          disabled={overview.status === "completed"}
          className="h-9 bg-danger hover:bg-danger/90 text-white rounded-lg gap-2 text-sm"
          onClick={() => setShowCloseDialog(true)}
        >
          <Lock className="h-4 w-4" />
          Close Audit
        </Button>
      </PageHeader>

      {/* Audit Overview */}
      <AuditOverviewCard data={overview} />

      {/* Verification Table */}
      <VerificationTable data={assets} />

      {/* Bottom Panel */}
      <DiscrepancySummary stats={overview.stats} timeline={timeline} />

      {/* Close Audit Confirmation */}
      <ConfirmationDialog
        open={showCloseDialog}
        onOpenChange={setShowCloseDialog}
        title="Close Audit Cycle"
        description="This will finalize the audit cycle. Pending assets will be marked as unverified and records will be locked. This action cannot be undone."
        confirmLabel={isClosing ? "Closing..." : "Close Audit"}
        onConfirm={handleCloseAudit}
        variant="destructive"
      />
    </motion.div>
  );
}
