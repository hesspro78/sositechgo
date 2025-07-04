import React, { useState } from 'react';
import { FolderPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const CreateFolderDialog = ({ showDialog, setShowDialog, onCreateFolder }) => {
  const [newFolderName, setNewFolderName] = useState('');
  const [newFolderColor, setNewFolderColor] = useState('blue');

  const handleCreateFolder = () => {
    const success = onCreateFolder(newFolderName, newFolderColor);
    if (success) {
      setNewFolderName('');
      setNewFolderColor('blue');
    }
  };

  return (
    <Dialog open={showDialog} onOpenChange={setShowDialog}>
      <DialogTrigger asChild>
        <Button variant="outline" className="border-slate-600">
          <FolderPlus className="w-4 h-4 mr-2" />
          Nouveau Dossier
        </Button>
      </DialogTrigger>
      <DialogContent className="glass-effect border-slate-700/50">
        <DialogHeader>
          <DialogTitle className="text-white">Créer un nouveau dossier</DialogTitle>
          <DialogDescription className="text-slate-400">
            Organisez vos documents en créant des dossiers personnalisés
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="folderName" className="text-slate-300">Nom du dossier</Label>
            <Input
              id="folderName"
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              placeholder="Ex: Projets 2024"
              className="bg-slate-800/50 border-slate-600"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="folderColor" className="text-slate-300">Couleur</Label>
            <Select value={newFolderColor} onValueChange={setNewFolderColor}>
              <SelectTrigger className="bg-slate-800/50 border-slate-600">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="blue">Bleu</SelectItem>
                <SelectItem value="green">Vert</SelectItem>
                <SelectItem value="orange">Orange</SelectItem>
                <SelectItem value="purple">Violet</SelectItem>
                <SelectItem value="yellow">Jaune</SelectItem>
                <SelectItem value="red">Rouge</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setShowDialog(false)} className="border-slate-600">
              Annuler
            </Button>
            <Button onClick={handleCreateFolder} className="bg-blue-600 hover:bg-blue-700">
              Créer
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateFolderDialog;