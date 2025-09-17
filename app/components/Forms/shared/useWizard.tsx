"use client";
import React, { useCallback, useMemo, useRef, useState } from 'react';
import { StepConfig, UseWizardOptions, UseWizardResult } from './types';

interface InternalFlags {
  startTime: number | null;
}

export function useWizard<FormShape extends Record<string, any>>(options: UseWizardOptions<FormShape>): UseWizardResult<FormShape> {
  const { steps, initialForm, onSubmit, minCompletionMs = 0, antiBot = false, honeypotField } = options;
  const [form, setForm] = useState<FormShape>(initialForm);
  const [stepIndex, setStepIndex] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [completed, setCompleted] = useState(false);
  const flags = useRef<InternalFlags>({ startTime: Date.now() });

  const current = steps[stepIndex];
  const isLast = stepIndex === steps.length - 1;

  const setValue = useCallback((field: keyof FormShape, value: any) => {
    setForm(f => ({ ...f, [field]: value }));
    setError(null);
  }, []);

  const validateCurrent = useCallback(() => {
    if (honeypotField && form[honeypotField] && String(form[honeypotField]).trim()) {
      return 'Unexpected error. Please try again.';
    }
    if (current.validate) {
      return current.validate(form);
    }
    return null;
  }, [current, form, honeypotField]);

  const back = useCallback(() => {
    setError(null);
    setStepIndex(i => Math.max(0, i - 1));
  }, []);

  const next = useCallback(async () => {
    const err = validateCurrent();
    if (err) return setError(err);

    if (!isLast) {
      setStepIndex(i => i + 1);
      return;
    }

    // final submit
    if (antiBot && minCompletionMs > 0) {
      const elapsed = Date.now() - (flags.current.startTime || 0);
      if (elapsed < minCompletionMs) {
        return setError('Please take a moment to review before submitting.');
      }
    }

    setLoading(true);
    try {
      await onSubmit(form);
      setCompleted(true);
    } catch (e: any) {
      setError(e?.message || 'Submission failed');
    } finally {
      setLoading(false);
    }
  }, [antiBot, form, isLast, minCompletionMs, onSubmit, validateCurrent]);

  const reset = useCallback(() => {
    setForm(initialForm);
    setStepIndex(0);
    setError(null);
    setCompleted(false);
    flags.current.startTime = Date.now();
  }, [initialForm]);

  return useMemo(() => ({
    stepIndex,
    steps,
    error,
    isLast,
    current,
    form,
    loading,
    completed,
    setValue,
    next,
    back,
    setError,
    reset,
  }), [stepIndex, steps, error, isLast, current, form, loading, completed, setValue, next, back, reset]);
}
