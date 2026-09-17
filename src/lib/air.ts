export interface AirQualityResponse {
  current: {
    time: string
    european_aqi: number
    us_aqi: number
    pm10: number
    pm2_5: number
    carbon_monoxide: number
    nitrogen_dioxide: number
    sulphur_dioxide: number
    ozone: number
  }
}

const AQI_URL = 'https://air-quality-api.open-meteo.com/v1/air-quality'

export async function fetchAirQuality(
  latitude: number,
  longitude: number,
  signal?: AbortSignal,
): Promise<AirQualityResponse> {
  const params = new URLSearchParams({
    latitude: latitude.toFixed(4),
    longitude: longitude.toFixed(4),
    current:
      'european_aqi,us_aqi,pm10,pm2_5,carbon_monoxide,nitrogen_dioxide,sulphur_dioxide,ozone',
    timezone: 'auto',
  })
  const res = await fetch(`${AQI_URL}?${params}`, {
    signal,
    headers: { Accept: 'application/json' },
  })
  if (!res.ok) throw new Error(`Air quality request failed (${res.status})`)
  return (await res.json()) as AirQualityResponse
}

export interface AqiBand {
  label: string
  color: string
  text: string
}

export function aqiBand(aqi: number): AqiBand {
  if (aqi <= 20)
    return { label: 'Good', color: '#34d399', text: 'Air quality is ideal — enjoy the outdoors.' }
  if (aqi <= 40)
    return { label: 'Fair', color: '#a3e635', text: 'Acceptable air quality for nearly everyone.' }
  if (aqi <= 60)
    return { label: 'Moderate', color: '#facc15', text: 'Sensitive groups should limit long outdoor effort.' }
  if (aqi <= 80)
    return { label: 'Poor', color: '#fb923c', text: 'Reduce prolonged outdoor activity if you feel discomfort.' }
  if (aqi <= 100)
    return { label: 'Very poor', color: '#f87171', text: 'Avoid prolonged outdoor exertion where possible.' }
  return { label: 'Extremely poor', color: '#c084fc', text: 'Stay indoors and keep windows closed if you can.' }
}

export interface Pollutant {
  key: string
  name: string
  value: number
  unit: string
  limit: number
}

export function pollutants(c: AirQualityResponse['current']): Pollutant[] {
  return [
    { key: 'pm25', name: 'PM2.5', value: c.pm2_5, unit: 'µg/m³', limit: 25 },
    { key: 'pm10', name: 'PM10', value: c.pm10, unit: 'µg/m³', limit: 50 },
    { key: 'o3', name: 'Ozone', value: c.ozone, unit: 'µg/m³', limit: 120 },
    { key: 'no2', name: 'NO₂', value: c.nitrogen_dioxide, unit: 'µg/m³', limit: 40 },
    { key: 'so2', name: 'SO₂', value: c.sulphur_dioxide, unit: 'µg/m³', limit: 40 },
    { key: 'co', name: 'CO', value: c.carbon_monoxide, unit: 'µg/m³', limit: 4000 },
  ]
}
