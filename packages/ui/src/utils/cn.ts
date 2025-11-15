import { type ClassValue, clsx } from 'clsx';

/**
 * Утилита для объединения Tailwind классов
 * Использует clsx для условных классов
 */
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

