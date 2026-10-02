export interface CreateFaultPayload {
  title: string;
  description: string;
  equipmentId: number;
  reporterId: number;
  assignedTechnicianId?: number;
  priority: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  severity: 'CATASTROPHIC' | 'CRITICAL' | 'MAJOR' | 'MINOR';
  failureCode: string;
  failureCategory: string;
  downtimeMinutes?: number;
  repairCost?: number;
  customFieldValues?: Record<string, unknown>;
}

export interface UpdateFaultPayload extends Partial<CreateFaultPayload> {
  status?: string;
  rootCause?: string;
  correctiveAction?: string;
}
