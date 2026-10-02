export interface DashboardWidgetItem {
  widgetId: string;
  width: number; // 1 = 1 col, 2 = 2 cols, 3 = 3 cols, 4 = full 4 cols
  height?: number;
  visible: boolean;
  order: number;
}

export interface UserDashboardLayout {
  userId: string;
  dashboardId: string;
  updatedAt: string;
  items: DashboardWidgetItem[];
}
