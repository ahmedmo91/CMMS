import { Router } from 'express';
import { equipmentService } from '../../../src/shared/entities/equipment/equipmentService.ts';

export const assetRouter = Router();

assetRouter.get('/equipment', (req, res) => {
  res.json({
    success: true,
    data: equipmentService.getAll(),
  });
});
