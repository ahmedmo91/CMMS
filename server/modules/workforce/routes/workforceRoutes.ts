import { Router } from 'express';
import { workforceService } from '../../../../src/shared/entities/workforce/workforceService.ts';

export const workforceRouter = Router();

workforceRouter.get('/employees', (req, res) => {
  res.json({
    success: true,
    data: workforceService.getAll(),
  });
});
