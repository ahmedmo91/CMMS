export interface User {
  id: string;
  employeeId?: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'MAINT_SUPERVISOR' | 'TECHNICIAN' | 'OPERATOR' | 'VIEWER';
  jobTitle: string;
  department: string;
  avatarUrl: string;
  password?: string;
  status?: 'ACTIVE' | 'SUSPENDED';
  createdAt?: string;
  lastLoginAt?: string;
}

export const PRESET_USERS: User[] = [
  {
    id: 'usr-admin-1',
    employeeId: 'EMP-001',
    name: 'Marcus Vance',
    email: 'marcus.vance@apexcooling.com',
    role: 'ADMIN',
    jobTitle: 'Plant Engineering Director',
    department: 'Plant Operations & Engineering',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
    password: 'AdminPassword#2026',
    status: 'ACTIVE',
    createdAt: '2026-01-10 09:00:00',
    lastLoginAt: '2026-09-30 08:30:15',
  },
  {
    id: 'usr-sup-2',
    employeeId: 'EMP-014',
    name: 'Elena Rostova',
    email: 'elena.rostova@apexcooling.com',
    role: 'MAINT_SUPERVISOR',
    jobTitle: 'Maintenance Operations Supervisor',
    department: 'Maintenance & Reliability',
    avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=120&auto=format&fit=crop&q=80',
    password: 'Supervisor#2026',
    status: 'ACTIVE',
    createdAt: '2026-02-14 11:30:00',
    lastLoginAt: '2026-09-30 07:12:00',
  },
  {
    id: 'usr-tech-3',
    employeeId: 'EMP-028',
    name: 'David Kim',
    email: 'david.kim@apexcooling.com',
    role: 'TECHNICIAN',
    jobTitle: 'Lead Electro-Mechanical Technician',
    department: 'Mechanical Maintenance',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
    password: 'Technician#2026',
    status: 'ACTIVE',
    createdAt: '2026-03-01 08:00:00',
    lastLoginAt: '2026-09-29 16:45:00',
  },
  {
    id: 'usr-op-4',
    employeeId: 'EMP-055',
    name: 'Sarah Jenkins',
    email: 'sarah.jenkins@apexcooling.com',
    role: 'OPERATOR',
    jobTitle: 'Senior CNC Line Operator',
    department: 'Production Machining',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&auto=format&fit=crop&q=80',
    password: 'OperatorPass#2026',
    status: 'ACTIVE',
    createdAt: '2026-04-12 14:15:00',
    lastLoginAt: '2026-09-30 06:55:00',
  },
  {
    id: 'usr-view-5',
    employeeId: 'EMP-090',
    name: 'Robert Thorne',
    email: 'robert.thorne@apexindustrial.com',
    role: 'VIEWER',
    jobTitle: 'Quality & Compliance Auditor',
    department: 'Safety & Quality Assurance',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80',
    password: 'ViewerAudit#2026',
    status: 'ACTIVE',
    createdAt: '2026-05-20 10:00:00',
    lastLoginAt: '2026-09-28 15:20:00',
  },
];
