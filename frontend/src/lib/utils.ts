import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatJson(data: unknown): string {
  return JSON.stringify(data, null, 2)
}

export function formatDate(date: string): string {
  return new Date(date).toLocaleString()
}

export function formatResponseTime(ms: number): string {
  if (ms < 1000) {
    return `${Math.round(ms)}ms`
  }
  return `${(ms / 1000).toFixed(2)}s`
}

export function getStatusColor(statusCode: number): string {
  if (statusCode >= 200 && statusCode < 300) return 'text-green-600 dark:text-green-400'
  if (statusCode >= 400 && statusCode < 500) return 'text-yellow-600 dark:text-yellow-400'
  if (statusCode >= 500) return 'text-red-600 dark:text-red-400'
  return 'text-slate-600 dark:text-slate-400'
}

export function getHealthStatusColor(status: string): string {
  switch (status) {
    case 'healthy':
      return 'status-healthy'
    case 'degraded':
      return 'status-degraded'
    case 'unhealthy':
      return 'status-unhealthy'
    default:
      return ''
  }
}
