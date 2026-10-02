export interface AuditLogEntry {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  userRole: string;
  moduleId: string;
  action: 'CREATE' | 'UPDATE' | 'DELETE' | 'RESOLVE' | 'STATUS_CHANGE' | 'TOGGLE_MODULE' | 'SAVE_LAYOUT' | 'EXPORT_DATA';
  entityType: 'FAULT' | 'EQUIPMENT' | 'EMPLOYEE' | 'MODULE' | 'DASHBOARD' | 'CUSTOM_FIELD';
  entityId?: string;
  description: string;
  details?: Record<string, unknown>;
}

const INITIAL_AUDIT_LOGS: AuditLogEntry[] = [
  {
    id: 'aud-101',
    timestamp: '2026-09-30 08:32:10',
    userId: 'usr-admin-1',
    userName: 'Marcus Vance',
    userRole: 'ADMIN',
    moduleId: 'faults',
    action: 'CREATE',
    entityType: 'FAULT',
    entityId: 'FLT-2026-084',
    description: 'Reported critical spindle bearing vibration fault on CNC-04',
    details: { equipment: 'CNC-04', priority: 'CRITICAL', failureCode: 'MEC-SPINDLE-01' },
  },
  {
    id: 'aud-102',
    timestamp: '2026-09-30 07:15:45',
    userId: 'usr-sup-2',
    userName: 'Elena Rostova',
    userRole: 'MAINT_SUPERVISOR',
    moduleId: 'faults',
    action: 'STATUS_CHANGE',
    entityType: 'FAULT',
    entityId: 'FLT-2026-083',
    description: 'Updated fault status to IN_PROGRESS and assigned to Carlos Mendoza',
    details: { assignedTechnician: 'Carlos Mendoza', status: 'IN_PROGRESS' },
  },
  {
    id: 'aud-103',
    timestamp: '2026-09-29 16:40:22',
    userId: 'usr-tech-3',
    userName: 'David Kim',
    userRole: 'TECHNICIAN',
    moduleId: 'faults',
    action: 'RESOLVE',
    entityType: 'FAULT',
    entityId: 'FLT-2026-081',
    description: 'Resolved conveyor sensor misread fault with laser emitter recalibration',
    details: { downtimeMinutes: 45, rootCause: 'Dust buildup on optical lens' },
  },
  {
    id: 'aud-104',
    timestamp: '2026-09-29 14:10:00',
    userId: 'usr-admin-1',
    userName: 'Marcus Vance',
    userRole: 'ADMIN',
    moduleId: 'core',
    action: 'TOGGLE_MODULE',
    entityType: 'MODULE',
    entityId: 'preventive-maintenance',
    description: 'Enabled Preventive Maintenance Planning module in System Configuration',
    details: { state: 'ENABLED' },
  },
  {
    id: 'aud-105',
    timestamp: '2026-09-29 11:20:15',
    userId: 'usr-sup-2',
    userName: 'Elena Rostova',
    userRole: 'MAINT_SUPERVISOR',
    moduleId: 'core',
    action: 'SAVE_LAYOUT',
    entityType: 'DASHBOARD',
    entityId: 'main',
    description: 'Saved custom dashboard workspace layout for user',
    details: { widgetCount: 7 },
  },
];

class AuditService {
  private storageKey = 'apex_audit_logs';

  private getLogs(): AuditLogEntry[] {
    const raw = localStorage.getItem(this.storageKey);
    if (!raw) {
      localStorage.setItem(this.storageKey, JSON.stringify(INITIAL_AUDIT_LOGS));
      return INITIAL_AUDIT_LOGS;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return INITIAL_AUDIT_LOGS;
    }
  }

  getAll(): AuditLogEntry[] {
    return this.getLogs();
  }

  log(entry: Omit<AuditLogEntry, 'id' | 'timestamp'>) {
    const logs = this.getLogs();
    const newEntry: AuditLogEntry = {
      ...entry,
      id: `aud-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
    };
    logs.unshift(newEntry);
    // Keep max 500 logs
    if (logs.length > 500) logs.pop();
    localStorage.setItem(this.storageKey, JSON.stringify(logs));
  }
}

export const auditService = new AuditService();
