import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Calendar, 
  User, 
  Building, 
  FileText, 
  Package, 
  Share2,
  Edit,
  Download,
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import ProjectProgress from './ProjectProgress';
import DocumentSharing from '../Documents/DocumentSharing';
import { generateProjectPDF, downloadPDF } from '@/utils/pdfGenerator';
import { toast } from '@/components/ui/use-toast';

const ProjectDetailView = ({ project, onBack, onEdit, onUpdateProgress }) => {
  const [showSharing, setShowSharing] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

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

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Terminé':
        return <CheckCircle className="w-4 h-4" />;
      case 'En cours':
        return <Clock className="w-4 h-4" />;
      case 'Suspendu':
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const handleGeneratePDF = async () => {
    try {
      const doc = generateProjectPDF(project);
      const filename = `projet-${project.nature.replace(/\s+/g, '-').toLowerCase()}-${new Date().toISOString().split('T')[0]}.pdf`;
      
      const result = downloadPDF(doc, filename);
      
      if (result.success) {
        toast({
          title: "PDF généré avec succès",
          description: `Le rapport du projet a été téléchargé : ${filename}`
        });
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      toast({
        title: "Erreur lors de la génération du PDF",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const handleShare = () => {
    // Créer un document virtuel pour le partage
    const documentToShare = {
      id: project.id,
      name: `Projet - ${project.nature}`,
      type: 'application/pdf',
      size: 1024 * 1024, // 1MB estimé
      url: `#project-${project.id}` // URL fictive pour la démo
    };
    
    setShowSharing(documentToShare);
  };

  const calculateProjectHealth = () => {
    const now = new Date();
    const dateDebut = project.dateDebut ? new Date(project.dateDebut) : null;
    const dateFin = project.dateFin ? new Date(project.dateFin) : null;
    
    if (!dateDebut || !dateFin) return 'unknown';
    
    const totalDuration = dateFin - dateDebut;
    const elapsed = now - dateDebut;
    const expectedProgress = Math.min(100, (elapsed / totalDuration) * 100);
    const actualProgress = project.avancement || 0;
    
    if (actualProgress >= expectedProgress) return 'good';
    if (actualProgress >= expectedProgress - 20) return 'warning';
    return 'critical';
  };

  const projectHealth = calculateProjectHealth();
  const healthColors = {
    good: 'text-green-400',
    warning: 'text-yellow-400',
    critical: 'text-red-400',
    unknown: 'text-slate-400'
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              onClick={onBack}
              className="text-slate-400 hover:text-white"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour
            </Button>
            <div>
              <h1 className="text-3xl font-bold gradient-text">{project.nature}</h1>
              <p className="text-slate-400">Détails du projet</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <Button
              onClick={handleGeneratePDF}
              variant="outline"
              className="border-slate-600 text-slate-300"
            >
              <Download className="w-4 h-4 mr-2" />
              Exporter PDF
            </Button>
            <Button
              onClick={handleShare}
              variant="outline"
              className="border-slate-600 text-slate-300"
            >
              <Share2 className="w-4 h-4 mr-2" />
              Partager
            </Button>
            <Button
              onClick={() => onEdit(project)}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Edit className="w-4 h-4 mr-2" />
              Modifier
            </Button>
          </div>
        </div>

        {/* Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="glass-effect border-slate-700/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400 mb-1">Statut</p>
                  <Badge className={getStatusColor(project.status)}>
                    {getStatusIcon(project.status)}
                    <span className="ml-2">{project.status}</span>
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-effect border-slate-700/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400 mb-1">Avancement</p>
                  <div className="space-y-2">
                    <p className="text-2xl font-bold text-white">{project.avancement || 0}%</p>
                    <Progress value={project.avancement || 0} className="h-2" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-effect border-slate-700/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400 mb-1">Santé du projet</p>
                  <p className={`text-lg font-semibold ${healthColors[projectHealth]}`}>
                    {projectHealth === 'good' && 'Excellent'}
                    {projectHealth === 'warning' && 'Attention'}
                    {projectHealth === 'critical' && 'Critique'}
                    {projectHealth === 'unknown' && 'Indéterminé'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-effect border-slate-700/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400 mb-1">Échéance</p>
                  <p className="text-lg font-semibold text-white">
                    {project.dateFin ? new Date(project.dateFin).toLocaleDateString() : 'Non définie'}
                  </p>
                  {project.dateFin && (
                    <p className="text-xs text-slate-400">
                      {Math.ceil((new Date(project.dateFin) - new Date()) / (1000 * 60 * 60 * 24))} jours restants
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-slate-800/50 border border-slate-700/50">
            <TabsTrigger value="overview" className="data-[state=active]:bg-slate-700">
              Vue d'ensemble
            </TabsTrigger>
            <TabsTrigger value="progress" className="data-[state=active]:bg-slate-700">
              Suivi d'avancement
            </TabsTrigger>
            <TabsTrigger value="materials" className="data-[state=active]:bg-slate-700">
              Matériaux
            </TabsTrigger>
            <TabsTrigger value="documents" className="data-[state=active]:bg-slate-700">
              Documents
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Informations générales */}
              <Card className="glass-effect border-slate-700/50">
                <CardHeader>
                  <CardTitle className="text-white">Informations Générales</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center text-sm">
                      <Building className="w-4 h-4 mr-3 text-slate-400" />
                      <span className="text-slate-400 w-20">Client:</span>
                      <span className="text-white">{project.client}</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <User className="w-4 h-4 mr-3 text-slate-400" />
                      <span className="text-slate-400 w-20">Responsable:</span>
                      <span className="text-white">{project.responsable}</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <Calendar className="w-4 h-4 mr-3 text-slate-400" />
                      <span className="text-slate-400 w-20">Début:</span>
                      <span className="text-white">
                        {project.dateDebut ? new Date(project.dateDebut).toLocaleDateString() : 'Non définie'}
                      </span>
                    </div>
                    <div className="flex items-center text-sm">
                      <Calendar className="w-4 h-4 mr-3 text-slate-400" />
                      <span className="text-slate-400 w-20">Fin:</span>
                      <span className="text-white">
                        {project.dateFin ? new Date(project.dateFin).toLocaleDateString() : 'Non définie'}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Description */}
              <Card className="glass-effect border-slate-700/50">
                <CardHeader>
                  <CardTitle className="text-white">Description</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-300 leading-relaxed">
                    {project.description || 'Aucune description disponible'}
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="progress" className="space-y-6">
            <ProjectProgress
              projectId={project.id}
              projectData={project}
              onUpdateProgress={onUpdateProgress}
            />
          </TabsContent>

          <TabsContent value="materials" className="space-y-6">
            <Card className="glass-effect border-slate-700/50">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-white">
                  <Package className="w-5 h-5 text-blue-400" />
                  <span>Matériaux Requis</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {project.materiaux && project.materiaux.length > 0 ? (
                  <div className="space-y-3">
                    {project.materiaux.map((materiau, index) => (
                      <div key={index} className="flex items-center justify-between p-4 bg-slate-800/30 rounded-lg border border-slate-700/30">
                        <div>
                          <h4 className="font-medium text-white">{materiau.nom}</h4>
                          <p className="text-sm text-slate-400">
                            Quantité: {materiau.quantite} {materiau.unite}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Package className="w-12 h-12 mx-auto mb-4 text-slate-400" />
                    <p className="text-slate-400">Aucun matériau spécifié</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="documents" className="space-y-6">
            <Card className="glass-effect border-slate-700/50">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-white">
                  <FileText className="w-5 h-5 text-blue-400" />
                  <span>Documents du Projet</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {project.fichiers && project.fichiers.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {project.fichiers.map((fichier, index) => (
                      <div key={index} className="p-4 bg-slate-800/30 rounded-lg border border-slate-700/30">
                        <div className="flex items-center space-x-3">
                          <FileText className="w-8 h-8 text-blue-400" />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-white truncate">{fichier.name}</p>
                            <p className="text-xs text-slate-400">
                              {(fichier.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <FileText className="w-12 h-12 mx-auto mb-4 text-slate-400" />
                    <p className="text-slate-400">Aucun document attaché</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>

      {/* Document Sharing Dialog */}
      <DocumentSharing
        document={showSharing}
        isOpen={!!showSharing}
        onClose={() => setShowSharing(false)}
      />
    </div>
  );
};

export default ProjectDetailView;