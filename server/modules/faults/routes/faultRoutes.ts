import { Router } from 'express';
import { FaultController } from '../controllers/faultController.ts';

export const faultRouter = Router();

faultRouter.get('/', FaultController.getAll);
faultRouter.get('/:id', FaultController.getById);
faultRouter.post('/', FaultController.create);
faultRouter.patch('/:id', FaultController.update);
