import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Shield, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { toast } from '@/components/ui/use-toast';

const CompanySettings = () => {
  const [settings, setSettings] = useLocalStorage('sositech_settings', {
    company: {
      name: 'Sositech',
      address: '',
      phone: '',
      email: '',
      website: ''
    },
    app: {
      name: 'Sositech Go'
    }
  });

  const handleSettingsChange = (section, field, value) => {
    const newSettings = {
      ...settings,
      [section]: {
        ...settings[section],
        [field]: value
      }
    };
    setSettings(newSettings);
    
    // Force immediate update in localStorage
    localStorage.setItem('sositech_settings', JSON.stringify(newSettings));
    
    // Trigger a storage event to update other components
    window.dispatchEvent(new StorageEvent('storage', {
      key: 'sositech_settings',
      newValue: JSON.stringify(newSettings)
    }));
  };

  const handleSaveSettings = () => {
    // Force save to localStorage
    localStorage.setItem('sositech_settings', JSON.stringify(settings));
    
    toast({
      title: "Paramètres sauvegardés",
      description: "Les informations ont été mises à jour avec succès. Rechargez la page pour voir les changements.",
    });
    
    // Auto-reload after 2 seconds to show changes
    setTimeout(() => {
      window.location.reload();
    }, 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="space-y-6"
    >
      <Card className="glass-effect border-slate-700/50">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="w-5 h-5 text-blue-400" />
            <span>Configuration de l'Application</span>
          </CardTitle>
          <CardDescription>Personnalisez le nom et l'apparence de votre application</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="appName" className="text-slate-300">Nom de l'application</Label>
            <Input
              id="appName"
              value={settings.app?.name || 'Sositech Go'}
              onChange={(e) => handleSettingsChange('app', 'name', e.target.value)}
              className="bg-slate-800/50 border-slate-600"
              placeholder="Ex: Mon App de Gestion"
            />
            <p className="text-xs text-slate-400">Ce nom apparaîtra dans la barre latérale et le titre de l'application</p>
          </div>
          <div className="flex justify-end">
            <Button
              onClick={handleSaveSettings}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              <Save className="w-4 h-4 mr-2" />
              Sauvegarder
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="glass-effect border-slate-700/50">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="w-5 h-5 text-green-400" />
            <span>Informations Entreprise</span>
          </CardTitle>
          <CardDescription>Configurez les informations de votre entreprise</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="companyName" className="text-slate-300">Nom de l'entreprise</Label>
              <Input
                id="companyName"
                value={settings.company?.name || ''}
                onChange={(e) => handleSettingsChange('company', 'name', e.target.value)}
                className="bg-slate-800/50 border-slate-600"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="companyEmail" className="text-slate-300">Email entreprise</Label>
              <Input
                id="companyEmail"
                type="email"
                value={settings.company?.email || ''}
                onChange={(e) => handleSettingsChange('company', 'email', e.target.value)}
                className="bg-slate-800/50 border-slate-600"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="companyPhone" className="text-slate-300">Téléphone</Label>
              <Input
                id="companyPhone"
                value={settings.company?.phone || ''}
                onChange={(e) => handleSettingsChange('company', 'phone', e.target.value)}
                className="bg-slate-800/50 border-slate-600"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="companyWebsite" className="text-slate-300">Site web</Label>
              <Input
                id="companyWebsite"
                value={settings.company?.website || ''}
                onChange={(e) => handleSettingsChange('company', 'website', e.target.value)}
                className="bg-slate-800/50 border-slate-600"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="companyAddress" className="text-slate-300">Adresse</Label>
            <Input
              id="companyAddress"
              value={settings.company?.address || ''}
              onChange={(e) => handleSettingsChange('company', 'address', e.target.value)}
              className="bg-slate-800/50 border-slate-600"
            />
          </div>
          <div className="flex justify-end">
            <Button
              onClick={handleSaveSettings}
              className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
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

export default CompanySettings;