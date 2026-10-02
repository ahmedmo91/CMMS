import React, { useState } from 'react';
import { useAuth } from '../auth/AuthContext.tsx';
import { useNotifications } from '../notifications/NotificationContext.tsx';
import { useSystemConfig } from '../configuration/SystemConfigContext.tsx';
import {
  Menu,
  Search,
  Bell,
  CheckCircle2,
  AlertTriangle,
  Info,
  ChevronDown,
  Shield,
  Building,
  UserCheck,
  LogOut,
} from 'lucide-react';

interface TopNavbarProps {
  onOpenMobileSidebar: () => void;
  onOpenSearch: () => void;
}

export const TopNavbar: React.FC<TopNavbarProps> = ({ onOpenMobileSidebar, onOpenSearch }) => {
  const { currentUser, currentRole, allUsers, switchUser, logout } = useAuth();
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const { config } = useSystemConfig();

  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [isNotifDrawerOpen, setIsNotifDrawerOpen] = useState(false);

  return (
    <header className="h-16 px-4 sm:px-6 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4 sticky top-0 z-30">
      {/* Left: Mobile trigger & Site Tag */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileSidebar}
          className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 lg:hidden"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="hidden sm:flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
          <Building className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
          <span className="font-semibold text-slate-700 dark:text-slate-200">{config.plantName}</span>
          <span className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono text-[10px]">
            {config.siteCode}
          </span>
        </div>
      </div>

      {/* Middle: Global Search trigger */}
      <div className="flex-1 max-w-md mx-2">
        <button
          onClick={onOpenSearch}
          className="w-full px-3.5 py-1.5 bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700/80 rounded-xl text-xs text-slate-400 dark:text-slate-400 flex items-center justify-between border border-transparent hover:border-slate-300 dark:hover:border-slate-700 transition-all"
        >
          <div className="flex items-center gap-2">
            <Search className="w-3.5 h-3.5 text-slate-400" />
            <span className="truncate">Search faults, machines, technicians...</span>
          </div>
          <kbd className="hidden sm:inline-block px-1.5 py-0.5 rounded bg-white dark:bg-slate-900 text-[10px] font-mono border border-slate-200 dark:border-slate-700 text-slate-500 shadow-2xs">
            ⌘K
          </kbd>
        </button>
      </div>

      {/* Right: Notifications & Role Switcher */}
      <div className="flex items-center gap-2.5">
        {/* Notifications Trigger */}
        <div className="relative">
          <button
            onClick={() => setIsNotifDrawerOpen(!isNotifDrawerOpen)}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 relative transition-colors"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
            )}
          </button>

          {/* Notifications Dropdown */}
          {isNotifDrawerOpen && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden z-50 animate-in fade-in duration-150">
              <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-900 dark:text-white">System Alerts & Notifications</span>
                  {unreadCount > 0 && (
                    <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300">
                      {unreadCount} new
                    </span>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
                  >
                    Mark all read
                  </button>
                )}
              </div>

              <div className="max-h-72 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/80 text-xs">
                {notifications.map(n => (
                  <div
                    key={n.id}
                    onClick={() => markAsRead(n.id)}
                    className={`p-3.5 hover:bg-slate-50 dark:hover:bg-slate-800/40 cursor-pointer transition-colors ${
                      !n.read ? 'bg-indigo-50/20 dark:bg-indigo-950/20' : ''
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="font-semibold text-slate-900 dark:text-white">{n.title}</span>
                      <span className="text-[10px] text-slate-400 whitespace-nowrap">{n.timestamp}</span>
                    </div>
                    <p className="text-slate-600 dark:text-slate-300 mt-1 leading-relaxed text-[11px]">{n.message}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Switcher Dropdown (Live RBAC Demo) */}
        <div className="relative">
          <button
            onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
            className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <img
              src={currentUser.avatarUrl}
              alt={currentUser.name}
              className="w-7 h-7 rounded-full object-cover ring-1 ring-slate-200 dark:ring-slate-700"
            />
            <div className="hidden md:block text-left">
              <div className="text-xs font-bold text-slate-900 dark:text-white truncate max-w-[120px]">
                {currentUser.name.split(' ')[0]}
              </div>
              <div className="text-[10px] text-indigo-600 dark:text-indigo-400 font-mono">
                {currentUser.role}
              </div>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {isUserDropdownOpen && (
            <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-2 z-50 animate-in fade-in duration-150">
              <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800 mb-1">
                <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold block">
                  Switch Active RBAC Persona
                </span>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Test role-based permissions and widget authorization:
                </p>
              </div>

              <div className="space-y-1">
                {allUsers.map(u => {
                  const isCurrent = u.id === currentUser.id;
                  return (
                    <button
                      key={u.id}
                      onClick={() => {
                        switchUser(u.id);
                        setIsUserDropdownOpen(false);
                      }}
                      className={`w-full p-2 rounded-xl flex items-center gap-2.5 text-left transition-colors ${
                        isCurrent
                          ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400'
                          : 'hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <img src={u.avatarUrl} alt={u.name} className="w-8 h-8 rounded-full object-cover" />
                      <div className="min-w-0 flex-1">
                        <div className="text-xs font-bold truncate">{u.name}</div>
                        <div className="text-[10px] text-slate-400 truncate">{u.jobTitle}</div>
                        <span className="inline-block mt-0.5 text-[9px] font-mono font-bold px-1.5 rounded bg-slate-200 dark:bg-slate-800">
                          {u.role}
                        </span>
                      </div>
                      {isCurrent && <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0" />}
                    </button>
                  );
                })}
              </div>

              {/* Sign Out Button in Dropdown */}
              <div className="pt-2 mt-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  onClick={() => {
                    setIsUserDropdownOpen(false);
                    logout();
                  }}
                  className="w-full p-2 rounded-xl flex items-center gap-2.5 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out of Session</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Standalone 1-Click Sign Out Button */}
        <button
          onClick={logout}
          title="Sign Out of Session"
          className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 border border-slate-200 dark:border-slate-800 transition-colors"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out</span>
        </button>
      </div>
    </header>
  );
};
