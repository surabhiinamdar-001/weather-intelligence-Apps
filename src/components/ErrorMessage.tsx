import React from 'react';
import { AlertCircle, RefreshCw, WifiOff } from 'lucide-react';

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
  isRetrying?: boolean;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({
  message,
  onRetry,
  isRetrying = false,
}) => {
  const isNetwork =
    message.toLowerCase().includes('network') ||
    message.toLowerCase().includes('offline') ||
    message.toLowerCase().includes('timed out');

  return (
    <div
      id="weather-error-banner"
      className="max-w-2xl mx-auto my-8 p-6 bg-white rounded-2xl border border-rose-200/80 shadow-sm text-center"
    >
      <div className="w-12 h-12 rounded-full bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600 mx-auto mb-3.5">
        {isNetwork ? (
          <WifiOff className="w-6 h-6" />
        ) : (
          <AlertCircle className="w-6 h-6" />
        )}
      </div>

      <h3 className="text-lg font-bold text-slate-900 tracking-tight">
        Weather Data Unavailable
      </h3>

      <p className="text-sm text-slate-600 mt-1.5 max-w-md mx-auto leading-relaxed">
        {message}
      </p>

      {onRetry && (
        <button
          id="retry-fetch-btn"
          onClick={onRetry}
          disabled={isRetrying}
          className="mt-4 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold shadow-xs hover:shadow-sm transition-all inline-flex items-center gap-2"
        >
          <RefreshCw
            className={`w-3.5 h-3.5 ${isRetrying ? 'animate-spin' : ''}`}
          />
          <span>{isRetrying ? 'Retrying Connection...' : 'Retry Connection'}</span>
        </button>
      )}
    </div>
  );
};
