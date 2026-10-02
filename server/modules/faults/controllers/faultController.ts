import { Request, Response } from 'express';
import { FaultBackendService } from '../services/faultService.ts';

const faultService = new FaultBackendService();

export class FaultController {
  static async getAll(req: Request, res: Response) {
    try {
      const data = await faultService.getFaults();
      res.json({ success: true, data });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  }

  static async getById(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id, 10);
      const data = await faultService.getFaultById(id);
      if (!data) return res.status(404).json({ success: false, error: 'Fault not found' });
      res.json({ success: true, data });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  }

  static async create(req: Request, res: Response) {
    try {
      const data = await faultService.recordFault(req.body);
      res.status(201).json({ success: true, data });
    } catch (err: any) {
      res.status(400).json({ success: false, error: err.message });
    }
  }

  static async update(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id, 10);
      const data = await faultService.updateFault(id, req.body);
      if (!data) return res.status(404).json({ success: false, error: 'Fault not found' });
      res.json({ success: true, data });
    } catch (err: any) {
      res.status(400).json({ success: false, error: err.message });
    }
  }
}
