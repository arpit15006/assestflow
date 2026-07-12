"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "../ui/Card";
import { LoginHeader } from "./LoginHeader";
import { LoginForm } from "./LoginForm";
import { LoginFooter } from "./LoginFooter";
import { SignupForm } from "./SignupForm";
import { Logo } from "../ui/Logo";

export function LoginCard() {
  const [isRegistering, setIsRegistering] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const handleLoginSuccess = (data: any) => {
    console.log("Logged in data:", data);
    window.location.href = "/";
  };

  const handleRegistrationSuccess = () => {
    // On registration success, flip back to login form
    setIsRegistering(false);
  };

  return (
    <div className="w-full max-w-[440px] px-4 [perspective:1000px]">
      <motion.div
        animate={{ rotateY: isRegistering ? 180 : 0 }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
        style={{ transformStyle: "preserve-3d" }}
        className="relative w-full"
      >
        {/* FRONT SIDE (Login) */}
        <div 
          style={{ backfaceVisibility: "hidden" }}
          className={isRegistering ? "absolute inset-0 w-full h-full pointer-events-none invisible" : "relative w-full"}
        >
          <Card className="border border-zinc-200/80 bg-white">
            <CardContent className="pt-8 sm:pt-10 space-y-7">
              <LoginHeader />
              <LoginForm
                onSuccess={handleLoginSuccess}
                loading={loading}
                setLoading={setLoading}
              />
              <LoginFooter
                onCreateAccount={() => setIsRegistering(true)}
                loading={loading}
              />
            </CardContent>
          </Card>
        </div>

        {/* BACK SIDE (Signup) */}
        <div 
          style={{ 
            backfaceVisibility: "hidden", 
            transform: "rotateY(180deg)"
          }}
          className={isRegistering ? "relative w-full" : "absolute inset-0 w-full h-full pointer-events-none invisible"}
        >
          <Card className="border border-zinc-200/80 bg-white">
            <CardContent className="pt-8 sm:pt-10 space-y-6">
              {/* Header */}
              <div className="flex flex-col items-center space-y-3 text-center">
                <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-zinc-50 border border-zinc-200 shadow-xs">
                  <Logo className="w-7 h-7 text-primary" />
                </div>
                <div className="space-y-1">
                  <h2 className="text-xl font-bold tracking-tight text-zinc-950 font-heading">
                    Create Workspace Account
                  </h2>
                  <p className="text-xs text-zinc-500 font-medium leading-normal">
                    Get started with your Employee portal
                  </p>
                </div>
              </div>

              <SignupForm 
                onSuccess={handleRegistrationSuccess}
                onBackToLogin={() => setIsRegistering(false)}
              />
            </CardContent>
          </Card>
        </div>
      </motion.div>
    </div>
  );
}
