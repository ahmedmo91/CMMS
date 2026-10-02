import React, { useState } from 'react';
import { DashboardWidgetDefinition } from '../modules/types.ts';
import { MODULE_REGISTRY } from '../modules/registry.ts';
import { useSystemConfig } from '../configuration/SystemConfigContext.tsx';
import { useAuth } from '../auth/AuthContext.tsx';
import { X, Plus, Check, ShieldAlert, Layers } from 'lucide-react';

interface AddWidgetModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeWidgetIds: string[];
  onAddWidget: (widgetId: string) => void;
}

export const AddWidgetModal: React.FC<AddWidgetModalProps> = ({
  isOpen,
  onClose,
  activeWidgetIds,
  onAddWidget,
}) => {
  const { isModuleEnabled } = useSystemConfig();
  const { hasPermission } = useAuth();
  const [selectedModule, setSelectedModule] = useState<string>('all');

  if (!isOpen) return null;

  // Find enabled modules
  const enabledModules = MODULE_REGISTRY.filter(m => isModuleEnabled(m.id));

  // Gather widgets from enabled modules
  const candidateWidgets = enabledModules.flatMap(m =>
    m.dashboardWidgets.map(w => ({
      ...w,
      moduleName: m.name,
    }))
  );

  const filteredWidgets = candidateWidgets.filter(w => {
    if (selectedModule !== 'all' && w.moduleId !== selectedModule) return false;
    return true;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-3xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-slate-900 dark:text-white">Add Widgets to Workspace</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Discover widgets provided by currently enabled system modules</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter Bar */}
        <div className="px-6 py-2.5 bg-slate-50 dark:bg-slate-800/40 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2 overflow-x-auto">
          <button
            onClick={() => setSelectedModule('all')}
            className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${
              selectedModule === 'all'
                ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            All Modules ({candidateWidgets.length})
          </button>
          {enabledModules.map(m => (
            <button
              key={m.id}
              onClick={() => setSelectedModule(m.id)}
              className={`px-3 py-1 rounded-md text-xs font-medium transition-all whitespace-nowrap ${
                selectedModule === m.id
                  ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              {m.name} ({m.dashboardWidgets.length})
            </button>
          ))}
        </div>

        {/* Widget Grid */}
        <div className="p-6 overflow-y-auto space-y-3">
          {filteredWidgets.map(widget => {
            const isAdded = activeWidgetIds.includes(widget.id);
            const userCanAccess = widget.requiredPermission ? hasPermission(widget.requiredPermission) : true;

            return (
              <div
                key={widget.id}
                className={`p-4 rounded-xl border transition-all flex items-start justify-between gap-4 ${
                  !userCanAccess
                    ? 'border-slate-200 dark:border-slate-800 opacity-60 bg-slate-50 dark:bg-slate-900/40'
                    : isAdded
                    ? 'border-indigo-200 dark:border-indigo-900/50 bg-indigo-50/30 dark:bg-indigo-950/20'
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-900 shadow-xs'
                }`}
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                      {widget.moduleName}
                    </span>
                    <span className="text-xs font-medium text-slate-400">
                      Span: {widget.defaultWidth} {widget.defaultWidth === 1 ? 'col' : 'cols'}
                    </span>
                    {!userCanAccess && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-medium text-amber-600 dark:text-amber-400">
                        <ShieldAlert className="w-3 h-3" />
                        Requires Permission: {widget.requiredPermission}
                      </span>
                    )}
                  </div>
                  <h4 className="text-sm font-semibold text-slate-900 dark:text-white mt-1.5">{widget.name}</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{widget.description}</p>
                </div>

                <div className="shrink-0 self-center">
                  {!userCanAccess ? (
                    <button
                      disabled
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed"
                    >
                      Restricted
                    </button>
                  ) : isAdded ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-900/50">
                      <Check className="w-3.5 h-3.5" />
                      Active in Layout
                    </span>
                  ) : (
                    <button
                      onClick={() => {
                        onAddWidget(widget.id);
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 shadow-xs transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Add to Workspace
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 flex items-center justify-between text-xs text-slate-500">
          <span>Enabled Modules: {enabledModules.map(m => m.name).join(', ')}</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-xs font-semibold bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-white hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
