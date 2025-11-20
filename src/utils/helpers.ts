import { format, formatDistanceToNow, isToday, isPast } from 'date-fns'

export function formatDate(date: Date | string): string {
  return format(new Date(date), 'MMM d, yyyy')
}

export function formatDateTime(date: Date | string): string {
  return format(new Date(date), 'MMM d, yyyy h:mm a')
}

export function formatTimeAgo(date: Date | string): string {
  return formatDistanceToNow(new Date(date), { addSuffix: true })
}

export function isMissionOverdue(dueDate: Date | string): boolean {
  return isPast(new Date(dueDate)) && !isToday(new Date(dueDate))
}

export function isMissionDueToday(dueDate: Date | string): boolean {
  return isToday(new Date(dueDate))
}

export function generateAgentCode(): string {
  const randomNumber = Math.floor(1000 + Math.random() * 9000)
  return `AGENT-${randomNumber}`
}

// Generate military-style avatar with initials on geometric background
export function getAvatarUrl(agentId: string, seed?: string): string {
  const actualSeed = seed || agentId
  // Use UI Avatars with military-style settings (sharp corners, monospace font)
  const initials = actualSeed.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'AG'
  // Military green background with white text
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(initials)}&background=1a1a1a&color=00ff88&bold=true&format=svg&size=128`
}

export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str
  return str.slice(0, maxLength) + '...'
}

export function classNames(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ')
}
