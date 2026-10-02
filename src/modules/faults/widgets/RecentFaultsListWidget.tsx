import React from 'react';
import { WidgetProps } from '../../../core/modules/types.ts';
import { faultService } from '../services/faultService.ts';
import { equipmentService } from '../../../shared/entities/equipment/equipmentService.ts';
import { workforceService } from '../../../shared/entities/workforce/workforceService.ts';
import { AlertCircle, ChevronRight, CheckCircle2, Clock, AlertTriangle } from 'lucide-react';

export const RecentFaultsListWidget: React.FC<WidgetProps> = ({ onNavigate }) => {
  const faults = faultService.getAll().slice(0, 5);
  const equipmentMap = new Map(equipmentService.getAll().map(e => [e.id, e]));
  const techMap = new Map(workforceService.getAll().map(e => [e.id, e]));

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'CRITICAL':
        return <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold bg-rose-100 text-rose-700 dark:bg-rose-950/70 dark:text-rose-300">CRITICAL</span>;
      case 'HIGH':
        return <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-100 text-amber-800 dark:bg-amber-950/70 dark:text-amber-300">HIGH</span>;
      case 'MEDIUM':
        return <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-blue-100 text-blue-800 dark:bg-blue-950/70 dark:text-blue-300">MEDIUM</span>;
      default:
        return <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">LOW</span>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'REPORTED':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-rose-600 dark:text-rose-400">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse"></span>
            Reported
          </span>
        );
      case 'IN_PROGRESS':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-600 dark:text-amber-400">
            <Clock className="w-3.5 h-3.5" />
            In Progress
          </span>
        );
      case 'PENDING_PARTS':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-purple-600 dark:text-purple-400">
            <AlertTriangle className="w-3.5 h-3.5" />
            Pending Parts
          </span>
        );
      case 'RESOLVED':
      case 'CLOSED':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="w-3.5 h-3.5" />
            {status === 'CLOSED' ? 'Closed' : 'Resolved'}
          </span>
        );
      default:
        return <span className="text-xs text-slate-500">{status}</span>;
    }
  };

  return (
    <div className="p-5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs h-full flex flex-col justify-between">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
        <div>
          <h4 className="text-sm font-semibold text-slate-900 dark:text-white">Active & Recent Fault Records</h4>
          <p className="text-xs text-slate-500 dark:text-slate-400">Real-time maintenance fault log</p>
        </div>
        <button
          onClick={() => onNavigate?.('/maintenance/faults')}
          className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 flex items-center gap-0.5"
        >
          Open Fault Log &rarr;
        </button>
      </div>

      <div className="divide-y divide-slate-100 dark:divide-slate-800/80 my-2">
        {faults.map(fault => {
          const eq = equipmentMap.get(fault.equipmentId);
          const tech = fault.assignedTechnicianId ? techMap.get(fault.assignedTechnicianId) : null;

          return (
            <div
              key={fault.id}
              onClick={() => onNavigate?.(`/maintenance/faults/${fault.id}`)}
              className="py-3 flex items-center justify-between gap-4 hover:bg-slate-50 dark:hover:bg-slate-800/40 px-2 rounded-lg cursor-pointer transition-colors"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="shrink-0">
                  {getPriorityBadge(fault.priority)}
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-slate-800 dark:text-slate-200">
                      {fault.faultNumber}
                    </span>
                    <span className="text-xs text-slate-400 dark:text-slate-500">&bull;</span>
                    <span className="text-xs font-medium text-slate-600 dark:text-slate-300 truncate">
                      {eq ? `${eq.equipmentNumber} (${eq.name})` : 'Asset'}
                    </span>
                  </div>
                  <p className="text-xs font-medium text-slate-900 dark:text-white truncate mt-0.5">
                    {fault.title}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 shrink-0">
                <div className="hidden sm:block text-right">
                  {getStatusBadge(fault.status)}
                  <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">
                    {tech ? tech.name : 'Unassigned'}
                  </p>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </div>
            </div>
          );
        })}
      </div>

      <div className="pt-2 text-xs text-slate-400 dark:text-slate-500 flex items-center justify-between">
        <span>Showing 5 of {faultService.getAll().length} recorded incidents</span>
        <span>Auto-sync active</span>
      </div>
    </div>
  );
};
