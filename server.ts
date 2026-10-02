import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

// Modular Core Platform Routes
import { authRouter } from './server/core/auth/routes.ts';
import { configRouter } from './server/core/configuration/routes.ts';
import { auditRouter } from './server/core/audit/routes.ts';

// Modular Subsystem Routes
import { faultRouter } from './server/modules/faults/routes/faultRoutes.ts';
import { pmRouter } from './server/modules/preventive-maintenance/routes/pmRoutes.ts';
import { inventoryRouter } from './server/modules/inventory/routes/inventoryRoutes.ts';
import { workforceRouter } from './server/modules/workforce/routes/workforceRoutes.ts';
import { assetRouter } from './server/shared/assets/assetRoutes.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = process.env.PORT || 3000;

  app.use(express.json());

  // Mount Modular Core Platform APIs
  app.use('/api/core/auth', authRouter);
  app.use('/api/core/configuration', configRouter);
  app.use('/api/core/audit', auditRouter);

  // Mount Modular Subsystem APIs
  app.use('/api/modules/faults', faultRouter);
  app.use('/api/modules/preventive-maintenance', pmRouter);
  app.use('/api/modules/inventory', inventoryRouter);
  app.use('/api/modules/workforce', workforceRouter);
  app.use('/api/assets', assetRouter);

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'healthy',
      platform: 'ApexCMMS Modular Platform',
      version: '1.2.0',
      timestamp: new Date().toISOString(),
    });
  });

  // Vite development integration
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Production static serving
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`ApexCMMS Modular Platform server running on port ${PORT}`);
  });
}

startServer().catch(err => {
  console.error('Failed to start server:', err);
});
