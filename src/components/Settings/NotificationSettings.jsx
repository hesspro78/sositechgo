import React from 'react';
import { motion } from 'framer-motion';
import { Bell, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { toast } from '@/components/ui/use-toast';

const NotificationSettings = () => {
  const [settings, setSettings] = useLocalStorage('sositech_settings', {
    notifications: {
      email: true,
      push: true,
      deadlines: true,
      newProjects: true
    }
  });

  const handleSettingsChange = (field, value) => {
    setSettings(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [field]: value
      }
    }));
  };

  const handleSaveSettings = () => {
    toast({
      title: "Paramètres sauvegardés",
      description: "Vos préférences de notifications ont été mises à jour.",
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
    >
      <Card className="glass-effect border-slate-700/50">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Bell className="w-5 h-5 text-yellow-400" />
            <span>Préférences de Notifications</span>
          </CardTitle>
          <CardDescription>Configurez vos notifications</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            {[
              { key: 'email', label: 'Notifications par email', description: 'Recevoir les notifications importantes par email' },
              { key: 'push', label: 'Notifications push', description: 'Recevoir les notifications dans le navigateur' },
              { key: 'deadlines', label: 'Rappels d\'échéances', description: 'Être notifié des dates limites approchantes' },
              { key: 'newProjects', label: 'Nouveaux projets', description: 'Être notifié lors de la création de nouveaux projets' }
            ].map((notification) => (
              <div key={notification.key} className="flex items-center justify-between p-4 bg-slate-800/30 rounded-lg">
                <div>
                  <h4 className="font-medium text-white">{notification.label}</h4>
                  <p className="text-sm text-slate-400">{notification.description}</p>
                </div>
                <Button
                  variant={settings.notifications[notification.key] ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleSettingsChange(notification.key, !settings.notifications[notification.key])}
                  className={settings.notifications[notification.key] ? 
                    "bg-green-600 hover:bg-green-700" : 
                    "border-slate-600 text-slate-300"
                  }
                >
                  {settings.notifications[notification.key] ? 'Activé' : 'Désactivé'}
                </Button>
              </div>
            ))}
          </div>
          <div className="flex justify-end">
            <Button
              onClick={handleSaveSettings}
              className="bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700"
            >
              <Save className="w-4 h-4 mr-2" />
              Sauvegarder
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default NotificationSettings;