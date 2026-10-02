import React, { useState } from 'react';
import { equipmentService } from '../../../shared/entities/equipment/equipmentService.ts';
import { workforceService } from '../../../shared/entities/workforce/workforceService.ts';
import { Calendar, CheckSquare, Clock, Plus, CheckCircle2, AlertTriangle } from 'lucide-react';

interface PMScheduleRecord {
  id: number;
  planCode: string;
  title: string;
  equipmentId: number;
  assignedToId: number;
  frequencyDays: number;
  nextDueDate: string;
  status: 'SCHEDULED' | 'DUE' | 'OVERDUE' | 'COMPLETED';
  tasks: string[];
}

const SEED_PM_SCHEDULES: PMScheduleRecord[] = [
  {
    id: 1,
    planCode: 'PM-CNC-500H',
    title: '500-Hour CNC Spindle & Axis Lubrication',
    equipmentId: 1, // CNC-04
    assignedToId: 3, // David Kim
    frequencyDays: 30,
    nextDueDate: '2026-10-05',
    status: 'SCHEDULED',
    tasks: ['Inspect spindle bearing oil mist pressure', 'Clean telescopic way covers', 'Measure backlash on X/Y ball screws'],
  },
  {
    id: 2,
    planCode: 'PM-HYD-OIL-Q',
    title: 'Quarterly Hydraulic Fluid Sampling & Filter Replacement',
    equipmentId: 2, // HP-200
    assignedToId: 4, // Carlos Mendoza
    frequencyDays: 90,
    nextDueDate: '2026-09-30',
    status: 'DUE',
    tasks: ['Sample hydraulic reservoir oil for ISO particle count', 'Replace 10-micron return line filter', 'Check accumulator pre-charge pressure'],
  },
  {
    id: 3,
    planCode: 'PM-CONV-BELT-M',
    title: 'Monthly Sorter Conveyor Drive Belt Tension & Tracking',
    equipmentId: 3, // CV-02
    assignedToId: 5, // Ananya Patel
    frequencyDays: 30,
    nextDueDate: '2026-09-28',
    status: 'OVERDUE',
    tasks: ['Measure belt deflection with acoustic gauge', 'Clean optical photo eyes', 'Grease head and tail pulley pillow blocks'],
  },
  {
    id: 4,
    planCode: 'PM-CHILL-ANNUAL',
    title: 'Annual Chiller Evaporator Tube Eddy Current Inspection',
    equipmentId: 4, // CH-01
    assignedToId: 3, // David Kim
    frequencyDays: 365,
    nextDueDate: '2026-11-15',
    status: 'SCHEDULED',
    tasks: ['Eddy current test copper condenser tubes', 'Calibrate pressure transducers', 'Acid clean water box heads'],
  },
];

export const PMSchedulesPage: React.FC = () => {
  const [schedules, setSchedules] = useState<PMScheduleRecord[]>(SEED_PM_SCHEDULES);
  const allEquipment = equipmentService.getAll();
  const eqMap = new Map(allEquipment.map(e => [e.id, e]));
  const allEmployees = workforceService.getAll();
  const empMap = new Map(allEmployees.map(e => [e.id, e]));

  const handleMarkDone = (id: number) => {
    setSchedules(prev =>
      prev.map(s => (s.id === id ? { ...s, status: 'COMPLETED' } : s))
    );
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
              Preventive Maintenance (PM) Module
            </h1>
            <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400">
              Extension Module Installed
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Time & condition-based recurring maintenance plans referencing Shared Equipment and Shared Workforce records.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500">Compliance Rate: <strong className="text-emerald-600">92.4%</strong></span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {schedules.map(item => {
          const eq = eqMap.get(item.equipmentId);
          const tech = empMap.get(item.assignedToId);

          return (
            <div
              key={item.id}
              className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs p-5 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <span className="font-mono text-xs font-bold text-slate-400">{item.planCode}</span>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">{item.title}</h3>
                  </div>
                  <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                    item.status === 'OVERDUE'
                      ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300 animate-pulse'
                      : item.status === 'DUE'
                      ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                      : item.status === 'COMPLETED'
                      ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                      : 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300'
                  }`}>
                    {item.status}
                  </span>
                </div>

                <div className="my-3 space-y-1 text-xs text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                  <div className="flex justify-between">
                    <span>Target Machine:</span>
                    <strong className="text-slate-800 dark:text-slate-200">{eq?.equipmentNumber} ({eq?.name})</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Assigned Lead:</span>
                    <span className="text-slate-800 dark:text-slate-200">{tech?.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Next Due Date:</span>
                    <span className="font-mono font-bold text-slate-900 dark:text-white">{item.nextDueDate}</span>
                  </div>
                </div>

                <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300 mb-4">
                  <span className="font-semibold text-slate-700 dark:text-slate-300 text-[11px] uppercase tracking-wider block">
                    Checklist Tasks:
                  </span>
                  {item.tasks.map((task, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-teal-500" />
                      <span>{task}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <span className="text-xs text-slate-400">Freq: Every {item.frequencyDays} days</span>
                {item.status !== 'COMPLETED' ? (
                  <button
                    onClick={() => handleMarkDone(item.id)}
                    className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-teal-600 hover:bg-teal-700 text-white transition-colors flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" /> Sign-off PM
                  </button>
                ) : (
                  <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" /> Completed & Verified
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
