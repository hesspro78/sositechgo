import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Search, Filter, Eye, Edit, Trash2, Upload, Calendar, User, Building } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useSupabaseData } from '@/hooks/useSupabaseData';
import { toast } from '@/components/ui/use-toast';
import TravauxForm from './TravauxForm';

const TravauxManager = () => {
  const [travaux, setTravaux, loading, saveData, deleteData] = useSupabaseData('travaux', 'sositech_travaux');
  const [showForm, setShowForm] = useState(false);
  const [editingTravaux, setEditingTravaux] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const handleAddTravaux = async (newTravaux) => {
    const travauxData = {
      nature: newTravaux.nature,
      description: newTravaux.description,
      materiaux: newTravaux.materiaux || [],
      responsable: newTravaux.responsable,
      date_debut: newTravaux.dateDebut,
      date_fin: newTravaux.dateFin,
      demandeur: newTravaux.demandeur,
      client_info: {
        client: newTravaux.client,
        societe: newTravaux.societe
      },
      fichiers: newTravaux.fichiers || [],
      avancement: newTravaux.avancement || 0,
      statut: 'Planifié'
    };
    
    await saveData(travauxData);
    setShowForm(false);
    toast({
      title: "Projet créé !",
      description: "Le nouveau projet a été ajouté avec succès.",
    });
  };

  const handleEditTravaux = async (updatedTravaux) => {
    const travauxData = {
      id: updatedTravaux.id,
      nature: updatedTravaux.nature,
      description: updatedTravaux.description,
      materiaux: updatedTravaux.materiaux || [],
      responsable: updatedTravaux.responsable,
      date_debut: updatedTravaux.dateDebut,
      date_fin: updatedTravaux.dateFin,
      demandeur: updatedTravaux.demandeur,
      client_info: {
        client: updatedTravaux.client,
        societe: updatedTravaux.societe
      },
      fichiers: updatedTravaux.fichiers || [],
      avancement: updatedTravaux.avancement || 0,
      statut: updatedTravaux.status || 'Planifié'
    };
    
    await saveData(travauxData);
    setEditingTravaux(null);
    setShowForm(false);
    toast({
      title: "Projet modifié !",
      description: "Les modifications ont été sauvegardées.",
    });
  };

  const handleDeleteTravaux = async (id) => {
    await deleteData(id);
    toast({
      title: "Projet supprimé",
      description: "Le projet a été supprimé avec succès.",
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Terminé':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'En cours':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'Planifié':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'Suspendu':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  // Transform Supabase data to match component expectations
  const transformedTravaux = travaux.map(t => ({
    id: t.id,
    nature: t.nature,
    description: t.description,
    materiaux: t.materiaux || [],
    responsable: t.responsable,
    dateDebut: t.date_debut,
    dateFin: t.date_fin,
    demandeur: t.demandeur,
    client: t.client_info?.client || '',
    societe: t.client_info?.societe || '',
    fichiers: t.fichiers || [],
    avancement: t.avancement || 0,
    status: t.statut || 'Planifié',
    createdAt: t.created_at
  }));

  const filteredTravaux = transformedTravaux.filter(t =>
    t.nature.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.responsable.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (showForm) {
    return (
      <TravauxForm
        travaux={editingTravaux}
        onSubmit={editingTravaux ? handleEditTravaux : handleAddTravaux}
        onCancel={() => {
          setShowForm(false);
          setEditingTravaux(null);
        }}
      />
    );
  }

  return (
    <div className="p-6 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold gradient-text">Gestion des Travaux</h1>
          <p className="text-slate-400">Gérez vos projets et suivez leur avancement</p>
        </div>
        <Button
          onClick={() => setShowForm(true)}
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Nouveau Projet
        </Button>
      </motion.div>

      {/* Search and Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex items-center space-x-4"
      >
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            placeholder="Rechercher un projet..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-slate-800/50 border-slate-600"
          />
        </div>
        <Button variant="outline" className="border-slate-600">
          <Filter className="w-4 h-4 mr-2" />
          Filtres
        </Button>
      </motion.div>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      {/* Projects Grid */}
      {!loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTravaux.map((projet, index) => (
          <motion.div
            key={projet.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="glass-effect border-slate-700/50 hover:border-slate-600/50 transition-all duration-300">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg text-white">{projet.nature}</CardTitle>
                  <Badge className={getStatusColor(projet.status)}>
                    {projet.status}
                  </Badge>
                </div>
                <CardDescription className="text-slate-400">
                  {projet.description.substring(0, 100)}...
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center text-sm text-slate-300">
                    <Building className="w-4 h-4 mr-2 text-slate-400" />
                    <span>{projet.client}</span>
                  </div>
                  <div className="flex items-center text-sm text-slate-300">
                    <User className="w-4 h-4 mr-2 text-slate-400" />
                    <span>{projet.responsable}</span>
                  </div>
                  <div className="flex items-center text-sm text-slate-300">
                    <Calendar className="w-4 h-4 mr-2 text-slate-400" />
                    <span>{new Date(projet.dateDebut).toLocaleDateString()} - {new Date(projet.dateFin).toLocaleDateString()}</span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-400">Avancement</span>
                    <span className="text-slate-300">{projet.avancement || 0}%</span>
                  </div>
                  <div className="w-full bg-slate-700 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${projet.avancement || 0}%` }}
                    />
                  </div>
                </div>

                {/* Materials Count */}
                {projet.materiaux && projet.materiaux.length > 0 && (
                  <div className="text-sm text-slate-400">
                    {projet.materiaux.length} matériau(x) requis
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-700/50">
                  <div className="flex items-center space-x-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => toast({
                        title: "🚧 Fonctionnalité non implémentée",
                        description: "Vous pouvez la demander dans votre prochaine requête ! 🚀"
                      })}
                      className="text-slate-400 hover:text-blue-400"
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        setEditingTravaux(projet);
                        setShowForm(true);
                      }}
                      className="text-slate-400 hover:text-yellow-400"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDeleteTravaux(projet.id)}
                      className="text-slate-400 hover:text-red-400"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  {projet.fichiers && projet.fichiers.length > 0 && (
                    <div className="flex items-center text-xs text-slate-400">
                      <Upload className="w-3 h-3 mr-1" />
                      {projet.fichiers.length} fichier(s)
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
        </div>
      )}

      {!loading && filteredTravaux.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-slate-800/50 flex items-center justify-center">
            <Plus className="w-12 h-12 text-slate-400" />
          </div>
          <h3 className="text-xl font-semibold text-slate-300 mb-2">Aucun projet trouvé</h3>
          <p className="text-slate-400 mb-4">
            {searchTerm ? 'Aucun projet ne correspond à votre recherche.' : 'Commencez par créer votre premier projet.'}
          </p>
          <Button
            onClick={() => setShowForm(true)}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Créer un Projet
          </Button>
        </motion.div>
      )}
    </div>
  );
};

export default TravauxManager;