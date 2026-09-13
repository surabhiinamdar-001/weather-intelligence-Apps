export interface WMOInfo {
  code: number;
  description: string;
  category: 'clear' | 'cloudy' | 'fog' | 'drizzle' | 'rain' | 'snow' | 'storm';
  iconName: string;
  bgGradient: string;
}

export const WMO_CODES: Record<number, WMOInfo> = {
  0: {
    code: 0,
    description: 'Clear sky',
    category: 'clear',
    iconName: 'Sun',
    bgGradient: 'from-amber-400 to-sky-500',
  },
  1: {
    code: 1,
    description: 'Mainly clear',
    category: 'clear',
    iconName: 'SunMedium',
    bgGradient: 'from-amber-300 to-sky-400',
  },
  2: {
    code: 2,
    description: 'Partly cloudy',
    category: 'cloudy',
    iconName: 'CloudSun',
    bgGradient: 'from-sky-400 to-slate-400',
  },
  3: {
    code: 3,
    description: 'Overcast',
    category: 'cloudy',
    iconName: 'Cloud',
    bgGradient: 'from-slate-400 to-zinc-500',
  },
  45: {
    code: 45,
    description: 'Foggy',
    category: 'fog',
    iconName: 'CloudFog',
    bgGradient: 'from-slate-300 to-slate-500',
  },
  48: {
    code: 48,
    description: 'Depositing rime fog',
    category: 'fog',
    iconName: 'CloudFog',
    bgGradient: 'from-slate-400 to-slate-600',
  },
  51: {
    code: 51,
    description: 'Light drizzle',
    category: 'drizzle',
    iconName: 'CloudDrizzle',
    bgGradient: 'from-sky-400 to-blue-500',
  },
  53: {
    code: 53,
    description: 'Moderate drizzle',
    category: 'drizzle',
    iconName: 'CloudDrizzle',
    bgGradient: 'from-blue-400 to-blue-600',
  },
  55: {
    code: 55,
    description: 'Dense drizzle',
    category: 'drizzle',
    iconName: 'CloudDrizzle',
    bgGradient: 'from-blue-500 to-indigo-600',
  },
  56: {
    code: 56,
    description: 'Light freezing drizzle',
    category: 'drizzle',
    iconName: 'CloudSnow',
    bgGradient: 'from-cyan-400 to-blue-600',
  },
  57: {
    code: 57,
    description: 'Dense freezing drizzle',
    category: 'drizzle',
    iconName: 'CloudSnow',
    bgGradient: 'from-cyan-500 to-blue-700',
  },
  61: {
    code: 61,
    description: 'Slight rain',
    category: 'rain',
    iconName: 'CloudRain',
    bgGradient: 'from-sky-500 to-blue-600',
  },
  63: {
    code: 63,
    description: 'Moderate rain',
    category: 'rain',
    iconName: 'CloudRain',
    bgGradient: 'from-blue-500 to-blue-700',
  },
  65: {
    code: 65,
    description: 'Heavy rain',
    category: 'rain',
    iconName: 'CloudRainWind',
    bgGradient: 'from-blue-600 to-slate-800',
  },
  66: {
    code: 66,
    description: 'Light freezing rain',
    category: 'rain',
    iconName: 'CloudSnow',
    bgGradient: 'from-cyan-500 to-blue-800',
  },
  67: {
    code: 67,
    description: 'Heavy freezing rain',
    category: 'rain',
    iconName: 'CloudSnow',
    bgGradient: 'from-cyan-600 to-indigo-900',
  },
  71: {
    code: 71,
    description: 'Slight snowfall',
    category: 'snow',
    iconName: 'CloudSnow',
    bgGradient: 'from-slate-200 to-sky-300',
  },
  73: {
    code: 73,
    description: 'Moderate snowfall',
    category: 'snow',
    iconName: 'CloudSnow',
    bgGradient: 'from-sky-200 to-blue-400',
  },
  75: {
    code: 75,
    description: 'Heavy snowfall',
    category: 'snow',
    iconName: 'Snowflake',
    bgGradient: 'from-blue-200 to-slate-500',
  },
  77: {
    code: 77,
    description: 'Snow grains',
    category: 'snow',
    iconName: 'Snowflake',
    bgGradient: 'from-blue-100 to-slate-400',
  },
  80: {
    code: 80,
    description: 'Slight rain showers',
    category: 'rain',
    iconName: 'CloudSunRain',
    bgGradient: 'from-sky-400 to-blue-600',
  },
  81: {
    code: 81,
    description: 'Moderate rain showers',
    category: 'rain',
    iconName: 'CloudRain',
    bgGradient: 'from-blue-400 to-blue-700',
  },
  82: {
    code: 82,
    description: 'Violent rain showers',
    category: 'rain',
    iconName: 'CloudRainWind',
    bgGradient: 'from-blue-700 to-slate-900',
  },
  85: {
    code: 85,
    description: 'Slight snow showers',
    category: 'snow',
    iconName: 'CloudSnow',
    bgGradient: 'from-slate-300 to-blue-400',
  },
  86: {
    code: 86,
    description: 'Heavy snow showers',
    category: 'snow',
    iconName: 'Snowflake',
    bgGradient: 'from-blue-300 to-slate-600',
  },
  95: {
    code: 95,
    description: 'Thunderstorm',
    category: 'storm',
    iconName: 'CloudLightning',
    bgGradient: 'from-amber-600 to-slate-800',
  },
  96: {
    code: 96,
    description: 'Thunderstorm with hail',
    category: 'storm',
    iconName: 'CloudLightning',
    bgGradient: 'from-amber-700 to-zinc-900',
  },
  99: {
    code: 99,
    description: 'Heavy thunderstorm with hail',
    category: 'storm',
    iconName: 'CloudLightning',
    bgGradient: 'from-red-600 to-slate-900',
  },
};

export function getWMOInfo(code: number): WMOInfo {
  return (
    WMO_CODES[code] || {
      code,
      description: 'Variable conditions',
      category: 'cloudy',
      iconName: 'Cloud',
      bgGradient: 'from-slate-400 to-zinc-500',
    }
  );
}
