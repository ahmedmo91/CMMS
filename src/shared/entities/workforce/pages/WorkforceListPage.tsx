import React, { useState } from 'react';
import { workforceService } from '../workforceService.ts';
import { Employee } from '../types.ts';
import { Users, Search, Mail, Phone, ShieldCheck, Clock } from 'lucide-react';

export const WorkforceListPage: React.FC = () => {
  const [employees] = useState<Employee[]>(() => workforceService.getAll());
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = employees.filter(emp => {
    if (!searchTerm.trim()) return true;
    const q = searchTerm.toLowerCase();
    return (
      emp.name.toLowerCase().includes(q) ||
      emp.jobTitle.toLowerCase().includes(q) ||
      emp.department.toLowerCase().includes(q) ||
      emp.employeeNumber.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
              Shared Workforce & Technician Foundation
            </h1>
            <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400">
              Core Platform Entity
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Universal technician and operator directory referenced across Fault Reporting, Corrective Work, and Shift Rosters.
          </p>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search technician name, role, department..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map(emp => (
          <div
            key={emp.id}
            className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center gap-3 mb-3">
                <img src={emp.avatarUrl} alt={emp.name} className="w-12 h-12 rounded-full object-cover shadow-xs" />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-slate-900 dark:text-white">{emp.name}</span>
                    <span className="font-mono text-[10px] text-slate-400">[{emp.employeeNumber}]</span>
                  </div>
                  <div className="text-xs text-indigo-600 dark:text-indigo-400 font-medium">{emp.jobTitle}</div>
                  <div className="text-[11px] text-slate-500">{emp.department}</div>
                </div>
              </div>

              <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Shift Schedule:</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{emp.shift} SHIFT</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Hourly Rate:</span>
                  <span className="font-mono text-slate-800 dark:text-slate-200">${emp.hourlyRate}/hr</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Status:</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">{emp.status}</span>
                </div>
              </div>

              <div className="mt-3">
                <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold block mb-1">
                  Certifications & Skills:
                </span>
                <div className="flex flex-wrap gap-1">
                  {emp.specializations.map(spec => (
                    <span
                      key={spec}
                      className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
                    >
                      {spec}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
              <span className="flex items-center gap-1">
                <Mail className="w-3.5 h-3.5" /> {emp.email.split('@')[0]}
              </span>
              <span className="flex items-center gap-1 font-mono text-[11px]">
                <Phone className="w-3.5 h-3.5" /> {emp.phone}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
