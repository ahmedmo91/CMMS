export type FaultPriority = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
export type FaultSeverity = 'CATASTROPHIC' | 'CRITICAL' | 'MAJOR' | 'MINOR';
export type FaultStatus = 'REPORTED' | 'IN_REVIEW' | 'IN_PROGRESS' | 'PENDING_PARTS' | 'RESOLVED' | 'CLOSED';
export type FailureCategory = 'MECHANICAL' | 'ELECTRICAL' | 'HYDRAULIC' | 'PNEUMATIC' | 'ELECTRONIC_SENSOR' | 'SOFTWARE_PLC' | 'STRUCTURAL';

export interface FailureCodeItem {
  code: string;
  name: string;
  category: FailureCategory;
  defaultSeverity: FaultSeverity;
}

export const FAILURE_CODES: FailureCodeItem[] = [
  { code: 'MEC-SPINDLE-01', name: 'Spindle Bearing High Vibration / Wear', category: 'MECHANICAL', defaultSeverity: 'CRITICAL' },
  { code: 'MEC-CONV-01', name: 'Conveyor Drive Belt Jam / Tension Loss', category: 'MECHANICAL', defaultSeverity: 'MAJOR' },
  { code: 'MEC-GEAR-02', name: 'Gearbox Backlash / Chipped Teeth', category: 'MECHANICAL', defaultSeverity: 'MAJOR' },
  { code: 'ELE-MOTOR-01', name: '3-Phase Induction Motor Winding Overheat', category: 'ELECTRICAL', defaultSeverity: 'CRITICAL' },
  { code: 'ELE-DRIVE-02', name: 'VFD Inverter Overcurrent / Phase Loss Trip', category: 'ELECTRICAL', defaultSeverity: 'MAJOR' },
  { code: 'ELE-SW-03', name: 'Emergency Stop Circuit Tripped / Contactor Welded', category: 'ELECTRICAL', defaultSeverity: 'CRITICAL' },
  { code: 'HYD-VALVE-01', name: 'Proportional Directional Valve Stiction', category: 'HYDRAULIC', defaultSeverity: 'MAJOR' },
  { code: 'HYD-LEAK-02', name: 'High-Pressure Hose Burst / Flange Leak', category: 'HYDRAULIC', defaultSeverity: 'CRITICAL' },
  { code: 'HYD-PUMP-03', name: 'Variable Displacement Pump Cavitation', category: 'HYDRAULIC', defaultSeverity: 'MAJOR' },
  { code: 'SEN-ALIGN-01', name: 'Optical / Photoelectric Sensor Misaligned', category: 'ELECTRONIC_SENSOR', defaultSeverity: 'MINOR' },
  { code: 'SEN-PROX-02', name: 'Inductive Proximity Sensor Physical Damage', category: 'ELECTRONIC_SENSOR', defaultSeverity: 'MINOR' },
  { code: 'PNEU-REG-01', name: 'Pneumatic Pressure Regulator Diaphragm Leak', category: 'PNEUMATIC', defaultSeverity: 'MINOR' },
  { code: 'PLC-COM-01', name: 'Profinet Fieldbus Communication Timeout', category: 'SOFTWARE_PLC', defaultSeverity: 'MAJOR' },
];

export interface FaultTimelineItem {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  action: string;
  notes?: string;
}

export interface Fault {
  id: number;
  faultNumber: string; // 'FLT-2026-084'
  title: string;
  description: string;
  equipmentId: number;
  reporterId: number;
  assignedTechnicianId?: number;
  priority: FaultPriority;
  severity: FaultSeverity;
  status: FaultStatus;
  failureCode: string;
  failureCategory: FailureCategory;
  rootCause?: string;
  correctiveAction?: string;
  preventiveRecommendation?: string;
  downtimeMinutes: number;
  repairCost: number;
  reportedAt: string;
  startedAt?: string;
  resolvedAt?: string;
  closedAt?: string;
  customFieldValues: Record<string, string | number | boolean>;
  timeline: FaultTimelineItem[];
}
