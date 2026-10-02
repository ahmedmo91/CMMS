import React from 'react';
import { WidgetProps } from '../../../core/modules/types.ts';
import { Package, AlertCircle } from 'lucide-react';

export const LowStockItemsWidget: React.FC<WidgetProps> = ({ onNavigate }) => {
  return (
    <div
      onClick={() => onNavigate?.('/materials/inventory')}
      className="p-5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs hover:border-slate-300 dark:hover:border-slate-700 transition-all cursor-pointer h-full flex flex-col justify-between"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center">
            <Package className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-semibold tracking-wider uppercase text-slate-500 dark:text-slate-400">Critical Spare Parts</h4>
          </div>
        </div>
        <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
          3 Low Stock
        </span>
      </div>

      <div className="my-3 space-y-2 text-xs">
        <div className="flex justify-between items-center bg-slate-50 dark:bg-slate-800/60 p-2 rounded-md">
          <span className="font-medium text-slate-800 dark:text-slate-200">SKF 7014 Angular Bearing</span>
          <span className="text-rose-600 dark:text-rose-400 font-bold">1 left (Min: 4)</span>
        </div>
        <div className="flex justify-between items-center bg-slate-50 dark:bg-slate-800/60 p-2 rounded-md">
          <span className="font-medium text-slate-800 dark:text-slate-200">Viton O-Ring Kit #4</span>
          <span className="text-amber-600 dark:text-amber-400 font-bold">2 left (Min: 5)</span>
        </div>
      </div>

      <div className="text-xs text-slate-500 flex items-center justify-between">
        <span>Total Inventory Valuation: $184,200</span>
        <span className="text-amber-600 dark:text-amber-400 font-medium hover:underline">Reorder &rarr;</span>
      </div>
    </div>
  );
};
