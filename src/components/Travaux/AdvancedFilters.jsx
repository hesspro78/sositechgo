import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Filter, 
  Calendar, 
  User, 
  Building, 
  CheckCircle, 
  Clock, 
  AlertTriangle,
  X,
  Search
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';

const AdvancedFilters = ({ onFiltersChange, activeFilters = {} }) => {
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    searchTerm: activeFilters.searchTerm || '',
    status: activeFilters.status || '',
    responsable: activeFilters.responsable || '',
    client: activeFilters.client || '',
    dateDebutFrom: activeFilters.dateDebutFrom || '',
    dateDebutTo: activeFilters.dateDebutTo || '',
    dateFinFrom: activeFilters.dateFinFrom || '',
    dateFinTo: activeFilters.dateFinTo || '',
    avancementMin: activeFilters.avancementMin || [0],
    avancementMax: activeFilters.avancementMax || [100],
    priority: activeFilters.priority || '',
    hasDocuments: activeFilters.hasDocuments || '',
    hasMaterials: activeFilters.hasMaterials || ''
  });

  const statusOptions = [
    { value: '', label: 'Tous les statuts' },
    { value: 'Planifié', label: 'Planifié', icon: Clock, color: 'text-yellow-400' },
    { value: 'En cours', label: 'En cours', icon: Clock, color: 'text-blue-400' },
    { value: 'Terminé', label: 'Terminé', icon: CheckCircle, color: 'text-green-400' },
    { value: 'Suspendu', label: 'Suspendu', icon: AlertTriangle, color: 'text-red-400' }
  ];

  const priorityOptions = [
    { value: '', label: 'Toutes les priorités' },
    { value: 'high', label: 'Haute', color: 'text-red-400' },
    { value: 'medium', label: 'Moyenne', color: 'text-yellow-400' },
    { value: 'low', label: 'Basse', color: 'text-green-400' }
  ];

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
  };

  const applyFilters = () => {
    onFiltersChange(filters);
    setShowFilters(false);
  };

  const resetFilters = () => {
    const emptyFilters = {
      searchTerm: '',
      status: '',
      responsable: '',
      client: '',
      dateDebutFrom: '',
      dateDebutTo: '',
      dateFinFrom: '',
      dateFinTo: '',
      avancementMin: [0],
      avancementMax: [100],
      priority: '',
      hasDocuments: '',
      hasMaterials: ''
    };
    setFilters(emptyFilters);
    onFiltersChange(emptyFilters);
  };

  const getActiveFiltersCount = () => {
    return Object.values(filters).filter(value => {
      if (Array.isArray(value)) {
        return value[0] !== 0 || value[0] !== 100;
      }
      return value !== '' && value !== null && value !== undefined;
    }).length;
  };

  const activeFiltersCount = getActiveFiltersCount();

  return (
    <div className="flex items-center space-x-4">
      {/* Search Bar */}
      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
        <Input
          placeholder="Rechercher un projet..."
          value={filters.searchTerm}
          onChange={(e) => {
            handleFilterChange('searchTerm', e.target.value);
            // Appliquer la recherche en temps réel
            onFiltersChange({ ...filters, searchTerm: e.target.value });
          }}
          className="pl-10 bg-slate-800/50 border-slate-600"
        />
      </div>

      {/* Quick Status Filter */}
      <Select 
        value={filters.status} 
        onValueChange={(value) => {
          handleFilterChange('status', value);
          onFiltersChange({ ...filters, status: value });
        }}
      >
        <SelectTrigger className="w-40 bg-slate-800/50 border-slate-600">
          <SelectValue placeholder="Statut" />
        </SelectTrigger>
        <SelectContent>
          {statusOptions.map(option => (
            <SelectItem key={option.value} value={option.value}>
              <div className="flex items-center space-x-2">
                {option.icon && <option.icon className={`w-4 h-4 ${option.color}`} />}
                <span>{option.label}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Advanced Filters Dialog */}
      <Dialog open={showFilters} onOpenChange={setShowFilters}>
        <DialogTrigger asChild>
          <Button variant="outline" className="border-slate-600 relative">
            <Filter className="w-4 h-4 mr-2" />
            Filtres avancés
            {activeFiltersCount > 0 && (
              <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 text-xs bg-blue-500 text-white">
                {activeFiltersCount}
              </Badge>
            )}
          </Button>
        </DialogTrigger>
        
        <DialogContent className="glass-effect border-slate-700/50 max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2 text-white">
              <Filter className="w-5 h-5 text-blue-400" />
              <span>Filtres Avancés</span>
            </DialogTitle>
            <DialogDescription className="text-slate-400">
              Affinez votre recherche avec des critères détaillés
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {/* Informations générales */}
            <Card className="glass-effect border-slate-700/50">
              <CardHeader>
                <CardTitle className="text-white text-lg">Informations Générales</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="responsable" className="text-slate-300">Responsable</Label>
                  <Input
                    id="responsable"
                    value={filters.responsable}
                    onChange={(e) => handleFilterChange('responsable', e.target.value)}
                    placeholder="Nom du responsable"
                    className="bg-slate-800/50 border-slate-600"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="client" className="text-slate-300">Client</Label>
                  <Input
                    id="client"
                    value={filters.client}
                    onChange={(e) => handleFilterChange('client', e.target.value)}
                    placeholder="Nom du client"
                    className="bg-slate-800/50 border-slate-600"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="priority" className="text-slate-300">Priorité</Label>
                  <Select value={filters.priority} onValueChange={(value) => handleFilterChange('priority', value)}>
                    <SelectTrigger className="bg-slate-800/50 border-slate-600">
                      <SelectValue placeholder="Sélectionner une priorité" />
                    </SelectTrigger>
                    <SelectContent>
                      {priorityOptions.map(option => (
                        <SelectItem key={option.value} value={option.value}>
                          <span className={option.color}>{option.label}</span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Dates */}
            <Card className="glass-effect border-slate-700/50">
              <CardHeader>
                <CardTitle className="text-white text-lg">Plage de Dates</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-medium text-slate-300">Date de début</h4>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-2">
                      <Label className="text-slate-400 text-sm">Du</Label>
                      <Input
                        type="date"
                        value={filters.dateDebutFrom}
                        onChange={(e) => handleFilterChange('dateDebutFrom', e.target.value)}
                        className="bg-slate-800/50 border-slate-600"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-slate-400 text-sm">Au</Label>
                      <Input
                        type="date"
                        value={filters.dateDebutTo}
                        onChange={(e) => handleFilterChange('dateDebutTo', e.target.value)}
                        className="bg-slate-800/50 border-slate-600"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium text-slate-300">Date de fin</h4>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-2">
                      <Label className="text-slate-400 text-sm">Du</Label>
                      <Input
                        type="date"
                        value={filters.dateFinFrom}
                        onChange={(e) => handleFilterChange('dateFinFrom', e.target.value)}
                        className="bg-slate-800/50 border-slate-600"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-slate-400 text-sm">Au</Label>
                      <Input
                        type="date"
                        value={filters.dateFinTo}
                        onChange={(e) => handleFilterChange('dateFinTo', e.target.value)}
                        className="bg-slate-800/50 border-slate-600"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Avancement */}
            <Card className="glass-effect border-slate-700/50">
              <CardHeader>
                <CardTitle className="text-white text-lg">Avancement du Projet</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-slate-300">Avancement minimum</Label>
                    <span className="text-slate-400">{filters.avancementMin[0]}%</span>
                  </div>
                  <Slider
                    value={filters.avancementMin}
                    onValueChange={(value) => handleFilterChange('avancementMin', value)}
                    max={100}
                    step={5}
                    className="w-full"
                  />
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-slate-300">Avancement maximum</Label>
                    <span className="text-slate-400">{filters.avancementMax[0]}%</span>
                  </div>
                  <Slider
                    value={filters.avancementMax}
                    onValueChange={(value) => handleFilterChange('avancementMax', value)}
                    max={100}
                    step={5}
                    className="w-full"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Contenu */}
            <Card className="glass-effect border-slate-700/50">
              <CardHeader>
                <CardTitle className="text-white text-lg">Contenu du Projet</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-slate-300">Avec documents</Label>
                  <Select value={filters.hasDocuments} onValueChange={(value) => handleFilterChange('hasDocuments', value)}>
                    <SelectTrigger className="bg-slate-800/50 border-slate-600">
                      <SelectValue placeholder="Tous" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Tous</SelectItem>
                      <SelectItem value="yes">Avec documents</SelectItem>
                      <SelectItem value="no">Sans documents</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-slate-300">Avec matériaux</Label>
                  <Select value={filters.hasMaterials} onValueChange={(value) => handleFilterChange('hasMaterials', value)}>
                    <SelectTrigger className="bg-slate-800/50 border-slate-600">
                      <SelectValue placeholder="Tous" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Tous</SelectItem>
                      <SelectItem value="yes">Avec matériaux</SelectItem>
                      <SelectItem value="no">Sans matériaux</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-6 border-t border-slate-700/50">
            <Button
              variant="outline"
              onClick={resetFilters}
              className="border-slate-600 text-slate-300"
            >
              <X className="w-4 h-4 mr-2" />
              Réinitialiser
            </Button>
            
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                onClick={() => setShowFilters(false)}
                className="border-slate-600 text-slate-300"
              >
                Annuler
              </Button>
              <Button
                onClick={applyFilters}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Appliquer les filtres
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Active Filters Display */}
      {activeFiltersCount > 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex items-center space-x-2"
        >
          <span className="text-sm text-slate-400">{activeFiltersCount} filtre(s) actif(s)</span>
          <Button
            size="sm"
            variant="ghost"
            onClick={resetFilters}
            className="text-slate-400 hover:text-red-400"
          >
            <X className="w-3 h-3" />
          </Button>
        </motion.div>
      )}
    </div>
  );
};

export default AdvancedFilters;