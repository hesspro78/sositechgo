import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Search, Filter, Eye, Edit, Trash2, Package, Calendar, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useSupabaseData } from '@/hooks/useSupabaseData';
import { toast } from '@/components/ui/use-toast';
import AchatsForm from './AchatsForm';

const AchatsManager = () => {
  const [achats, setAchats, loading, saveData, deleteData] = useSupabaseData('achats', 'sositech_achats');
  const [showForm, setShowForm] = useState(false);
  const [editingAchat, setEditingAchat] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const handleAddAchat = async (newAchat) => {
    const achatData = {
      articles: newAchat.articles || [],
      fournisseur: newAchat.fournisseur,
      demandeur: newAchat.demandeur,
      responsable_achats: newAchat.responsableAchats,
      client: newAchat.client,
      date_livraison: newAchat.dateLivraison,
      documents: newAchat.documents || [],
      statut: 'En attente',
      total_amount: 0
    };
    
    await saveData(achatData);
    setShowForm(false);
    toast({
      title: "Commande créée !",
      description: "La nouvelle commande a été ajoutée avec succès.",
    });
  };

  const handleEditAchat = async (updatedAchat) => {
    const achatData = {
      id: updatedAchat.id,
      articles: updatedAchat.articles || [],
      fournisseur: updatedAchat.fournisseur,
      demandeur: updatedAchat.demandeur,
      responsable_achats: updatedAchat.responsableAchats,
      client: updatedAchat.client,
      date_livraison: updatedAchat.dateLivraison,
      documents: updatedAchat.documents || [],
      statut: updatedAchat.status || 'En attente',
      total_amount: updatedAchat.total_amount || 0
    };
    
    await saveData(achatData);
    setEditingAchat(null);
    setShowForm(false);
    toast({
      title: "Commande modifiée !",
      description: "Les modifications ont été sauvegardées.",
    });
  };

  const handleDeleteAchat = async (id) => {
    await deleteData(id);
    toast({
      title: "Commande supprimée",
      description: "La commande a été supprimée avec succès.",
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Livré':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'En transit':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'Commandé':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'En attente':
        return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'Annulé':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  // Transform Supabase data to match component expectations
  const transformedAchats = achats.map(a => ({
    id: a.id,
    articles: a.articles || [],
    fournisseur: a.fournisseur,
    demandeur: a.demandeur,
    responsableAchats: a.responsable_achats,
    client: a.client,
    dateLivraison: a.date_livraison,
    documents: a.documents || [],
    status: a.statut || 'En attente',
    createdAt: a.created_at
  }));

  const filteredAchats = transformedAchats.filter(a =>
    a.articles.some(article => 
      article.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.reference.toLowerCase().includes(searchTerm.toLowerCase())
    ) ||
    a.fournisseur.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.client.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (showForm) {
    return (
      <AchatsForm
        achat={editingAchat}
        onSubmit={editingAchat ? handleEditAchat : handleAddAchat}
        onCancel={() => {
          setShowForm(false);
          setEditingAchat(null);
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
          <h1 className="text-3xl font-bold gradient-text">Gestion des Achats</h1>
          <p className="text-slate-400">Gérez vos commandes et suivez les livraisons</p>
        </div>
        <Button
          onClick={() => setShowForm(true)}
          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Nouvelle Commande
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
            placeholder="Rechercher une commande..."
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
          <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      {/* Orders Grid */}
      {!loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAchats.map((commande, index) => (
          <motion.div
            key={commande.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="glass-effect border-slate-700/50 hover:border-slate-600/50 transition-all duration-300">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg text-white">
                    Commande #{commande.id.toString().slice(-4)}
                  </CardTitle>
                  <Badge className={getStatusColor(commande.status)}>
                    {commande.status}
                  </Badge>
                </div>
                <CardDescription className="text-slate-400">
                  {commande.articles.length} article(s) commandé(s)
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center text-sm text-slate-300">
                    <Package className="w-4 h-4 mr-2 text-slate-400" />
                    <span>{commande.fournisseur}</span>
                  </div>
                  <div className="flex items-center text-sm text-slate-300">
                    <User className="w-4 h-4 mr-2 text-slate-400" />
                    <span>Client: {commande.client}</span>
                  </div>
                  <div className="flex items-center text-sm text-slate-300">
                    <Calendar className="w-4 h-4 mr-2 text-slate-400" />
                    <span>Livraison: {new Date(commande.dateLivraison).toLocaleDateString()}</span>
                  </div>
                </div>

                {/* Articles Preview */}
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-slate-300">Articles:</h4>
                  <div className="space-y-1">
                    {commande.articles.slice(0, 2).map((article, idx) => (
                      <div key={idx} className="text-xs text-slate-400 flex justify-between">
                        <span>{article.nom}</span>
                        <span>x{article.quantite}</span>
                      </div>
                    ))}
                    {commande.articles.length > 2 && (
                      <div className="text-xs text-slate-500">
                        +{commande.articles.length - 2} autre(s)
                      </div>
                    )}
                  </div>
                </div>

                {/* Responsables */}
                <div className="text-sm text-slate-400 space-y-1">
                  <div>Demandeur: {commande.demandeur}</div>
                  <div>Responsable: {commande.responsableAchats}</div>
                </div>

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
                        setEditingAchat(commande);
                        setShowForm(true);
                      }}
                      className="text-slate-400 hover:text-yellow-400"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDeleteAchat(commande.id)}
                      className="text-slate-400 hover:text-red-400"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  {commande.documents && commande.documents.length > 0 && (
                    <div className="flex items-center text-xs text-slate-400">
                      <Package className="w-3 h-3 mr-1" />
                      {commande.documents.length} doc(s)
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
        </div>
      )}

      {!loading && filteredAchats.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-slate-800/50 flex items-center justify-center">
            <Plus className="w-12 h-12 text-slate-400" />
          </div>
          <h3 className="text-xl font-semibold text-slate-300 mb-2">Aucune commande trouvée</h3>
          <p className="text-slate-400 mb-4">
            {searchTerm ? 'Aucune commande ne correspond à votre recherche.' : 'Commencez par créer votre première commande.'}
          </p>
          <Button
            onClick={() => setShowForm(true)}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Créer une Commande
          </Button>
        </motion.div>
      )}
    </div>
  );
};

export default AchatsManager;