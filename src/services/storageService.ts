import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  increment,
  writeBatch,
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { MicrositeLink, ProfileData, AdminCredentials } from '../types';

const LINKS_COLL = 'links';
const SETTINGS_COLL = 'settings';
const PROFILE_DOC = 'profile';
const ADMIN_DOC = 'admin';
const AUTH_SESSION_KEY = 'mikrosite_auth_session_v1';

// Initial default profile seed
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
  passwordHash: 'admin123',
  lastLogin: null,
};

// In-memory cache for ultra-responsive UI
let cachedLinks: MicrositeLink[] = [...DEFAULT_LINKS];
let cachedProfile: ProfileData = { ...DEFAULT_PROFILE };
let cachedAdmin: AdminCredentials = { ...DEFAULT_ADMIN };
let hasInitialized = false;

export const storageService = {
  // Initialize Firestore listeners and bootstrap if database is empty
  async initFirestore(onUpdate?: () => void) {
    if (hasInitialized) return;
    hasInitialized = true;

    try {
      // 1. Check and initialize Admin document
      const adminDocRef = doc(db, SETTINGS_COLL, ADMIN_DOC);
      const adminSnap = await getDoc(adminDocRef).catch((e) => {
        handleFirestoreError(e, OperationType.GET, `${SETTINGS_COLL}/${ADMIN_DOC}`);
        return null;
      });

      if (!adminSnap || !adminSnap.exists()) {
        await setDoc(adminDocRef, DEFAULT_ADMIN).catch((e) => {
          handleFirestoreError(e, OperationType.WRITE, `${SETTINGS_COLL}/${ADMIN_DOC}`);
        });
        cachedAdmin = { ...DEFAULT_ADMIN };
      } else {
        cachedAdmin = adminSnap.data() as AdminCredentials;
      }

      // 2. Check and initialize Profile document
      const profileDocRef = doc(db, SETTINGS_COLL, PROFILE_DOC);
      const profileSnap = await getDoc(profileDocRef).catch((e) => {
        handleFirestoreError(e, OperationType.GET, `${SETTINGS_COLL}/${PROFILE_DOC}`);
        return null;
      });

      if (!profileSnap || !profileSnap.exists()) {
        await setDoc(profileDocRef, DEFAULT_PROFILE).catch((e) => {
          handleFirestoreError(e, OperationType.WRITE, `${SETTINGS_COLL}/${PROFILE_DOC}`);
        });
        cachedProfile = { ...DEFAULT_PROFILE };
      } else {
        cachedProfile = { ...DEFAULT_PROFILE, ...(profileSnap.data() as ProfileData) };
      }

      // 3. Check and initialize Links collection
      const linksColRef = collection(db, LINKS_COLL);
      const linksSnap = await getDocs(linksColRef).catch((e) => {
        handleFirestoreError(e, OperationType.LIST, LINKS_COLL);
        return null;
      });

      if (!linksSnap || linksSnap.empty) {
        const batch = writeBatch(db);
        DEFAULT_LINKS.forEach((link) => {
          const ref = doc(db, LINKS_COLL, link.id);
          batch.set(ref, link);
        });
        await batch.commit().catch((e) => {
          handleFirestoreError(e, OperationType.WRITE, LINKS_COLL);
        });
        cachedLinks = [...DEFAULT_LINKS];
      } else {
        const loaded: MicrositeLink[] = [];
        linksSnap.forEach((d) => {
          loaded.push({ id: d.id, ...d.data() } as MicrositeLink);
        });
        loaded.sort((a, b) => a.order - b.order);
        cachedLinks = loaded;
      }

      if (onUpdate) onUpdate();
    } catch (err) {
      console.warn('Firestore initialization notice:', err);
    }
  },

  // Realtime subscription using Firestore onSnapshot
  subscribe(callback: (type: string, data?: unknown) => void) {
    const unsubscribes: (() => void)[] = [];

    // Listen to Links collection in realtime
    try {
      const unsubLinks = onSnapshot(
        collection(db, LINKS_COLL),
        (snapshot) => {
          const linksList: MicrositeLink[] = [];
          snapshot.forEach((docSnap) => {
            linksList.push({ id: docSnap.id, ...docSnap.data() } as MicrositeLink);
          });
          linksList.sort((a, b) => a.order - b.order);
          cachedLinks = linksList;
          callback('links_updated', linksList);
        },
        (error) => {
          handleFirestoreError(error, OperationType.GET, LINKS_COLL);
        }
      );
      unsubscribes.push(unsubLinks);
    } catch (e) {
      console.warn('Failed to listen to links:', e);
    }

    // Listen to Profile document in realtime
    try {
      const unsubProfile = onSnapshot(
        doc(db, SETTINGS_COLL, PROFILE_DOC),
        (snapshot) => {
          if (snapshot.exists()) {
            cachedProfile = { ...DEFAULT_PROFILE, ...(snapshot.data() as ProfileData) };
            callback('profile_updated', cachedProfile);
          }
        },
        (error) => {
          handleFirestoreError(error, OperationType.GET, `${SETTINGS_COLL}/${PROFILE_DOC}`);
        }
      );
      unsubscribes.push(unsubProfile);
    } catch (e) {
      console.warn('Failed to listen to profile:', e);
    }

    // Listen to Admin document in realtime
    try {
      const unsubAdmin = onSnapshot(
        doc(db, SETTINGS_COLL, ADMIN_DOC),
        (snapshot) => {
          if (snapshot.exists()) {
            cachedAdmin = snapshot.data() as AdminCredentials;
            callback('admin_updated', cachedAdmin);
          }
        },
        (error) => {
          handleFirestoreError(error, OperationType.GET, `${SETTINGS_COLL}/${ADMIN_DOC}`);
        }
      );
      unsubscribes.push(unsubAdmin);
    } catch (e) {
      console.warn('Failed to listen to admin credentials:', e);
    }

    return () => {
      unsubscribes.forEach((unsub) => unsub());
    };
  },

  // Get cached or current links
  getLinks(): MicrositeLink[] {
    return cachedLinks.sort((a, b) => a.order - b.order);
  },

  async addLink(
    linkData: Omit<MicrositeLink, 'id' | 'clicks' | 'order' | 'createdAt' | 'updatedAt'>
  ): Promise<MicrositeLink> {
    const newId = `link-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    const newLink: MicrositeLink = {
      ...linkData,
      id: newId,
      clicks: 0,
      order: cachedLinks.length,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Optimistic local update
    cachedLinks = [...cachedLinks, newLink];

    try {
      await setDoc(doc(db, LINKS_COLL, newId), newLink);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, `${LINKS_COLL}/${newId}`);
    }

    return newLink;
  },

  async updateLink(
    id: string,
    updates: Partial<Omit<MicrositeLink, 'id' | 'createdAt'>>
  ): Promise<MicrositeLink | null> {
    const index = cachedLinks.findIndex((l) => l.id === id);
    if (index === -1) return null;

    const updated = {
      ...cachedLinks[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    cachedLinks[index] = updated;

    try {
      await updateDoc(doc(db, LINKS_COLL, id), {
        ...updates,
        updatedAt: new Date().toISOString(),
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `${LINKS_COLL}/${id}`);
    }

    return updated;
  },

  async deleteLink(id: string): Promise<boolean> {
    cachedLinks = cachedLinks.filter((l) => l.id !== id);

    try {
      await deleteDoc(doc(db, LINKS_COLL, id));
      return true;
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `${LINKS_COLL}/${id}`);
      return false;
    }
  },

  async reorderLinks(orderedIds: string[]) {
    const batch = writeBatch(db);
    const newCached: MicrositeLink[] = [];

    orderedIds.forEach((id, index) => {
      const found = cachedLinks.find((l) => l.id === id);
      if (found) {
        const updated = { ...found, order: index };
        newCached.push(updated);
        const ref = doc(db, LINKS_COLL, id);
        batch.update(ref, { order: index });
      }
    });

    cachedLinks = newCached;

    try {
      await batch.commit();
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, LINKS_COLL);
    }
  },

  async incrementClick(id: string) {
    const found = cachedLinks.find((l) => l.id === id);
    if (found) {
      found.clicks = (found.clicks || 0) + 1;
    }

    try {
      const ref = doc(db, LINKS_COLL, id);
      await updateDoc(ref, { clicks: increment(1) });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `${LINKS_COLL}/${id}`);
    }
  },

  // Profile management
  getProfile(): ProfileData {
    return cachedProfile;
  },

  async saveProfile(profile: ProfileData) {
    cachedProfile = profile;
    try {
      await setDoc(doc(db, SETTINGS_COLL, PROFILE_DOC), profile);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `${SETTINGS_COLL}/${PROFILE_DOC}`);
    }
  },

  // Admin authentication
  getAdminCredentials(): AdminCredentials {
    return cachedAdmin;
  },

  async updateAdminCredentials(username: string, passwordHash: string) {
    const updated: AdminCredentials = {
      username: username.trim(),
      passwordHash,
      lastLogin: cachedAdmin.lastLogin,
    };
    cachedAdmin = updated;

    try {
      await setDoc(doc(db, SETTINGS_COLL, ADMIN_DOC), updated);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `${SETTINGS_COLL}/${ADMIN_DOC}`);
    }
  },

  async loginAdmin(username: string, password: string): Promise<boolean> {
    try {
      // Fetch latest admin credentials from Firestore
      const adminSnap = await getDoc(doc(db, SETTINGS_COLL, ADMIN_DOC));
      const creds: AdminCredentials = adminSnap.exists()
        ? (adminSnap.data() as AdminCredentials)
        : cachedAdmin;

      if (creds.username.trim() === username.trim() && creds.passwordHash === password) {
        const session = {
          authenticated: true,
          username: creds.username,
          loginTime: new Date().toISOString(),
        };
        sessionStorage.setItem(AUTH_SESSION_KEY, JSON.stringify(session));

        // Update last login in Firestore
        const updated = { ...creds, lastLogin: new Date().toISOString() };
        cachedAdmin = updated;
        await setDoc(doc(db, SETTINGS_COLL, ADMIN_DOC), updated).catch(() => {});
        return true;
      }
      return false;
    } catch (err) {
      console.warn('Login verification notice:', err);
      // Fallback check against cached credentials
      if (cachedAdmin.username.trim() === username.trim() && cachedAdmin.passwordHash === password) {
        const session = {
          authenticated: true,
          username: cachedAdmin.username,
          loginTime: new Date().toISOString(),
        };
        sessionStorage.setItem(AUTH_SESSION_KEY, JSON.stringify(session));
        return true;
      }
      return false;
    }
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
  async resetAll() {
    const batch = writeBatch(db);

    // Delete existing links
    cachedLinks.forEach((l) => {
      batch.delete(doc(db, LINKS_COLL, l.id));
    });

    // Write default links
    DEFAULT_LINKS.forEach((l) => {
      batch.set(doc(db, LINKS_COLL, l.id), l);
    });

    // Write default profile and admin
    batch.set(doc(db, SETTINGS_COLL, PROFILE_DOC), DEFAULT_PROFILE);
    batch.set(doc(db, SETTINGS_COLL, ADMIN_DOC), DEFAULT_ADMIN);

    cachedLinks = [...DEFAULT_LINKS];
    cachedProfile = { ...DEFAULT_PROFILE };
    cachedAdmin = { ...DEFAULT_ADMIN };

    try {
      await batch.commit();
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'resetAll');
    }
  },

  // Export & Import
  exportData(): string {
    const payload = {
      version: '2.0',
      exportedAt: new Date().toISOString(),
      profile: this.getProfile(),
      links: this.getLinks(),
    };
    return JSON.stringify(payload, null, 2);
  },

  async importData(jsonString: string): Promise<{ success: boolean; message: string }> {
    try {
      const data = JSON.parse(jsonString);
      if (!data.profile || !Array.isArray(data.links)) {
        return {
          success: false,
          message: 'Format file JSON tidak valid. Pastikan berisi data profile dan links.',
        };
      }

      await this.saveProfile(data.profile);

      // Re-populate links
      const batch = writeBatch(db);
      // Remove old
      cachedLinks.forEach((l) => {
        batch.delete(doc(db, LINKS_COLL, l.id));
      });
      // Add new
      data.links.forEach((l: MicrositeLink) => {
        batch.set(doc(db, LINKS_COLL, l.id), l);
      });
      await batch.commit();

      cachedLinks = data.links;
      return { success: true, message: 'Data mikrosite berhasil diimpor ke Firebase Firestore!' };
    } catch (err) {
      return {
        success: false,
        message: 'Gagal memproses file JSON: ' + (err instanceof Error ? err.message : 'Error'),
      };
    }
  },
};
