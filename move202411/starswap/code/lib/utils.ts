import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function shortenAddress(address: string, chars = 4): string {
  if (!address) return ''
  const start = address.substring(0, chars)
  const end = address.substring(address.length - chars)
  return `${start}...${end}`
}
