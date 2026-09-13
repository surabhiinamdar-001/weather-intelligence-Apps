import React, { useState } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ComposedChart,
} from 'recharts';
import { TrendingUp, CloudRain, Clock, BarChart3 } from 'lucide-react';
import { DailyForecastDay, HourlyForecastItem } from '../types/weather';

interface WeatherChartsProps {
  daily: DailyForecastDay[];
  hourly: HourlyForecastItem[];
  unit: 'celsius' | 'fahrenheit';
}

export const WeatherCharts: React.FC<WeatherChartsProps> = ({
  daily,
  hourly,
  unit,
}) => {
  const [activeTab, setActiveTab] = useState<'temp' | 'precip' | 'hourly'>('temp');

  const convertTemp = (celsius: number) => {
    if (unit === 'fahrenheit') {
      return Math.round((celsius * 9) / 5 + 32);
    }
    return Math.round(celsius);
  };

  const tempSymbol = unit === 'fahrenheit' ? '°F' : '°C';

  // Format daily data for recharts
  const dailyChartData = daily.map((d) => ({
    name: d.dayName,
    date: d.shortDate,
    maxTemp: convertTemp(d.tempMax),
    minTemp: convertTemp(d.tempMin),
    precipProb: d.precipitationProbability,
    precipSum: d.precipitationSum,
    wind: d.windSpeedMax,
  }));

  // Format hourly data for recharts (first 24 hours)
  const hourlyChartData = hourly.slice(0, 24).map((h) => ({
    time: h.hour,
    temp: convertTemp(h.temperature),
    feelsLike: convertTemp(h.apparentTemperature),
    precipProb: h.precipitationProbability,
    precipAmount: h.precipitation,
  }));

  return (
    <div
      id="weather-charts-section"
      className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-xs"
    >
      {/* Header & View Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-sky-50 text-sky-700 flex items-center justify-center border border-sky-200/60">
            <BarChart3 className="w-4 h-4 text-sky-600" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 tracking-tight">
              Meteorological Trends & Analytics
            </h3>
            <p className="text-2xs text-slate-400 font-medium">
              Real-Time Hydro-Thermal Analysis
            </p>
          </div>
        </div>

        {/* Chart View Selector */}
        <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-semibold text-slate-600 self-start sm:self-auto border border-slate-200/50">
          <button
            id="tab-temp-trend"
            onClick={() => setActiveTab('temp')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
              activeTab === 'temp'
                ? 'bg-white text-sky-700 shadow-2xs'
                : 'hover:text-slate-900'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>7-Day Temperature</span>
          </button>
          <button
            id="tab-precip-trend"
            onClick={() => setActiveTab('precip')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
              activeTab === 'precip'
                ? 'bg-white text-blue-700 shadow-2xs'
                : 'hover:text-slate-900'
            }`}
          >
            <CloudRain className="w-3.5 h-3.5" />
            <span>Precipitation & Rain</span>
          </button>
          <button
            id="tab-hourly-trend"
            onClick={() => setActiveTab('hourly')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
              activeTab === 'hourly'
                ? 'bg-white text-indigo-700 shadow-2xs'
                : 'hover:text-slate-900'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>24h Hourly</span>
          </button>
        </div>
      </div>

      {/* Chart Canvas Area */}
      <div className="w-full h-72 sm:h-80">
        {activeTab === 'temp' && (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={dailyChartData}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorMax" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#f43f5e" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="colorMin" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0284c7" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#0284c7" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#64748b', fontSize: 12, fontWeight: 500 }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#94a3b8', fontSize: 11 }}
                unit={tempSymbol}
              />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-lg text-xs">
                        <p className="font-bold text-slate-900 mb-1.5">
                          {label} ({payload[0]?.payload.date})
                        </p>
                        <div className="space-y-1">
                          <p className="text-rose-600 font-semibold flex justify-between gap-4">
                            <span>High:</span>
                            <span>
                              {payload[0]?.value}
                              {tempSymbol}
                            </span>
                          </p>
                          <p className="text-sky-600 font-semibold flex justify-between gap-4">
                            <span>Low:</span>
                            <span>
                              {payload[1]?.value}
                              {tempSymbol}
                            </span>
                          </p>
                          <p className="text-slate-500 flex justify-between gap-4 pt-1 border-t border-slate-100">
                            <span>Rain Chance:</span>
                            <span>{payload[0]?.payload.precipProb}%</span>
                          </p>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Legend
                verticalAlign="top"
                align="right"
                iconType="circle"
                wrapperStyle={{ paddingBottom: '12px', fontSize: '12px' }}
              />
              <Area
                type="monotone"
                dataKey="maxTemp"
                name={`High Temp (${tempSymbol})`}
                stroke="#f43f5e"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#colorMax)"
                activeDot={{ r: 5 }}
              />
              <Area
                type="monotone"
                dataKey="minTemp"
                name={`Low Temp (${tempSymbol})`}
                stroke="#0284c7"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#colorMin)"
                activeDot={{ r: 5 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}

        {activeTab === 'precip' && (
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={dailyChartData}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#64748b', fontSize: 12, fontWeight: 500 }}
              />
              <YAxis
                yAxisId="left"
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#0284c7', fontSize: 11 }}
                domain={[0, 100]}
                unit="%"
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#6366f1', fontSize: 11 }}
                unit="mm"
              />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-lg text-xs">
                        <p className="font-bold text-slate-900 mb-1.5">{label}</p>
                        <div className="space-y-1">
                          <p className="text-sky-600 font-semibold flex justify-between gap-4">
                            <span>Precipitation Probability:</span>
                            <span>{payload[0]?.value}%</span>
                          </p>
                          <p className="text-indigo-600 font-semibold flex justify-between gap-4">
                            <span>Rain Accumulation:</span>
                            <span>{payload[1]?.value} mm</span>
                          </p>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Legend
                verticalAlign="top"
                align="right"
                iconType="circle"
                wrapperStyle={{ paddingBottom: '12px', fontSize: '12px' }}
              />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="precipProb"
                name="Precipitation Probability (%)"
                stroke="#0284c7"
                strokeWidth={2.5}
                dot={{ r: 4, fill: '#0284c7' }}
                activeDot={{ r: 6 }}
              />
              <Bar
                yAxisId="right"
                dataKey="precipSum"
                name="Precipitation Sum (mm)"
                fill="#6366f1"
                radius={[4, 4, 0, 0]}
                barSize={20}
              />
            </ComposedChart>
          </ResponsiveContainer>
        )}

        {activeTab === 'hourly' && (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={hourlyChartData}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorHourly" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis
                dataKey="time"
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#64748b', fontSize: 11 }}
                interval={2}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#94a3b8', fontSize: 11 }}
                unit={tempSymbol}
              />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-lg text-xs">
                        <p className="font-bold text-slate-900 mb-1.5">{label}</p>
                        <div className="space-y-1">
                          <p className="text-sky-600 font-semibold flex justify-between gap-4">
                            <span>Temperature:</span>
                            <span>
                              {payload[0]?.value}
                              {tempSymbol}
                            </span>
                          </p>
                          <p className="text-slate-600 flex justify-between gap-4">
                            <span>Feels Like:</span>
                            <span>
                              {payload[0]?.payload.feelsLike}
                              {tempSymbol}
                            </span>
                          </p>
                          <p className="text-blue-600 flex justify-between gap-4 pt-1 border-t border-slate-100">
                            <span>Rain Chance:</span>
                            <span>{payload[0]?.payload.precipProb}%</span>
                          </p>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Legend
                verticalAlign="top"
                align="right"
                iconType="circle"
                wrapperStyle={{ paddingBottom: '12px', fontSize: '12px' }}
              />
              <Area
                type="monotone"
                dataKey="temp"
                name={`Hourly Temp (${tempSymbol})`}
                stroke="#0ea5e9"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorHourly)"
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};
