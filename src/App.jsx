import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthProvider, useAuth } from '@/contexts/SupabaseAuthContext';
import { Toaster } from '@/components/ui/toaster';
import LoginForm from '@/components/Auth/LoginForm';
import Sidebar from '@/components/Layout/Sidebar';
import Dashboard from '@/components/Dashboard/Dashboard';
import TravauxManager from '@/components/Travaux/TravauxManager';
import AchatsManager from '@/components/Achats/AchatsManager';
import ClientsManager from '@/components/Clients/ClientsManager';
import DocumentsManager from '@/components/Documents/DocumentsManager';
import PersonnelManager from '@/components/Personnel/PersonnelManager';
import SettingsManager from '@/components/Settings/SettingsManager';
import NotificationCenter from '@/components/Notifications/NotificationCenter';

const AppContent = () => {
  const { user, loading } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (!user) {
    return <LoginForm />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'travaux':
        return <TravauxManager />;
      case 'achats':
        return <AchatsManager />;
      case 'clients':
        return <ClientsManager />;
      case 'documents':
        return <DocumentsManager />;
      case 'personnel':
        return <PersonnelManager />;
      case 'settings':
        return <SettingsManager />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-slate-900 overflow-hidden">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="flex-1 overflow-auto">
        {/* Header with Notifications */}
        <div className="sticky top-0 z-10 bg-slate-900/95 backdrop-blur-sm border-b border-slate-700/50 p-4">
          <div className="flex justify-end">
            <NotificationCenter />
          </div>
        </div>
        
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="h-full"
          >
            {renderContent()}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <Helmet>
        <title>Sositech Go - Gestion de Projets</title>
        <meta name="description" content="Application de gestion de travaux, achats, personnel et documents pour optimiser vos projets" />
      </Helmet>
      <AppContent />
      <Toaster />
    </AuthProvider>
  );
}

export default App;