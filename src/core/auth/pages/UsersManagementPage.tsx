import React, { useState, useMemo } from 'react';
import { useAuth } from '../AuthContext.tsx';
import { User } from '../types.ts';
import { SYSTEM_ROLES } from '../../permissions/constants.ts';
import {
  Users,
  UserPlus,
  Shield,
  Key,
  Trash2,
  Edit,
  Search,
  CheckCircle2,
  AlertTriangle,
  Lock,
  Eye,
  EyeOff,
  UserCheck,
  RefreshCw,
  Mail,
  Building,
  Sparkles,
} from 'lucide-react';

export const UsersManagementPage: React.FC = () => {
  const { allUsers, currentUser, createUser, deleteUser, updateUser, switchUser } = useAuth();

  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Modals state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [passwordModalUser, setPasswordModalUser] = useState<User | null>(null);
  const [deleteModalUser, setDeleteModalUser] = useState<User | null>(null);

  // Form states for Create / Edit
  const [formData, setFormData] = useState<{
    name: string;
    email: string;
    employeeId: string;
    jobTitle: string;
    department: string;
    role: User['role'];
    password: string;
    status: 'ACTIVE' | 'SUSPENDED';
    avatarUrl: string;
  }>({
    name: '',
    email: '',
    employeeId: '',
    jobTitle: '',
    department: 'Maintenance & Reliability',
    role: 'TECHNICIAN',
    password: '',
    status: 'ACTIVE',
    avatarUrl: '',
  });

  // Password modal state
  const [newPassword, setNewPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const generateRandomPassword = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%&*';
    let res = '';
    for (let i = 0; i < 12; i++) {
      res += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return res;
  };

  // Filtered users
  const filteredUsers = useMemo(() => {
    return allUsers.filter(u => {
      if (roleFilter !== 'ALL' && u.role !== roleFilter) return false;
      if (statusFilter !== 'ALL' && (u.status || 'ACTIVE') !== statusFilter) return false;
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase();
        return (
          u.name.toLowerCase().includes(q) ||
          u.email.toLowerCase().includes(q) ||
          (u.employeeId && u.employeeId.toLowerCase().includes(q)) ||
          u.jobTitle.toLowerCase().includes(q) ||
          u.department.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [allUsers, roleFilter, statusFilter, searchTerm]);

  // Open Create Modal
  const handleOpenCreate = () => {
    setFormData({
      name: '',
      email: '',
      employeeId: `EMP-${Math.floor(100 + Math.random() * 900)}`,
      jobTitle: 'Maintenance Technician',
      department: 'Maintenance & Reliability',
      role: 'TECHNICIAN',
      password: generateRandomPassword(),
      status: 'ACTIVE',
      avatarUrl: `https://images.unsplash.com/photo-${1534528741775 + Math.floor(Math.random() * 5000)}?w=120&auto=format&fit=crop&q=80`,
    });
    setErrorMessage(null);
    setIsCreateModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEdit = (user: User) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      employeeId: user.employeeId || '',
      jobTitle: user.jobTitle,
      department: user.department,
      role: user.role,
      password: '',
      status: user.status || 'ACTIVE',
      avatarUrl: user.avatarUrl,
    });
    setErrorMessage(null);
  };

  // Submit Create or Edit
  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!formData.name.trim() || !formData.email.trim()) {
      setErrorMessage('Name and Email are required.');
      return;
    }

    if (editingUser) {
      const res = updateUser(
        editingUser.id,
        {
          name: formData.name,
          email: formData.email,
          employeeId: formData.employeeId,
          jobTitle: formData.jobTitle,
          department: formData.department,
          role: formData.role,
          status: formData.status,
          avatarUrl: formData.avatarUrl,
        },
        formData.password ? formData.password : undefined
      );

      if (!res.success) {
        setErrorMessage(res.error || 'Failed to update user.');
        return;
      }

      showToast(`User account "${formData.name}" successfully updated.`);
      setEditingUser(null);
    } else {
      if (!formData.password) {
        setErrorMessage('Password is required when creating a new user.');
        return;
      }

      const res = createUser(
        {
          name: formData.name,
          email: formData.email,
          employeeId: formData.employeeId,
          jobTitle: formData.jobTitle,
          department: formData.department,
          role: formData.role,
          status: formData.status,
          avatarUrl: formData.avatarUrl,
        },
        formData.password
      );

      if (!res.success) {
        setErrorMessage(res.error || 'Failed to create user.');
        return;
      }

      showToast(`User account "${formData.name}" created with role [${formData.role}].`);
      setIsCreateModalOpen(false);
    }
  };

  // Submit Password Change
  const handleSubmitPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwordModalUser) return;
    if (!newPassword || newPassword.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      return;
    }

    const res = updateUser(passwordModalUser.id, {}, newPassword);
    if (!res.success) {
      setErrorMessage(res.error || 'Failed to reset password.');
      return;
    }

    showToast(`Password updated for ${passwordModalUser.name}.`);
    setPasswordModalUser(null);
    setNewPassword('');
    setErrorMessage(null);
  };

  // Submit Delete User
  const handleConfirmDelete = () => {
    if (!deleteModalUser) return;
    const res = deleteUser(deleteModalUser.id);
    if (!res.success) {
      setErrorMessage(res.error || 'Could not delete user.');
      return;
    }
    showToast(`User account "${deleteModalUser.name}" has been permanently removed.`);
    setDeleteModalUser(null);
    setErrorMessage(null);
  };

  const getRoleBadge = (roleCode: string) => {
    const r = SYSTEM_ROLES[roleCode];
    const color = r ? r.color : 'bg-slate-100 text-slate-700';
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${color}`}>
        {r ? r.name : roleCode}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-3 bg-emerald-600 text-white rounded-xl shadow-xl flex items-center gap-2 text-xs font-semibold animate-in slide-in-from-bottom duration-200">
          <CheckCircle2 className="w-4 h-4" />
          {toastMessage}
        </div>
      )}

      {/* Top Banner */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
              User Management & Access Control
            </h1>
            <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400">
              RBAC Administration
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Create and delete platform accounts, assign security roles, manage passwords, and configure access levels.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs transition-colors flex items-center gap-2 self-start sm:self-auto"
        >
          <UserPlus className="w-4 h-4" />
          Create New User
        </button>
      </div>

      {/* Summary KPI Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Total Users</span>
          <div className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{allUsers.length}</div>
        </div>
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-purple-200 dark:border-purple-900/40 shadow-xs">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-purple-600 dark:text-purple-400">
            Administrators
          </span>
          <div className="text-2xl font-bold text-purple-700 dark:text-purple-300 mt-1">
            {allUsers.filter(u => u.role === 'ADMIN').length}
          </div>
        </div>
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-amber-200 dark:border-amber-900/40 shadow-xs">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-amber-600 dark:text-amber-400">
            Technicians & Ops
          </span>
          <div className="text-2xl font-bold text-amber-700 dark:text-amber-300 mt-1">
            {allUsers.filter(u => u.role === 'TECHNICIAN' || u.role === 'OPERATOR').length}
          </div>
        </div>
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-emerald-200 dark:border-emerald-900/40 shadow-xs">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
            Active Accounts
          </span>
          <div className="text-2xl font-bold text-emerald-700 dark:text-emerald-300 mt-1">
            {allUsers.filter(u => (u.status || 'ACTIVE') === 'ACTIVE').length}
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by name, email, employee ID, role..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {/* Role Filter */}
          <select
            value={roleFilter}
            onChange={e => setRoleFilter(e.target.value)}
            className="px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-700 dark:text-slate-300"
          >
            <option value="ALL">All Roles</option>
            <option value="ADMIN">System Administrator</option>
            <option value="MAINT_SUPERVISOR">Maintenance Supervisor</option>
            <option value="TECHNICIAN">Technician</option>
            <option value="OPERATOR">Operator</option>
            <option value="VIEWER">Auditor / Viewer</option>
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-700 dark:text-slate-300"
          >
            <option value="ALL">All Statuses</option>
            <option value="ACTIVE">Active</option>
            <option value="SUSPENDED">Suspended</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="py-3.5 px-4">User Details</th>
                <th className="py-3.5 px-4">Email & Department</th>
                <th className="py-3.5 px-4">Assigned Role</th>
                <th className="py-3.5 px-4">Credentials & Password</th>
                <th className="py-3.5 px-4">Account Status</th>
                <th className="py-3.5 px-4 text-right">Admin Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
              {filteredUsers.map(user => {
                const isCurrent = user.id === currentUser.id;
                const isRoot = user.id === 'usr-admin-1';

                return (
                  <tr key={user.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    {/* User profile */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={user.avatarUrl}
                          alt={user.name}
                          className="w-9 h-9 rounded-full object-cover ring-1 ring-slate-200 dark:ring-slate-700"
                        />
                        <div>
                          <div className="flex items-center gap-1.5 font-bold text-slate-900 dark:text-white">
                            <span>{user.name}</span>
                            {isCurrent && (
                              <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                                YOU
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-slate-500 flex items-center gap-1.5">
                            <span>{user.jobTitle}</span>
                            {user.employeeId && (
                              <span className="font-mono text-[10px] text-slate-400">[{user.employeeId}]</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Email & Department */}
                    <td className="py-3.5 px-4">
                      <div className="font-medium text-slate-800 dark:text-slate-200">{user.email}</div>
                      <div className="text-[11px] text-slate-500">{user.department}</div>
                    </td>

                    {/* Role */}
                    <td className="py-3.5 px-4">
                      {getRoleBadge(user.role)}
                    </td>

                    {/* Password status */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-slate-400 tracking-widest text-xs">••••••••</span>
                        <button
                          onClick={() => {
                            setPasswordModalUser(user);
                            setNewPassword('');
                            setErrorMessage(null);
                          }}
                          title="Set / Change Password"
                          className="px-2 py-1 rounded-lg text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 flex items-center gap-1"
                        >
                          <Key className="w-3 h-3" />
                          Set Password
                        </button>
                      </div>
                      {user.password && (
                        <div className="text-[10px] text-slate-400 mt-0.5">
                          Configured on file
                        </div>
                      )}
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex px-2 py-0.5 rounded text-[10px] font-bold ${
                          (user.status || 'ACTIVE') === 'ACTIVE'
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                            : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                        }`}
                      >
                        {user.status || 'ACTIVE'}
                      </span>
                    </td>

                    {/* Admin Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        {/* Switch persona quick action */}
                        {!isCurrent && (
                          <button
                            onClick={() => switchUser(user.id)}
                            title="Switch to this user session"
                            className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-slate-100 dark:hover:bg-slate-800"
                          >
                            <UserCheck className="w-3.5 h-3.5" />
                          </button>
                        )}

                        {/* Edit User & Role */}
                        <button
                          onClick={() => handleOpenEdit(user)}
                          title="Edit User & Set Role"
                          className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-slate-100 dark:hover:bg-slate-800"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>

                        {/* Delete User */}
                        <button
                          onClick={() => {
                            setDeleteModalUser(user);
                            setErrorMessage(null);
                          }}
                          disabled={isCurrent || isRoot}
                          title={
                            isCurrent
                              ? 'Cannot delete your active account'
                              : isRoot
                              ? 'Cannot delete root administrator'
                              : 'Delete User Account'
                          }
                          className={`p-1.5 rounded-lg ${
                            isCurrent || isRoot
                              ? 'text-slate-300 dark:text-slate-700 cursor-not-allowed'
                              : 'text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40'
                          }`}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    No user accounts match the current filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="p-4 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500 flex items-center justify-between">
          <span>Showing {filteredUsers.length} of {allUsers.length} total users</span>
          <span className="text-[11px] text-slate-400">All user credentials and role modifications logged to Platform Audit</span>
        </div>
      </div>

      {/* Role Permission Matrix Card (informative) */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
          <Shield className="w-4 h-4 text-indigo-600" />
          Configured RBAC Role Hierarchy
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
          Roles determine what navigation items, dashboard widgets, and write actions users can perform.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
          {Object.values(SYSTEM_ROLES).map(r => (
            <div key={r.code} className="p-3.5 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800">
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-bold text-slate-900 dark:text-white">{r.name}</span>
                <span className="font-mono text-[10px] text-slate-400">[{r.code}]</span>
              </div>
              <p className="text-slate-600 dark:text-slate-400 text-[11px] leading-relaxed mb-2">{r.description}</p>
              <div className="text-[10px] font-semibold text-indigo-600 dark:text-indigo-400">
                {r.permissions.length} Assigned Permissions
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CREATE USER MODAL */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-lg overflow-hidden my-8">
            <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-600 flex items-center justify-center">
                  <UserPlus className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">Create New User Account</h3>
                  <p className="text-xs text-slate-500">Set identity, assign role, and issue credentials</p>
                </div>
              </div>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-lg leading-none"
              >
                &times;
              </button>
            </div>

            {errorMessage && (
              <div className="mx-6 mt-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmitForm} className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Liam Gallagher"
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Employee ID
                  </label>
                  <input
                    type="text"
                    placeholder="EMP-104"
                    value={formData.employeeId}
                    onChange={e => setFormData({ ...formData, employeeId: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Corporate Email Address *
                </label>
                <input
                  type="email"
                  required
                  placeholder="liam.gallagher@apexcooling.com"
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Job Title
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Mechanical Specialist"
                    value={formData.jobTitle}
                    onChange={e => setFormData({ ...formData, jobTitle: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Department
                  </label>
                  <input
                    type="text"
                    placeholder="Maintenance & Reliability"
                    value={formData.department}
                    onChange={e => setFormData({ ...formData, department: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              {/* Set Role */}
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Assign Security Role *
                </label>
                <select
                  value={formData.role}
                  onChange={e => setFormData({ ...formData, role: e.target.value as User['role'] })}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-medium"
                >
                  <option value="ADMIN">System Administrator (Full access)</option>
                  <option value="MAINT_SUPERVISOR">Maintenance Supervisor / Editor</option>
                  <option value="TECHNICIAN">Maintenance Technician (Repair & Log)</option>
                  <option value="OPERATOR">Plant Operator (Report faults & assets)</option>
                  <option value="VIEWER">Auditor / Viewer (Read-only)</option>
                </select>
                <div className="mt-1 text-[11px] text-slate-400">
                  {SYSTEM_ROLES[formData.role]?.description}
                </div>
              </div>

              {/* Initial Password */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-semibold text-slate-700 dark:text-slate-300">
                    Initial Password *
                  </label>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, password: generateRandomPassword() })}
                    className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline flex items-center gap-1"
                  >
                    <RefreshCw className="w-3 h-3" /> Generate
                  </button>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={formData.password}
                    onChange={e => setFormData({ ...formData, password: e.target.value })}
                    className="w-full p-2.5 pr-10 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Status */}
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Account Status
                </label>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="status"
                      value="ACTIVE"
                      checked={formData.status === 'ACTIVE'}
                      onChange={() => setFormData({ ...formData, status: 'ACTIVE' })}
                      className="text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="text-slate-800 dark:text-slate-200 font-medium">Active (Can sign in)</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="status"
                      value="SUSPENDED"
                      checked={formData.status === 'SUSPENDED'}
                      onChange={() => setFormData({ ...formData, status: 'SUSPENDED' })}
                      className="text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="text-slate-800 dark:text-slate-200 font-medium">Suspended</span>
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 font-semibold transition-colors flex items-center gap-1.5 shadow-xs"
                >
                  <UserPlus className="w-4 h-4" /> Create User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT USER & ROLE MODAL */}
      {editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-lg overflow-hidden my-8">
            <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-600 flex items-center justify-center">
                  <Edit className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">Edit User: {editingUser.name}</h3>
                  <p className="text-xs text-slate-500">Update profile details, change security role, or suspend account</p>
                </div>
              </div>
              <button
                onClick={() => setEditingUser(null)}
                className="text-slate-400 hover:text-slate-600 text-lg leading-none"
              >
                &times;
              </button>
            </div>

            {errorMessage && (
              <div className="mx-6 mt-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmitForm} className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Employee ID
                  </label>
                  <input
                    type="text"
                    value={formData.employeeId}
                    onChange={e => setFormData({ ...formData, employeeId: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Job Title
                  </label>
                  <input
                    type="text"
                    value={formData.jobTitle}
                    onChange={e => setFormData({ ...formData, jobTitle: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Department
                  </label>
                  <input
                    type="text"
                    value={formData.department}
                    onChange={e => setFormData({ ...formData, department: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              {/* Set Role */}
              <div className="p-3 bg-purple-50/50 dark:bg-purple-950/20 rounded-xl border border-purple-100 dark:border-purple-900/40">
                <label className="block font-bold text-purple-900 dark:text-purple-300 mb-1">
                  Change Security Role
                </label>
                <select
                  value={formData.role}
                  onChange={e => setFormData({ ...formData, role: e.target.value as User['role'] })}
                  className="w-full p-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-semibold"
                >
                  <option value="ADMIN">System Administrator</option>
                  <option value="MAINT_SUPERVISOR">Maintenance Supervisor / Editor</option>
                  <option value="TECHNICIAN">Maintenance Technician</option>
                  <option value="OPERATOR">Plant Operator</option>
                  <option value="VIEWER">Auditor / Viewer</option>
                </select>
                <div className="mt-1 text-[11px] text-slate-500">
                  {SYSTEM_ROLES[formData.role]?.description}
                </div>
              </div>

              {/* Status */}
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Account Status
                </label>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="status"
                      value="ACTIVE"
                      checked={formData.status === 'ACTIVE'}
                      onChange={() => setFormData({ ...formData, status: 'ACTIVE' })}
                      className="text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="text-slate-800 dark:text-slate-200 font-medium">Active (Can sign in)</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="status"
                      value="SUSPENDED"
                      checked={formData.status === 'SUSPENDED'}
                      onChange={() => setFormData({ ...formData, status: 'SUSPENDED' })}
                      className="text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="text-slate-800 dark:text-slate-200 font-medium text-rose-600">Suspended</span>
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="px-4 py-2 rounded-xl text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 font-semibold shadow-xs"
                >
                  Save User Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CHANGE / SET PASSWORD MODAL */}
      {passwordModalUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-md p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-950 text-amber-600 flex items-center justify-center">
                  <Key className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">Set User Password</h3>
                  <p className="text-xs text-slate-500">{passwordModalUser.name} ({passwordModalUser.email})</p>
                </div>
              </div>
              <button onClick={() => setPasswordModalUser(null)} className="text-slate-400 hover:text-slate-600">
                &times;
              </button>
            </div>

            {errorMessage && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmitPassword} className="space-y-4 text-xs">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-semibold text-slate-700 dark:text-slate-300">
                    New Account Password
                  </label>
                  <button
                    type="button"
                    onClick={() => setNewPassword(generateRandomPassword())}
                    className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline flex items-center gap-1"
                  >
                    <RefreshCw className="w-3 h-3" /> Generate Secure
                  </button>
                </div>

                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="Enter new password (min. 6 characters)"
                    value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                    className="w-full p-2.5 pr-10 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-100 dark:border-slate-800 text-[11px] text-slate-500 space-y-1">
                <div className="font-semibold text-slate-700 dark:text-slate-300">Password Policy Requirements:</div>
                <div>&bull; Minimum 6 characters</div>
                <div>&bull; User will be able to sign in immediately with this credential</div>
                <div>&bull; Change event will be logged in the Platform Audit Trail</div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setPasswordModalUser(null)}
                  className="px-4 py-2 rounded-xl text-slate-600 bg-slate-100 dark:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-white bg-amber-600 hover:bg-amber-700 font-semibold"
                >
                  Save New Password
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deleteModalUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-md p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-rose-100 dark:bg-rose-950 text-rose-600 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Delete User Account</h3>
                <p className="text-xs text-slate-500">This action permanently deletes the user account.</p>
              </div>
            </div>

            {errorMessage && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700">
                {errorMessage}
              </div>
            )}

            <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-100 dark:border-slate-800 text-xs space-y-1.5">
              <div>
                User: <strong className="text-slate-900 dark:text-white">{deleteModalUser.name}</strong>
              </div>
              <div>
                Email: <span className="text-slate-600 dark:text-slate-400">{deleteModalUser.email}</span>
              </div>
              <div>
                Role: <span className="font-semibold text-purple-600">{deleteModalUser.role}</span>
              </div>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed">
              Historical work orders, reported faults, and past audit records created by this technician will remain preserved in the database for compliance.
            </p>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => setDeleteModalUser(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 bg-slate-100 dark:bg-slate-800"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700"
              >
                Delete Account
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
