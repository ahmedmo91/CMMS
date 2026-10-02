export type ShiftType = 'DAY' | 'EVENING' | 'NIGHT' | 'ROTATING';
export type EmployeeStatus = 'ACTIVE' | 'ON_LEAVE' | 'OFF_DUTY';

export interface Employee {
  id: number;
  employeeNumber: string; // 'EMP-001'
  firstName: string;
  lastName: string;
  name: string;
  email: string;
  phone: string;
  jobTitle: string;
  department: string;
  shift: ShiftType;
  status: EmployeeStatus;
  hourlyRate: number;
  specializations: string[];
  avatarUrl: string;
  assignedFaultsCount?: number;
}
