export const PERMISSIONS = {
  // Core Platform
  CORE_VIEW_DASHBOARD: 'core.view_dashboard',
  CORE_CUSTOMIZE_DASHBOARD: 'core.customize_dashboard',
  CORE_MANAGE_MODULES: 'core.manage_modules',
  CORE_MANAGE_SETTINGS: 'core.manage_settings',
  CORE_MANAGE_USERS: 'core.manage_users',
  CORE_VIEW_AUDIT_LOGS: 'core.view_audit_logs',
  CORE_EXPORT_REPORTS: 'core.export_reports',

  // Fault Management Module
  FAULTS_VIEW: 'faults.view',
  FAULTS_CREATE: 'faults.create',
  FAULTS_EDIT: 'faults.edit',
  FAULTS_DELETE: 'faults.delete',
  FAULTS_RESOLVE: 'faults.resolve',
  FAULTS_CONFIGURE_FIELDS: 'faults.configure_fields',
  FAULTS_EXPORT: 'faults.export',

  // Shared Asset Foundation
  ASSETS_VIEW: 'assets.view',
  ASSETS_CREATE: 'assets.create',
  ASSETS_EDIT: 'assets.edit',
  ASSETS_DELETE: 'assets.delete',

  // Shared Workforce Foundation
  WORKFORCE_VIEW: 'workforce.view',
  WORKFORCE_MANAGE: 'workforce.manage',

  // Preventive Maintenance Module (Future/Enabled)
  PM_VIEW: 'pm.view',
  PM_CREATE: 'pm.create',
  PM_EXECUTE: 'pm.execute',

  // Inventory Module (Future/Enabled)
  INVENTORY_VIEW: 'inventory.view',
  INVENTORY_MANAGE: 'inventory.manage',
} as const;

export type PermissionCode = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];

export interface RoleDefinition {
  code: string;
  name: string;
  description: string;
  permissions: string[];
  color: string;
}

export const SYSTEM_ROLES: Record<string, RoleDefinition> = {
  ADMIN: {
    code: 'ADMIN',
    name: 'System Administrator',
    description: 'Full unconstrained platform control, module management, and system configuration.',
    color: 'bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/40 dark:text-purple-300 dark:border-purple-800',
    permissions: Object.values(PERMISSIONS),
  },
  MAINT_SUPERVISOR: {
    code: 'MAINT_SUPERVISOR',
    name: 'Maintenance Supervisor (Editor)',
    description: 'Operational control over faults, asset updates, assignments, and reporting.',
    color: 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/40 dark:text-blue-300 dark:border-blue-800',
    permissions: [
      PERMISSIONS.CORE_VIEW_DASHBOARD,
      PERMISSIONS.CORE_CUSTOMIZE_DASHBOARD,
      PERMISSIONS.CORE_VIEW_AUDIT_LOGS,
      PERMISSIONS.CORE_EXPORT_REPORTS,
      PERMISSIONS.FAULTS_VIEW,
      PERMISSIONS.FAULTS_CREATE,
      PERMISSIONS.FAULTS_EDIT,
      PERMISSIONS.FAULTS_RESOLVE,
      PERMISSIONS.FAULTS_EXPORT,
      PERMISSIONS.ASSETS_VIEW,
      PERMISSIONS.ASSETS_CREATE,
      PERMISSIONS.ASSETS_EDIT,
      PERMISSIONS.WORKFORCE_VIEW,
      PERMISSIONS.PM_VIEW,
      PERMISSIONS.PM_CREATE,
      PERMISSIONS.PM_EXECUTE,
      PERMISSIONS.INVENTORY_VIEW,
    ],
  },
  TECHNICIAN: {
    code: 'TECHNICIAN',
    name: 'Maintenance Technician',
    description: 'Can record faults, work on assigned faults, and update resolution notes.',
    color: 'bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/40 dark:text-amber-300 dark:border-amber-800',
    permissions: [
      PERMISSIONS.CORE_VIEW_DASHBOARD,
      PERMISSIONS.CORE_CUSTOMIZE_DASHBOARD,
      PERMISSIONS.FAULTS_VIEW,
      PERMISSIONS.FAULTS_CREATE,
      PERMISSIONS.FAULTS_EDIT,
      PERMISSIONS.FAULTS_RESOLVE,
      PERMISSIONS.ASSETS_VIEW,
      PERMISSIONS.WORKFORCE_VIEW,
      PERMISSIONS.PM_VIEW,
      PERMISSIONS.PM_EXECUTE,
      PERMISSIONS.INVENTORY_VIEW,
    ],
  },
  OPERATOR: {
    code: 'OPERATOR',
    name: 'Plant Operator',
    description: 'Can report faults and view asset statuses on production lines.',
    color: 'bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-900/40 dark:text-emerald-300 dark:border-emerald-800',
    permissions: [
      PERMISSIONS.CORE_VIEW_DASHBOARD,
      PERMISSIONS.FAULTS_VIEW,
      PERMISSIONS.FAULTS_CREATE,
      PERMISSIONS.ASSETS_VIEW,
    ],
  },
  VIEWER: {
    code: 'VIEWER',
    name: 'Auditor / Viewer',
    description: 'Read-only access to authorized dashboard widgets, faults, and assets.',
    color: 'bg-slate-100 text-slate-800 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700',
    permissions: [
      PERMISSIONS.CORE_VIEW_DASHBOARD,
      PERMISSIONS.FAULTS_VIEW,
      PERMISSIONS.ASSETS_VIEW,
      PERMISSIONS.WORKFORCE_VIEW,
      PERMISSIONS.CORE_EXPORT_REPORTS,
    ],
  },
};
