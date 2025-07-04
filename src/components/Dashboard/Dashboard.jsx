import React from 'react';
import { motion } from 'framer-motion';
import { 
  Wrench, 
  ShoppingCart, 
  Users, 
  Clock,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useSupabaseData } from '@/hooks/useSupabaseData';

const Dashboard = () => {
  const [travaux] = useSupabaseData('travaux', 'sositech_travaux');
  const [achats] = useSupabaseData('achats', 'sositech_achats');
  const [clients] = useSupabaseData('clients', 'sositech_clients');
  const [documents] = useSupabaseData('documents', 'sositech_documents');

  // Calculs dynamiques basés sur les données réelles
  const stats = [
    {
      title: "Projets Actifs",
      value: travaux.filter(t => t.statut === 'En cours').length.toString(),
      change: `+${travaux.filter(t => {
        const createdDate = new Date(t.created_at);
        const thisMonth = new Date();
        return createdDate.getMonth() === thisMonth.getMonth() && 
               createdDate.getFullYear() === thisMonth.getFullYear();
      }).length} ce mois`,
      icon: Wrench,
      color: "from-blue-500 to-cyan-500"
    },
    {
      title: "Commandes en Cours",
      value: achats.filter(a => a.statut === 'En transit' || a.statut === 'Commandé').length.toString(),
      change: `+${achats.filter(a => {
        const createdDate = new Date(a.created_at);
        const thisWeek = new Date();
        const weekAgo = new Date(thisWeek.getTime() - 7 * 24 * 60 * 60 * 1000);
        return createdDate >= weekAgo;
      }).length} cette semaine`,
      icon: ShoppingCart,
      color: "from-purple-500 to-pink-500"
    },
    {
      title: "Clients Actifs",
      value: clients.filter(c => c.statut === 'Actif').length.toString(),
      change: `+${clients.filter(c => {
        const createdDate = new Date(c.created_at);
        const thisMonth = new Date();
        return createdDate.getMonth() === thisMonth.getMonth() && 
               createdDate.getFullYear() === thisMonth.getFullYear();
      }).length} ce mois`,
      icon: Users,
      color: "from-green-500 to-emerald-500"
    }
  ];

  // Projets récents basés sur les données réelles
  const recentProjects = travaux
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, 3)
    .map(projet => ({
      id: projet.id,
      name: projet.nature,
      client: projet.client_info?.client || '',
      status: projet.statut || 'Planifié',
      progress: projet.avancement || 0,
      deadline: projet.date_fin
    }));

  // Commandes récentes basées sur les données réelles
  const recentOrders = achats
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, 3)
    .map(commande => ({
      id: commande.id,
      article: commande.articles?.[0]?.nom || 'Articles divers',
      quantity: commande.articles?.reduce((sum, article) => sum + parseInt(article.quantite || 0), 0) || 0,
      supplier: commande.fournisseur,
      status: commande.statut || 'En attente',
      date: new Date(commande.created_at).toLocaleDateString()
    }));

  const getStatusColor = (status) => {
    switch (status) {
      case 'Terminé':
      case 'Livré':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'En cours':
      case 'En transit':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'Planifié':
      case 'Commandé':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'En attente':
        return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  return (
    <div className="p-6 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-2"
      >
        <h1 className="text-3xl font-bold gradient-text">Tableau de Bord</h1>
        <p className="text-slate-400">Vue d'ensemble de vos activités</p>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="glass-effect border-slate-700/50 hover:border-slate-600/50 transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-400 mb-1">{stat.title}</p>
                      <p className="text-2xl font-bold text-white">{stat.value}</p>
                      <p className="text-xs text-green-400 mt-1">{stat.change}</p>
                    </div>
                    <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${stat.color} flex items-center justify-center`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Projects */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="glass-effect border-slate-700/50">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Wrench className="w-5 h-5 text-blue-400" />
                <span>Projets Récents</span>
              </CardTitle>
              <CardDescription>Suivi des derniers projets</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentProjects.length > 0 ? (
                recentProjects.map((project) => (
                  <div key={project.id} className="p-4 rounded-lg bg-slate-800/30 border border-slate-700/30">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-white">{project.name}</h4>
                      <Badge className={getStatusColor(project.status)}>
                        {project.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-slate-400 mb-2">{project.client}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex-1 mr-4">
                        <div className="w-full bg-slate-700 rounded-full h-2">
                          <div 
                            className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${project.progress}%` }}
                          />
                        </div>
                      </div>
                      <span className="text-xs text-slate-400">{project.progress}%</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <p className="text-slate-400">Aucun projet récent</p>
                  <p className="text-sm text-slate-500">Créez votre premier projet pour le voir ici</p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Recent Orders */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="glass-effect border-slate-700/50">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <ShoppingCart className="w-5 h-5 text-purple-400" />
                <span>Commandes Récentes</span>
              </CardTitle>
              <CardDescription>Suivi des dernières commandes</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentOrders.length > 0 ? (
                recentOrders.map((order) => (
                  <div key={order.id} className="p-4 rounded-lg bg-slate-800/30 border border-slate-700/30">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-white">{order.article}</h4>
                      <Badge className={getStatusColor(order.status)}>
                        {order.status}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between text-sm text-slate-400">
                      <span>Qté: {order.quantity}</span>
                      <span>{order.supplier}</span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">{order.date}</p>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <p className="text-slate-400">Aucune commande récente</p>
                  <p className="text-sm text-slate-500">Créez votre première commande pour la voir ici</p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card className="glass-effect border-slate-700/50">
            <CardHeader>
              <CardTitle className="text-lg">Documents</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-white">{documents.length}</p>
                  <p className="text-sm text-slate-400">Fichiers stockés</p>
                </div>
                <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <Card className="glass-effect border-slate-700/50">
            <CardHeader>
              <CardTitle className="text-lg">Taux de Réussite</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-white">
                    {travaux.length > 0 ? Math.round((travaux.filter(t => t.statut === 'Terminé').length / travaux.length) * 100) : 0}%
                  </p>
                  <p className="text-sm text-slate-400">Projets terminés</p>
                </div>
                <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <Card className="glass-effect border-slate-700/50">
            <CardHeader>
              <CardTitle className="text-lg">Délais Moyens</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-white">15</p>
                  <p className="text-sm text-slate-400">Jours par projet</p>
                </div>
                <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-yellow-500 to-orange-500 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;