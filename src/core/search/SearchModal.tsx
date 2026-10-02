import React, { useState, useEffect } from 'react';
import { faultService } from '../../modules/faults/services/faultService.ts';
import { equipmentService } from '../../shared/entities/equipment/equipmentService.ts';
import { workforceService } from '../../shared/entities/workforce/workforceService.ts';
import { Search, X, AlertTriangle, Cpu, User, ArrowRight, CornerDownLeft } from 'lucide-react';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (path: string) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose, onNavigate }) => {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        // toggle modal handled in parent
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const faults = faultService.getAll();
  const equipment = equipmentService.getAll();
  const employees = workforceService.getAll();

  const q = query.trim().toLowerCase();

  const matchedFaults = q
    ? faults.filter(
        f =>
          f.faultNumber.toLowerCase().includes(q) ||
          f.title.toLowerCase().includes(q) ||
          f.failureCode.toLowerCase().includes(q)
      ).slice(0, 4)
    : [];

  const matchedEquipment = q
    ? equipment.filter(
        e =>
          e.name.toLowerCase().includes(q) ||
          e.equipmentNumber.toLowerCase().includes(q) ||
          e.location.toLowerCase().includes(q)
      ).slice(0, 4)
    : [];

  const matchedEmployees = q
    ? employees.filter(
        emp =>
          emp.name.toLowerCase().includes(q) ||
          emp.jobTitle.toLowerCase().includes(q) ||
          emp.employeeNumber.toLowerCase().includes(q)
      ).slice(0, 3)
    : [];

  const adminMatches = q && (q.includes('user') || q.includes('role') || q.includes('pass') || q.includes('admin') || q.includes('config') || q.includes('audit')) ? [
    { title: 'User Management & Roles', path: '/admin/users', desc: 'Create/delete users, set passwords and roles' },
    { title: 'System Configuration', path: '/admin/config', desc: 'Manage modular platform extensions' },
    { title: 'Platform Audit Trail', path: '/admin/audit', desc: 'View tamper-evident security logs' },
  ].filter(a => a.title.toLowerCase().includes(q) || a.desc.toLowerCase().includes(q) || 'user management'.includes(q)) : [];

  const handleSelect = (path: string) => {
    onNavigate(path);
    onClose();
    setQuery('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-2xl overflow-hidden flex flex-col">
        {/* Search Input Bar */}
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center gap-3">
          <Search className="w-5 h-5 text-slate-400" />
          <input
            autoFocus
            type="text"
            placeholder="Search faults, machines, technicians, or actions... (Esc to close)"
            value={query}
            onChange={e => setQuery(e.target.value)}
            className="w-full text-sm bg-transparent border-none focus:outline-hidden text-slate-900 dark:text-white placeholder:text-slate-400"
          />
          <button onClick={onClose} className="p-1 rounded text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results Area */}
        <div className="p-4 max-h-[60vh] overflow-y-auto space-y-4 text-xs">
          {!q && (
            <div className="text-center py-8 text-slate-400">
              <p className="font-medium text-slate-600 dark:text-slate-300">Quick Global Search</p>
              <p className="text-[11px] text-slate-400 mt-1">
                Type an asset tag (e.g. "CNC-04"), fault number ("FLT-2026"), technician name, or failure code.
              </p>
            </div>
          )}

          {/* Quick Admin Actions */}
          {adminMatches.length > 0 && (
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-500 block mb-2">
                Administration & Settings ({adminMatches.length})
              </span>
              <div className="space-y-1">
                {adminMatches.map(a => (
                  <div
                    key={a.path}
                    onClick={() => handleSelect(a.path)}
                    className="p-2.5 rounded-xl bg-indigo-50/50 dark:bg-indigo-950/30 hover:bg-indigo-100/70 dark:hover:bg-indigo-900/50 cursor-pointer flex items-center justify-between"
                  >
                    <div>
                      <span className="font-bold text-slate-900 dark:text-white mr-2">{a.title}</span>
                      <span className="text-slate-500">{a.desc}</span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-indigo-500" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Faults Results */}
          {matchedFaults.length > 0 && (
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
                Fault Tickets ({matchedFaults.length})
              </span>
              <div className="space-y-1">
                {matchedFaults.map(f => (
                  <div
                    key={f.id}
                    onClick={() => handleSelect(`/maintenance/faults/${f.id}`)}
                    className="p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2.5">
                      <AlertTriangle className="w-4 h-4 text-rose-500" />
                      <div>
                        <span className="font-mono font-bold text-slate-900 dark:text-white mr-2">
                          {f.faultNumber}
                        </span>
                        <span className="text-slate-700 dark:text-slate-300">{f.title}</span>
                      </div>
                    </div>
                    <span className="font-mono text-[10px] text-slate-400">{f.status}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Equipment Results */}
          {matchedEquipment.length > 0 && (
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
                Equipment & Assets ({matchedEquipment.length})
              </span>
              <div className="space-y-1">
                {matchedEquipment.map(e => (
                  <div
                    key={e.id}
                    onClick={() => handleSelect(`/assets/equipment`)}
                    className="p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2.5">
                      <Cpu className="w-4 h-4 text-blue-500" />
                      <div>
                        <span className="font-bold text-slate-900 dark:text-white mr-2">
                          {e.equipmentNumber}
                        </span>
                        <span className="text-slate-700 dark:text-slate-300">{e.name}</span>
                      </div>
                    </div>
                    <span className="text-slate-400">{e.location}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Workforce Results */}
          {matchedEmployees.length > 0 && (
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
                Workforce Records ({matchedEmployees.length})
              </span>
              <div className="space-y-1">
                {matchedEmployees.map(emp => (
                  <div
                    key={emp.id}
                    onClick={() => handleSelect(`/workforce/employees`)}
                    className="p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2.5">
                      <User className="w-4 h-4 text-teal-500" />
                      <div>
                        <span className="font-bold text-slate-900 dark:text-white mr-2">
                          {emp.name}
                        </span>
                        <span className="text-slate-500">{emp.jobTitle}</span>
                      </div>
                    </div>
                    <span className="font-mono text-slate-400">{emp.employeeNumber}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {q && matchedFaults.length === 0 && matchedEquipment.length === 0 && matchedEmployees.length === 0 && (
            <div className="text-center py-6 text-slate-400">
              No matching records found for "{query}".
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-50 dark:bg-slate-800/40 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
          <span>Search spans enabled modules & shared foundations</span>
          <span className="flex items-center gap-1 font-mono">
            <span>Press</span> <kbd className="px-1 py-0.5 bg-slate-200 dark:bg-slate-700 rounded text-[10px]">Esc</kbd> <span>to exit</span>
          </span>
        </div>
      </div>
    </div>
  );
};
