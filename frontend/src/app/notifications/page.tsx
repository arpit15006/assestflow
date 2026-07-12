import { Metadata } from "next";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import NotificationsPage from "@/features/notifications/page";

export const metadata: Metadata = {
  title: "Notifications - AssetFlow AI",
  description: "Central activity feed for asset management.",
};

export default function Page() {
  return (
    <DashboardLayout>
      <NotificationsPage />
    </DashboardLayout>
  );
}
