import React, { useState } from 'react';
import { useSystemConfig } from '../SystemConfigContext.tsx';
import { MODULE_REGISTRY } from '../../modules/registry.ts';
import { useAuth } from '../../auth/AuthContext.tsx';
import {
  Layers,
  CheckCircle2,
  Shield,
  Sliders,
  Settings,
  Database,
  Building,
  RotateCcw,
  Info,
  ToggleLeft,
  ToggleRight,
} from 'lucide-react';

export const SystemConfigPage: React.FC = () => {
  const { config, isModuleEnabled, toggleModule, updatePlantSettings } = useSystemConfig();
  const { currentUser, hasPermission } = useAuth();

  const [plantName, setPlantName] = useState(config.plantName);
  const [siteCode, setSiteCode] = useState(config.siteCode);
  const [currency, setCurrency] = useState(config.currency);
  const [timezone, setTimezone] = useState(config.timezone);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const canManageModules = hasPermission('core.manage_modules');
  const canManageSettings = hasPermission('core.manage_settings');

  const handleSavePlantSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updatePlantSettings({ plantName, siteCode, currency, timezone });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
              System Configuration & Module Architecture
            </h1>
            <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400">
              Platform Administration
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Enable/disable modules dynamically, manage organization-level default dashboards, and configure plant parameters.
          </p>
        </div>
      </div>

      {saveSuccess && (
        <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 rounded-xl flex items-center gap-2 text-xs font-semibold text-emerald-800 dark:text-emerald-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          System configuration successfully updated.
        </div>
      )}

      {/* Module Enable / Disable Manager (Requirement 8) */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Modular Subsystems Registry</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Toggle modules to instantly enable or hide navigation items and dashboard widgets without data loss.
              </p>
            </div>
          </div>

          <span className="text-xs text-slate-400 font-mono">
            {MODULE_REGISTRY.filter(m => isModuleEnabled(m.id)).length} Active Modules
          </span>
        </div>

        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {MODULE_REGISTRY.map(module => {
            const enabled = isModuleEnabled(module.id);
            const isCore = module.isCore;

            return (
              <div key={module.id} className="py-4 flex items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-slate-900 dark:text-white">{module.name}</span>
                    <span className="font-mono text-[10px] text-slate-400">v{module.version}</span>
                    {isCore && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                        CORE PLATFORM MODULE
                      </span>
                    )}
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      enabled
                        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                        : 'bg-slate-100 text-slate-500'
                    }`}>
                      {enabled ? 'ENABLED' : 'DISABLED'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
                    {module.description}
                  </p>
                  <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-2">
                    <span>Navigation Items: {module.navigation.length}</span>
                    <span>&bull;</span>
                    <span>Dashboard Widgets: {module.dashboardWidgets.length}</span>
                    <span>&bull;</span>
                    <span>Reports: {module.reportTypes?.length || 0}</span>
                  </div>
                </div>

                <div className="shrink-0">
                  {isCore ? (
                    <span className="text-xs font-semibold text-slate-400 italic">Required Core</span>
                  ) : canManageModules ? (
                    <button
                      onClick={() => toggleModule(module.id, !enabled, currentUser)}
                      className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                        enabled
                          ? 'bg-rose-50 text-rose-600 hover:bg-rose-100 dark:bg-rose-950/40 dark:text-rose-400'
                          : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-xs'
                      }`}
                    >
                      {enabled ? 'Disable Module' : 'Enable Module'}
                    </button>
                  ) : (
                    <span className="text-xs text-slate-400">Admin Only</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Organization-Level Default Dashboard Layout (Requirement 7) */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="w-8 h-8 rounded-lg bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 flex items-center justify-center">
            <Sliders className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Organization-Level Default Dashboard</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Default widgets and layout automatically assigned to new users until customized.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
          {config.organizationDefaultWidgets.map(w => (
            <div key={w.widgetId} className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-100 dark:border-slate-800 flex justify-between items-center">
              <div>
                <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{w.widgetId}</span>
                <div className="text-[11px] text-slate-400">Span: {w.width} cols &bull; Visible: {w.visible ? 'Yes' : 'No'}</div>
              </div>
              {w.isMandatory && (
                <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                  Mandatory Lock
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Plant Site Parameters */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
            <Building className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Plant Site Configuration</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Facility parameters, currency symbol, and regional timezone</p>
          </div>
        </div>

        <form onSubmit={handleSavePlantSettings} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Plant Facility Name
              </label>
              <input
                type="text"
                value={plantName}
                onChange={e => setPlantName(e.target.value)}
                disabled={!canManageSettings}
                className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Site Code
              </label>
              <input
                type="text"
                value={siteCode}
                onChange={e => setSiteCode(e.target.value)}
                disabled={!canManageSettings}
                className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-mono"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Currency
              </label>
              <input
                type="text"
                value={currency}
                onChange={e => setCurrency(e.target.value)}
                disabled={!canManageSettings}
                className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Timezone
              </label>
              <input
                type="text"
                value={timezone}
                onChange={e => setTimezone(e.target.value)}
                disabled={!canManageSettings}
                className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
              />
            </div>
          </div>

          {canManageSettings && (
            <div className="flex justify-end pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                type="submit"
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs transition-colors"
              >
                Save Site Parameters
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};
