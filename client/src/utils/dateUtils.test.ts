import { describe, it, expect, vi, afterEach } from 'vitest'
import { getDueDateStatus, formatDueDate, getRelativeTime } from './dateUtils'

const HOUR = 60 * 60 * 1000
const DAY = 24 * HOUR
const MINUTE = 60 * 1000

// Fixed "now" for all tests: 2026-03-05T12:00:00.000Z
const NOW = new Date('2026-03-05T12:00:00.000Z').getTime()

describe('getDueDateStatus', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('returns "no-date" when no due date is provided', () => {
    expect(getDueDateStatus()).toBe('no-date')
    expect(getDueDateStatus(undefined)).toBe('no-date')
  })

  it('returns "overdue" when due date is in the past', () => {
    vi.spyOn(Date, 'now').mockReturnValue(NOW)
    const pastDue = NOW - HOUR
    expect(getDueDateStatus(pastDue)).toBe('overdue')
  })

  it('returns "warning" when due date is within 24 hours', () => {
    vi.spyOn(Date, 'now').mockReturnValue(NOW)
    const soonDue = NOW + 12 * HOUR
    expect(getDueDateStatus(soonDue)).toBe('warning')
  })

  it('returns "warning" when due date is exactly 24 hours away', () => {
    vi.spyOn(Date, 'now').mockReturnValue(NOW)
    const exactlyOneDayAway = NOW + DAY
    expect(getDueDateStatus(exactlyOneDayAway)).toBe('warning')
  })

  it('returns "normal" when due date is more than 24 hours away', () => {
    vi.spyOn(Date, 'now').mockReturnValue(NOW)
    const farDue = NOW + 2 * DAY
    expect(getDueDateStatus(farDue)).toBe('normal')
  })
})

describe('formatDueDate', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('formats a date as "Today at HH:MM" if same day', () => {
    // Use a timestamp that is definitely "today" in local time: today at noon
    const now = new Date()
    const todayNoon = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 12, 0, 0).getTime()
    const result = formatDueDate(todayNoon)
    expect(typeof result).toBe('string')
    expect(result).toContain('Today at')
  })

  it('returns a string containing "at" with time portion', () => {
    const timestamp = NOW + 3 * DAY
    const result = formatDueDate(timestamp)
    expect(result).toContain('at')
  })
})

describe('getRelativeTime', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('returns "due now" when due date equals now', () => {
    vi.spyOn(Date, 'now').mockReturnValue(NOW)
    expect(getRelativeTime(NOW)).toBe('due now')
  })

  it('returns "overdue" when due date just passed (less than 1 minute)', () => {
    vi.spyOn(Date, 'now').mockReturnValue(NOW)
    expect(getRelativeTime(NOW - 30 * 1000)).toBe('overdue')
  })

  it('returns minutes overdue for recently passed due dates', () => {
    vi.spyOn(Date, 'now').mockReturnValue(NOW)
    expect(getRelativeTime(NOW - 5 * MINUTE)).toBe('5 minutes overdue')
  })

  it('returns hours overdue for past due dates', () => {
    vi.spyOn(Date, 'now').mockReturnValue(NOW)
    expect(getRelativeTime(NOW - 3 * HOUR)).toBe('3 hours overdue')
  })

  it('returns days overdue for long-past due dates', () => {
    vi.spyOn(Date, 'now').mockReturnValue(NOW)
    expect(getRelativeTime(NOW - 2 * DAY)).toBe('2 days overdue')
  })

  it('returns "in X minutes" for near-future due dates', () => {
    vi.spyOn(Date, 'now').mockReturnValue(NOW)
    expect(getRelativeTime(NOW + 30 * MINUTE)).toBe('in 30 minutes')
  })

  it('returns "in X hours" for future due dates within a day', () => {
    vi.spyOn(Date, 'now').mockReturnValue(NOW)
    expect(getRelativeTime(NOW + 5 * HOUR)).toBe('in 5 hours')
  })

  it('returns "in X days" for far-future due dates', () => {
    vi.spyOn(Date, 'now').mockReturnValue(NOW)
    expect(getRelativeTime(NOW + 3 * DAY)).toBe('in 3 days')
  })

  it('uses singular form for 1 day', () => {
    vi.spyOn(Date, 'now').mockReturnValue(NOW)
    expect(getRelativeTime(NOW + DAY)).toBe('in 1 day')
  })

  it('uses singular form for 1 hour', () => {
    vi.spyOn(Date, 'now').mockReturnValue(NOW)
    expect(getRelativeTime(NOW + HOUR)).toBe('in 1 hour')
  })

  it('uses singular form for 1 minute', () => {
    vi.spyOn(Date, 'now').mockReturnValue(NOW)
    expect(getRelativeTime(NOW + MINUTE)).toBe('in 1 minute')
  })
})
