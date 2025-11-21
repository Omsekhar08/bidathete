// src/pages/auth/Register.tsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

type FormState = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  acceptTerms: boolean;
};

type FieldErrors = Partial<Record<keyof FormState, string>>;

const initialState: FormState = {
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
  acceptTerms: false,
};

export default function Register(): JSX.Element {
  const [form, setForm] = useState<FormState>(initialState);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const validate = (values: FormState): FieldErrors => {
    const e: FieldErrors = {};
    if (!values.name.trim()) e.name = "Name is required";
    if (!values.email.trim()) e.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email))
      e.email = "Invalid email address";

    if (!values.password) e.password = "Password is required";
    else if (values.password.length < 8)
      e.password = "Password must be at least 8 characters";

    if (!values.confirmPassword) e.confirmPassword = "Please confirm password";
    else if (values.password !== values.confirmPassword)
      e.confirmPassword = "Passwords do not match";

    if (!values.acceptTerms) e.acceptTerms = "You must accept the terms";

    return e;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      setForm((s) => ({ ...(s as any), [name]: (e.target as HTMLInputElement).checked }));
    } else {
      setForm((s) => ({ ...(s as any), [name]: value }));
    }
    // clear field-specific error while typing
    setErrors((prev) => ({ ...prev, [name]: undefined }));
    setServerError(null);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setServerError(null);
    const v = validate(form);
    setErrors(v);
    if (Object.keys(v).length > 0) return;

    setLoading(true);
    try {
      const res = await fetch("/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name.trim(),
          email: form.email.trim().toLowerCase(),
          password: form.password,
        }),
      });

      if (!res.ok) {
        const payload = await res.json().catch(() => null);
        const message =
          (payload && (payload.message || payload.error)) ||
          `Registration failed (${res.status})`;
        throw new Error(message);
      }

      navigate("/login", { replace: true });
    } catch (err: any) {
      setServerError(err?.message || "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#040404] px-4">
      <div className="max-w-2xl  gap-8 items-center">
        {/* Form card */}
        <div className="bg-[#0b0b0b] border border-white/5 rounded-2xl p-8 shadow-xl">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-semibold text-white">Create an account</h1>
              <p className="text-sm text-gray-300">Sign up quickly — it's free.</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-[#D0EF66] flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-6 h-6 text-[#040404]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" d="M12 11c2.21 0 4-1.79 4-4S14.21 3 12 3 8 4.79 8 7s1.79 4 4 4zM6 21v-1a4 4 0 014-4h4a4 4 0 014 4v1" />
              </svg>
            </div>
          </div>

          <form onSubmit={handleSubmit} noValidate>
            {/* name */}
            <div className="mb-4">
              <label htmlFor="name" className="block text-sm text-gray-300 mb-2">
                Full name
              </label>
              <input
                id="name"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Your full name"
                autoComplete="name"
                className={`w-full px-4 py-3 rounded-lg bg-[#040404] border ${
                  errors.name ? "border-red-500" : "border-white/10"
                } text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#D0EF66]/50`}
              />
              {errors.name && (
                <p className="mt-1 text-xs text-red-400" role="alert">
                  {errors.name}
                </p>
              )}
            </div>

            {/* email */}
            <div className="mb-4">
              <label htmlFor="email" className="block text-sm text-gray-300 mb-2">
                Email
              </label>
              <input
                id="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                autoComplete="email"
                type="email"
                className={`w-full px-4 py-3 rounded-lg bg-[#040404] border ${
                  errors.email ? "border-red-500" : "border-white/10"
                } text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#D0EF66]/50`}
              />
              {errors.email && (
                <p className="mt-1 text-xs text-red-400" role="alert">
                  {errors.email}
                </p>
              )}
            </div>

            {/* password */}
            <div className="mb-4 relative">
              <label htmlFor="password" className="block text-sm text-gray-300 mb-2">
                Password
              </label>
              <input
                id="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Minimum 8 characters"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                className={`w-full px-4 py-3 rounded-lg bg-[#040404] border ${
                  errors.password ? "border-red-500" : "border-white/10"
                } text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#D0EF66]/50`}
              />
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                className="absolute right-3 top-9 text-sm text-gray-300 hover:text-gray-100"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
              {errors.password && (
                <p className="mt-1 text-xs text-red-400" role="alert">
                  {errors.password}
                </p>
              )}
            </div>

            {/* confirm password */}
            <div className="mb-4">
              <label htmlFor="confirmPassword" className="block text-sm text-gray-300 mb-2">
                Confirm password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                type="password"
                autoComplete="new-password"
                className={`w-full px-4 py-3 rounded-lg bg-[#040404] border ${
                  errors.confirmPassword ? "border-red-500" : "border-white/10"
                } text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#D0EF66]/50`}
              />
              {errors.confirmPassword && (
                <p className="mt-1 text-xs text-red-400" role="alert">
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            {/* accept terms */}
            <div className="mb-6 flex items-start gap-3">
              <input
                id="acceptTerms"
                name="acceptTerms"
                type="checkbox"
                checked={form.acceptTerms}
                onChange={handleChange}
                className="mt-1 w-4 h-4 rounded border-white/10 bg-[#040404] text-[#D0EF66] focus:ring-2 focus:ring-[#D0EF66]/50"
              />
              <label htmlFor="acceptTerms" className="text-sm text-gray-300">
                I agree to the{" "}
                <a href="/terms" className="text-[#D0EF66] underline">
                  terms
                </a>{" "}
                and{" "}
                <a href="/privacy" className="text-[#D0EF66] underline">
                  privacy policy
                </a>
              </label>
            </div>
            {errors.acceptTerms && (
              <p className="mt-[-12px] mb-3 text-xs text-red-400" role="alert">
                {errors.acceptTerms}
              </p>
            )}

            {/* server error */}
            {serverError && (
              <div className="mb-4 text-sm text-red-400">{serverError}</div>
            )}

            {/* submit */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 rounded-lg font-medium ${
                loading ? "opacity-80 cursor-wait" : "hover:brightness-[0.95]"
              } flex items-center justify-center gap-2 transition`}
              style={{
                background: "linear-gradient(90deg,#D0EF66 0%, #bfe34b 100%)",
                color: "#040404",
              }}
            >
              {loading ? "Creating account..." : "Create account"}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-300">
            Already have an account?{" "}
            <Link to="/login" className="text-[#D0EF66] font-semibold">
              Sign in
            </Link>
          </div>

          <div className="mt-6 text-xs text-gray-500 text-center">
            By signing up you agree to our terms. We will never share your data.
          </div>
        </div>
      </div>
    </div>
  );
}
