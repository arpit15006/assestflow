import * as React from "react";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean | string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className = "", type, error, ...props }, ref) => {
    return (
      <input
        type={type}
        className={`flex h-10 w-full rounded-md border bg-white px-3 py-2 text-sm ring-offset-background transition-all file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50
          ${
            error
              ? "border-destructive focus-visible:ring-2 focus-visible:ring-destructive/30 focus-visible:border-destructive"
              : "border-zinc-200 hover:border-zinc-300 focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:border-primary"
          }
          ${className}`}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };
