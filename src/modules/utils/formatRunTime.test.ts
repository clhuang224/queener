import { describe, expect, it } from 'vitest'
import { formatRunTime } from './formatRunTime'

describe('formatRunTime', () => {
  it('formats run time milliseconds as mm:ss.fff', () => {
    expect(formatRunTime(0)).toBe('00:00.000')
    expect(formatRunTime(12)).toBe('00:00.012')
    expect(formatRunTime(83_427)).toBe('01:23.427')
  })

  it('keeps minutes readable beyond one hour', () => {
    expect(formatRunTime(3_660_001)).toBe('61:00.001')
  })

  it('floors decimal milliseconds and clamps negative values to zero', () => {
    expect(formatRunTime(1234.9)).toBe('00:01.234')
    expect(formatRunTime(-1)).toBe('00:00.000')
  })
})
