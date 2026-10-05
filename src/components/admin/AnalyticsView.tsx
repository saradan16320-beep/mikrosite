import React, { useState } from 'react';
import {
  BarChart3,
  MousePointerClick,
  Link2,
  Eye,
  EyeOff,
  Flame,
  RotateCcw,
  ExternalLink,
} from 'lucide-react';
import { MicrositeLink } from '../../types';
import { renderIcon } from '../../utils/iconMap';

interface AnalyticsViewProps {
  links: MicrositeLink[];
  onResetClicks: () => void;
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({ links, onResetClicks }) => {
  const [showConfirmReset, setShowConfirmReset] = useState(false);

  const totalLinks = links.length;
  const activeLinks = links.filter((l) => l.isActive).length;
  const hiddenLinks = totalLinks - activeLinks;
  const totalClicks = links.reduce((sum, l) => sum + (l.clicks || 0), 0);

  // Sort by clicks desc
  const sortedByClicks = [...links].sort((a, b) => (b.clicks || 0) - (a.clicks || 0));
  const maxClicks = sortedByClicks.length > 0 && sortedByClicks[0].clicks > 0 ? sortedByClicks[0].clicks : 1;

  // Category breakdown
  const categoryStats = links.reduce((acc, curr) => {
    const cat = curr.category || 'Lainnya';
    acc[cat] = (acc[cat] || 0) + (curr.clicks || 0);
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="space-y-6">
      {/* Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {/* Total Clicks */}
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold">Total Klik Pengunjung</span>
            <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
              <MousePointerClick className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-mono">
            {totalClicks.toLocaleString()}
          </p>
          <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
            Realtime terakumulasi
          </span>
        </div>

        {/* Total Links */}
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold">Total Tautan</span>
            <div className="p-2 rounded-xl bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400">
              <Link2 className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-mono">
            {totalLinks}
          </p>
          <span className="text-[11px] text-slate-500">Semua entri database</span>
        </div>

        {/* Active Links */}
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold">Tautan Aktif</span>
            <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
              <Eye className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-mono">
            {activeLinks}
          </p>
          <span className="text-[11px] text-emerald-600 dark:text-emerald-400">
            Tampil ke publik
          </span>
        </div>

        {/* Hidden Links */}
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold">Tautan Nonaktif</span>
            <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400">
              <EyeOff className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-mono">
            {hiddenLinks}
          </p>
          <span className="text-[11px] text-slate-500">Disimpan/diarsipkan</span>
        </div>
      </div>

      {/* Top Clicked Links Leaderboard */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400">
              <Flame className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Peringkat Tautan Paling Banyak Diklik
              </h3>
              <p className="text-xs text-slate-500">Tautan dengan interaksi tertinggi dari pengunjung</p>
            </div>
          </div>

          <button
            onClick={() => setShowConfirmReset(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Statistik</span>
          </button>
        </div>

        {/* List of links */}
        <div className="space-y-3">
          {sortedByClicks.map((link, idx) => {
            const percentage = Math.round(((link.clicks || 0) / maxClicks) * 100);
            return (
              <div
                key={link.id}
                className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80"
              >
                <div className="flex items-center justify-between gap-3 mb-2">
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="w-6 text-center font-bold text-xs text-slate-400">
                      #{idx + 1}
                    </span>
                    <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
                      {renderIcon(link.icon, 'w-4 h-4')}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-slate-900 dark:text-white truncate">
                        {link.title}
                      </p>
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[11px] text-slate-500 hover:text-indigo-500 flex items-center gap-1 truncate"
                      >
                        <span className="truncate">{link.url}</span>
                        <ExternalLink className="w-3 h-3 shrink-0" />
                      </a>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-sm font-bold text-slate-900 dark:text-white font-mono">
                      {link.clicks || 0}
                    </span>
                    <span className="text-xs text-slate-500 ml-1">klik</span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-indigo-600 dark:bg-indigo-500 h-full rounded-full transition-all duration-500"
                    style={{ width: `${Math.max(percentage, 4)}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Categories Breakdown */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs">
        <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-4">
          <BarChart3 className="w-5 h-5 text-indigo-500" />
          <span>Distribusi Klik Berdasarkan Kategori</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {Object.entries(categoryStats).map(([cat, clicks]) => (
            <div
              key={cat}
              className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center justify-between"
            >
              <div>
                <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">{cat}</p>
                <p className="text-[11px] text-slate-500">
                  {links.filter((l) => l.category === cat).length} tautan
                </p>
              </div>
              <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400 font-mono">
                {clicks} klik
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Confirmation modal for reset */}
      {showConfirmReset && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-sm rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-2xl text-center">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 flex items-center justify-center mx-auto mb-3">
              <RotateCcw className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold text-slate-900 dark:text-white">
              Reset Semua Data Klik?
            </h4>
            <p className="text-xs text-slate-500 mt-1 mb-5">
              Semua hitungan klik tautan akan dikembalikan ke angka 0. Tindakan ini tidak dapat dibatalkan.
            </p>
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => setShowConfirmReset(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
              >
                Batal
              </button>
              <button
                onClick={() => {
                  onResetClicks();
                  setShowConfirmReset(false);
                }}
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
