import React, { useState, useMemo } from 'react';
import { Fault, FaultPriority, FaultStatus } from '../schemas/faultTypes.ts';
import { faultService } from '../services/faultService.ts';
import { equipmentService } from '../../../shared/entities/equipment/equipmentService.ts';
import { workforceService } from '../../../shared/entities/workforce/workforceService.ts';
import { exportToCsv, exportToJson, printHtmlReport } from '../../../core/reporting/exportUtils.ts';
import { useAuth } from '../../../core/auth/AuthContext.tsx';
import {
  Search,
  Plus,
  Filter,
  Download,
  Printer,
  ChevronRight,
  AlertTriangle,
  Clock,
  CheckCircle2,
  Cpu,
  Layers,
  Sparkles,
} from 'lucide-react';

interface FaultsListPageProps {
  onSelectFault: (id: number) => void;
  onNewFault: () => void;
}

export const FaultsListPage: React.FC<FaultsListPageProps> = ({ onSelectFault, onNewFault }) => {
  const { hasPermission } = useAuth();
  const allEquipment = equipmentService.getAll();
  const eqMap = useMemo(() => new Map(allEquipment.map(e => [e.id, e])), [allEquipment]);
  const techMap = useMemo(() => new Map(workforceService.getAll().map(e => [e.id, e])), []);

  const [faults, setFaults] = useState<Fault[]>(() => faultService.getAll());
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [priorityFilter, setPriorityFilter] = useState<string>('ALL');
  const [equipmentFilter, setEquipmentFilter] = useState<string>('ALL');

  // Filter faults
  const filteredFaults = useMemo(() => {
    return faults.filter(f => {
      if (statusFilter !== 'ALL' && f.status !== statusFilter) return false;
      if (priorityFilter !== 'ALL' && f.priority !== priorityFilter) return false;
      if (equipmentFilter !== 'ALL' && f.equipmentId !== Number(equipmentFilter)) return false;

      if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase();
        const eq = eqMap.get(f.equipmentId);
        const matchesNumber = f.faultNumber.toLowerCase().includes(query);
        const matchesTitle = f.title.toLowerCase().includes(query);
        const matchesCode = f.failureCode.toLowerCase().includes(query);
        const matchesEq = eq ? eq.name.toLowerCase().includes(query) || eq.equipmentNumber.toLowerCase().includes(query) : false;
        return matchesNumber || matchesTitle || matchesCode || matchesEq;
      }

      return true;
    });
  }, [faults, statusFilter, priorityFilter, equipmentFilter, searchTerm, eqMap]);

  const stats = faultService.getStatistics();

  const handleExportCsv = () => {
    exportToCsv(filteredFaults, 'Plant-Fault-Log', [
      { header: 'Fault #', accessor: f => f.faultNumber },
      { header: 'Title', accessor: f => f.title },
      { header: 'Status', accessor: f => f.status },
      { header: 'Priority', accessor: f => f.priority },
      { header: 'Equipment', accessor: f => eqMap.get(f.equipmentId)?.equipmentNumber || '' },
      { header: 'Location', accessor: f => eqMap.get(f.equipmentId)?.location || '' },
      { header: 'Failure Code', accessor: f => f.failureCode },
      { header: 'Downtime (min)', accessor: f => f.downtimeMinutes },
      { header: 'Repair Cost ($)', accessor: f => f.repairCost },
      { header: 'Reported At', accessor: f => f.reportedAt },
    ]);
  };

  const handleExportJson = () => {
    exportToJson(filteredFaults, 'Plant-Fault-Log');
  };

  const handlePrint = () => {
    const headers = ['Fault #', 'Equipment', 'Title', 'Priority', 'Status', 'Downtime (m)', 'Cost ($)'];
    const rows = filteredFaults.map(f => [
      f.faultNumber,
      eqMap.get(f.equipmentId)?.equipmentNumber || 'Asset',
      f.title,
      f.priority,
      f.status,
      f.downtimeMinutes,
      f.repairCost,
    ]);
    printHtmlReport('Plant Fault Incident Log', `Total Records: ${filteredFaults.length}`, headers, rows);
  };

  const getPriorityBadge = (priority: FaultPriority) => {
    switch (priority) {
      case 'CRITICAL':
        return <span className="inline-flex px-2 py-0.5 rounded text-[11px] font-bold bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300">CRITICAL</span>;
      case 'HIGH':
        return <span className="inline-flex px-2 py-0.5 rounded text-[11px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">HIGH</span>;
      case 'MEDIUM':
        return <span className="inline-flex px-2 py-0.5 rounded text-[11px] font-medium bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300">MEDIUM</span>;
      default:
        return <span className="inline-flex px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">LOW</span>;
    }
  };

  const getStatusBadge = (status: FaultStatus) => {
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
        return (
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Resolved
          </span>
        );
      case 'CLOSED':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 dark:text-slate-400">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Closed
          </span>
        );
    }
  };

  const canCreate = hasPermission('faults.create');

  return (
    <div className="space-y-6">
      {/* Top Banner / Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
              Fault Management & Incident Records
            </h1>
            <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
              Module 1.2.0
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Plant maintenance fault tickets, equipment diagnostic codes, and resolution tracking.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Export Dropdown / Actions */}
          <button
            onClick={handleExportCsv}
            title="Export CSV"
            className="px-3 py-2 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" /> CSV
          </button>
          <button
            onClick={handlePrint}
            title="Print Report"
            className="px-3 py-2 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors flex items-center gap-1.5"
          >
            <Printer className="w-3.5 h-3.5" /> Print
          </button>

          {canCreate && (
            <button
              onClick={onNewFault}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs transition-colors flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              Record Maintenance Fault
            </button>
          )}
        </div>
      </div>

      {/* Quick KPI Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Total Logged</span>
          <div className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{stats.total}</div>
        </div>
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-rose-200 dark:border-rose-900/40 shadow-xs">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-rose-500">Open Incidents</span>
          <div className="text-2xl font-bold text-rose-600 dark:text-rose-400 mt-1">{stats.open}</div>
        </div>
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-amber-200 dark:border-amber-900/40 shadow-xs">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-amber-500">In Progress</span>
          <div className="text-2xl font-bold text-amber-600 dark:text-amber-400 mt-1">{stats.inProgress}</div>
        </div>
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Total Downtime</span>
          <div className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{stats.totalDowntimeHours} <span className="text-xs font-normal text-slate-500">hrs</span></div>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by fault number, title, equipment tag, failure code..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-white"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Priority Filter */}
            <select
              value={priorityFilter}
              onChange={e => setPriorityFilter(e.target.value)}
              className="px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-700 dark:text-slate-300"
            >
              <option value="ALL">All Priorities</option>
              <option value="CRITICAL">Critical</option>
              <option value="HIGH">High</option>
              <option value="MEDIUM">Medium</option>
              <option value="LOW">Low</option>
            </select>

            {/* Equipment Filter */}
            <select
              value={equipmentFilter}
              onChange={e => setEquipmentFilter(e.target.value)}
              className="px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-700 dark:text-slate-300 max-w-[200px]"
            >
              <option value="ALL">All Equipment</option>
              {allEquipment.map(eq => (
                <option key={eq.id} value={eq.id}>
                  {eq.equipmentNumber} ({eq.name})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pt-2 border-t border-slate-100 dark:border-slate-800">
          {(['ALL', 'REPORTED', 'IN_PROGRESS', 'PENDING_PARTS', 'RESOLVED', 'CLOSED'] as const).map(st => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                statusFilter === st
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {st === 'ALL' ? 'All Incidents' : st.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Main Fault Records Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="py-3.5 px-4">Fault Ticket #</th>
                <th className="py-3.5 px-4">Equipment & Location</th>
                <th className="py-3.5 px-4">Summary & Failure Code</th>
                <th className="py-3.5 px-4">Priority</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Assigned Tech</th>
                <th className="py-3.5 px-4">Downtime</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
              {filteredFaults.map(fault => {
                const eq = eqMap.get(fault.equipmentId);
                const tech = fault.assignedTechnicianId ? techMap.get(fault.assignedTechnicianId) : null;

                return (
                  <tr
                    key={fault.id}
                    onClick={() => onSelectFault(fault.id)}
                    className="hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer transition-colors"
                  >
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-900 dark:text-white">
                      {fault.faultNumber}
                    </td>

                    <td className="py-3.5 px-4">
                      {eq ? (
                        <div>
                          <span className="font-semibold text-slate-800 dark:text-slate-200">
                            {eq.equipmentNumber}
                          </span>
                          <div className="text-[11px] text-slate-500 truncate max-w-[180px]">{eq.location}</div>
                        </div>
                      ) : (
                        <span className="text-slate-400">Unknown</span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 max-w-xs">
                      <div className="font-medium text-slate-900 dark:text-white truncate">
                        {fault.title}
                      </div>
                      <div className="text-[11px] font-mono text-indigo-600 dark:text-indigo-400">
                        {fault.failureCode}
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      {getPriorityBadge(fault.priority)}
                    </td>

                    <td className="py-3.5 px-4">
                      {getStatusBadge(fault.status)}
                    </td>

                    <td className="py-3.5 px-4">
                      {tech ? (
                        <div className="flex items-center gap-2">
                          <img src={tech.avatarUrl} alt={tech.name} className="w-5 h-5 rounded-full object-cover" />
                          <span className="text-slate-700 dark:text-slate-300 font-medium truncate max-w-[120px]">
                            {tech.name}
                          </span>
                        </div>
                      ) : (
                        <span className="text-slate-400 italic">Unassigned</span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 font-mono text-slate-700 dark:text-slate-300">
                      {fault.downtimeMinutes}m
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={e => {
                          e.stopPropagation();
                          onSelectFault(fault.id);
                        }}
                        className="p-1 rounded text-slate-400 hover:text-indigo-600 transition-colors"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}

              {filteredFaults.length === 0 && (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    No maintenance faults matched your filter criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="p-4 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500 flex items-center justify-between">
          <span>Showing {filteredFaults.length} of {faults.length} total incidents</span>
          <span>ApexCMMS Real-Time Fault Architecture</span>
        </div>
      </div>
    </div>
  );
};
