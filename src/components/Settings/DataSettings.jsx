import React from 'react';
import { motion } from 'framer-motion';
import { Database, Download, Upload, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { toast } from '@/components/ui/use-toast';

const DataSettings = () => {
  const [settings, setSettings] = useLocalStorage('sositech_settings', {
    backup: {
      autoBackup: true,
      frequency: 'daily'
    }
  });

  const handleSettingsChange = (field, value) => {
    setSettings(prev => ({
      ...prev,
      backup: {
        ...prev.backup,
        [field]: value
      }
    }));
  };

  const handleExportData = () => {
    const travaux = JSON.parse(localStorage.getItem('sositech_travaux') || '[]');
    const achats = JSON.parse(localStorage.getItem('sositech_achats') || '[]');
    const clients = JSON.parse(localStorage.getItem('sositech_clients') || '[]');
    const documents = JSON.parse(localStorage.getItem('sositech_documents') || '[]');

    const exportData = {
      travaux,
      achats,
      clients,
      documents,
      settings,
      exportDate: new Date().toISOString()
    };

    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `sositech-backup-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    
    URL.revokeObjectURL(url);
    
    toast({
      title: "Export réussi",
      description: "Vos données ont été exportées avec succès.",
    });
  };

  const handleImportData = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const importedData = JSON.parse(event.target.result);
        
        if (importedData.travaux) localStorage.setItem('sositech_travaux', JSON.stringify(importedData.travaux));
        if (importedData.achats) localStorage.setItem('sositech_achats', JSON.stringify(importedData.achats));
        if (importedData.clients) localStorage.setItem('sositech_clients', JSON.stringify(importedData.clients));
        if (importedData.documents) localStorage.setItem('sositech_documents', JSON.stringify(importedData.documents));
        if (importedData.settings) setSettings(importedData.settings);

        toast({
          title: "Import réussi",
          description: "Vos données ont été importées avec succès.",
        });
      } catch (error) {
        toast({
          title: "Erreur d'import",
          description: "Le fichier sélectionné n'est pas valide.",
          variant: "destructive"
        });
      }
    };
    reader.readAsText(file);
  };

  const handleClearAllData = () => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer toutes les données ? Cette action est irréversible.')) {
      localStorage.removeItem('sositech_travaux');
      localStorage.removeItem('sositech_achats');
      localStorage.removeItem('sositech_clients');
      localStorage.removeItem('sositech_documents');
      
      toast({
        title: "Données supprimées",
        description: "Toutes les données ont été supprimées.",
      });
    }
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
            <Database className="w-5 h-5 text-blue-400" />
            <span>Gestion des Données</span>
          </CardTitle>
          <CardDescription>Sauvegardez, importez ou supprimez vos données</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-medium text-white">Sauvegarde</h4>
              <div className="space-y-3">
                <Button
                  onClick={handleExportData}
                  className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Exporter toutes les données
                </Button>
                <div className="text-sm text-slate-400">
                  Téléchargez une sauvegarde complète de vos données
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-medium text-white">Restauration</h4>
              <div className="space-y-3">
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImportData}
                  className="hidden"
                  id="import-data"
                />
                <label htmlFor="import-data">
                  <Button
                    as="span"
                    className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 cursor-pointer"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Importer des données
                  </Button>
                </label>
                <div className="text-sm text-slate-400">
                  Restaurez vos données depuis une sauvegarde
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-700/50 pt-6">
            <div className="space-y-4">
              <h4 className="font-medium text-red-400">Zone de Danger</h4>
              <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <h5 className="font-medium text-red-400">Supprimer toutes les données</h5>
                    <p className="text-sm text-slate-400">Cette action est irréversible</p>
                  </div>
                  <Button
                    onClick={handleClearAllData}
                    variant="destructive"
                    className="bg-red-600 hover:bg-red-700"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Supprimer tout
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="glass-effect border-slate-700/50">
        <CardHeader>
          <CardTitle>Sauvegarde Automatique</CardTitle>
          <CardDescription>Configurez la sauvegarde automatique</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-slate-800/30 rounded-lg">
            <div>
              <h4 className="font-medium text-white">Sauvegarde automatique</h4>
              <p className="text-sm text-slate-400">Sauvegarder automatiquement vos données</p>
            </div>
            <Button
              variant={settings.backup.autoBackup ? "default" : "outline"}
              size="sm"
              onClick={() => handleSettingsChange('autoBackup', !settings.backup.autoBackup)}
              className={settings.backup.autoBackup ? 
                "bg-green-600 hover:bg-green-700" : 
                "border-slate-600 text-slate-300"
              }
            >
              {settings.backup.autoBackup ? 'Activé' : 'Désactivé'}
            </Button>
          </div>
          
          {settings.backup.autoBackup && (
            <div className="space-y-2">
              <Label htmlFor="backupFrequency" className="text-slate-300">Fréquence</Label>
              <Select 
                value={settings.backup.frequency} 
                onValueChange={(value) => handleSettingsChange('frequency', value)}
              >
                <SelectTrigger className="bg-slate-800/50 border-slate-600">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Quotidienne</SelectItem>
                  <SelectItem value="weekly">Hebdomadaire</SelectItem>
                  <SelectItem value="monthly">Mensuelle</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default DataSettings;