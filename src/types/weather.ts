export interface CityLocation {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  country: string;
  country_code: string;
  admin1?: string;
  admin2?: string;
  timezone: string;
}

export interface OpenMeteoGeocodingResponse {
  results?: Array<{
    id: number;
    name: string;
    latitude: number;
    longitude: number;
    elevation?: number;
    feature_code?: string;
    country_code: string;
    country: string;
    admin1?: string;
    admin2?: string;
    timezone?: string;
    population?: number;
  }>;
  generationtime_ms?: number;
}

export interface OpenMeteoForecastResponse {
  latitude: number;
  longitude: number;
  generationtime_ms: number;
  utc_offset_seconds: number;
  timezone: string;
  timezone_abbreviation: string;
  elevation: number;
  current?: {
    time: string;
    interval: number;
    temperature_2m: number;
    relative_humidity_2m: number;
    apparent_temperature: number;
    is_day: number;
    precipitation: number;
    rain: number;
    showers: number;
    snowfall: number;
    weather_code: number;
    cloud_cover: number;
    pressure_msl: number;
    surface_pressure: number;
    wind_speed_10m: number;
    wind_direction_10m: number;
    wind_gusts_10m: number;
  };
  hourly?: {
    time: string[];
    temperature_2m: number[];
    relative_humidity_2m: number[];
    apparent_temperature: number[];
    precipitation_probability: number[];
    precipitation: number[];
    weather_code: number[];
    wind_speed_10m: number[];
    uv_index?: number[];
  };
  daily?: {
    time: string[];
    weather_code: number[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    apparent_temperature_max?: number[];
    apparent_temperature_min?: number[];
    sunrise?: string[];
    sunset?: string[];
    uv_index_max?: number[];
    precipitation_sum: number[];
    rain_sum?: number[];
    showers_sum?: number[];
    snowfall_sum?: number[];
    precipitation_hours?: number[];
    precipitation_probability_max?: number[];
    wind_speed_10m_max?: number[];
    wind_gusts_10m_max?: number[];
    wind_direction_10m_dominant?: number[];
  };
}

export interface CurrentWeatherData {
  temperature: number;
  apparentTemperature: number;
  humidity: number;
  weatherCode: number;
  weatherDescription: string;
  isDay: boolean;
  precipitation: number;
  windSpeed: number;
  windDirection: number;
  windGusts: number;
  pressure: number;
  cloudCover: number;
  uvIndex: number;
  updatedAt: string;
}

export interface DailyForecastDay {
  date: string;
  dayName: string;
  shortDate: string;
  weatherCode: number;
  weatherDescription: string;
  tempMax: number;
  tempMin: number;
  precipitationSum: number;
  precipitationProbability: number;
  windSpeedMax: number;
  uvIndexMax: number;
  sunrise?: string;
  sunset?: string;
}

export interface HourlyForecastItem {
  time: string;
  hour: string;
  temperature: number;
  apparentTemperature: number;
  precipitationProbability: number;
  precipitation: number;
  weatherCode: number;
  windSpeed: number;
  uvIndex: number;
}

export interface WeatherRecommendation {
  id: string;
  category: 'precipitation' | 'temperature' | 'wind' | 'uv' | 'general';
  level: 'info' | 'caution' | 'warning' | 'optimal';
  title: string;
  advice: string;
  clothingTips?: string[];
}

export interface ActivityScore {
  name: string;
  category: 'Running' | 'Cycling' | 'Outdoor Dining' | 'Hiking' | 'Commuting';
  score: number;
  status: 'Ideal' | 'Good' | 'Fair' | 'Challenging' | 'Not Recommended';
  reason: string;
}

export interface WeatherIntelligenceSummary {
  headline: string;
  recommendations: WeatherRecommendation[];
  activities: ActivityScore[];
  clothingGuide: {
    upper: string;
    lower: string;
    footwear: string;
    accessories: string[];
  };
  keyPrecautions: string[];
}
