import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, PRESET_USERS } from './types.ts';
import { SYSTEM_ROLES, RoleDefinition } from '../permissions/constants.ts';
import { auditService } from '../audit/auditService.ts';

interface AuthContextType {
  currentUser: User;
  currentRole: RoleDefinition;
  allUsers: User[];
  isAuthenticated: boolean;
  login: (email: string, password: string) => { success: boolean; error?: string };
  logout: () => void;
  switchUser: (userId: string) => void;
  hasPermission: (permissionCode: string) => boolean;
  hasAnyPermission: (permissionCodes: string[]) => boolean;
  createUser: (userData: Omit<User, 'id'>, password: string) => { success: boolean; user?: User; error?: string };
  deleteUser: (userId: string) => { success: boolean; error?: string };
  updateUser: (userId: string, updates: Partial<User>, newPassword?: string) => { success: boolean; user?: User; error?: string };
  updateUserPassword: (userId: string, newPassword: string) => { success: boolean; error?: string };
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [allUsers, setAllUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('apex_platform_users');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      } catch {
        // fallback
      }
    }
    return PRESET_USERS;
  });

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    const savedAuth = localStorage.getItem('apex_is_authenticated');
    // Default to true for demo access if not explicitly logged out
    return savedAuth !== 'false';
  });

  const [currentUser, setCurrentUser] = useState<User>(() => {
    const savedId = localStorage.getItem('apex_current_user_id');
    const found = allUsers.find(u => u.id === savedId);
    return found || allUsers[0];
  });

  useEffect(() => {
    localStorage.setItem('apex_platform_users', JSON.stringify(allUsers));
  }, [allUsers]);

  useEffect(() => {
    localStorage.setItem('apex_current_user_id', currentUser.id);
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('apex_is_authenticated', isAuthenticated ? 'true' : 'false');
  }, [isAuthenticated]);

  const login = (email: string, password: string) => {
    const targetUser = allUsers.find(u => u.email.toLowerCase() === email.trim().toLowerCase());
    if (!targetUser) {
      return { success: false, error: 'No user account found with that email address.' };
    }

    if (targetUser.status === 'SUSPENDED') {
      return { success: false, error: 'Account suspended: Contact plant engineering administrator.' };
    }

    // Verify password if set, or accept default credentials
    if (targetUser.password && targetUser.password !== password) {
      return { success: false, error: 'Incorrect password. Check your credentials and try again.' };
    }

    setCurrentUser(targetUser);
    setIsAuthenticated(true);

    auditService.log({
      userId: targetUser.id,
      userName: targetUser.name,
      userRole: targetUser.role,
      moduleId: 'core',
      action: 'STATUS_CHANGE',
      entityType: 'EMPLOYEE',
      entityId: targetUser.id,
      description: `User "${targetUser.name}" signed into session`,
      details: { email: targetUser.email, role: targetUser.role },
    });

    return { success: true };
  };

  const logout = () => {
    if (currentUser) {
      auditService.log({
        userId: currentUser.id,
        userName: currentUser.name,
        userRole: currentUser.role,
        moduleId: 'core',
        action: 'STATUS_CHANGE',
        entityType: 'EMPLOYEE',
        entityId: currentUser.id,
        description: `User "${currentUser.name}" signed out of session`,
      });
    }

    setIsAuthenticated(false);
  };

  const switchUser = (userId: string) => {
    const target = allUsers.find(u => u.id === userId);
    if (target) {
      setCurrentUser(target);
      setIsAuthenticated(true);
    }
  };

  const currentRole = SYSTEM_ROLES[currentUser.role] || SYSTEM_ROLES.VIEWER;

  const hasPermission = (permissionCode: string): boolean => {
    if (!permissionCode) return true;
    return currentRole.permissions.includes(permissionCode);
  };

  const hasAnyPermission = (permissionCodes: string[]): boolean => {
    if (!permissionCodes || permissionCodes.length === 0) return true;
    return permissionCodes.some(p => hasPermission(p));
  };

  const createUser = (userData: Omit<User, 'id'>, password: string) => {
    const emailExists = allUsers.some(u => u.email.toLowerCase() === userData.email.toLowerCase());
    if (emailExists) {
      return { success: false, error: 'A user account with this email address already exists.' };
    }

    const nextId = `usr-${Date.now().toString().slice(-6)}`;
    const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 19);

    const newUser: User = {
      ...userData,
      id: nextId,
      password: password || 'ApexUser#2026',
      status: userData.status || 'ACTIVE',
      createdAt: nowStr,
      avatarUrl:
        userData.avatarUrl ||
        'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80',
    };

    setAllUsers(prev => [newUser, ...prev]);

    auditService.log({
      userId: currentUser.id,
      userName: currentUser.name,
      userRole: currentUser.role,
      moduleId: 'core',
      action: 'CREATE',
      entityType: 'EMPLOYEE',
      entityId: newUser.id,
      description: `Created new user account "${newUser.name}" (${newUser.email}) with role [${newUser.role}]`,
      details: { role: newUser.role, department: newUser.department, email: newUser.email },
    });

    return { success: true, user: newUser };
  };

  const deleteUser = (userId: string) => {
    if (currentUser.id === userId) {
      return { success: false, error: 'Security constraint: You cannot delete your own currently active account.' };
    }

    const targetUser = allUsers.find(u => u.id === userId);
    if (!targetUser) {
      return { success: false, error: 'User not found.' };
    }

    if (targetUser.id === 'usr-admin-1') {
      return { success: false, error: 'Security constraint: The root engineering administrator account cannot be deleted.' };
    }

    setAllUsers(prev => prev.filter(u => u.id !== userId));

    auditService.log({
      userId: currentUser.id,
      userName: currentUser.name,
      userRole: currentUser.role,
      moduleId: 'core',
      action: 'DELETE',
      entityType: 'EMPLOYEE',
      entityId: userId,
      description: `Deleted user account "${targetUser.name}" (${targetUser.email})`,
      details: { deletedEmail: targetUser.email, deletedRole: targetUser.role },
    });

    return { success: true };
  };

  const updateUser = (userId: string, updates: Partial<User>, newPassword?: string) => {
    const targetUser = allUsers.find(u => u.id === userId);
    if (!targetUser) {
      return { success: false, error: 'User not found.' };
    }

    const updatedUser: User = {
      ...targetUser,
      ...updates,
      ...(newPassword ? { password: newPassword } : {}),
    };

    setAllUsers(prev => prev.map(u => (u.id === userId ? updatedUser : u)));

    if (currentUser.id === userId) {
      setCurrentUser(updatedUser);
    }

    const changes: string[] = [];
    if (updates.role && updates.role !== targetUser.role) changes.push(`role changed to ${updates.role}`);
    if (newPassword) changes.push('password updated');
    if (updates.status && updates.status !== targetUser.status) changes.push(`status changed to ${updates.status}`);
    if (updates.name && updates.name !== targetUser.name) changes.push('profile details updated');

    auditService.log({
      userId: currentUser.id,
      userName: currentUser.name,
      userRole: currentUser.role,
      moduleId: 'core',
      action: 'UPDATE',
      entityType: 'EMPLOYEE',
      entityId: userId,
      description: `Modified user "${targetUser.name}" (${changes.join(', ') || 'attributes updated'})`,
      details: { updates, passwordReset: !!newPassword },
    });

    return { success: true, user: updatedUser };
  };

  const updateUserPassword = (userId: string, newPassword: string) => {
    return updateUser(userId, {}, newPassword);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        currentRole,
        allUsers,
        isAuthenticated,
        login,
        logout,
        switchUser,
        hasPermission,
        hasAnyPermission,
        createUser,
        deleteUser,
        updateUser,
        updateUserPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
