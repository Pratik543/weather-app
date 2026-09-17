import {
  Sun,
  Moon,
  CloudSun,
  CloudMoon,
  Cloud,
  CloudFog,
  CloudRain,
  CloudSnow,
  Lightning,
} from '@phosphor-icons/react'
import type { ConditionGroup } from '../lib/weather'

interface Props {
  group: ConditionGroup
  isDay: boolean
  size?: number
  className?: string
}

export default function WeatherIcon({ group, isDay, size = 32, className }: Props) {
  const props = { size, className, 'aria-hidden': true, weight: 'fill' as const }
  switch (group) {
    case 'clear':
      return isDay ? <Sun {...props} /> : <Moon {...props} />
    case 'cloudy':
      return isDay ? <CloudSun {...props} /> : <CloudMoon {...props} />
    case 'fog':
      return <CloudFog {...props} />
    case 'rain':
      return <CloudRain {...props} />
    case 'snow':
      return <CloudSnow {...props} />
    case 'thunder':
      return <Lightning {...props} />
    default:
      return <Cloud {...props} />
  }
}
