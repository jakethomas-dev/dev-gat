"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { StepWizard } from "../shared/StepWizard";
import { useWizard } from "../shared/useWizard";
import { StepConfig } from "../shared/types";
import { validateEmail, validatePassword } from "../shared/validators";

interface SignInForm {
  email: string;
  password: string;
  company: string; // honeypot
}

const initialForm: SignInForm = { email: "", password: "", company: "" };

const steps: StepConfig<SignInForm>[] = [
  {
    name: "email",
    label: "Email",
    type: "email",
    placeholder: "you@example.com",
    autoComplete: "email",
    validate: (f) => validateEmail(f.email),
  },
  {
    name: "password",
    label: "Password",
    type: "password",
    placeholder: "Password",
    autoComplete: "current-password",
    validate: (f) => validatePassword(f.password),
  },
];

export default function SignIn() {
  const router = useRouter();

  const wizard = useWizard<SignInForm>({
    steps,
    initialForm,
    honeypotField: "company",
    onSubmit: async (form) => {
      const res = await fetch("/api/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email.trim(), password: form.password }),
      });
      if (!res.ok) {
        let msg = "Invalid credentials";
        try { const data = await res.json(); if (data?.message) msg = data.message; } catch {}
        throw new Error(msg);
      }
      setTimeout(() => router.push("/dashboard"), 1200);
    },
  });

  return (
    <div className="max-w-lg mx-auto">
      <h2 className="text-2xl font-semibold mb-8 text-center">Welcome back</h2>
      <p className="text-center text-xs text-black/70 mb-8">Your place for planning & development</p>
      <StepWizard
        wizard={wizard}
        onNextLabel={(isLast) => (isLast ? "Sign In" : "Next")}
        loadingLabel="Signing you in…"
        successLabel="Signed in!"
        successSubLabel="Redirecting…"
        renderStep={(w) => {
          const step = w.current;
          return (
            <div className="flex flex-col gap-4">
              <label htmlFor={step.name} className="block text-sm font-semibold mb-2">
                {step.label}
              </label>
              <input
                id={step.name}
                name={step.name}
                type={step.type}
                autoComplete={step.autoComplete}
                placeholder={step.placeholder}
                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:shadow focus:border-black transition"
                value={(w.form as any)[step.name] ?? ''}
                onChange={(e) => w.setValue(step.name as keyof SignInForm, e.target.value)}
                autoFocus
                required
              />
            </div>
          );
        }}
      />
      <div className="hidden" aria-hidden="true">
        <input
          tabIndex={-1}
          autoComplete="off"
          value={wizard.form.company}
          onChange={(e) => wizard.setValue("company", e.target.value)}
          name="company"
        />
      </div>
      <p className="text-xs text-center text-gray-600 mt-8">
        Don&apos;t have an account?{" "}
        <Link href="/register" className="text-blue-600 hover:underline">
          Sign up
        </Link>
      </p>
    </div>
  );
}
