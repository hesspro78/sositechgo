import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Plus, 
  Search, 
  Filter, 
  Eye, 
  Edit, 
  Trash2, 
  User, 
  Phone, 
  Mail, 
  Calendar,
  AlertTriangle,
  Shield,
  FileText,
  Clock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useSupabaseData } from '@/hooks/useSupabaseData';
import { toast } from '@/components/ui/use-toast';
import PersonnelForm from './PersonnelForm';

const PersonnelManager = () => {
  const [personnel, setPersonnel, loading, saveData, deleteData] = useSupabaseData('personnel', 'sositech_personnel');
  const [showForm, setShowForm] = useState(false);
  const [editingPersonnel, setEditingPersonnel] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const handleAddPersonnel = async (newPersonnel) => {
    const personnelData = {
      nom_complet: newPersonnel.nomComplet,
      poste: newPersonnel.poste,
      telephone: newPersonnel.telephone,
      email: newPersonnel.email,
      numero_carte_identite: newPersonnel.numeroCarteIdentite,
      numero_cnss: newPersonnel.numeroCNSS,
      certificat_medical: newPersonnel.certificatMedical,
      assurance_info: newPersonnel.assuranceInfo,
      date_debut: newPersonnel.dateDebut,
      date_fin: newPersonnel.dateFin,
      statut: newPersonnel.statut || 'Actif',
      equipements: newPersonnel.equipements || [],
      documents: newPersonnel.documents || []
    };
    
    await saveData(personnelData);
    setShowForm(false);
    toast({
      title: "Employé ajouté !",
      description: "Le nouvel employé a été ajouté avec succès.",
    });
  };

  const handleEditPersonnel = async (updatedPersonnel) => {
    const personnelData = {
      id: updatedPersonnel.id,
      nom_complet: updatedPersonnel.nomComplet,
      poste: updatedPersonnel.poste,
      telephone: updatedPersonnel.telephone,
      email: updatedPersonnel.email,
      numero_carte_identite: updatedPersonnel.numeroCarteIdentite,
      numero_cnss: updatedPersonnel.numeroCNSS,
      certificat_medical: updatedPersonnel.certificatMedical,
      assurance_info: updatedPersonnel.assuranceInfo,
      date_debut: updatedPersonnel.dateDebut,
      date_fin: updatedPersonnel.dateFin,
      statut: updatedPersonnel.statut || 'Actif',
      equipements: updatedPersonnel.equipements || [],
      documents: updatedPersonnel.documents || []
    };
    
    await saveData(personnelData);
    setEditingPersonnel(null);
    setShowForm(false);
    toast({
      title: "Employé modifié !",
      description: "Les modifications ont été sauvegardées.",
    });
  };

  const handleDeletePersonnel = async (id) => {
    await deleteData(id);
    toast({
      title: "Employé supprimé",
      description: "L'employé a été supprimé avec succès.",
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Actif':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'Inactif':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'Congé':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'Formation':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const checkExpirations = (employee) => {
    const warnings = [];
    const now = new Date();
    const warningThreshold = 48 * 60 * 60 * 1000; // 48 heures en millisecondes

    // Vérifier la date de fin de contrat
    if (employee.date_fin) {
      const dateFin = new Date(employee.date_fin);
      if (dateFin - now <= warningThreshold && dateFin > now) {
        warnings.push('Contrat expire bientôt');
      }
    }

    // Vérifier le certificat médical
    if (employee.certificat_medical?.dateExpiration) {
      const dateExp = new Date(employee.certificat_medical.dateExpiration);
      if (dateExp - now <= warningThreshold && dateExp > now) {
        warnings.push('Certificat médical expire bientôt');
      }
    }

    // Vérifier l'assurance
    if (employee.assurance_info?.dateExpiration) {
      const dateExp = new Date(employee.assurance_info.dateExpiration);
      if (dateExp - now <= warningThreshold && dateExp > now) {
        warnings.push('Assurance expire bientôt');
      }
    }

    return warnings;
  };

  // Transform Supabase data to match component expectations
  const transformedPersonnel = personnel.map(p => ({
    id: p.id,
    nomComplet: p.nom_complet,
    poste: p.poste,
    telephone: p.telephone,
    email: p.email,
    numeroCarteIdentite: p.numero_carte_identite,
    numeroCNSS: p.numero_cnss,
    certificatMedical: p.certificat_medical,
    assuranceInfo: p.assurance_info,
    dateDebut: p.date_debut,
    dateFin: p.date_fin,
    statut: p.statut || 'Actif',
    equipements: p.equipements || [],
    documents: p.documents || [],
    createdAt: p.created_at
  }));

  const filteredPersonnel = transformedPersonnel.filter(p =>
    p.nomComplet.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.poste.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (showForm) {
    return (
      <PersonnelForm
        personnel={editingPersonnel}
        onSubmit={editingPersonnel ? handleEditPersonnel : handleAddPersonnel}
        onCancel={() => {
          setShowForm(false);
          setEditingPersonnel(null);
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
          <h1 className="text-3xl font-bold gradient-text">Gestion du Personnel</h1>
          <p className="text-slate-400">Gérez vos employés et leur équipement de sécurité</p>
        </div>
        <Button
          onClick={() => setShowForm(true)}
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Nouvel Employé
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
            placeholder="Rechercher un employé..."
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
          { label: 'Total Employés', value: transformedPersonnel.length, color: 'from-blue-500 to-cyan-500' },
          { label: 'Actifs', value: transformedPersonnel.filter(p => p.statut === 'Actif').length, color: 'from-green-500 to-emerald-500' },
          { label: 'En Formation', value: transformedPersonnel.filter(p => p.statut === 'Formation').length, color: 'from-yellow-500 to-orange-500' },
          { label: 'Expirations Proches', value: transformedPersonnel.filter(p => checkExpirations(p).length > 0).length, color: 'from-red-500 to-pink-500' }
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

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      {/* Personnel Grid */}
      {!loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPersonnel.map((employee, index) => {
            const warnings = checkExpirations(employee);
            
            return (
              <motion.div
                key={employee.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="glass-effect border-slate-700/50 hover:border-slate-600/50 transition-all duration-300">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg text-white">{employee.nomComplet}</CardTitle>
                      <div className="flex items-center space-x-2">
                        <Badge className={getStatusColor(employee.statut)}>
                          {employee.statut}
                        </Badge>
                        {warnings.length > 0 && (
                          <AlertTriangle className="w-5 h-5 text-red-400" />
                        )}
                      </div>
                    </div>
                    <CardDescription className="text-slate-400">
                      {employee.poste}
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center text-sm text-slate-300">
                        <Mail className="w-4 h-4 mr-2 text-slate-400" />
                        <span className="truncate">{employee.email}</span>
                      </div>
                      <div className="flex items-center text-sm text-slate-300">
                        <Phone className="w-4 h-4 mr-2 text-slate-400" />
                        <span>{employee.telephone}</span>
                      </div>
                      <div className="flex items-center text-sm text-slate-300">
                        <Calendar className="w-4 h-4 mr-2 text-slate-400" />
                        <span>Début: {new Date(employee.dateDebut).toLocaleDateString()}</span>
                      </div>
                    </div>

                    {/* Warnings */}
                    {warnings.length > 0 && (
                      <div className="space-y-1">
                        {warnings.map((warning, idx) => (
                          <div key={idx} className="flex items-center text-xs text-red-400 bg-red-500/10 p-2 rounded">
                            <AlertTriangle className="w-3 h-3 mr-1" />
                            {warning}
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Equipment Count */}
                    <div className="flex items-center justify-between text-sm text-slate-400">
                      <span>Équipements: {employee.equipements.length}</span>
                      <span>Documents: {employee.documents.length}</span>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-between pt-2 border-t border-slate-700/50">
                      <div className="flex items-center space-x-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => toast({
                            title: "🚧 Fonctionnalité non implémentée",
                            description: "Vue détaillée à venir"
                          })}
                          className="text-slate-400 hover:text-blue-400"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            setEditingPersonnel(employee);
                            setShowForm(true);
                          }}
                          className="text-slate-400 hover:text-yellow-400"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDeletePersonnel(employee.id)}
                          className="text-slate-400 hover:text-red-400"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      )}

      {!loading && filteredPersonnel.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-slate-800/50 flex items-center justify-center">
            <User className="w-12 h-12 text-slate-400" />
          </div>
          <h3 className="text-xl font-semibold text-slate-300 mb-2">Aucun employé trouvé</h3>
          <p className="text-slate-400 mb-4">
            {searchTerm ? 'Aucun employé ne correspond à votre recherche.' : 'Commencez par ajouter votre premier employé.'}
          </p>
          <Button
            onClick={() => setShowForm(true)}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Ajouter un Employé
          </Button>
        </motion.div>
      )}
    </div>
  );
};

export default PersonnelManager;