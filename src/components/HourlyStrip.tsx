import type { ForecastResponse } from '../lib/weather'
import { getCondition } from '../lib/weather'
import { formatHour, round } from '../lib/format'
import WeatherIcon from './WeatherIcon'

interface Props {
  forecast: ForecastResponse
}

export default function HourlyStrip({ forecast }: Props) {
  const { hourly } = forecast
  const nowIso = forecast.current.time.slice(0, 13)
  let start = hourly.time.findIndex((t) => t.slice(0, 13) >= nowIso)
  if (start < 0) start = 0
  const hours = hourly.time
    .slice(start, start + 24)
    .map((time, i) => ({
      time,
      temp: hourly.temperature_2m[start + i],
      code: hourly.weather_code[start + i],
      pop: hourly.precipitation_probability[start + i],
    }))

  return (
    <section aria-label="Hourly forecast for the next 24 hours" className="rise" style={{ '--i': 1 } as React.CSSProperties}>
      <h2 className="mb-3 text-xs font-semibold tracking-widest text-white/50 uppercase">
        Next 24 hours
      </h2>
      <ul className="scroll-snap flex gap-2 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {hours.map((h, i) => {
          const condition = getCondition(h.code)
          return (
            <li
              key={h.time}
              className="glass scroll-snap-align-start flex min-w-[76px] snap-start flex-col items-center gap-1.5 rounded-2xl px-3 py-3.5"
            >
              <span className="text-xs text-white/60">{i === 0 ? 'Now' : formatHour(h.time, forecast.timezone)}</span>
              <WeatherIcon group={condition.group} isDay={isDayHour(h.time)} size={26} className="text-sky-200" />
              <span className="text-sm font-semibold">{round(h.temp)}°</span>
              <span className={`text-[11px] ${h.pop > 30 ? 'text-sky-300' : 'text-white/40'}`}>
                {h.pop}%
              </span>
            </li>
          )
        })}
      </ul>
    </section>
  )
}

function isDayHour(iso: string): boolean {
  const hour = parseInt(iso.slice(11, 13), 10)
  return hour >= 6 && hour < 19
}
