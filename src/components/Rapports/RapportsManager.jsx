import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart3, 
  TrendingUp, 
  Download, 
  Calendar,
  DollarSign,
  Users,
  Wrench,
  ShoppingCart,
  PieChart,
  Activity
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { toast } from '@/components/ui/use-toast';

const RapportsManager = () => {
  const [travaux] = useLocalStorage('sositech_travaux', []);
  const [achats] = useLocalStorage('sositech_achats', []);
  const [clients] = useLocalStorage('sositech_clients', []);
  const [periode, setPeriode] = useState('mois');

  const generateReport = (type) => {
    toast({
      title: "🚧 Export non implémenté",
      description: "Vous pouvez demander cette fonctionnalité dans votre prochaine requête ! 🚀"
    });
  };

  // Calculs des statistiques
  const stats = {
    totalProjets: travaux.length,
    projetsActifs: travaux.filter(t => t.status === 'En cours').length,
    projetsTermines: travaux.filter(t => t.status === 'Terminé').length,
    totalCommandes: achats.length,
    commandesLivrees: achats.filter(a => a.status === 'Livré').length,
    totalClients: clients.length,
    clientsActifs: clients.filter(c => c.status === 'Actif').length,
    prospects: clients.filter(c => c.status === 'Prospect').length
  };

  const chartData = {
    projetsParMois: [
      { mois: 'Jan', projets: 8, commandes: 12 },
      { mois: 'Fév', projets: 12, commandes: 15 },
      { mois: 'Mar', projets: 15, commandes: 18 },
      { mois: 'Avr', projets: 10, commandes: 14 },
      { mois: 'Mai', projets: 18, commandes: 22 },
      { mois: 'Juin', projets: 14, commandes: 16 }
    ],
    repartitionClients: [
      { secteur: 'Construction', nombre: 8, couleur: 'from-blue-500 to-cyan-500' },
      { secteur: 'Industrie', nombre: 6, couleur: 'from-purple-500 to-pink-500' },
      { secteur: 'Services', nombre: 4, couleur: 'from-green-500 to-emerald-500' },
      { secteur: 'Commerce', nombre: 3, couleur: 'from-orange-500 to-red-500' },
      { secteur: 'Autre', nombre: 3, couleur: 'from-gray-500 to-slate-500' }
    ]
  };

  return (
    <div className="p-6 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold gradient-text">Rapports et Analyses</h1>
          <p className="text-slate-400">Consultez vos statistiques et performances</p>
        </div>
        <div className="flex items-center space-x-4">
          <Select value={periode} onValueChange={setPeriode}>
            <SelectTrigger className="w-40 bg-slate-800/50 border-slate-600">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="semaine">Cette semaine</SelectItem>
              <SelectItem value="mois">Ce mois</SelectItem>
              <SelectItem value="trimestre">Ce trimestre</SelectItem>
              <SelectItem value="annee">Cette année</SelectItem>
            </SelectContent>
          </Select>
          <Button
            onClick={() => generateReport('global')}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            <Download className="w-4 h-4 mr-2" />
            Exporter
          </Button>
        </div>
      </motion.div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { 
            title: 'Projets Actifs', 
            value: stats.projetsActifs, 
            total: stats.totalProjets,
            icon: Wrench, 
            color: 'from-blue-500 to-cyan-500',
            change: '+12%'
          },
          { 
            title: 'Commandes', 
            value: stats.commandesLivrees, 
            total: stats.totalCommandes,
            icon: ShoppingCart, 
            color: 'from-purple-500 to-pink-500',
            change: '+8%'
          },
          { 
            title: 'Clients Actifs', 
            value: stats.clientsActifs, 
            total: stats.totalClients,
            icon: Users, 
            color: 'from-green-500 to-emerald-500',
            change: '+15%'
          },
          { 
            title: 'Taux de Réussite', 
            value: Math.round((stats.projetsTermines / stats.totalProjets) * 100) || 0, 
            suffix: '%',
            icon: TrendingUp, 
            color: 'from-orange-500 to-red-500',
            change: '+5%'
          }
        ].map((kpi, index) => (
          <motion.div
            key={kpi.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="glass-effect border-slate-700/50 hover:border-slate-600/50 transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-400 mb-1">{kpi.title}</p>
                    <p className="text-2xl font-bold text-white">
                      {kpi.value}{kpi.suffix || ''}
                      {kpi.total && <span className="text-sm text-slate-400">/{kpi.total}</span>}
                    </p>
                    <p className="text-xs text-green-400 mt-1">{kpi.change}</p>
                  </div>
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${kpi.color} flex items-center justify-center`}>
                    <kpi.icon className="w-6 h-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="bg-slate-800/50 border border-slate-700/50">
          <TabsTrigger value="overview" className="data-[state=active]:bg-slate-700">Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="projects" className="data-[state=active]:bg-slate-700">Projets</TabsTrigger>
          <TabsTrigger value="clients" className="data-[state=active]:bg-slate-700">Clients</TabsTrigger>
          <TabsTrigger value="financial" className="data-[state=active]:bg-slate-700">Financier</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Évolution des Projets */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="glass-effect border-slate-700/50">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <BarChart3 className="w-5 h-5 text-blue-400" />
                    <span>Évolution Mensuelle</span>
                  </CardTitle>
                  <CardDescription>Projets et commandes par mois</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {chartData.projetsParMois.map((data, index) => (
                      <div key={data.mois} className="flex items-center justify-between">
                        <span className="text-sm text-slate-300 w-12">{data.mois}</span>
                        <div className="flex-1 mx-4 space-y-2">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-blue-400">Projets</span>
                            <span className="text-slate-400">{data.projets}</span>
                          </div>
                          <div className="w-full bg-slate-700 rounded-full h-2">
                            <div 
                              className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full transition-all duration-500"
                              style={{ width: `${(data.projets / 20) * 100}%` }}
                            />
                          </div>
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-purple-400">Commandes</span>
                            <span className="text-slate-400">{data.commandes}</span>
                          </div>
                          <div className="w-full bg-slate-700 rounded-full h-2">
                            <div 
                              className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-500"
                              style={{ width: `${(data.commandes / 25) * 100}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Répartition Clients */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card className="glass-effect border-slate-700/50">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <PieChart className="w-5 h-5 text-green-400" />
                    <span>Répartition par Secteur</span>
                  </CardTitle>
                  <CardDescription>Distribution de votre clientèle</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {chartData.repartitionClients.map((secteur, index) => {
                      const total = chartData.repartitionClients.reduce((sum, s) => sum + s.nombre, 0);
                      const percentage = Math.round((secteur.nombre / total) * 100);
                      
                      return (
                        <div key={secteur.secteur} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-slate-300">{secteur.secteur}</span>
                            <span className="text-sm text-slate-400">{secteur.nombre} ({percentage}%)</span>
                          </div>
                          <div className="w-full bg-slate-700 rounded-full h-3">
                            <div 
                              className={`bg-gradient-to-r ${secteur.couleur} h-3 rounded-full transition-all duration-500`}
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </TabsContent>

        <TabsContent value="projects" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="glass-effect border-slate-700/50">
              <CardHeader>
                <CardTitle className="text-green-400">Projets Terminés</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-white mb-2">{stats.projetsTermines}</div>
                <p className="text-sm text-slate-400">
                  Taux de réussite: {Math.round((stats.projetsTermines / stats.totalProjets) * 100) || 0}%
                </p>
              </CardContent>
            </Card>

            <Card className="glass-effect border-slate-700/50">
              <CardHeader>
                <CardTitle className="text-blue-400">En Cours</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-white mb-2">{stats.projetsActifs}</div>
                <p className="text-sm text-slate-400">
                  {Math.round((stats.projetsActifs / stats.totalProjets) * 100) || 0}% du total
                </p>
              </CardContent>
            </Card>

            <Card className="glass-effect border-slate-700/50">
              <CardHeader>
                <CardTitle className="text-yellow-400">Planifiés</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-white mb-2">
                  {travaux.filter(t => t.status === 'Planifié').length}
                </div>
                <p className="text-sm text-slate-400">À démarrer prochainement</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="clients" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="glass-effect border-slate-700/50">
              <CardHeader>
                <CardTitle>Évolution Clientèle</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-slate-800/30 rounded-lg">
                    <span className="text-slate-300">Clients Actifs</span>
                    <span className="text-green-400 font-semibold">{stats.clientsActifs}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-slate-800/30 rounded-lg">
                    <span className="text-slate-300">Prospects</span>
                    <span className="text-yellow-400 font-semibold">{stats.prospects}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-slate-800/30 rounded-lg">
                    <span className="text-slate-300">Inactifs</span>
                    <span className="text-red-400 font-semibold">
                      {clients.filter(c => c.status === 'Inactif').length}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-effect border-slate-700/50">
              <CardHeader>
                <CardTitle>Top Secteurs</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {chartData.repartitionClients
                    .sort((a, b) => b.nombre - a.nombre)
                    .slice(0, 5)
                    .map((secteur, index) => (
                      <div key={secteur.secteur} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${secteur.couleur}`} />
                          <span className="text-slate-300">{secteur.secteur}</span>
                        </div>
                        <span className="text-white font-semibold">{secteur.nombre}</span>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="financial" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: 'CA Estimé', value: '€125,430', change: '+18%', color: 'from-green-500 to-emerald-500' },
              { title: 'Coût Matériaux', value: '€45,200', change: '+5%', color: 'from-orange-500 to-red-500' },
              { title: 'Marge Brute', value: '€80,230', change: '+25%', color: 'from-blue-500 to-cyan-500' },
              { title: 'ROI Moyen', value: '64%', change: '+8%', color: 'from-purple-500 to-pink-500' }
            ].map((metric, index) => (
              <motion.div
                key={metric.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="glass-effect border-slate-700/50">
                  <CardContent className="p-6">
                    <div className="space-y-2">
                      <p className="text-sm text-slate-400">{metric.title}</p>
                      <p className="text-2xl font-bold text-white">{metric.value}</p>
                      <p className="text-xs text-green-400">{metric.change}</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default RapportsManager;