import React from 'react';
import {
  Activity,
  Bike,
  Utensils,
  Footprints,
  Train,
} from 'lucide-react';
import { ActivityScore } from '../types/weather';

interface ActivityMatrixProps {
  activities: ActivityScore[];
}

export const ActivityMatrix: React.FC<ActivityMatrixProps> = ({ activities }) => {
  const getIcon = (category: ActivityScore['category']) => {
    switch (category) {
      case 'Running':
        return <Footprints className="w-4 h-4 text-sky-600" />;
      case 'Cycling':
        return <Bike className="w-4 h-4 text-sky-600" />;
      case 'Outdoor Dining':
        return <Utensils className="w-4 h-4 text-amber-600" />;
      case 'Hiking':
        return <Footprints className="w-4 h-4 text-emerald-600" />;
      case 'Commuting':
        return <Train className="w-4 h-4 text-indigo-600" />;
      default:
        return <Activity className="w-4 h-4 text-sky-600" />;
    }
  };

  const getStatusBadge = (status: ActivityScore['status']) => {
    switch (status) {
      case 'Ideal':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Good':
        return 'bg-sky-50 text-sky-700 border-sky-200';
      case 'Fair':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Challenging':
        return 'bg-orange-50 text-orange-700 border-orange-200';
      case 'Not Recommended':
        return 'bg-rose-50 text-rose-700 border-rose-200';
    }
  };

  return (
    <div
      id="activity-readiness-matrix"
      className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-xs"
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 mb-5">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-sky-50 text-sky-700 flex items-center justify-center border border-sky-200/60">
            <Activity className="w-4 h-4 text-sky-600" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 tracking-tight">
              Activity Suitability Index
            </h3>
            <p className="text-2xs text-slate-400 font-medium">
              Deterministic Outdoor Readiness Scores
            </p>
          </div>
        </div>
        <span className="text-2xs font-mono font-medium text-slate-500 bg-slate-50 border border-slate-200 px-2 py-0.5 rounded-md self-start sm:self-auto">
          Calculated from Thermal & Atmospheric Inputs
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {activities.map((act) => {
          return (
            <div
              key={act.name}
              className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition-colors flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-1.5 mb-2">
                  <div className="p-1.5 rounded-lg bg-white border border-slate-200/80 shadow-2xs">
                    {getIcon(act.category)}
                  </div>
                  <span
                    className={`text-2xs font-semibold px-2 py-0.5 rounded-full border ${getStatusBadge(
                      act.status
                    )}`}
                  >
                    {act.status}
                  </span>
                </div>

                <div className="text-xs font-bold text-slate-900 mt-1">
                  {act.name}
                </div>
                <div className="text-2xs text-slate-500 mt-0.5 line-clamp-2">
                  {act.reason}
                </div>
              </div>

              <div className="mt-3 pt-2.5 border-t border-slate-200/60">
                <div className="flex justify-between items-baseline mb-1">
                  <span className="text-2xs text-slate-400 font-medium">
                    Index Score
                  </span>
                  <span className="text-xs font-extrabold text-slate-800">
                    {act.score}/100
                  </span>
                </div>
                <div className="w-full h-1.5 bg-slate-200/80 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      act.score >= 80
                        ? 'bg-emerald-500'
                        : act.score >= 60
                        ? 'bg-sky-500'
                        : act.score >= 40
                        ? 'bg-amber-500'
                        : 'bg-rose-500'
                    }`}
                    style={{ width: `${act.score}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
