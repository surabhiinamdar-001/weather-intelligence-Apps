import React from 'react';

export const LoadingSkeleton: React.FC = () => {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Top Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs h-72">
          <div className="flex justify-between items-start">
            <div className="space-y-2">
              <div className="h-4 w-28 bg-slate-200 rounded-md" />
              <div className="h-8 w-48 bg-slate-200 rounded-md" />
              <div className="h-3 w-32 bg-slate-100 rounded-md" />
            </div>
            <div className="h-6 w-24 bg-slate-100 rounded-md" />
          </div>
          <div className="mt-8 flex items-center justify-between">
            <div className="h-14 w-36 bg-slate-200 rounded-lg" />
            <div className="h-14 w-14 bg-slate-200 rounded-2xl" />
          </div>
          <div className="mt-8 grid grid-cols-4 gap-3">
            <div className="h-12 bg-slate-100 rounded-xl" />
            <div className="h-12 bg-slate-100 rounded-xl" />
            <div className="h-12 bg-slate-100 rounded-xl" />
            <div className="h-12 bg-slate-100 rounded-xl" />
          </div>
        </div>

        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs h-72">
          <div className="h-6 w-44 bg-slate-200 rounded-md mb-4" />
          <div className="h-12 bg-slate-100 rounded-xl mb-3" />
          <div className="h-14 bg-slate-100 rounded-xl mb-3" />
          <div className="h-14 bg-slate-100 rounded-xl" />
        </div>
      </div>

      {/* 7-Day Forecast Skeleton */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs">
        <div className="h-6 w-52 bg-slate-200 rounded-md mb-5" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-3">
          {[...Array(7)].map((_, i) => (
            <div key={i} className="h-52 bg-slate-100/70 rounded-xl" />
          ))}
        </div>
      </div>

      {/* Charts Skeleton */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs h-80">
        <div className="flex justify-between items-center mb-6">
          <div className="h-6 w-48 bg-slate-200 rounded-md" />
          <div className="h-8 w-60 bg-slate-100 rounded-lg" />
        </div>
        <div className="h-56 bg-slate-50 rounded-xl" />
      </div>
    </div>
  );
};
