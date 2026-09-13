import React from 'react';
import {
  Sparkles,
  AlertTriangle,
  Info,
  ShieldCheck,
  Shirt,
  Activity,
} from 'lucide-react';
import { WeatherIntelligenceSummary } from '../types/weather';

interface WeatherIntelligenceCardProps {
  intelligence: WeatherIntelligenceSummary;
}

export const WeatherIntelligenceCard: React.FC<WeatherIntelligenceCardProps> = ({
  intelligence,
}) => {
  return (
    <div
      id="weather-intelligence-card"
      className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-xs flex flex-col justify-between"
    >
      <div>
        {/* Title Bar */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-sky-50 text-sky-700 flex items-center justify-center border border-sky-200/60">
              <Sparkles className="w-4 h-4 text-sky-600" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 leading-tight">
                Weather Intelligence
              </h3>
              <p className="text-2xs text-slate-500 font-medium">
                Deterministic Meteorological Insights
              </p>
            </div>
          </div>
          <span className="text-2xs font-mono font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
            Rule-Based Engine
          </span>
        </div>

        {/* Dynamic Meteorological Headline */}
        <div className="mt-4 p-3.5 rounded-xl bg-gradient-to-r from-sky-50 to-indigo-50/60 border border-sky-100 text-slate-800 text-sm font-medium leading-relaxed">
          <span className="font-semibold text-sky-900 block text-xs uppercase tracking-wider mb-0.5">
            Regional Summary:
          </span>
          {intelligence.headline}
        </div>

        {/* Primary Recommendations List */}
        <div className="mt-4 space-y-2.5">
          {intelligence.recommendations.map((rec) => {
            const isWarning = rec.level === 'warning';
            const isCaution = rec.level === 'caution';
            const isOptimal = rec.level === 'optimal';

            const bgClass = isWarning
              ? 'bg-rose-50/70 border-rose-200 text-rose-900'
              : isCaution
              ? 'bg-amber-50/70 border-amber-200 text-amber-900'
              : isOptimal
              ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900'
              : 'bg-slate-50 border-slate-200 text-slate-800';

            const icon = isWarning ? (
              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            ) : isCaution ? (
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            ) : isOptimal ? (
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            ) : (
              <Info className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
            );

            return (
              <div
                key={rec.id}
                className={`p-3 rounded-xl border text-xs leading-relaxed transition-all ${bgClass}`}
              >
                <div className="flex items-start gap-2">
                  {icon}
                  <div className="flex-1">
                    <span className="font-bold text-slate-900 mr-1.5">
                      {rec.title}:
                    </span>
                    <span className="text-slate-700">{rec.advice}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Deterministic Clothing & Gear Suggestion */}
        <div className="mt-4 pt-4 border-t border-slate-100">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-900 mb-2">
            <Shirt className="w-3.5 h-3.5 text-sky-600" />
            <span>Recommended Attire & Gear</span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-2xs text-slate-600">
            <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
              <span className="font-semibold text-slate-800 block text-2xs">Upper:</span>
              <span className="truncate block">{intelligence.clothingGuide.upper}</span>
            </div>
            <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
              <span className="font-semibold text-slate-800 block text-2xs">Lower:</span>
              <span className="truncate block">{intelligence.clothingGuide.lower}</span>
            </div>
            <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
              <span className="font-semibold text-slate-800 block text-2xs">Footwear:</span>
              <span className="truncate block">{intelligence.clothingGuide.footwear}</span>
            </div>
            <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
              <span className="font-semibold text-slate-800 block text-2xs">Gear / Tips:</span>
              <span className="truncate block">
                {intelligence.clothingGuide.accessories.join(', ')}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Activity Suitability Index Preview */}
      <div className="mt-4 pt-4 border-t border-slate-100">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-slate-900 flex items-center gap-1">
            <Activity className="w-3.5 h-3.5 text-sky-600" />
            Activity Readiness
          </span>
          <span className="text-2xs text-slate-400">Score / 100</span>
        </div>
        <div className="space-y-1.5">
          {intelligence.activities.slice(0, 3).map((act) => {
            const barColor =
              act.score >= 80
                ? 'bg-emerald-500'
                : act.score >= 60
                ? 'bg-sky-500'
                : act.score >= 40
                ? 'bg-amber-500'
                : 'bg-rose-500';

            return (
              <div key={act.name} className="text-2xs">
                <div className="flex justify-between items-center text-slate-700 mb-0.5">
                  <span className="font-medium">{act.name}</span>
                  <span className="font-semibold text-slate-900">
                    {act.score}% ({act.status})
                  </span>
                </div>
                <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${barColor}`}
                    style={{ width: `${act.score}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
