import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** Generates a cryptographically random 6-char uppercase alphanumeric invite code */
export function generateInviteCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789' // no ambiguous O/0 I/1
  const arr = new Uint8Array(6)
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    crypto.getRandomValues(arr)
  } else {
    // SSR fallback
    for (let i = 0; i < 6; i++) arr[i] = Math.floor(Math.random() * 256)
  }
  return Array.from(arr).map(b => chars[b % chars.length]).join('')
}
