import { useCallback, useEffect, useRef, useState } from 'react'
import { ArrowClockwise } from '@phosphor-icons/react'
import SearchBar from './components/SearchBar'
import CurrentPanel from './components/CurrentPanel'
import HourlyStrip from './components/HourlyStrip'
import DailyList from './components/DailyList'
import { WeatherSkeleton } from './components/LoadingSkeleton'
import {
  fetchForecast,
  getCondition,
  type ForecastResponse,
  type GeoPlace,
} from './lib/weather'
import { fetchAirQuality, type AirQualityResponse } from './lib/air'
import { placeLabel, skyClass } from './lib/format'
import WeatherMap from './components/WeatherMap'
import AirQualityPanel from './components/AirQualityPanel'

type Unit = 'celsius' | 'fahrenheit'

interface RecentPlace {
  name: string
  latitude: number
  longitude: number
  country?: string
  admin1?: string
}

const RECENT_KEY = 'weather-app:recent'
const UNIT_KEY = 'weather-app:unit'

function loadJson<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : fallback
  } catch {
    return fallback
  }
}

function saveJson(key: string, value: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    /* storage unavailable */
  }
}

export default function App() {
  const [unit, setUnit] = useState<Unit>(() =>
    loadJson<Unit>(UNIT_KEY, 'celsius'),
  )
  const [place, setPlace] = useState<GeoPlace | null>(null)
  const [forecast, setForecast] = useState<ForecastResponse | null>(null)
  const [air, setAir] = useState<AirQualityResponse | null>(null)
  const [status, setStatus] = useState<'idle' | 'loading' | 'ready' | 'error'>(
    'idle',
  )
  const [errorMsg, setErrorMsg] = useState('')
  const [locating, setLocating] = useState(false)
  const abortRef = useRef<AbortController | null>(null)

  useEffect(() => saveJson(UNIT_KEY, unit), [unit])

  const loadForecast = useCallback(
    async (target: GeoPlace, u: Unit) => {
      abortRef.current?.abort()
      const controller = new AbortController()
      abortRef.current = controller
      setStatus('loading')
      try {
        const data = await fetchForecast({
          latitude: target.latitude,
          longitude: target.longitude,
          unit: u,
          signal: controller.signal,
        })
        setForecast(data)
        setStatus('ready')
        try {
          setAir(
            await fetchAirQuality(target.latitude, target.longitude, controller.signal),
          )
        } catch (err) {
          if ((err as Error).name !== 'AbortError') setAir(null)
        }
      } catch (err) {
        if ((err as Error).name === 'AbortError') return
        setErrorMsg(
          (err as Error).message || 'Could not load the forecast. Try again.',
        )
        setStatus('error')
      }
    },
    [],
  )

  const selectPlace = useCallback(
    (p: GeoPlace) => {
      setPlace(p)
      setForecast(null)
      setAir(null)
      loadForecast(p, unit)
      const recent = loadJson<RecentPlace[]>(RECENT_KEY, [])
      const entry: RecentPlace = {
        name: p.name,
        latitude: p.latitude,
        longitude: p.longitude,
        country: p.country,
        admin1: p.admin1,
      }
      saveJson(
        RECENT_KEY,
        [entry, ...recent.filter((r) => r.name !== entry.name)].slice(0, 5),
      )
    },
    [loadForecast, unit],
  )

  const retryUnitChange = useCallback(
    (u: Unit) => {
      setUnit(u)
      if (place) loadForecast(place, u)
    },
    [place, loadForecast],
  )

  function locate() {
    if (!('geolocation' in navigator)) {
      setErrorMsg('Geolocation is not supported by this browser.')
      setStatus('error')
      return
    }
    setLocating(true)
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocating(false)
        selectPlace({
          id: 0,
          name: 'My location',
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
        })
      },
      () => {
        setLocating(false)
        setErrorMsg('Location permission denied. Search for a city instead.')
        setStatus('error')
      },
      { timeout: 10000, maximumAge: 300000 },
    )
  }

  const condition = forecast ? getCondition(forecast.current.weather_code) : null
  const isDay = forecast ? forecast.current.is_day === 1 : true
  const sky = condition ? skyClass(condition.group, isDay) : ''

  return (
    <div className={`min-h-[100dvh] transition-[background] duration-700 ${sky}`}>
      <div className="mx-auto flex min-h-[100dvh] w-full max-w-3xl flex-col px-4 py-6 sm:px-6">
        <header className="flex items-center justify-between gap-3">
          <h1 className="text-lg font-semibold tracking-tight">Skycast</h1>
          <div
            role="group"
            aria-label="Temperature units"
            className="glass flex rounded-full p-1 text-sm font-medium"
          >
            {(['celsius', 'fahrenheit'] as const).map((u) => (
              <button
                key={u}
                type="button"
                onClick={() => retryUnitChange(u)}
                aria-pressed={unit === u}
                className={`cursor-pointer rounded-full px-4 py-1.5 transition ${
                  unit === u
                    ? 'bg-white text-slate-900'
                    : 'text-white/70 hover:text-white'
                }`}
              >
                °{u === 'celsius' ? 'C' : 'F'}
              </button>
            ))}
          </div>
        </header>

        <main className="mt-6 flex flex-1 flex-col gap-8">
          <SearchBar onSelect={selectPlace} onLocate={locate} locating={locating} />

          {status === 'error' && (
            <div role="alert" className="glass rounded-2xl p-5">
              <p className="font-medium">{errorMsg}</p>
              <button
                type="button"
                onClick={() => place && loadForecast(place, unit)}
                className="mt-3 inline-flex cursor-pointer items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-900 transition hover:bg-white/90 active:scale-[0.98]"
              >
                <ArrowClockwise size={16} weight="bold" aria-hidden />
                Retry
              </button>
            </div>
          )}

          {status === 'loading' && <WeatherSkeleton />}

          {status === 'ready' && forecast && place && (
            <>
              <CurrentPanel
                placeName={placeLabel(place.name, place.admin1, place.country)}
                current={forecast.current}
                timezone={forecast.timezone}
                unitLabel={unit === 'celsius' ? 'C' : 'F'}
                sunrise={forecast.daily.sunrise[0]}
                sunset={forecast.daily.sunset[0]}
              />
              <HourlyStrip forecast={forecast} />
              <DailyList forecast={forecast} unitLabel={unit === 'celsius' ? 'C' : 'F'} />
              <WeatherMap
                latitude={place.latitude}
                longitude={place.longitude}
                placeName={place.name}
              />
              {air && <AirQualityPanel air={air} />}
            </>
          )}

          {status === 'idle' && (
            <div className="glass mt-10 rounded-3xl p-8 text-center rise">
              <p className="text-xl font-medium">Where's the sky?</p>
              <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-white/60">
                Search for any city above, or use your location to see current
                conditions, the next 24 hours, and a 7-day outlook.
              </p>
            </div>
          )}
        </main>

        <footer className="mt-10 pb-2 text-center text-xs text-white/40">
          Data by Open-Meteo · no account, no tracking
        </footer>
      </div>
    </div>
  )
}
