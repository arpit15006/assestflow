import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Label } from "../ui/Label";
import { Checkbox } from "../ui/Checkbox";
import { PasswordInput } from "./PasswordInput";
import { AlertCircle, CheckCircle2 } from "lucide-react";

// Form Validation Schema using Zod
const loginSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Email is required" })
    .email({ message: "Please enter a valid email address" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" }),
  rememberMe: z.boolean(),
});

type LoginSchema = z.infer<typeof loginSchema>;

interface LoginFormProps {
  onSuccess: (data: LoginSchema) => void;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

export function LoginForm({ onSuccess, loading, setLoading }: LoginFormProps) {
  const [submitError, setSubmitError] = React.useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = React.useState<boolean>(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  const rememberMeValue = watch("rememberMe");

  const onSubmit = async (data: LoginSchema) => {
    setLoading(true);
    setSubmitError(null);
    setSubmitSuccess(false);

    try {
      // Simulate API verification call for 1.5 seconds
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Mock success for demonstrations
      setSubmitSuccess(true);
      onSuccess(data);
    } catch (err) {
      setSubmitError("Invalid email or password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
      {/* Mock Submit Success Banner */}
      {submitSuccess && (
        <div
          role="alert"
          className="flex items-center gap-2.5 rounded-lg border border-green-200 bg-green-50 p-3 text-xs text-green-700 font-medium"
        >
          <CheckCircle2 className="h-4 w-4 shrink-0 text-green-600" />
          <span>Authenticated successfully! Redirecting...</span>
        </div>
      )}

      {/* Mock Submit Error Banner */}
      {submitError && (
        <div
          role="alert"
          className="flex items-center gap-2.5 rounded-lg border border-red-200 bg-red-50 p-3 text-xs text-red-700 font-medium"
        >
          <AlertCircle className="h-4 w-4 shrink-0 text-red-600" />
          <span>{submitError}</span>
        </div>
      )}

      {/* Email input field */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="email" className="text-zinc-700 font-medium">
            Email address
          </Label>
        </div>
        <Input
          id="email"
          type="email"
          placeholder="name@company.com"
          autoComplete="email"
          disabled={loading || submitSuccess}
          aria-invalid={errors.email ? "true" : "false"}
          aria-describedby={errors.email ? "email-error" : undefined}
          {...register("email")}
        />
        {errors.email && (
          <p
            id="email-error"
            role="alert"
            className="text-xs text-destructive font-medium"
          >
            {errors.email.message}
          </p>
        )}
      </div>

      {/* Password input field */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="password" className="text-zinc-700 font-medium">
            Password
          </Label>
          <a
            href="#forgot-password"
            className="text-xs text-primary font-medium hover:underline hover:text-primary/95 focus-visible:outline-none focus-visible:underline focus-visible:ring-1 focus-visible:ring-primary/40 rounded-xs"
            onClick={(e) => {
              e.preventDefault();
              alert("Password recovery flow is a frontend mock.");
            }}
          >
            Forgot password?
          </a>
        </div>
        <PasswordInput
          id="password"
          placeholder="••••••••"
          autoComplete="current-password"
          disabled={loading || submitSuccess}
          aria-invalid={errors.password ? "true" : "false"}
          aria-describedby={errors.password ? "password-error" : undefined}
          {...register("password")}
        />
        {errors.password && (
          <p
            id="password-error"
            role="alert"
            className="text-xs text-destructive font-medium"
          >
            {errors.password.message}
          </p>
        )}
      </div>

      {/* Remember me checkbox */}
      <div className="flex items-center space-x-2">
        <Checkbox
          id="rememberMe"
          checked={rememberMeValue}
          onCheckedChange={(checked) =>
            setValue("rememberMe", checked === true, { shouldValidate: true })
          }
          disabled={loading || submitSuccess}
        />
        <Label
          htmlFor="rememberMe"
          className="text-xs text-zinc-600 font-medium cursor-pointer select-none"
        >
          Remember my credentials on this device
        </Label>
      </div>

      <Button
        type="submit"
        className="w-full font-semibold"
        loading={loading}
        disabled={submitSuccess}
      >
        Sign In
      </Button>
    </form>
  );
}
