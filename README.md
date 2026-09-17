# Skycast

A beautiful weather app with current conditions, 24-hour and 7-day forecasts for any city on Earth. Built with React, TypeScript, and Tailwind CSS.

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)

## Features

- **City Search** — Instant autocomplete powered by Open-Meteo Geocoding
- **Geolocation** — One-tap "use my location" support
- **Current Conditions** — Temperature, feels like, humidity, wind, pressure, precipitation, sunrise/sunset
- **24-Hour Forecast** — Scrollable hourly strip with weather icons and precipitation probability
- **7-Day Forecast** — Daily highs/lows with visual temperature range bars
- **Live Rain Radar** — Interactive Leaflet map with RainViewer radar overlay
- **Air Quality** — European AQI index with PM2.5, PM10, Ozone, NO2, SO2, and CO breakdowns
- **Unit Toggle** — Switch between Celsius and Fahrenheit (persisted in localStorage)
- **Recent Searches** — Remembers your last 5 searched cities
- **Dynamic Skies** — Background gradients change based on weather conditions and day/night
- **Glassmorphism UI** — Frosted glass panels with subtle animations
- **Accessibility** — ARIA labels, keyboard navigation, reduced motion support
- **No API Key** — Open-Meteo is completely free with no account required

## Tech Stack

| Technology | Version | Purpose |
|---|---|---|
| React | 19 | UI framework |
| TypeScript | 6 | Type safety |
| Vite | 8 | Build tool & dev server |
| Tailwind CSS | 4 | Utility-first styling |
| Leaflet / React-Leaflet | 1.9 / 5 | Interactive maps |
| Phosphor Icons | 2 | Icon library |
| Outfit Variable | — | Custom font |

### APIs

- [Open-Meteo Forecast](https://open-meteo.com) — Weather data
- [Open-Meteo Geocoding](https://open-meteo.com/en/docs/geocoding-api) — City search
- [Open-Meteo Air Quality](https://open-meteo.com/en/docs/air-quality-api) — AQI data
- [RainViewer](https://www.rainviewer.com) — Live rain radar

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) 18+ or [Bun](https://bun.sh/) 1+
- npm, yarn, or bun as your package manager

### Install

```bash
git clone https://github.com/Pratik543/weather-app.git
cd weather-app
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

### Lint

```bash
npm run lint
```

## Project Structure

```
weather-app/
├── public/
│   ├── favicon.svg
│   └── icons.svg
├── src/
│   ├── components/
│   │   ├── AirQualityPanel.tsx    # AQI index + pollutant breakdown
│   │   ├── CurrentPanel.tsx       # Current weather conditions
│   │   ├── DailyList.tsx          # 7-day forecast list
│   │   ├── HourlyStrip.tsx        # 24-hour scrollable forecast
│   │   ├── LoadingSkeleton.tsx    # Skeleton loading states
│   │   ├── SearchBar.tsx          # City search with autocomplete
│   │   ├── WeatherIcon.tsx        # SVG weather condition icons
│   │   └── WeatherMap.tsx         # Leaflet map with rain radar
│   ├── lib/
│   │   ├── air.ts                 # Air quality API + helpers
│   │   ├── format.ts              # Date/time/label formatters
│   │   └── weather.ts             # Forecast & geocoding API
│   ├── App.tsx                    # Root component & state management
│   ├── index.css                  # Global styles, sky themes, glass
│   └── main.tsx                   # Entry point
├── index.html
├── package.json
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.node.json
├── vite.config.ts
└── .oxlintrc.json
```

## Accessibility

- All interactive elements are keyboard-navigable
- Search results use `role="listbox"` / `role="option"` with `aria-selected`
- Weather panels use `aria-label` for screen reader context
- Animations respect `prefers-reduced-motion`
- Transparency effects respect `prefers-reduced-transparency`

## Privacy

No accounts, no tracking, no analytics. All data comes from free, open APIs. Recent searches are stored only in your browser's localStorage.

## License

MIT
