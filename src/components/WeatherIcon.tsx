import React from 'react';
import {
  Sun,
  SunMedium,
  CloudSun,
  Cloud,
  CloudFog,
  CloudDrizzle,
  CloudRain,
  CloudRainWind,
  CloudSnow,
  Snowflake,
  CloudLightning,
  CloudSunRain,
  Moon,
  CloudMoon,
} from 'lucide-react';
import { getWMOInfo } from '../utils/wmo';

interface WeatherIconProps {
  code: number;
  isDay?: boolean;
  className?: string;
  size?: number;
}

export const WeatherIcon: React.FC<WeatherIconProps> = ({
  code,
  isDay = true,
  className = 'w-6 h-6',
  size,
}) => {
  const wmo = getWMOInfo(code);

  if (!isDay && (code === 0 || code === 1)) {
    return <Moon className={`text-indigo-400 ${className}`} size={size} />;
  }

  if (!isDay && code === 2) {
    return <CloudMoon className={`text-slate-400 ${className}`} size={size} />;
  }

  switch (wmo.iconName) {
    case 'Sun':
      return <Sun className={`text-amber-500 animate-spin-slow ${className}`} size={size} />;
    case 'SunMedium':
      return <SunMedium className={`text-amber-500 ${className}`} size={size} />;
    case 'CloudSun':
      return <CloudSun className={`text-sky-500 ${className}`} size={size} />;
    case 'Cloud':
      return <Cloud className={`text-slate-400 ${className}`} size={size} />;
    case 'CloudFog':
      return <CloudFog className={`text-slate-400 ${className}`} size={size} />;
    case 'CloudDrizzle':
      return <CloudDrizzle className={`text-blue-400 ${className}`} size={size} />;
    case 'CloudRain':
      return <CloudRain className={`text-blue-500 ${className}`} size={size} />;
    case 'CloudRainWind':
      return <CloudRainWind className={`text-blue-600 ${className}`} size={size} />;
    case 'CloudSnow':
      return <CloudSnow className={`text-sky-300 ${className}`} size={size} />;
    case 'Snowflake':
      return <Snowflake className={`text-sky-300 ${className}`} size={size} />;
    case 'CloudLightning':
      return <CloudLightning className={`text-amber-600 ${className}`} size={size} />;
    case 'CloudSunRain':
      return <CloudSunRain className={`text-blue-400 ${className}`} size={size} />;
    default:
      return <CloudSun className={`text-sky-500 ${className}`} size={size} />;
  }
};
