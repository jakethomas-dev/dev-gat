"use client";
import { useRouter } from "next/navigation";
import { useEffect, useMemo } from "react";
import { useWizard } from "../Forms/shared/useWizard";
import { StepWizard } from "../Forms/shared/StepWizard";
import { StepConfig } from "../Forms/shared/types";
import applicationTypes from "@/app/data/applicationTypes.json";

interface CreateApplicationForm {
  applicationName: string;
  siteLocation: string;
  applicationType: string;
  proposal: string;
  // honeypot
  company: string;
}

const initialForm: CreateApplicationForm = {
  applicationName: "",
  siteLocation: "",
  applicationType: "",
  proposal: "",
  company: "",
};

const buildSteps = (form: CreateApplicationForm): StepConfig<CreateApplicationForm>[] => [
  {
    name: "applicationName",
    label: "Application Name",
    type: "text",
    placeholder: "E.g. Rear extension to 12 High Street",
    validate: (f) => (f.applicationName.trim().length < 4 ? "Name must be at least 4 characters" : null),
  },
  {
    name: "siteLocation",
    label: "Site Location",
    type: "text",
    placeholder: "Site address or description",
    validate: (f) => (f.siteLocation.trim().length < 4 ? "Location must be at least 4 characters" : null),
  },
  {
    name: "applicationType",
    label: "Application Type",
    type: "select",
    validate: (f) => (!f.applicationType ? "Select an application type" : null),
    render: ({ form, setValue }) => (
      <div className="flex flex-col gap-2">
        <label className="block text-sm font-semibold mb-1" htmlFor="applicationType">Application Type</label>
        <select
          id="applicationType"
          value={form.applicationType}
          onChange={(e) => setValue("applicationType", e.target.value)}
          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:shadow focus:border-black transition"
        >
          <option value="">Select type…</option>
          {applicationTypes.map(t => (
            <option key={t.value} value={t.value}>{t.label}</option>
          ))}
        </select>
        {form.applicationType && (
          <p className="text-xs text-gray-500 mt-1">{applicationTypes.find(t => t.value === form.applicationType)?.description}</p>
        )}
      </div>
    ),
  },
  {
    name: "proposal",
    label: "Proposal Summary",
    type: "textarea",
    placeholder: "Brief description of the proposed development…",
    validate: (f) => (f.proposal.trim().length < 10 ? "Provide a little more detail (min 10 chars)" : null),
    render: ({ form, setValue }) => (
      <div className="flex flex-col gap-2">
        <label className="block text-sm font-semibold mb-1" htmlFor="proposal">Proposal Summary</label>
        <textarea
          id="proposal"
          rows={5}
          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:shadow focus:border-black transition resize-y"
          placeholder="Brief description of the proposed development…"
          value={form.proposal}
          onChange={(e) => setValue("proposal", e.target.value)}
        />
        <div className="text-[10px] text-gray-400">Tip: This can be refined later.</div>
      </div>
    ),
  },
  {
    name: "review",
    label: "Review",
    type: "review",
    validate: () => null,
    render: ({ form }) => (
      <div className="flex flex-col gap-4 text-sm">
        <div className="font-semibold text-gray-800">Review your application</div>
        <div className="flex flex-col gap-2 border rounded-md p-4 bg-gray-50">
          <div><span className="font-medium">Name:</span> {form.applicationName}</div>
          <div><span className="font-medium">Location:</span> {form.siteLocation}</div>
          <div><span className="font-medium">Type:</span> {applicationTypes.find(t => t.value === form.applicationType)?.label}</div>
          <div><span className="font-medium">Proposal:</span> {form.proposal}</div>
        </div>
        <div className="text-xs text-gray-500">You can edit details after creation.</div>
      </div>
    ),
  },
];

export default function CreateApplicationWizard() {
  const router = useRouter();

  const wizard = useWizard<CreateApplicationForm>({
    steps: buildSteps(initialForm),
    initialForm,
    honeypotField: "company",
    antiBot: true,
    minCompletionMs: 2000,
    onSubmit: async (form) => {
      const res = await fetch('/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          applicationName: form.applicationName.trim(),
          siteLocation: form.siteLocation.trim(),
          applicationType: form.applicationType,
          proposal: form.proposal.trim(),
        })
      });
      if (!res.ok) {
        let msg = 'Failed to create application';
        try { const data = await res.json(); if (data?.message) msg = data.message; } catch {}
        throw new Error(msg);
      }
      setTimeout(() => router.push('/dashboard/applications'), 1400);
    }
  });

  // Keep steps stable (no dynamic logic now)
  useEffect(() => {}, [wizard.form]);

  const renderStep = useMemo(() => (w: typeof wizard) => {
    const step = w.current;
    if (step.render) return step.render({ form: w.form, setValue: w.setValue, error: w.error });
    if (step.type === 'review') return null;
    if (step.type === 'textarea') return null; // covered by render override
    return (
      <div className="flex flex-col gap-2">
        <label className="block text-sm font-semibold mb-1" htmlFor={step.name}>{step.label}</label>
        <input
          id={step.name}
          type={step.type}
          placeholder={step.placeholder}
          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:shadow focus:border-black transition"
          value={(w.form as any)[step.name] ?? ''}
          onChange={(e) => w.setValue(step.name as keyof CreateApplicationForm, e.target.value)}
          autoFocus
        />
      </div>
    );
  }, []);

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-semibold mb-2 text-center">Create Application</h1>
      <p className="text-center text-xs text-black/70 mb-8">Provide initial details to start your planning application.</p>
      <StepWizard
        wizard={wizard}
        onNextLabel={(isLast) => isLast ? 'Create Application' : 'Next'}
        loadingLabel="Creating application…"
        successLabel="Created!"
        successSubLabel="Redirecting…"
        renderStep={renderStep as any}
      />
      <div className="hidden" aria-hidden="true">
        <input
          tabIndex={-1}
          autoComplete="off"
          value={wizard.form.company}
          onChange={(e) => wizard.setValue('company', e.target.value)}
          name="company"
        />
      </div>
    </div>
  );
}
