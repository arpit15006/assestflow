import { Metadata } from "next";
import { LoginCard } from "@/components/auth/LoginCard";

export const metadata: Metadata = {
  title: "Sign In - AssetFlow AI",
  description: "Sign in to manage and schedule your enterprise resources and assets with AssetFlow AI.",
};

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-zinc-50/50 py-12 sm:px-6 lg:px-8">
      <main className="w-full flex items-center justify-center">
        <LoginCard />
      </main>
    </div>
  );
}
