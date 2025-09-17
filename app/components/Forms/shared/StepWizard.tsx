"use client";
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UseWizardResult } from './types';

interface StepWizardProps<FormShape> {
  wizard: UseWizardResult<FormShape>;
  renderStep: (wizard: UseWizardResult<FormShape>) => React.ReactNode;
  onBackLabel?: string;
  onNextLabel?: (isLast: boolean) => string;
  className?: string;
  loadingLabel?: string;
  successLabel?: string;
  successSubLabel?: string;
}

const animationProps = {
  initial: { opacity: 0, y: 40 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -40 },
  transition: { duration: 0.35, ease: [0.4, 0, 0.2, 1] as const },
};

export function StepWizard<FormShape>({
  wizard,
  renderStep,
  onBackLabel = 'Back',
  onNextLabel = (isLast: boolean) => (isLast ? 'Submit' : 'Next'),
  className,
  loadingLabel = 'Submitting…',
  successLabel = 'Success!',
  successSubLabel = 'Redirecting…',
}: StepWizardProps<FormShape>) {
  const { loading, completed, error, stepIndex, steps, next, back, isLast } = wizard;
  return (
    <div className={className}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          next();
        }}
        className="flex flex-col gap-4 min-h-[240px]"
      >
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div key="loading" {...animationProps} className="flex flex-col items-center justify-center min-h-[200px] gap-3">
              <div className="animate-spin h-10 w-10 border-4 border-black border-t-transparent rounded-full" />
              <div className="text-gray-700 text-base font-medium">{loadingLabel}</div>
            </motion.div>
          ) : completed ? (
            <motion.div key="done" {...animationProps} className="flex flex-col items-center justify-center min-h-[200px] gap-2">
              <div className="text-green-600 text-xl font-semibold">{successLabel}</div>
              <div className="text-gray-600 text-sm">{successSubLabel}</div>
            </motion.div>
          ) : (
            <motion.div key={stepIndex} {...animationProps} className="flex flex-col gap-4">
              {renderStep(wizard)}
              {error && <div className="text-red-500 text-sm" role="alert" aria-live="polite">{error}</div>}
              <div className="flex justify-between items-center mt-2">
                <button
                  type="button"
                  onClick={back}
                  disabled={stepIndex === 0}
                  className="text-xs text-gray-500 underline disabled:opacity-0 focus:outline-none focus-visible:ring"
                >
                  {onBackLabel}
                </button>
                <button
                  type="submit"
                  className="bg-white text-black border py-2 px-6 rounded-4xl opacity-60 hover:opacity-100 hover:cursor-pointer hover:shadow-lg transition-all duration-300 font-semibold focus:outline-none focus-visible:ring"
                >
                  {onNextLabel(isLast)}
                </button>
              </div>
              <div className="text-center text-[10px] text-gray-400">Step {stepIndex + 1} of {steps.length}</div>
            </motion.div>
          )}
        </AnimatePresence>
      </form>
    </div>
  );
}
