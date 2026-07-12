"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAuth } from "@/lib/auth/AuthContext";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Label } from "../ui/Label";
import { Checkbox } from "../ui/Checkbox";
import { 
  User, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  Loader2, 
  Info,
  CheckCircle2
} from "lucide-react";

const signupSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().min(1, "Email is required").email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string().min(1, "Please confirm your password"),
  acceptTerms: z.boolean().refine(val => val === true, {
    message: "You must accept the terms of service"
  })
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"]
});

type SignupSchema = z.infer<typeof signupSchema>;

interface SignupFormProps {
  onSuccess: () => void;
  onBackToLogin: () => void;
}

export function SignupForm({ onSuccess, onBackToLogin }: SignupFormProps) {
  const { register: registerUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const {
    register: registerField,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<SignupSchema>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      acceptTerms: false,
    }
  });

  const acceptTermsValue = watch("acceptTerms") || false;

  const onSubmit = async (data: SignupSchema) => {
    setLoading(true);
    setSubmitError(null);
    setSubmitSuccess(false);

    try {
      const fullName = `${data.firstName.trim()} ${data.lastName.trim()}`;
      await registerUser(fullName, data.email, data.password);
      setSubmitSuccess(true);
      setTimeout(() => {
        onSuccess();
      }, 1500);
    } catch (err: any) {
      setSubmitError(err?.message || "Registration failed. Please try again.");
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 text-left" noValidate>
      {/* Submit Success Banner */}
      {submitSuccess && (
        <div
          role="alert"
          className="flex items-center gap-2 rounded-xl border border-emerald-100 bg-emerald-50/50 p-3 text-xs text-emerald-800 font-semibold animate-in fade-in duration-200"
        >
          <CheckCircle2 className="h-4.5 w-4.5 shrink-0 text-emerald-600" />
          <span>Account created successfully! Redirecting...</span>
        </div>
      )}

      {/* Submit Error Banner */}
      {submitError && (
        <div
          role="alert"
          className="flex items-center gap-2 rounded-xl border border-red-100 bg-red-50/50 p-3 text-xs text-red-800 font-semibold animate-in fade-in duration-200"
        >
          <Info className="h-4.5 w-4.5 shrink-0 text-red-600" />
          <span>{submitError}</span>
        </div>
      )}

      {/* Mandatory Role Notification Banner */}
      <div className="flex items-start gap-3 rounded-xl border border-zinc-200/60 bg-zinc-50/60 p-3 text-left text-zinc-600">
        <Info className="h-4.5 w-4.5 shrink-0 text-zinc-500 mt-0.5" />
        <div className="space-y-0.5">
          <p className="text-[11px] font-bold text-zinc-900 leading-tight">
            Employee Role Assigned Automatically
          </p>
          <p className="text-[10px] leading-normal text-zinc-500 font-medium">
            New registrations create an Employee account. Administrators assign elevated privileges later.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* First Name */}
        <div className="space-y-1.5">
          <Label htmlFor="firstName" className="text-zinc-700 font-bold text-xs">First Name</Label>
          <div className="relative">
            <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <Input
              id="firstName"
              type="text"
              placeholder="John"
              disabled={loading || submitSuccess}
              className="pl-10 rounded-xl"
              {...registerField("firstName")}
            />
          </div>
          {errors.firstName && (
            <p className="text-[10px] text-red-500 font-semibold">{errors.firstName.message}</p>
          )}
        </div>

        {/* Last Name */}
        <div className="space-y-1.5">
          <Label htmlFor="lastName" className="text-zinc-700 font-bold text-xs">Last Name</Label>
          <div className="relative">
            <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <Input
              id="lastName"
              type="text"
              placeholder="Doe"
              disabled={loading || submitSuccess}
              className="pl-10 rounded-xl"
              {...registerField("lastName")}
            />
          </div>
          {errors.lastName && (
            <p className="text-[10px] text-red-500 font-semibold">{errors.lastName.message}</p>
          )}
        </div>
      </div>

      {/* Email Address */}
      <div className="space-y-1.5">
        <Label htmlFor="email" className="text-zinc-700 font-bold text-xs">Email Address</Label>
        <div className="relative">
          <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
          <Input
            id="email"
            type="email"
            placeholder="john.doe@company.com"
            disabled={loading || submitSuccess}
            className="pl-10 rounded-xl"
            {...registerField("email")}
          />
        </div>
        {errors.email && (
          <p className="text-[10px] text-red-500 font-semibold">{errors.email.message}</p>
        )}
      </div>

      {/* Password */}
      <div className="space-y-1.5">
        <Label htmlFor="password" className="text-zinc-700 font-bold text-xs">Password</Label>
        <div className="relative">
          <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            disabled={loading || submitSuccess}
            className="pl-10 pr-10 rounded-xl"
            {...registerField("password")}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            disabled={loading || submitSuccess}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 transition-colors focus:outline-none"
          >
            {showPassword ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
          </button>
        </div>
        {errors.password && (
          <p className="text-[10px] text-red-500 font-semibold">{errors.password.message}</p>
        )}
      </div>

      {/* Confirm Password */}
      <div className="space-y-1.5">
        <Label htmlFor="confirmPassword" className="text-zinc-700 font-bold text-xs">Confirm Password</Label>
        <div className="relative">
          <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
          <Input
            id="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            placeholder="••••••••"
            disabled={loading || submitSuccess}
            className="pl-10 pr-10 rounded-xl"
            {...registerField("confirmPassword")}
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            disabled={loading || submitSuccess}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 transition-colors focus:outline-none"
          >
            {showConfirmPassword ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
          </button>
        </div>
        {errors.confirmPassword && (
          <p className="text-[10px] text-red-500 font-semibold">{errors.confirmPassword.message}</p>
        )}
      </div>

      {/* Accept Terms Checkbox */}
      <div className="space-y-1">
        <div className="flex items-start space-x-2.5">
          <Checkbox
            id="acceptTerms"
            checked={acceptTermsValue}
            onCheckedChange={(checked) =>
              setValue("acceptTerms", checked === true, { shouldValidate: true })
            }
            disabled={loading || submitSuccess}
            className="mt-0.5"
          />
          <Label
            htmlFor="acceptTerms"
            className="text-xs text-zinc-500 font-semibold cursor-pointer select-none leading-snug"
          >
            I accept the <a href="#terms" className="text-primary hover:underline font-bold">Terms of Service</a> and <a href="#privacy" className="text-primary hover:underline font-bold">Privacy Policy</a>.
          </Label>
        </div>
        {errors.acceptTerms && (
          <p className="text-[10px] text-red-500 font-semibold mt-1">{errors.acceptTerms.message}</p>
        )}
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        className="w-full font-bold py-2.5 rounded-xl flex items-center justify-center gap-1.5 shadow-sm hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-50 mt-2"
        loading={loading || submitSuccess}
      >
        {loading ? (
          <>
            <Loader2 className="w-4.5 h-4.5 animate-spin" />
            Registering...
          </>
        ) : (
          <>
            Register Workspace Account
            <ArrowRight className="w-4 h-4" />
          </>
        )}
      </Button>

      {/* Back to Login Button */}
      <button
        type="button"
        disabled={loading || submitSuccess}
        onClick={onBackToLogin}
        className="w-full text-center py-2 text-xs font-bold text-zinc-500 hover:text-zinc-800 transition-colors border border-zinc-200/80 rounded-xl bg-zinc-50/50 hover:bg-zinc-50 active:scale-[0.99]"
      >
        Back to Sign In
      </button>
    </form>
  );
}
