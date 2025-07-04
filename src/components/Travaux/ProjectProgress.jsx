import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Clock, 
  User, 
  Calendar, 
  CheckCircle, 
  AlertCircle, 
  Plus,
  Edit,
  Trash2,
  Bell
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from '@/components/ui/use-toast';

const ProjectProgress = ({ projectId, projectData, onUpdateProgress }) => {
  const [progressEntries, setProgressEntries] = useState(projectData?.progressEntries || []);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newEntry, setNewEntry] = useState({
    description: '',
    responsable: '',
    statut: 'En cours',
    notes: ''
  });

  const statusOptions = [
    { value: 'Démarré', color: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
    { value: 'En cours', color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' },
    { value: 'Visite sur site', color: 'bg-purple-500/20 text-purple-400 border-purple-500/30' },
    { value: 'Réservé', color: 'bg-orange-500/20 text-orange-400 border-orange-500/30' },
    { value: 'Terminé', color: 'bg-green-500/20 text-green-400 border-green-500/30' }
  ];

  const getStatusColor = (status) => {
    const statusOption = statusOptions.find(s => s.value === status);
    return statusOption?.color || 'bg-gray-500/20 text-gray-400 border-gray-500/30';
  };

  const handleAddEntry = () => {
    if (!newEntry.description || !newEntry.responsable) {
      toast({
        title: "Champs requis",
        description: "Veuillez remplir la description et le responsable",
        variant: "destructive"
      });
      return;
    }

    const entry = {
      id: Date.now(),
      ...newEntry,
      timestamp: new Date().toISOString(),
      createdBy: 'Utilisateur actuel' // À remplacer par l'utilisateur connecté
    };

    const updatedEntries = [...progressEntries, entry];
    setProgressEntries(updatedEntries);
    onUpdateProgress?.(updatedEntries);
    
    setNewEntry({ description: '', responsable: '', statut: 'En cours', notes: '' });
    setShowAddDialog(false);
    
    toast({
      title: "Avancement ajouté",
      description: "L'entrée d'avancement a été ajoutée avec succès"
    });
  };

  const handleDeleteEntry = (id) => {
    const updatedEntries = progressEntries.filter(entry => entry.id !== id);
    setProgressEntries(updatedEntries);
    onUpdateProgress?.(updatedEntries);
    
    toast({
      title: "Entrée supprimée",
      description: "L'entrée d'avancement a été supprimée"
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold text-white">Suivi d'Avancement</h3>
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              Ajouter un Avancement
            </Button>
          </DialogTrigger>
          <DialogContent className="glass-effect border-slate-700/50">
            <DialogHeader>
              <DialogTitle className="text-white">Nouvel Avancement</DialogTitle>
              <DialogDescription className="text-slate-400">
                Ajoutez une nouvelle entrée d'avancement pour ce projet
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="description" className="text-slate-300">Description *</Label>
                <Textarea
                  id="description"
                  value={newEntry.description}
                  onChange={(e) => setNewEntry(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Décrivez l'avancement..."
                  className="bg-slate-800/50 border-slate-600"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="responsable" className="text-slate-300">Responsable *</Label>
                  <Input
                    id="responsable"
                    value={newEntry.responsable}
                    onChange={(e) => setNewEntry(prev => ({ ...prev, responsable: e.target.value }))}
                    placeholder="Nom du responsable"
                    className="bg-slate-800/50 border-slate-600"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="statut" className="text-slate-300">Statut</Label>
                  <Select value={newEntry.statut} onValueChange={(value) => setNewEntry(prev => ({ ...prev, statut: value }))}>
                    <SelectTrigger className="bg-slate-800/50 border-slate-600">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {statusOptions.map(status => (
                        <SelectItem key={status.value} value={status.value}>{status.value}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes" className="text-slate-300">Notes additionnelles</Label>
                <Textarea
                  id="notes"
                  value={newEntry.notes}
                  onChange={(e) => setNewEntry(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="Notes optionnelles..."
                  className="bg-slate-800/50 border-slate-600"
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setShowAddDialog(false)} className="border-slate-600">
                  Annuler
                </Button>
                <Button onClick={handleAddEntry} className="bg-blue-600 hover:bg-blue-700">
                  Ajouter
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-4">
        {progressEntries.length === 0 ? (
          <Card className="glass-effect border-slate-700/50">
            <CardContent className="p-8 text-center">
              <Clock className="w-12 h-12 mx-auto mb-4 text-slate-400" />
              <h3 className="text-lg font-medium text-slate-300 mb-2">Aucun avancement enregistré</h3>
              <p className="text-slate-400 mb-4">Commencez à suivre l'avancement de ce projet</p>
              <Button onClick={() => setShowAddDialog(true)} className="bg-blue-600 hover:bg-blue-700">
                <Plus className="w-4 h-4 mr-2" />
                Premier Avancement
              </Button>
            </CardContent>
          </Card>
        ) : (
          progressEntries
            .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
            .map((entry, index) => (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="glass-effect border-slate-700/50 hover:border-slate-600/50 transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 space-y-3">
                        <div className="flex items-center space-x-3">
                          <Badge className={getStatusColor(entry.statut)}>
                            {entry.statut}
                          </Badge>
                          <div className="flex items-center text-sm text-slate-400">
                            <Clock className="w-4 h-4 mr-1" />
                            {new Date(entry.timestamp).toLocaleString()}
                          </div>
                        </div>
                        
                        <div>
                          <p className="text-white font-medium mb-2">{entry.description}</p>
                          {entry.notes && (
                            <p className="text-slate-400 text-sm">{entry.notes}</p>
                          )}
                        </div>
                        
                        <div className="flex items-center text-sm text-slate-300">
                          <User className="w-4 h-4 mr-2 text-slate-400" />
                          <span>Responsable: {entry.responsable}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2 ml-4">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => toast({
                            title: "🚧 Fonctionnalité non implémentée",
                            description: "Modification d'avancement à venir"
                          })}
                          className="text-slate-400 hover:text-yellow-400"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDeleteEntry(entry.id)}
                          className="text-slate-400 hover:text-red-400"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))
        )}
      </div>
    </div>
  );
};

export default ProjectProgress;