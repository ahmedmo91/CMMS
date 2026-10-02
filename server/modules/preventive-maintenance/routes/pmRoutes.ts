import { Router } from 'express';

export const pmRouter = Router();

pmRouter.get('/schedules', (req, res) => {
  res.json({
    success: true,
    data: [
      { id: 1, planCode: 'PM-CNC-500H', title: '500-Hour CNC Spindle & Axis Lubrication', status: 'SCHEDULED' },
      { id: 2, planCode: 'PM-HYD-OIL-Q', title: 'Quarterly Hydraulic Fluid Sampling', status: 'DUE' },
    ],
  });
});
