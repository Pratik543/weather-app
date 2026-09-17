export interface GeoPlace {
  id: number
  name: string
  latitude: number
  longitude: number
  country?: string
  country_code?: string
  admin1?: string
}

export interface CurrentWeather {
  time: string
  temperature_2m: number
  relative_humidity_2m: number
  apparent_temperature: number
  is_day: number
  precipitation: number
  weather_code: number
  wind_speed_10m: number
  surface_pressure: number
}

export interface ForecastResponse {
  timezone: string
  current: CurrentWeather
  hourly: {
    time: string[]
    temperature_2m: number[]
    weather_code: number[]
    precipitation_probability: number[]
  }
  daily: {
    time: string[]
    weather_code: number[]
    temperature_2m_max: number[]
    temperature_2m_min: number[]
    sunrise: string[]
    sunset: string[]
    precipitation_probability_max: number[]
  }
}

export type ConditionGroup =
  | 'clear'
  | 'cloudy'
  | 'overcast'
  | 'fog'
  | 'rain'
  | 'snow'
  | 'thunder'

export interface Condition {
  label: string
  group: ConditionGroup
}

const CONDITIONS: Record<number, Condition> = {
  0: { label: 'Clear sky', group: 'clear' },
  1: { label: 'Mainly clear', group: 'clear' },
  2: { label: 'Partly cloudy', group: 'cloudy' },
  3: { label: 'Overcast', group: 'overcast' },
  45: { label: 'Fog', group: 'fog' },
  48: { label: 'Freezing fog', group: 'fog' },
  51: { label: 'Light drizzle', group: 'rain' },
  53: { label: 'Drizzle', group: 'rain' },
  55: { label: 'Heavy drizzle', group: 'rain' },
  56: { label: 'Freezing drizzle', group: 'rain' },
  57: { label: 'Freezing drizzle', group: 'rain' },
  61: { label: 'Light rain', group: 'rain' },
  63: { label: 'Rain', group: 'rain' },
  65: { label: 'Heavy rain', group: 'rain' },
  66: { label: 'Freezing rain', group: 'rain' },
  67: { label: 'Freezing rain', group: 'rain' },
  71: { label: 'Light snow', group: 'snow' },
  73: { label: 'Snow', group: 'snow' },
  75: { label: 'Heavy snow', group: 'snow' },
  77: { label: 'Snow grains', group: 'snow' },
  80: { label: 'Light showers', group: 'rain' },
  81: { label: 'Showers', group: 'rain' },
  82: { label: 'Violent showers', group: 'rain' },
  85: { label: 'Snow showers', group: 'snow' },
  86: { label: 'Snow showers', group: 'snow' },
  95: { label: 'Thunderstorm', group: 'thunder' },
  96: { label: 'Storm with hail', group: 'thunder' },
  99: { label: 'Storm with hail', group: 'thunder' },
}

export function getCondition(code: number): Condition {
  return CONDITIONS[code] ?? { label: 'Unknown', group: 'cloudy' }
}

const GEO_URL = 'https://geocoding-api.open-meteo.com/v1/search'
const FORECAST_URL = 'https://api.open-meteo.com/v1/forecast'

async function fetchJson<T>(url: string, signal?: AbortSignal): Promise<T> {
  const res = await fetch(url, { signal, headers: { Accept: 'application/json' } })
  if (!res.ok) throw new Error(`Request failed (${res.status})`)
  return (await res.json()) as T
}

export async function searchPlaces(
  query: string,
  signal?: AbortSignal,
): Promise<GeoPlace[]> {
  const q = query.trim().slice(0, 100)
  if (!q) return []
  const url = `${GEO_URL}?name=${encodeURIComponent(q)}&count=6&language=en&format=json`
  const data = await fetchJson<{ results?: GeoPlace[] }>(url, signal)
  return data.results ?? []
}

export interface ForecastParams {
  latitude: number
  longitude: number
  unit: 'celsius' | 'fahrenheit'
  signal?: AbortSignal
}

export async function fetchForecast({
  latitude,
  longitude,
  unit,
  signal,
}: ForecastParams): Promise<ForecastResponse> {
  const params = new URLSearchParams({
    latitude: latitude.toFixed(4),
    longitude: longitude.toFixed(4),
    current:
      'temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,wind_speed_10m,surface_pressure',
    hourly: 'temperature_2m,weather_code,precipitation_probability',
    daily:
      'weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,precipitation_probability_max',
    timezone: 'auto',
    forecast_days: '7',
    temperature_unit: unit,
    wind_speed_unit: unit === 'fahrenheit' ? 'mph' : 'kmh',
  })
  return fetchJson<ForecastResponse>(`${FORECAST_URL}?${params}`, signal)
}
