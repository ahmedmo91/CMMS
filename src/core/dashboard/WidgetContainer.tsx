import React from 'react';
import { DashboardWidgetDefinition } from '../modules/types.ts';
import { ChevronLeft, ChevronRight, Eye, EyeOff, Trash2, Maximize2, Shield, GripVertical } from 'lucide-react';

interface WidgetContainerProps {
  definition: DashboardWidgetDefinition;
  width: number;
  visible: boolean;
  isCustomizing: boolean;
  isMandatory?: boolean;
  canMoveLeft: boolean;
  canMoveRight: boolean;
  onMoveLeft: () => void;
  onMoveRight: () => void;
  onResize: (newWidth: number) => void;
  onToggleVisible: () => void;
  onRemove: () => void;
  children: React.ReactNode;
}

export const WidgetContainer: React.FC<WidgetContainerProps> = ({
  definition,
  width,
  visible,
  isCustomizing,
  isMandatory = false,
  canMoveLeft,
  canMoveRight,
  onMoveLeft,
  onMoveRight,
  onResize,
  onToggleVisible,
  onRemove,
  children,
}) => {
  // Determine col-span classes based on width (1 to 4 in a 4-col grid)
  const getColSpanClass = (span: number) => {
    switch (span) {
      case 1:
        return 'col-span-12 sm:col-span-6 lg:col-span-3';
      case 2:
        return 'col-span-12 sm:col-span-12 lg:col-span-6';
      case 3:
        return 'col-span-12 lg:col-span-9';
      case 4:
      default:
        return 'col-span-12';
    }
  };

  if (!visible && !isCustomizing) {
    return null;
  }

  return (
    <div
      className={`relative group transition-all duration-200 ${getColSpanClass(width)} ${
        isCustomizing
          ? `rounded-2xl p-1.5 border-2 border-dashed ${
              !visible
                ? 'opacity-40 border-slate-300 dark:border-slate-700 bg-slate-100/50 dark:bg-slate-800/20'
                : 'border-indigo-400 dark:border-indigo-600 bg-indigo-50/20 dark:bg-indigo-950/20 shadow-sm'
            }`
          : ''
      }`}
    >
      {/* Customization Toolbar when in Edit Mode */}
      {isCustomizing && (
        <div className="mb-2 px-3 py-1.5 bg-slate-900 text-white rounded-xl shadow-lg flex items-center justify-between text-xs animate-in fade-in duration-150">
          <div className="flex items-center gap-2 truncate">
            <GripVertical className="w-3.5 h-3.5 text-slate-400" />
            <span className="font-semibold truncate">{definition.name}</span>
            {isMandatory && (
              <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[10px] font-bold">
                <Shield className="w-2.5 h-2.5" /> Org Default
              </span>
            )}
          </div>

          <div className="flex items-center gap-1 shrink-0">
            {/* Move Left */}
            <button
              onClick={onMoveLeft}
              disabled={!canMoveLeft}
              title="Move Earlier"
              className="p-1 rounded hover:bg-slate-800 disabled:opacity-30 disabled:hover:bg-transparent"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>

            {/* Move Right */}
            <button
              onClick={onMoveRight}
              disabled={!canMoveRight}
              title="Move Later"
              className="p-1 rounded hover:bg-slate-800 disabled:opacity-30 disabled:hover:bg-transparent"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>

            {/* Width Picker */}
            <div className="flex items-center bg-slate-800 rounded px-1 py-0.5 ml-1">
              {[1, 2, 4].map(w => (
                <button
                  key={w}
                  onClick={() => onResize(w)}
                  className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                    width === w ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {w}x
                </button>
              ))}
            </div>

            {/* Visibility Toggle */}
            <button
              onClick={onToggleVisible}
              title={visible ? 'Hide widget' : 'Show widget'}
              className="p-1 rounded hover:bg-slate-800 ml-1 text-slate-300 hover:text-white"
            >
              {visible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5 text-amber-400" />}
            </button>

            {/* Remove Widget */}
            {!isMandatory && (
              <button
                onClick={onRemove}
                title="Remove from layout"
                className="p-1 rounded hover:bg-rose-900/60 text-slate-400 hover:text-rose-300 ml-0.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Render the actual widget */}
      <div className="h-full">
        {children}
      </div>
    </div>
  );
};
