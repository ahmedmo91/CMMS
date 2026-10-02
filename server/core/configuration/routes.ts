import { Router } from 'express';
import { MODULE_REGISTRY } from '../../../src/core/modules/registry.ts';
import { ModuleDefinition } from '../../../src/core/modules/types.ts';

export const configRouter = Router();

// GET /api/core/configuration/modules
configRouter.get('/modules', (req, res) => {
  res.json({
    success: true,
    data: MODULE_REGISTRY.map((m: ModuleDefinition) => ({
      id: m.id,
      name: m.name,
      description: m.description,
      version: m.version,
      category: m.category,
      isCore: m.isCore,
      statusLabel: m.statusLabel,
      widgetCount: m.dashboardWidgets.length,
      navigationCount: m.navigation.length,
    })),
  });
});

// GET /api/core/configuration/settings
configRouter.get('/settings', (req, res) => {
  res.json({
    success: true,
    data: {
      plantName: 'Apex Industrial Manufacturing - Plant 04',
      siteCode: 'APX-PLANT-04',
      currency: 'USD ($)',
      timezone: 'America/Chicago (CST)',
    },
  });
});
