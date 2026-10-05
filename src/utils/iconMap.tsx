import React from 'react';
import {
  Globe,
  Github,
  Linkedin,
  Twitter,
  Instagram,
  Youtube,
  Mail,
  Phone,
  MessageCircle,
  Send,
  Terminal,
  BookOpen,
  Rocket,
  Sparkles,
  Briefcase,
  Code,
  Heart,
  Link as LinkIcon,
  Calendar,
  ExternalLink,
  Music,
  Video,
  Layers,
  Compass,
  Coffee,
  ShoppingBag,
  FileText,
  Bookmark,
  Gamepad2,
  Tv,
  Camera,
  Podcast,
  Laptop,
  Flame,
  Star,
  Check,
} from 'lucide-react';

export const AVAILABLE_ICONS = [
  { id: 'globe', label: 'Website / Web', icon: Globe },
  { id: 'book-open', label: 'Blog / Tulisan', icon: BookOpen },
  { id: 'github', label: 'GitHub / Kode', icon: Github },
  { id: 'code', label: 'Source Code', icon: Code },
  { id: 'terminal', label: 'Terminal / CLI', icon: Terminal },
  { id: 'youtube', label: 'YouTube / Video', icon: Youtube },
  { id: 'linkedin', label: 'LinkedIn / Profil', icon: Linkedin },
  { id: 'twitter', label: 'Twitter / X', icon: Twitter },
  { id: 'instagram', label: 'Instagram', icon: Instagram },
  { id: 'message-circle', label: 'Chat / WhatsApp', icon: MessageCircle },
  { id: 'calendar', label: 'Jadwal / Cal', icon: Calendar },
  { id: 'mail', label: 'Email', icon: Mail },
  { id: 'briefcase', label: 'Karir / Portofolio', icon: Briefcase },
  { id: 'rocket', label: 'Proyek / Startup', icon: Rocket },
  { id: 'sparkles', label: 'Produk Baru', icon: Sparkles },
  { id: 'flame', label: 'Trending / Hot', icon: Flame },
  { id: 'star', label: 'Favorit', icon: Star },
  { id: 'coffee', label: 'Dukungan / BuyMeCoffee', icon: Coffee },
  { id: 'shopping-bag', label: 'Toko / Merchandise', icon: ShoppingBag },
  { id: 'podcast', label: 'Podcast / Audio', icon: Podcast },
  { id: 'music', label: 'Spotify / Musik', icon: Music },
  { id: 'camera', label: 'Fotografi', icon: Camera },
  { id: 'file-text', label: 'Resume / Dokumen', icon: FileText },
  { id: 'link', label: 'Tautan Umum', icon: LinkIcon },
];

export const getIconComponent = (iconName: string) => {
  const found = AVAILABLE_ICONS.find((item) => item.id.toLowerCase() === iconName.toLowerCase());
  return found ? found.icon : LinkIcon;
};

export const renderIcon = (iconName: string, className = 'w-5 h-5') => {
  const IconComponent = getIconComponent(iconName);
  return <IconComponent className={className} />;
};

// Social platform icons and styling
export const SOCIAL_PLATFORMS = [
  { id: 'github', name: 'GitHub', icon: Github, placeholder: 'https://github.com/username' },
  { id: 'linkedin', name: 'LinkedIn', icon: Linkedin, placeholder: 'https://linkedin.com/in/username' },
  { id: 'instagram', name: 'Instagram', icon: Instagram, placeholder: 'https://instagram.com/username' },
  { id: 'twitter', name: 'Twitter / X', icon: Twitter, placeholder: 'https://x.com/username' },
  { id: 'youtube', name: 'YouTube', icon: Youtube, placeholder: 'https://youtube.com/@channel' },
  { id: 'whatsapp', name: 'WhatsApp', icon: MessageCircle, placeholder: 'https://wa.me/628123456789' },
  { id: 'email', name: 'Email', icon: Mail, placeholder: 'mailto:nama@domain.com' },
  { id: 'telegram', name: 'Telegram', icon: Send, placeholder: 'https://t.me/username' },
  { id: 'discord', name: 'Discord', icon: MessageCircle, placeholder: 'https://discord.gg/invite' },
  { id: 'tiktok', name: 'TikTok', icon: Video, placeholder: 'https://tiktok.com/@username' },
  { id: 'website', name: 'Situs Pribadi', icon: Globe, placeholder: 'https://domainpribadi.com' },
];

export const getThemeClasses = (color: string) => {
  switch (color) {
    case 'emerald':
      return {
        accentBg: 'bg-emerald-600 dark:bg-emerald-500',
        accentText: 'text-emerald-600 dark:text-emerald-400',
        accentBorder: 'border-emerald-500/40 dark:border-emerald-400/40',
        accentRing: 'focus:ring-emerald-500',
        gradient: 'from-emerald-500 to-teal-600',
        cardHighlight: 'border-emerald-500/50 bg-emerald-500/5',
        badge: 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800',
      };
    case 'violet':
      return {
        accentBg: 'bg-violet-600 dark:bg-violet-500',
        accentText: 'text-violet-600 dark:text-violet-400',
        accentBorder: 'border-violet-500/40 dark:border-violet-400/40',
        accentRing: 'focus:ring-violet-500',
        gradient: 'from-violet-500 to-purple-600',
        cardHighlight: 'border-violet-500/50 bg-violet-500/5',
        badge: 'bg-violet-100 dark:bg-violet-950/60 text-violet-800 dark:text-violet-300 border-violet-300 dark:border-violet-800',
      };
    case 'rose':
      return {
        accentBg: 'bg-rose-600 dark:bg-rose-500',
        accentText: 'text-rose-600 dark:text-rose-400',
        accentBorder: 'border-rose-500/40 dark:border-rose-400/40',
        accentRing: 'focus:ring-rose-500',
        gradient: 'from-rose-500 to-pink-600',
        cardHighlight: 'border-rose-500/50 bg-rose-500/5',
        badge: 'bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 border-rose-300 dark:border-rose-800',
      };
    case 'amber':
      return {
        accentBg: 'bg-amber-600 dark:bg-amber-500',
        accentText: 'text-amber-600 dark:text-amber-400',
        accentBorder: 'border-amber-500/40 dark:border-amber-400/40',
        accentRing: 'focus:ring-amber-500',
        gradient: 'from-amber-500 to-orange-600',
        cardHighlight: 'border-amber-500/50 bg-amber-500/5',
        badge: 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-800',
      };
    case 'cyan':
      return {
        accentBg: 'bg-cyan-600 dark:bg-cyan-500',
        accentText: 'text-cyan-600 dark:text-cyan-400',
        accentBorder: 'border-cyan-500/40 dark:border-cyan-400/40',
        accentRing: 'focus:ring-cyan-500',
        gradient: 'from-cyan-500 to-blue-600',
        cardHighlight: 'border-cyan-500/50 bg-cyan-500/5',
        badge: 'bg-cyan-100 dark:bg-cyan-950/60 text-cyan-800 dark:text-cyan-300 border-cyan-300 dark:border-cyan-800',
      };
    case 'slate':
      return {
        accentBg: 'bg-slate-800 dark:bg-slate-200 text-white dark:text-slate-900',
        accentText: 'text-slate-900 dark:text-slate-100',
        accentBorder: 'border-slate-400/40 dark:border-slate-500/40',
        accentRing: 'focus:ring-slate-500',
        gradient: 'from-slate-700 to-zinc-900',
        cardHighlight: 'border-slate-400/50 bg-slate-500/5',
        badge: 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border-slate-300 dark:border-slate-700',
      };
    case 'indigo':
    default:
      return {
        accentBg: 'bg-indigo-600 dark:bg-indigo-500',
        accentText: 'text-indigo-600 dark:text-indigo-400',
        accentBorder: 'border-indigo-500/40 dark:border-indigo-400/40',
        accentRing: 'focus:ring-indigo-500',
        gradient: 'from-indigo-500 to-purple-600',
        cardHighlight: 'border-indigo-500/50 bg-indigo-500/5',
        badge: 'bg-indigo-100 dark:bg-indigo-950/60 text-indigo-800 dark:text-indigo-300 border-indigo-300 dark:border-indigo-800',
      };
  }
};
