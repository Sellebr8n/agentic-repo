export type DueDateStatus = 'overdue' | 'warning' | 'normal' | 'no-date'

const HOURS_24 = 24 * 60 * 60 * 1000

export function getDueDateStatus(dueDate?: number): DueDateStatus {
  if (!dueDate) return 'no-date'
  const now = Date.now()
  const timeLeft = dueDate - now
  if (timeLeft < 0) return 'overdue'
  if (timeLeft <= HOURS_24) return 'warning'
  return 'normal'
}

export function formatDueDate(timestamp: number): string {
  const date = new Date(timestamp)
  const now = new Date()
  const tomorrow = new Date(now)
  tomorrow.setDate(tomorrow.getDate() + 1)

  const timeStr = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

  if (date.toDateString() === now.toDateString()) return `Today at ${timeStr}`
  if (date.toDateString() === tomorrow.toDateString()) return `Tomorrow at ${timeStr}`
  return date.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' }) + ` at ${timeStr}`
}

export function getRelativeTime(dueDate: number): string {
  const now = Date.now()
  const diff = dueDate - now
  const absDiff = Math.abs(diff)

  const minutes = Math.floor(absDiff / (60 * 1000))
  const hours = Math.floor(absDiff / (60 * 60 * 1000))
  const days = Math.floor(absDiff / (24 * 60 * 60 * 1000))

  const suffix = diff < 0 ? ' overdue' : ''
  const prefix = diff >= 0 ? 'in ' : ''

  if (days > 0) return `${prefix}${days} day${days > 1 ? 's' : ''}${suffix}`
  if (hours > 0) return `${prefix}${hours} hour${hours > 1 ? 's' : ''}${suffix}`
  if (minutes > 0) return `${prefix}${minutes} minute${minutes > 1 ? 's' : ''}${suffix}`
  return diff < 0 ? 'overdue' : 'due now'
}
