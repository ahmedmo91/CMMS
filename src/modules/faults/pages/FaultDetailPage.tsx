import React, { useState } from 'react';
import { Fault, FaultStatus } from '../schemas/faultTypes.ts';
import { faultService } from '../services/faultService.ts';
import { equipmentService } from '../../../shared/entities/equipment/equipmentService.ts';
import { workforceService } from '../../../shared/entities/workforce/workforceService.ts';
import { useAuth } from '../../../core/auth/AuthContext.tsx';
import { useSystemConfig } from '../../../core/configuration/SystemConfigContext.tsx';
import {
  ArrowLeft,
  AlertTriangle,
  Clock,
  CheckCircle2,
  Cpu,
  User,
  Wrench,
  DollarSign,
  Calendar,
  Layers,
  ChevronRight,
  Shield,
  FileText,
  Activity,
  Check,
} from 'lucide-react';

interface FaultDetailPageProps {
  faultId: number;
  onBack: () => void;
  onEdit: (fault: Fault) => void;
}

export const FaultDetailPage: React.FC<FaultDetailPageProps> = ({ faultId, onBack, onEdit }) => {
  const { currentUser, hasPermission } = useAuth();
  const { config } = useSystemConfig();

  const [fault, setFault] = useState<Fault | undefined>(() => faultService.getById(faultId));
  const [isResolveModalOpen, setIsResolveModalOpen] = useState(false);
  const [rootCauseInput, setRootCauseInput] = useState('');
  const [correctiveActionInput, setCorrectiveActionInput] = useState('');
  const [recommendationInput, setRecommendationInput] = useState('');
  const [downtimeInput, setDowntimeInput] = useState(fault?.downtimeMinutes || 60);
  const [costInput, setCostInput] = useState(fault?.repairCost || 250);

  if (!fault) {
    return (
      <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
        <AlertTriangle className="w-10 h-10 text-amber-500 mx-auto mb-2" />
        <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">Fault Record Not Found</h3>
        <button onClick={onBack} className="mt-4 px-4 py-2 text-xs font-semibold bg-indigo-600 text-white rounded-xl">
          Return to Fault Log
        </button>
      </div>
    );
  }

  const equipment = equipmentService.getById(fault.equipmentId);
  const reporter = workforceService.getById(fault.reporterId);
  const technician = fault.assignedTechnicianId ? workforceService.getById(fault.assignedTechnicianId) : null;

  const handleStatusChange = (newStatus: FaultStatus, notes?: string) => {
    const updated = faultService.updateStatus(fault.id, newStatus, currentUser, notes);
    if (updated) setFault({ ...updated });
  };

  const handleResolveSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = faultService.updateStatus(
      fault.id,
      'RESOLVED',
      currentUser,
      `Resolved with root cause: ${rootCauseInput.slice(0, 50)}...`,
      {
        rootCause: rootCauseInput,
        correctiveAction: correctiveActionInput,
        downtimeMinutes: Number(downtimeInput),
        repairCost: Number(costInput),
      }
    );
    if (updated) {
      setFault({ ...updated });
      setIsResolveModalOpen(false);
    }
  };

  const canEdit = hasPermission('faults.edit');
  const canResolve = hasPermission('faults.resolve');

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'CRITICAL':
        return 'bg-rose-100 text-rose-700 dark:bg-rose-950/70 dark:text-rose-300 border-rose-200 dark:border-rose-900';
      case 'HIGH':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-950/70 dark:text-amber-300 border-amber-200 dark:border-amber-900';
      case 'MEDIUM':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-950/70 dark:text-blue-300 border-blue-200 dark:border-blue-900';
      default:
        return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'REPORTED':
        return 'bg-rose-50 text-rose-600 border-rose-200 dark:bg-rose-950/40 dark:text-rose-400 dark:border-rose-800';
      case 'IN_PROGRESS':
        return 'bg-amber-50 text-amber-600 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-800';
      case 'PENDING_PARTS':
        return 'bg-purple-50 text-purple-600 border-purple-200 dark:bg-purple-950/40 dark:text-purple-400 dark:border-purple-800';
      case 'RESOLVED':
        return 'bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800';
      case 'CLOSED':
        return 'bg-slate-100 text-slate-700 border-slate-300 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700';
      default:
        return 'bg-slate-100 text-slate-700';
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Bar / Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Fault Log
        </button>

        {/* Workflow Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {canEdit && (
            <button
              onClick={() => onEdit(fault)}
              className="px-3.5 py-1.5 text-xs font-semibold rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors"
            >
              Edit Details
            </button>
          )}

          {fault.status === 'REPORTED' && canResolve && (
            <button
              onClick={() => handleStatusChange('IN_PROGRESS', 'Work initiated by technician')}
              className="px-4 py-1.5 text-xs font-semibold rounded-xl bg-amber-600 hover:bg-amber-700 text-white transition-colors flex items-center gap-1.5 shadow-xs"
            >
              <Wrench className="w-3.5 h-3.5" /> Start Repair
            </button>
          )}

          {fault.status === 'IN_PROGRESS' && canResolve && (
            <>
              <button
                onClick={() => handleStatusChange('PENDING_PARTS', 'Awaiting spare part requisition')}
                className="px-3 py-1.5 text-xs font-semibold rounded-xl bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 hover:bg-purple-200 transition-colors"
              >
                Mark Pending Parts
              </button>
              <button
                onClick={() => {
                  setRootCauseInput(fault.rootCause || '');
                  setCorrectiveActionInput(fault.correctiveAction || '');
                  setDowntimeInput(fault.downtimeMinutes || 60);
                  setCostInput(fault.repairCost || 250);
                  setIsResolveModalOpen(true);
                }}
                className="px-4 py-1.5 text-xs font-semibold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white transition-colors flex items-center gap-1.5 shadow-xs"
              >
                <CheckCircle2 className="w-3.5 h-3.5" /> Resolve Fault
              </button>
            </>
          )}

          {fault.status === 'PENDING_PARTS' && canResolve && (
            <button
              onClick={() => handleStatusChange('IN_PROGRESS', 'Parts received, resumed active work')}
              className="px-4 py-1.5 text-xs font-semibold rounded-xl bg-amber-600 hover:bg-amber-700 text-white transition-colors"
            >
              Resume Repair
            </button>
          )}

          {fault.status === 'RESOLVED' && canResolve && (
            <button
              onClick={() => handleStatusChange('CLOSED', 'Verified by supervisor and closed')}
              className="px-4 py-1.5 text-xs font-semibold rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 transition-colors"
            >
              Close Ticket
            </button>
          )}
        </div>
      </div>

      {/* Header Banner */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span className="font-mono text-xs font-bold text-slate-500 tracking-wider">
            {fault.faultNumber}
          </span>
          <span className="text-slate-300 dark:text-slate-700">&bull;</span>
          <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${getPriorityColor(fault.priority)}`}>
            {fault.priority} PRIORITY
          </span>
          <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${getStatusColor(fault.status)}`}>
            STATUS: {fault.status}
          </span>
          <span className="text-xs font-mono font-medium px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
            {fault.failureCode}
          </span>
        </div>

        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          {fault.title}
        </h1>

        <p className="mt-3 text-sm text-slate-600 dark:text-slate-300 leading-relaxed max-w-4xl">
          {fault.description}
        </p>

        {/* Quick KPI stats strip */}
        <div className="mt-6 pt-5 border-t border-slate-100 dark:border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Total Downtime</span>
            <div className="text-lg font-bold text-slate-900 dark:text-white flex items-baseline gap-1 mt-0.5">
              <span>{(fault.downtimeMinutes / 60).toFixed(1)}</span>
              <span className="text-xs font-normal text-slate-500">hours ({fault.downtimeMinutes} min)</span>
            </div>
          </div>
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Repair Cost</span>
            <div className="text-lg font-bold text-slate-900 dark:text-white mt-0.5">
              ${(fault.repairCost || 0).toLocaleString()}
            </div>
          </div>
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Failure Discipline</span>
            <div className="text-sm font-semibold text-indigo-600 dark:text-indigo-400 mt-0.5">
              {fault.failureCategory}
            </div>
          </div>
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Reported Timestamp</span>
            <div className="text-xs font-medium text-slate-700 dark:text-slate-300 mt-0.5">
              {fault.reportedAt}
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Details + Shared Entities */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Investigation Details & Timeline (2 Cols) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Root Cause & Corrective Action */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200 flex items-center gap-2">
              <FileText className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              Root Cause & Corrective Analysis
            </h3>

            <div className="space-y-3 text-sm">
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 block mb-1">
                  Root Cause Identified:
                </span>
                <p className="text-slate-800 dark:text-slate-200 leading-relaxed">
                  {fault.rootCause || <em className="text-slate-400 font-normal">Root cause analysis pending field investigation.</em>}
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 block mb-1">
                  Corrective Action Implemented:
                </span>
                <p className="text-slate-800 dark:text-slate-200 leading-relaxed">
                  {fault.correctiveAction || <em className="text-slate-400 font-normal">Corrective action in progress.</em>}
                </p>
              </div>

              {fault.preventiveRecommendation && (
                <div className="p-3.5 rounded-xl bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/40">
                  <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 block mb-1">
                    Preventive Maintenance Recommendation:
                  </span>
                  <p className="text-slate-800 dark:text-slate-200 leading-relaxed">
                    {fault.preventiveRecommendation}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Dynamic Custom Fields (Configured by Module Builder) */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200 flex items-center gap-2 mb-4">
              <Layers className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              Dynamic Module Attributes
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {config.customFields.map(cf => {
                const val = fault.customFieldValues[cf.name];
                return (
                  <div key={cf.id} className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800 flex justify-between items-center">
                    <span className="font-medium text-slate-500 dark:text-slate-400">{cf.label}:</span>
                    <span className="font-bold text-slate-900 dark:text-white">
                      {val === undefined || val === null || val === ''
                        ? 'N/A'
                        : typeof val === 'boolean'
                        ? val ? 'Yes' : 'No'
                        : String(val)}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Fault Incident Timeline */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200 flex items-center gap-2 mb-4">
              <Activity className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              Event Timeline & Audit Trace
            </h3>

            <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800">
              {fault.timeline.map((item, idx) => (
                <div key={item.id} className="relative">
                  <span className="absolute -left-6 top-1 w-2.5 h-2.5 rounded-full bg-indigo-600 ring-4 ring-white dark:ring-slate-900" />
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-900 dark:text-white">{item.action}</span>
                    <span className="text-slate-400">{item.timestamp}</span>
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    By <strong className="text-slate-700 dark:text-slate-300">{item.userName}</strong>
                  </div>
                  {item.notes && (
                    <p className="mt-1 text-xs text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/60 p-2 rounded-lg border border-slate-100 dark:border-slate-800">
                      {item.notes}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Shared Entities Foundation (Equipment & Workforce) */}
        <div className="space-y-6">
          {/* Shared Equipment Foundation Card */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                  <Cpu className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                    Target Equipment
                  </h3>
                  <p className="text-[11px] text-slate-400">Shared Asset Foundation</p>
                </div>
              </div>
              {equipment && (
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  equipment.status === 'DOWN'
                    ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                    : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                }`}>
                  {equipment.status}
                </span>
              )}
            </div>

            {equipment ? (
              <div className="space-y-3 text-xs">
                <div>
                  <span className="font-mono font-bold text-sm text-slate-900 dark:text-white">
                    {equipment.equipmentNumber}
                  </span>
                  <div className="text-xs text-slate-600 dark:text-slate-300 font-medium">{equipment.name}</div>
                </div>

                <div className="divide-y divide-slate-100 dark:divide-slate-800/80 pt-1">
                  <div className="py-2 flex justify-between">
                    <span className="text-slate-500">Asset ID:</span>
                    <span className="font-mono font-medium text-slate-800 dark:text-slate-200">{equipment.assetId}</span>
                  </div>
                  <div className="py-2 flex justify-between">
                    <span className="text-slate-500">Plant Location:</span>
                    <span className="font-medium text-slate-800 dark:text-slate-200">{equipment.location}</span>
                  </div>
                  <div className="py-2 flex justify-between">
                    <span className="text-slate-500">Type / Classification:</span>
                    <span className="font-medium text-slate-800 dark:text-slate-200">{equipment.type} ({equipment.classification})</span>
                  </div>
                  <div className="py-2 flex justify-between">
                    <span className="text-slate-500">Manufacturer / Model:</span>
                    <span className="font-medium text-slate-800 dark:text-slate-200">{equipment.manufacturer} - {equipment.model}</span>
                  </div>
                  <div className="py-2 flex justify-between">
                    <span className="text-slate-500">Serial Number:</span>
                    <span className="font-mono text-slate-800 dark:text-slate-200">{equipment.serialNumber}</span>
                  </div>
                  <div className="py-2 flex justify-between">
                    <span className="text-slate-500">Asset Criticality:</span>
                    <span className="font-bold text-rose-600 dark:text-rose-400">{equipment.criticality}</span>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-500">No equipment record linked.</p>
            )}
          </div>

          {/* Shared Workforce / Technician Foundation Card */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 rounded-lg bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 flex items-center justify-center">
                <User className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                  Workforce & Assignment
                </h3>
                <p className="text-[11px] text-slate-400">Shared Technician Foundation</p>
              </div>
            </div>

            <div className="space-y-4 text-xs">
              {/* Assigned Technician */}
              <div className="p-3.5 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-2">
                  Assigned Lead Technician
                </span>
                {technician ? (
                  <div className="flex items-center gap-3">
                    <img src={technician.avatarUrl} alt={technician.name} className="w-9 h-9 rounded-full object-cover" />
                    <div>
                      <div className="font-bold text-slate-900 dark:text-white">{technician.name}</div>
                      <div className="text-[11px] text-slate-500">{technician.jobTitle}</div>
                      <div className="text-[10px] text-slate-400 mt-0.5">{technician.email}</div>
                    </div>
                  </div>
                ) : (
                  <span className="text-slate-400 italic">No technician assigned yet.</span>
                )}
              </div>

              {/* Reporter */}
              <div className="p-3.5 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-2">
                  Reported By (Operator / Tech)
                </span>
                {reporter ? (
                  <div className="flex items-center gap-3">
                    <img src={reporter.avatarUrl} alt={reporter.name} className="w-9 h-9 rounded-full object-cover" />
                    <div>
                      <div className="font-bold text-slate-900 dark:text-white">{reporter.name}</div>
                      <div className="text-[11px] text-slate-500">{reporter.jobTitle}</div>
                    </div>
                  </div>
                ) : (
                  <span className="text-slate-400 italic">Reporter record unavailable.</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Resolution Dialog Modal */}
      {isResolveModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-lg p-6 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Record Fault Resolution</h3>
              </div>
              <button onClick={() => setIsResolveModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                &times;
              </button>
            </div>

            <form onSubmit={handleResolveSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold uppercase text-slate-700 dark:text-slate-300 mb-1">
                  Root Cause Identified *
                </label>
                <textarea
                  required
                  rows={2}
                  value={rootCauseInput}
                  onChange={e => setRootCauseInput(e.target.value)}
                  placeholder="e.g. Micro-pitting on bearing inner race due to contaminated lubricant"
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-semibold uppercase text-slate-700 dark:text-slate-300 mb-1">
                  Corrective Action Performed *
                </label>
                <textarea
                  required
                  rows={2}
                  value={correctiveActionInput}
                  onChange={e => setCorrectiveActionInput(e.target.value)}
                  placeholder="e.g. Replaced bearing assembly, flushed lubricant lines, re-greased with Mobil Polyrex EM"
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold uppercase text-slate-700 dark:text-slate-300 mb-1">
                    Total Downtime (Mins)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={downtimeInput}
                    onChange={e => setDowntimeInput(Number(e.target.value))}
                    className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block font-semibold uppercase text-slate-700 dark:text-slate-300 mb-1">
                    Direct Repair Cost ($)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={costInput}
                    onChange={e => setCostInput(Number(e.target.value))}
                    className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsResolveModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 bg-slate-100 dark:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-white bg-emerald-600 hover:bg-emerald-700 font-semibold"
                >
                  Complete Resolution
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
