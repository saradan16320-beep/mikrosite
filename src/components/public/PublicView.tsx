import React, { useState, useMemo } from 'react';
import {
  CheckCircle2,
  MapPin,
  Share2,
  QrCode,
  Sun,
  Moon,
  Monitor,
  Search,
  Lock,
  ExternalLink,
  Sparkles,
} from 'lucide-react';
import { MicrositeLink, ProfileData } from '../../types';
import { LinkCard } from './LinkCard';
import { SocialBar } from './SocialBar';
import { QrModal } from './QrModal';
import { ShareModal } from './ShareModal';
import { useTheme } from '../../context/ThemeContext';
import { getThemeClasses } from '../../utils/iconMap';

interface PublicViewProps {
  profile: ProfileData;
  links: MicrositeLink[];
  onLinkClick: (id: string) => void;
  onOpenAdmin: () => void;
  isLiveConnected?: boolean;
}

export const PublicView: React.FC<PublicViewProps> = ({
  profile,
  links,
  onLinkClick,
  onOpenAdmin,
  isLiveConnected = true,
}) => {
  const { themeMode, isDark, setThemeMode, toggleTheme } = useTheme();
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');
  const [isQrOpen, setIsQrOpen] = useState<boolean>(false);
  const [isShareOpen, setIsShareOpen] = useState<boolean>(false);

  const theme = getThemeClasses(profile.themeColor);
  const activeLinks = useMemo(() => links.filter((link) => link.isActive), [links]);

  // Extract unique categories
  const categories = useMemo(() => {
    const list = Array.from(new Set(activeLinks.map((l) => l.category).filter(Boolean)));
    return ['Semua', ...list];
  }, [activeLinks]);

  // Filter links
  const filteredLinks = useMemo(() => {
    return activeLinks.filter((link) => {
      const matchesSearch =
        link.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (link.description && link.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
        link.url.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCat = selectedCategory === 'Semua' || link.category === selectedCategory;

      return matchesSearch && matchesCat;
    });
  }, [activeLinks, searchQuery, selectedCategory]);

  const currentUrl = typeof window !== 'undefined' ? window.location.href : 'https://mikrosite.me';

  // Background style classes
  const getBackgroundPattern = () => {
    switch (profile.backgroundStyle) {
      case 'dots':
        return 'bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] dark:bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:16px_16px]';
      case 'grid':
        return 'bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] [background-size:24px_24px]';
      case 'minimal':
        return '';
      case 'gradient':
      default:
        return 'bg-gradient-to-b from-slate-50 via-indigo-50/20 to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950';
    }
  };

  return (
    <div
      className={`min-h-screen transition-colors duration-300 text-slate-900 dark:text-slate-100 bg-slate-50 dark:bg-slate-950 ${getBackgroundPattern()}`}
    >
      {/* Top Floating Action Bar */}
      <header className="sticky top-0 z-30 w-full backdrop-blur-md bg-white/70 dark:bg-slate-900/70 border-b border-slate-200/60 dark:border-slate-800/60 px-4 py-3">
        <div className="max-w-2xl mx-auto flex items-center justify-between gap-2">
          {/* Logo or Micro-badge */}
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isLiveConnected ? 'bg-emerald-400' : 'bg-amber-400'}`}></span>
              <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${isLiveConnected ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
            </span>
            <span className="text-xs font-semibold tracking-wide text-slate-700 dark:text-slate-300">
              {profile.handle || 'portal-link'}
            </span>
            <span className="hidden sm:inline-flex text-[10px] font-medium px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-800/80">
              Realtime Firebase
            </span>
          </div>

          {/* Quick utility controls */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Share Modal Trigger */}
            <button
              onClick={() => setIsShareOpen(true)}
              title="Bagikan Tautan"
              className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <Share2 className="w-4 h-4" />
            </button>

            {/* QR Code Trigger */}
            <button
              onClick={() => setIsQrOpen(true)}
              title="Lihat QR Code"
              className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <QrCode className="w-4 h-4" />
            </button>

            {/* Theme Toggle */}
            <div className="relative inline-flex items-center p-1 rounded-xl bg-slate-200/80 dark:bg-slate-800 border border-slate-300/60 dark:border-slate-700/60">
              <button
                onClick={() => setThemeMode('light')}
                title="Mode Terang"
                className={`p-1 rounded-lg transition-colors ${
                  themeMode === 'light'
                    ? 'bg-white dark:bg-slate-700 text-amber-500 shadow-xs'
                    : 'text-slate-500 hover:text-slate-800 dark:text-slate-400'
                }`}
              >
                <Sun className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setThemeMode('dark')}
                title="Mode Gelap"
                className={`p-1 rounded-lg transition-colors ${
                  themeMode === 'dark'
                    ? 'bg-white dark:bg-slate-700 text-indigo-400 shadow-xs'
                    : 'text-slate-500 hover:text-slate-800 dark:text-slate-400'
                }`}
              >
                <Moon className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setThemeMode('system')}
                title="Mode Otomatis (Sistem)"
                className={`p-1 rounded-lg transition-colors ${
                  themeMode === 'system'
                    ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-xs'
                    : 'text-slate-500 hover:text-slate-800 dark:text-slate-400'
                }`}
              >
                <Monitor className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Admin entry button */}
            <button
              onClick={onOpenAdmin}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-white text-white dark:text-slate-900 shadow-xs hover:shadow-md transition-all ml-1"
            >
              <Lock className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Admin</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-xl mx-auto px-4 py-8 sm:py-12">
        {/* Profile Header */}
        <section className="text-center flex flex-col items-center">
          {/* Avatar with Glow & Ring */}
          <div className="relative group mb-4">
            <div
              className={`absolute -inset-1 rounded-full bg-gradient-to-r ${theme.gradient} opacity-50 group-hover:opacity-80 blur-md transition duration-500`}
            />
            <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden border-4 border-white dark:border-slate-900 shadow-xl bg-slate-200 dark:bg-slate-800">
              <img
                src={
                  profile.avatarUrl ||
                  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'
                }
                alt={profile.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  // Fallback avatar
                  (e.target as HTMLImageElement).src =
                    'https://ui-avatars.com/api/?name=' + encodeURIComponent(profile.name) + '&background=6366f1&color=fff';
                }}
              />
            </div>
            {/* Status Ping Badge */}
            <div className="absolute bottom-1 right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-white dark:border-slate-900 flex items-center justify-center shadow-xs">
              <span className="w-2 h-2 rounded-full bg-white animate-ping opacity-75" />
            </div>
          </div>

          {/* Name & Verified Badge */}
          <div className="flex items-center justify-center gap-1.5 flex-wrap">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              {profile.name}
            </h1>
            {profile.verified && (
              <span title="Terverifikasi" className="inline-flex text-indigo-500 dark:text-indigo-400">
                <CheckCircle2 className="w-5 h-5 fill-indigo-500/20" />
              </span>
            )}
          </div>

          {/* Handle / Tagline */}
          <p className="text-sm font-semibold text-indigo-600 dark:text-indigo-400 mt-0.5">
            {profile.handle} {profile.title && `• ${profile.title}`}
          </p>

          {/* Bio */}
          {profile.bio && (
            <p className="mt-3 text-sm text-slate-600 dark:text-slate-300 max-w-md leading-relaxed">
              {profile.bio}
            </p>
          )}

          {/* Location & Status Text */}
          <div className="mt-3.5 flex flex-wrap items-center justify-center gap-2 text-xs">
            {profile.location && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700/80">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                {profile.location}
              </span>
            )}

            {profile.statusText && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-800/60 font-medium">
                {profile.statusText}
              </span>
            )}
          </div>

          {/* Social Icons Bar */}
          <div className="w-full mt-2">
            <SocialBar socialLinks={profile.socialLinks} themeColor={profile.themeColor} />
          </div>
        </section>

        {/* Filter & Search Bar */}
        <section className="mt-6 mb-6 space-y-3">
          {/* Search box if more than 3 links */}
          {activeLinks.length > 3 && (
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Cari tautan, website, atau proyek..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl bg-white/90 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/50 shadow-xs"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"
                >
                  ✕
                </button>
              )}
            </div>
          )}

          {/* Category Pills (horizontal scroll if many) */}
          {categories.length > 2 && (
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
              {categories.map((cat) => {
                const isSelected = selectedCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`shrink-0 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 ${
                      isSelected
                        ? `${theme.accentBg} text-white shadow-xs`
                        : 'bg-white/80 dark:bg-slate-900/80 text-slate-600 dark:text-slate-400 border border-slate-200/80 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          )}
        </section>

        {/* Links List */}
        <section className="space-y-3.5">
          {filteredLinks.length > 0 ? (
            filteredLinks.map((link) => (
              <LinkCard
                key={link.id}
                link={link}
                themeColor={profile.themeColor}
                onLinkClick={onLinkClick}
              />
            ))
          ) : (
            <div className="text-center py-12 px-4 rounded-3xl bg-white/50 dark:bg-slate-900/50 border border-dashed border-slate-300 dark:border-slate-800">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto mb-3">
                <Search className="w-6 h-6" />
              </div>
              <p className="text-base font-semibold text-slate-700 dark:text-slate-300">
                Tidak ada tautan yang cocok
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                {searchQuery
                  ? `Tidak ada hasil pencarian untuk "${searchQuery}"`
                  : 'Belum ada tautan aktif dalam kategori ini.'}
              </p>
              {(searchQuery || selectedCategory !== 'Semua') && (
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('Semua');
                  }}
                  className="mt-4 px-4 py-1.5 rounded-xl text-xs font-semibold bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
                >
                  Reset Filter
                </button>
              )}
            </div>
          )}
        </section>

        {/* Footer */}
        <footer className="mt-14 text-center border-t border-slate-200/60 dark:border-slate-800/60 pt-8 pb-4">
          <div className="flex flex-col items-center justify-center gap-2">
            <button
              onClick={onOpenAdmin}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 transition-colors py-1 px-3 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Kelola Tautan (Admin Portal)</span>
            </button>
            <p className="text-[11px] text-slate-400 dark:text-slate-500">
              © {new Date().getFullYear()} {profile.name}. Semua hak cipta dilindungi.
            </p>
          </div>
        </footer>
      </main>

      {/* QR Code & Share Modals */}
      <QrModal
        isOpen={isQrOpen}
        onClose={() => setIsQrOpen(false)}
        url={currentUrl}
        name={profile.name}
      />
      <ShareModal
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        url={currentUrl}
        title={profile.name}
      />
    </div>
  );
};
