import { Metadata } from "next";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import AuditPage from "@/features/audit/page";

export const metadata: Metadata = {
  title: "Audit Cycle - AssetFlow",
  description: "Track, verify and close organizational asset audits.",
};

export default function Page() {
  return (
    <DashboardLayout>
      <AuditPage />
    </DashboardLayout>
  );
}
