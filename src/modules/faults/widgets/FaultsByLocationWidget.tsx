import React from 'react';
import { WidgetProps } from '../../../core/modules/types.ts';
import { faultService } from '../services/faultService.ts';
import { MapPin } from 'lucide-react';

export const FaultsByLocationWidget: React.FC<WidgetProps> = ({ onNavigate }) => {
  const stats = faultService.getStatistics();
  const locations = Object.entries(stats.locationMap);
  const total = stats.total || 1;

  return (
    <div className="p-5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs h-full flex flex-col justify-between">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <MapPin className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-slate-900 dark:text-white">Faults by Plant Location</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">Distribution across active bays</p>
          </div>
        </div>
      </div>

      <div className="mt-3 space-y-3">
        {locations.map(([loc, data]) => {
          const pct = Math.round((data.count / total) * 100);
          return (
            <div key={loc} className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-slate-800 dark:text-slate-200 truncate">{loc}</span>
                <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                  <span className="font-semibold text-slate-900 dark:text-white">{data.count} faults</span>
                  <span className="text-[11px]">({data.downtimeMin}m down)</span>
                </div>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
                <div
                  style={{ width: `${pct}%` }}
                  className="bg-emerald-500 dark:bg-emerald-400 h-full rounded-full transition-all duration-500"
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
        <span>Highest Risk: <strong>Machining Bay (Building A)</strong></span>
        <button
          onClick={() => onNavigate?.('/maintenance/faults')}
          className="text-emerald-600 dark:text-emerald-400 font-semibold hover:underline"
        >
          View All &rarr;
        </button>
      </div>
    </div>
  );
};
