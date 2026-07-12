import * as React from "react";
import { Eye, EyeOff } from "lucide-react";
import { Input } from "../ui/Input";

export interface PasswordInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean | string;
}

const PasswordInput = React.forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ className = "", error, ...props }, ref) => {
    const [showPassword, setShowPassword] = React.useState(false);

    const togglePasswordVisibility = () => {
      setShowPassword((prev) => !prev);
    };

    return (
      <div className="relative">
        <Input
          type={showPassword ? "text" : "password"}
          className={`pr-10 ${className}`}
          ref={ref}
          error={error}
          {...props}
        />
        <button
          type="button"
          onClick={togglePasswordVisibility}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 rounded-sm transition-colors"
          aria-label={showPassword ? "Hide password" : "Show password"}
        >
          {showPassword ? (
            <EyeOff className="h-4 w-4" />
          ) : (
            <Eye className="h-4 w-4" />
          )}
        </button>
      </div>
    );
  }
);
PasswordInput.displayName = "PasswordInput";

export { PasswordInput };
