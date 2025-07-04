import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Plus, Trash2, Upload, X, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/components/ui/use-toast';

const PersonnelForm = ({ personnel, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    nomComplet: '',
    poste: '',
    telephone: '',
    email: '',
    numeroCarteIdentite: '',
    numeroCNSS: '',
    certificatMedical: {
      numero: '',
      dateExpiration: '',
      organisme: ''
    },
    assuranceInfo: {
      compagnie: '',
      numeroPolice: '',
      dateExpiration: ''
    },
    dateDebut: '',
    dateFin: '',
    statut: 'Actif',
    equipements: [],
    documents: []
  });

  const [newEquipement, setNewEquipement] = useState({
    type: '',
    description: '',
    dateAffectation: '',
    dateRetour: '',
    etat: 'Bon'
  });

  useEffect(() => {
    if (personnel) {
      setFormData(personnel);
    }
  }, [personnel]);

  const handleInputChange = (field, value) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }
  };

  const handleAddEquipement = () => {
    if (!newEquipement.type || !newEquipement.description) {
      toast({
        title: "Champs requis",
        description: "Veuillez remplir le type et la description de l'équipement",
        variant: "destructive"
      });
      return;
    }

    setFormData(prev => ({
      ...prev,
      equipements: [...prev.equipements, { ...newEquipement, id: Date.now() }]
    }));
    setNewEquipement({ type: '', description: '', dateAffectation: '', dateRetour: '', etat: 'Bon' });
  };

  const handleRemoveEquipement = (id) => {
    setFormData(prev => ({
      ...prev,
      equipements: prev.equipements.filter(e => e.id !== id)
    }));
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    const validFiles = files.filter(file => {
      const isValidSize = file.size <= 100 * 1024 * 1024; // 100MB
      
      if (!isValidSize) {
        toast({
          title: "Fichier trop volumineux",
          description: `${file.name} dépasse la limite de 100MB`,
          variant: "destructive"
        });
      }
      
      return isValidSize;
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
        documents: [...prev.documents, ...fileObjects]
      }));
      
      toast({
        title: "Documents ajoutés",
        description: `${validFiles.length} document(s) ajouté(s) avec succès`
      });
    }
  };

  const handleRemoveDocument = (id) => {
    setFormData(prev => ({
      ...prev,
      documents: prev.documents.filter(d => d.id !== id)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.nomComplet || !formData.poste || !formData.email || !formData.telephone) {
      toast({
        title: "Champs requis manquants",
        description: "Veuillez remplir tous les champs obligatoires",
        variant: "destructive"
      });
      return;
    }

    // Validation email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast({
        title: "Email invalide",
        description: "Veuillez saisir une adresse email valide",
        variant: "destructive"
      });
      return;
    }

    onSubmit(formData);
  };

  const typesEquipement = [
    'Casque de sécurité',
    'Chaussures de sécurité',
    'Gants de protection',
    'Lunettes de sécurité',
    'Harnais de sécurité',
    'Gilet haute visibilité',
    'Masque respiratoire',
    'Combinaison de travail',
    'Autre'
  ];

  const statutOptions = ['Actif', 'Inactif', 'Congé', 'Formation'];

  return (
    <div className="p-6 max-w-6xl mx-auto">
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
              {personnel ? 'Modifier l\'Employé' : 'Nouvel Employé'}
            </h1>
            <p className="text-slate-400">Remplissez les informations de l'employé</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Informations Personnelles */}
            <Card className="glass-effect border-slate-700/50">
              <CardHeader>
                <CardTitle className="text-white">Informations Personnelles</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="nomComplet" className="text-slate-300">Nom complet *</Label>
                  <Input
                    id="nomComplet"
                    value={formData.nomComplet}
                    onChange={(e) => handleInputChange('nomComplet', e.target.value)}
                    placeholder="Nom et prénom"
                    className="bg-slate-800/50 border-slate-600"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="poste" className="text-slate-300">Poste/Fonction *</Label>
                  <Input
                    id="poste"
                    value={formData.poste}
                    onChange={(e) => handleInputChange('poste', e.target.value)}
                    placeholder="Ex: Électricien, Chef d'équipe"
                    className="bg-slate-800/50 border-slate-600"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="telephone" className="text-slate-300">Téléphone *</Label>
                    <Input
                      id="telephone"
                      value={formData.telephone}
                      onChange={(e) => handleInputChange('telephone', e.target.value)}
                      placeholder="01 23 45 67 89"
                      className="bg-slate-800/50 border-slate-600"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-slate-300">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      placeholder="email@exemple.com"
                      className="bg-slate-800/50 border-slate-600"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="numeroCarteIdentite" className="text-slate-300">N° Carte d'identité</Label>
                    <Input
                      id="numeroCarteIdentite"
                      value={formData.numeroCarteIdentite}
                      onChange={(e) => handleInputChange('numeroCarteIdentite', e.target.value)}
                      placeholder="123456789"
                      className="bg-slate-800/50 border-slate-600"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="numeroCNSS" className="text-slate-300">N° CNSS</Label>
                    <Input
                      id="numeroCNSS"
                      value={formData.numeroCNSS}
                      onChange={(e) => handleInputChange('numeroCNSS', e.target.value)}
                      placeholder="987654321"
                      className="bg-slate-800/50 border-slate-600"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Dates et Statut */}
            <Card className="glass-effect border-slate-700/50">
              <CardHeader>
                <CardTitle className="text-white">Dates et Statut</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="statut" className="text-slate-300">Statut</Label>
                  <Select value={formData.statut} onValueChange={(value) => handleInputChange('statut', value)}>
                    <SelectTrigger className="bg-slate-800/50 border-slate-600">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {statutOptions.map(statut => (
                        <SelectItem key={statut} value={statut}>{statut}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

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
                  <Label htmlFor="dateFin" className="text-slate-300">Date de fin (optionnelle)</Label>
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
          </div>

          {/* Certificat Médical */}
          <Card className="glass-effect border-slate-700/50">
            <CardHeader>
              <CardTitle className="text-white">Certificat d'Aptitude Médicale</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="certificatNumero" className="text-slate-300">Numéro de certificat</Label>
                <Input
                  id="certificatNumero"
                  value={formData.certificatMedical.numero}
                  onChange={(e) => handleInputChange('certificatMedical.numero', e.target.value)}
                  placeholder="CM123456"
                  className="bg-slate-800/50 border-slate-600"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="certificatExpiration" className="text-slate-300">Date d'expiration</Label>
                <Input
                  id="certificatExpiration"
                  type="date"
                  value={formData.certificatMedical.dateExpiration}
                  onChange={(e) => handleInputChange('certificatMedical.dateExpiration', e.target.value)}
                  className="bg-slate-800/50 border-slate-600"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="certificatOrganisme" className="text-slate-300">Organisme</Label>
                <Input
                  id="certificatOrganisme"
                  value={formData.certificatMedical.organisme}
                  onChange={(e) => handleInputChange('certificatMedical.organisme', e.target.value)}
                  placeholder="Médecine du travail"
                  className="bg-slate-800/50 border-slate-600"
                />
              </div>
            </CardContent>
          </Card>

          {/* Assurance */}
          <Card className="glass-effect border-slate-700/50">
            <CardHeader>
              <CardTitle className="text-white">Informations Assurance</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="assuranceCompagnie" className="text-slate-300">Compagnie d'assurance</Label>
                <Input
                  id="assuranceCompagnie"
                  value={formData.assuranceInfo.compagnie}
                  onChange={(e) => handleInputChange('assuranceInfo.compagnie', e.target.value)}
                  placeholder="Nom de la compagnie"
                  className="bg-slate-800/50 border-slate-600"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="assurancePolice" className="text-slate-300">Numéro de police</Label>
                <Input
                  id="assurancePolice"
                  value={formData.assuranceInfo.numeroPolice}
                  onChange={(e) => handleInputChange('assuranceInfo.numeroPolice', e.target.value)}
                  placeholder="POL123456"
                  className="bg-slate-800/50 border-slate-600"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="assuranceExpiration" className="text-slate-300">Date d'expiration</Label>
                <Input
                  id="assuranceExpiration"
                  type="date"
                  value={formData.assuranceInfo.dateExpiration}
                  onChange={(e) => handleInputChange('assuranceInfo.dateExpiration', e.target.value)}
                  className="bg-slate-800/50 border-slate-600"
                />
              </div>
            </CardContent>
          </Card>

          {/* Équipements */}
          <Card className="glass-effect border-slate-700/50">
            <CardHeader>
              <CardTitle className="text-white">Équipements de Sécurité</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <Select value={newEquipement.type} onValueChange={(value) => setNewEquipement(prev => ({ ...prev, type: value }))}>
                  <SelectTrigger className="bg-slate-800/50 border-slate-600">
                    <SelectValue placeholder="Type d'équipement" />
                  </SelectTrigger>
                  <SelectContent>
                    {typesEquipement.map(type => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Input
                  placeholder="Description"
                  value={newEquipement.description}
                  onChange={(e) => setNewEquipement(prev => ({ ...prev, description: e.target.value }))}
                  className="bg-slate-800/50 border-slate-600"
                />
                <Input
                  type="date"
                  placeholder="Date d'affectation"
                  value={newEquipement.dateAffectation}
                  onChange={(e) => setNewEquipement(prev => ({ ...prev, dateAffectation: e.target.value }))}
                  className="bg-slate-800/50 border-slate-600"
                />
                <Input
                  type="date"
                  placeholder="Date de retour"
                  value={newEquipement.dateRetour}
                  onChange={(e) => setNewEquipement(prev => ({ ...prev, dateRetour: e.target.value }))}
                  className="bg-slate-800/50 border-slate-600"
                />
                <Button
                  type="button"
                  onClick={handleAddEquipement}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>

              {formData.equipements.length > 0 && (
                <div className="space-y-2">
                  {formData.equipements.map((equipement) => (
                    <div key={equipement.id} className="flex items-center justify-between p-4 bg-slate-800/30 rounded-lg border border-slate-700/30">
                      <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div>
                          <p className="text-white font-medium">{equipement.type}</p>
                          <p className="text-xs text-slate-400">{equipement.description}</p>
                        </div>
                        <div>
                          <p className="text-sm text-slate-300">Affecté: {equipement.dateAffectation}</p>
                        </div>
                        <div>
                          <p className="text-sm text-slate-300">Retour: {equipement.dateRetour || 'En cours'}</p>
                        </div>
                        <div className="flex justify-end">
                          <Button
                            type="button"
                            size="sm"
                            variant="ghost"
                            onClick={() => handleRemoveEquipement(equipement.id)}
                            className="text-red-400 hover:text-red-300"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Documents */}
          <Card className="glass-effect border-slate-700/50">
            <CardHeader>
              <CardTitle className="text-white">Documents</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="file-upload-area rounded-lg p-8 text-center">
                <input
                  type="file"
                  multiple
                  onChange={handleFileUpload}
                  className="hidden"
                  id="document-upload"
                />
                <label htmlFor="document-upload" className="cursor-pointer">
                  <Upload className="w-12 h-12 mx-auto mb-4 text-slate-400" />
                  <p className="text-slate-300 mb-2">Cliquez pour télécharger des documents</p>
                  <p className="text-sm text-slate-400">Tous types de fichiers acceptés (max 100MB par fichier)</p>
                </label>
              </div>

              {formData.documents.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {formData.documents.map((document) => (
                    <div key={document.id} className="relative p-4 bg-slate-800/30 rounded-lg border border-slate-700/30">
                      <div className="flex items-center justify-between">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-white truncate">{document.name}</p>
                          <p className="text-xs text-slate-400">{(document.size / 1024 / 1024).toFixed(2)} MB</p>
                        </div>
                        <Button
                          type="button"
                          size="sm"
                          variant="ghost"
                          onClick={() => handleRemoveDocument(document.id)}
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
              {personnel ? 'Modifier' : 'Ajouter'} l'Employé
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default PersonnelForm;