import { Metadata } from "next";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import AssetsPage from "@/features/assets/page";

export const metadata: Metadata = {
  title: "Asset Directory - AssetFlow AI",
  description: "Track and manage enterprise hardware, office equipment, and resources.",
};

export default function Page() {
  return (
    <DashboardLayout>
      <AssetsPage />
    </DashboardLayout>
  );
}
