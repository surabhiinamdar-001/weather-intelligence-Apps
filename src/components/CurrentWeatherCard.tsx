import React from 'react';
import {
  Wind,
  Droplets,
  Gauge,
  SunMedium,
  CloudRain,
  Compass,
  ArrowUp,
  ArrowDown,
  Clock,
  CheckCircle2,
} from 'lucide-react';
import { CityLocation, CurrentWeatherData, DailyForecastDay } from '../types/weather';
import { WeatherIcon } from './WeatherIcon';

interface CurrentWeatherCardProps {
  city: CityLocation;
  current: CurrentWeatherData;
  todayForecast?: DailyForecastDay;
  unit: 'celsius' | 'fahrenheit';
}

export const CurrentWeatherCard: React.FC<CurrentWeatherCardProps> = ({
  city,
  current,
  todayForecast,
  unit,
}) => {
  const formatTemp = (celsiusVal: number) => {
    if (unit === 'fahrenheit') {
      return `${Math.round((celsiusVal * 9) / 5 + 32)}°F`;
    }
    return `${Math.round(celsiusVal)}°C`;
  };

  const formatWind = (kmh: number) => {
    if (unit === 'fahrenheit') {
      return `${Math.round(kmh * 0.621371)} mph`;
    }
    return `${kmh} km/h`;
  };

  const highTemp = todayForecast?.tempMax ?? current.temperature;
  const lowTemp = todayForecast?.tempMin ?? current.temperature;

  return (
    <div
      id="current-weather-card"
      className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-xs relative overflow-hidden"
    >
      {/* Background Accent Subtle Glow */}
      <div className="absolute -top-24 -right-24 w-60 h-60 bg-sky-100/50 rounded-full blur-3xl pointer-events-none" />

      {/* Header Info */}
      <div className="flex items-start justify-between relative z-10">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 text-2xs font-semibold px-2 py-0.5 rounded-md bg-sky-50 text-sky-700 border border-sky-200/60 uppercase tracking-wider">
              <CheckCircle2 className="w-3 h-3 text-sky-600" />
              Live Observation
            </span>
            <span className="text-2xs text-slate-400 font-mono">
              Lat: {city.latitude.toFixed(2)}°, Lon: {city.longitude.toFixed(2)}°
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-2 tracking-tight">
            {city.name}
          </h2>
          <p className="text-sm font-medium text-slate-500">
            {city.admin1 ? `${city.admin1}, ` : ''}
            {city.country}
          </p>
        </div>

        {/* Updated Timestamp */}
        <div className="flex items-center gap-1.5 text-xs text-slate-400 bg-slate-50 border border-slate-200/60 px-2.5 py-1 rounded-lg shrink-0">
          <Clock className="w-3.5 h-3.5 text-slate-400" />
          <span>Updated {current.updatedAt}</span>
        </div>
      </div>

      {/* Main Temperature & Weather Icon Display */}
      <div className="mt-5 sm:mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-slate-100 relative z-10">
        <div className="flex items-baseline gap-3">
          <span className="text-5xl sm:text-6xl font-extrabold text-slate-900 tracking-tight">
            {formatTemp(current.temperature)}
          </span>
          <div className="flex flex-col text-xs text-slate-500">
            <span className="font-medium text-slate-700 text-sm">
              Feels like {formatTemp(current.apparentTemperature)}
            </span>
            <div className="flex items-center gap-2 mt-0.5 font-medium">
              <span className="text-rose-600 inline-flex items-center">
                <ArrowUp className="w-3 h-3 inline" /> {formatTemp(highTemp)}
              </span>
              <span className="text-slate-300">•</span>
              <span className="text-sky-600 inline-flex items-center">
                <ArrowDown className="w-3 h-3 inline" /> {formatTemp(lowTemp)}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3.5 sm:self-center">
          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 shadow-2xs">
            <WeatherIcon
              code={current.weatherCode}
              isDay={current.isDay}
              className="w-10 h-10 sm:w-12 sm:h-12"
            />
          </div>
          <div>
            <p className="text-base sm:text-lg font-semibold text-slate-800 leading-tight">
              {current.weatherDescription}
            </p>
            <p className="text-xs text-slate-400 mt-0.5">
              {current.isDay ? 'Daytime conditions' : 'Nighttime conditions'} • {current.cloudCover}% cloud cover
            </p>
          </div>
        </div>
      </div>

      {/* Atmospheric Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-5 relative z-10">
        {/* Wind */}
        <div className="p-3 rounded-xl bg-slate-50/80 border border-slate-100 hover:border-slate-200 transition-colors">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1">
            <Wind className="w-3.5 h-3.5 text-sky-600" />
            <span className="font-medium">Wind</span>
          </div>
          <div className="text-base font-bold text-slate-800">
            {formatWind(current.windSpeed)}
          </div>
          <div className="text-2xs text-slate-400 mt-0.5 flex items-center gap-1">
            <Compass className="w-3 h-3 text-slate-400" />
            <span>Gusts {formatWind(current.windGusts)}</span>
          </div>
        </div>

        {/* Humidity */}
        <div className="p-3 rounded-xl bg-slate-50/80 border border-slate-100 hover:border-slate-200 transition-colors">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1">
            <Droplets className="w-3.5 h-3.5 text-sky-600" />
            <span className="font-medium">Humidity</span>
          </div>
          <div className="text-base font-bold text-slate-800">
            {current.humidity}%
          </div>
          <div className="text-2xs text-slate-400 mt-0.5">
            {current.humidity > 70 ? 'High moisture' : current.humidity < 35 ? 'Dry air' : 'Comfortable'}
          </div>
        </div>

        {/* Precipitation */}
        <div className="p-3 rounded-xl bg-slate-50/80 border border-slate-100 hover:border-slate-200 transition-colors">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1">
            <CloudRain className="w-3.5 h-3.5 text-blue-600" />
            <span className="font-medium">Precipitation</span>
          </div>
          <div className="text-base font-bold text-slate-800">
            {current.precipitation} mm
          </div>
          <div className="text-2xs text-slate-400 mt-0.5">
            {todayForecast?.precipitationProbability ?? 0}% rain chance
          </div>
        </div>

        {/* UV & Pressure */}
        <div className="p-3 rounded-xl bg-slate-50/80 border border-slate-100 hover:border-slate-200 transition-colors">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1">
            <SunMedium className="w-3.5 h-3.5 text-amber-500" />
            <span className="font-medium">UV Index</span>
          </div>
          <div className="text-base font-bold text-slate-800 flex items-center gap-1.5">
            <span>{current.uvIndex}</span>
            <span className="text-2xs font-normal text-slate-500">
              ({current.uvIndex >= 6 ? 'High' : current.uvIndex >= 3 ? 'Moderate' : 'Low'})
            </span>
          </div>
          <div className="text-2xs text-slate-400 mt-0.5 flex items-center gap-1">
            <Gauge className="w-3 h-3 text-slate-400" />
            <span>{current.pressure} hPa</span>
          </div>
        </div>
      </div>
    </div>
  );
};
