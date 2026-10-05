import { MicrositeLink, ProfileData, AdminCredentials } from '../types';

const LINKS_KEY = 'mikrosite_links_v1';
const PROFILE_KEY = 'mikrosite_profile_v1';
const ADMIN_KEY = 'mikrosite_admin_v1';
const AUTH_SESSION_KEY = 'mikrosite_auth_session_v1';

// Initial realistic seed data for the user
const DEFAULT_PROFILE: ProfileData = {
  name: 'Saradan Arya',
  handle: '@saradan',
  title: 'Full-Stack Developer & Content Creator',
  bio: 'Membangun aplikasi web modern, sistem terdistribusi, dan membagikan wawasan teknologi. Selamat datang di portal tautan pribadi saya!',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
  verified: true,
  location: 'Jakarta, Indonesia',
  statusText: '🟢 Tersedia untuk proyek kolaborasi',
  themeColor: 'indigo',
  backgroundStyle: 'gradient',
  socialLinks: [
    { id: '1', platform: 'github', label: 'GitHub', url: 'https://github.com', active: true },
    { id: '2', platform: 'linkedin', label: 'LinkedIn', url: 'https://linkedin.com', active: true },
    { id: '3', platform: 'instagram', label: 'Instagram', url: 'https://instagram.com', active: true },
    { id: '4', platform: 'twitter', label: 'X (Twitter)', url: 'https://x.com', active: true },
    { id: '5', platform: 'youtube', label: 'YouTube', url: 'https://youtube.com', active: true },
    { id: '6', platform: 'whatsapp', label: 'WhatsApp', url: 'https://wa.me/628123456789', active: true },
    { id: '7', platform: 'email', label: 'Email', url: 'mailto:saradan16320@gmail.com', active: true },
  ],
};

const DEFAULT_LINKS: MicrositeLink[] = [
  {
    id: 'link-1',
    title: 'Situs Web & Portofolio Utama',
    url: 'https://saradan.dev',
    description: 'Jelajahi studi kasus proyek, teknologi yang saya gunakan, dan testimoni klien.',
    category: 'Portofolio & Web',
    icon: 'globe',
    clicks: 142,
    isActive: true,
    isFeatured: true,
    order: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'link-2',
    title: 'Blog Teknologi & Tutorial',
    url: 'https://blog.saradan.dev',
    description: 'Kumpulan artikel seputar React, TypeScript, Tailwind CSS, dan tips karir developer.',
    category: 'Portofolio & Web',
    icon: 'book-open',
    clicks: 98,
    isActive: true,
    isFeatured: false,
    order: 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'link-3',
    title: 'Repositori Proyek Open Source (GitHub)',
    url: 'https://github.com',
    description: 'Kode sumber dari proyek-proyek open-source saya dan kontribusi komunitas.',
    category: 'Koding & Proyek',
    icon: 'github',
    clicks: 85,
    isActive: true,
    isFeatured: false,
    order: 2,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'link-4',
    title: 'Kanal YouTube - Koding & DevTalk',
    url: 'https://youtube.com',
    description: 'Video tutorial pemrograman praktis dalam bahasa Indonesia setiap minggunya.',
    category: 'Media & Konten',
    icon: 'youtube',
    clicks: 64,
    isActive: true,
    isFeatured: true,
    order: 3,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'link-5',
    title: 'Jadwalkan Diskusi / Konsultasi 1-on-1',
    url: 'https://cal.com',
    description: 'Pesan sesi mentoring atau konsultasi arsitektur perangkat lunak bersama saya.',
    category: 'Kontak & Kolaborasi',
    icon: 'calendar',
    clicks: 41,
    isActive: true,
    isFeatured: false,
    order: 4,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'link-6',
    title: 'Hubungi Saya via WhatsApp Bisnis',
    url: 'https://wa.me/628123456789',
    description: 'Respons cepat untuk penawaran kerjasama bisnis dan freelance.',
    category: 'Kontak & Kolaborasi',
    icon: 'message-circle',
    clicks: 77,
    isActive: true,
    isFeatured: false,
    order: 5,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const DEFAULT_ADMIN: AdminCredentials = {
  username: 'admin',
  passwordHash: 'admin123', // Simple hashed/plain default, configurable by admin
  lastLogin: null,
};

// BroadcastChannel for cross-tab realtime sync
let broadcastChannel: BroadcastChannel | null = null;
try {
  if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
    broadcastChannel = new BroadcastChannel('mikrosite_sync_channel');
  }
} catch (e) {
  console.warn('BroadcastChannel not supported', e);
}

const notifySync = (type: string, data?: unknown) => {
  if (broadcastChannel) {
    try {
      broadcastChannel.postMessage({ type, data, timestamp: Date.now() });
    } catch (e) {
      console.warn('Broadcast failed', e);
    }
  }
};

export const storageService = {
  // Subscribe to changes in realtime
  subscribe(callback: (type: string, data?: unknown) => void) {
    const handleBroadcast = (event: MessageEvent) => {
      callback(event.data.type, event.data.data);
    };

    const handleStorage = (event: StorageEvent) => {
      if (event.key === LINKS_KEY || event.key === PROFILE_KEY) {
        callback('storage_change', { key: event.key });
      }
    };

    if (broadcastChannel) {
      broadcastChannel.addEventListener('message', handleBroadcast);
    }
    window.addEventListener('storage', handleStorage);

    return () => {
      if (broadcastChannel) {
        broadcastChannel.removeEventListener('message', handleBroadcast);
      }
      window.removeEventListener('storage', handleStorage);
    };
  },

  // Links
  getLinks(): MicrositeLink[] {
    try {
      const raw = localStorage.getItem(LINKS_KEY);
      if (!raw) {
        this.saveLinks(DEFAULT_LINKS);
        return DEFAULT_LINKS;
      }
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed.sort((a, b) => a.order - b.order) : DEFAULT_LINKS;
    } catch {
      return DEFAULT_LINKS;
    }
  },

  saveLinks(links: MicrositeLink[]) {
    localStorage.setItem(LINKS_KEY, JSON.stringify(links));
    notifySync('links_updated', links);
  },

  addLink(linkData: Omit<MicrositeLink, 'id' | 'clicks' | 'order' | 'createdAt' | 'updatedAt'>): MicrositeLink {
    const links = this.getLinks();
    const newLink: MicrositeLink = {
      ...linkData,
      id: `link-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      clicks: 0,
      order: links.length,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const updated = [...links, newLink];
    this.saveLinks(updated);
    return newLink;
  },

  updateLink(id: string, updates: Partial<Omit<MicrositeLink, 'id' | 'createdAt'>>): MicrositeLink | null {
    const links = this.getLinks();
    const index = links.findIndex((l) => l.id === id);
    if (index === -1) return null;

    links[index] = {
      ...links[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    this.saveLinks(links);
    return links[index];
  },

  deleteLink(id: string): boolean {
    const links = this.getLinks();
    const filtered = links.filter((l) => l.id !== id);
    if (filtered.length === links.length) return false;

    // reindex order
    const reindexed = filtered.map((item, idx) => ({ ...item, order: idx }));
    this.saveLinks(reindexed);
    return true;
  },

  reorderLinks(orderedIds: string[]) {
    const links = this.getLinks();
    const map = new Map(links.map((l) => [l.id, l]));
    const reordered: MicrositeLink[] = [];

    orderedIds.forEach((id, index) => {
      const item = map.get(id);
      if (item) {
        reordered.push({ ...item, order: index });
        map.delete(id);
      }
    });

    // any leftovers
    map.forEach((item) => {
      reordered.push({ ...item, order: reordered.length });
    });

    this.saveLinks(reordered);
  },

  incrementClick(id: string) {
    const links = this.getLinks();
    const index = links.findIndex((l) => l.id === id);
    if (index !== -1) {
      links[index].clicks = (links[index].clicks || 0) + 1;
      this.saveLinks(links);
    }
  },

  // Profile
  getProfile(): ProfileData {
    try {
      const raw = localStorage.getItem(PROFILE_KEY);
      if (!raw) {
        this.saveProfile(DEFAULT_PROFILE);
        return DEFAULT_PROFILE;
      }
      return { ...DEFAULT_PROFILE, ...JSON.parse(raw) };
    } catch {
      return DEFAULT_PROFILE;
    }
  },

  saveProfile(profile: ProfileData) {
    localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
    notifySync('profile_updated', profile);
  },

  // Admin Credentials & Auth Session
  getAdminCredentials(): AdminCredentials {
    try {
      const raw = localStorage.getItem(ADMIN_KEY);
      if (!raw) {
        localStorage.setItem(ADMIN_KEY, JSON.stringify(DEFAULT_ADMIN));
        return DEFAULT_ADMIN;
      }
      return { ...DEFAULT_ADMIN, ...JSON.parse(raw) };
    } catch {
      return DEFAULT_ADMIN;
    }
  },

  updateAdminCredentials(username: string, passwordHash: string) {
    const current = this.getAdminCredentials();
    const updated: AdminCredentials = {
      ...current,
      username,
      passwordHash,
    };
    localStorage.setItem(ADMIN_KEY, JSON.stringify(updated));
  },

  loginAdmin(username: string, password: string): boolean {
    const creds = this.getAdminCredentials();
    if (creds.username.trim() === username.trim() && creds.passwordHash === password) {
      const session = {
        authenticated: true,
        username: creds.username,
        token: Math.random().toString(36).substring(2),
        loginTime: new Date().toISOString(),
      };
      sessionStorage.setItem(AUTH_SESSION_KEY, JSON.stringify(session));

      // Update last login
      const updatedCreds = { ...creds, lastLogin: new Date().toISOString() };
      localStorage.setItem(ADMIN_KEY, JSON.stringify(updatedCreds));
      return true;
    }
    return false;
  },

  isLoggedIn(): boolean {
    try {
      const raw = sessionStorage.getItem(AUTH_SESSION_KEY);
      if (!raw) return false;
      const parsed = JSON.parse(raw);
      return Boolean(parsed?.authenticated);
    } catch {
      return false;
    }
  },

  logoutAdmin() {
    sessionStorage.removeItem(AUTH_SESSION_KEY);
  },

  // Reset to default
  resetAll() {
    this.saveLinks(DEFAULT_LINKS);
    this.saveProfile(DEFAULT_PROFILE);
    localStorage.setItem(ADMIN_KEY, JSON.stringify(DEFAULT_ADMIN));
    notifySync('all_reset');
  },

  // Export & Import
  exportData(): string {
    const payload = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      profile: this.getProfile(),
      links: this.getLinks(),
    };
    return JSON.stringify(payload, null, 2);
  },

  importData(jsonString: string): { success: boolean; message: string } {
    try {
      const data = JSON.parse(jsonString);
      if (!data.profile || !Array.isArray(data.links)) {
        return { success: false, message: 'Format file JSON tidak valid. Pastikan berisi data profile dan links.' };
      }
      this.saveProfile(data.profile);
      this.saveLinks(data.links);
      return { success: true, message: 'Data mikrosite berhasil diimpor sepenuhnya!' };
    } catch (err) {
      return { success: false, message: 'Gagal memproses file JSON: ' + (err instanceof Error ? err.message : 'Error') };
    }
  },
};
