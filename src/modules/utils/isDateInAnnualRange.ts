export interface AnnualDate {
  month: number
  day: number
}

export interface AnnualDateRange {
  startsOn: AnnualDate
  endsOn: AnnualDate
}

const toMonthDayValue = ({ month, day }: AnnualDate) => month * 100 + day

export const isDateInAnnualRange = (date: Date, range: AnnualDateRange): boolean => {
  const current = toMonthDayValue({
    month: date.getMonth() + 1,
    day: date.getDate(),
  })
  const start = toMonthDayValue(range.startsOn)
  const end = toMonthDayValue(range.endsOn)

  if (start <= end) {
    return current >= start && current <= end
  }

  return current >= start || current <= end
}
