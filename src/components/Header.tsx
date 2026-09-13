import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  MapPin,
  Loader2,
  RefreshCw,
  X,
  Compass,
  Check,
} from 'lucide-react';
import { CityLocation } from '../types/weather';
import { searchCities } from '../services/openMeteo';

interface HeaderProps {
  currentCity: CityLocation;
  onSelectCity: (city: CityLocation) => void;
  onRefresh: () => void;
  isRefreshing: boolean;
  unit: 'celsius' | 'fahrenheit';
  onToggleUnit: () => void;
}

const POPULAR_CITIES: CityLocation[] = [
  {
    id: 6173331,
    name: 'Vancouver',
    country: 'Canada',
    country_code: 'CA',
    admin1: 'British Columbia',
    latitude: 49.2827,
    longitude: -123.1207,
    timezone: 'America/Vancouver',
  },
  {
    id: 5128581,
    name: 'New York',
    country: 'United States',
    country_code: 'US',
    admin1: 'New York',
    latitude: 40.7128,
    longitude: -74.006,
    timezone: 'America/New_York',
  },
  {
    id: 2643743,
    name: 'London',
    country: 'United Kingdom',
    country_code: 'GB',
    admin1: 'England',
    latitude: 51.5085,
    longitude: -0.1257,
    timezone: 'Europe/London',
  },
  {
    id: 1850147,
    name: 'Tokyo',
    country: 'Japan',
    country_code: 'JP',
    admin1: 'Tokyo',
    latitude: 35.6895,
    longitude: 139.6917,
    timezone: 'Asia/Tokyo',
  },
  {
    id: 2988507,
    name: 'Paris',
    country: 'France',
    country_code: 'FR',
    admin1: 'Île-de-France',
    latitude: 48.8534,
    longitude: 2.3488,
    timezone: 'Europe/Paris',
  },
  {
    id: 2147714,
    name: 'Sydney',
    country: 'Australia',
    country_code: 'AU',
    admin1: 'New South Wales',
    latitude: -33.8678,
    longitude: 151.2073,
    timezone: 'Australia/Sydney',
  },
];

export const Header: React.FC<HeaderProps> = ({
  currentCity,
  onSelectCity,
  onRefresh,
  isRefreshing,
  unit,
  onToggleUnit,
}) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<CityLocation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  // Debounced geocoding search
  useEffect(() => {
    if (!query.trim() || query.trim().length < 2) {
      setResults([]);
      setIsLoading(false);
      setHasSearched(false);
      setSearchError(null);
      return;
    }

    setIsLoading(true);
    setSearchError(null);

    const timer = setTimeout(async () => {
      try {
        const matches = await searchCities(query);
        setResults(matches);
        setHasSearched(true);
        setIsOpen(true);
      } catch (err: any) {
        setSearchError(err.message || 'Error looking up city');
        setResults([]);
        setHasSearched(true);
        setIsOpen(true);
      } finally {
        setIsLoading(false);
      }
    }, 350);

    return () => clearTimeout(timer);
  }, [query]);

  // Click outside listener
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (city: CityLocation) => {
    onSelectCity(city);
    setQuery('');
    setIsOpen(false);
  };

  const handleClear = () => {
    setQuery('');
    setResults([]);
    setHasSearched(false);
    setIsOpen(false);
  };

  return (
    <header className="border-b border-slate-200 bg-white/90 backdrop-blur-md sticky top-0 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3.5">
          {/* Brand & Active City Badge */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center text-white shadow-sm shadow-sky-500/20">
                <Compass className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <h1 className="text-xl font-bold tracking-tight text-slate-900 leading-tight">
                  Weather Intelligence
                </h1>
                <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                  <MapPin className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                  <span className="truncate">
                    {currentCity.name}
                    {currentCity.admin1 ? `, ${currentCity.admin1}` : ''} ({currentCity.country})
                  </span>
                </div>
              </div>
            </div>

            {/* Mobile Controls */}
            <div className="flex items-center gap-2 md:hidden">
              <button
                id="refresh-btn-mobile"
                onClick={onRefresh}
                disabled={isRefreshing}
                className="p-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 active:scale-95 transition-all"
                title="Refresh weather data"
                aria-label="Refresh weather data"
              >
                <RefreshCw
                  className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-sky-600' : ''}`}
                />
              </button>
              <button
                id="unit-toggle-mobile"
                onClick={onToggleUnit}
                className="px-2.5 py-1 text-xs font-semibold rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-100 transition-all"
              >
                {unit === 'celsius' ? '°C (Metric)' : '°F (Imperial)'}
              </button>
            </div>
          </div>

          {/* Search Bar & Auto-suggestions */}
          <div className="relative flex-1 max-w-xl" ref={containerRef}>
            <div className="relative flex items-center">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              <input
                id="city-search-input"
                type="text"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  if (!isOpen) setIsOpen(true);
                }}
                onFocus={() => {
                  if (query.trim().length >= 2) setIsOpen(true);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Escape') setIsOpen(false);
                  if (e.key === 'Enter' && results.length > 0) {
                    handleSelect(results[0]);
                  }
                }}
                placeholder="Search any global city (e.g. London, Tokyo, Zurich)..."
                className="w-full pl-10 pr-10 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all shadow-2xs"
              />

              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
                {isLoading && (
                  <Loader2 className="w-4 h-4 text-sky-500 animate-spin" />
                )}
                {query && !isLoading && (
                  <button
                    onClick={handleClear}
                    className="text-slate-400 hover:text-slate-600 p-0.5 rounded-full"
                    aria-label="Clear search input"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Dropdown Suggestions */}
            {isOpen && (
              <div className="absolute left-0 right-0 top-full mt-1.5 bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden z-40 max-h-80 overflow-y-auto">
                {isLoading && (
                  <div className="p-4 flex items-center justify-center gap-2 text-slate-500 text-sm">
                    <Loader2 className="w-4 h-4 animate-spin text-sky-600" />
                    <span>Searching Open-Meteo geocoding directory...</span>
                  </div>
                )}

                {!isLoading && searchError && (
                  <div className="p-4 text-sm text-rose-600 bg-rose-50/50">
                    <p className="font-medium">Search query error</p>
                    <p className="text-xs text-rose-500 mt-0.5">{searchError}</p>
                  </div>
                )}

                {!isLoading && hasSearched && results.length === 0 && !searchError && (
                  <div className="p-5 text-center text-slate-500">
                    <p className="text-sm font-medium text-slate-700">City not found</p>
                    <p className="text-xs text-slate-400 mt-1">
                      No matching global location found for "{query}". Check spelling or try a major nearby municipality.
                    </p>
                  </div>
                )}

                {!isLoading && results.length > 0 && (
                  <div className="py-1 divide-y divide-slate-100">
                    <div className="px-3 py-1.5 text-2xs font-semibold text-slate-400 uppercase tracking-wider">
                      Matching Locations ({results.length})
                    </div>
                    {results.map((city) => {
                      const isCurrent = city.id === currentCity.id;
                      return (
                        <button
                          key={`${city.id}-${city.latitude}-${city.longitude}`}
                          onClick={() => handleSelect(city)}
                          className={`w-full text-left px-3.5 py-2.5 flex items-center justify-between hover:bg-sky-50/60 transition-colors ${
                            isCurrent ? 'bg-sky-50 text-sky-900' : 'text-slate-800'
                          }`}
                        >
                          <div className="flex items-center gap-2.5 truncate">
                            <MapPin
                              className={`w-4 h-4 shrink-0 ${
                                isCurrent ? 'text-sky-600' : 'text-slate-400'
                              }`}
                            />
                            <div className="truncate">
                              <span className="font-medium text-sm text-slate-900">
                                {city.name}
                              </span>
                              <span className="text-xs text-slate-500 ml-1.5">
                                {city.admin1 ? `${city.admin1}, ` : ''}
                                {city.country}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <span className="text-2xs font-mono px-1.5 py-0.5 rounded bg-slate-100 text-slate-500">
                              {city.country_code}
                            </span>
                            {isCurrent && (
                              <Check className="w-4 h-4 text-sky-600" />
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Desktop Controls (Unit Toggle & Refresh) */}
          <div className="hidden md:flex items-center gap-2.5">
            <button
              id="unit-toggle-desktop"
              onClick={onToggleUnit}
              className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-100 transition-all flex items-center gap-1.5 shadow-2xs"
              title="Toggle Celsius / Fahrenheit"
            >
              <span className={unit === 'celsius' ? 'text-sky-600 font-bold' : 'text-slate-400'}>
                °C
              </span>
              <span className="text-slate-300">/</span>
              <span className={unit === 'fahrenheit' ? 'text-sky-600 font-bold' : 'text-slate-400'}>
                °F
              </span>
            </button>

            <button
              id="refresh-btn-desktop"
              onClick={onRefresh}
              disabled={isRefreshing}
              className="px-3 py-1.5 text-xs font-medium rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-100 active:scale-95 transition-all flex items-center gap-1.5 shadow-2xs"
              title="Refresh weather data"
            >
              <RefreshCw
                className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-sky-600' : 'text-slate-500'}`}
              />
              <span>{isRefreshing ? 'Updating...' : 'Refresh'}</span>
            </button>
          </div>
        </div>

        {/* Quick Popular Location Chips */}
        <div className="mt-2.5 flex items-center gap-1.5 overflow-x-auto pb-1 text-xs no-scrollbar">
          <span className="text-slate-400 text-2xs font-medium uppercase tracking-wider shrink-0 mr-1">
            Quick Cities:
          </span>
          {POPULAR_CITIES.map((city) => {
            const isActive = city.id === currentCity.id;
            return (
              <button
                key={city.name}
                onClick={() => onSelectCity(city)}
                className={`px-2.5 py-0.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-sky-600 text-white shadow-2xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80'
                }`}
              >
                {city.name}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
