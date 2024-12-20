import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { POStatus } from "./types/purchase-order"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount)
}

export function getBadgeVariant(status: POStatus): 'default' | 'secondary' | 'success' | 'destructive' {
  switch (status) {
    case 'pending':
      return 'default'
    case 'approved':
      return 'secondary'
    case 'fulfilled':
    case 'paid':
      return 'success'
    case 'cancelled':
      return 'destructive'
    default:
      return 'default'
  }
}
