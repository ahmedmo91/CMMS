import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './core/auth/AuthContext.tsx';
import { SystemConfigProvider, useSystemConfig } from './core/configuration/SystemConfigContext.tsx';
import { NotificationProvider } from './core/notifications/NotificationContext.tsx';
import { SidebarNavigation } from './core/navigation/SidebarNavigation.tsx';
import { TopNavbar } from './core/navigation/TopNavbar.tsx';
import { SearchModal } from './core/search/SearchModal.tsx';

// Pages
import { DashboardWorkspace } from './core/dashboard/DashboardWorkspace.tsx';
import { FaultsListPage } from './modules/faults/pages/FaultsListPage.tsx';
import { FaultDetailPage } from './modules/faults/pages/FaultDetailPage.tsx';
import { FaultAnalyticsPage } from './modules/faults/pages/FaultAnalyticsPage.tsx';
import { FaultFieldsConfigPage } from './modules/faults/pages/FaultFieldsConfigPage.tsx';
import { FaultFormModal } from './modules/faults/forms/FaultFormModal.tsx';
import { PMSchedulesPage } from './modules/preventive-maintenance/pages/PMSchedulesPage.tsx';
import { InventoryListPage } from './modules/inventory/pages/InventoryListPage.tsx';
import { EquipmentListPage } from './shared/entities/equipment/pages/EquipmentListPage.tsx';
import { WorkforceListPage } from './shared/entities/workforce/pages/WorkforceListPage.tsx';
import { SystemConfigPage } from './core/configuration/pages/SystemConfigPage.tsx';
import { AuditLogsPage } from './core/audit/pages/AuditLogsPage.tsx';
import { UsersManagementPage } from './core/auth/pages/UsersManagementPage.tsx';
import { LoginPage } from './core/auth/pages/LoginPage.tsx';

// Services
import { faultService } from './modules/faults/services/faultService.ts';
import { Fault } from './modules/faults/schemas/faultTypes.ts';

function AppContent() {
  const { currentUser, hasPermission, isAuthenticated } = useAuth();
  const { isModuleEnabled } = useSystemConfig();

  const [currentPath, setCurrentPath] = useState<string>(() => {
    return window.location.hash.replace('#', '') || '/';
  });

  const [selectedFaultId, setSelectedFaultId] = useState<number | null>(null);
  const [editingFault, setEditingFault] = useState<Fault | null>(null);
  const [isNewFaultModalOpen, setIsNewFaultModalOpen] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '') || '/';
      setCurrentPath(hash);
      if (hash.startsWith('/maintenance/faults/')) {
        const id = parseInt(hash.replace('/maintenance/faults/', ''), 10);
        if (!isNaN(id)) {
          setSelectedFaultId(id);
        }
      } else {
        setSelectedFaultId(null);
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleNavigate = (path: string) => {
    window.location.hash = path;
    setCurrentPath(path);
    if (path.startsWith('/maintenance/faults/')) {
      const id = parseInt(path.replace('/maintenance/faults/', ''), 10);
      if (!isNaN(id)) {
        setSelectedFaultId(id);
      }
    } else {
      setSelectedFaultId(null);
    }
  };

  // If user is not authenticated or explicitly visited /login, render LoginPage
  if (!isAuthenticated || currentPath === '/login') {
    return <LoginPage onSuccess={() => handleNavigate('/')} />;
  }

  const handleRecordFaultSubmit = (data: Omit<Fault, 'id' | 'faultNumber' | 'timeline'>) => {
    if (editingFault) {
      faultService.update(editingFault.id, data, currentUser);
    } else {
      faultService.create(data, currentUser);
    }
    setEditingFault(null);
    setIsNewFaultModalOpen(false);
  };

  // Render appropriate view based on path
  const renderMainView = () => {
    // Single Fault Detail View
    if (selectedFaultId !== null) {
      return (
        <FaultDetailPage
          faultId={selectedFaultId}
          onBack={() => handleNavigate('/maintenance/faults')}
          onEdit={(f) => {
            setEditingFault(f);
            setIsNewFaultModalOpen(true);
          }}
        />
      );
    }

    if (currentPath === '/maintenance/faults') {
      return (
        <FaultsListPage
          onSelectFault={(id) => handleNavigate(`/maintenance/faults/${id}`)}
          onNewFault={() => {
            setEditingFault(null);
            setIsNewFaultModalOpen(true);
          }}
        />
      );
    }

    if (currentPath === '/maintenance/faults/analytics') {
      return <FaultAnalyticsPage />;
    }

    if (currentPath === '/maintenance/faults/fields') {
      return <FaultFieldsConfigPage />;
    }

    if (currentPath === '/maintenance/preventive') {
      if (!isModuleEnabled('preventive-maintenance')) {
        return (
          <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">Module Currently Disabled</h3>
            <p className="text-xs text-slate-500 mt-1">
              Preventive Maintenance is disabled in System Configuration. Enable it in Administration to view schedules.
            </p>
          </div>
        );
      }
      return <PMSchedulesPage />;
    }

    if (currentPath === '/materials/inventory') {
      if (!isModuleEnabled('inventory')) {
        return (
          <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">Inventory Module Currently Disabled</h3>
            <p className="text-xs text-slate-500 mt-1">
              Go to Administration &rarr; System & Modules to enable the Spare Parts & Inventory subsystem.
            </p>
          </div>
        );
      }
      return <InventoryListPage />;
    }

    if (currentPath === '/assets/equipment') {
      return (
        <EquipmentListPage
          onNavigateToFaults={(eqId) => handleNavigate('/maintenance/faults')}
        />
      );
    }

    if (currentPath === '/workforce/employees') {
      return <WorkforceListPage />;
    }

    if (currentPath === '/admin/config') {
      return <SystemConfigPage />;
    }

    if (currentPath === '/admin/users') {
      return <UsersManagementPage />;
    }

    if (currentPath === '/admin/audit') {
      return <AuditLogsPage />;
    }

    // Default: Modular Dashboard Workspace
    return <DashboardWorkspace onNavigate={handleNavigate} />;
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans antialiased">
      {/* Dynamic Sidebar Navigation */}
      <SidebarNavigation
        currentPath={currentPath}
        onNavigate={handleNavigate}
        isOpenMobile={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="lg:pl-64 flex flex-col flex-1 min-w-0">
        {/* Top Navbar */}
        <TopNavbar
          onOpenMobileSidebar={() => setIsMobileSidebarOpen(true)}
          onOpenSearch={() => setIsSearchOpen(true)}
        />

        {/* View Container */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {renderMainView()}
        </main>
      </div>

      {/* Record / Edit Fault Modal */}
      {isNewFaultModalOpen && (
        <FaultFormModal
          isOpen={isNewFaultModalOpen}
          onClose={() => {
            setIsNewFaultModalOpen(false);
            setEditingFault(null);
          }}
          onSubmit={handleRecordFaultSubmit}
          initialData={editingFault}
        />
      )}

      {/* Global Cross-Module Search Modal */}
      {isSearchOpen && (
        <SearchModal
          isOpen={isSearchOpen}
          onClose={() => setIsSearchOpen(false)}
          onNavigate={handleNavigate}
        />
      )}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <SystemConfigProvider>
        <NotificationProvider>
          <AppContent />
        </NotificationProvider>
      </SystemConfigProvider>
    </AuthProvider>
  );
}
