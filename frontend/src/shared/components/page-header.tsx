"use client";

import { motion } from "framer-motion";
import { fadeIn } from "@/shared/lib/animations";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
}

export function PageHeader({ title, subtitle, children }: PageHeaderProps) {
  return (
    <motion.div
      variants={fadeIn}
      initial="hidden"
      animate="visible"
      className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
    >
      <div className="space-y-1">
        <h1 className="text-[32px] font-semibold tracking-tight text-zinc-950">
          {title}
        </h1>
        {subtitle && (
          <p className="text-sm text-zinc-500 leading-relaxed">
            {subtitle}
          </p>
        )}
      </div>
      {children && (
        <div className="flex items-center gap-2 flex-shrink-0">{children}</div>
      )}
    </motion.div>
  );
}
