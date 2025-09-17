// Focused, composable validation helpers to keep components lean

export const validateEmail = (value: string): string | null => {
  if (!value) return 'Email required.';
  if (!/^\S+@\S+\.[\w-]{2,}$/.test(value)) return 'Invalid email format.';
  return null;
};

export const validatePassword = (value: string): string | null => {
  if (!value) return 'Password required.';
  if (value.length < 8) return 'Minimum 8 characters.';
  if (!/[0-9]/.test(value)) return 'Include at least one number.';
  return null;
};

export const validatePasswordMatch = (pwd: string, confirm: string): string | null => {
  if (pwd !== confirm) return 'Passwords do not match.';
  return null;
};

export const validateNames = (forename: string, surname: string): string | null => {
  if (!forename || !surname) return 'Forename and surname required.';
  if (forename.length < 2 || surname.length < 2) return 'Names must be at least 2 characters.';
  const nameRegex = /^[a-zA-Z'\- ]+$/;
  if (!nameRegex.test(forename) || !nameRegex.test(surname)) return 'Names contain invalid characters.';
  return null;
};
