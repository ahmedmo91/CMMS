import React, { useState, useEffect, useMemo } from 'react';
import { DashboardWidgetItem } from './types.ts';
import { MODULE_REGISTRY, getAllDashboardWidgets } from '../modules/registry.ts';
import { useSystemConfig } from '../configuration/SystemConfigContext.tsx';
import { useAuth } from '../auth/AuthContext.tsx';
import { auditService } from '../audit/auditService.ts';
import { WidgetContainer } from './WidgetContainer.tsx';
import { AddWidgetModal } from './AddWidgetModal.tsx';
import {
  LayoutGrid,
  Plus,
  RotateCcw,
  Save,
  CheckCircle2,
  Calendar,
  Sparkles,
  SlidersHorizontal,
  Info,
} from 'lucide-react';

interface DashboardWorkspaceProps {
  onNavigate: (path: string) => void;
}

export const DashboardWorkspace: React.FC<DashboardWorkspaceProps> = ({ onNavigate }) => {
  const { currentUser, hasPermission } = useAuth();
  const { config, isModuleEnabled } = useSystemConfig();

  const [isCustomizing, setIsCustomizing] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [saveToast, setSaveToast] = useState(false);
  const [timeRange, setTimeRange] = useState<'today' | '7d' | '30d' | 'ytd'>('30d');

  // Load layout for current user (or fallback to org default)
  const [layoutItems, setLayoutItems] = useState<DashboardWidgetItem[]>(() => {
    const userStorageKey = `apex_dashboard_user_${currentUser.id}`;
    const saved = localStorage.getItem(userStorageKey);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // fallback
      }
    }
    // Fallback to Org Default
    return config.organizationDefaultWidgets.map((w, idx) => ({
      widgetId: w.widgetId,
      width: w.width,
      height: w.height,
      visible: w.visible,
      order: idx,
    }));
  });

  // Re-sync layout when current user changes
  useEffect(() => {
    const userStorageKey = `apex_dashboard_user_${currentUser.id}`;
    const saved = localStorage.getItem(userStorageKey);
    if (saved) {
      try {
        setLayoutItems(JSON.parse(saved));
        return;
      } catch {
        // fallback
      }
    }
    setLayoutItems(
      config.organizationDefaultWidgets.map((w, idx) => ({
        widgetId: w.widgetId,
        width: w.width,
        height: w.height,
        visible: w.visible,
        order: idx,
      }))
    );
  }, [currentUser.id]);

  const allWidgetsMap = useMemo(() => {
    const map = new Map();
    getAllDashboardWidgets().forEach(w => map.set(w.id, w));
    return map;
  }, []);

  // Filter widgets to only those from ENABLED modules AND permitted by RBAC
  const visibleWidgets = useMemo(() => {
    return layoutItems
      .filter(item => {
        const def = allWidgetsMap.get(item.widgetId);
        if (!def) return false;
        // Check if module is enabled
        if (!isModuleEnabled(def.moduleId)) return false;
        // Check if user has permission
        if (def.requiredPermission && !hasPermission(def.requiredPermission)) return false;
        return true;
      })
      .sort((a, b) => a.order - b.order);
  }, [layoutItems, allWidgetsMap, isModuleEnabled, hasPermission]);

  const handleMove = (index: number, direction: 'left' | 'right') => {
    const targetIndex = direction === 'left' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= visibleWidgets.length) return;

    const currentWidget = visibleWidgets[index];
    const targetWidget = visibleWidgets[targetIndex];

    setLayoutItems(prev =>
      prev.map(item => {
        if (item.widgetId === currentWidget.widgetId) {
          return { ...item, order: targetWidget.order };
        }
        if (item.widgetId === targetWidget.widgetId) {
          return { ...item, order: currentWidget.order };
        }
        return item;
      })
    );
  };

  const handleResize = (widgetId: string, newWidth: number) => {
    setLayoutItems(prev =>
      prev.map(item => (item.widgetId === widgetId ? { ...item, width: newWidth } : item))
    );
  };

  const handleToggleVisible = (widgetId: string) => {
    setLayoutItems(prev =>
      prev.map(item => (item.widgetId === widgetId ? { ...item, visible: !item.visible } : item))
    );
  };

  const handleRemove = (widgetId: string) => {
    setLayoutItems(prev => prev.filter(item => item.widgetId !== widgetId));
  };

  const handleAddWidget = (widgetId: string) => {
    const def = allWidgetsMap.get(widgetId);
    if (!def) return;

    setLayoutItems(prev => [
      ...prev,
      {
        widgetId,
        width: def.defaultWidth || 2,
        height: def.defaultHeight || 1,
        visible: true,
        order: prev.length,
      },
    ]);
  };

  const handleSaveLayout = () => {
    const userStorageKey = `apex_dashboard_user_${currentUser.id}`;
    localStorage.setItem(userStorageKey, JSON.stringify(layoutItems));

    auditService.log({
      userId: currentUser.id,
      userName: currentUser.name,
      userRole: currentUser.role,
      moduleId: 'core',
      action: 'SAVE_LAYOUT',
      entityType: 'DASHBOARD',
      entityId: 'main',
      description: `Saved personalized dashboard layout with ${layoutItems.length} configured widgets`,
    });

    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 3000);
    setIsCustomizing(false);
  };

  const handleResetToDefault = () => {
    const defaults = config.organizationDefaultWidgets.map((w, idx) => ({
      widgetId: w.widgetId,
      width: w.width,
      height: w.height,
      visible: w.visible,
      order: idx,
    }));
    setLayoutItems(defaults);

    const userStorageKey = `apex_dashboard_user_${currentUser.id}`;
    localStorage.setItem(userStorageKey, JSON.stringify(defaults));

    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 3000);
    setIsCustomizing(false);
  };

  const orgMandatoryIds = new Set(
    config.organizationDefaultWidgets.filter(w => w.isMandatory).map(w => w.widgetId)
  );

  return (
    <div className="space-y-6">
      {/* Top Workspace Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
              Operations & Maintenance Workspace
            </h1>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-900/40">
              <Sparkles className="w-3 h-3" /> Modular Workspace
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Dynamic dashboard assembling widgets from active platform modules according to RBAC role.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Time Range Selector */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs font-medium">
            <Calendar className="w-3.5 h-3.5 text-slate-400 ml-1.5 mr-1" />
            {(['today', '7d', '30d', 'ytd'] as const).map(range => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-2.5 py-1 rounded-lg uppercase tracking-wider text-[11px] font-bold transition-all ${
                  timeRange === range
                    ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {range}
              </button>
            ))}
          </div>

          {/* Customize Mode Toggle */}
          {!isCustomizing ? (
            <button
              onClick={() => setIsCustomizing(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-slate-500" />
              Customize Workspace
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 shadow-xs transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Widget
              </button>

              <button
                onClick={handleResetToDefault}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Reset Layout
              </button>

              <button
                onClick={handleSaveLayout}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 shadow-xs transition-colors"
              >
                <Save className="w-3.5 h-3.5" />
                Save Layout
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Customize Mode Banner */}
      {isCustomizing && (
        <div className="px-4 py-3 bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-900/60 rounded-xl flex items-center justify-between text-xs text-indigo-900 dark:text-indigo-200 animate-in fade-in duration-150">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
            <span>
              <strong>Workspace Edit Mode Active:</strong> Rearrange widgets with arrows, choose widths (1x, 2x, 4x), toggle visibility, or click Add Widget. Changes will be saved to your personal profile.
            </span>
          </div>
          <button
            onClick={() => setIsCustomizing(false)}
            className="font-bold underline hover:text-indigo-600 dark:hover:text-indigo-400 shrink-0 ml-4"
          >
            Cancel
          </button>
        </div>
      )}

      {/* Save Success Toast */}
      {saveToast && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-3 bg-emerald-600 text-white rounded-xl shadow-xl flex items-center gap-2 text-xs font-semibold animate-in slide-in-from-bottom duration-200">
          <CheckCircle2 className="w-4 h-4" />
          Dashboard layout saved to user profile!
        </div>
      )}

      {/* Dynamic 12-Column Responsive Workspace Grid */}
      <div className="grid grid-cols-12 gap-5">
        {visibleWidgets.map((item, index) => {
          const def = allWidgetsMap.get(item.widgetId);
          if (!def) return null;
          const WidgetComponent = def.component;

          return (
            <WidgetContainer
              key={item.widgetId}
              definition={def}
              width={item.width}
              visible={item.visible}
              isCustomizing={isCustomizing}
              isMandatory={orgMandatoryIds.has(item.widgetId)}
              canMoveLeft={index > 0}
              canMoveRight={index < visibleWidgets.length - 1}
              onMoveLeft={() => handleMove(index, 'left')}
              onMoveRight={() => handleMove(index, 'right')}
              onResize={newW => handleResize(item.widgetId, newW)}
              onToggleVisible={() => handleToggleVisible(item.widgetId)}
              onRemove={() => handleRemove(item.widgetId)}
            >
              <WidgetComponent
                timeRange={timeRange}
                onNavigate={onNavigate}
                isCustomizing={isCustomizing}
              />
            </WidgetContainer>
          );
        })}
      </div>

      {visibleWidgets.length === 0 && (
        <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">
          <LayoutGrid className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-slate-800 dark:text-slate-200">No Widgets Visible</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-4">
            No widgets are currently visible for your permissions or active modules. Click Customize to add widgets.
          </p>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-600 text-white hover:bg-indigo-700"
          >
            Add Widgets
          </button>
        </div>
      )}

      {/* Add Widget Modal */}
      <AddWidgetModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        activeWidgetIds={layoutItems.map(i => i.widgetId)}
        onAddWidget={handleAddWidget}
      />
    </div>
  );
};
