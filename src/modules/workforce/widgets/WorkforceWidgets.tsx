import React from 'react';
import { WidgetProps } from '../../../core/modules/types.ts';
import { Users, Clock } from 'lucide-react';
import { workforceService } from '../../../shared/entities/workforce/workforceService.ts';

export const WorkforceAttendanceWidget: React.FC<WidgetProps> = ({ onNavigate }) => {
  const allEmployees = workforceService.getAll();
  const activeCount = allEmployees.filter(e => e.status === 'ACTIVE').length;

  return (
    <div
      onClick={() => onNavigate?.('/workforce/employees')}
      className="p-5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs hover:border-slate-300 dark:hover:border-slate-700 transition-all cursor-pointer h-full flex flex-col justify-between"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 flex items-center justify-center">
            <Users className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-semibold tracking-wider uppercase text-slate-500 dark:text-slate-400">Technicians On Shift</h4>
          </div>
        </div>
        <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
          Shift 1 Active
        </span>
      </div>

      <div className="my-3 flex items-baseline gap-4">
        <div>
          <span className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">{activeCount}</span>
          <span className="text-xs font-medium text-slate-500 ml-1">of {allEmployees.length} present</span>
        </div>
        <div className="pl-4 border-l border-slate-200 dark:border-slate-700">
          <span className="text-2xl font-bold tracking-tight text-slate-700 dark:text-slate-300">14.5</span>
          <span className="text-xs font-medium text-slate-500 ml-1">OT hrs this wk</span>
        </div>
      </div>

      <div className="text-xs text-slate-500 flex items-center justify-between">
        <span>Coverage: Mechanical (100%), Electrical (100%)</span>
        <span className="text-sky-600 dark:text-sky-400 font-medium hover:underline">Roster &rarr;</span>
      </div>
    </div>
  );
};
