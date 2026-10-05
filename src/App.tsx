/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { storageService } from './services/storageService';
import { MicrositeLink, ProfileData } from './types';
import { PublicView } from './components/public/PublicView';
import { AdminLogin } from './components/admin/AdminLogin';
import { AdminDashboard } from './components/admin/AdminDashboard';

type AppView = 'public' | 'admin_login' | 'admin_dashboard';

export default function App() {
  const [currentView, setCurrentView] = useState<AppView>('public');
  const [links, setLinks] = useState<MicrositeLink[]>(() => storageService.getLinks());
  const [profile, setProfile] = useState<ProfileData>(() => storageService.getProfile());
  const [isLiveConnected, setIsLiveConnected] = useState<boolean>(false);

  // Function to reload data from storage
  const refreshData = useCallback(() => {
    setLinks(storageService.getLinks());
    setProfile(storageService.getProfile());
    setIsLiveConnected(true);
  }, []);

  // Listen to realtime changes across devices and Firestore
  useEffect(() => {
    // Bootstrap and connect Firestore
    storageService.initFirestore(() => {
      setIsLiveConnected(true);
      setLinks(storageService.getLinks());
      setProfile(storageService.getProfile());
    });

    // Realtime onSnapshot listener
    const unsubscribe = storageService.subscribe((type, data) => {
      setIsLiveConnected(true);
      if (type === 'links_updated' && Array.isArray(data)) {
        setLinks([...data]);
      } else if (type === 'profile_updated' && data) {
        setProfile({ ...(data as ProfileData) });
      } else {
        setLinks(storageService.getLinks());
        setProfile(storageService.getProfile());
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  // Click handler for links
  const handleLinkClick = async (id: string) => {
    await storageService.incrementClick(id);
    refreshData();
  };

  // Open admin handler
  const handleOpenAdmin = () => {
    if (storageService.isLoggedIn()) {
      setCurrentView('admin_dashboard');
    } else {
      setCurrentView('admin_login');
    }
  };

  const handleLoginSuccess = () => {
    setCurrentView('admin_dashboard');
  };

  const handleLogout = () => {
    storageService.logoutAdmin();
    setCurrentView('public');
  };

  return (
    <ThemeProvider>
      {currentView === 'public' && (
        <PublicView
          profile={profile}
          links={links}
          onLinkClick={handleLinkClick}
          onOpenAdmin={handleOpenAdmin}
          isLiveConnected={isLiveConnected}
        />
      )}

      {currentView === 'admin_login' && (
        <AdminLogin
          onSuccess={handleLoginSuccess}
          onBackToPublic={() => setCurrentView('public')}
        />
      )}

      {currentView === 'admin_dashboard' && (
        <AdminDashboard
          links={links}
          profile={profile}
          onRefreshData={refreshData}
          onViewPublic={() => setCurrentView('public')}
          onLogout={handleLogout}
        />
      )}
    </ThemeProvider>
  );
}
