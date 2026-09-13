import {
  CityLocation,
  CurrentWeatherData,
  DailyForecastDay,
  HourlyForecastItem,
  OpenMeteoForecastResponse,
  OpenMeteoGeocodingResponse,
} from '../types/weather';
import { getWMOInfo } from '../utils/wmo';

export const DEFAULT_LOCATION: CityLocation = {
  id: 6173331,
  name: 'Vancouver',
  country: 'Canada',
  country_code: 'CA',
  admin1: 'British Columbia',
  latitude: 49.2827,
  longitude: -123.1207,
  timezone: 'America/Vancouver',
};

export async function searchCities(query: string): Promise<CityLocation[]> {
  const trimmed = query.trim();
  if (!trimmed || trimmed.length < 2) {
    return [];
  }

  const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
    trimmed
  )}&count=10&language=en&format=json`;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    const response = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`Geocoding request failed with status: ${response.status}`);
    }

    const data: OpenMeteoGeocodingResponse = await response.json();

    if (!data.results || data.results.length === 0) {
      return [];
    }

    return data.results.map((item) => ({
      id: item.id,
      name: item.name,
      latitude: item.latitude,
      longitude: item.longitude,
      country: item.country || '',
      country_code: item.country_code || '',
      admin1: item.admin1,
      admin2: item.admin2,
      timezone: item.timezone || 'UTC',
    }));
  } catch (error: any) {
    if (error.name === 'AbortError') {
      throw new Error('City search timed out. Please check your internet connection.');
    }
    throw new Error('Unable to retrieve cities right now. Please try again.');
  }
}

export async function fetchWeatherForecast(
  latitude: number,
  longitude: number,
  timezone = 'auto'
): Promise<{
  current: CurrentWeatherData;
  daily: DailyForecastDay[];
  hourly: HourlyForecastItem[];
}> {
  const params = new URLSearchParams({
    latitude: latitude.toString(),
    longitude: longitude.toString(),
    current: [
      'temperature_2m',
      'relative_humidity_2m',
      'apparent_temperature',
      'is_day',
      'precipitation',
      'rain',
      'showers',
      'snowfall',
      'weather_code',
      'cloud_cover',
      'pressure_msl',
      'surface_pressure',
      'wind_speed_10m',
      'wind_direction_10m',
      'wind_gusts_10m',
    ].join(','),
    hourly: [
      'temperature_2m',
      'relative_humidity_2m',
      'apparent_temperature',
      'precipitation_probability',
      'precipitation',
      'weather_code',
      'wind_speed_10m',
      'uv_index',
    ].join(','),
    daily: [
      'weather_code',
      'temperature_2m_max',
      'temperature_2m_min',
      'apparent_temperature_max',
      'apparent_temperature_min',
      'sunrise',
      'sunset',
      'uv_index_max',
      'precipitation_sum',
      'rain_sum',
      'showers_sum',
      'snowfall_sum',
      'precipitation_hours',
      'precipitation_probability_max',
      'wind_speed_10m_max',
      'wind_gusts_10m_max',
      'wind_direction_10m_dominant',
    ].join(','),
    timezone,
  });

  const url = `https://api.open-meteo.com/v1/forecast?${params.toString()}`;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (!res.ok) {
      throw new Error(`Weather service returned HTTP status: ${res.status}`);
    }

    const data: OpenMeteoForecastResponse = await res.json();

    if (!data.current || !data.daily || !data.daily.time) {
      throw new Error('Incomplete weather data received from Open-Meteo.');
    }

    // Parse current weather
    const currentCode = data.current.weather_code ?? 0;
    const wmo = getWMOInfo(currentCode);
    const todayUv = data.daily.uv_index_max?.[0] ?? 0;

    const current: CurrentWeatherData = {
      temperature: Math.round((data.current.temperature_2m ?? 0) * 10) / 10,
      apparentTemperature: Math.round((data.current.apparent_temperature ?? data.current.temperature_2m ?? 0) * 10) / 10,
      humidity: data.current.relative_humidity_2m ?? 0,
      weatherCode: currentCode,
      weatherDescription: wmo.description,
      isDay: Boolean(data.current.is_day ?? 1),
      precipitation: data.current.precipitation ?? 0,
      windSpeed: Math.round(data.current.wind_speed_10m ?? 0),
      windDirection: data.current.wind_direction_10m ?? 0,
      windGusts: Math.round(data.current.wind_gusts_10m ?? 0),
      pressure: Math.round(data.current.pressure_msl ?? data.current.surface_pressure ?? 1013),
      cloudCover: data.current.cloud_cover ?? 0,
      uvIndex: todayUv,
      updatedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    // Parse 7-day daily forecast
    const daily: DailyForecastDay[] = data.daily.time.slice(0, 7).map((dateStr, idx) => {
      const code = data.daily!.weather_code[idx] ?? 0;
      const dayWmo = getWMOInfo(code);
      const dateObj = new Date(dateStr + 'T12:00:00');

      const isToday = idx === 0;
      const dayName = isToday
        ? 'Today'
        : dateObj.toLocaleDateString('en-US', { weekday: 'short' });

      const shortDate = dateObj.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      });

      return {
        date: dateStr,
        dayName,
        shortDate,
        weatherCode: code,
        weatherDescription: dayWmo.description,
        tempMax: Math.round(data.daily!.temperature_2m_max[idx] ?? 0),
        tempMin: Math.round(data.daily!.temperature_2m_min[idx] ?? 0),
        precipitationSum:
          Math.round((data.daily!.precipitation_sum[idx] ?? 0) * 10) / 10,
        precipitationProbability:
          data.daily!.precipitation_probability_max?.[idx] ?? 0,
        windSpeedMax: Math.round(data.daily!.wind_speed_10m_max?.[idx] ?? 0),
        uvIndexMax: Math.round((data.daily!.uv_index_max?.[idx] ?? 0) * 10) / 10,
        sunrise: data.daily!.sunrise?.[idx]
          ? formatTimeFromISO(data.daily!.sunrise[idx])
          : undefined,
        sunset: data.daily!.sunset?.[idx]
          ? formatTimeFromISO(data.daily!.sunset[idx])
          : undefined,
      };
    });

    // Parse hourly forecast for next 24 hours
    const hourly: HourlyForecastItem[] = [];
    if (data.hourly && data.hourly.time) {
      const nowTime = new Date().toISOString();
      let startIndex = data.hourly.time.findIndex((t) => t >= nowTime.slice(0, 13));
      if (startIndex < 0) startIndex = 0;

      const sliceCount = Math.min(24, data.hourly.time.length - startIndex);
      for (let i = 0; i < sliceCount; i++) {
        const idx = startIndex + i;
        const timeStr = data.hourly.time[idx];
        const dateObj = new Date(timeStr);
        const hour = dateObj.toLocaleTimeString('en-US', {
          hour: 'numeric',
          hour12: true,
        });

        hourly.push({
          time: timeStr,
          hour,
          temperature: Math.round(data.hourly.temperature_2m[idx] ?? 0),
          apparentTemperature: Math.round(data.hourly.apparent_temperature[idx] ?? 0),
          precipitationProbability: data.hourly.precipitation_probability[idx] ?? 0,
          precipitation: Math.round((data.hourly.precipitation[idx] ?? 0) * 10) / 10,
          weatherCode: data.hourly.weather_code[idx] ?? 0,
          windSpeed: Math.round(data.hourly.wind_speed_10m[idx] ?? 0),
          uvIndex: Math.round(data.hourly.uv_index?.[idx] ?? 0),
        });
      }
    }

    return { current, daily, hourly };
  } catch (error: any) {
    if (error.name === 'AbortError') {
      throw new Error('Weather forecast request timed out. Please retry.');
    }
    throw new Error(
      error.message || 'Unable to retrieve weather forecast data from Open-Meteo.'
    );
  }
}

function formatTimeFromISO(isoStr: string): string {
  try {
    const parts = isoStr.split('T');
    if (parts.length > 1) {
      return parts[1].slice(0, 5);
    }
    return isoStr;
  } catch {
    return isoStr;
  }
}
