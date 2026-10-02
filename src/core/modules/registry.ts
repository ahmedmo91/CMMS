import { ModuleDefinition, DashboardWidgetDefinition } from './types.ts';
import { PERMISSIONS } from '../permissions/constants.ts';

// Widget Components
import {
  TotalFaultsWidget,
  OpenFaultsWidget,
  InProgressWidget,
  MTTRRepairTimeWidget,
  TotalDowntimeWidget,
} from '../../modules/faults/widgets/FaultMetricWidgets.tsx';
import { FaultTrendWidget } from '../../modules/faults/widgets/FaultTrendWidget.tsx';
import { FaultsByLocationWidget } from '../../modules/faults/widgets/FaultsByLocationWidget.tsx';
import { RecentFaultsListWidget } from '../../modules/faults/widgets/RecentFaultsListWidget.tsx';
import {
  PMDueTodayWidget,
  PMCompletionRateWidget,
} from '../../modules/preventive-maintenance/widgets/PMWidgets.tsx';
import { LowStockItemsWidget } from '../../modules/inventory/widgets/InventoryWidgets.tsx';
import { WorkforceAttendanceWidget } from '../../modules/workforce/widgets/WorkforceWidgets.tsx';

export const MODULE_REGISTRY: ModuleDefinition[] = [
  {
    id: 'faults',
    name: 'Fault Management & Recording',
    description: 'Centralized plant fault capture, status tracking, root cause investigations, downtime accounting, and dynamic custom attributes.',
    version: '1.2.0',
    category: 'maintenance',
    iconName: 'AlertOctagon',
    enabled: true,
    isCore: true,
    requiredPermissions: [PERMISSIONS.FAULTS_VIEW],
    statusLabel: 'Active',
    navigation: [
      {
        id: 'nav-faults-list',
        label: 'Fault Management',
        path: '/maintenance/faults',
        iconName: 'AlertTriangle',
        section: 'Maintenance',
        requiredPermission: PERMISSIONS.FAULTS_VIEW,
        order: 1,
      },
      {
        id: 'nav-faults-analytics',
        label: 'Reliability & MTTR',
        path: '/maintenance/faults/analytics',
        iconName: 'BarChart2',
        section: 'Maintenance',
        requiredPermission: PERMISSIONS.FAULTS_VIEW,
        order: 2,
      },
      {
        id: 'nav-faults-fields',
        label: 'Fault Form Builder',
        path: '/maintenance/faults/fields',
        iconName: 'Sliders',
        section: 'Maintenance',
        requiredPermission: PERMISSIONS.FAULTS_CONFIGURE_FIELDS,
        order: 3,
      },
    ],
    dashboardWidgets: [
      {
        id: 'faults-total',
        moduleId: 'faults',
        name: 'Total Faults Recorded',
        description: 'Aggregate fault count across all plant equipment.',
        category: 'metric',
        defaultWidth: 1,
        defaultHeight: 1,
        requiredPermission: PERMISSIONS.FAULTS_VIEW,
        component: TotalFaultsWidget,
      },
      {
        id: 'faults-open',
        moduleId: 'faults',
        name: 'Open Faults (Action Required)',
        description: 'Unresolved faults currently awaiting review or assignment.',
        category: 'metric',
        defaultWidth: 1,
        defaultHeight: 1,
        requiredPermission: PERMISSIONS.FAULTS_VIEW,
        component: OpenFaultsWidget,
      },
      {
        id: 'faults-in-progress',
        moduleId: 'faults',
        name: 'In Progress Faults',
        description: 'Faults actively being repaired by assigned maintenance technicians.',
        category: 'metric',
        defaultWidth: 1,
        defaultHeight: 1,
        requiredPermission: PERMISSIONS.FAULTS_VIEW,
        component: InProgressWidget,
      },
      {
        id: 'faults-mttr',
        moduleId: 'faults',
        name: 'Mean Time to Repair (MTTR)',
        description: 'Average duration in hours from fault reporting to verified resolution.',
        category: 'metric',
        defaultWidth: 1,
        defaultHeight: 1,
        requiredPermission: PERMISSIONS.FAULTS_VIEW,
        component: MTTRRepairTimeWidget,
      },
      {
        id: 'faults-downtime',
        moduleId: 'faults',
        name: 'Total Equipment Downtime',
        description: 'Cumulative equipment downtime hours and direct financial impact.',
        category: 'metric',
        defaultWidth: 1,
        defaultHeight: 1,
        requiredPermission: PERMISSIONS.FAULTS_VIEW,
        component: TotalDowntimeWidget,
      },
      {
        id: 'faults-trend',
        moduleId: 'faults',
        name: 'Monthly Fault Trend',
        description: 'Historical fault incident and downtime trend comparison.',
        category: 'chart',
        defaultWidth: 2,
        defaultHeight: 2,
        requiredPermission: PERMISSIONS.FAULTS_VIEW,
        component: FaultTrendWidget,
      },
      {
        id: 'faults-location',
        moduleId: 'faults',
        name: 'Faults by Location',
        description: 'Equipment fault density distributed by plant buildings and bays.',
        category: 'chart',
        defaultWidth: 2,
        defaultHeight: 2,
        requiredPermission: PERMISSIONS.FAULTS_VIEW,
        component: FaultsByLocationWidget,
      },
      {
        id: 'faults-recent-list',
        moduleId: 'faults',
        name: 'Recent Fault Records Feed',
        description: 'Interactive real-time table of recent equipment faults and assignments.',
        category: 'table',
        defaultWidth: 4,
        defaultHeight: 2,
        requiredPermission: PERMISSIONS.FAULTS_VIEW,
        component: RecentFaultsListWidget,
      },
    ],
    reportTypes: [
      {
        id: 'rep-fault-summary',
        moduleId: 'faults',
        title: 'Plant Fault Incident Log Summary',
        description: 'Complete export of all fault tickets, root causes, and downtime minutes.',
        exportFormats: ['csv', 'json', 'pdf'],
        requiredPermission: PERMISSIONS.CORE_EXPORT_REPORTS,
      },
      {
        id: 'rep-mttr-downtime',
        moduleId: 'faults',
        title: 'MTTR & Asset Downtime Breakdown',
        description: 'Comprehensive reliability metrics by equipment classification and bay.',
        exportFormats: ['csv', 'json'],
        requiredPermission: PERMISSIONS.CORE_EXPORT_REPORTS,
      },
    ],
  },
  {
    id: 'preventive-maintenance',
    name: 'Preventive Maintenance (PM)',
    description: 'Time and meter-based preventive maintenance scheduling, recurring task checklists, and compliance tracking.',
    version: '1.0.0',
    category: 'maintenance',
    iconName: 'CalendarCheck',
    enabled: true,
    requiredPermissions: [PERMISSIONS.PM_VIEW],
    statusLabel: 'Active',
    navigation: [
      {
        id: 'nav-pm-schedules',
        label: 'PM Schedules',
        path: '/maintenance/preventive',
        iconName: 'Calendar',
        section: 'Maintenance',
        requiredPermission: PERMISSIONS.PM_VIEW,
        order: 4,
      },
      {
        id: 'nav-pm-plans',
        label: 'Maintenance Plans',
        path: '/maintenance/preventive/plans',
        iconName: 'CheckSquare',
        section: 'Maintenance',
        requiredPermission: PERMISSIONS.PM_VIEW,
        order: 5,
      },
    ],
    dashboardWidgets: [
      {
        id: 'pm-due-today',
        moduleId: 'preventive-maintenance',
        name: 'PM Due Today & Overdue',
        description: 'Live counter of routine preventive maintenance work due on plant machines.',
        category: 'metric',
        defaultWidth: 2,
        defaultHeight: 1,
        requiredPermission: PERMISSIONS.PM_VIEW,
        component: PMDueTodayWidget,
      },
      {
        id: 'pm-completion-rate',
        moduleId: 'preventive-maintenance',
        name: 'PM Schedule Compliance %',
        description: 'Percentage of scheduled PM tasks executed within the target window.',
        category: 'metric',
        defaultWidth: 2,
        defaultHeight: 1,
        requiredPermission: PERMISSIONS.PM_VIEW,
        component: PMCompletionRateWidget,
      },
    ],
    reportTypes: [
      {
        id: 'rep-pm-compliance',
        moduleId: 'preventive-maintenance',
        title: 'PM Compliance & Backlog Audit',
        description: 'Audit log of PM on-time completions versus overdue maintenance tasks.',
        exportFormats: ['csv', 'json', 'pdf'],
        requiredPermission: PERMISSIONS.CORE_EXPORT_REPORTS,
      },
    ],
  },
  {
    id: 'inventory',
    name: 'Spare Parts & Inventory',
    description: 'Warehouse locations, critical spare parts reorder thresholds, bills of materials, and stock transactions.',
    version: '0.9.0',
    category: 'materials',
    iconName: 'Package',
    enabled: false,
    requiredPermissions: [PERMISSIONS.INVENTORY_VIEW],
    statusLabel: 'Available',
    navigation: [
      {
        id: 'nav-inventory-items',
        label: 'Spare Parts Catalog',
        path: '/materials/inventory',
        iconName: 'Boxes',
        section: 'Materials',
        requiredPermission: PERMISSIONS.INVENTORY_VIEW,
        order: 1,
      },
    ],
    dashboardWidgets: [
      {
        id: 'inventory-low-stock',
        moduleId: 'inventory',
        name: 'Critical Spare Parts Stock Alert',
        description: 'Real-time warning for components below reorder safety stock.',
        category: 'metric',
        defaultWidth: 2,
        defaultHeight: 1,
        requiredPermission: PERMISSIONS.INVENTORY_VIEW,
        component: LowStockItemsWidget,
      },
    ],
  },
  {
    id: 'workforce',
    name: 'Workforce & Attendance',
    description: 'Technician certifications, shift coverage, work order hours, and overtime monitoring.',
    version: '1.0.0',
    category: 'workforce',
    iconName: 'Users',
    enabled: true,
    requiredPermissions: [PERMISSIONS.WORKFORCE_VIEW],
    statusLabel: 'Active',
    navigation: [
      {
        id: 'nav-workforce-directory',
        label: 'Technician Roster',
        path: '/workforce/employees',
        iconName: 'UserCheck',
        section: 'Workforce',
        requiredPermission: PERMISSIONS.WORKFORCE_VIEW,
        order: 1,
      },
    ],
    dashboardWidgets: [
      {
        id: 'workforce-attendance',
        moduleId: 'workforce',
        name: 'Shift Coverage & Overtime',
        description: 'Active maintenance technicians on shift and weekly overtime tally.',
        category: 'metric',
        defaultWidth: 2,
        defaultHeight: 1,
        requiredPermission: PERMISSIONS.WORKFORCE_VIEW,
        component: WorkforceAttendanceWidget,
      },
    ],
  },
];

// Helper functions for dynamic module resolution
export function getRegisteredModules(): ModuleDefinition[] {
  return MODULE_REGISTRY;
}

export function getModuleById(id: string): ModuleDefinition | undefined {
  return MODULE_REGISTRY.find(m => m.id === id);
}

export function getAllDashboardWidgets(): DashboardWidgetDefinition[] {
  return MODULE_REGISTRY.flatMap(m => m.dashboardWidgets);
}

export function getWidgetById(widgetId: string): DashboardWidgetDefinition | undefined {
  return getAllDashboardWidgets().find(w => w.id === widgetId);
}
