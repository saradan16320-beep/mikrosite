export interface MicrositeLink {
  id: string;
  title: string;
  url: string;
  description?: string;
  category: string;
  icon: string;
  clicks: number;
  isActive: boolean;
  isFeatured: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface SocialLinkItem {
  id: string;
  platform: 'github' | 'linkedin' | 'instagram' | 'twitter' | 'youtube' | 'tiktok' | 'facebook' | 'whatsapp' | 'telegram' | 'discord' | 'email' | 'website';
  label: string;
  url: string;
  active: boolean;
}

export type ThemeColorOption = 'indigo' | 'emerald' | 'violet' | 'rose' | 'amber' | 'cyan' | 'slate';
export type BackgroundStyleOption = 'gradient' | 'minimal' | 'dots' | 'grid';

export interface ProfileData {
  name: string;
  handle: string;
  title: string;
  bio: string;
  avatarUrl: string;
  verified: boolean;
  location: string;
  statusText: string;
  themeColor: ThemeColorOption;
  backgroundStyle: BackgroundStyleOption;
  socialLinks: SocialLinkItem[];
}

export interface AdminCredentials {
  username: string;
  passwordHash: string; // Stored securely
  lastLogin: string | null;
}
