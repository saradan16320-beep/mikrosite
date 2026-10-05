import React, { useState } from 'react';
import {
  KeyRound,
  Download,
  Upload,
  RotateCcw,
  Check,
  ShieldAlert,
  Save,
  FileJson,
  AlertTriangle,
} from 'lucide-react';
import { storageService } from '../../services/storageService';

interface SettingsBackupProps {
  onRefreshData: () => void;
}

export const SettingsBackup: React.FC<SettingsBackupProps> = ({ onRefreshData }) => {
  const currentCreds = storageService.getAdminCredentials();
  const [username, setUsername] = useState(currentCreds.username);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordMsg, setPasswordMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const [importStatus, setImportStatus] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [showConfirmReset, setShowConfirmReset] = useState(false);

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordMsg(null);

    if (!username.trim()) {
      setPasswordMsg({ type: 'error', text: 'Username tidak boleh kosong' });
      return;
    }

    if (newPassword && newPassword.length < 4) {
      setPasswordMsg({ type: 'error', text: 'Kata sandi minimal 4 karakter' });
      return;
    }

    if (newPassword && newPassword !== confirmPassword) {
      setPasswordMsg({ type: 'error', text: 'Konfirmasi kata sandi tidak cocok' });
      return;
    }

    const finalPass = newPassword ? newPassword : currentCreds.passwordHash;
    await storageService.updateAdminCredentials(username.trim(), finalPass);
    setPasswordMsg({ type: 'success', text: 'Kredensial login admin berhasil diperbarui di database Firebase!' });
    setNewPassword('');
    setConfirmPassword('');
  };

  const handleExport = () => {
    const dataStr = storageService.exportData();
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mikrosite-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      const content = event.target?.result as string;
      const res = await storageService.importData(content);
      if (res.success) {
        setImportStatus({ type: 'success', text: res.message });
        onRefreshData();
      } else {
        setImportStatus({ type: 'error', text: res.message });
      }
    };
    reader.readAsText(file);
    // Reset input
    e.target.value = '';
  };

  const handleResetToDefault = async () => {
    await storageService.resetAll();
    setShowConfirmReset(false);
    onRefreshData();
    setImportStatus({ type: 'success', text: 'Semua data mikrosite dikembalikan ke setelan awal di database Firebase!' });
  };

  return (
    <div className="space-y-6">
      {/* Keamanan & Akun Admin */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs">
        <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-4">
          <KeyRound className="w-5 h-5 text-indigo-500" />
          <span>Keamanan & Kredensial Administrator</span>
        </h3>

        {passwordMsg && (
          <div
            className={`mb-4 p-3.5 rounded-2xl text-xs flex items-center gap-2 ${
              passwordMsg.type === 'success'
                ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200'
                : 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200'
            }`}
          >
            {passwordMsg.type === 'success' ? <Check className="w-4 h-4" /> : <ShieldAlert className="w-4 h-4" />}
            <span>{passwordMsg.text}</span>
          </div>
        )}

        <form onSubmit={handleUpdatePassword} className="space-y-4 max-w-md">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Username Admin
            </label>
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500/50"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Kata Sandi Baru (Kosongkan jika tidak ingin mengubah)
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Minimal 4 karakter"
              className="w-full px-3.5 py-2.5 text-sm rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500/50"
            />
          </div>

          {newPassword && (
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Konfirmasi Kata Sandi Baru
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Ulangi kata sandi baru"
                className="w-full px-3.5 py-2.5 text-sm rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500/50"
              />
            </div>
          )}

          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs hover:shadow-md transition-all flex items-center gap-2 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Simpan Kredensial Baru</span>
          </button>
        </form>
      </div>

      {/* Backup & Pemulihan Data */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs">
        <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-2">
          <FileJson className="w-5 h-5 text-indigo-500" />
          <span>Cadangan (Backup) & Pemulihan Data</span>
        </h3>
        <p className="text-xs text-slate-500 mb-5">
          Simpan seluruh konfigurasi tautan dan profil Anda ke dalam file JSON, atau pulihkan kapan saja.
        </p>

        {importStatus && (
          <div
            className={`mb-4 p-3.5 rounded-2xl text-xs flex items-center gap-2 ${
              importStatus.type === 'success'
                ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200'
                : 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200'
            }`}
          >
            {importStatus.type === 'success' ? <Check className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
            <span>{importStatus.text}</span>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Export */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex flex-col justify-between">
            <div>
              <h4 className="text-sm font-semibold text-slate-900 dark:text-white mb-1">
                Ekspor Data Mikrosite
              </h4>
              <p className="text-xs text-slate-500 mb-4">
                Unduh file cadangan yang berisi seluruh data tautan, klik, profil, dan tema.
              </p>
            </div>
            <button
              onClick={handleExport}
              className="inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-semibold bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/60 dark:hover:bg-indigo-900/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800 transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Unduh File Backup (.json)</span>
            </button>
          </div>

          {/* Import */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex flex-col justify-between">
            <div>
              <h4 className="text-sm font-semibold text-slate-900 dark:text-white mb-1">
                Impor Data dari JSON
              </h4>
              <p className="text-xs text-slate-500 mb-4">
                Unggah file cadangan JSON untuk memulihkan seluruh struktur dan tautan.
              </p>
            </div>
            <label className="inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-semibold bg-white dark:bg-slate-700 hover:bg-slate-100 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-600 cursor-pointer transition-colors shadow-2xs">
              <Upload className="w-4 h-4" />
              <span>Pilih File Backup (.json)</span>
              <input type="file" accept=".json" onChange={handleFileImport} className="hidden" />
            </label>
          </div>
        </div>
      </div>

      {/* Zona Bahaya / Reset Default */}
      <div className="bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/40 rounded-3xl p-6">
        <h3 className="text-base font-bold text-rose-800 dark:text-rose-300 flex items-center gap-2 mb-2">
          <AlertTriangle className="w-5 h-5 text-rose-500" />
          <span>Kembalikan ke Contoh Bawaan (Factory Reset)</span>
        </h3>
        <p className="text-xs text-rose-600/80 dark:text-rose-400/80 mb-4 max-w-xl leading-relaxed">
          Tindakan ini akan menghapus semua perubahan Anda dan mengembalikan daftar tautan, profil, serta akun administrator ke data awal.
        </p>

        <button
          onClick={() => setShowConfirmReset(true)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white shadow-xs transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Kembalikan ke Setelan Awal</span>
        </button>
      </div>

      {/* Reset Confirmation Dialog */}
      {showConfirmReset && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-sm rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-2xl text-center">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 dark:bg-rose-950/60 text-rose-600 flex items-center justify-center mx-auto mb-3">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold text-slate-900 dark:text-white">
              Reset Semua ke Setelan Awal?
            </h4>
            <p className="text-xs text-slate-500 mt-1 mb-5">
              Semua link dan profil Anda akan digantikan dengan data contoh default. Pastikan Anda telah mengunduh backup jika ingin menyimpan data Anda.
            </p>
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => setShowConfirmReset(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
              >
                Batal
              </button>
              <button
                onClick={handleResetToDefault}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white shadow-xs"
              >
                Ya, Reset Sekarang
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
