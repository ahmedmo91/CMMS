import React from 'react';
import { WidgetProps } from '../../../core/modules/types.ts';
import { Calendar, CheckCircle2, Clock, AlertTriangle } from 'lucide-react';

export const PMDueTodayWidget: React.FC<WidgetProps> = ({ onNavigate }) => {
  return (
    <div
      onClick={() => onNavigate?.('/maintenance/preventive')}
      className="p-5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs hover:border-slate-300 dark:hover:border-slate-700 transition-all cursor-pointer h-full flex flex-col justify-between"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 flex items-center justify-center">
            <Calendar className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-semibold tracking-wider uppercase text-slate-500 dark:text-slate-400">PM Due Today & Overdue</h4>
          </div>
        </div>
        <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-teal-100 dark:bg-teal-900/60 text-teal-700 dark:text-teal-300">
          Module Active
        </span>
      </div>

      <div className="my-3 flex items-baseline gap-4">
        <div>
          <span className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">3</span>
          <span className="text-xs font-medium text-slate-500 ml-1">due today</span>
        </div>
        <div className="pl-4 border-l border-slate-200 dark:border-slate-700">
          <span className="text-2xl font-bold tracking-tight text-rose-600 dark:text-rose-400">1</span>
          <span className="text-xs font-medium text-rose-500 ml-1">overdue</span>
        </div>
      </div>

      <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center justify-between">
        <span className="truncate">Next: Conveyor CV-02 500h Lube</span>
        <span className="text-teal-600 dark:text-teal-400 font-medium hover:underline">Schedule &rarr;</span>
      </div>
    </div>
  );
};

export const PMCompletionRateWidget: React.FC<WidgetProps> = ({ onNavigate }) => {
  return (
    <div
      onClick={() => onNavigate?.('/maintenance/preventive')}
      className="p-5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs hover:border-slate-300 dark:hover:border-slate-700 transition-all cursor-pointer h-full flex flex-col justify-between"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-cyan-50 dark:bg-cyan-950/60 text-cyan-600 dark:text-cyan-400 flex items-center justify-center">
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-semibold tracking-wider uppercase text-slate-500 dark:text-slate-400">PM Compliance Rate</h4>
          </div>
        </div>
        <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">92.4%</span>
      </div>

      <div className="my-3">
        <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2.5 overflow-hidden">
          <div className="bg-gradient-to-r from-teal-500 to-emerald-500 h-full rounded-full" style={{ width: '92.4%' }} />
        </div>
        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mt-2">
          <span>Target: 95.0%</span>
          <span>48 of 52 tasks completed on time</span>
        </div>
      </div>

      <div className="text-xs text-slate-500 flex items-center justify-between">
        <span>Preventive vs Reactive Ratio: <strong>68:32</strong></span>
        <span className="text-cyan-600 dark:text-cyan-400 font-medium hover:underline">Details &rarr;</span>
      </div>
    </div>
  );
};
