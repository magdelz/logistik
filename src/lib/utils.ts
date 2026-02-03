import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount)
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date(date))
}

export function formatDateTime(date: string | Date): string {
  return new Intl.DateTimeFormat('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date))
}

export function formatWeight(kg: number): string {
  if (kg >= 1000) {
    return `${(kg / 1000).toFixed(1)} т`
  }
  return `${kg} кг`
}

export function formatVolume(m3: number): string {
  return `${m3.toFixed(2)} м³`
}

export function formatDistance(km: number): string {
  return `${km.toLocaleString('ru-RU')} км`
}

export const ORDER_STATUS_LABELS: Record<string, string> = {
  pending: 'Ожидает',
  confirmed: 'Подтверждён',
  pickup: 'Забран',
  in_transit: 'В пути',
  delivered: 'Доставлен',
  cancelled: 'Отменён',
}

export const ORDER_STATUS_COLORS: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
  confirmed: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
  pickup: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
  in_transit: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300',
  delivered: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
  cancelled: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
}

export const PAYMENT_STATUS_LABELS: Record<string, string> = {
  pending: 'Ожидает оплаты',
  paid: 'Оплачен',
  refunded: 'Возврат',
  failed: 'Ошибка',
}

export const CARGO_TYPE_LABELS: Record<string, string> = {
  standard: 'Стандартный',
  fragile: 'Хрупкий',
  perishable: 'Скоропортящийся',
  hazardous: 'Опасный',
  oversized: 'Негабаритный',
  valuable: 'Ценный',
}

export const ROLE_LABELS: Record<string, string> = {
  admin: 'Администратор',
  manager: 'Менеджер',
  client: 'Клиент',
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

export function generateTrackingUrl(trackingCode: string): string {
  return `/tracking?code=${trackingCode}`
}

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
