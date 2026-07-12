import * as React from "react";
import { ChevronRight, Home } from "lucide-react";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items?: BreadcrumbItem[];
}

export function Breadcrumbs({ items = [{ label: "Dashboard" }] }: BreadcrumbsProps) {
  return (
    <nav className="flex items-center space-x-1.5 text-sm text-zinc-500 font-medium" aria-label="Breadcrumb">
      <a
        href="#"
        className="flex items-center hover:text-zinc-800 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 rounded-xs"
        onClick={(e) => e.preventDefault()}
      >
        <Home className="h-4 w-4 text-zinc-400" />
        <span className="sr-only">Home</span>
      </a>

      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        return (
          <React.Fragment key={index}>
            <ChevronRight className="h-3.5 w-3.5 text-zinc-300 shrink-0" />
            {isLast ? (
              <span className="text-zinc-900 font-semibold truncate" aria-current="page">
                {item.label}
              </span>
            ) : (
              <a
                href={item.href || "#"}
                className="hover:text-zinc-800 transition-colors truncate focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 rounded-xs"
                onClick={(e) => !item.href && e.preventDefault()}
              >
                {item.label}
              </a>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
}
