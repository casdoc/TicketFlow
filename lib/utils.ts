import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format a date string to a localized format
 * @param date - Date string or Date object
 * @param locale - Locale string (default: 'zh-TW')
 * @returns Formatted date string
 */
export function formatDate(date: string | Date, locale: string = 'zh-TW'): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}
