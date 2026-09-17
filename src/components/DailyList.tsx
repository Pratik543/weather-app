import type { ForecastResponse } from '../lib/weather'
import { getCondition } from '../lib/weather'
import { formatDay, round } from '../lib/format'
import WeatherIcon from './WeatherIcon'

interface Props {
  forecast: ForecastResponse
  unitLabel: string
}

export default function DailyList({ forecast, unitLabel }: Props) {
  const { daily } = forecast
  const weekMin = Math.min(...daily.temperature_2m_min)
  const weekMax = Math.max(...daily.temperature_2m_max)
  const span = Math.max(weekMax - weekMin, 1)

  return (
    <section aria-label="7-day forecast" className="rise" style={{ '--i': 2 } as React.CSSProperties}>
      <h2 className="mb-3 text-xs font-semibold tracking-widest text-white/50 uppercase">
        7-day forecast
      </h2>
      <ol className="glass divide-y divide-white/10 overflow-hidden rounded-2xl">
        {daily.time.map((date, i) => {
          const condition = getCondition(daily.weather_code[i])
          const min = daily.temperature_2m_min[i]
          const max = daily.temperature_2m_max[i]
          const left = ((min - weekMin) / span) * 100
          const width = Math.max(((max - min) / span) * 100, 6)
          return (
            <li key={date} className="grid grid-cols-[5.5rem_2rem_1fr] items-center gap-3 px-4 py-3 sm:grid-cols-[7rem_2.5rem_1fr_2.75rem] sm:gap-4">
              <span className="text-sm font-medium">{formatDay(date, i)}</span>
              <WeatherIcon group={condition.group} isDay size={24} className="text-sky-200" />
              <div className="flex min-w-0 items-center gap-2.5">
                <span className="w-8 flex-none text-right text-sm text-white/55">{round(min)}°</span>
                <div className="relative h-1.5 min-w-0 flex-1 rounded-full bg-white/10">
                  <div
                    className="absolute inset-y-0 rounded-full bg-gradient-to-r from-sky-300 to-amber-200"
                    style={{ left: `${left}%`, width: `${width}%` }}
                    role="img"
                    aria-label={`Low ${round(min)} degrees, high ${round(max)} degrees`}
                  />
                </div>
                <span className="w-8 flex-none text-sm font-semibold">{round(max)}°</span>
              </div>
              <span className="hidden w-full text-right text-xs text-sky-300 sm:block">
                {daily.precipitation_probability_max[i]}%
              </span>
            </li>
          )
        })}
      </ol>
      <p className="mt-2 text-right text-xs text-white/40">Temperatures in °{unitLabel}</p>
    </section>
  )
}
