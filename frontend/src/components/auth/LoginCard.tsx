"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "../ui/Card";
import { LoginHeader } from "./LoginHeader";
import { LoginForm } from "./LoginForm";
import { LoginFooter } from "./LoginFooter";

export function LoginCard() {
  const [loading, setLoading] = React.useState(false);

  const handleLoginSuccess = (data: any) => {
    console.log("Logged in data:", data);
    window.location.href = "/";
  };

  const handleCreateAccount = () => {
    alert("Create account workflow is a frontend-only mock.");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="w-full max-w-[440px] px-4"
    >
      <Card className="border border-zinc-200/80">
        <CardContent className="pt-8 sm:pt-10 space-y-7">
          <LoginHeader />
          <LoginForm
            onSuccess={handleLoginSuccess}
            loading={loading}
            setLoading={setLoading}
          />
          <LoginFooter
            onCreateAccount={handleCreateAccount}
            loading={loading}
          />
        </CardContent>
      </Card>
    </motion.div>
  );
}
