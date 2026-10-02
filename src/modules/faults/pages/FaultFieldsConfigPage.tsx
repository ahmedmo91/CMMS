import React, { useState } from 'react';
import { useSystemConfig, CustomFieldDefinition } from '../../../core/configuration/SystemConfigContext.tsx';
import { useAuth } from '../../../core/auth/AuthContext.tsx';
import { Sliders, Plus, Trash2, CheckCircle2, ShieldAlert } from 'lucide-react';

export const FaultFieldsConfigPage: React.FC = () => {
  const { config, addCustomField, updateCustomField, deleteCustomField } = useSystemConfig();
  const { hasPermission } = useAuth();

  const [label, setLabel] = useState('');
  const [name, setName] = useState('');
  const [type, setType] = useState<CustomFieldDefinition['type']>('TEXT');
  const [required, setRequired] = useState(false);
  const [optionsStr, setOptionsStr] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const canConfigure = hasPermission('faults.configure_fields');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!label.trim()) return;

    const autoName = name.trim() || label.toLowerCase().replace(/[^a-z0-9]/g, '_');
    const options = type === 'SELECT' ? optionsStr.split(',').map(s => s.trim()).filter(Boolean) : undefined;

    addCustomField({
      moduleId: 'faults',
      name: autoName,
      label,
      type,
      required,
      options,
      orderIndex: config.customFields.length + 1,
      active: true,
    });

    setLabel('');
    setName('');
    setType('TEXT');
    setRequired(false);
    setOptionsStr('');
    setIsAdding(false);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
              Dynamic Fault Form Builder
            </h1>
            <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
              Module Extensibility
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Configure dynamic custom data fields for fault tickets without changing the core platform schema.
          </p>
        </div>

        {canConfigure && !isAdding && (
          <button
            onClick={() => setIsAdding(true)}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs transition-colors flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            Add Custom Field
          </button>
        )}
      </div>

      {!canConfigure && (
        <div className="p-4 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 rounded-xl flex items-center gap-2 text-xs text-amber-800 dark:text-amber-200">
          <ShieldAlert className="w-4 h-4 shrink-0" />
          <span>You have read-only access to custom fields. Only System Administrators can add or modify dynamic field definitions.</span>
        </div>
      )}

      {/* Add Form Drawer / Modal */}
      {isAdding && (
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border-2 border-indigo-500 shadow-lg animate-in fade-in duration-150">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4">Define New Dynamic Field</h3>
          <form onSubmit={handleAdd} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Field Display Label *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ambient Temperature at Failure"
                  value={label}
                  onChange={e => setLabel(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Field Type
                </label>
                <select
                  value={type}
                  onChange={e => setType(e.target.value as any)}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                >
                  <option value="TEXT">Short Text</option>
                  <option value="NUMBER">Numeric Value</option>
                  <option value="SELECT">Dropdown Single Select</option>
                  <option value="BOOLEAN">Checkbox (Yes / No)</option>
                  <option value="DATE">Calendar Date</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Database Field Key (optional)
                </label>
                <input
                  type="text"
                  placeholder="ambient_temp_c"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-mono"
                />
              </div>
            </div>

            {type === 'SELECT' && (
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Dropdown Options (comma-separated)
                </label>
                <input
                  type="text"
                  placeholder="Low, Moderate, Extreme, Critical"
                  value={optionsStr}
                  onChange={e => setOptionsStr(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                />
              </div>
            )}

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="reqCheck"
                checked={required}
                onChange={e => setRequired(e.target.checked)}
                className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
              />
              <label htmlFor="reqCheck" className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Mark this field as mandatory for all technicians recording faults
              </label>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                className="px-4 py-2 rounded-xl text-slate-600 bg-slate-100 dark:bg-slate-800"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 font-semibold"
              >
                Save Field Definition
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Field List Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200 dark:border-slate-800">
            <tr>
              <th className="py-3.5 px-4">Display Label</th>
              <th className="py-3.5 px-4">Internal Key</th>
              <th className="py-3.5 px-4">Data Type</th>
              <th className="py-3.5 px-4">Required</th>
              <th className="py-3.5 px-4">Status</th>
              {canConfigure && <th className="py-3.5 px-4 text-right">Actions</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
            {config.customFields.map(field => (
              <tr key={field.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                <td className="py-3.5 px-4 font-semibold text-slate-900 dark:text-white">
                  {field.label}
                  {field.options && (
                    <div className="text-[10px] text-slate-400 font-normal">
                      Options: {field.options.join(', ')}
                    </div>
                  )}
                </td>
                <td className="py-3.5 px-4 font-mono text-slate-600 dark:text-slate-400">
                  {field.name}
                </td>
                <td className="py-3.5 px-4">
                  <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-mono text-[11px]">
                    {field.type}
                  </span>
                </td>
                <td className="py-3.5 px-4">
                  {field.required ? (
                    <span className="text-rose-600 dark:text-rose-400 font-bold">Yes</span>
                  ) : (
                    <span className="text-slate-400">Optional</span>
                  )}
                </td>
                <td className="py-3.5 px-4">
                  <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                    field.active
                      ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                      : 'bg-slate-100 text-slate-500'
                  }`}>
                    {field.active ? 'ACTIVE' : 'DISABLED'}
                  </span>
                </td>
                {canConfigure && (
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => deleteCustomField(field.id)}
                      className="p-1 rounded text-slate-400 hover:text-rose-600 transition-colors"
                      title="Delete Field"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
