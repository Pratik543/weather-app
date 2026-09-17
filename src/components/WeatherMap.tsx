import { useEffect, useState } from 'react'
import { MapContainer, TileLayer, CircleMarker, ZoomControl } from 'react-leaflet'
import { Broadcast } from '@phosphor-icons/react'

interface RadarData {
  host: string
  radar: {
    past: { time: number; path: string }[]
  }
}

const RADAR_URL = 'https://api.rainviewer.com/public/weather-maps.json'

interface Props {
  latitude: number
  longitude: number
  placeName: string
}

export default function WeatherMap({ latitude, longitude, placeName }: Props) {
  const [radar, setRadar] = useState<RadarData | null>(null)

  useEffect(() => {
    const controller = new AbortController()
    fetch(RADAR_URL, { signal: controller.signal })
      .then((res) => (res.ok ? res.json() : Promise.reject(new Error(String(res.status)))))
      .then((data: RadarData) => setRadar(data))
      .catch(() => setRadar(null))
    return () => controller.abort()
  }, [])

  const frame = radar?.radar.past.at(-1)

  return (
    <section aria-label="Weather radar map" className="rise" style={{ '--i': 3 } as React.CSSProperties}>
      <h2 className="mb-3 text-xs font-semibold tracking-widest text-white/50 uppercase">
        Live rain radar
      </h2>
      <div className="glass relative overflow-hidden rounded-2xl">
        <MapContainer
          key={`${latitude.toFixed(2)},${longitude.toFixed(2)}`}
          center={[latitude, longitude]}
          zoom={6}
          scrollWheelZoom={false}
          zoomControl={false}
          className="h-[320px] w-full"
          attributionControl={false}
        >
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            attribution='&copy; OpenStreetMap contributors &copy; CARTO'
          />
          {frame && radar && (
            <TileLayer
              url={`${radar.host}${frame.path}/256/{z}/{x}/{y}/2/1_1.png`}
              opacity={0.65}
              zIndex={400}
            />
          )}
          <CircleMarker
            center={[latitude, longitude]}
            radius={8}
            pathOptions={{ color: '#38bdf8', weight: 2, fillColor: '#0ea5e9', fillOpacity: 0.5 }}
          />
          <ZoomControl position="bottomright" />
        </MapContainer>

        <div className="pointer-events-none absolute top-3 left-3 z-[500] flex items-center gap-2 rounded-full bg-slate-950/70 px-3 py-1.5 text-xs font-medium backdrop-blur">
          <Broadcast size={14} className="text-sky-300" aria-hidden />
          {placeName}
        </div>
        {!frame && (
          <div className="pointer-events-none absolute inset-0 z-[500] flex items-center justify-center">
            <span className="rounded-full bg-slate-950/70 px-4 py-2 text-xs text-white/70">
              Loading radar…
            </span>
          </div>
        )}
      </div>
      <p className="mt-2 text-xs text-white/40">
        Radar by RainViewer · Basemap &copy; OpenStreetMap, CARTO
      </p>
    </section>
  )
}
