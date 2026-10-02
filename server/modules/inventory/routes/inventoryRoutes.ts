import { Router } from 'express';

export const inventoryRouter = Router();

inventoryRouter.get('/items', (req, res) => {
  res.json({
    success: true,
    data: [
      { id: 1, itemCode: 'BRG-SKF-7014', name: 'SKF 7014 Bearing', qty: 1, min: 4 },
      { id: 2, itemCode: 'SEAL-VIT-HP200', name: 'Viton Seal Kit', qty: 2, min: 5 },
    ],
  });
});
