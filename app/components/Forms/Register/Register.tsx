"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useWizard } from "../shared/useWizard";
import { StepWizard } from "../shared/StepWizard";
import {
  validateEmail,
  validatePassword,
  validatePasswordMatch,
  validateNames,
} from "../shared/validators";
import { StepConfig } from "../shared/types";

interface RegisterFormShape {
  email: string;
  forename: string;
  surname: string;
  password: string;
  confirmPassword: string;
  company: string; // honeypot
}

const initialForm: RegisterFormShape = {
  email: "",
  forename: "",
  surname: "",
  password: "",
  confirmPassword: "",
  company: "",
};

const buildSteps = (
  form: RegisterFormShape
): StepConfig<RegisterFormShape>[] => [
  {
    name: "email",
    label: "Email",
    type: "email",
    placeholder: "you@example.com",
    autoComplete: "email",
    validate: (f) => validateEmail(f.email),
  },
  {
    name: "fullName",
    label: "Your Name",
    type: "name",
    validate: (f) => validateNames(f.forename, f.surname),
    render: ({ form, setValue }) => (
      <div className="flex flex-col gap-4">
        <label className="block text-sm font-semibold">Your name</label>
        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1">
            <label
              htmlFor="forename"
              className="text-xs font-medium text-gray-600"
            >
              Forename
            </label>
            <input
              id="forename"
              name="forename"
              type="text"
              autoComplete="given-name"
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:shadow focus:border-black transition"
              placeholder="Jane"
              value={form.forename}
              onChange={(e) => setValue("forename", e.target.value)}
              autoFocus
            />
          </div>
          <div className="flex flex-col gap-1">
            <label
              htmlFor="surname"
              className="text-xs font-medium text-gray-600"
            >
              Surname
            </label>
            <input
              id="surname"
              name="surname"
              type="text"
              autoComplete="family-name"
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:shadow focus:border-black transition"
              placeholder="Doe"
              value={form.surname}
              onChange={(e) => setValue("surname", e.target.value)}
            />
          </div>
        </div>
      </div>
    ),
  },
  {
    name: "password",
    label: "Password",
    type: "password",
    placeholder: "Password (min 8 chars, 1 number)",
    autoComplete: "new-password",
    validate: (f) => validatePassword(f.password),
  },
  {
    name: "confirmPassword",
    label: "Confirm Password",
    type: "password",
    placeholder: "Re-enter password",
    autoComplete: "new-password",
    validate: (f) => validatePasswordMatch(f.password, f.confirmPassword),
  },
  {
    name: "review",
    label: "Review",
    type: "review",
    validate: () => null,
    render: ({ form }) => (
      <div className="flex flex-col gap-4 text-sm">
        <div className="font-semibold text-gray-800">Review your details</div>
        <div className="flex flex-col gap-2 border rounded-md p-4 bg-gray-50">
          <div>
            <span className="font-medium">Email:</span> {form.email}
          </div>
          <div>
            <span className="font-medium">Name:</span> {form.forename}{" "}
            {form.surname}
          </div>
          <div>
            <span className="font-medium">Password:</span>{" "}
            {"*".repeat(form.password.length)}
          </div>
        </div>
        <div className="text-xs text-gray-500">
          By creating an account you agree to our terms of service.
        </div>
      </div>
    ),
  },
];

export default function Register() {
  const router = useRouter();

  const wizard = useWizard<RegisterFormShape>({
    steps: buildSteps(initialForm),
    initialForm,
    honeypotField: "company",
    antiBot: true,
    minCompletionMs: 4000,
    onSubmit: async (form) => {
      const payload = {
        email: form.email.trim(),
        name: {
          forename: form.forename.trim(),
          surname: form.surname.trim(),
          full: `${form.forename.trim()} ${form.surname.trim()}`.trim(),
        },
        password: form.password,
      };
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        let msg = "Registration failed";
        try {
          const data = await res.json();
          if (data?.message) msg = data.message;
        } catch {}
        throw new Error(msg);
      }
      setTimeout(() => router.push("/dashboard"), 1500);
    },
  });

  // Ensure steps always reflect current form (for dynamic validators if needed)
  useEffect(() => {
    // No-op: could implement dynamic step injection logic here.
  }, [wizard.form]);

  return (
    <div className="max-w-lg mx-auto">
      <h2 className="text-2xl font-semibold mb-8 text-center">
        Create your account
      </h2>
      <p className="text-center text-xs text-black/70 mb-8">
        Join the gang
      </p>

      <StepWizard
        wizard={wizard}
        onNextLabel={(isLast) => (isLast ? "Create Account" : "Next")}
        loadingLabel="Creating account…"
        successLabel="Account created!"
        successSubLabel="Redirecting…"
        renderStep={(w) => {
          const step = w.current;
          if (step.render) {
            return step.render({
              form: w.form,
              setValue: w.setValue,
              error: w.error,
            });
          }
          if (step.type === "review") return null; // handled by custom render above
          return (
            <div className="flex flex-col gap-4">
              <label
                htmlFor={step.name}
                className="block text-sm font-semibold mb-2"
              >
                {step.label}
              </label>
              <input
                id={step.name}
                name={step.name}
                type={step.type}
                autoComplete={step.autoComplete}
                placeholder={step.placeholder}
                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:shadow focus:border-black transition"
                value={(w.form as any)[step.name] ?? ""}
                onChange={(e) =>
                  w.setValue(
                    step.name as keyof RegisterFormShape,
                    e.target.value
                  )
                }
                autoFocus
                required={!step.optional && step.type !== "review"}
              />
            </div>
          );
        }}
      />
      {/* Honeypot Field */}
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
        Already have an account?{" "}
        <Link href="/signIn" className="text-blue-600 hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}
