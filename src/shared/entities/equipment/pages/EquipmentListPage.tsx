import React, { useState } from 'react';
import { equipmentService } from '../equipmentService.ts';
import { Equipment } from '../types.ts';
import { Cpu, Search, MapPin, AlertTriangle, CheckCircle2, Clock, Wrench } from 'lucide-react';

interface EquipmentListPageProps {
  onNavigateToFaults: (equipmentId: number) => void;
}

export const EquipmentListPage: React.FC<EquipmentListPageProps> = ({ onNavigateToFaults }) => {
  const [equipmentList] = useState<Equipment[]>(() => equipmentService.getAll());
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const filtered = equipmentList.filter(eq => {
    if (statusFilter !== 'ALL' && eq.status !== statusFilter) return false;
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      return (
        eq.name.toLowerCase().includes(q) ||
        eq.equipmentNumber.toLowerCase().includes(q) ||
        eq.assetId.toLowerCase().includes(q) ||
        eq.location.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const getStatusBadge = (status: Equipment['status']) => {
    switch (status) {
      case 'DOWN':
        return <span className="inline-flex px-2 py-0.5 rounded text-[11px] font-bold bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300 animate-pulse">DOWN</span>;
      case 'DEGRADED':
        return <span className="inline-flex px-2 py-0.5 rounded text-[11px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">DEGRADED</span>;
      case 'MAINTENANCE':
        return <span className="inline-flex px-2 py-0.5 rounded text-[11px] font-medium bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300">MAINTENANCE</span>;
      case 'OPERATIONAL':
      default:
        return <span className="inline-flex px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">OPERATIONAL</span>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
              Shared Asset & Equipment Foundation
            </h1>
            <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
              Core Platform Entity
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Universal plant asset registry referenced by Fault Management, Preventive Maintenance, and Work Orders.
          </p>
        </div>
      </div>

      {/* Filter / Search Bar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search equipment tag, name, location..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-white"
          />
        </div>

        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto">
          {['ALL', 'OPERATIONAL', 'DEGRADED', 'DOWN', 'MAINTENANCE'].map(st => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                statusFilter === st
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Equipment Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map(eq => (
          <div
            key={eq.id}
            className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs hover:border-slate-300 dark:hover:border-slate-700 transition-all p-5 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-2">
                <div>
                  <span className="font-mono text-xs font-bold text-slate-500">{eq.assetId}</span>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white mt-0.5">
                    {eq.equipmentNumber}
                  </h3>
                </div>
                {getStatusBadge(eq.status)}
              </div>

              <div className="text-xs font-medium text-slate-700 dark:text-slate-300 mb-3">
                {eq.name}
              </div>

              <div className="space-y-1.5 text-xs text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                <div className="flex justify-between">
                  <span>Location:</span>
                  <strong className="text-slate-800 dark:text-slate-200">{eq.location}</strong>
                </div>
                <div className="flex justify-between">
                  <span>Criticality:</span>
                  <strong className={eq.criticality === 'CRITICAL' ? 'text-rose-600 dark:text-rose-400' : 'text-slate-800 dark:text-slate-200'}>
                    {eq.criticality}
                  </strong>
                </div>
                <div className="flex justify-between">
                  <span>Make / Model:</span>
                  <span className="text-slate-700 dark:text-slate-300">{eq.manufacturer} {eq.model}</span>
                </div>
                <div className="flex justify-between">
                  <span>YTD Downtime:</span>
                  <span className="font-mono font-bold text-slate-900 dark:text-white">{eq.downtimeHoursTotal} hrs</span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <span className="text-[11px] text-slate-400">Class: {eq.classification}</span>
              <button
                onClick={() => onNavigateToFaults(eq.id)}
                className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
              >
                View Faults &rarr;
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
