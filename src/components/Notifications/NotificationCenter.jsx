import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bell, 
  Calendar, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  X,
  Eye,
  Trash2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useSupabaseData } from '@/hooks/useSupabaseData';
import { toast } from '@/components/ui/use-toast';

const NotificationCenter = () => {
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [personnel] = useSupabaseData('personnel', 'sositech_personnel');
  const [travaux] = useSupabaseData('travaux', 'sositech_travaux');

  // Générer les notifications automatiques
  useEffect(() => {
    const generateNotifications = () => {
      const newNotifications = [];
      const now = new Date();
      const warningThreshold = 48 * 60 * 60 * 1000; // 48 heures

      // Notifications pour le personnel
      personnel.forEach(employee => {
        // Vérifier la date de fin de contrat
        if (employee.date_fin) {
          const dateFin = new Date(employee.date_fin);
          if (dateFin - now <= warningThreshold && dateFin > now) {
            newNotifications.push({
              id: `contract-${employee.id}`,
              type: 'warning',
              title: 'Contrat expire bientôt',
              message: `Le contrat de ${employee.nom_complet} expire le ${dateFin.toLocaleDateString()}`,
              timestamp: now.toISOString(),
              category: 'personnel',
              priority: 'high',
              read: false
            });
          }
        }

        // Vérifier le certificat médical
        if (employee.certificat_medical?.dateExpiration) {
          const dateExp = new Date(employee.certificat_medical.dateExpiration);
          if (dateExp - now <= warningThreshold && dateExp > now) {
            newNotifications.push({
              id: `medical-${employee.id}`,
              type: 'warning',
              title: 'Certificat médical expire bientôt',
              message: `Le certificat médical de ${employee.nom_complet} expire le ${dateExp.toLocaleDateString()}`,
              timestamp: now.toISOString(),
              category: 'personnel',
              priority: 'high',
              read: false
            });
          }
        }

        // Vérifier l'assurance
        if (employee.assurance_info?.dateExpiration) {
          const dateExp = new Date(employee.assurance_info.dateExpiration);
          if (dateExp - now <= warningThreshold && dateExp > now) {
            newNotifications.push({
              id: `insurance-${employee.id}`,
              type: 'warning',
              title: 'Assurance expire bientôt',
              message: `L'assurance de ${employee.nom_complet} expire le ${dateExp.toLocaleDateString()}`,
              timestamp: now.toISOString(),
              category: 'personnel',
              priority: 'high',
              read: false
            });
          }
        }
      });

      // Notifications pour les projets
      travaux.forEach(projet => {
        // Vérifier les échéances de projet
        if (projet.date_fin) {
          const dateFin = new Date(projet.date_fin);
          if (dateFin - now <= warningThreshold && dateFin > now) {
            newNotifications.push({
              id: `project-${projet.id}`,
              type: 'info',
              title: 'Échéance de projet approche',
              message: `Le projet "${projet.nature}" doit être terminé le ${dateFin.toLocaleDateString()}`,
              timestamp: now.toISOString(),
              category: 'projets',
              priority: 'medium',
              read: false
            });
          }
        }

        // Projets en retard
        if (projet.date_fin && new Date(projet.date_fin) < now && projet.statut !== 'Terminé') {
          newNotifications.push({
            id: `late-project-${projet.id}`,
            type: 'error',
            title: 'Projet en retard',
            message: `Le projet "${projet.nature}" est en retard depuis le ${new Date(projet.date_fin).toLocaleDateString()}`,
            timestamp: now.toISOString(),
            category: 'projets',
            priority: 'high',
            read: false
          });
        }
      });

      setNotifications(newNotifications);
    };

    generateNotifications();
    
    // Actualiser les notifications toutes les heures
    const interval = setInterval(generateNotifications, 60 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, [personnel, travaux]);

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-400" />;
      case 'error':
        return <AlertTriangle className="w-5 h-5 text-red-400" />;
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-400" />;
      case 'info':
      default:
        return <Clock className="w-5 h-5 text-blue-400" />;
    }
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case 'warning':
        return 'border-yellow-500/30 bg-yellow-500/10';
      case 'error':
        return 'border-red-500/30 bg-red-500/10';
      case 'success':
        return 'border-green-500/30 bg-green-500/10';
      case 'info':
      default:
        return 'border-blue-500/30 bg-blue-500/10';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'medium':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'low':
      default:
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
    }
  };

  const markAsRead = (id) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const deleteNotification = (id) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
    toast({
      title: "Notification supprimée",
      description: "La notification a été supprimée avec succès"
    });
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <>
      {/* Notification Bell Button */}
      <Dialog open={showNotifications} onOpenChange={setShowNotifications}>
        <DialogTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="relative text-slate-400 hover:text-white"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 text-xs bg-red-500 text-white">
                {unreadCount > 9 ? '9+' : unreadCount}
              </Badge>
            )}
          </Button>
        </DialogTrigger>
        
        <DialogContent className="glass-effect border-slate-700/50 max-w-2xl max-h-[80vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2 text-white">
              <Bell className="w-5 h-5 text-blue-400" />
              <span>Centre de Notifications</span>
              {unreadCount > 0 && (
                <Badge className="bg-red-500 text-white">
                  {unreadCount} non lue(s)
                </Badge>
              )}
            </DialogTitle>
            <DialogDescription className="text-slate-400">
              Notifications automatiques et échéances importantes
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="text-center py-8">
                <CheckCircle className="w-12 h-12 mx-auto mb-4 text-green-400" />
                <h3 className="text-lg font-medium text-slate-300 mb-2">Aucune notification</h3>
                <p className="text-slate-400">Toutes vos échéances sont à jour !</p>
              </div>
            ) : (
              <AnimatePresence>
                {notifications
                  .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
                  .map((notification, index) => (
                    <motion.div
                      key={notification.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -100 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Card className={`glass-effect border ${getNotificationColor(notification.type)} ${!notification.read ? 'ring-1 ring-blue-500/30' : ''}`}>
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex items-start space-x-3 flex-1">
                              {getNotificationIcon(notification.type)}
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center space-x-2 mb-1">
                                  <h4 className="font-medium text-white">{notification.title}</h4>
                                  <Badge className={getPriorityColor(notification.priority)}>
                                    {notification.priority}
                                  </Badge>
                                  {!notification.read && (
                                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                  )}
                                </div>
                                <p className="text-sm text-slate-300 mb-2">{notification.message}</p>
                                <div className="flex items-center space-x-4 text-xs text-slate-400">
                                  <span>{new Date(notification.timestamp).toLocaleString()}</span>
                                  <Badge variant="outline" className="text-xs border-slate-600">
                                    {notification.category}
                                  </Badge>
                                </div>
                              </div>
                            </div>
                            
                            <div className="flex items-center space-x-1 ml-2">
                              {!notification.read && (
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => markAsRead(notification.id)}
                                  className="text-slate-400 hover:text-blue-400"
                                >
                                  <Eye className="w-4 h-4" />
                                </Button>
                              )}
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => deleteNotification(notification.id)}
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
              </AnimatePresence>
            )}
          </div>

          {notifications.length > 0 && (
            <div className="flex justify-between items-center pt-4 border-t border-slate-700/50">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setNotifications(prev => prev.map(n => ({ ...n, read: true })));
                  toast({
                    title: "Toutes les notifications marquées comme lues",
                    description: "Toutes vos notifications ont été marquées comme lues"
                  });
                }}
                className="border-slate-600 text-slate-300"
              >
                Tout marquer comme lu
              </Button>
              
              <Button
                variant="outline"
                onClick={() => setShowNotifications(false)}
                className="border-slate-600 text-slate-300"
              >
                <X className="w-4 h-4 mr-2" />
                Fermer
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default NotificationCenter;