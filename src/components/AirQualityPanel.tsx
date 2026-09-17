import { Leaf } from '@phosphor-icons/react'
import type { AirQualityResponse } from '../lib/air'
import { aqiBand, pollutants } from '../lib/air'
import { round } from '../lib/format'

interface Props {
  air: AirQualityResponse
}

export default function AirQualityPanel({ air }: Props) {
  const aqi = air.current.european_aqi
  const band = aqiBand(aqi)
  const list = pollutants(air.current)

  return (
    <section aria-label="Air quality" className="rise" style={{ '--i': 4 } as React.CSSProperties}>
      <h2 className="mb-3 text-xs font-semibold tracking-widest text-white/50 uppercase">
        Air quality
      </h2>
      <div className="glass grid gap-4 rounded-2xl p-5 sm:grid-cols-[auto_1fr]">
        <div className="flex items-center gap-4 sm:flex-col sm:items-start">
          <div
            className="flex h-24 w-24 flex-col items-center justify-center rounded-full border-4"
            style={{ borderColor: band.color }}
            role="img"
            aria-label={`European air quality index ${aqi}, ${band.label}`}
          >
            <span className="text-3xl font-semibold">{round(aqi)}</span>
            <span className="text-[10px] tracking-wider text-white/50 uppercase">EU AQI</span>
          </div>
          <div>
            <p className="font-semibold" style={{ color: band.color }}>
              {band.label}
            </p>
            <p className="mt-1 max-w-[22ch] text-xs leading-relaxed text-white/60">{band.text}</p>
          </div>
        </div>

        <ul className="grid grid-cols-2 gap-2.5 md:grid-cols-3">
          {list.map((p) => {
            const ratio = Math.min(p.value / p.limit, 1)
            return (
              <li key={p.key} className="rounded-xl bg-white/5 p-3">
                <p className="text-xs text-white/55">{p.name}</p>
                <p className="mt-0.5 font-semibold">
                  {round(p.value)}
                  <span className="ml-1 text-[10px] font-normal text-white/45">{p.unit}</span>
                </p>
                <div className="mt-2 h-1 overflow-hidden rounded-full bg-white/10">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${Math.max(ratio * 100, 4)}%`,
                      backgroundColor: band.color,
                    }}
                  />
                </div>
              </li>
            )
          })}
        </ul>
      </div>
      <p className="mt-2 flex items-center justify-end gap-1 text-xs text-white/40">
        <Leaf size={12} aria-hidden />
        European AQI · Open-Meteo Air Quality
      </p>
    </section>
  )
}
