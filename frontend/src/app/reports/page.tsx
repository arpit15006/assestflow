import { Metadata } from "next";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import ReportsPage from "@/features/reports/page";

export const metadata: Metadata = {
  title: "Reports & Analytics - AssetFlow AI",
  description: "Monitor asset performance, utilization, and maintenance insights.",
};

export default function Page() {
  return (
    <DashboardLayout>
      <ReportsPage />
    </DashboardLayout>
  );
}
