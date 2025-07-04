import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Plus, Trash2, Upload, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/components/ui/use-toast';

const AchatsForm = ({ achat, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    articles: [],
    fournisseur: '',
    demandeur: '',
    responsableAchats: '',
    client: '',
    dateLivraison: '',
    documents: []
  });

  const [newArticle, setNewArticle] = useState({
    nom: '',
    reference: '',
    description: '',
    quantite: '',
    unite: ''
  });

  useEffect(() => {
    if (achat) {
      setFormData(achat);
    }
  }, [achat]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleAddArticle = () => {
    if (newArticle.nom && newArticle.quantite) {
      setFormData(prev => ({
        ...prev,
        articles: [...prev.articles, { ...newArticle, id: Date.now() }]
      }));
      setNewArticle({ nom: '', reference: '', description: '', quantite: '', unite: '' });
    }
  };

  const handleRemoveArticle = (id) => {
    setFormData(prev => ({
      ...prev,
      articles: prev.articles.filter(a => a.id !== id)
    }));
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    const validFiles = files.filter(file => {
      const isValidSize = file.size <= 100 * 1024 * 1024; // 100MB
      const isValidType = file.type === 'application/pdf' || file.type.includes('image/');
      
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
          description: `${file.name} doit être un PDF ou une image`,
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
    
    if (!formData.fournisseur || !formData.client || formData.articles.length === 0) {
      toast({
        title: "Champs requis manquants",
        description: "Veuillez remplir tous les champs obligatoires et ajouter au moins un article",
        variant: "destructive"
      });
      return;
    }

    onSubmit(formData);
  };

  const unites = ['pièce', 'mètre', 'litre', 'kg', 'boîte', 'rouleau', 'sac', 'lot'];

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
              {achat ? 'Modifier la Commande' : 'Nouvelle Commande'}
            </h1>
            <p className="text-slate-400">Remplissez les informations de la commande</p>
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
                  <Label htmlFor="fournisseur" className="text-slate-300">Fournisseur *</Label>
                  <Input
                    id="fournisseur"
                    value={formData.fournisseur}
                    onChange={(e) => handleInputChange('fournisseur', e.target.value)}
                    placeholder="Nom du fournisseur"
                    className="bg-slate-800/50 border-slate-600"
                    required
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
                  <Label htmlFor="dateLivraison" className="text-slate-300">Date de livraison souhaitée</Label>
                  <Input
                    id="dateLivraison"
                    type="date"
                    value={formData.dateLivraison}
                    onChange={(e) => handleInputChange('dateLivraison', e.target.value)}
                    className="bg-slate-800/50 border-slate-600"
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
                  <Label htmlFor="responsableAchats" className="text-slate-300">Responsable des achats</Label>
                  <Input
                    id="responsableAchats"
                    value={formData.responsableAchats}
                    onChange={(e) => handleInputChange('responsableAchats', e.target.value)}
                    placeholder="Nom du responsable"
                    className="bg-slate-800/50 border-slate-600"
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Articles */}
          <Card className="glass-effect border-slate-700/50">
            <CardHeader>
              <CardTitle className="text-white">Liste des Articles</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                <Input
                  placeholder="Nom de l'article"
                  value={newArticle.nom}
                  onChange={(e) => setNewArticle(prev => ({ ...prev, nom: e.target.value }))}
                  className="bg-slate-800/50 border-slate-600"
                />
                <Input
                  placeholder="Référence"
                  value={newArticle.reference}
                  onChange={(e) => setNewArticle(prev => ({ ...prev, reference: e.target.value }))}
                  className="bg-slate-800/50 border-slate-600"
                />
                <Input
                  placeholder="Description"
                  value={newArticle.description}
                  onChange={(e) => setNewArticle(prev => ({ ...prev, description: e.target.value }))}
                  className="bg-slate-800/50 border-slate-600"
                />
                <Input
                  placeholder="Quantité"
                  type="number"
                  value={newArticle.quantite}
                  onChange={(e) => setNewArticle(prev => ({ ...prev, quantite: e.target.value }))}
                  className="bg-slate-800/50 border-slate-600"
                />
                <Select value={newArticle.unite} onValueChange={(value) => setNewArticle(prev => ({ ...prev, unite: value }))}>
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
                  onClick={handleAddArticle}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>

              {formData.articles.length > 0 && (
                <div className="space-y-2">
                  {formData.articles.map((article) => (
                    <div key={article.id} className="flex items-center justify-between p-4 bg-slate-800/30 rounded-lg border border-slate-700/30">
                      <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div>
                          <p className="text-white font-medium">{article.nom}</p>
                          <p className="text-xs text-slate-400">Réf: {article.reference}</p>
                        </div>
                        <div>
                          <p className="text-sm text-slate-300">{article.description}</p>
                        </div>
                        <div>
                          <p className="text-sm text-slate-300">{article.quantite} {article.unite}</p>
                        </div>
                        <div className="flex justify-end">
                          <Button
                            type="button"
                            size="sm"
                            variant="ghost"
                            onClick={() => handleRemoveArticle(article.id)}
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
              <CardTitle className="text-white">Documents Justificatifs</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="file-upload-area rounded-lg p-8 text-center">
                <input
                  type="file"
                  multiple
                  accept=".pdf,image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="document-upload"
                />
                <label htmlFor="document-upload" className="cursor-pointer">
                  <Upload className="w-12 h-12 mx-auto mb-4 text-slate-400" />
                  <p className="text-slate-300 mb-2">Cliquez pour télécharger des documents</p>
                  <p className="text-sm text-slate-400">Factures, bons de commande, PDF et images (max 100MB par fichier)</p>
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
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            >
              {achat ? 'Modifier' : 'Créer'} la Commande
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default AchatsForm;