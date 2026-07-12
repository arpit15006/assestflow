"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAuth } from "../../lib/auth/AuthContext";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Label } from "../ui/Label";
import { Checkbox } from "../ui/Checkbox";
import { 
  AlertCircle, 
  CheckCircle2, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  ChevronDown, 
  Shield, 
  Briefcase, 
  Building2, 
  User, 
  ClipboardCheck, 
  Wrench, 
  ArrowRight,
  Loader2
} from "lucide-react";

// Form Validation Schema
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

interface RoleOption {
  key: string;
  name: string;
  description: string;
  email: string;
  icon: React.ComponentType<any>;
}

const ROLE_OPTIONS: RoleOption[] = [
  {
    key: "ADMIN",
    name: "Administrator",
    description: "Full system administration",
    email: "admin@assetflow.ai",
    icon: Shield
  },
  {
    key: "ASSET_MANAGER",
    name: "Asset Manager",
    description: "Manage assets, allocations and approvals",
    email: "manager@assetflow.ai",
    icon: Briefcase
  },
  {
    key: "DEPARTMENT_HEAD",
    name: "Department Head",
    description: "Manage department operations",
    email: "head@assetflow.ai",
    icon: Building2
  },
  {
    key: "EMPLOYEE",
    name: "Employee",
    description: "View assigned assets and create requests",
    email: "employee@assetflow.ai",
    icon: User
  },
  {
    key: "AUDITOR",
    name: "Auditor",
    description: "Review audit cycles and reports",
    email: "auditor@assetflow.ai",
    icon: ClipboardCheck
  },
  {
    key: "TECHNICIAN",
    name: "Technician",
    description: "Handle maintenance tasks",
    email: "technician@assetflow.ai",
    icon: Wrench
  }
];

export function LoginForm({ onSuccess, loading, setLoading }: LoginFormProps) {
  const { login } = useAuth();
  const [submitError, setSubmitError] = React.useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = React.useState<boolean>(false);
  const [showPassword, setShowPassword] = React.useState(false);
  const [roleDropdownOpen, setRoleDropdownOpen] = React.useState(false);
  const [selectedRole, setSelectedRole] = React.useState<RoleOption | null>(null);
  
  const dropdownRef = React.useRef<HTMLDivElement>(null);

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
  const emailValue = watch("email");
  const passwordValue = watch("password");

  // Close dropdown on outside click
  React.useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setRoleDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  // Update selected role based on manual text typing
  React.useEffect(() => {
    const matchedRole = ROLE_OPTIONS.find(opt => opt.email.toLowerCase() === emailValue.toLowerCase());
    if (matchedRole) {
      setSelectedRole(matchedRole);
    } else if (selectedRole) {
      setSelectedRole(null);
    }
  }, [emailValue]);

  const handleRoleSelect = (option: RoleOption) => {
    setSelectedRole(option);
    setValue("email", option.email, { shouldValidate: true });
    setValue("password", "Password123!", { shouldValidate: true });
    setRoleDropdownOpen(false);
  };

  const onSubmit = async (data: LoginSchema) => {
    setLoading(true);
    setSubmitError(null);
    setSubmitSuccess(false);

    try {
      await login(data.email, data.password);
      setSubmitSuccess(true);
      onSuccess(data);
    } catch (err: any) {
      setSubmitError(err?.message || "Invalid credentials. Please verify and try again.");
    } finally {
      setLoading(false);
    }
  };

  const ActiveIcon = selectedRole ? selectedRole.icon : User;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      {/* Submit Success Banner */}
      {submitSuccess && (
        <div
          role="alert"
          className="flex items-center gap-2 rounded-xl border border-emerald-100 bg-emerald-50/50 p-3 text-xs text-emerald-800 font-semibold animate-in fade-in duration-200"
        >
          <CheckCircle2 className="h-4.5 w-4.5 shrink-0 text-emerald-600" />
          <span>Success! Authenticating session...</span>
        </div>
      )}

      {/* Submit Error Banner */}
      {submitError && (
        <div
          role="alert"
          className="flex items-center gap-2 rounded-xl border border-red-100 bg-red-50/50 p-3 text-xs text-red-800 font-semibold animate-in fade-in duration-200"
        >
          <AlertCircle className="h-4.5 w-4.5 shrink-0 text-red-600" />
          <span>{submitError}</span>
        </div>
      )}

      {/* Premium Enterprise Role Selector */}
      <div className="space-y-1.5 relative" ref={dropdownRef}>
        <Label className="text-zinc-700 font-bold text-xs">Sign In Profile</Label>
        
        <button
          type="button"
          disabled={loading || submitSuccess}
          onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
          className={`w-full flex items-center justify-between px-3.5 py-2.5 bg-white border border-zinc-200 rounded-xl text-left hover:border-zinc-300 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all active:scale-[0.99] disabled:opacity-50`}
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-zinc-50 border border-zinc-200 flex items-center justify-center shrink-0">
              <ActiveIcon className="w-4 h-4 text-zinc-600" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-zinc-950 truncate">
                {selectedRole ? selectedRole.name : "Custom Account"}
              </p>
              <p className="text-[10px] text-zinc-500 font-medium truncate mt-0.5">
                {selectedRole ? selectedRole.description : "Type email to authenticate"}
              </p>
            </div>
          </div>
          <ChevronDown className={`w-4 h-4 text-zinc-400 transition-transform duration-200 shrink-0 ${roleDropdownOpen ? 'rotate-180' : ''}`} />
        </button>

        {roleDropdownOpen && (
          <div className="absolute top-[105%] left-0 right-0 z-50 bg-white border border-zinc-200 shadow-xl rounded-xl p-1.5 max-h-[290px] overflow-y-auto animate-in fade-in-80 slide-in-from-top-1.5 duration-150">
            <p className="px-2.5 py-1.5 text-[9px] font-bold text-zinc-400 uppercase tracking-wider">Choose Demo Role Profile</p>
            {ROLE_OPTIONS.map((opt) => {
              const RoleIcon = opt.icon;
              const isSelected = selectedRole?.key === opt.key;
              return (
                <button
                  key={opt.key}
                  type="button"
                  onClick={() => handleRoleSelect(opt)}
                  className={`w-full flex items-center gap-3 rounded-lg px-2.5 py-2 text-left transition-colors cursor-pointer hover:bg-zinc-50
                    ${isSelected ? 'bg-primary/5 text-primary' : 'text-zinc-700'}
                  `}
                >
                  <div className={`w-7.5 h-7.5 rounded-md border flex items-center justify-center shrink-0
                    ${isSelected ? 'bg-primary/10 border-primary/20 text-primary' : 'bg-zinc-50 border-zinc-100 text-zinc-500'}
                  `}>
                    <RoleIcon className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold truncate">{opt.name}</p>
                    <p className="text-[10px] font-medium text-zinc-400 truncate mt-0.5">{opt.description}</p>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Email input field */}
      <div className="space-y-1.5">
        <Label htmlFor="email" className="text-zinc-700 font-bold text-xs">
          Email Address
        </Label>
        <div className="relative">
          <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
          <Input
            id="email"
            type="email"
            placeholder="name@company.com"
            autoComplete="email"
            disabled={loading || submitSuccess}
            className="pl-10 rounded-xl"
            aria-invalid={errors.email ? "true" : "false"}
            {...register("email")}
          />
        </div>
        {errors.email && (
          <p role="alert" className="text-[10px] text-red-500 font-semibold">{errors.email.message}</p>
        )}
      </div>

      {/* Password input field */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <Label htmlFor="password" className="text-zinc-700 font-bold text-xs">
            Password
          </Label>
          <a
            href="#forgot-password"
            className="text-xs text-primary font-bold hover:underline hover:text-primary/95 focus-visible:outline-none rounded-xs"
            onClick={(e) => {
              e.preventDefault();
              alert("Password recovery workflow is a frontend mock.");
            }}
          >
            Forgot password?
          </a>
        </div>
        <div className="relative">
          <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            autoComplete="current-password"
            disabled={loading || submitSuccess}
            className="pl-10 pr-10 rounded-xl"
            aria-invalid={errors.password ? "true" : "false"}
            {...register("password")}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            disabled={loading || submitSuccess}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 transition-colors focus:outline-none"
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
        {errors.password && (
          <p role="alert" className="text-[10px] text-red-500 font-semibold">{errors.password.message}</p>
        )}
      </div>

      {/* Remember me checkbox */}
      <div className="flex items-center space-x-2 py-0.5">
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
          className="text-xs text-zinc-500 font-bold cursor-pointer select-none"
        >
          Keep me signed in
        </Label>
      </div>

      {/* Primary Sign In Button */}
      <Button
        type="submit"
        className="w-full font-bold py-2.5 rounded-xl flex items-center justify-center gap-1.5 shadow-sm hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-50"
        loading={loading}
        disabled={submitSuccess}
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Verifying Identity...
          </>
        ) : (
          <>
            Sign In to AssetFlow
            <ArrowRight className="w-4 h-4" />
          </>
        )}
      </Button>
    </form>
  );
}
