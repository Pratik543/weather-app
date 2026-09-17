import { Drop, Wind, Gauge, Thermometer } from '@phosphor-icons/react'
import type { CurrentWeather } from '../lib/weather'
import { getCondition } from '../lib/weather'
import { formatDate, formatTime, round } from '../lib/format'
import WeatherIcon from './WeatherIcon'

interface Props {
  placeName: string
  current: CurrentWeather
  timezone: string
  unitLabel: string
  sunrise: string
  sunset: string
}

export default function CurrentPanel({
  placeName,
  current,
  timezone,
  unitLabel,
  sunrise,
  sunset,
}: Props) {
  const condition = getCondition(current.weather_code)
  const isDay = current.is_day === 1

  return (
    <section aria-label="Current weather" className="rise" style={{ '--i': 0 } as React.CSSProperties}>
      <p className="text-lg font-medium text-white/80">{placeName}</p>
      <p className="text-sm text-white/55">{formatDate(current.time ?? '', timezone)}</p>

      <div className="mt-6 flex flex-wrap items-center gap-x-8 gap-y-4">
        <div className="flex items-start">
          <span className="text-[5.5rem] leading-none font-semibold tracking-tighter md:text-[7rem]">
            {round(current.temperature_2m)}
          </span>
          <span className="mt-2 text-2xl font-medium text-white/70 md:text-3xl">°{unitLabel}</span>
        </div>
        <div className="flex items-center gap-3">
          <WeatherIcon group={condition.group} isDay={isDay} size={56} className="text-sky-200 drop-shadow-lg" />
          <div>
            <p className="text-xl font-medium">{condition.label}</p>
            <p className="text-sm text-white/60">
              Feels like {round(current.apparent_temperature)}°{unitLabel}
            </p>
          </div>
        </div>
      </div>

      <dl className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm text-white/70">
        <div className="flex items-center gap-1.5">
          <Drop size={16} aria-hidden />
          <dt className="sr-only">Humidity</dt>
          <dd>{current.relative_humidity_2m}% humidity</dd>
        </div>
        <div className="flex items-center gap-1.5">
          <Wind size={16} aria-hidden />
          <dt className="sr-only">Wind</dt>
          <dd>
            {round(current.wind_speed_10m)} {unitLabel === 'F' ? 'mph' : 'km/h'}
          </dd>
        </div>
        <div className="flex items-center gap-1.5">
          <Gauge size={16} aria-hidden />
          <dt className="sr-only">Pressure</dt>
          <dd>{round(current.surface_pressure)} hPa</dd>
        </div>
        <div className="flex items-center gap-1.5">
          <Thermometer size={16} aria-hidden />
          <dt className="sr-only">Precipitation</dt>
          <dd>{current.precipitation} mm precip</dd>
        </div>
        <div className="flex items-center gap-1.5">
          <span aria-hidden>↑</span>
          <dt className="sr-only">Sunrise</dt>
          <dd>{formatTime(sunrise, timezone)}</dd>
        </div>
        <div className="flex items-center gap-1.5">
          <span aria-hidden>↓</span>
          <dt className="sr-only">Sunset</dt>
          <dd>{formatTime(sunset, timezone)}</dd>
        </div>
      </dl>
    </section>
  )
}
