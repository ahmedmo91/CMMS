import React from 'react';
import { Package, AlertCircle, CheckCircle2, Search, ArrowUpDown } from 'lucide-react';

const SEED_INVENTORY = [
  { id: 1, itemCode: 'BRG-SKF-7014', name: 'SKF 7014 Angular Contact Spindle Bearing', category: 'Bearings & Seals', qty: 1, min: 4, reorder: 6, unitCost: 480, warehouse: 'WH-Main Aisle 2B' },
  { id: 2, itemCode: 'SEAL-VIT-HP200', name: 'Viton Fluoropolymer Cylinder Seal Kit 200T', category: 'Hydraulics', qty: 2, min: 5, reorder: 8, unitCost: 185, warehouse: 'WH-Main Aisle 1C' },
  { id: 3, itemCode: 'DRV-KUKA-KSD32', name: 'Kuka KRC4 KSD1-32 Axis Drive Amplifier', category: 'Electrical & Drives', qty: 0, min: 1, reorder: 2, unitCost: 3200, warehouse: 'WH-Main Secure Cage' },
  { id: 4, itemCode: 'SEN-SICK-W16', name: 'SICK W16 Photoelectric Sensor Transmitter/Receiver', category: 'Sensors & Controls', qty: 8, min: 4, reorder: 10, unitCost: 120, warehouse: 'WH-Main Aisle 4A' },
  { id: 5, itemCode: 'LUBE-MOB-POLY', name: 'Mobil Polyrex EM Synthetic Electric Motor Grease (Cartridge)', category: 'Lubricants', qty: 24, min: 12, reorder: 36, unitCost: 14, warehouse: 'WH-Lube Storage' },
  { id: 6, itemCode: 'FLT-PARK-10M', name: 'Parker 10-Micron High-Pressure Hydraulic Element', category: 'Filtration', qty: 6, min: 4, reorder: 8, unitCost: 95, warehouse: 'WH-Main Aisle 1C' },
];

export const InventoryListPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
              Spare Parts & Inventory Module
            </h1>
            <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400">
              Extension Module Installed
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Plant spare parts catalog, reorder threshold alerts, and warehouse bins.
          </p>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200 dark:border-slate-800">
            <tr>
              <th className="py-3.5 px-4">Part #</th>
              <th className="py-3.5 px-4">Description</th>
              <th className="py-3.5 px-4">Category</th>
              <th className="py-3.5 px-4">On Hand</th>
              <th className="py-3.5 px-4">Min Stock</th>
              <th className="py-3.5 px-4">Unit Cost</th>
              <th className="py-3.5 px-4">Storage Bin</th>
              <th className="py-3.5 px-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
            {SEED_INVENTORY.map(item => (
              <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                <td className="py-3.5 px-4 font-mono font-bold text-slate-900 dark:text-white">{item.itemCode}</td>
                <td className="py-3.5 px-4 font-medium text-slate-800 dark:text-slate-200">{item.name}</td>
                <td className="py-3.5 px-4 text-slate-500">{item.category}</td>
                <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white">{item.qty}</td>
                <td className="py-3.5 px-4 text-slate-500">{item.min}</td>
                <td className="py-3.5 px-4 font-mono text-slate-800 dark:text-slate-200">${item.unitCost}</td>
                <td className="py-3.5 px-4 text-slate-500">{item.warehouse}</td>
                <td className="py-3.5 px-4">
                  {item.qty <= item.min ? (
                    <span className="inline-flex px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300">
                      REORDER NOW
                    </span>
                  ) : (
                    <span className="inline-flex px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                      ADEQUATE
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
