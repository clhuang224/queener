import { describe, expect, it } from 'vitest'
import { isDateInAnnualRange, type AnnualDateRange } from './isDateInAnnualRange'

const halloweenRange: AnnualDateRange = {
  startsOn: { month: 10, day: 1 },
  endsOn: { month: 10, day: 31 },
}

describe('isDateInAnnualRange', () => {
  it('matches the same month and day range every year', () => {
    expect(isDateInAnnualRange(new Date(2026, 9, 1), halloweenRange)).toBe(true)
    expect(isDateInAnnualRange(new Date(2027, 9, 31), halloweenRange)).toBe(true)
    expect(isDateInAnnualRange(new Date(2027, 10, 1), halloweenRange)).toBe(false)
  })

  it('supports ranges that cross the end of the year', () => {
    const holidayRange: AnnualDateRange = {
      startsOn: { month: 12, day: 20 },
      endsOn: { month: 1, day: 5 },
    }

    expect(isDateInAnnualRange(new Date(2026, 11, 25), holidayRange)).toBe(true)
    expect(isDateInAnnualRange(new Date(2027, 0, 3), holidayRange)).toBe(true)
    expect(isDateInAnnualRange(new Date(2027, 0, 6), holidayRange)).toBe(false)
  })
})
