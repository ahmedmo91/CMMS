import React from 'react';
import { WidgetProps } from '../../../core/modules/types.ts';
import { faultService } from '../services/faultService.ts';
import { AlertTriangle, Clock, Wrench, CheckCircle, Zap } from 'lucide-react';

export const TotalFaultsWidget: React.FC<WidgetProps> = ({ onNavigate }) => {
  const stats = faultService.getStatistics();

  return (
    <div
      onClick={() => onNavigate?.('/maintenance/faults')}
      className="p-5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs hover:border-slate-300 dark:hover:border-slate-700 transition-all cursor-pointer h-full flex flex-col justify-between"
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold tracking-wider uppercase text-slate-500 dark:text-slate-400">Total Faults</span>
        <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
          <Wrench className="w-4 h-4" />
        </div>
      </div>
      <div className="mt-3">
        <div className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">{stats.total}</div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1.5">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-blue-500"></span>
          Recorded across 8 plant assets
        </p>
      </div>
    </div>
  );
};

export const OpenFaultsWidget: React.FC<WidgetProps> = ({ onNavigate }) => {
  const stats = faultService.getStatistics();

  return (
    <div
      onClick={() => onNavigate?.('/maintenance/faults?status=REPORTED')}
      className="p-5 bg-white dark:bg-slate-900 rounded-xl border border-rose-200 dark:border-rose-900/50 shadow-xs hover:border-rose-300 dark:hover:border-rose-800 transition-all cursor-pointer h-full flex flex-col justify-between"
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold tracking-wider uppercase text-rose-600 dark:text-rose-400">Open / Awaiting Action</span>
        <div className="w-8 h-8 rounded-lg bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center">
          <AlertTriangle className="w-4 h-4" />
        </div>
      </div>
      <div className="mt-3">
        <div className="text-3xl font-bold tracking-tight text-rose-600 dark:text-rose-400">{stats.open}</div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse"></span>
          Immediate supervisor dispatch needed
        </p>
      </div>
    </div>
  );
};

export const InProgressWidget: React.FC<WidgetProps> = ({ onNavigate }) => {
  const stats = faultService.getStatistics();

  return (
    <div
      onClick={() => onNavigate?.('/maintenance/faults?status=IN_PROGRESS')}
      className="p-5 bg-white dark:bg-slate-900 rounded-xl border border-amber-200 dark:border-amber-900/50 shadow-xs hover:border-amber-300 dark:hover:border-amber-800 transition-all cursor-pointer h-full flex flex-col justify-between"
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold tracking-wider uppercase text-amber-600 dark:text-amber-400">In Progress / Active</span>
        <div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center">
          <Clock className="w-4 h-4" />
        </div>
      </div>
      <div className="mt-3">
        <div className="text-3xl font-bold tracking-tight text-amber-600 dark:text-amber-400">{stats.inProgress}</div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-amber-500"></span>
          Assigned to certified technicians
        </p>
      </div>
    </div>
  );
};

export const MTTRRepairTimeWidget: React.FC<WidgetProps> = ({ onNavigate }) => {
  const stats = faultService.getStatistics();

  return (
    <div
      onClick={() => onNavigate?.('/maintenance/faults/analytics')}
      className="p-5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs hover:border-slate-300 dark:hover:border-slate-700 transition-all cursor-pointer h-full flex flex-col justify-between"
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold tracking-wider uppercase text-slate-500 dark:text-slate-400">Avg Repair Time (MTTR)</span>
        <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
          <CheckCircle className="w-4 h-4" />
        </div>
      </div>
      <div className="mt-3">
        <div className="flex items-baseline gap-1">
          <span className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">{stats.avgRepairHours}</span>
          <span className="text-sm font-medium text-slate-500 dark:text-slate-400">hrs</span>
        </div>
        <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-1 font-medium">
          &darr; 14% improvement vs Q2 baseline
        </p>
      </div>
    </div>
  );
};

export const TotalDowntimeWidget: React.FC<WidgetProps> = ({ onNavigate }) => {
  const stats = faultService.getStatistics();

  return (
    <div
      onClick={() => onNavigate?.('/maintenance/faults/analytics')}
      className="p-5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs hover:border-slate-300 dark:hover:border-slate-700 transition-all cursor-pointer h-full flex flex-col justify-between"
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold tracking-wider uppercase text-slate-500 dark:text-slate-400">Total Downtime</span>
        <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
          <Zap className="w-4 h-4" />
        </div>
      </div>
      <div className="mt-3">
        <div className="flex items-baseline gap-1">
          <span className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">{stats.totalDowntimeHours}</span>
          <span className="text-sm font-medium text-slate-500 dark:text-slate-400">hrs</span>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Est. impact: ${(stats.totalRepairCost).toLocaleString()} in direct repairs
        </p>
      </div>
    </div>
  );
};
