import { Fault, FaultPriority, FaultStatus } from '../schemas/faultTypes.ts';
import { equipmentService } from '../../../shared/entities/equipment/equipmentService.ts';
import { auditService } from '../../../core/audit/auditService.ts';

const SEED_FAULTS: Fault[] = [
  {
    id: 1,
    faultNumber: 'FLT-2026-084',
    title: 'High Spindle Vibration & Bearing Noise at 12,000 RPM',
    description: 'Operator detected abnormal harmonic vibration and high temperature alarm on the primary milling spindle during roughing cycle on aerospace titanium fixture.',
    equipmentId: 1, // CNC-04 (Machining Bay 3)
    reporterId: 6, // Sarah Jenkins (Operator)
    assignedTechnicianId: 3, // David Kim (Lead Tech)
    priority: 'CRITICAL',
    severity: 'CRITICAL',
    status: 'IN_PROGRESS',
    failureCode: 'MEC-SPINDLE-01',
    failureCategory: 'MECHANICAL',
    rootCause: 'Accelerated micro-pitting on inner bearing race due to high radial cutting loads.',
    correctiveAction: 'Isolate spindle drive, install temporary vibration sensor, prepare replacement ceramic hybrid spindle cartridge.',
    downtimeMinutes: 210,
    repairCost: 4800,
    reportedAt: '2026-09-30 08:15:00',
    startedAt: '2026-09-30 08:45:00',
    customFieldValues: {
      vibration_level: 7.8,
      oil_contamination_level: 'Particulate Contamination',
      safety_incident_occurred: false,
      environmental_impact: 'None',
    },
    timeline: [
      {
        id: 'tl-1',
        timestamp: '2026-09-30 08:15:00',
        userId: 'usr-op-4',
        userName: 'Sarah Jenkins',
        action: 'Reported Fault',
        notes: 'Spindle warning amber beacon triggered automatically by Fanuc CNC controller.',
      },
      {
        id: 'tl-2',
        timestamp: '2026-09-30 08:45:00',
        userId: 'usr-sup-2',
        userName: 'Elena Rostova',
        action: 'Assigned to David Kim',
        notes: 'Priority elevated to CRITICAL. Machine halted.',
      },
      {
        id: 'tl-3',
        timestamp: '2026-09-30 09:10:00',
        userId: 'usr-tech-3',
        userName: 'David Kim',
        action: 'Work Commenced',
        notes: 'Lockout/tagout completed. Thermal imaging confirms 84C on front bearing housing.',
      },
    ],
  },
  {
    id: 2,
    faultNumber: 'FLT-2026-083',
    title: 'Main Hydraulic Manifold Flange Seal Weepage',
    description: 'Hydraulic fluid pooling under secondary cylinder manifold on 200T Extrusion Press. Pressure drop of 15 bar observed under maximum tonnage.',
    equipmentId: 2, // HP-200
    reporterId: 4, // Carlos Mendoza
    assignedTechnicianId: 4, // Carlos Mendoza
    priority: 'HIGH',
    severity: 'MAJOR',
    status: 'IN_PROGRESS',
    failureCode: 'HYD-LEAK-02',
    failureCategory: 'HYDRAULIC',
    rootCause: 'Nitrile O-ring degradation due to hydraulic oil thermal cycles exceeding 70C.',
    correctiveAction: 'Replacing with high-temp Viton fluoroelastomer seal pack and retorquing flange bolts to 140 Nm.',
    downtimeMinutes: 180,
    repairCost: 650,
    reportedAt: '2026-09-29 14:20:00',
    startedAt: '2026-09-29 15:00:00',
    customFieldValues: {
      vibration_level: 1.2,
      oil_contamination_level: 'Clean / Normal',
      safety_incident_occurred: false,
      environmental_impact: 'Minor Containment Area',
    },
    timeline: [
      {
        id: 'tl-4',
        timestamp: '2026-09-29 14:20:00',
        userId: 'usr-sup-2',
        userName: 'Carlos Mendoza',
        action: 'Reported & Assigned',
        notes: 'Drip tray placed immediately under manifold block.',
      },
    ],
  },
  {
    id: 3,
    faultNumber: 'FLT-2026-082',
    title: 'Sorter Infeed Photoelectric Sensor Optical Blinding',
    description: 'Conveyor Line B packaging diverter failed to actuate due to optical sensor dust accumulation.',
    equipmentId: 3, // CV-02
    reporterId: 6, // Sarah Jenkins
    assignedTechnicianId: 5, // Ananya Patel
    priority: 'LOW',
    severity: 'MINOR',
    status: 'RESOLVED',
    failureCode: 'SEN-ALIGN-01',
    failureCategory: 'ELECTRONIC_SENSOR',
    rootCause: 'Cardboard fiber dust adhered to optical receiver aperture.',
    correctiveAction: 'Cleaned optics with isopropyl swab, aligned bracket, verified trigger on test tote.',
    preventiveRecommendation: 'Add weekly air-blow cleaning step to operator PM checklist.',
    downtimeMinutes: 25,
    repairCost: 80,
    reportedAt: '2026-09-29 10:10:00',
    startedAt: '2026-09-29 10:20:00',
    resolvedAt: '2026-09-29 10:45:00',
    closedAt: '2026-09-29 11:30:00',
    customFieldValues: {
      vibration_level: 0.4,
      oil_contamination_level: 'Clean / Normal',
      safety_incident_occurred: false,
      environmental_impact: 'None',
    },
    timeline: [
      {
        id: 'tl-5',
        timestamp: '2026-09-29 10:10:00',
        userId: 'usr-op-4',
        userName: 'Sarah Jenkins',
        action: 'Reported Fault',
      },
      {
        id: 'tl-6',
        timestamp: '2026-09-29 10:45:00',
        userId: 'usr-tech-3',
        userName: 'Ananya Patel',
        action: 'Resolved & Tested',
        notes: 'Tested 50 consecutive divert cycles with 100% accuracy.',
      },
    ],
  },
  {
    id: 4,
    faultNumber: 'FLT-2026-081',
    title: 'Arc Welding Robotic Arm Axis 4 Drive Overcurrent Trip',
    description: 'Kuka robot Axis 4 servo amplifier threw error E-A4-OC during rapid positioning between weld seams.',
    equipmentId: 5, // WLD-01
    reporterId: 5, // Ananya Patel
    assignedTechnicianId: 5, // Ananya Patel
    priority: 'HIGH',
    severity: 'MAJOR',
    status: 'PENDING_PARTS',
    failureCode: 'ELE-DRIVE-02',
    failureCategory: 'ELECTRICAL',
    rootCause: 'Internal IGBT gate driver transistor breakdown on KRC4 servo pack.',
    correctiveAction: 'Expedited replacement KSD1-32 drive unit ordered from Kuka central warehouse.',
    downtimeMinutes: 480,
    repairCost: 3200,
    reportedAt: '2026-09-28 16:30:00',
    startedAt: '2026-09-28 17:00:00',
    customFieldValues: {
      vibration_level: 0.9,
      oil_contamination_level: 'Clean / Normal',
      safety_incident_occurred: false,
      environmental_impact: 'None',
    },
    timeline: [
      {
        id: 'tl-7',
        timestamp: '2026-09-28 16:30:00',
        userId: 'usr-tech-3',
        userName: 'Ananya Patel',
        action: 'Reported Fault',
      },
      {
        id: 'tl-8',
        timestamp: '2026-09-28 18:00:00',
        userId: 'usr-sup-2',
        userName: 'Elena Rostova',
        action: 'PO #4491 Placed for Replacement Drive',
        notes: 'ETA next morning 09:00 AM.',
      },
    ],
  },
  {
    id: 5,
    faultNumber: 'FLT-2026-080',
    title: 'Air Compressor Condensate Auto-Drain Valve Stuck Closed',
    description: 'Moisture buildup detected in secondary receiver tank due to solenoid valve scale blockage.',
    equipmentId: 6, // AC-03
    reporterId: 3, // David Kim
    assignedTechnicianId: 4, // Carlos Mendoza
    priority: 'MEDIUM',
    severity: 'MINOR',
    status: 'CLOSED',
    failureCode: 'PNEU-REG-01',
    failureCategory: 'PNEUMATIC',
    rootCause: 'Mineral scale buildup inside drain orifice.',
    correctiveAction: 'Disassembled solenoid valve, ultrasonic cleaned orifice, installed new diaphragm kit.',
    preventiveRecommendation: 'Check auto-drain test button on daily shift inspection rounds.',
    downtimeMinutes: 40,
    repairCost: 150,
    reportedAt: '2026-09-27 09:00:00',
    startedAt: '2026-09-27 09:30:00',
    resolvedAt: '2026-09-27 10:10:00',
    closedAt: '2026-09-27 12:00:00',
    customFieldValues: {
      vibration_level: 0.5,
      oil_contamination_level: 'Clean / Normal',
      safety_incident_occurred: false,
      environmental_impact: 'None',
    },
    timeline: [],
  },
  {
    id: 6,
    faultNumber: 'FLT-2026-079',
    title: 'Chiller Compressor Oil Sump Low Pressure Alarm',
    description: 'Trane 500-ton chiller reported lube differential pressure alarm below 1.2 bar on startup.',
    equipmentId: 4, // CH-01
    reporterId: 2, // Elena Rostova
    assignedTechnicianId: 3, // David Kim
    priority: 'MEDIUM',
    severity: 'MAJOR',
    status: 'CLOSED',
    failureCode: 'HYD-PUMP-03',
    failureCategory: 'HYDRAULIC',
    rootCause: 'Lube oil filter cartridge clogged by copper particulates.',
    correctiveAction: 'Replaced dual oil filters, added 10 gallons of approved POE synthetic lubricant, pulled vacuum and restarted.',
    downtimeMinutes: 195,
    repairCost: 1100,
    reportedAt: '2026-09-25 07:45:00',
    startedAt: '2026-09-25 08:30:00',
    resolvedAt: '2026-09-25 11:45:00',
    closedAt: '2026-09-25 13:00:00',
    customFieldValues: {
      vibration_level: 1.1,
      oil_contamination_level: 'Slight Cloudiness',
      safety_incident_occurred: false,
      environmental_impact: 'None',
    },
    timeline: [],
  },
];

class FaultService {
  private storageKey = 'apex_faults_data';

  private getFaults(): Fault[] {
    const raw = localStorage.getItem(this.storageKey);
    if (!raw) {
      localStorage.setItem(this.storageKey, JSON.stringify(SEED_FAULTS));
      return SEED_FAULTS;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return SEED_FAULTS;
    }
  }

  private saveFaults(items: Fault[]) {
    localStorage.setItem(this.storageKey, JSON.stringify(items));
  }

  getAll(): Fault[] {
    return this.getFaults();
  }

  getById(id: number): Fault | undefined {
    return this.getFaults().find(f => f.id === id);
  }

  getByFaultNumber(faultNumber: string): Fault | undefined {
    return this.getFaults().find(f => f.faultNumber.toLowerCase() === faultNumber.toLowerCase());
  }

  create(faultData: Omit<Fault, 'id' | 'faultNumber' | 'timeline'>, user: { id: string; name: string; role: string }): Fault {
    const faults = this.getFaults();
    const nextId = Math.max(...faults.map(f => f.id), 0) + 1;
    const year = new Date().getFullYear();
    const padNum = String(84 + nextId).padStart(3, '0');
    const faultNumber = `FLT-${year}-${padNum}`;

    const newFault: Fault = {
      ...faultData,
      id: nextId,
      faultNumber,
      timeline: [
        {
          id: `tl-${Date.now()}`,
          timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
          userId: user.id,
          userName: user.name,
          action: 'Fault Recorded',
          notes: faultData.description.slice(0, 100) + '...',
        },
      ],
    };

    faults.unshift(newFault);
    this.saveFaults(faults);

    // Cross-module update: Update Equipment status if priority is Critical or High
    if (newFault.priority === 'CRITICAL') {
      equipmentService.updateStatus(newFault.equipmentId, 'DOWN');
    } else if (newFault.priority === 'HIGH') {
      equipmentService.updateStatus(newFault.equipmentId, 'DEGRADED');
    }

    // Log to Core Audit
    auditService.log({
      userId: user.id,
      userName: user.name,
      userRole: user.role,
      moduleId: 'faults',
      action: 'CREATE',
      entityType: 'FAULT',
      entityId: faultNumber,
      description: `Logged fault ${faultNumber}: ${newFault.title}`,
      details: { equipmentId: newFault.equipmentId, priority: newFault.priority, failureCode: newFault.failureCode },
    });

    return newFault;
  }

  update(id: number, updates: Partial<Fault>, user: { id: string; name: string; role: string }): Fault | undefined {
    const faults = this.getFaults();
    const idx = faults.findIndex(f => f.id === id);
    if (idx === -1) return undefined;

    const current = faults[idx];
    const updated: Fault = {
      ...current,
      ...updates,
      timeline: [
        {
          id: `tl-${Date.now()}`,
          timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
          userId: user.id,
          userName: user.name,
          action: 'Updated Fault Details',
        },
        ...current.timeline,
      ],
    };

    faults[idx] = updated;
    this.saveFaults(faults);

    auditService.log({
      userId: user.id,
      userName: user.name,
      userRole: user.role,
      moduleId: 'faults',
      action: 'UPDATE',
      entityType: 'FAULT',
      entityId: current.faultNumber,
      description: `Updated fault details for ${current.faultNumber}`,
    });

    return updated;
  }

  updateStatus(
    id: number,
    status: FaultStatus,
    user: { id: string; name: string; role: string },
    notes?: string,
    additionalDetails?: { rootCause?: string; correctiveAction?: string; downtimeMinutes?: number; repairCost?: number }
  ): Fault | undefined {
    const faults = this.getFaults();
    const idx = faults.findIndex(f => f.id === id);
    if (idx === -1) return undefined;

    const current = faults[idx];
    const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 19);

    const updated: Fault = {
      ...current,
      status,
      ...(additionalDetails || {}),
      ...(status === 'IN_PROGRESS' && !current.startedAt ? { startedAt: nowStr } : {}),
      ...(status === 'RESOLVED' ? { resolvedAt: nowStr } : {}),
      ...(status === 'CLOSED' ? { closedAt: nowStr } : {}),
      timeline: [
        {
          id: `tl-${Date.now()}`,
          timestamp: nowStr,
          userId: user.id,
          userName: user.name,
          action: `Status changed to ${status}`,
          notes,
        },
        ...current.timeline,
      ],
    };

    faults[idx] = updated;
    this.saveFaults(faults);

    // Cross-module update: restore equipment status if resolved or closed
    if (status === 'RESOLVED' || status === 'CLOSED') {
      // Check if there are other open faults on the same equipment
      const otherOpen = faults.some(f => f.equipmentId === current.equipmentId && f.id !== id && (f.status === 'REPORTED' || f.status === 'IN_PROGRESS'));
      if (!otherOpen) {
        equipmentService.updateStatus(current.equipmentId, 'OPERATIONAL');
      }
    }

    auditService.log({
      userId: user.id,
      userName: user.name,
      userRole: user.role,
      moduleId: 'faults',
      action: status === 'RESOLVED' ? 'RESOLVE' : 'STATUS_CHANGE',
      entityType: 'FAULT',
      entityId: current.faultNumber,
      description: `Fault ${current.faultNumber} status changed to ${status}`,
      details: { previousStatus: current.status, newStatus: status, notes },
    });

    return updated;
  }

  getStatistics() {
    const faults = this.getFaults();
    const total = faults.length;
    const open = faults.filter(f => f.status === 'REPORTED' || f.status === 'IN_REVIEW').length;
    const inProgress = faults.filter(f => f.status === 'IN_PROGRESS' || f.status === 'PENDING_PARTS').length;
    const resolved = faults.filter(f => f.status === 'RESOLVED' || f.status === 'CLOSED').length;

    const totalDowntimeMinutes = faults.reduce((sum, f) => sum + (f.downtimeMinutes || 0), 0);
    const totalRepairCost = faults.reduce((sum, f) => sum + (f.repairCost || 0), 0);

    const resolvedFaults = faults.filter(f => f.status === 'RESOLVED' || f.status === 'CLOSED');
    const avgRepairMinutes = resolvedFaults.length
      ? Math.round(resolvedFaults.reduce((sum, f) => sum + f.downtimeMinutes, 0) / resolvedFaults.length)
      : 0;

    // By Priority
    const priorityCounts: Record<FaultPriority, number> = {
      CRITICAL: faults.filter(f => f.priority === 'CRITICAL').length,
      HIGH: faults.filter(f => f.priority === 'HIGH').length,
      MEDIUM: faults.filter(f => f.priority === 'MEDIUM').length,
      LOW: faults.filter(f => f.priority === 'LOW').length,
    };

    // By Equipment Location
    const allEq = equipmentService.getAll();
    const eqMap = new Map(allEq.map(e => [e.id, e]));

    const locationMap: Record<string, { count: number; downtimeMin: number }> = {};
    faults.forEach(f => {
      const eq = eqMap.get(f.equipmentId);
      const loc = eq ? eq.location.split(' - ')[0] : 'Unknown Bay';
      if (!locationMap[loc]) {
        locationMap[loc] = { count: 0, downtimeMin: 0 };
      }
      locationMap[loc].count += 1;
      locationMap[loc].downtimeMin += f.downtimeMinutes || 0;
    });

    // Trend (Last 6 Months)
    const monthlyTrend = [
      { month: 'Apr', faults: 14, downtimeHours: 28 },
      { month: 'May', faults: 18, downtimeHours: 35 },
      { month: 'Jun', faults: 12, downtimeHours: 20 },
      { month: 'Jul', faults: 22, downtimeHours: 48 },
      { month: 'Aug', faults: 16, downtimeHours: 31 },
      { month: 'Sep', faults: total, downtimeHours: Math.round(totalDowntimeMinutes / 60) },
    ];

    return {
      total,
      open,
      inProgress,
      resolved,
      totalDowntimeMinutes,
      totalDowntimeHours: (totalDowntimeMinutes / 60).toFixed(1),
      avgRepairMinutes,
      avgRepairHours: (avgRepairMinutes / 60).toFixed(1),
      totalRepairCost,
      priorityCounts,
      locationMap,
      monthlyTrend,
    };
  }
}

export const faultService = new FaultService();
