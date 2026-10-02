import { FaultRepository } from '../repositories/faultRepository.ts';
import { CreateFaultPayload, UpdateFaultPayload } from '../schemas/index.ts';

export class FaultBackendService {
  private repo = FaultRepository.getInstance();

  async getFaults() {
    return await this.repo.findAll();
  }

  async getFaultById(id: number) {
    return await this.repo.findById(id);
  }

  async recordFault(payload: CreateFaultPayload) {
    return await this.repo.create(payload);
  }

  async updateFault(id: number, payload: UpdateFaultPayload) {
    return await this.repo.update(id, payload);
  }
}
