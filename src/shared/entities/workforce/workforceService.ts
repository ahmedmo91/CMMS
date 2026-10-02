import { Employee } from './types.ts';

const SEED_EMPLOYEES: Employee[] = [
  {
    id: 1,
    employeeNumber: 'EMP-001',
    firstName: 'Marcus',
    lastName: 'Vance',
    name: 'Marcus Vance',
    email: 'marcus.vance@apexcooling.com',
    phone: '+1 (555) 234-9001',
    jobTitle: 'Plant Engineering Director',
    department: 'Plant Operations & Engineering',
    shift: 'DAY',
    status: 'ACTIVE',
    hourlyRate: 85,
    specializations: ['Reliability Strategy', 'Asset Lifecycle', 'Safety Compliance'],
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
  },
  {
    id: 2,
    employeeNumber: 'EMP-014',
    firstName: 'Elena',
    lastName: 'Rostova',
    name: 'Elena Rostova',
    email: 'elena.rostova@apexcooling.com',
    phone: '+1 (555) 234-9014',
    jobTitle: 'Maintenance Operations Supervisor',
    department: 'Maintenance & Reliability',
    shift: 'DAY',
    status: 'ACTIVE',
    hourlyRate: 60,
    specializations: ['Preventive Planning', 'Root Cause Analysis', 'Work Scheduling'],
    avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=120&auto=format&fit=crop&q=80',
  },
  {
    id: 3,
    employeeNumber: 'EMP-028',
    firstName: 'David',
    lastName: 'Kim',
    name: 'David Kim',
    email: 'david.kim@apexcooling.com',
    phone: '+1 (555) 234-9028',
    jobTitle: 'Lead Electro-Mechanical Technician',
    department: 'Mechanical Maintenance',
    shift: 'DAY',
    status: 'ACTIVE',
    hourlyRate: 48,
    specializations: ['CNC Spindle Overhauls', 'Bearing Diagnostics', 'Vibration Analysis'],
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
  },
  {
    id: 4,
    employeeNumber: 'EMP-035',
    firstName: 'Carlos',
    lastName: 'Mendoza',
    name: 'Carlos Mendoza',
    email: 'carlos.mendoza@apexcooling.com',
    phone: '+1 (555) 234-9035',
    jobTitle: 'Senior Hydraulic & Pneumatics Tech',
    department: 'Mechanical Maintenance',
    shift: 'DAY',
    status: 'ACTIVE',
    hourlyRate: 46,
    specializations: ['Hydraulic Proportional Valves', 'Seal Overhaul', 'Fluid Power Systems'],
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80',
  },
  {
    id: 5,
    employeeNumber: 'EMP-042',
    firstName: 'Ananya',
    lastName: 'Patel',
    name: 'Ananya Patel',
    email: 'ananya.patel@apexcooling.com',
    phone: '+1 (555) 234-9042',
    jobTitle: 'Controls & Automation Engineer',
    department: 'Electrical & Controls',
    shift: 'ROTATING',
    status: 'ACTIVE',
    hourlyRate: 52,
    specializations: ['Siemens S7 PLC', 'Allen-Bradley GuardLogix', 'Kuka KRC4 Robotics'],
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
  },
  {
    id: 6,
    employeeNumber: 'EMP-055',
    firstName: 'Sarah',
    lastName: 'Jenkins',
    name: 'Sarah Jenkins',
    email: 'sarah.jenkins@apexcooling.com',
    phone: '+1 (555) 234-9055',
    jobTitle: 'Senior CNC Line Operator',
    department: 'Production Machining',
    shift: 'DAY',
    status: 'ACTIVE',
    hourlyRate: 35,
    specializations: ['G-Code Execution', 'Machining Safety', 'First-Line Fault Reporting'],
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&auto=format&fit=crop&q=80',
  },
  {
    id: 7,
    employeeNumber: 'EMP-063',
    firstName: 'James',
    lastName: 'Wilson',
    name: 'James Wilson',
    email: 'james.wilson@apexcooling.com',
    phone: '+1 (555) 234-9063',
    jobTitle: 'Certified Master Electrician',
    department: 'Electrical & Controls',
    shift: 'EVENING',
    status: 'ACTIVE',
    hourlyRate: 50,
    specializations: ['High Voltage Switchgear', 'VFDs & Soft Starters', 'Thermal Thermography'],
    avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&auto=format&fit=crop&q=80',
  },
];

class WorkforceService {
  private storageKey = 'apex_workforce_data';

  private getItems(): Employee[] {
    const raw = localStorage.getItem(this.storageKey);
    if (!raw) {
      localStorage.setItem(this.storageKey, JSON.stringify(SEED_EMPLOYEES));
      return SEED_EMPLOYEES;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return SEED_EMPLOYEES;
    }
  }

  getAll(): Employee[] {
    return this.getItems();
  }

  getById(id: number): Employee | undefined {
    return this.getItems().find(e => e.id === id);
  }

  getTechnicians(): Employee[] {
    return this.getItems().filter(e =>
      e.jobTitle.toLowerCase().includes('tech') ||
      e.jobTitle.toLowerCase().includes('engineer') ||
      e.jobTitle.toLowerCase().includes('electrician')
    );
  }
}

export const workforceService = new WorkforceService();
