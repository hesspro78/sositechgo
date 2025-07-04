import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Plus, Trash2, Upload, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/components/ui/use-toast';

const TravauxForm = ({ travaux, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    nature: '',
    categorie: '',
    description: '',
    materiaux: [],
    responsable: '',
    dateDebut: '',
    dateFin: '',
    demandeur: '',
    client: '',
    societe: '',
    fichiers: [],
    avancement: 0
  });

  const [newMateriau, setNewMateriau] = useState({ nom: '', quantite: '', unite: '' });

  useEffect(() => {
    if (travaux) {
      setFormData(travaux);
    }
  }, [travaux]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleAddMateriau = () => {
    if (newMateriau.nom && newMateriau.quantite) {
      setFormData(prev => ({
        ...prev,
        materiaux: [...prev.materiaux, { ...newMateriau, id: Date.now() }]
      }));
      setNewMateriau({ nom: '', quantite: '', unite: '' });
    }
  };

  const handleRemoveMateriau = (id) => {
    setFormData(prev => ({
      ...prev,
      materiaux: prev.materiaux.filter(m => m.id !== id)
    }));
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    const validFiles = files.filter(file => {
      const isValidSize = file.size <= 100 * 1024 * 1024; // 100MB
      const isValidType = file.type.includes('image/') || file.type === 'application/pdf';
      
      if (!isValidSize) {
        toast({
          title: "Fichier trop volumineux",
          description: `${file.name} dépasse la limite de 100MB`,
          variant: "destructive"
        });
      }
      if (!isValidType) {
        toast({
          title: "Type de fichier non supporté",
          description: `${file.name} doit être une image ou un PDF`,
          variant: "destructive"
        });
      }
      
      return isValidSize && isValidType;
    });

    if (validFiles.length > 0) {
      const fileObjects = validFiles.map(file => ({
        id: Date.now() + Math.random(),
        name: file.name,
        size: file.size,
        type: file.type,
        url: URL.createObjectURL(file)
      }));
      
      setFormData(prev => ({
        ...prev,
        fichiers: [...prev.fichiers, ...fileObjects]
      }));
      
      toast({
        title: "Fichiers ajoutés",
        description: `${validFiles.length} fichier(s) ajouté(s) avec succès`
      });
    }
  };

  const handleRemoveFile = (id) => {
    setFormData(prev => ({
      ...prev,
      fichiers: prev.fichiers.filter(f => f.id !== id)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.nature || !formData.description || !formData.responsable || !formData.client) {
      toast({
        title: "Champs requis manquants",
        description: "Veuillez remplir tous les champs obligatoires",
        variant: "destructive"
      });
      return;
    }

    onSubmit(formData);
  };

  const categories = [
    'Rénovation',
    'Construction',
    'Électricité',
    'Plomberie',
    'Peinture',
    'Menuiserie',
    'Maçonnerie',
    'Autre'
  ];

  const unites = ['pièce', 'mètre', 'litre', 'kg', 'boîte', 'rouleau', 'sac'];

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            onClick={onCancel}
            className="text-slate-400 hover:text-white"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour
          </Button>
          <div>
            <h1 className="text-3xl font-bold gradient-text">
              {travaux ? 'Modifier le Projet' : 'Nouveau Projet'}
            </h1>
            <p className="text-slate-400">Remplissez les informations du projet</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Informations Générales */}
            <Card className="glass-effect border-slate-700/50">
              <CardHeader>
                <CardTitle className="text-white">Informations Générales</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="nature" className="text-slate-300">Nature des travaux *</Label>
                  <Input
                    id="nature"
                    value={formData.nature}
                    onChange={(e) => handleInputChange('nature', e.target.value)}
                    placeholder="Ex: Rénovation bureau"
                    className="bg-slate-800/50 border-slate-600"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="categorie" className="text-slate-300">Catégorie</Label>
                  <Select value={formData.categorie} onValueChange={(value) => handleInputChange('categorie', value)}>
                    <SelectTrigger className="bg-slate-800/50 border-slate-600">
                      <SelectValue placeholder="Sélectionner une catégorie" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(cat => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description" className="text-slate-300">Description détaillée *</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Décrivez les travaux à effectuer..."
                    className="bg-slate-800/50 border-slate-600 min-h-[100px]"
                    required
                  />
                </div>
              </CardContent>
            </Card>

            {/* Responsabilités */}
            <Card className="glass-effect border-slate-700/50">
              <CardHeader>
                <CardTitle className="text-white">Responsabilités</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="responsable" className="text-slate-300">Responsable du projet *</Label>
                  <Input
                    id="responsable"
                    value={formData.responsable}
                    onChange={(e) => handleInputChange('responsable', e.target.value)}
                    placeholder="Nom du responsable"
                    className="bg-slate-800/50 border-slate-600"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="demandeur" className="text-slate-300">Demandeur</Label>
                  <Input
                    id="demandeur"
                    value={formData.demandeur}
                    onChange={(e) => handleInputChange('demandeur', e.target.value)}
                    placeholder="Nom du demandeur"
                    className="bg-slate-800/50 border-slate-600"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="client" className="text-slate-300">Client *</Label>
                  <Input
                    id="client"
                    value={formData.client}
                    onChange={(e) => handleInputChange('client', e.target.value)}
                    placeholder="Nom du client"
                    className="bg-slate-800/50 border-slate-600"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="societe" className="text-slate-300">Société</Label>
                  <Input
                    id="societe"
                    value={formData.societe}
                    onChange={(e) => handleInputChange('societe', e.target.value)}
                    placeholder="Nom de la société"
                    className="bg-slate-800/50 border-slate-600"
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Dates */}
          <Card className="glass-effect border-slate-700/50">
            <CardHeader>
              <CardTitle className="text-white">Planification</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="dateDebut" className="text-slate-300">Date de début</Label>
                <Input
                  id="dateDebut"
                  type="date"
                  value={formData.dateDebut}
                  onChange={(e) => handleInputChange('dateDebut', e.target.value)}
                  className="bg-slate-800/50 border-slate-600"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dateFin" className="text-slate-300">Date de fin prévue</Label>
                <Input
                  id="dateFin"
                  type="date"
                  value={formData.dateFin}
                  onChange={(e) => handleInputChange('dateFin', e.target.value)}
                  className="bg-slate-800/50 border-slate-600"
                />
              </div>
            </CardContent>
          </Card>

          {/* Matériaux */}
          <Card className="glass-effect border-slate-700/50">
            <CardHeader>
              <CardTitle className="text-white">Liste des Matériaux</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Input
                  placeholder="Nom du matériau"
                  value={newMateriau.nom}
                  onChange={(e) => setNewMateriau(prev => ({ ...prev, nom: e.target.value }))}
                  className="bg-slate-800/50 border-slate-600"
                />
                <Input
                  placeholder="Quantité"
                  type="number"
                  value={newMateriau.quantite}
                  onChange={(e) => setNewMateriau(prev => ({ ...prev, quantite: e.target.value }))}
                  className="bg-slate-800/50 border-slate-600"
                />
                <Select value={newMateriau.unite} onValueChange={(value) => setNewMateriau(prev => ({ ...prev, unite: value }))}>
                  <SelectTrigger className="bg-slate-800/50 border-slate-600">
                    <SelectValue placeholder="Unité" />
                  </SelectTrigger>
                  <SelectContent>
                    {unites.map(unite => (
                      <SelectItem key={unite} value={unite}>{unite}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button
                  type="button"
                  onClick={handleAddMateriau}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>

              {formData.materiaux.length > 0 && (
                <div className="space-y-2">
                  {formData.materiaux.map((materiau) => (
                    <div key={materiau.id} className="flex items-center justify-between p-3 bg-slate-800/30 rounded-lg border border-slate-700/30">
                      <div className="flex items-center space-x-4">
                        <span className="text-white font-medium">{materiau.nom}</span>
                        <span className="text-slate-400">{materiau.quantite} {materiau.unite}</span>
                      </div>
                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        onClick={() => handleRemoveMateriau(materiau.id)}
                        className="text-red-400 hover:text-red-300"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Fichiers */}
          <Card className="glass-effect border-slate-700/50">
            <CardHeader>
              <CardTitle className="text-white">Documents et Photos</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="file-upload-area rounded-lg p-8 text-center">
                <input
                  type="file"
                  multiple
                  accept="image/*,.pdf"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="file-upload"
                />
                <label htmlFor="file-upload" className="cursor-pointer">
                  <Upload className="w-12 h-12 mx-auto mb-4 text-slate-400" />
                  <p className="text-slate-300 mb-2">Cliquez pour télécharger des fichiers</p>
                  <p className="text-sm text-slate-400">Images et PDF acceptés (max 100MB par fichier)</p>
                </label>
              </div>

              {formData.fichiers.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {formData.fichiers.map((fichier) => (
                    <div key={fichier.id} className="relative p-4 bg-slate-800/30 rounded-lg border border-slate-700/30">
                      <div className="flex items-center justify-between">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-white truncate">{fichier.name}</p>
                          <p className="text-xs text-slate-400">{(fichier.size / 1024 / 1024).toFixed(2)} MB</p>
                        </div>
                        <Button
                          type="button"
                          size="sm"
                          variant="ghost"
                          onClick={() => handleRemoveFile(fichier.id)}
                          className="text-red-400 hover:text-red-300 ml-2"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex items-center justify-end space-x-4 pt-6">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              className="border-slate-600 text-slate-300"
            >
              Annuler
            </Button>
            <Button
              type="submit"
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              {travaux ? 'Modifier' : 'Créer'} le Projet
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default TravauxForm;