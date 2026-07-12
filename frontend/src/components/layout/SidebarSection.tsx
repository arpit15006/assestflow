import * as React from "react";

interface SidebarSectionProps {
  title?: string;
  children: React.ReactNode;
  collapsed?: boolean;
}

export function SidebarSection({ title, children, collapsed = false }: SidebarSectionProps) {
  return (
    <div className="space-y-1.5">
      {title && !collapsed && (
        <h3 className="px-3 text-[10px] font-bold uppercase tracking-wider text-zinc-400">
          {title}
        </h3>
      )}
      <div className="space-y-0.5">{children}</div>
    </div>
  );
}
