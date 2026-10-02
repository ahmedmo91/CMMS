import React, { useState } from 'react';
import { useAuth } from '../AuthContext.tsx';
import {
  Lock,
  Mail,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  Building,
  AlertTriangle,
  UserCheck,
  CheckCircle2,
  Sparkles,
  Layers,
} from 'lucide-react';

interface LoginPageProps {
  onSuccess?: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onSuccess }) => {
  const { allUsers, login, switchUser } = useAuth();

  const [email, setEmail] = useState('marcus.vance@apexcooling.com');
  const [password, setPassword] = useState('AdminPassword#2026');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    setTimeout(() => {
      const res = login(email, password);
      setLoading(false);
      if (!res.success) {
        setError(res.error || 'Invalid credentials.');
      } else {
        onSuccess?.();
      }
    }, 200);
  };

  const handleQuickLogin = (user: typeof allUsers[0]) => {
    setEmail(user.email);
    setPassword(user.password || 'ApexUser#2026');
    setError(null);

    // Fast switch directly
    switchUser(user.id);
    onSuccess?.();
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col justify-between p-4 sm:p-6 lg:p-8 relative overflow-hidden font-sans">
      {/* Background ambient gradient accents */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header */}
      <header className="relative z-10 max-w-6xl w-full mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-400 text-white flex items-center justify-center font-black text-lg shadow-lg shadow-indigo-500/20">
            A
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-white tracking-tight text-lg">ApexCMMS</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-800">
                v1.2.0
              </span>
            </div>
            <span className="text-xs text-slate-400">Enterprise Modular Maintenance Platform</span>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-2 text-xs text-slate-400 bg-slate-800/60 px-3 py-1.5 rounded-xl border border-slate-700/60">
          <Building className="w-3.5 h-3.5 text-indigo-400" />
          <span>Facility: <strong>Plant 04 Machining & Forming</strong></span>
          <span className="font-mono text-[10px] text-slate-400 ml-1">[APX-PLANT-04]</span>
        </div>
      </header>

      {/* Main Container */}
      <div className="relative z-10 max-w-5xl w-full mx-auto my-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Column: Sign In Card (5 Cols) */}
        <div className="lg:col-span-5 bg-slate-800/80 backdrop-blur-md rounded-2xl border border-slate-700/80 p-6 sm:p-8 shadow-2xl">
          <div className="mb-6">
            <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-400">Security Gate</span>
            <h2 className="text-2xl font-bold tracking-tight text-white mt-1">Platform Sign In</h2>
            <p className="text-xs text-slate-400 mt-1">
              Enter your corporate credentials to access operational workspaces and fault logs.
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2 animate-in fade-in duration-150">
              <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-300 mb-1.5">
                Corporate Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  placeholder="name@apexcooling.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-900/80 border border-slate-700 rounded-xl text-white placeholder:text-slate-500 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 text-xs"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="font-semibold text-slate-300">
                  Password
                </label>
                <span className="text-[11px] text-slate-400">Default: in demo persona tiles</span>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 bg-slate-900/80 border border-slate-700 rounded-xl text-white placeholder:text-slate-500 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 text-xs font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3 px-4 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 transition-colors shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2"
            >
              <span>{loading ? 'Authenticating...' : 'Sign In to Plant Console'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-slate-700/60 flex items-center justify-between text-[11px] text-slate-400">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              RBAC Protected Session
            </span>
            <span>Site: APX-PLANT-04</span>
          </div>
        </div>

        {/* Right Column: 1-Click Demo Persona Access (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-slate-800/40 rounded-2xl border border-slate-700/60 p-6">
            <div className="flex items-center gap-2 text-indigo-400 mb-1">
              <Sparkles className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-wider">Quick Demo Persona Access</span>
            </div>
            <h3 className="text-base font-bold text-white">Instant 1-Click Role Login</h3>
            <p className="text-xs text-slate-400 mt-1 mb-4 leading-relaxed">
              Select any pre-configured persona below to immediately log in with that user’s specific permissions and explore the role-based dashboard:
            </p>

            <div className="space-y-2.5">
              {allUsers.map(user => {
                const getRoleBadgeStyle = (role: string) => {
                  switch (role) {
                    case 'ADMIN':
                      return 'bg-purple-950/80 text-purple-300 border-purple-800';
                    case 'MAINT_SUPERVISOR':
                      return 'bg-blue-950/80 text-blue-300 border-blue-800';
                    case 'TECHNICIAN':
                      return 'bg-amber-950/80 text-amber-300 border-amber-800';
                    case 'OPERATOR':
                      return 'bg-emerald-950/80 text-emerald-300 border-emerald-800';
                    default:
                      return 'bg-slate-800 text-slate-300 border-slate-700';
                  }
                };

                return (
                  <div
                    key={user.id}
                    onClick={() => handleQuickLogin(user)}
                    className="p-3 bg-slate-900/60 hover:bg-slate-800/90 rounded-xl border border-slate-700/70 hover:border-indigo-500/80 cursor-pointer transition-all flex items-center justify-between gap-3 group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={user.avatarUrl}
                        alt={user.name}
                        className="w-10 h-10 rounded-full object-cover ring-2 ring-slate-700 group-hover:ring-indigo-500 transition-all shrink-0"
                      />
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-xs text-white group-hover:text-indigo-300 transition-colors truncate">
                            {user.name}
                          </span>
                          <span className={`text-[10px] font-bold px-2 py-0.2 rounded-full border ${getRoleBadgeStyle(user.role)}`}>
                            {user.role}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-400 truncate mt-0.5">
                          {user.jobTitle} &bull; <span className="font-mono">{user.email}</span>
                        </div>
                      </div>
                    </div>

                    <div className="shrink-0 flex items-center gap-2">
                      <span className="hidden sm:inline-block text-[11px] font-semibold text-indigo-400 group-hover:underline">
                        Sign In &rarr;
                      </span>
                      <div className="w-7 h-7 rounded-lg bg-slate-800 group-hover:bg-indigo-600 text-slate-400 group-hover:text-white flex items-center justify-center transition-colors">
                        <UserCheck className="w-3.5 h-3.5" />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 max-w-6xl w-full mx-auto pt-4 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2">
        <span>ApexCMMS Modular Plant Architecture &bull; Maintenance Intelligence</span>
        <div className="flex items-center gap-4 text-[11px]">
          <span>Audit Logging Active</span>
          <span>&bull;</span>
          <span>Role-Based Access Enforcement</span>
        </div>
      </footer>
    </div>
  );
};
