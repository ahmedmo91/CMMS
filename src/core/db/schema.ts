import { pgTable, serial, text, integer, timestamp, boolean, jsonb } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// ==========================================
// CORE PLATFORM TABLES
// ==========================================

export const users = pgTable('core_users', {
  id: serial('id').primaryKey(),
  uid: text('uid').notNull().unique(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  role: text('role').notNull().default('EDITOR'), // ADMIN, EDITOR, VIEWER, TECHNICIAN
  avatarUrl: text('avatar_url'),
  department: text('department'),
  active: boolean('active').notNull().default(true),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const roles = pgTable('core_roles', {
  id: serial('id').primaryKey(),
  code: text('code').notNull().unique(), // 'ADMIN', 'MAINT_SUPERVISOR', 'TECHNICIAN', 'OPERATOR', 'VIEWER'
  name: text('name').notNull(),
  description: text('description'),
  isSystem: boolean('is_system').notNull().default(false),
  permissions: jsonb('permissions').$type<string[]>().notNull().default([]),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const permissions = pgTable('core_permissions', {
  id: serial('id').primaryKey(),
  moduleId: text('module_id').notNull(), // 'core', 'faults', 'preventive-maintenance', etc.
  code: text('code').notNull().unique(), // e.g. 'faults.create', 'core.manage_modules'
  name: text('name').notNull(),
  description: text('description'),
  category: text('category').notNull(),
});

export const auditLogs = pgTable('core_audit_logs', {
  id: serial('id').primaryKey(),
  userId: text('user_id').notNull(),
  userName: text('user_name').notNull(),
  userRole: text('user_role').notNull(),
  moduleId: text('module_id').notNull(),
  action: text('action').notNull(), // 'CREATE', 'UPDATE', 'DELETE', 'RESOLVE', 'TOGGLE_MODULE', 'SAVE_LAYOUT'
  entityType: text('entity_type').notNull(), // 'FAULT', 'EQUIPMENT', 'MODULE', 'DASHBOARD'
  entityId: text('entity_id'),
  details: jsonb('details').$type<Record<string, unknown>>().default({}),
  ipAddress: text('ip_address'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const systemSettings = pgTable('core_system_settings', {
  id: serial('id').primaryKey(),
  key: text('key').notNull().unique(),
  value: jsonb('value').$type<Record<string, unknown>>().notNull(),
  description: text('description'),
  updatedBy: text('updated_by'),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const dashboardPreferences = pgTable('core_user_dashboard_preferences', {
  id: serial('id').primaryKey(),
  userId: text('user_id').notNull(), // Per-user dashboard persistence
  dashboardId: text('dashboard_id').notNull().default('main'),
  widgetId: text('widget_id').notNull(),
  positionX: integer('position_x').notNull().default(0),
  positionY: integer('position_y').notNull().default(0),
  width: integer('width').notNull().default(1), // Grid column span
  height: integer('height').notNull().default(1), // Grid row span
  visible: boolean('visible').notNull().default(true),
  configurationJson: jsonb('configuration_json').$type<Record<string, unknown>>().default({}),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// ==========================================
// SHARED ASSET / EQUIPMENT FOUNDATION TABLES
// ==========================================

export const equipment = pgTable('asset_equipment', {
  id: serial('id').primaryKey(),
  assetId: text('asset_id').notNull().unique(), // e.g. 'EQ-2024-001'
  equipmentNumber: text('equipment_number').notNull(), // e.g. 'CNC-04'
  name: text('name').notNull(),
  type: text('type').notNull(), // 'Machining', 'Hydraulics', 'Conveyor', 'HVAC', 'Electrical'
  classification: text('classification').notNull(), // 'Critical Production', 'Secondary', 'Facility'
  manufacturer: text('manufacturer'),
  model: text('model'),
  serialNumber: text('serial_number'),
  location: text('location').notNull(), // 'Building A - Plant Floor 1'
  parentAssetId: integer('parent_asset_id'),
  criticality: text('criticality').notNull().default('MEDIUM'), // 'HIGH', 'MEDIUM', 'LOW'
  installationDate: text('installation_date'),
  commissioningDate: text('commissioning_date'),
  status: text('status').notNull().default('OPERATIONAL'), // 'OPERATIONAL', 'DEGRADED', 'DOWN', 'MAINTENANCE'
  downtimeHoursTotal: integer('downtime_hours_total').default(0),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const equipmentTypes = pgTable('asset_equipment_types', {
  id: serial('id').primaryKey(),
  code: text('code').notNull().unique(),
  name: text('name').notNull(),
  description: text('description'),
});

export const equipmentLocations = pgTable('asset_equipment_locations', {
  id: serial('id').primaryKey(),
  code: text('code').notNull().unique(),
  name: text('name').notNull(),
  building: text('building').notNull(),
  area: text('area').notNull(),
});

// ==========================================
// SHARED WORKFORCE / TECHNICIAN FOUNDATION TABLES
// ==========================================

export const employees = pgTable('workforce_employees', {
  id: serial('id').primaryKey(),
  employeeNumber: text('employee_number').notNull().unique(), // e.g. 'EMP-1042'
  firstName: text('first_name').notNull(),
  lastName: text('last_name').notNull(),
  email: text('email').notNull().unique(),
  phone: text('phone'),
  jobTitle: text('job_title').notNull(), // 'Senior Mechanical Technician', 'Electrical Lead', etc.
  department: text('department').notNull(), // 'Mechanical Maintenance', 'Electrical', 'Reliability'
  shift: text('shift').notNull().default('DAY'), // 'DAY', 'EVENING', 'NIGHT', 'ROTATING'
  status: text('status').notNull().default('ACTIVE'), // 'ACTIVE', 'ON_LEAVE', 'OFF_DUTY'
  hourlyRate: integer('hourly_rate').default(45),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const attendanceRecords = pgTable('workforce_attendance_records', {
  id: serial('id').primaryKey(),
  employeeId: integer('employee_id').references(() => employees.id).notNull(),
  date: text('date').notNull(),
  status: text('status').notNull(), // 'PRESENT', 'ABSENT', 'LATE', 'ON_CALL'
  checkIn: text('check_in'),
  checkOut: text('check_out'),
});

export const overtimeRecords = pgTable('workforce_overtime_records', {
  id: serial('id').primaryKey(),
  employeeId: integer('employee_id').references(() => employees.id).notNull(),
  date: text('date').notNull(),
  hours: integer('hours').notNull(),
  reason: text('reason').notNull(),
  approved: boolean('approved').notNull().default(false),
});

// ==========================================
// FAULT MANAGEMENT MODULE TABLES
// ==========================================

export const faults = pgTable('fault_faults', {
  id: serial('id').primaryKey(),
  faultNumber: text('fault_number').notNull().unique(), // e.g. 'FLT-2026-001'
  title: text('title').notNull(),
  description: text('description').notNull(),
  equipmentId: integer('equipment_id').references(() => equipment.id).notNull(),
  reporterId: integer('reporter_id').references(() => employees.id).notNull(),
  assignedTechnicianId: integer('assigned_technician_id').references(() => employees.id),
  priority: text('priority').notNull().default('MEDIUM'), // 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW'
  severity: text('severity').notNull().default('MAJOR'), // 'CATASTROPHIC', 'CRITICAL', 'MAJOR', 'MINOR'
  status: text('status').notNull().default('REPORTED'), // 'REPORTED', 'IN_REVIEW', 'IN_PROGRESS', 'PENDING_PARTS', 'RESOLVED', 'CLOSED'
  failureCode: text('failure_code').notNull(), // 'MEC-BEARING-01', 'ELE-OVERHEAT-02', etc.
  failureCategory: text('failure_category').notNull().default('MECHANICAL'),
  rootCause: text('root_cause'),
  correctiveAction: text('corrective_action'),
  downtimeMinutes: integer('downtime_minutes').notNull().default(0),
  repairCost: integer('repair_cost').notNull().default(0),
  reportedAt: timestamp('reported_at').defaultNow().notNull(),
  startedAt: timestamp('started_at'),
  resolvedAt: timestamp('resolved_at'),
  closedAt: timestamp('closed_at'),
  customFieldValues: jsonb('custom_field_values').$type<Record<string, unknown>>().default({}),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const faultFieldDefinitions = pgTable('fault_field_definitions', {
  id: serial('id').primaryKey(),
  fieldName: text('field_name').notNull().unique(), // e.g. 'vibration_level_mm_s'
  fieldLabel: text('field_label').notNull(),
  fieldType: text('field_type').notNull(), // 'TEXT', 'NUMBER', 'SELECT', 'BOOLEAN', 'DATE'
  required: boolean('required').notNull().default(false),
  options: jsonb('options').$type<string[]>().default([]),
  orderIndex: integer('order_index').notNull().default(0),
  active: boolean('active').notNull().default(true),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const faultFieldValues = pgTable('fault_field_values', {
  id: serial('id').primaryKey(),
  faultId: integer('fault_id').references(() => faults.id).notNull(),
  fieldId: integer('field_id').references(() => faultFieldDefinitions.id).notNull(),
  value: text('value').notNull(),
});

// ==========================================
// FUTURE MODULES FOUNDATION TABLES
// (Extensible, isolated schema definitions)
// ==========================================

export const pmPlans = pgTable('preventive_pm_plans', {
  id: serial('id').primaryKey(),
  planCode: text('plan_code').notNull().unique(),
  title: text('title').notNull(),
  equipmentType: text('equipment_type').notNull(),
  frequencyDays: integer('frequency_days').notNull(),
  estimatedHours: integer('estimated_hours').notNull(),
  active: boolean('active').notNull().default(true),
});

export const pmTasks = pgTable('preventive_pm_tasks', {
  id: serial('id').primaryKey(),
  planId: integer('plan_id').references(() => pmPlans.id).notNull(),
  taskDescription: text('task_description').notNull(),
  orderIndex: integer('order_index').notNull(),
});

export const pmSchedules = pgTable('preventive_pm_schedules', {
  id: serial('id').primaryKey(),
  planId: integer('plan_id').references(() => pmPlans.id).notNull(),
  equipmentId: integer('equipment_id').references(() => equipment.id).notNull(),
  nextDueDate: text('next_due_date').notNull(),
  assignedToId: integer('assigned_to_id').references(() => employees.id),
  status: text('status').notNull().default('SCHEDULED'), // 'SCHEDULED', 'DUE', 'OVERDUE', 'COMPLETED'
});

export const inventoryItems = pgTable('inventory_items', {
  id: serial('id').primaryKey(),
  itemCode: text('item_code').notNull().unique(),
  name: text('name').notNull(),
  category: text('category').notNull(),
  unit: text('unit').notNull().default('PCS'),
  unitCost: integer('unit_cost').notNull().default(0),
  quantityOnHand: integer('quantity_on_hand').notNull().default(0),
  minimumLevel: integer('minimum_level').notNull().default(5),
  reorderPoint: integer('reorder_point').notNull().default(10),
  warehouseLocation: text('warehouse_location'),
});

// ==========================================
// DRIZZLE RELATIONS
// ==========================================

export const faultsRelations = relations(faults, ({ one }) => ({
  equipment: one(equipment, {
    fields: [faults.equipmentId],
    references: [equipment.id],
  }),
  reporter: one(employees, {
    fields: [faults.reporterId],
    references: [employees.id],
  }),
  assignedTechnician: one(employees, {
    fields: [faults.assignedTechnicianId],
    references: [employees.id],
  }),
}));

export const equipmentRelations = relations(equipment, ({ many }) => ({
  faults: many(faults),
  pmSchedules: many(pmSchedules),
}));
