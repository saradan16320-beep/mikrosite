import React, { useState, useEffect } from 'react';
import { X, Check, Sparkles, Globe, Tag, AlignLeft, ShieldAlert } from 'lucide-react';
import { MicrositeLink } from '../../types';
import { AVAILABLE_ICONS, renderIcon } from '../../utils/iconMap';

interface LinkModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Omit<MicrositeLink, 'id' | 'clicks' | 'order' | 'createdAt' | 'updatedAt'>) => void;
  editingLink: MicrositeLink | null;
}

const CATEGORY_SUGGESTIONS = [
  'Portofolio & Web',
  'Koding & Proyek',
  'Media & Konten',
  'Kontak & Kolaborasi',
  'Artikel & Tulisan',
  'Sosial & Komunitas',
  'Toko & Bisnis',
  'Lainnya',
];

export const LinkModal: React.FC<LinkModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editingLink,
}) => {
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Portofolio & Web');
  const [icon, setIcon] = useState('globe');
  const [isActive, setIsActive] = useState(true);
  const [isFeatured, setIsFeatured] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (editingLink) {
      setTitle(editingLink.title);
      setUrl(editingLink.url);
      setDescription(editingLink.description || '');
      setCategory(editingLink.category || 'Portofolio & Web');
      setIcon(editingLink.icon || 'globe');
      setIsActive(editingLink.isActive);
      setIsFeatured(editingLink.isFeatured);
    } else {
      // Defaults for new link
      setTitle('');
      setUrl('https://');
      setDescription('');
      setCategory('Portofolio & Web');
      setIcon('globe');
      setIsActive(true);
      setIsFeatured(false);
    }
    setError(null);
  }, [editingLink, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Judul tautan wajib diisi');
      return;
    }
    if (!url.trim() || url.trim() === 'https://') {
      setError('URL tujuan tautan wajib diisi');
      return;
    }

    let finalUrl = url.trim();
    if (!finalUrl.startsWith('http://') && !finalUrl.startsWith('https://') && !finalUrl.startsWith('mailto:') && !finalUrl.startsWith('tel:')) {
      finalUrl = 'https://' + finalUrl;
    }

    onSave({
      title: title.trim(),
      url: finalUrl,
      description: description.trim(),
      category: category.trim() || 'Umum',
      icon,
      isActive,
      isFeatured,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in overflow-y-auto">
      <div className="relative w-full max-w-lg my-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-7">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800 mb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              {renderIcon(icon, 'w-5 h-5')}
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                {editingLink ? 'Edit Tautan' : 'Tambah Tautan Baru'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {editingLink ? 'Perbarui informasi tautan web' : 'Tambahkan situs web atau tautan baru ke mikrosite'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900/60 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Judul Tautan *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Contoh: Situs Web Portofolio, Repositori GitHub, dll."
              className="w-full px-3.5 py-2.5 text-sm rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500/50"
            />
          </div>

          {/* URL */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              URL Tujuan (Website) *
            </label>
            <div className="relative">
              <Globe className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                required
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://situsanda.com"
                className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-mono focus:outline-hidden focus:ring-2 focus:ring-indigo-500/50"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Deskripsi Singkat (Opsional)
            </label>
            <div className="relative">
              <AlignLeft className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
              <textarea
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Keterangan singkat tentang apa yang ada di situs ini..."
                className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500/50 resize-none"
              />
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Kategori / Grup
            </label>
            <div className="relative mb-2">
              <Tag className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="Pilih atau ketik kategori baru"
                className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500/50"
              />
            </div>
            {/* Category Quick Chips */}
            <div className="flex flex-wrap gap-1.5">
              {CATEGORY_SUGGESTIONS.map((cat) => (
                <button
                  type="button"
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`text-[11px] px-2.5 py-1 rounded-lg border transition-colors ${
                    category === cat
                      ? 'bg-indigo-50 dark:bg-indigo-950/60 border-indigo-400 text-indigo-600 dark:text-indigo-400 font-semibold'
                      : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Icon Selector Grid */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Ikon Tautan
            </label>
            <div className="grid grid-cols-6 sm:grid-cols-8 gap-2 max-h-36 overflow-y-auto p-2 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
              {AVAILABLE_ICONS.map((item) => {
                const isSelected = icon === item.id;
                const IconCmp = item.icon;
                return (
                  <button
                    type="button"
                    key={item.id}
                    title={item.label}
                    onClick={() => setIcon(item.id)}
                    className={`p-2 rounded-xl flex items-center justify-center transition-all ${
                      isSelected
                        ? 'bg-indigo-600 text-white shadow-xs scale-105 ring-2 ring-indigo-400'
                        : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-600'
                    }`}
                  >
                    <IconCmp className="w-4 h-4" />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Toggles: Active & Featured */}
          <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Status Aktif */}
            <label className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 cursor-pointer">
              <div>
                <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                  Status Aktif
                </p>
                <p className="text-[10px] text-slate-500">Tampilkan di halaman publik</p>
              </div>
              <input
                type="checkbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="w-4 h-4 text-indigo-600 rounded-sm focus:ring-indigo-500"
              />
            </label>

            {/* Unggulan */}
            <label className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 cursor-pointer">
              <div>
                <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>Tautan Unggulan</span>
                </p>
                <p className="text-[10px] text-slate-500">Beri bingkai khusus & badge</p>
              </div>
              <input
                type="checkbox"
                checked={isFeatured}
                onChange={(e) => setIsFeatured(e.target.checked)}
                className="w-4 h-4 text-indigo-600 rounded-sm focus:ring-indigo-500"
              />
            </label>
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-end gap-3 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white shadow-md hover:shadow-lg transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>{editingLink ? 'Simpan Perubahan' : 'Tambahkan Tautan'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
