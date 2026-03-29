import { clsx, type ClassValue } from 'clsx';

// Note: wraps clsx directly. Add tailwind-merge here if class conflicts arise.
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}
