import React from 'react';

export type ModuleCategory = 'maintenance' | 'asset' | 'materials' | 'workforce' | 'administration' | 'analytics';

export type WidgetCategory = 'metric' | 'chart' | 'table' | 'feed';

export interface WidgetProps {
  timeRange?: 'today' | '7d' | '30d' | 'ytd';
  onNavigate?: (path: string) => void;
  isCustomizing?: boolean;
}

export interface DashboardWidgetDefinition {
  id: string;
  moduleId: string;
  name: string;
  description: string;
  category: WidgetCategory;
  defaultWidth: number; // 1, 2, 3, or 4 cols
  defaultHeight?: number;
  minWidth?: number;
  maxWidth?: number;
  requiredPermission?: string;
  component: React.ComponentType<WidgetProps>;
}

export interface NavigationItem {
  id: string;
  label: string;
  path: string;
  iconName: string;
  section: 'Dashboard' | 'Maintenance' | 'Assets' | 'Materials' | 'Workforce' | 'Reports' | 'Administration';
  requiredPermission?: string;
  badge?: string | number;
  order?: number;
}

export interface ReportDefinition {
  id: string;
  moduleId: string;
  title: string;
  description: string;
  exportFormats: ('csv' | 'json' | 'pdf')[];
  requiredPermission: string;
}

export interface ModuleDefinition {
  id: string;
  name: string;
  description: string;
  version: string;
  category: ModuleCategory;
  iconName: string;
  enabled: boolean;
  isCore?: boolean;
  requiredPermissions: string[];
  navigation: NavigationItem[];
  dashboardWidgets: DashboardWidgetDefinition[];
  reportTypes?: ReportDefinition[];
  dependencies?: string[];
  statusLabel?: 'Active' | 'Available' | 'Beta' | 'Planned';
}

export interface UserDashboardPreference {
  id: string;
  userId: string;
  dashboardId: string;
  widgetId: string;
  positionX: number;
  positionY: number;
  width: number;
  height: number;
  visible: boolean;
  configurationJson?: Record<string, unknown>;
}
