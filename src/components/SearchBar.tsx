import { useEffect, useRef, useState } from 'react'
import { MagnifyingGlass, MapPin, SpinnerGap } from '@phosphor-icons/react'
import { searchPlaces, type GeoPlace } from '../lib/weather'
import { placeLabel } from '../lib/format'

interface Props {
  onSelect: (place: GeoPlace) => void
  onLocate: () => void
  locating: boolean
}

export default function SearchBar({ onSelect, onLocate, locating }: Props) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<GeoPlace[]>([])
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [activeIndex, setActiveIndex] = useState(-1)
  const rootRef = useRef<HTMLDivElement>(null)
  const abortRef = useRef<AbortController | null>(null)

  useEffect(() => {
    const q = query.trim()
    if (q.length < 2) {
      setResults([])
      setLoading(false)
      return
    }
    setLoading(true)
    const timer = setTimeout(async () => {
      abortRef.current?.abort()
      const controller = new AbortController()
      abortRef.current = controller
      try {
        const places = await searchPlaces(q, controller.signal)
        setResults(places)
        setOpen(true)
        setActiveIndex(-1)
      } catch (err) {
        if ((err as Error).name !== 'AbortError') setResults([])
      } finally {
        setLoading(false)
      }
    }, 300)
    return () => clearTimeout(timer)
  }, [query])

  useEffect(() => {
    function onPointerDown(e: PointerEvent) {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('pointerdown', onPointerDown)
    return () => document.removeEventListener('pointerdown', onPointerDown)
  }, [])

  function choose(place: GeoPlace) {
    onSelect(place)
    setQuery('')
    setResults([])
    setOpen(false)
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if (!open || results.length === 0) return
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActiveIndex((i) => (i + 1) % results.length)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActiveIndex((i) => (i - 1 + results.length) % results.length)
    } else if (e.key === 'Enter' && activeIndex >= 0) {
      e.preventDefault()
      choose(results[activeIndex])
    } else if (e.key === 'Escape') {
      setOpen(false)
    }
  }

  return (
    <div ref={rootRef} className="relative w-full max-w-md">
      <div className="glass flex items-center gap-2 rounded-2xl px-4 py-1">
        <MagnifyingGlass size={20} weight="bold" className="shrink-0 text-white/60" aria-hidden />
        <input
          type="search"
          role="combobox"
          aria-expanded={open}
          aria-controls="place-results"
          aria-label="Search for a city"
          placeholder="Search any city…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => results.length > 0 && setOpen(true)}
          onKeyDown={onKeyDown}
          className="w-full bg-transparent py-3 text-base text-white placeholder:text-white/50 focus:outline-none"
        />
        {loading ? (
          <SpinnerGap size={20} className="shrink-0 animate-spin text-white/60" aria-hidden />
        ) : (
          <button
            type="button"
            onClick={onLocate}
            disabled={locating}
            title="Use my location"
            aria-label="Use my current location"
            className="flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-xl text-white/70 transition hover:bg-white/10 hover:text-white focus-visible:outline-2 focus-visible:outline-sky-300 active:scale-95 disabled:opacity-50"
          >
            {locating ? (
              <SpinnerGap size={18} className="animate-spin" aria-hidden />
            ) : (
              <MapPin size={18} weight="bold" aria-hidden />
            )}
          </button>
        )}
      </div>

      {open && results.length > 0 && (
        <ul
          id="place-results"
          role="listbox"
          className="glass absolute z-20 mt-2 w-full overflow-hidden rounded-2xl p-1.5"
        >
          {results.map((place, i) => (
            <li key={`${place.id}-${i}`} role="option" aria-selected={i === activeIndex}>
              <button
                type="button"
                onClick={() => choose(place)}
                onMouseEnter={() => setActiveIndex(i)}
                className={`w-full cursor-pointer rounded-xl px-4 py-2.5 text-left transition ${
                  i === activeIndex ? 'bg-white/15' : ''
                }`}
              >
                <span className="font-medium">{place.name}</span>
                <span className="block text-sm text-white/60">
                  {placeLabel('', place.admin1, place.country).replace(/^,\s*/, '')}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
