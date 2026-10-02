import { Router } from 'express';
import { User, PRESET_USERS } from '../../../src/core/auth/types.ts';
import { SYSTEM_ROLES } from '../../../src/core/permissions/constants.ts';

export const authRouter = Router();

// In-memory backend user storage initialized with presets
let backendUsers: User[] = [...PRESET_USERS];

// GET /api/core/auth/users
authRouter.get('/users', (req, res) => {
  res.json({ success: true, data: backendUsers });
});

// GET /api/core/auth/roles
authRouter.get('/roles', (req, res) => {
  res.json({ success: true, data: SYSTEM_ROLES });
});

// POST /api/core/auth/users - Create User
authRouter.post('/users', (req, res) => {
  const { name, email, role, jobTitle, department, employeeId, password, status, avatarUrl } = req.body;

  if (!name || !email || !role) {
    return res.status(400).json({ success: false, error: 'Name, email, and role are required.' });
  }

  const existing = backendUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (existing) {
    return res.status(409).json({ success: false, error: 'User with this email already exists.' });
  }

  const newUser: User = {
    id: `usr-${Date.now().toString().slice(-6)}`,
    name,
    email,
    role,
    jobTitle: jobTitle || 'Technician',
    department: department || 'Maintenance & Reliability',
    employeeId: employeeId || `EMP-${Math.floor(100 + Math.random() * 900)}`,
    avatarUrl: avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80',
    password: password || 'ApexUser#2026',
    status: status || 'ACTIVE',
    createdAt: new Date().toISOString(),
  };

  backendUsers.unshift(newUser);
  res.status(201).json({ success: true, data: newUser });
});

// PATCH /api/core/auth/users/:id - Update User / Set Role / Set Password
authRouter.patch('/users/:id', (req, res) => {
  const { id } = req.params;
  const idx = backendUsers.findIndex(u => u.id === id);
  if (idx === -1) {
    return res.status(404).json({ success: false, error: 'User not found.' });
  }

  const { name, email, role, jobTitle, department, employeeId, status, password, avatarUrl } = req.body;
  const current = backendUsers[idx];

  backendUsers[idx] = {
    ...current,
    ...(name !== undefined ? { name } : {}),
    ...(email !== undefined ? { email } : {}),
    ...(role !== undefined ? { role } : {}),
    ...(jobTitle !== undefined ? { jobTitle } : {}),
    ...(department !== undefined ? { department } : {}),
    ...(employeeId !== undefined ? { employeeId } : {}),
    ...(status !== undefined ? { status } : {}),
    ...(password !== undefined ? { password } : {}),
    ...(avatarUrl !== undefined ? { avatarUrl } : {}),
  };

  res.json({ success: true, data: backendUsers[idx] });
});

// DELETE /api/core/auth/users/:id - Delete User
authRouter.delete('/users/:id', (req, res) => {
  const { id } = req.params;

  if (id === 'usr-admin-1') {
    return res.status(403).json({ success: false, error: 'Cannot delete root administrator account.' });
  }

  const exists = backendUsers.some(u => u.id === id);
  if (!exists) {
    return res.status(404).json({ success: false, error: 'User not found.' });
  }

  backendUsers = backendUsers.filter(u => u.id !== id);
  res.json({ success: true, message: 'User account deleted successfully.' });
});

