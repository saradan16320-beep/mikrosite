import React, { useState } from 'react';
import {
  Plus,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  ChevronUp,
  ChevronDown,
  ExternalLink,
  Layers,
  BarChart3,
  Settings,
  LogOut,
  Globe,
  Sparkles,
  Smartphone,
  Search,
  MousePointerClick,
  Check,
  Copy,
  Sun,
  Moon,
  Monitor,
} from 'lucide-react';
import { MicrositeLink, ProfileData } from '../../types';
import { storageService } from '../../services/storageService';
import { LinkModal } from './LinkModal';
import { ProfileEditor } from './ProfileEditor';
import { AnalyticsView } from './AnalyticsView';
import { SettingsBackup } from './SettingsBackup';
import { PublicView } from '../public/PublicView';
import { renderIcon, getThemeClasses } from '../../utils/iconMap';
import { useTheme } from '../../context/ThemeContext';

interface AdminDashboardProps {
  links: MicrositeLink[];
  profile: ProfileData;
  onRefreshData: () => void;
  onViewPublic: () => void;
  onLogout: () => void;
}

type AdminTab = 'links' | 'profile' | 'analytics' | 'settings';

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  links,
  profile,
  onRefreshData,
  onViewPublic,
  onLogout,
}) => {
  const { themeMode, setThemeMode } = useTheme();
  const [activeTab, setActiveTab] = useState<AdminTab>('links');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLink, setEditingLink] = useState<MicrositeLink | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [showLivePreview, setShowLivePreview] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('Semua');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const theme = getThemeClasses(profile.themeColor);

  // Categories list
  const categories = ['Semua', ...Array.from(new Set(links.map((l) => l.category).filter(Boolean)))];

  // Filtered links
  const filteredLinks = links.filter((l) => {
    const matchesSearch =
      l.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.url.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (l.description && l.description.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCat = filterCategory === 'Semua' || l.category === filterCategory;
    return matchesSearch && matchesCat;
  });

  const handleOpenAdd = () => {
    setEditingLink(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (link: MicrositeLink) => {
    setEditingLink(link);
    setIsModalOpen(true);
  };

  const handleSaveLink = (data: Omit<MicrositeLink, 'id' | 'clicks' | 'order' | 'createdAt' | 'updatedAt'>) => {
    if (editingLink) {
      storageService.updateLink(editingLink.id, data);
    } else {
      storageService.addLink(data);
    }
    onRefreshData();
  };

  const handleDeleteLink = (id: string) => {
    storageService.deleteLink(id);
    setDeleteConfirmId(null);
    onRefreshData();
  };

  const handleToggleActive = (id: string, current: boolean) => {
    storageService.updateLink(id, { isActive: !current });
    onRefreshData();
  };

  const handleToggleFeatured = (id: string, current: boolean) => {
    storageService.updateLink(id, { isFeatured: !current });
    onRefreshData();
  };

  const handleMove = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= links.length) return;

    const newLinks = [...links];
    const temp = newLinks[index];
    newLinks[index] = newLinks[targetIndex];
    newLinks[targetIndex] = temp;

    storageService.reorderLinks(newLinks.map((l) => l.id));
    onRefreshData();
  };

  const handleSaveProfile = (updated: ProfileData) => {
    storageService.saveProfile(updated);
    onRefreshData();
  };

  const handleResetClicks = () => {
    links.forEach((l) => {
      storageService.updateLink(l.id, { clicks: 0 });
    });
    onRefreshData();
  };

  const handleCopyUrl = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col transition-colors duration-200">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          {/* Brand & Admin Badge */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-base shadow-xs">
              M
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-sm font-bold text-slate-900 dark:text-white">
                  Panel Administrator
                </h1>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                  Realtime
                </span>
              </div>
              <p className="text-[11px] text-slate-500">
                Mikrosite: {profile.name} ({profile.handle})
              </p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2">
            {/* Live preview toggle (desktop) */}
            <button
              onClick={() => setShowLivePreview(!showLivePreview)}
              className={`hidden lg:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                showLivePreview
                  ? 'bg-indigo-50 border-indigo-300 text-indigo-700 dark:bg-indigo-950/60 dark:border-indigo-700 dark:text-indigo-300'
                  : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>{showLivePreview ? 'Tutup Preview' : 'Split Preview'}</span>
            </button>

            {/* View Public Page */}
            <button
              onClick={onViewPublic}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 shadow-2xs transition-all"
            >
              <Globe className="w-3.5 h-3.5 text-indigo-500" />
              <span>Lihat Publik</span>
            </button>

            {/* Theme switcher */}
            <div className="hidden sm:inline-flex items-center p-1 rounded-xl bg-slate-200/80 dark:bg-slate-800 border border-slate-300/60 dark:border-slate-700/60">
              <button
                onClick={() => setThemeMode('light')}
                className={`p-1 rounded-lg transition-colors ${
                  themeMode === 'light' ? 'bg-white dark:bg-slate-700 text-amber-500 shadow-xs' : 'text-slate-500'
                }`}
              >
                <Sun className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setThemeMode('dark')}
                className={`p-1 rounded-lg transition-colors ${
                  themeMode === 'dark' ? 'bg-white dark:bg-slate-700 text-indigo-400 shadow-xs' : 'text-slate-500'
                }`}
              >
                <Moon className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setThemeMode('system')}
                className={`p-1 rounded-lg transition-colors ${
                  themeMode === 'system' ? 'bg-white dark:bg-slate-700 text-indigo-600 shadow-xs' : 'text-slate-500'
                }`}
              >
                <Monitor className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Logout */}
            <button
              onClick={onLogout}
              title="Keluar dari Admin"
              className="p-2 rounded-xl text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/50 border border-rose-200/60 dark:border-rose-900/60 transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 flex gap-6">
        {/* Left / Center Work Area */}
        <div className="flex-1 min-w-0">
          {/* Tabs bar */}
          <div className="flex items-center gap-1.5 p-1.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs mb-6 overflow-x-auto">
            <button
              onClick={() => setActiveTab('links')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                activeTab === 'links'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Globe className="w-4 h-4" />
              <span>Kelola Tautan ({links.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('profile')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                activeTab === 'profile'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>Profil & Tema</span>
            </button>

            <button
              onClick={() => setActiveTab('analytics')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                activeTab === 'analytics'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span>Statistik & Klik</span>
            </button>

            <button
              onClick={() => setActiveTab('settings')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                activeTab === 'settings'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Settings className="w-4 h-4" />
              <span>Pengaturan & Backup</span>
            </button>
          </div>

          {/* TAB 1: KELOLA TAUTAN */}
          {activeTab === 'links' && (
            <div className="space-y-4">
              {/* Top controls: Search, category filter & Add button */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs">
                <div className="flex flex-1 items-center gap-2">
                  {/* Search */}
                  <div className="relative flex-1 max-w-xs">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Cari link..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500/50"
                    />
                  </div>

                  {/* Category Filter */}
                  <select
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    className="py-2 px-3 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-hidden"
                  >
                    {categories.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Add Link Button */}
                <button
                  onClick={handleOpenAdd}
                  className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white shadow-md hover:shadow-lg transition-all cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Tambah Tautan Baru</span>
                </button>
              </div>

              {/* Links list */}
              <div className="space-y-3">
                {filteredLinks.length > 0 ? (
                  filteredLinks.map((link, index) => {
                    const originalIndex = links.findIndex((l) => l.id === link.id);
                    return (
                      <div
                        key={link.id}
                        className={`p-4 rounded-3xl border transition-all ${
                          link.isActive
                            ? 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-xs'
                            : 'bg-slate-50/70 dark:bg-slate-900/40 border-dashed border-slate-300 dark:border-slate-800 opacity-60'
                        }`}
                      >
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                          {/* Left: Reorder, Icon & Info */}
                          <div className="flex items-start sm:items-center gap-3 min-w-0 flex-1">
                            {/* Reorder Buttons */}
                            <div className="flex flex-col items-center gap-0.5 shrink-0">
                              <button
                                onClick={() => handleMove(originalIndex, 'up')}
                                disabled={originalIndex === 0}
                                title="Geser ke Atas"
                                className="p-1 rounded-md text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 disabled:opacity-20"
                              >
                                <ChevronUp className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleMove(originalIndex, 'down')}
                                disabled={originalIndex === links.length - 1}
                                title="Geser ke Bawah"
                                className="p-1 rounded-md text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 disabled:opacity-20"
                              >
                                <ChevronDown className="w-3.5 h-3.5" />
                              </button>
                            </div>

                            {/* Icon */}
                            <div className="w-11 h-11 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0 border border-indigo-100 dark:border-indigo-900/60 shadow-2xs">
                              {renderIcon(link.icon, 'w-5 h-5')}
                            </div>

                            {/* Text Info */}
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-2 flex-wrap">
                                <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                                  {link.title}
                                </h4>
                                {link.isFeatured && (
                                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
                                    <Sparkles className="w-2.5 h-2.5" />
                                    <span>Unggulan</span>
                                  </span>
                                )}
                                {!link.isActive && (
                                  <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                                    Disembunyikan
                                  </span>
                                )}
                              </div>

                              <div className="flex items-center gap-2 mt-0.5">
                                <a
                                  href={link.url}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 font-mono truncate max-w-xs"
                                >
                                  <span className="truncate">{link.url}</span>
                                  <ExternalLink className="w-3 h-3 shrink-0" />
                                </a>
                                <button
                                  onClick={() => handleCopyUrl(link.url, link.id)}
                                  title="Salin URL"
                                  className="text-slate-400 hover:text-slate-600"
                                >
                                  {copiedId === link.id ? (
                                    <Check className="w-3 h-3 text-emerald-500" />
                                  ) : (
                                    <Copy className="w-3 h-3" />
                                  )}
                                </button>
                              </div>

                              {link.description && (
                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-1">
                                  {link.description}
                                </p>
                              )}

                              {/* Badges: Category & Clicks */}
                              <div className="flex items-center gap-3 mt-2 text-[11px] text-slate-500">
                                <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 font-medium border border-slate-200 dark:border-slate-700">
                                  {link.category}
                                </span>
                                <span className="inline-flex items-center gap-1 font-mono">
                                  <MousePointerClick className="w-3 h-3 text-slate-400" />
                                  {link.clicks || 0} klik
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Right Controls: Active toggle, Featured toggle, Edit, Delete */}
                          <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                            {/* Toggle Active */}
                            <button
                              onClick={() => handleToggleActive(link.id, link.isActive)}
                              title={link.isActive ? 'Sembunyikan tautan' : 'Tampilkan ke publik'}
                              className={`p-2 rounded-xl text-xs font-medium border transition-colors ${
                                link.isActive
                                  ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
                                  : 'bg-slate-100 dark:bg-slate-800 text-slate-500 border-slate-200 dark:border-slate-700'
                              }`}
                            >
                              {link.isActive ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                            </button>

                            {/* Toggle Featured */}
                            <button
                              onClick={() => handleToggleFeatured(link.id, link.isFeatured)}
                              title={link.isFeatured ? 'Batalkan unggulan' : 'Jadikan unggulan'}
                              className={`p-2 rounded-xl text-xs font-medium border transition-colors ${
                                link.isFeatured
                                  ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800'
                                  : 'bg-slate-100 dark:bg-slate-800 text-slate-400 border-slate-200 dark:border-slate-700'
                              }`}
                            >
                              <Sparkles className="w-4 h-4" />
                            </button>

                            {/* Edit Button */}
                            <button
                              onClick={() => handleOpenEdit(link)}
                              title="Edit tautan"
                              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 transition-colors"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>

                            {/* Delete Button */}
                            <button
                              onClick={() => setDeleteConfirmId(link.id)}
                              title="Hapus tautan"
                              className="p-2 rounded-xl bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900/50 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-slate-300 dark:border-slate-800">
                    <Globe className="w-10 h-10 text-slate-400 mx-auto mb-3" />
                    <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300">
                      Tidak ada tautan ditemukan
                    </h3>
                    <p className="text-xs text-slate-500 mt-1 mb-4">
                      {searchQuery
                        ? 'Coba gunakan kata kunci pencarian yang lain'
                        : 'Mulai dengan menambahkan situs web atau tautan pertama Anda.'}
                    </p>
                    <button
                      onClick={handleOpenAdd}
                      className="px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-600 text-white hover:bg-indigo-700"
                    >
                      Tambah Tautan Pertama
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: PROFIL & TEMA */}
          {activeTab === 'profile' && (
            <ProfileEditor initialProfile={profile} onSave={handleSaveProfile} />
          )}

          {/* TAB 3: STATISTIK */}
          {activeTab === 'analytics' && (
            <AnalyticsView links={links} onResetClicks={handleResetClicks} />
          )}

          {/* TAB 4: PENGATURAN & BACKUP */}
          {activeTab === 'settings' && (
            <SettingsBackup onRefreshData={onRefreshData} />
          )}
        </div>

        {/* Right: Live Mockup Preview Drawer (optional toggle) */}
        {showLivePreview && (
          <aside className="hidden lg:block w-[380px] shrink-0 sticky top-20 self-start">
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-4 border border-slate-200 dark:border-slate-800 shadow-xl">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800 mb-3">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <Smartphone className="w-4 h-4 text-indigo-500" />
                  <span>Pratinjau Langsung (Mockup)</span>
                </span>
                <span className="text-[10px] text-emerald-500 font-medium">● Realtime Sync</span>
              </div>

              {/* Phone Frame */}
              <div className="relative rounded-2xl overflow-hidden border-4 border-slate-800 bg-white dark:bg-slate-950 shadow-inner h-[620px] overflow-y-auto">
                <PublicView
                  profile={profile}
                  links={links}
                  onLinkClick={(id) => storageService.incrementClick(id)}
                  onOpenAdmin={() => {}}
                />
              </div>
            </div>
          </aside>
        )}
      </div>

      {/* Modal Add / Edit Link */}
      <LinkModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveLink}
        editingLink={editingLink}
      />

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-sm rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-2xl text-center">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 flex items-center justify-center mx-auto mb-3">
              <Trash2 className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold text-slate-900 dark:text-white">
              Hapus Tautan Ini?
            </h4>
            <p className="text-xs text-slate-500 mt-1 mb-5">
              Tautan akan dihapus secara permanen dari mikrosite publik Anda.
            </p>
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
              >
                Batal
              </button>
              <button
                onClick={() => handleDeleteLink(deleteConfirmId)}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white shadow-xs"
              >
                Ya, Hapus Tautan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
