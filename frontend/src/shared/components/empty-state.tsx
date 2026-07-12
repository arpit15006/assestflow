"use client";

import { motion } from "framer-motion";
import { fadeIn } from "@/shared/lib/animations";
import { PackageOpen } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface EmptyStateProps {
  icon?: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function EmptyState({
  icon: Icon = PackageOpen,
  title,
  description,
  action,
}: EmptyStateProps) {
  return (
    <motion.div
      variants={fadeIn}
      initial="hidden"
      animate="visible"
      className="flex flex-col items-center justify-center py-16 px-4 text-center"
    >
      <div className="rounded-2xl bg-muted/50 p-5 mb-5">
        <Icon className="h-10 w-10 text-zinc-500/60" />
      </div>
      <h3 className="text-base font-semibold text-zinc-950 mb-1.5">{title}</h3>
      <p className="text-sm text-zinc-500 max-w-sm mb-6">{description}</p>
      {action && (
        <Button
          onClick={action.onClick}
          className="bg-primary hover:bg-primary/90 text-indigo-600-foreground"
        >
          {action.label}
        </Button>
      )}
    </motion.div>
  );
}
