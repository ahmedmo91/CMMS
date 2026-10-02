import React, { useState } from 'react';
import { WidgetProps } from '../../../core/modules/types.ts';
import { faultService } from '../services/faultService.ts';
import { TrendingUp, BarChart3 } from 'lucide-react';

export const FaultTrendWidget: React.FC<WidgetProps> = ({ onNavigate }) => {
  const stats = faultService.getStatistics();
  const [metric, setMetric] = useState<'faults' | 'downtime'>('faults');

  const maxVal = Math.max(...stats.monthlyTrend.map(t => metric === 'faults' ? t.faults : t.downtimeHours), 1);

  return (
    <div className="p-5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs h-full flex flex-col justify-between">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
            <TrendingUp className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-slate-900 dark:text-white">Fault & Downtime Trend</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">6-Month historical frequency</p>
          </div>
        </div>

        <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-0.5 rounded-lg text-xs font-medium">
          <button
            onClick={() => setMetric('faults')}
            className={`px-2.5 py-1 rounded-md transition-all ${
              metric === 'faults'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Faults
          </button>
          <button
            onClick={() => setMetric('downtime')}
            className={`px-2.5 py-1 rounded-md transition-all ${
              metric === 'downtime'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Downtime (hrs)
          </button>
        </div>
      </div>

      {/* Bar Chart Representation */}
      <div className="mt-4 pt-2 flex items-end justify-between gap-3 h-36">
        {stats.monthlyTrend.map((item, idx) => {
          const val = metric === 'faults' ? item.faults : item.downtimeHours;
          const pct = Math.max(12, Math.round((val / maxVal) * 100));
          const isLatest = idx === stats.monthlyTrend.length - 1;

          return (
            <div key={item.month} className="flex-1 flex flex-col items-center gap-2 group">
              <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity">
                {val}
              </span>
              <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-t-md h-24 flex items-end p-1">
                <div
                  style={{ height: `${pct}%` }}
                  className={`w-full rounded-t-sm transition-all duration-500 ${
                    isLatest
                      ? 'bg-gradient-to-t from-indigo-600 to-indigo-400 dark:from-indigo-500 dark:to-indigo-300 shadow-sm'
                      : 'bg-slate-300 dark:bg-slate-700 group-hover:bg-indigo-300 dark:group-hover:bg-indigo-800'
                  }`}
                />
              </div>
              <span className={`text-xs font-medium ${isLatest ? 'text-indigo-600 dark:text-indigo-400 font-bold' : 'text-slate-500 dark:text-slate-400'}`}>
                {item.month}
              </span>
            </div>
          );
        })}
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
        <span>Current Month vs Avg: <strong className="text-slate-800 dark:text-slate-200">-18% Faults</strong></span>
        <button
          onClick={() => onNavigate?.('/maintenance/faults/analytics')}
          className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline flex items-center gap-1"
        >
          Detailed Analytics &rarr;
        </button>
      </div>
    </div>
  );
};
