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

export function getAvatarUrl(agentId: string, seed?: string): string {
  // Using DiceBear API for fun avatar generation
  const style = 'adventurer' // Kid-friendly avatar style
  const actualSeed = seed || agentId
  return `https://api.dicebear.com/7.x/${style}/svg?seed=${actualSeed}`
}

export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str
  return str.slice(0, maxLength) + '...'
}

export function classNames(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ')
}
