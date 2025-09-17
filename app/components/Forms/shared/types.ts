export type FieldName = string;

export interface StepConfig<FormShape> {
  name: FieldName;
  label: string;
  type?: string; // 'text' | 'email' | 'password' | 'review' | custom
  placeholder?: string;
  autoComplete?: string;
  // For custom rendering a step can provide its own renderer
  render?: (ctx: StepRenderContext<FormShape>) => React.ReactNode;
  validate?: (form: FormShape) => string | null; // return error string or null
  optional?: boolean;
}

export interface StepRenderContext<FormShape> {
  form: FormShape;
  setValue: (field: keyof FormShape, value: any) => void;
  error: string | null;
}

export interface WizardState<FormShape> {
  stepIndex: number;
  steps: StepConfig<FormShape>[];
  error: string | null;
  isLast: boolean;
  current: StepConfig<FormShape>;
}

export interface UseWizardOptions<FormShape> {
  steps: StepConfig<FormShape>[];
  initialForm: FormShape;
  onSubmit: (form: FormShape) => Promise<void> | void;
  minCompletionMs?: number;
  antiBot?: boolean;
  honeypotField?: keyof FormShape;
}

export interface UseWizardResult<FormShape> extends WizardState<FormShape> {
  form: FormShape;
  loading: boolean;
  completed: boolean;
  setValue: (field: keyof FormShape, value: any) => void;
  next: () => Promise<void> | void;
  back: () => void;
  setError: (err: string | null) => void;
  reset: () => void;
}
