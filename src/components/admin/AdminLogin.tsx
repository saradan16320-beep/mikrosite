import React, { useState } from 'react';
import { Lock, User, Eye, EyeOff, ArrowLeft, ShieldCheck, KeyRound, Sun, Moon, Monitor } from 'lucide-react';
import { storageService } from '../../services/storageService';
import { useTheme } from '../../context/ThemeContext';

interface AdminLoginProps {
  onSuccess: () => void;
  onBackToPublic: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onSuccess, onBackToPublic }) => {
  const { themeMode, setThemeMode } = useTheme();
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin123');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const ok = await storageService.loginAdmin(username, password);
      if (ok) {
        onSuccess();
      } else {
        setError('Username atau kata sandi tidak cocok. Silakan periksa kembali.');
      }
    } catch {
      setError('Terjadi kendala saat memeriksa kredensial login.');
    } finally {
      setLoading(false);
    }
  };

  const handleAutoFill = () => {
    const creds = storageService.getAdminCredentials();
    setUsername(creds.username);
    setPassword(creds.passwordHash);
    setError(null);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-100 dark:bg-slate-950 transition-colors">
      <div className="w-full max-w-md">
        {/* Top bar with Back Button and Theme Toggle */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={onBackToPublic}
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Halaman Publik</span>
          </button>

          <div className="inline-flex items-center p-1 rounded-xl bg-slate-200/80 dark:bg-slate-800 border border-slate-300/60 dark:border-slate-700/60">
            <button
              onClick={() => setThemeMode('light')}
              title="Mode Terang"
              className={`p-1 rounded-lg transition-colors ${
                themeMode === 'light' ? 'bg-white dark:bg-slate-700 text-amber-500 shadow-xs' : 'text-slate-500'
              }`}
            >
              <Sun className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setThemeMode('dark')}
              title="Mode Gelap"
              className={`p-1 rounded-lg transition-colors ${
                themeMode === 'dark' ? 'bg-white dark:bg-slate-700 text-indigo-400 shadow-xs' : 'text-slate-500'
              }`}
            >
              <Moon className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setThemeMode('system')}
              title="Mode Otomatis (Sistem)"
              className={`p-1 rounded-lg transition-colors ${
                themeMode === 'system' ? 'bg-white dark:bg-slate-700 text-indigo-600 shadow-xs' : 'text-slate-500'
              }`}
            >
              <Monitor className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Card */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto mb-4 border border-indigo-100 dark:border-indigo-900/60 shadow-xs">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              Administrator Portal
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Masuk untuk menambah, mengedit, menghapus tautan, dan mengatur profil
            </p>
          </div>

          {/* Quick Credential Hint Banner */}
          <div className="mb-5 p-3.5 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200/60 dark:border-indigo-800/60 flex items-center justify-between text-xs">
            <div>
              <p className="font-semibold text-indigo-900 dark:text-indigo-200">
                Akun Admin Default:
              </p>
              <p className="text-indigo-700 dark:text-indigo-300 font-mono text-[11px] mt-0.5">
                Username: <span className="font-bold">admin</span> | Sandi:{' '}
                <span className="font-bold">admin123</span>
              </p>
            </div>
            <button
              type="button"
              onClick={handleAutoFill}
              className="px-2.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-[11px] transition-colors shrink-0 shadow-xs"
            >
              Isi Otomatis
            </button>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900/60 text-rose-700 dark:text-rose-300 text-xs">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Username Admin
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Masukkan username admin"
                  className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500/50"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Kata Sandi (Password)
              </label>
              <div className="relative">
                <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Masukkan kata sandi"
                  className="w-full pl-10 pr-10 py-2.5 text-sm rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500/50"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3 rounded-xl font-semibold text-sm bg-indigo-600 hover:bg-indigo-700 text-white shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Lock className="w-4 h-4" />
              <span>{loading ? 'Memverifikasi...' : 'Masuk ke Dashboard Admin'}</span>
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-[11px] text-slate-400 dark:text-slate-500">
              Kata sandi dapat diubah kapan saja di tab Pengaturan setelah berhasil masuk.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
