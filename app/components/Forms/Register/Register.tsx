"use client";
import { useState, useMemo, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

import Link from "next/link";
import { useRouter } from "next/navigation";

// Define the linear steps of the registration wizard (excluding the final review submit pseudo-step)
const stepDefinitions = [
  {
    label: "Email",
    name: "email",
    type: "email",
    placeholder: "you@example.com",
    autoComplete: "email",
  },
  {
    label: "Your Name",
    name: "fullName",
    type: "name",
  },
  {
    label: "Password",
    name: "password",
    type: "password",
    placeholder: "Password (min 8 chars, 1 number)",
    autoComplete: "new-password",
  },
  {
    label: "Confirm Password",
    name: "confirmPassword",
    type: "password",
    placeholder: "Re-enter password",
    autoComplete: "new-password",
  },
  {
    label: "Review",
    name: "review",
    type: "review",
  },
];

export default function Register() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    email: "",
    forename: "",
    surname: "",
    password: "",
    confirmPassword: "",
    // honeypot field - legitimate users never see or fill this
    company: "",
  });
  const [error, setError] = useState("");
  const [completed, setCompleted] = useState(false);
  const [loading, setLoading] = useState(false);
  // Math challenge removed per latest requirements
  const [tooFast, setTooFast] = useState(false);
  const startTimeRef = useRef<number | null>(null);
  const router = useRouter();

  // Minimum time (ms) we expect a human to take before reaching final submit, else we flag
  const MIN_COMPLETION_TIME = 4000; // 4 seconds

  useEffect(() => {
    if (startTimeRef.current === null) {
      startTimeRef.current = Date.now();
    }
  }, []);

  // Removed humanChallenge effect

  const currentStep = useMemo(() => stepDefinitions[step], [step]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    setError("");
  };

  const validate = (): boolean => {
    // Honeypot: if company field filled, reject silently
    if (form.company.trim()) {
      setError("Unexpected error. Please try again.");
      return false;
    }

    switch (currentStep.name) {
      case "email": {
        const value = form.email.trim();
        if (!value) return setErrorAndFalse("Please enter your email.");
        if (!/^\S+@\S+\.\S+$/.test(value)) return setErrorAndFalse("Please enter a valid email.");
        return true;
      }
      case "fullName": {
        const first = form.forename.trim();
        const last = form.surname.trim();
        if (!first || !last) return setErrorAndFalse("Please enter your forename and surname.");
        if (first.length < 2 || last.length < 2) return setErrorAndFalse("Names must be at least 2 characters.");
        if (!/^[a-zA-Z'\- ]+$/.test(first) || !/^[a-zA-Z'\- ]+$/.test(last)) return setErrorAndFalse("Names contain invalid characters.");
        return true;
      }
      case "password": {
        const value = form.password;
        if (!value) return setErrorAndFalse("Password required.");
        if (value.length < 8) return setErrorAndFalse("Minimum 8 characters.");
        if (!/[0-9]/.test(value)) return setErrorAndFalse("Include at least one number.");
        return true;
      }
      case "confirmPassword": {
        if (form.confirmPassword !== form.password) return setErrorAndFalse("Passwords do not match.");
        return true;
      }
      // humanChallenge removed
      case "review": {
        return true;
      }
      default:
        return true;
    }
  };

  const setErrorAndFalse = (msg: string): false => {
    setError(msg);
    return false;
  };

  const handleNext = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    // If not at final step yet, move ahead
    if (step < stepDefinitions.length - 1) {
      setStep((s) => s + 1);
      return;
    }

    // Final submit (review step)
    if (startTimeRef.current && Date.now() - startTimeRef.current < MIN_COMPLETION_TIME) {
      setTooFast(true);
      return setError("Please take a moment to review before submitting.");
    }

    setLoading(true);
    try {
      const payload = {
        email: form.email.trim(),
        name: {
          forename: form.forename.trim(),
          surname: form.surname.trim(),
          full: `${form.forename.trim()} ${form.surname.trim()}`.trim(),
        },
        password: form.password,
        // Potentially include a client fingerprint or timing metadata
        meta: {
          tookMs: startTimeRef.current ? Date.now() - startTimeRef.current : undefined,
        },
      };
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const data = await safeJson(res);
        throw new Error(data?.message || "Registration failed");
      }
      setCompleted(true);
      setTimeout(() => router.push("/dashboard"), 1800);
    } catch (err: any) {
      setError(err.message || "Error registering");
    } finally {
      setLoading(false);
    }
  };

  const safeJson = async (res: Response) => {
    try {
      return await res.json();
    } catch {
      return null;
    }
  };

  const handleBack = () => {
    setError("");
    setTooFast(false);
    setStep((s) => Math.max(0, s - 1));
  };

  const animationProps = {
    initial: { opacity: 0, y: 40 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -40 },
    transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] as const },
  };

  const totalSteps = stepDefinitions.length;
  const isFinal = currentStep.name === "review";

  const renderStepContent = () => {
    if (currentStep.name === "review") {
      return (
        <div className="flex flex-col gap-4 text-sm">
          <div className="font-semibold text-gray-800">Review your details</div>
          <div className="flex flex-col gap-2 border rounded-md p-4 bg-gray-50">
            <div><span className="font-medium">Email:</span> {form.email}</div>
            <div><span className="font-medium">Name:</span> {form.forename} {form.surname}</div>
            <div><span className="font-medium">Password:</span> {'*'.repeat(form.password.length)}</div>
          </div>
          <div className="text-xs text-gray-500">By creating an account you agree to our terms of service.</div>
        </div>
      );
    }
    if (currentStep.name === "fullName") {
      return (
        <div className="flex flex-col gap-4">
          <label className="block text-sm font-semibold">Your name</label>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <label htmlFor="forename" className="text-xs font-medium text-gray-600">Forename</label>
              <input
                id="forename"
                name="forename"
                type="text"
                autoComplete="given-name"
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:shadow focus:border-black transition duration-150"
                placeholder="Jane"
                value={form.forename}
                onChange={handleChange}
                autoFocus
              />
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="surname" className="text-xs font-medium text-gray-600">Surname</label>
              <input
                id="surname"
                name="surname"
                type="text"
                autoComplete="family-name"
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:shadow focus:border-black transition duration-150"
                placeholder="Doe"
                value={form.surname}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>
      );
    }
    // Default input rendering for standard steps
    return (
      <div className="flex flex-col gap-4">
        <label htmlFor={currentStep.name} className="block text-sm font-semibold mb-2">
          {currentStep.label}
        </label>
        <input
          id={currentStep.name}
          name={currentStep.name}
          type={currentStep.type}
          autoComplete={currentStep.autoComplete}
          className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:shadow focus:border-black transition duration-150"
          placeholder={currentStep.placeholder}
          value={(form as any)[currentStep.name]}
          onChange={handleChange}
          required={!["review"].includes(currentStep.name)}
          autoFocus
        />
      </div>
    );
  };

  return (
    <div className="max-w-lg mx-auto">
      <h2 className="text-2xl font-semibold mb-2 text-center">Create your account</h2>
      <p className="text-xs text-center text-gray-600 mb-6">Step {step + 1} of {totalSteps}</p>
      <form className="flex flex-col gap-4 min-h-[260px]" onSubmit={handleNext}>
        {/* Honeypot field (hidden) */}
        <div className="hidden" aria-hidden="true">
          <label htmlFor="company">Company</label>
          <input
            id="company"
            name="company"
            type="text"
            tabIndex={-1}
            autoComplete="off"
            value={form.company}
            onChange={handleChange}
          />
        </div>
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div key="loading" {...animationProps} className="flex flex-col items-center justify-center min-h-[200px]">
              <div className="animate-spin h-10 w-10 border-4 border-black border-t-transparent rounded-full mb-4" />
              <div className="text-gray-700 text-base font-medium">Creating account…</div>
            </motion.div>
          ) : completed ? (
            <motion.div key="done" {...animationProps} className="flex flex-col items-center justify-center min-h-[200px]">
              <div className="text-green-600 text-xl font-semibold mb-2">Account created!</div>
              <div className="text-gray-600 text-sm">Redirecting…</div>
            </motion.div>
          ) : (
            <motion.div key={step} {...animationProps} className="flex flex-col gap-4">
              {renderStepContent()}
              {error && <div className="text-red-500 text-sm">{error}</div>}
              {tooFast && <div className="text-amber-600 text-xs">Slow down to confirm you're human.</div>}
              <div className="flex justify-between mt-4 items-center">
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
                  {isFinal ? "Create Account" : "Next"}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </form>
      <p className="text-xs text-center text-gray-600 mt-8">
        Already have an account?{" "}
        <Link href="/signIn" className="text-blue-600 hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}
