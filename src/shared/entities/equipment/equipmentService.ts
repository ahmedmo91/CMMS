import { Equipment, EquipmentLocation, EquipmentType } from './types.ts';

const SEED_EQUIPMENT: Equipment[] = [
  {
    id: 1,
    assetId: 'EQ-2024-001',
    equipmentNumber: 'CNC-04',
    name: 'CNC 5-Axis Milling Center',
    type: 'Machining',
    classification: 'Critical Production',
    manufacturer: 'DMG MORI',
    model: 'DMU 50 3rd Gen',
    serialNumber: 'DMG-2023-9981',
    location: 'Building A - Machining Bay 3',
    criticality: 'CRITICAL',
    installationDate: '2023-04-15',
    commissioningDate: '2023-05-01',
    status: 'DOWN',
    downtimeHoursTotal: 18.5,
    lastFaultDate: '2026-09-29',
    mttrHours: 3.2,
  },
  {
    id: 2,
    assetId: 'EQ-2024-002',
    equipmentNumber: 'HP-200',
    name: 'Hydraulic Extrusion Press 200T',
    type: 'Hydraulics',
    classification: 'Critical Production',
    manufacturer: 'Schuler',
    model: 'HP-200-EVO',
    serialNumber: 'SCH-7721-09',
    location: 'Building B - Heavy Forming',
    criticality: 'CRITICAL',
    installationDate: '2022-11-10',
    commissioningDate: '2022-12-05',
    status: 'DEGRADED',
    downtimeHoursTotal: 42.0,
    lastFaultDate: '2026-09-28',
    mttrHours: 4.8,
  },
  {
    id: 3,
    assetId: 'EQ-2024-003',
    equipmentNumber: 'CV-02',
    name: 'High-Speed Sorter Conveyor Line B',
    type: 'Conveyor',
    classification: 'Secondary',
    manufacturer: 'Dematic',
    model: 'SortMaster-X',
    serialNumber: 'DEM-9082-B',
    location: 'Logistics Hub - Packaging Bay',
    criticality: 'HIGH',
    installationDate: '2024-02-18',
    commissioningDate: '2024-03-01',
    status: 'OPERATIONAL',
    downtimeHoursTotal: 6.0,
    lastFaultDate: '2026-09-15',
    mttrHours: 1.5,
  },
  {
    id: 4,
    assetId: 'EQ-2024-004',
    equipmentNumber: 'CH-01',
    name: 'Centrifugal Water Chiller 500-Ton',
    type: 'HVAC & Utilities',
    classification: 'Facility Utility',
    manufacturer: 'Trane',
    model: 'EarthWise CenTraVac',
    serialNumber: 'TRN-500-881',
    location: 'Utilities Plant - Central Cooling',
    criticality: 'HIGH',
    installationDate: '2021-08-20',
    commissioningDate: '2021-09-15',
    status: 'OPERATIONAL',
    downtimeHoursTotal: 12.0,
    lastFaultDate: '2026-09-02',
    mttrHours: 6.0,
  },
  {
    id: 5,
    assetId: 'EQ-2024-005',
    equipmentNumber: 'WLD-01',
    name: 'Robotic Arc Welding Cell Kuka-01',
    type: 'Robotics',
    classification: 'Critical Production',
    manufacturer: 'KUKA Robotics',
    model: 'KR 16 R2010',
    serialNumber: 'KUK-4410-22',
    location: 'Building A - Automated Assembly',
    criticality: 'CRITICAL',
    installationDate: '2024-06-10',
    commissioningDate: '2024-06-25',
    status: 'MAINTENANCE',
    downtimeHoursTotal: 28.5,
    lastFaultDate: '2026-09-30',
    mttrHours: 2.9,
  },
  {
    id: 6,
    assetId: 'EQ-2024-006',
    equipmentNumber: 'AC-03',
    name: 'Rotary Screw Air Compressor 75HP',
    type: 'Pneumatics',
    classification: 'Facility Utility',
    manufacturer: 'Atlas Copco',
    model: 'GA 55+ VSD',
    serialNumber: 'AC-55-9012',
    location: 'Utilities Plant - Pneumatics Rm',
    criticality: 'HIGH',
    installationDate: '2023-01-14',
    commissioningDate: '2023-02-01',
    status: 'OPERATIONAL',
    downtimeHoursTotal: 4.0,
    lastFaultDate: '2026-08-14',
    mttrHours: 2.0,
  },
  {
    id: 7,
    assetId: 'EQ-2024-007',
    equipmentNumber: 'TR-01',
    name: 'Main Substation Transformer 11kV/415V',
    type: 'Electrical',
    classification: 'Critical Infrastructure',
    manufacturer: 'Siemens Energy',
    model: 'GEAFOL Cast-Resin 1600kVA',
    serialNumber: 'SIE-1600-09',
    location: 'Substation Yard - Primary Bay',
    criticality: 'CRITICAL',
    installationDate: '2020-03-10',
    commissioningDate: '2020-04-01',
    status: 'OPERATIONAL',
    downtimeHoursTotal: 0,
    mttrHours: 0,
  },
  {
    id: 8,
    assetId: 'EQ-2024-008',
    equipmentNumber: 'ASRS-01',
    name: 'Automated Storage Crane Mast #1',
    type: 'Logistics',
    classification: 'Secondary',
    manufacturer: 'SSI Schaefer',
    model: 'Exyz High-Bay Stacker',
    serialNumber: 'SSI-992-01',
    location: 'High Bay Warehouse - Aisle 4',
    criticality: 'MEDIUM',
    installationDate: '2023-09-05',
    commissioningDate: '2023-10-01',
    status: 'OPERATIONAL',
    downtimeHoursTotal: 8.5,
    lastFaultDate: '2026-09-10',
    mttrHours: 2.8,
  },
];

export const EQUIPMENT_LOCATIONS: EquipmentLocation[] = [
  { id: 'loc-1', code: 'BLD-A-M3', name: 'Machining Bay 3', building: 'Building A', area: 'Precision Machining' },
  { id: 'loc-2', code: 'BLD-A-ASM', name: 'Automated Assembly', building: 'Building A', area: 'Robotics & Welding' },
  { id: 'loc-3', code: 'BLD-B-HF', name: 'Heavy Forming', building: 'Building B', area: 'Hydraulics & Presses' },
  { id: 'loc-4', code: 'LOG-PKG', name: 'Packaging Bay', building: 'Logistics Hub', area: 'Conveying & Sorting' },
  { id: 'loc-5', code: 'UTL-COOL', name: 'Central Cooling', building: 'Utilities Plant', area: 'Chillers & Cooling Towers' },
  { id: 'loc-6', code: 'UTL-PNEU', name: 'Pneumatics Room', building: 'Utilities Plant', area: 'Air Compression' },
  { id: 'loc-7', code: 'SUB-YARD', name: 'Primary Yard', building: 'Substation Yard', area: 'High Voltage Transformation' },
  { id: 'loc-8', code: 'WH-ASRS', name: 'Aisle 4', building: 'High Bay Warehouse', area: 'Automated Storage' },
];

export const EQUIPMENT_TYPES: EquipmentType[] = [
  { code: 'Machining', name: 'Machining & Milling', description: 'CNC mills, lathes, surface grinders' },
  { code: 'Hydraulics', name: 'Hydraulic Systems', description: 'Hydraulic presses, pumps, valves, cylinders' },
  { code: 'Conveyor', name: 'Conveyance & Sorting', description: 'Belt conveyors, roller tables, sorters' },
  { code: 'Robotics', name: 'Robotics & Automation', description: 'Articulated arms, weld cells, pick & place' },
  { code: 'HVAC & Utilities', name: 'HVAC & Facility Utilities', description: 'Chillers, boilers, air handlers, cooling towers' },
  { code: 'Pneumatics', name: 'Pneumatic Power', description: 'Screw compressors, dryers, accumulator tanks' },
  { code: 'Electrical', name: 'Electrical Power Dist', description: 'Transformers, switchgear, VFD panels' },
  { code: 'Logistics', name: 'Warehousing & Cranes', description: 'ASRS cranes, hoists, dock levelers' },
];

class EquipmentService {
  private storageKey = 'apex_equipment_data';

  private getItems(): Equipment[] {
    const raw = localStorage.getItem(this.storageKey);
    if (!raw) {
      localStorage.setItem(this.storageKey, JSON.stringify(SEED_EQUIPMENT));
      return SEED_EQUIPMENT;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return SEED_EQUIPMENT;
    }
  }

  private saveItems(items: Equipment[]) {
    localStorage.setItem(this.storageKey, JSON.stringify(items));
  }

  getAll(): Equipment[] {
    return this.getItems();
  }

  getById(id: number): Equipment | undefined {
    return this.getItems().find(e => e.id === id);
  }

  getByAssetId(assetId: string): Equipment | undefined {
    return this.getItems().find(e => e.assetId.toLowerCase() === assetId.toLowerCase() || e.equipmentNumber.toLowerCase() === assetId.toLowerCase());
  }

  updateStatus(id: number, status: Equipment['status']) {
    const items = this.getItems();
    const updated = items.map(e => e.id === id ? { ...e, status } : e);
    this.saveItems(updated);
  }

  addEquipment(newEq: Omit<Equipment, 'id'>): Equipment {
    const items = this.getItems();
    const nextId = Math.max(...items.map(e => e.id), 0) + 1;
    const item: Equipment = { ...newEq, id: nextId };
    items.unshift(item);
    this.saveItems(items);
    return item;
  }
}

export const equipmentService = new EquipmentService();
