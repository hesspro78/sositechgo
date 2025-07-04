import React from 'react';
import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ProfileSettings from './ProfileSettings';
import CompanySettings from './CompanySettings';
import NotificationSettings from './NotificationSettings';
import AppearanceSettings from './AppearanceSettings';
import DataSettings from './DataSettings';

const SettingsManager = () => {
  return (
    <div className="p-6 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-2"
      >
        <h1 className="text-3xl font-bold gradient-text">Paramètres</h1>
        <p className="text-slate-400">Configurez votre application</p>
      </motion.div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="bg-slate-800/50 border border-slate-700/50">
          <TabsTrigger value="profile" className="data-[state=active]:bg-slate-700">Profil</TabsTrigger>
          <TabsTrigger value="company" className="data-[state=active]:bg-slate-700">Entreprise</TabsTrigger>
          <TabsTrigger value="notifications" className="data-[state=active]:bg-slate-700">Notifications</TabsTrigger>
          <TabsTrigger value="appearance" className="data-[state=active]:bg-slate-700">Apparence</TabsTrigger>
          <TabsTrigger value="data" className="data-[state=active]:bg-slate-700">Données</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          <ProfileSettings />
        </TabsContent>

        <TabsContent value="company" className="space-y-6">
          <CompanySettings />
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <NotificationSettings />
        </TabsContent>

        <TabsContent value="appearance" className="space-y-6">
          <AppearanceSettings />
        </TabsContent>

        <TabsContent value="data" className="space-y-6">
          <DataSettings />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SettingsManager;