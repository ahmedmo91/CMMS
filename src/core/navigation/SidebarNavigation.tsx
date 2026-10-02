import React from 'react';
import { MODULE_REGISTRY } from '../modules/registry.ts';
import { useSystemConfig } from '../configuration/SystemConfigContext.tsx';
import { useAuth } from '../auth/AuthContext.tsx';
import {
  LayoutDashboard,
  AlertTriangle,
  BarChart2,
  Sliders,
  Calendar,
  Package,
  Boxes,
  Users,
  UserCheck,
  Cpu,
  Settings,
  ShieldCheck,
  ChevronRight,
  Sparkles,
  Layers,
  Wrench,
  Activity,
  LogOut,
} from 'lucide-react';

interface SidebarNavigationProps {
  currentPath: string;
  onNavigate: (path: string) => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
}

export const SidebarNavigation: React.FC<SidebarNavigationProps> = ({
  currentPath,
  onNavigate,
  isOpenMobile,
  onCloseMobile,
}) => {
  const { isModuleEnabled } = useSystemConfig();
  const { hasPermission, currentUser, currentRole, logout } = useAuth();

  // Helper icon map
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'AlertTriangle':
        return <AlertTriangle className="w-4 h-4" />;
      case 'BarChart2':
        return <BarChart2 className="w-4 h-4" />;
      case 'Sliders':
        return <Sliders className="w-4 h-4" />;
      case 'Calendar':
        return <Calendar className="w-4 h-4" />;
      case 'Boxes':
      case 'Package':
        return <Package className="w-4 h-4" />;
      case 'UserCheck':
      case 'Users':
        return <Users className="w-4 h-4" />;
      case 'Cpu':
        return <Cpu className="w-4 h-4" />;
      default:
        return <Activity className="w-4 h-4" />;
    }
  };

  // 1. Core items always present
  const coreSections: {
    section: string;
    items: { id: string; label: string; path: string; icon: React.ReactNode; permission?: string }[];
  }[] = [
    {
      section: 'Platform',
      items: [
        {
          id: 'nav-dashboard',
          label: 'Operations Workspace',
          path: '/',
          icon: <LayoutDashboard className="w-4 h-4" />,
          permission: 'core.view_dashboard',
        },
      ],
    },
  ];

  // 2. Discover enabled module navigation dynamically!
  const enabledModules = MODULE_REGISTRY.filter(m => isModuleEnabled(m.id));

  // Dynamic Maintenance section
  const maintenanceItems = enabledModules
    .flatMap(m => m.navigation)
    .filter(n => n.section === 'Maintenance' && (!n.requiredPermission || hasPermission(n.requiredPermission)))
    .map(n => ({
      id: n.id,
      label: n.label,
      path: n.path,
      icon: getIcon(n.iconName),
      permission: n.requiredPermission,
    }));

  if (maintenanceItems.length > 0) {
    coreSections.push({
      section: 'Maintenance',
      items: maintenanceItems,
    });
  }

  // Assets section (Shared Equipment Foundation)
  if (hasPermission('assets.view')) {
    coreSections.push({
      section: 'Assets & Equipment',
      items: [
        {
          id: 'nav-assets-equipment',
          label: 'Equipment Master',
          path: '/assets/equipment',
          icon: <Cpu className="w-4 h-4" />,
          permission: 'assets.view',
        },
      ],
    });
  }

  // Materials section (Inventory Module - only if enabled!)
  const materialsItems = enabledModules
    .flatMap(m => m.navigation)
    .filter(n => n.section === 'Materials' && (!n.requiredPermission || hasPermission(n.requiredPermission)))
    .map(n => ({
      id: n.id,
      label: n.label,
      path: n.path,
      icon: getIcon(n.iconName),
      permission: n.requiredPermission,
    }));

  if (materialsItems.length > 0) {
    coreSections.push({
      section: 'Materials & Spares',
      items: materialsItems,
    });
  }

  // Workforce section
  const workforceItems = enabledModules
    .flatMap(m => m.navigation)
    .filter(n => n.section === 'Workforce' && (!n.requiredPermission || hasPermission(n.requiredPermission)))
    .map(n => ({
      id: n.id,
      label: n.label,
      path: n.path,
      icon: getIcon(n.iconName),
      permission: n.requiredPermission,
    }));

  if (hasPermission('workforce.view')) {
    coreSections.push({
      section: 'Workforce',
      items: [
        {
          id: 'nav-workforce-roster',
          label: 'Technician Directory',
          path: '/workforce/employees',
          icon: <Users className="w-4 h-4" />,
          permission: 'workforce.view',
        },
        ...workforceItems.filter(i => i.id !== 'nav-workforce-directory'),
      ],
    });
  }

  // Administration & Governance
  const adminItems: { id: string; label: string; path: string; icon: React.ReactNode; permission?: string }[] = [];
  if (hasPermission('core.manage_users')) {
    adminItems.push({
      id: 'nav-users-management',
      label: 'Users & Roles',
      path: '/admin/users',
      icon: <Users className="w-4 h-4" />,
      permission: 'core.manage_users',
    });
  }
  if (hasPermission('core.manage_modules') || hasPermission('core.manage_settings')) {
    adminItems.push({
      id: 'nav-system-config',
      label: 'System & Modules',
      path: '/admin/config',
      icon: <Settings className="w-4 h-4" />,
      permission: 'core.manage_settings',
    });
  }
  if (hasPermission('core.view_audit_logs')) {
    adminItems.push({
      id: 'nav-audit-logs',
      label: 'Audit Log Trail',
      path: '/admin/audit',
      icon: <ShieldCheck className="w-4 h-4" />,
      permission: 'core.view_audit_logs',
    });
  }

  if (adminItems.length > 0) {
    coreSections.push({
      section: 'Administration',
      items: adminItems,
    });
  }

  const handleNavClick = (path: string) => {
    onNavigate(path);
    onCloseMobile();
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isOpenMobile && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-xs lg:hidden"
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-64 bg-slate-900 text-slate-300 border-r border-slate-800 flex flex-col transition-transform duration-200 lg:translate-x-0 ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand / Logo */}
        <div className="h-16 px-5 border-b border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-400 text-white flex items-center justify-center font-black text-sm shadow-md shadow-indigo-600/30">
              A
            </div>
            <div>
              <span className="font-bold text-white tracking-tight text-sm">ApexCMMS</span>
              <span className="text-[10px] text-slate-400 block font-mono">Modular Platform</span>
            </div>
          </div>

          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-800">
            v1.2
          </span>
        </div>

        {/* Dynamic Navigation Links */}
        <div className="flex-1 px-3 py-4 overflow-y-auto space-y-6 text-xs">
          {coreSections.map(sec => (
            <div key={sec.section}>
              <div className="px-3 pb-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                {sec.section}
              </div>
              <div className="space-y-1">
                {sec.items.map(item => {
                  const isActive = currentPath === item.path || (item.path !== '/' && currentPath.startsWith(item.path));

                  return (
                    <button
                      key={item.id}
                      onClick={() => handleNavClick(item.path)}
                      className={`w-full px-3 py-2 rounded-xl font-medium flex items-center justify-between transition-all ${
                        isActive
                          ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/20 font-semibold'
                          : 'text-slate-400 hover:text-white hover:bg-slate-800/70'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 truncate">
                        <span className={isActive ? 'text-white' : 'text-slate-400'}>
                          {item.icon}
                        </span>
                        <span className="truncate">{item.label}</span>
                      </div>
                      {isActive && <ChevronRight className="w-3.5 h-3.5 opacity-60" />}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Active Modules Footer Summary */}
        <div className="p-3 mx-3 mb-3 rounded-xl bg-slate-800/60 border border-slate-700/60 text-[11px] text-slate-400">
          <div className="flex items-center justify-between font-semibold text-slate-300 mb-1">
            <span>Enabled Modules</span>
            <span className="text-emerald-400 font-mono">{enabledModules.length}</span>
          </div>
          <p className="text-[10px] text-slate-400 truncate">
            {enabledModules.map(m => m.name.split(' ')[0]).join(', ')}
          </p>
        </div>

        {/* Current User Role Pill & Sign Out */}
        <div className="p-3 border-t border-slate-800 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2.5 min-w-0 flex-1">
            <img
              src={currentUser.avatarUrl}
              alt={currentUser.name}
              className="w-8 h-8 rounded-full object-cover ring-2 ring-indigo-500/30 shrink-0"
            />
            <div className="min-w-0 flex-1 text-xs">
              <div className="font-bold text-white truncate">{currentUser.name}</div>
              <div className="text-[10px] text-indigo-400 font-mono truncate">{currentRole.name}</div>
            </div>
          </div>
          <button
            onClick={logout}
            title="Sign Out of Session"
            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800/80 transition-colors shrink-0"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </aside>
    </>
  );
};
