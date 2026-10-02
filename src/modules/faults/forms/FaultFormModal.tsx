import React, { useState, useEffect, useMemo } from 'react';
import { Fault, FaultPriority, FaultSeverity, FailureCategory, FAILURE_CODES } from '../schemas/faultTypes.ts';
import { equipmentService } from '../../../shared/entities/equipment/equipmentService.ts';
import { workforceService } from '../../../shared/entities/workforce/workforceService.ts';
import { useSystemConfig } from '../../../core/configuration/SystemConfigContext.tsx';
import { useAuth } from '../../../core/auth/AuthContext.tsx';
import { X, AlertTriangle, Wrench, Shield, CheckCircle2 } from 'lucide-react';

interface FaultFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<Fault, 'id' | 'faultNumber' | 'timeline'>) => void;
  initialData?: Fault | null;
}

export const FaultFormModal: React.FC<FaultFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
}) => {
  const { currentUser } = useAuth();
  const { config } = useSystemConfig();

  const allEquipment = useMemo(() => equipmentService.getAll(), [isOpen]);
  const allEmployees = useMemo(() => workforceService.getAll(), [isOpen]);
  const technicians = useMemo(() => workforceService.getTechnicians(), [isOpen]);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [equipmentId, setEquipmentId] = useState<number>(1);
  const [reporterId, setReporterId] = useState<number>(1);
  const [assignedTechnicianId, setAssignedTechnicianId] = useState<number | undefined>(undefined);
  const [priority, setPriority] = useState<FaultPriority>('HIGH');
  const [severity, setSeverity] = useState<FaultSeverity>('MAJOR');
  const [failureCode, setFailureCode] = useState<string>(FAILURE_CODES[0].code);
  const [failureCategory, setFailureCategory] = useState<FailureCategory>('MECHANICAL');
  const [downtimeMinutes, setDowntimeMinutes] = useState<number>(60);
  const [repairCost, setRepairCost] = useState<number>(350);
  const [customFieldValues, setCustomFieldValues] = useState<Record<string, any>>({});

  useEffect(() => {
    if (!isOpen) return;

    if (initialData) {
      setTitle(initialData.title);
      setDescription(initialData.description);
      setEquipmentId(initialData.equipmentId);
      setReporterId(initialData.reporterId);
      setAssignedTechnicianId(initialData.assignedTechnicianId);
      setPriority(initialData.priority);
      setSeverity(initialData.severity);
      setFailureCode(initialData.failureCode);
      setFailureCategory(initialData.failureCategory);
      setDowntimeMinutes(initialData.downtimeMinutes || 0);
      setRepairCost(initialData.repairCost || 0);
      setCustomFieldValues(initialData.customFieldValues || {});
    } else {
      setTitle('');
      setDescription('');
      setEquipmentId(allEquipment[0]?.id || 1);
      const matchingEmp = allEmployees.find(e => e.email === currentUser.email);
      setReporterId(matchingEmp?.id || allEmployees[0]?.id || 1);
      setAssignedTechnicianId(technicians[0]?.id);
      setPriority('HIGH');
      setSeverity('MAJOR');
      setFailureCode(FAILURE_CODES[0].code);
      setFailureCategory('MECHANICAL');
      setDowntimeMinutes(30);
      setRepairCost(250);
      setCustomFieldValues({});
    }
  }, [initialData, isOpen, currentUser.email]);

  const handleFailureCodeChange = (code: string) => {
    setFailureCode(code);
    const found = FAILURE_CODES.find(fc => fc.code === code);
    if (found) {
      setFailureCategory(found.category);
      setSeverity(found.defaultSeverity);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      alert('Please fill out Title and Description.');
      return;
    }

    onSubmit({
      title,
      description,
      equipmentId: Number(equipmentId),
      reporterId: Number(reporterId),
      assignedTechnicianId: assignedTechnicianId ? Number(assignedTechnicianId) : undefined,
      priority,
      severity,
      status: initialData ? initialData.status : 'REPORTED',
      failureCode,
      failureCategory,
      downtimeMinutes: Number(downtimeMinutes),
      repairCost: Number(repairCost),
      reportedAt: initialData?.reportedAt || new Date().toISOString().replace('T', ' ').substring(0, 19),
      customFieldValues,
    });

    onClose();
  };

  if (!isOpen) return null;

  const selectedEquipment = allEquipment.find(e => e.id === Number(equipmentId));
  const activeCustomFields = config.customFields.filter(f => f.active);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-3xl overflow-hidden my-8">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-slate-900 dark:text-white">
                {initialData ? `Edit Fault: ${initialData.faultNumber}` : 'Record Maintenance Fault'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Capture abnormal operational condition, failure code, and impact metrics
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[78vh] overflow-y-auto">
          {/* Fault Title */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
              Fault Summary / Title *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Spindle bearing abnormal noise and vibration under load"
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-white"
            />
          </div>

          {/* Equipment & Failure Code Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Equipment Selector (Shared Foundation) */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                Affected Plant Equipment *
              </label>
              <select
                value={equipmentId}
                onChange={e => setEquipmentId(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs font-medium bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-white"
              >
                {allEquipment.map(eq => (
                  <option key={eq.id} value={eq.id}>
                    [{eq.equipmentNumber}] {eq.name} ({eq.location.split(' - ')[0]})
                  </option>
                ))}
              </select>
              {selectedEquipment && (
                <div className="mt-1.5 text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-2">
                  <span>Criticality: <strong>{selectedEquipment.criticality}</strong></span>
                  <span>&bull;</span>
                  <span>Location: {selectedEquipment.location}</span>
                </div>
              )}
            </div>

            {/* Failure Code */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                Failure Code & Classification *
              </label>
              <select
                value={failureCode}
                onChange={e => handleFailureCodeChange(e.target.value)}
                className="w-full px-3 py-2 text-xs font-medium bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-white"
              >
                {FAILURE_CODES.map(fc => (
                  <option key={fc.code} value={fc.code}>
                    {fc.code} - {fc.name}
                  </option>
                ))}
              </select>
              <div className="mt-1.5 text-[11px] text-slate-500 dark:text-slate-400">
                Discipline Category: <strong className="text-indigo-600 dark:text-indigo-400">{failureCategory}</strong>
              </div>
            </div>
          </div>

          {/* Priority & Severity Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                Priority
              </label>
              <select
                value={priority}
                onChange={e => setPriority(e.target.value as FaultPriority)}
                className="w-full px-3 py-2 text-xs font-semibold bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-white"
              >
                <option value="CRITICAL">CRITICAL (Asset Down)</option>
                <option value="HIGH">HIGH (Degraded Output)</option>
                <option value="MEDIUM">MEDIUM (Scheduled Attention)</option>
                <option value="LOW">LOW (Cosmetic / Minor)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                Severity
              </label>
              <select
                value={severity}
                onChange={e => setSeverity(e.target.value as FaultSeverity)}
                className="w-full px-3 py-2 text-xs font-semibold bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-white"
              >
                <option value="CATASTROPHIC">CATASTROPHIC</option>
                <option value="CRITICAL">CRITICAL</option>
                <option value="MAJOR">MAJOR</option>
                <option value="MINOR">MINOR</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                Est. Downtime (Mins)
              </label>
              <input
                type="number"
                min="0"
                value={downtimeMinutes}
                onChange={e => setDowntimeMinutes(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                Est. Cost ($ USD)
              </label>
              <input
                type="number"
                min="0"
                value={repairCost}
                onChange={e => setRepairCost(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
              />
            </div>
          </div>

          {/* Reporter & Assigned Technician (Shared Workforce Foundation) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                Reported By (Workforce Record)
              </label>
              <select
                value={reporterId}
                onChange={e => setReporterId(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
              >
                {allEmployees.map(emp => (
                  <option key={emp.id} value={emp.id}>
                    {emp.name} ({emp.jobTitle})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                Assign Certified Technician
              </label>
              <select
                value={assignedTechnicianId || ''}
                onChange={e => setAssignedTechnicianId(e.target.value ? Number(e.target.value) : undefined)}
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
              >
                <option value="">-- Unassigned (Pool) --</option>
                {technicians.map(t => (
                  <option key={t.id} value={t.id}>
                    {t.name} &bull; {t.jobTitle}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Fault Detailed Description */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
              Detailed Description & Symptoms *
            </label>
            <textarea
              required
              rows={3}
              placeholder="Describe physical signs, alarm codes, operating state, sensor indications..."
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-white resize-none"
            />
          </div>

          {/* Dynamic Custom Fields Section (Configured by Admins via System Settings) */}
          {activeCustomFields.length > 0 && (
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-1.5 mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                  Dynamic Module Attributes
                </span>
                <span className="text-[10px] text-slate-400">(Configured in Fault Form Builder)</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {activeCustomFields.map(field => {
                  const val = customFieldValues[field.name];

                  if (field.type === 'SELECT') {
                    return (
                      <div key={field.id}>
                        <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                          {field.label} {field.required && '*'}
                        </label>
                        <select
                          value={val || ''}
                          onChange={e =>
                            setCustomFieldValues(prev => ({ ...prev, [field.name]: e.target.value }))
                          }
                          className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                        >
                          <option value="">-- Select Option --</option>
                          {field.options?.map(opt => (
                            <option key={opt} value={opt}>
                              {opt}
                            </option>
                          ))}
                        </select>
                      </div>
                    );
                  }

                  if (field.type === 'BOOLEAN') {
                    return (
                      <div key={field.id} className="flex items-center gap-2 pt-5">
                        <input
                          type="checkbox"
                          id={field.id}
                          checked={!!val}
                          onChange={e =>
                            setCustomFieldValues(prev => ({ ...prev, [field.name]: e.target.checked }))
                          }
                          className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
                        />
                        <label htmlFor={field.id} className="text-xs font-medium text-slate-700 dark:text-slate-300">
                          {field.label}
                        </label>
                      </div>
                    );
                  }

                  if (field.type === 'NUMBER') {
                    return (
                      <div key={field.id}>
                        <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                          {field.label} {field.required && '*'}
                        </label>
                        <input
                          type="number"
                          step="any"
                          value={val ?? ''}
                          onChange={e =>
                            setCustomFieldValues(prev => ({
                              ...prev,
                              [field.name]: e.target.value ? Number(e.target.value) : '',
                            }))
                          }
                          className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                        />
                      </div>
                    );
                  }

                  return (
                    <div key={field.id}>
                      <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                        {field.label} {field.required && '*'}
                      </label>
                      <input
                        type="text"
                        value={val || ''}
                        onChange={e =>
                          setCustomFieldValues(prev => ({ ...prev, [field.name]: e.target.value }))
                        }
                        className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              {initialData ? 'Update Fault Ticket' : 'Save & Dispatch Fault'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
