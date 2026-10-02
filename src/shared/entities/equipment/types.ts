export type EquipmentStatus = 'OPERATIONAL' | 'DEGRADED' | 'DOWN' | 'MAINTENANCE';
export type EquipmentCriticality = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';

export interface Equipment {
  id: number;
  assetId: string;
  equipmentNumber: string;
  name: string;
  type: string;
  classification: string;
  manufacturer: string;
  model: string;
  serialNumber: string;
  location: string;
  parentAssetId?: number;
  criticality: EquipmentCriticality;
  installationDate: string;
  commissioningDate: string;
  status: EquipmentStatus;
  downtimeHoursTotal: number;
  lastFaultDate?: string;
  mttrHours?: number;
}

export interface EquipmentLocation {
  id: string;
  code: string;
  name: string;
  building: string;
  area: string;
}

export interface EquipmentType {
  code: string;
  name: string;
  description: string;
}
