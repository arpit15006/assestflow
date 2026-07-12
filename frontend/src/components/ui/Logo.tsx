import * as React from "react";

export function Logo({ className = "w-10 h-10", ...props }: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 100"
      className={className}
      fill="none"
      {...props}
    >
      {/* Premium minimal geometric representation of 'A' and 'F' using Odoo Purple */}
      <rect x="10" y="10" width="80" height="80" rx="20" fill="#714B67" />
      <path
        d="M35 70V30H65M35 50H55"
        stroke="#ffffff"
        strokeWidth="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
