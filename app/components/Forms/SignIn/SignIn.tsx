"use client";
import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";

import Link from "next/link";
import { useRouter } from "next/navigation";

const steps = [
  {
    label: "Email",
    name: "email",
    type: "email",
    placeholder: "you@example.com",
    autoComplete: "email",
  },
  {
    label: "Password",
    name: "password",
    type: "password",
    placeholder: "Password",
    autoComplete: "current-password",
  },
];

export default function SignIn() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [completed, setCompleted] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const currentStep = useMemo(() => steps[step], [step]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    setError("");
  };

  const validate = (): boolean => {
    const value = form[currentStep.name as keyof typeof form];
    if (!value) {
      setError(`Please enter your ${currentStep.name}.`);
      return false;
    }
    if (currentStep.name === "email" && !/.+@.+\..+/.test(value)) {
      setError("Please enter a valid email.");
      return false;
    }
    return true;
  };

  const handleNext = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    if (step < steps.length - 1) {
      setStep((s) => s + 1);
    } else {
      setLoading(true);
      try {
        const res = await fetch("/api/signin", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });

        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.message || "Invalid credentials");
        }

        setCompleted(true);
        setTimeout(() => router.push("/dashboard"), 1500);
      } catch (err: any) {
        setError(err.message || "Error signing in");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleBack = () => {
    setError("");
    setStep((s) => Math.max(0, s - 1));
  };

  const animationProps = {
    initial: { opacity: 0, y: 40 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -40 },
    transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] as const },
  };

  return (
    <div className="max-w-lg mx-auto">
      <h2 className={`text-2xl font-semibold mb-8 text-center`}>
        Welcome back
      </h2>
      <form className="flex flex-col gap-4 min-h-[220px]" onSubmit={handleNext}>
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="loading"
              {...animationProps}
              className="flex flex-col items-center justify-center min-h-[180px]"
            >
              <div className="animate-spin h-10 w-10 border-4 border-black border-t-transparent rounded-full mb-4" />
              <div className="text-gray-700 text-base font-medium">
                Signing you in…
              </div>
            </motion.div>
          ) : completed ? (
            <motion.div
              key="done"
              {...animationProps}
              className="flex flex-col items-center justify-center min-h-[180px]"
            >
              <div className="text-green-600 text-xl font-semibold mb-2">
                Signed in!
              </div>
              <div className="text-gray-600 text-sm">Redirecting…</div>
            </motion.div>
          ) : (
            <motion.div
              key={step}
              {...animationProps}
              className="flex flex-col gap-4"
            >
              <label
                htmlFor={currentStep.name}
                className="block text-sm font-semibold mb-2"
              >
                {currentStep.label}
              </label>
              <input
                id={currentStep.name}
                name={currentStep.name}
                type={currentStep.type}
                autoComplete={currentStep.autoComplete}
                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:shadow focus:border-black transition duration-150"
                placeholder={currentStep.placeholder}
                value={form[currentStep.name as keyof typeof form]}
                onChange={handleChange}
                required
                autoFocus
              />
              {error && <div className="text-red-500 text-sm">{error}</div>}
              <div className="flex justify-between mt-4">
                <button
                  type="button"
                  onClick={handleBack}
                  disabled={step === 0}
                  className="text-xs text-gray-500 underline disabled:opacity-0 hover:cursor-pointer"
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="bg-white text-black border py-2 px-6 rounded-4xl opacity-60 hover:cursor-pointer hover:opacity-100 hover:shadow-lg transition-all duration-300 font-semibold"
                >
                  {step === steps.length - 1 ? "Sign In" : "Next"}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </form>
      <p className="text-xs text-center text-gray-600 mt-8">
        Don&apos;t have an account?{" "}
        <Link href="/register" className="text-blue-600 hover:underline">
          Sign up
        </Link>
      </p>
    </div>
  );
}
