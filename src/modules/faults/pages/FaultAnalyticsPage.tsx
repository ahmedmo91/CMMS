import React from 'react';
import { faultService } from '../services/faultService.ts';
import { equipmentService } from '../../../shared/entities/equipment/equipmentService.ts';
import {
  TrendingUp,
  Clock,
  Zap,
  DollarSign,
  AlertOctagon,
  BarChart3,
  CheckCircle,
} from 'lucide-react';

export const FaultAnalyticsPage: React.FC = () => {
  const stats = faultService.getStatistics();
  const allEquipment = equipmentService.getAll();
  const faults = faultService.getAll();

  // Pareto breakdown by failure code
  const codeCountMap: Record<string, { count: number; downtime: number }> = {};
  faults.forEach(f => {
    if (!codeCountMap[f.failureCode]) {
      codeCountMap[f.failureCode] = { count: 0, downtime: 0 };
    }
    codeCountMap[f.failureCode].count += 1;
    codeCountMap[f.failureCode].downtime += f.downtimeMinutes;
  });

  const sortedFailureCodes = Object.entries(codeCountMap).sort((a, b) => b[1].downtime - a[1].downtime);

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
          Reliability & MTTR Analytics
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Mean Time To Repair (MTTR), Pareto failure code rankings, and downtime financial impact.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-xs font-semibold uppercase text-slate-400 tracking-wider">Overall MTTR</span>
          <div className="text-3xl font-bold text-slate-900 dark:text-white mt-1">
            {stats.avgRepairHours} <span className="text-xs font-normal text-slate-500">hours</span>
          </div>
          <p className="text-xs text-emerald-600 mt-1">&darr; 0.8 hrs faster than target</p>
        </div>

        <div className="p-5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-xs font-semibold uppercase text-slate-400 tracking-wider">Cumulative Downtime</span>
          <div className="text-3xl font-bold text-slate-900 dark:text-white mt-1">
            {stats.totalDowntimeHours} <span className="text-xs font-normal text-slate-500">hours</span>
          </div>
          <p className="text-xs text-slate-500 mt-1">Across 8 critical machines</p>
        </div>

        <div className="p-5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-xs font-semibold uppercase text-slate-400 tracking-wider">Direct Repair Costs</span>
          <div className="text-3xl font-bold text-slate-900 dark:text-white mt-1">
            ${stats.totalRepairCost.toLocaleString()}
          </div>
          <p className="text-xs text-slate-500 mt-1">Parts & technician hours</p>
        </div>

        <div className="p-5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-xs font-semibold uppercase text-slate-400 tracking-wider">MTBF (Est. Run Time)</span>
          <div className="text-3xl font-bold text-indigo-600 dark:text-indigo-400 mt-1">
            142.5 <span className="text-xs font-normal text-slate-500">hrs</span>
          </div>
          <p className="text-xs text-indigo-600 dark:text-indigo-400 mt-1">Mean Time Between Failures</p>
        </div>
      </div>

      {/* Two-Column Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pareto Failure Code Analysis */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-4">
            Pareto Downtime by Failure Code
          </h3>
          <div className="space-y-4">
            {sortedFailureCodes.map(([code, data]) => {
              const maxDowntime = sortedFailureCodes[0][1].downtime || 1;
              const pct = Math.round((data.downtime / maxDowntime) * 100);

              return (
                <div key={code} className="space-y-1">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{code}</span>
                    <div className="flex items-center gap-3 text-slate-500">
                      <span>{data.count} incident{data.count > 1 ? 's' : ''}</span>
                      <strong className="text-slate-900 dark:text-white">{data.downtime} mins down</strong>
                    </div>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
                    <div className="bg-indigo-600 h-full rounded-full" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Equipment Reliability Status */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-4">
            Critical Assets Downtime Ranking
          </h3>
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {allEquipment.map(eq => (
              <div key={eq.id} className="py-3 flex items-center justify-between text-xs">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 dark:text-white">{eq.equipmentNumber}</span>
                    <span className="text-slate-400">&bull;</span>
                    <span className="text-slate-600 dark:text-slate-300">{eq.name}</span>
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">{eq.location}</div>
                </div>
                <div className="text-right">
                  <span className="font-mono font-bold text-slate-900 dark:text-white">{eq.downtimeHoursTotal} hrs</span>
                  <div className="text-[10px] text-slate-400">Total YTD Downtime</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
