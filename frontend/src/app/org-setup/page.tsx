import { Metadata } from "next";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import OrganizationPage from "@/features/organization/page";

export const metadata: Metadata = {
  title: "Organization Setup - AssetFlow AI",
  description: "Configure departments, category warranties, and employee credentials.",
};

export default function Page() {
  return (
    <DashboardLayout>
      <OrganizationPage />
    </DashboardLayout>
  );
}
