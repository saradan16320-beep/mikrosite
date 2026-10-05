import React, { useState } from 'react';
import {
  Save,
  Check,
  User,
  AtSign,
  Briefcase,
  MapPin,
  Sparkles,
  Palette,
  Image,
  Layers,
  ShieldCheck,
} from 'lucide-react';
import { ProfileData, SocialLinkItem, ThemeColorOption, BackgroundStyleOption } from '../../types';
import { SOCIAL_PLATFORMS, getThemeClasses } from '../../utils/iconMap';

interface ProfileEditorProps {
  initialProfile: ProfileData;
  onSave: (updated: ProfileData) => void;
}

const AVATAR_PRESETS = [
  {
    name: 'Pria Professional',
    url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
  },
  {
    name: 'Developer Tech',
    url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80',
  },
  {
    name: 'Creative Designer',
    url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80',
  },
  {
    name: 'Minimalist Portrait',
    url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
  },
];

const THEME_OPTIONS: { id: ThemeColorOption; name: string; hex: string }[] = [
  { id: 'indigo', name: 'Indigo Modern', hex: '#6366f1' },
  { id: 'emerald', name: 'Emerald Nature', hex: '#10b981' },
  { id: 'violet', name: 'Violet Cyber', hex: '#8b5cf6' },
  { id: 'rose', name: 'Rose Vibrant', hex: '#f43f5e' },
  { id: 'amber', name: 'Amber Warm', hex: '#f59e0b' },
  { id: 'cyan', name: 'Cyan Clean', hex: '#06b6d4' },
  { id: 'slate', name: 'Slate Minimalist', hex: '#475569' },
];

export const ProfileEditor: React.FC<ProfileEditorProps> = ({ initialProfile, onSave }) => {
  const [profile, setProfile] = useState<ProfileData>(initialProfile);
  const [socials, setSocials] = useState<SocialLinkItem[]>(initialProfile.socialLinks || []);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleProfileChange = (key: keyof ProfileData, val: any) => {
    setProfile((prev) => ({ ...prev, [key]: val }));
  };

  const handleSocialChange = (id: string, url: string, active: boolean) => {
    setSocials((prev) =>
      prev.map((item) => (item.id === id ? { ...item, url, active } : item))
    );
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: ProfileData = {
      ...profile,
      socialLinks: socials,
    };
    onSave(updated);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <form onSubmit={handleSave} className="space-y-6">
      {savedSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-sm flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2">
            <Check className="w-5 h-5" />
            <span className="font-semibold">Profil dan preferensi berhasil disimpan!</span>
          </div>
          <span className="text-xs">Sinkronisasi realtime aktif</span>
        </div>
      )}

      {/* Profil Dasar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs">
        <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-4">
          <User className="w-5 h-5 text-indigo-500" />
          <span>Informasi Dasar Profil</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Nama Lengkap */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Nama Lengkap
            </label>
            <input
              type="text"
              required
              value={profile.name}
              onChange={(e) => handleProfileChange('name', e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500/50"
            />
          </div>

          {/* Handle / Username */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Username (@handle)
            </label>
            <div className="relative">
              <AtSign className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={profile.handle}
                onChange={(e) => handleProfileChange('handle', e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500/50"
              />
            </div>
          </div>

          {/* Title / Profesi */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Profesi / Tagline
            </label>
            <div className="relative">
              <Briefcase className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={profile.title}
                onChange={(e) => handleProfileChange('title', e.target.value)}
                placeholder="Software Engineer, Content Creator, dll."
                className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500/50"
              />
            </div>
          </div>

          {/* Lokasi */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Lokasi Domisili
            </label>
            <div className="relative">
              <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={profile.location}
                onChange={(e) => handleProfileChange('location', e.target.value)}
                placeholder="Jakarta, Indonesia"
                className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500/50"
              />
            </div>
          </div>

          {/* Status teks */}
          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Pill Status (Tersedia / Info Singkat)
            </label>
            <div className="relative">
              <Sparkles className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={profile.statusText}
                onChange={(e) => handleProfileChange('statusText', e.target.value)}
                placeholder="🟢 Tersedia untuk proyek freelance"
                className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500/50"
              />
            </div>
          </div>

          {/* Bio */}
          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Bio / Ringkasan Diri
            </label>
            <textarea
              rows={3}
              value={profile.bio}
              onChange={(e) => handleProfileChange('bio', e.target.value)}
              placeholder="Ceritakan secara singkat tentang diri Anda, fokus karya, atau sambutan bagi pengunjung..."
              className="w-full px-3.5 py-2.5 text-sm rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500/50"
            />
          </div>

          {/* Verified Toggle */}
          <div className="sm:col-span-2">
            <label className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 cursor-pointer">
              <input
                type="checkbox"
                checked={profile.verified}
                onChange={(e) => handleProfileChange('verified', e.target.checked)}
                className="w-4 h-4 text-indigo-600 rounded-sm focus:ring-indigo-500"
              />
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-indigo-500" />
                <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                  Tampilkan Lencana Terverifikasi (Centang Biru)
                </span>
              </div>
            </label>
          </div>
        </div>
      </div>

      {/* Foto Profil & Avatar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs">
        <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-4">
          <Image className="w-5 h-5 text-indigo-500" />
          <span>Foto Profil (Avatar)</span>
        </h3>

        <div className="flex flex-col sm:flex-row items-center gap-6">
          <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-slate-200 dark:border-slate-700 shadow-md shrink-0">
            <img
              src={profile.avatarUrl}
              alt={profile.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  'https://ui-avatars.com/api/?name=' + encodeURIComponent(profile.name) + '&background=6366f1&color=fff';
              }}
            />
          </div>

          <div className="flex-1 w-full space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                URL Gambar Foto Profil
              </label>
              <input
                type="text"
                value={profile.avatarUrl}
                onChange={(e) => handleProfileChange('avatarUrl', e.target.value)}
                placeholder="https://..."
                className="w-full px-3.5 py-2 text-sm rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-mono"
              />
            </div>

            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-1.5 font-medium">
                Atau pilih avatar siap pakai:
              </p>
              <div className="flex flex-wrap gap-2">
                {AVATAR_PRESETS.map((preset) => (
                  <button
                    type="button"
                    key={preset.name}
                    onClick={() => handleProfileChange('avatarUrl', preset.url)}
                    className="text-xs px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 transition-colors"
                  >
                    {preset.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tema & Gaya Tampilan */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs">
        <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-4">
          <Palette className="w-5 h-5 text-indigo-500" />
          <span>Tema & Gaya Tampilan</span>
        </h3>

        <div className="space-y-4">
          {/* Accent Colors */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
              Warna Aksen Utama
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {THEME_OPTIONS.map((item) => {
                const isSelected = profile.themeColor === item.id;
                return (
                  <button
                    type="button"
                    key={item.id}
                    onClick={() => handleProfileChange('themeColor', item.id)}
                    className={`flex items-center gap-2.5 p-2.5 rounded-xl border text-left transition-all ${
                      isSelected
                        ? 'border-indigo-600 dark:border-indigo-400 bg-indigo-50/60 dark:bg-indigo-950/40 ring-2 ring-indigo-500/20'
                        : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100'
                    }`}
                  >
                    <span
                      className="w-5 h-5 rounded-full shrink-0 shadow-xs"
                      style={{ backgroundColor: item.hex }}
                    />
                    <span className="text-xs font-medium text-slate-800 dark:text-slate-200">
                      {item.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Background pattern */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
              Pola Latar Belakang
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {[
                { id: 'gradient', label: 'Gradien Lembut' },
                { id: 'dots', label: 'Pola Titik (Dots)' },
                { id: 'grid', label: 'Kisi-kisi (Grid)' },
                { id: 'minimal', label: 'Polos Minimal' },
              ].map((style) => (
                <button
                  type="button"
                  key={style.id}
                  onClick={() => handleProfileChange('backgroundStyle', style.id as BackgroundStyleOption)}
                  className={`p-2.5 rounded-xl border text-center text-xs font-semibold transition-all ${
                    profile.backgroundStyle === style.id
                      ? 'border-indigo-600 dark:border-indigo-400 bg-indigo-50/60 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 ring-2 ring-indigo-500/20'
                      : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100'
                  }`}
                >
                  {style.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Integrasi Media Sosial */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Layers className="w-5 h-5 text-indigo-500" />
            <span>Integrasi Akun Media Sosial</span>
          </h3>
          <span className="text-xs text-slate-500">Ikon cepat di bagian atas mikrosite</span>
        </div>

        <div className="space-y-3">
          {SOCIAL_PLATFORMS.map((platform) => {
            const existing = socials.find((s) => s.platform === platform.id);
            const isActive = existing ? existing.active : false;
            const urlValue = existing ? existing.url : '';
            const Icon = platform.icon;

            return (
              <div
                key={platform.id}
                className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700/80"
              >
                {/* Platform Icon */}
                <div className="w-9 h-9 rounded-xl bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 flex items-center justify-center shrink-0 shadow-2xs">
                  <Icon className="w-4 h-4" />
                </div>

                <div className="w-24 sm:w-28 shrink-0">
                  <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                    {platform.name}
                  </p>
                </div>

                {/* URL input */}
                <input
                  type="text"
                  placeholder={platform.placeholder}
                  value={urlValue}
                  onChange={(e) => {
                    const newUrl = e.target.value;
                    const exists = socials.some((s) => s.platform === platform.id);
                    if (exists) {
                      handleSocialChange(existing!.id, newUrl, newUrl.trim() !== '' ? isActive : false);
                    } else {
                      setSocials((prev) => [
                        ...prev,
                        {
                          id: String(Date.now() + Math.random()),
                          platform: platform.id as any,
                          label: platform.name,
                          url: newUrl,
                          active: newUrl.trim() !== '',
                        },
                      ]);
                    }
                  }}
                  className="flex-1 px-3 py-1.5 text-xs rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500/50"
                />

                {/* Active Toggle Switch */}
                <label className="flex items-center gap-1.5 cursor-pointer shrink-0">
                  <input
                    type="checkbox"
                    checked={isActive}
                    disabled={!urlValue.trim()}
                    onChange={(e) => {
                      if (existing) {
                        handleSocialChange(existing.id, urlValue, e.target.checked);
                      }
                    }}
                    className="w-4 h-4 text-indigo-600 rounded-sm focus:ring-indigo-500 disabled:opacity-30"
                  />
                  <span className="text-[11px] text-slate-600 dark:text-slate-400 hidden sm:inline">
                    Aktif
                  </span>
                </label>
              </div>
            );
          })}
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end sticky bottom-4 z-20">
        <button
          type="submit"
          className="px-6 py-3 rounded-2xl font-semibold text-sm bg-indigo-600 hover:bg-indigo-700 text-white shadow-xl hover:shadow-2xl transition-all flex items-center gap-2 cursor-pointer"
        >
          <Save className="w-4 h-4" />
          <span>Simpan Perubahan Profil</span>
        </button>
      </div>
    </form>
  );
};
