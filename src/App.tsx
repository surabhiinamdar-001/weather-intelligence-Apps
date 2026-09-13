import { useState, useEffect, useCallback } from 'react';
import { CityLocation, CurrentWeatherData, DailyForecastDay, HourlyForecastItem, WeatherIntelligenceSummary } from './types/weather';
import { DEFAULT_LOCATION, fetchWeatherForecast } from './services/openMeteo';
import { generateWeatherIntelligence } from './utils/weatherIntelligence';
import { Header } from './components/Header';
import { CurrentWeatherCard } from './components/CurrentWeatherCard';
import { WeatherIntelligenceCard } from './components/WeatherIntelligenceCard';
import { ForecastDaily } from './components/ForecastDaily';
import { WeatherCharts } from './components/WeatherCharts';
import { ActivityMatrix } from './components/ActivityMatrix';
import { ErrorMessage } from './components/ErrorMessage';
import { LoadingSkeleton } from './components/LoadingSkeleton';

export default function App() {
  const [currentCity, setCurrentCity] = useState<CityLocation>(DEFAULT_LOCATION);
  const [currentWeather, setCurrentWeather] = useState<CurrentWeatherData | null>(null);
  const [dailyForecast, setDailyForecast] = useState<DailyForecastDay[]>([]);
  const [hourlyForecast, setHourlyForecast] = useState<HourlyForecastItem[]>([]);
  const [intelligence, setIntelligence] = useState<WeatherIntelligenceSummary | null>(null);

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [unit, setUnit] = useState<'celsius' | 'fahrenheit'>('celsius');

  const loadWeatherData = useCallback(async (city: CityLocation, isBackgroundRefresh = false) => {
    if (isBackgroundRefresh) {
      setIsRefreshing(true);
    } else {
      setIsLoading(true);
    }
    setError(null);

    try {
      const data = await fetchWeatherForecast(city.latitude, city.longitude, city.timezone);
      setCurrentWeather(data.current);
      setDailyForecast(data.daily);
      setHourlyForecast(data.hourly);

      // Deterministic rules engine (zero GenAI)
      const intel = generateWeatherIntelligence(data.current, data.daily);
      setIntelligence(intel);
    } catch (err: any) {
      setError(
        err.message ||
          'Failed to load weather data from Open-Meteo. Please verify internet connection.'
      );
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  // Initial load: defaults to Vancouver, Canada
  useEffect(() => {
    loadWeatherData(currentCity);
  }, [currentCity, loadWeatherData]);

  const handleSelectCity = (city: CityLocation) => {
    setCurrentCity(city);
  };

  const handleRefresh = () => {
    loadWeatherData(currentCity, true);
  };

  const handleToggleUnit = () => {
    setUnit((prev) => (prev === 'celsius' ? 'fahrenheit' : 'celsius'));
  };

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-800 flex flex-col antialiased">
      {/* City Search and Controls Header */}
      <Header
        currentCity={currentCity}
        onSelectCity={handleSelectCity}
        onRefresh={handleRefresh}
        isRefreshing={isRefreshing}
        unit={unit}
        onToggleUnit={handleToggleUnit}
      />

      {/* Main Dashboard Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {error && (
          <ErrorMessage
            message={error}
            onRetry={() => loadWeatherData(currentCity)}
            isRetrying={isLoading}
          />
        )}

        {isLoading && !currentWeather ? (
          <LoadingSkeleton />
        ) : (
          currentWeather &&
          dailyForecast.length > 0 &&
          intelligence && (
            <>
              {/* Top Section: Live Weather Observation & Intelligence Card */}
              <section className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
                <div className="lg:col-span-7 flex flex-col">
                  <CurrentWeatherCard
                    city={currentCity}
                    current={currentWeather}
                    todayForecast={dailyForecast[0]}
                    unit={unit}
                  />
                </div>
                <div className="lg:col-span-5 flex flex-col">
                  <WeatherIntelligenceCard intelligence={intelligence} />
                </div>
              </section>

              {/* 7-Day High-Resolution Forecast Grid */}
              <section>
                <ForecastDaily daily={dailyForecast} unit={unit} />
              </section>

              {/* Weather Charts Section (Temperature, Precipitation, Hourly) */}
              <section>
                <WeatherCharts
                  daily={dailyForecast}
                  hourly={hourlyForecast}
                  unit={unit}
                />
              </section>

              {/* Activity Suitability Matrix */}
              <section>
                <ActivityMatrix activities={intelligence.activities} />
              </section>
            </>
          )
        )}
      </main>

      {/* Minimal Footer with Attribution */}
      <footer className="border-t border-slate-200 bg-white py-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>
            Weather Intelligence • Pure Client-Side Single Page Application
          </span>
          <span className="text-slate-400">
            Powered by public{' '}
            <a
              href="https://open-meteo.com"
              target="_blank"
              rel="noreferrer"
              className="text-sky-600 hover:underline"
            >
              Open-Meteo APIs
            </a>{' '}
            • Free for non-commercial and open data usage
          </span>
        </div>
      </footer>
    </div>
  );
}
