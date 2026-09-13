import React from 'react';
import { Calendar, Droplets, CloudRain, Wind } from 'lucide-react';
import { DailyForecastDay } from '../types/weather';
import { WeatherIcon } from './WeatherIcon';

interface ForecastDailyProps {
  daily: DailyForecastDay[];
  unit: 'celsius' | 'fahrenheit';
}

export const ForecastDaily: React.FC<ForecastDailyProps> = ({ daily, unit }) => {
  const formatTemp = (celsiusVal: number) => {
    if (unit === 'fahrenheit') {
      return `${Math.round((celsiusVal * 9) / 5 + 32)}°`;
    }
    return `${Math.round(celsiusVal)}°`;
  };

  const weekMin = Math.min(...daily.map((d) => d.tempMin));
  const weekMax = Math.max(...daily.map((d) => d.tempMax));
  const tempRange = Math.max(1, weekMax - weekMin);

  return (
    <div
      id="seven-day-forecast"
      className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-xs"
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 mb-5">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-sky-50 text-sky-700 flex items-center justify-center border border-sky-200/60">
            <Calendar className="w-4 h-4 text-sky-600" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 tracking-tight">
            7-Day Meteorological Forecast
          </h3>
        </div>
        <p className="text-xs text-slate-400">
          Official Open-Meteo High-Resolution Model
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-3">
        {daily.map((day, idx) => {
          const isToday = idx === 0;

          const leftPercent = Math.max(
            0,
            Math.min(100, ((day.tempMin - weekMin) / tempRange) * 100)
          );
          const rightPercent = Math.max(
            0,
            Math.min(100, ((weekMax - day.tempMax) / tempRange) * 100)
          );

          return (
            <div
              key={day.date}
              className={`rounded-xl p-3.5 flex flex-col justify-between border transition-all ${
                isToday
                  ? 'bg-sky-50/50 border-sky-200 shadow-2xs'
                  : 'bg-slate-50/50 border-slate-100 hover:border-slate-200 hover:bg-slate-50'
              }`}
            >
              {/* Date & Day Header */}
              <div className="flex sm:flex-col justify-between items-start">
                <div>
                  <span
                    className={`text-xs font-bold block ${
                      isToday ? 'text-sky-700' : 'text-slate-800'
                    }`}
                  >
                    {day.dayName}
                  </span>
                  <span className="text-2xs text-slate-400 font-medium">
                    {day.shortDate}
                  </span>
                </div>

                {isToday && (
                  <span className="sm:mt-1 text-2xs font-semibold px-1.5 py-0.2 rounded bg-sky-600 text-white">
                    Today
                  </span>
                )}
              </div>

              {/* Weather Icon & Condition */}
              <div className="my-3 flex items-center gap-2.5 sm:flex-col sm:text-center">
                <WeatherIcon
                  code={day.weatherCode}
                  className="w-8 h-8 sm:w-9 sm:h-9"
                />
                <span className="text-xs font-medium text-slate-700 leading-snug line-clamp-1 sm:line-clamp-2">
                  {day.weatherDescription}
                </span>
              </div>

              {/* High & Low Temp */}
              <div className="flex items-center justify-between text-xs font-bold text-slate-900 mb-1.5">
                <span className="text-rose-600">{formatTemp(day.tempMax)}</span>
                <span className="text-slate-400 font-normal">/</span>
                <span className="text-sky-700">{formatTemp(day.tempMin)}</span>
              </div>

              {/* Visual Temperature Bar */}
              <div className="w-full h-1.5 bg-slate-200/80 rounded-full relative overflow-hidden mb-2.5">
                <div
                  className="absolute top-0 bottom-0 bg-gradient-to-r from-sky-400 to-rose-400 rounded-full"
                  style={{
                    left: `${leftPercent}%`,
                    right: `${rightPercent}%`,
                  }}
                />
              </div>

              {/* Precipitation Info */}
              <div className="pt-2 border-t border-slate-200/60 flex flex-col gap-1 text-2xs text-slate-500">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1">
                    <Droplets className="w-3 h-3 text-sky-500" />
                    <span>Rain prob.</span>
                  </span>
                  <span
                    className={`font-semibold ${
                      day.precipitationProbability > 40
                        ? 'text-sky-600'
                        : 'text-slate-600'
                    }`}
                  >
                    {day.precipitationProbability}%
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1">
                    <CloudRain className="w-3 h-3 text-blue-500" />
                    <span>Amount</span>
                  </span>
                  <span className="font-medium text-slate-700">
                    {day.precipitationSum} mm
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1">
                    <Wind className="w-3 h-3 text-slate-400" />
                    <span>Wind max</span>
                  </span>
                  <span className="font-medium text-slate-600">
                    {day.windSpeedMax} km/h
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
