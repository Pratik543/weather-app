import type { ConditionGroup } from './weather'

export function skyClass(group: ConditionGroup, isDay: boolean): string {
  switch (group) {
    case 'clear':
      return isDay ? 'sky-clear-day' : 'sky-clear-night'
    case 'cloudy':
      return isDay ? 'sky-cloudy-day' : 'sky-cloudy-night'
    case 'overcast':
      return 'sky-overcast'
    case 'fog':
      return 'sky-fog'
    case 'rain':
      return isDay ? 'sky-rain-day' : 'sky-rain-night'
    case 'snow':
      return 'sky-snow'
    case 'thunder':
      return 'sky-thunder'
  }
}

export function placeLabel(
  name: string,
  admin1?: string,
  country?: string,
): string {
  const parts = [name]
  if (admin1 && admin1 !== name) parts.push(admin1)
  if (country) parts.push(country)
  return parts.join(', ')
}

export function formatHour(iso: string, tz?: string): string {
  const d = new Date(iso + (iso.length === 16 ? ':00' : ''))
  return new Intl.DateTimeFormat(undefined, {
    hour: 'numeric',
    timeZone: tz,
  }).format(d)
}

export function formatDay(iso: string, index: number): string {
  if (index === 0) return 'Today'
  const d = new Date(iso + 'T12:00:00')
  return new Intl.DateTimeFormat(undefined, { weekday: 'long' }).format(d)
}

export function formatDate(iso: string, tz?: string): string {
  const d = new Date(iso + (iso.length === 16 ? ':00' : ''))
  return new Intl.DateTimeFormat(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    timeZone: tz,
  }).format(d)
}

export function formatTime(iso: string, tz?: string): string {
  const d = new Date(iso + (iso.length === 16 ? ':00' : ''))
  return new Intl.DateTimeFormat(undefined, {
    hour: 'numeric',
    minute: '2-digit',
    timeZone: tz,
  }).format(d)
}

export function round(n: number): number {
  return Math.round(n)
}
