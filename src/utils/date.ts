import dayjs from 'dayjs'

export function monthKey(d: string | Date) {
  return dayjs(d).format('YYYY-MM')
}

export function startEndOfMonth(ym: string) {
  const d = dayjs(ym + '-01')
  return { start: d.startOf('month').toISOString(), end: d.endOf('month').toISOString() }
}
