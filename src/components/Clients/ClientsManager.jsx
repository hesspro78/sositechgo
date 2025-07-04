import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Plus, 
  Search, 
  Filter, 
  Eye, 
  Edit, 
  Trash2, 
  Building, 
  Phone, 
  Mail, 
  MapPin,
  User,
  Calendar,
  DollarSign
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useSupabaseData } from '@/hooks/useSupabaseData';
import { toast } from '@/components/ui/use-toast';
import ClientForm from './ClientForm';

const ClientsManager = () => {
  const [clients, setClients, loading, saveData, deleteData] = useSupabaseData('clients', 'sositech_clients');
  const [showForm, setShowForm] = useState(false);
  const [editingClient, setEditingClient] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const handleAddClient = async (newClient) => {
    const clientData = {
      nom: newClient.nom,
      email: newClient.email,
      telephone: newClient.telephone,
      adresse: `${newClient.adresse}, ${newClient.ville} ${newClient.codePostal}`,
      secteur: newClient.secteur,
      statut: newClient.status || 'Actif',
      notes: newClient.notes
    };
    
    await saveData(clientData);
    setShowForm(false);
    toast({
      title: "Client ajouté !",
      description: "Le nouveau client a été ajouté avec succès.",
    });
  };

  const handleEditClient = async (updatedClient) => {
    const clientData = {
      id: updatedClient.id,
      nom: updatedClient.nom,
      email: updatedClient.email,
      telephone: updatedClient.telephone,
      adresse: `${updatedClient.adresse}, ${updatedClient.ville} ${updatedClient.codePostal}`,
      secteur: updatedClient.secteur,
      statut: updatedClient.status || 'Actif',
      notes: updatedClient.notes
    };
    
    await saveData(clientData);
    setEditingClient(null);
    setShowForm(false);
    toast({
      title: "Client modifié !",
      description: "Les modifications ont été sauvegardées.",
    });
  };

  const handleDeleteClient = async (id) => {
    await deleteData(id);
    toast({
      title: "Client supprimé",
      description: "Le client a été supprimé avec succès.",
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Actif':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'Inactif':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'Prospect':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  // Transform Supabase data to match component expectations
  const transformedClients = clients.map(c => ({
    id: c.id,
    nom: c.nom,
    prenom: '', // Not stored separately in Supabase schema
    entreprise: c.nom, // Using nom as entreprise for now
    email: c.email,
    telephone: c.telephone,
    adresse: c.adresse,
    secteur: c.secteur,
    status: c.statut || 'Actif',
    notes: c.notes,
    createdAt: c.created_at
  }));

  const filteredClients = transformedClients.filter(c =>
    c.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.entreprise.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (showForm) {
    return (
      <ClientForm
        client={editingClient}
        onSubmit={editingClient ? handleEditClient : handleAddClient}
        onCancel={() => {
          setShowForm(false);
          setEditingClient(null);
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
          <h1 className="text-3xl font-bold gradient-text">Gestion des Clients</h1>
          <p className="text-slate-400">Gérez votre base de clients et prospects</p>
        </div>
        <Button
          onClick={() => setShowForm(true)}
          className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Nouveau Client
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
            placeholder="Rechercher un client..."
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

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Clients', value: transformedClients.length, color: 'from-blue-500 to-cyan-500' },
          { label: 'Clients Actifs', value: transformedClients.filter(c => c.status === 'Actif').length, color: 'from-green-500 to-emerald-500' },
          { label: 'Prospects', value: transformedClients.filter(c => c.status === 'Prospect').length, color: 'from-yellow-500 to-orange-500' },
          { label: 'Inactifs', value: transformedClients.filter(c => c.status === 'Inactif').length, color: 'from-red-500 to-pink-500' }
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + index * 0.1 }}
          >
            <Card className="glass-effect border-slate-700/50">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-400">{stat.label}</p>
                    <p className="text-2xl font-bold text-white">{stat.value}</p>
                  </div>
                  <div className={`w-10 h-10 rounded-lg bg-gradient-to-r ${stat.color} flex items-center justify-center`}>
                    <User className="w-5 h-5 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="w-8 h-8 border-2 border-green-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      {/* Clients Grid */}
      {!loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredClients.map((client, index) => (
          <motion.div
            key={client.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="glass-effect border-slate-700/50 hover:border-slate-600/50 transition-all duration-300">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg text-white">{client.nom} {client.prenom}</CardTitle>
                  <Badge className={getStatusColor(client.status)}>
                    {client.status}
                  </Badge>
                </div>
                <CardDescription className="text-slate-400">
                  {client.entreprise}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <div className="flex items-center text-sm text-slate-300">
                    <Mail className="w-4 h-4 mr-2 text-slate-400" />
                    <span className="truncate">{client.email}</span>
                  </div>
                  <div className="flex items-center text-sm text-slate-300">
                    <Phone className="w-4 h-4 mr-2 text-slate-400" />
                    <span>{client.telephone}</span>
                  </div>
                  {client.adresse && (
                    <div className="flex items-center text-sm text-slate-300">
                      <MapPin className="w-4 h-4 mr-2 text-slate-400" />
                      <span className="truncate">{client.adresse}</span>
                    </div>
                  )}
                </div>

                {client.secteur && (
                  <div className="text-sm text-slate-400">
                    Secteur: {client.secteur}
                  </div>
                )}

                <div className="text-xs text-slate-500">
                  Ajouté le {new Date(client.createdAt).toLocaleDateString()}
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
                        setEditingClient(client);
                        setShowForm(true);
                      }}
                      className="text-slate-400 hover:text-yellow-400"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDeleteClient(client.id)}
                      className="text-slate-400 hover:text-red-400"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
        </div>
      )}

      {!loading && filteredClients.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-slate-800/50 flex items-center justify-center">
            <User className="w-12 h-12 text-slate-400" />
          </div>
          <h3 className="text-xl font-semibold text-slate-300 mb-2">Aucun client trouvé</h3>
          <p className="text-slate-400 mb-4">
            {searchTerm ? 'Aucun client ne correspond à votre recherche.' : 'Commencez par ajouter votre premier client.'}
          </p>
          <Button
            onClick={() => setShowForm(true)}
            className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Ajouter un Client
          </Button>
        </motion.div>
      )}
    </div>
  );
};

export default ClientsManager;