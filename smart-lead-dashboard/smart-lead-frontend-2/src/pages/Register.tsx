import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, Link } from "react-router-dom";
import { 
  Mail, 
  Lock, 
  User, 
  Eye, 
  EyeOff, 
  Loader2, 
  ArrowRight, 
  AlertCircle 
} from "lucide-react";
import { usePostApiV1AuthRegister } from "../api/generated/authentication/authentication";
import { PostApiV1AuthRegisterBody } from "../api/generated/zod/authentication/authentication";
import { useAuth } from "../components/provider/AuthProvider";
import type { RegisterRequest } from "../api/generated/model/registerRequest";

export default function Register() {
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  // If already authenticated, redirect to home
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/home");
    }
  }, [isAuthenticated, navigate]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterRequest>({
    resolver: zodResolver(PostApiV1AuthRegisterBody),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const { mutate: registerMutate, isPending } = usePostApiV1AuthRegister();

  const onSubmit = (formData: RegisterRequest) => {
    setApiError(null);
    registerMutate(
      { data: formData },
      {
        onSuccess: (response) => {
          if (response.success && response.data.token) {
            login(response.data.token);
            navigate("/home");
          } else {
            setApiError(response.message || "Registration succeeded but no token was returned.");
          }
        },
        onError: (error: any) => {
          console.error("Registration error:", error);
          const message = error?.response?.data?.message || error?.message || "Something went wrong. Please try again.";
          setApiError(message);
        },
      }
    );
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center p-6 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans relative overflow-hidden">
      {/* Ambient background decoration */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-purple-600/5 dark:bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-600/5 dark:bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 w-full max-w-md space-y-6">
        {/* Centered Logo / Header */}
        <div className="flex flex-col items-center justify-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-purple-500 to-indigo-500 shadow-md">
            <span className="text-2xl font-bold text-white tracking-tight">S</span>
          </div>
          <span className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">SmartLead</span>
        </div>

        {/* Center Card */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 rounded-3xl p-8 shadow-xl shadow-slate-100 dark:shadow-none">
          {/* Title */}
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Create an account
            </h2>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-semibold text-purple-600 hover:text-purple-500 dark:text-purple-400 dark:hover:text-purple-300 transition-colors underline underline-offset-4"
              >
                Sign in
              </Link>
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {apiError && (
              <div className="flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-400 animate-in fade-in slide-in-from-top-1 duration-200">
                <AlertCircle className="h-5 w-5 shrink-0 text-red-600 dark:text-red-400" />
                <div>
                  <span className="font-semibold">Failed to register:</span> {apiError}
                </div>
              </div>
            )}

            <div className="space-y-4">
              {/* Full Name */}
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-slate-700 dark:text-slate-300"
                >
                  Full name
                </label>
                <div className="relative mt-1">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                    <User className="h-5 w-5" />
                  </div>
                  <input
                    id="name"
                    type="text"
                    autoComplete="name"
                    placeholder="John Doe"
                    disabled={isPending}
                    {...register("name")}
                    className={`block w-full rounded-xl border bg-white dark:bg-slate-900 py-3 pl-10 pr-4 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-purple-600 transition-all ${
                      errors.name
                        ? "border-red-500 focus:ring-red-500"
                        : "border-slate-200 dark:border-slate-800 focus:ring-purple-600"
                    }`}
                  />
                </div>
                {errors.name && (
                  <p className="mt-1.5 text-xs text-red-600 dark:text-red-400 flex items-center gap-1 pl-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.name.message}
                  </p>
                )}
              </div>

              {/* Email Address */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-slate-700 dark:text-slate-300"
                >
                  Email address
                </label>
                <div className="relative mt-1">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                    <Mail className="h-5 w-5" />
                  </div>
                  <input
                    id="email"
                    type="email"
                    autoComplete="email"
                    placeholder="you@example.com"
                    disabled={isPending}
                    {...register("email")}
                    className={`block w-full rounded-xl border bg-white dark:bg-slate-900 py-3 pl-10 pr-4 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-purple-600 transition-all ${
                      errors.email
                        ? "border-red-500 focus:ring-red-500"
                        : "border-slate-200 dark:border-slate-800 focus:ring-purple-600"
                    }`}
                  />
                </div>
                {errors.email && (
                  <p className="mt-1.5 text-xs text-red-600 dark:text-red-400 flex items-center gap-1 pl-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Password */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-slate-700 dark:text-slate-300"
                >
                  Password
                </label>
                <div className="relative mt-1">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                    <Lock className="h-5 w-5" />
                  </div>
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    placeholder="••••••••"
                    disabled={isPending}
                    {...register("password")}
                    className={`block w-full rounded-xl border bg-white dark:bg-slate-900 py-3 pl-10 pr-10 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-purple-600 transition-all ${
                      errors.password
                        ? "border-red-500 focus:ring-red-500"
                        : "border-slate-200 dark:border-slate-800 focus:ring-purple-600"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    tabIndex={-1}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1.5 text-xs text-red-600 dark:text-red-400 flex items-center gap-1 pl-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.password.message}
                  </p>
                )}
              </div>
            </div>

            {/* Terms Disclaimer */}
            <div className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed text-center">
              By signing up, you agree to our{" "}
              <a href="#" className="underline hover:text-slate-850 dark:hover:text-slate-150">
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="#" className="underline hover:text-slate-855 dark:hover:text-slate-155">
                Privacy Policy
              </a>.
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isPending}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 py-3 px-4 text-sm font-semibold text-white shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer mt-2"
            >
              {isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Creating account...
                </>
              ) : (
                <>
                  Get Started
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
