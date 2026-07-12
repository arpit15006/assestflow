import { Metadata } from "next";
import * as React from "react";

export const metadata: Metadata = {
  title: "Sign In - AssetFlow",
  description: "Sign in to manage and schedule your enterprise resources and assets with AssetFlow.",
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
