"use client";

import { LoginCard } from "@/components/auth/LoginCard";
import { Logo } from "@/components/ui/Logo";
import { Layers, CalendarRange, Wrench, ShieldCheck, CheckCircle2 } from "lucide-react";

import * as React from "react";

const FEATURES = [
  {
    icon: Layers,
    title: "Asset Lifecycle Management",
    description: "Track custody, transfers, history, and real-time statuses from acquisition to disposal."
  },
  {
    icon: CalendarRange,
    title: "Smart Resource Booking",
    description: "Schedule meeting rooms, dispatch fleet vehicles, and allocate devices with live conflict detection."
  },
  {
    icon: Wrench,
    title: "Maintenance Workflow & Approvals",
    description: "Submit repairs, delegate tickets, and log work reports through a fully stateful Kanban pipeline."
  }
];

export default function LoginPage() {
  React.useEffect(() => {
    document.documentElement.classList.add("overflow-hidden");
    document.body.classList.add("overflow-hidden");
    return () => {
      document.documentElement.classList.remove("overflow-hidden");
      document.body.classList.remove("overflow-hidden");
    };
  }, []);

  return (
    <div className="min-h-screen lg:h-screen lg:overflow-hidden flex flex-col lg:flex-row bg-zinc-50/40 relative font-sans select-none">
      
      {/* Decorative Orbs for Background */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-primary/5 blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-zinc-200/40 blur-3xl pointer-events-none" />

      {/* LEFT SIDE: Branding Section (53% width on large screens) */}
      <div className="hidden lg:flex lg:w-[53%] lg:h-full lg:overflow-hidden flex-col justify-between p-8 sm:p-12 lg:p-16 bg-white border-b lg:border-b-0 lg:border-r border-zinc-200/80 relative z-10 shrink-0">
        
        {/* Logo and Brand Name */}
        <div className="flex items-center gap-3">
          <Logo className="h-8.5 w-8.5 text-primary shrink-0" />
          <span className="font-bold text-zinc-950 text-lg tracking-tight">
            AssetFlow
          </span>
        </div>

        {/* Branding Core Content */}
        <div className="my-auto py-12 lg:py-0 max-w-lg space-y-8">
          <div className="space-y-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-primary/10 text-primary rounded-full text-[10px] font-bold uppercase tracking-wider">
              <ShieldCheck className="w-3.5 h-3.5" />
              SaaS Enterprise ERP
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-[40px] font-bold text-zinc-950 tracking-tight leading-[1.1] font-heading">
              Enterprise Asset Management Made Simple.
            </h1>
            <p className="text-sm text-zinc-500 font-medium leading-relaxed">
              AssetFlow consolidates hardware tracking, shared resource scheduling, and maintenance dispatching into a unified cloud workspace.
            </p>
          </div>

          {/* Highlights Grid */}
          <div className="space-y-5">
            {FEATURES.map((feat, i) => {
              const FeatIcon = feat.icon;
              return (
                <div key={i} className="flex gap-4 items-start group">
                  <div className="w-10 h-10 rounded-xl bg-zinc-50 border border-zinc-200 flex items-center justify-center shrink-0 group-hover:border-primary/30 group-hover:bg-primary/[0.02] transition-colors">
                    <FeatIcon className="w-5 h-5 text-zinc-600 group-hover:text-primary transition-colors" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-zinc-900 leading-tight">
                      {feat.title}
                    </h3>
                    <p className="text-xs text-zinc-500 font-medium leading-relaxed mt-1">
                      {feat.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer Brand Info */}
        <div className="text-[10px] text-zinc-400 font-medium flex items-center gap-1">
          <CheckCircle2 className="w-3.5 h-3.5 text-primary/60" />
          <span>Trusted by modern operations, engineering, and logistics teams globally.</span>
        </div>

      </div>

      {/* RIGHT SIDE: Authentication Card Section (47% width on large screens) */}
      <div className="flex-1 lg:h-full lg:overflow-y-auto flex items-center justify-center p-6 sm:p-12 lg:p-16 relative z-10 min-h-[500px]">
        <main className="w-full max-w-[460px] flex items-center justify-center">
          <LoginCard />
        </main>
      </div>

    </div>
  );
}
