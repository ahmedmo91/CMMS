import React, { createContext, useContext, useState, useEffect } from 'react';
import { auditService } from '../audit/auditService.ts';

export interface CustomFieldDefinition {
  id: string;
  moduleId: string;
  name: string;
  label: string;
  type: 'TEXT' | 'NUMBER' | 'SELECT' | 'BOOLEAN' | 'DATE';
  required: boolean;
  options?: string[]; // for SELECT
  orderIndex: number;
  active: boolean;
}

export interface DefaultWidgetLayout {
  widgetId: string;
  positionX: number;
  positionY: number;
  width: number;
  height: number;
  visible: boolean;
  isMandatory?: boolean; // if true, regular users cannot remove it
}

export interface SystemConfig {
  plantName: string;
  siteCode: string;
  currency: string;
  timezone: string;
  moduleStates: Record<string, boolean>; // moduleId -> enabled
  organizationDefaultWidgets: DefaultWidgetLayout[];
  customFields: CustomFieldDefinition[];
}

const INITIAL_CUSTOM_FIELDS: CustomFieldDefinition[] = [
  {
    id: 'cf-1',
    moduleId: 'faults',
    name: 'vibration_level',
    label: 'Vibration Level (mm/s RMS)',
    type: 'NUMBER',
    required: false,
    orderIndex: 1,
    active: true,
  },
  {
    id: 'cf-2',
    moduleId: 'faults',
    name: 'oil_contamination_level',
    label: 'Oil / Fluid Condition',
    type: 'SELECT',
    options: ['Clean / Normal', 'Slight Cloudiness', 'Particulate Contamination', 'Severe Emulsion'],
    required: false,
    orderIndex: 2,
    active: true,
  },
  {
    id: 'cf-3',
    moduleId: 'faults',
    name: 'safety_incident_occurred',
    label: 'Safety Stop / Guard Tripped',
    type: 'BOOLEAN',
    required: false,
    orderIndex: 3,
    active: true,
  },
  {
    id: 'cf-4',
    moduleId: 'faults',
    name: 'environmental_impact',
    label: 'Environmental / Leak Risk',
    type: 'SELECT',
    options: ['None', 'Minor Containment Area', 'Reportable Spill Hazard'],
    required: false,
    orderIndex: 4,
    active: true,
  },
];

const INITIAL_DEFAULT_WIDGETS: DefaultWidgetLayout[] = [
  { widgetId: 'faults-total', positionX: 0, positionY: 0, width: 1, height: 1, visible: true, isMandatory: true },
  { widgetId: 'faults-open', positionX: 1, positionY: 0, width: 1, height: 1, visible: true, isMandatory: true },
  { widgetId: 'faults-in-progress', positionX: 2, positionY: 0, width: 1, height: 1, visible: true },
  { widgetId: 'faults-mttr', positionX: 3, positionY: 0, width: 1, height: 1, visible: true },
  { widgetId: 'faults-trend', positionX: 0, positionY: 1, width: 2, height: 2, visible: true },
  { widgetId: 'faults-location', positionX: 2, positionY: 1, width: 2, height: 2, visible: true },
  { widgetId: 'faults-recent-list', positionX: 0, positionY: 3, width: 4, height: 2, visible: true },
  { widgetId: 'pm-due-today', positionX: 0, positionY: 5, width: 2, height: 1, visible: true },
  { widgetId: 'pm-completion-rate', positionX: 2, positionY: 5, width: 2, height: 1, visible: true },
];

const INITIAL_SYSTEM_CONFIG: SystemConfig = {
  plantName: 'Apex Industrial Manufacturing - Plant 04',
  siteCode: 'APX-PLANT-04',
  currency: 'USD ($)',
  timezone: 'America/Chicago (CST)',
  moduleStates: {
    'faults': true, // Initial Core Module - always enabled
    'preventive-maintenance': true, // Extension module enabled
    'inventory': false, // Available to be enabled
    'workforce': true, // Shared workforce enabled
    'attendance': false, // Available to be enabled
    'overtime': false, // Available to be enabled
    'work-orders': false, // Available to be enabled
  },
  organizationDefaultWidgets: INITIAL_DEFAULT_WIDGETS,
  customFields: INITIAL_CUSTOM_FIELDS,
};

interface SystemConfigContextType {
  config: SystemConfig;
  isModuleEnabled: (moduleId: string) => boolean;
  toggleModule: (moduleId: string, enabled: boolean, user: { id: string; name: string; role: string }) => void;
  updateOrganizationDefaultWidgets: (layouts: DefaultWidgetLayout[]) => void;
  addCustomField: (field: Omit<CustomFieldDefinition, 'id'>) => void;
  updateCustomField: (id: string, updates: Partial<CustomFieldDefinition>) => void;
  deleteCustomField: (id: string) => void;
  updatePlantSettings: (settings: Partial<Pick<SystemConfig, 'plantName' | 'siteCode' | 'currency' | 'timezone'>>) => void;
}

const SystemConfigContext = createContext<SystemConfigContextType | undefined>(undefined);

export const SystemConfigProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [config, setConfig] = useState<SystemConfig>(() => {
    const raw = localStorage.getItem('apex_system_config');
    if (!raw) return INITIAL_SYSTEM_CONFIG;
    try {
      const parsed = JSON.parse(raw);
      return {
        ...INITIAL_SYSTEM_CONFIG,
        ...parsed,
        moduleStates: { ...INITIAL_SYSTEM_CONFIG.moduleStates, ...parsed.moduleStates },
      };
    } catch {
      return INITIAL_SYSTEM_CONFIG;
    }
  });

  useEffect(() => {
    localStorage.setItem('apex_system_config', JSON.stringify(config));
  }, [config]);

  const isModuleEnabled = (moduleId: string): boolean => {
    if (moduleId === 'faults' || moduleId === 'core') return true;
    return !!config.moduleStates[moduleId];
  };

  const toggleModule = (moduleId: string, enabled: boolean, user: { id: string; name: string; role: string }) => {
    setConfig(prev => ({
      ...prev,
      moduleStates: {
        ...prev.moduleStates,
        [moduleId]: enabled,
      },
    }));

    auditService.log({
      userId: user.id,
      userName: user.name,
      userRole: user.role,
      moduleId: 'core',
      action: 'TOGGLE_MODULE',
      entityType: 'MODULE',
      entityId: moduleId,
      description: `${enabled ? 'Enabled' : 'Disabled'} module [${moduleId}] in System Configuration`,
      details: { moduleId, state: enabled ? 'ENABLED' : 'DISABLED' },
    });
  };

  const updateOrganizationDefaultWidgets = (layouts: DefaultWidgetLayout[]) => {
    setConfig(prev => ({
      ...prev,
      organizationDefaultWidgets: layouts,
    }));
  };

  const addCustomField = (field: Omit<CustomFieldDefinition, 'id'>) => {
    const newField: CustomFieldDefinition = {
      ...field,
      id: `cf-${Date.now()}`,
    };
    setConfig(prev => ({
      ...prev,
      customFields: [...prev.customFields, newField],
    }));
  };

  const updateCustomField = (id: string, updates: Partial<CustomFieldDefinition>) => {
    setConfig(prev => ({
      ...prev,
      customFields: prev.customFields.map(f => f.id === id ? { ...f, ...updates } : f),
    }));
  };

  const deleteCustomField = (id: string) => {
    setConfig(prev => ({
      ...prev,
      customFields: prev.customFields.filter(f => f.id !== id),
    }));
  };

  const updatePlantSettings = (settings: Partial<Pick<SystemConfig, 'plantName' | 'siteCode' | 'currency' | 'timezone'>>) => {
    setConfig(prev => ({
      ...prev,
      ...settings,
    }));
  };

  return (
    <SystemConfigContext.Provider
      value={{
        config,
        isModuleEnabled,
        toggleModule,
        updateOrganizationDefaultWidgets,
        addCustomField,
        updateCustomField,
        deleteCustomField,
        updatePlantSettings,
      }}
    >
      {children}
    </SystemConfigContext.Provider>
  );
};

export const useSystemConfig = () => {
  const context = useContext(SystemConfigContext);
  if (!context) {
    throw new Error('useSystemConfig must be used within SystemConfigProvider');
  }
  return context;
};
