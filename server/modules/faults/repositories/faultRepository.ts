import { CreateFaultPayload, UpdateFaultPayload } from '../schemas/index.ts';

// In-memory / persistent backend repository mapping to Drizzle schema
export class FaultRepository {
  private static instance: FaultRepository;
  private faults: any[] = [];

  private constructor() {
    this.seed();
  }

  public static getInstance(): FaultRepository {
    if (!FaultRepository.instance) {
      FaultRepository.instance = new FaultRepository();
    }
    return FaultRepository.instance;
  }

  private seed() {
    this.faults = [
      {
        id: 1,
        faultNumber: 'FLT-2026-084',
        title: 'High Spindle Vibration & Bearing Noise at 12,000 RPM',
        description: 'Abnormal harmonic vibration and thermal alarm on primary milling spindle.',
        equipmentId: 1,
        reporterId: 6,
        assignedTechnicianId: 3,
        priority: 'CRITICAL',
        severity: 'CRITICAL',
        status: 'IN_PROGRESS',
        failureCode: 'MEC-SPINDLE-01',
        failureCategory: 'MECHANICAL',
        downtimeMinutes: 210,
        repairCost: 4800,
        reportedAt: '2026-09-30 08:15:00',
      },
      {
        id: 2,
        faultNumber: 'FLT-2026-083',
        title: 'Main Hydraulic Manifold Flange Seal Weepage',
        description: 'Hydraulic fluid pooling under secondary cylinder manifold.',
        equipmentId: 2,
        reporterId: 4,
        assignedTechnicianId: 4,
        priority: 'HIGH',
        severity: 'MAJOR',
        status: 'IN_PROGRESS',
        failureCode: 'HYD-LEAK-02',
        failureCategory: 'HYDRAULIC',
        downtimeMinutes: 180,
        repairCost: 650,
        reportedAt: '2026-09-29 14:20:00',
      },
    ];
  }

  async findAll() {
    return this.faults;
  }

  async findById(id: number) {
    return this.faults.find(f => f.id === id);
  }

  async create(data: CreateFaultPayload) {
    const id = this.faults.length + 1;
    const faultNumber = `FLT-${new Date().getFullYear()}-${String(84 + id).padStart(3, '0')}`;
    const newRecord = {
      ...data,
      id,
      faultNumber,
      status: 'REPORTED',
      reportedAt: new Date().toISOString(),
    };
    this.faults.unshift(newRecord);
    return newRecord;
  }

  async update(id: number, updates: UpdateFaultPayload) {
    const idx = this.faults.findIndex(f => f.id === id);
    if (idx === -1) return null;
    this.faults[idx] = { ...this.faults[idx], ...updates, updatedAt: new Date().toISOString() };
    return this.faults[idx];
  }
}
