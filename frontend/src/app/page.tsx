import { Metadata } from "next";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { DashboardPageClient } from "@/components/dashboard/DashboardPageClient";

export const metadata: Metadata = {
  title: "Dashboard - AssetFlow",
  description: "Enterprise asset tracking, allocation, and resource bookings overview.",
};

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <DashboardPageClient />
    </DashboardLayout>
  );
}
