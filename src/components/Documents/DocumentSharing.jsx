import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Share2, 
  Mail, 
  MessageCircle, 
  Download, 
  Copy,
  Check,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/components/ui/use-toast';

const DocumentSharing = ({ document, isOpen, onClose }) => {
  const [emailData, setEmailData] = useState({
    to: '',
    subject: `Document partagé: ${document?.name || ''}`,
    message: 'Veuillez trouver ci-joint le document demandé.'
  });
  
  const [whatsappData, setWhatsappData] = useState({
    phone: '',
    message: `Voici le document: ${document?.name || ''}`
  });

  const [copied, setCopied] = useState(false);

  const handleEmailShare = () => {
    if (!emailData.to) {
      toast({
        title: "Email requis",
        description: "Veuillez saisir une adresse email",
        variant: "destructive"
      });
      return;
    }

    // Simulation d'envoi d'email
    const mailtoLink = `mailto:${emailData.to}?subject=${encodeURIComponent(emailData.subject)}&body=${encodeURIComponent(emailData.message)}`;
    window.open(mailtoLink);
    
    toast({
      title: "Email préparé",
      description: "Votre client email va s'ouvrir avec le message pré-rempli"
    });
  };

  const handleWhatsAppShare = () => {
    if (!whatsappData.phone) {
      toast({
        title: "Numéro requis",
        description: "Veuillez saisir un numéro de téléphone",
        variant: "destructive"
      });
      return;
    }

    // Nettoyer le numéro de téléphone
    const cleanPhone = whatsappData.phone.replace(/\D/g, '');
    const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(whatsappData.message)}`;
    window.open(whatsappUrl, '_blank');
    
    toast({
      title: "WhatsApp ouvert",
      description: "Le message a été préparé dans WhatsApp"
    });
  };

  const handleCopyLink = () => {
    if (document?.url) {
      navigator.clipboard.writeText(document.url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      
      toast({
        title: "Lien copié",
        description: "Le lien du document a été copié dans le presse-papiers"
      });
    }
  };

  const handlePDFExport = () => {
    // Simulation d'export PDF
    toast({
      title: "🚧 Export PDF",
      description: "Fonctionnalité d'export PDF en cours de développement"
    });
  };

  const handleDownload = () => {
    if (document?.url) {
      const link = document.createElement('a');
      link.href = document.url;
      link.download = document.name;
      link.click();
      
      toast({
        title: "Téléchargement démarré",
        description: `${document.name} est en cours de téléchargement`
      });
    }
  };

  if (!document) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="glass-effect border-slate-700/50 max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2 text-white">
            <Share2 className="w-5 h-5 text-blue-400" />
            <span>Partager le Document</span>
          </DialogTitle>
          <DialogDescription className="text-slate-400">
            Partagez "{document.name}" via différents canaux
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="email" className="space-y-4">
          <TabsList className="bg-slate-800/50 border border-slate-700/50 w-full">
            <TabsTrigger value="email" className="data-[state=active]:bg-slate-700 flex-1">
              <Mail className="w-4 h-4 mr-2" />
              Email
            </TabsTrigger>
            <TabsTrigger value="whatsapp" className="data-[state=active]:bg-slate-700 flex-1">
              <MessageCircle className="w-4 h-4 mr-2" />
              WhatsApp
            </TabsTrigger>
            <TabsTrigger value="download" className="data-[state=active]:bg-slate-700 flex-1">
              <Download className="w-4 h-4 mr-2" />
              Télécharger
            </TabsTrigger>
          </TabsList>

          <TabsContent value="email" className="space-y-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <div className="space-y-2">
                <Label htmlFor="emailTo" className="text-slate-300">Destinataire *</Label>
                <Input
                  id="emailTo"
                  type="email"
                  value={emailData.to}
                  onChange={(e) => setEmailData(prev => ({ ...prev, to: e.target.value }))}
                  placeholder="email@exemple.com"
                  className="bg-slate-800/50 border-slate-600"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="emailSubject" className="text-slate-300">Sujet</Label>
                <Input
                  id="emailSubject"
                  value={emailData.subject}
                  onChange={(e) => setEmailData(prev => ({ ...prev, subject: e.target.value }))}
                  className="bg-slate-800/50 border-slate-600"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="emailMessage" className="text-slate-300">Message</Label>
                <Textarea
                  id="emailMessage"
                  value={emailData.message}
                  onChange={(e) => setEmailData(prev => ({ ...prev, message: e.target.value }))}
                  className="bg-slate-800/50 border-slate-600 min-h-[100px]"
                />
              </div>
              
              <Button
                onClick={handleEmailShare}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                <Mail className="w-4 h-4 mr-2" />
                Envoyer par Email
              </Button>
            </motion.div>
          </TabsContent>

          <TabsContent value="whatsapp" className="space-y-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <div className="space-y-2">
                <Label htmlFor="whatsappPhone" className="text-slate-300">Numéro de téléphone *</Label>
                <Input
                  id="whatsappPhone"
                  value={whatsappData.phone}
                  onChange={(e) => setWhatsappData(prev => ({ ...prev, phone: e.target.value }))}
                  placeholder="+33123456789"
                  className="bg-slate-800/50 border-slate-600"
                />
                <p className="text-xs text-slate-400">
                  Format international recommandé (ex: +33123456789)
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="whatsappMessage" className="text-slate-300">Message</Label>
                <Textarea
                  id="whatsappMessage"
                  value={whatsappData.message}
                  onChange={(e) => setWhatsappData(prev => ({ ...prev, message: e.target.value }))}
                  className="bg-slate-800/50 border-slate-600 min-h-[100px]"
                />
              </div>
              
              <Button
                onClick={handleWhatsAppShare}
                className="w-full bg-green-600 hover:bg-green-700"
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                Partager sur WhatsApp
              </Button>
            </motion.div>
          </TabsContent>

          <TabsContent value="download" className="space-y-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <div className="p-4 bg-slate-800/30 rounded-lg border border-slate-700/30">
                <h4 className="font-medium text-white mb-2">Informations du document</h4>
                <div className="space-y-2 text-sm text-slate-300">
                  <p><span className="text-slate-400">Nom:</span> {document.name}</p>
                  <p><span className="text-slate-400">Taille:</span> {(document.size / 1024 / 1024).toFixed(2)} MB</p>
                  <p><span className="text-slate-400">Type:</span> {document.type}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 gap-3">
                <Button
                  onClick={handleDownload}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Télécharger le fichier original
                </Button>
                
                <Button
                  onClick={handlePDFExport}
                  variant="outline"
                  className="border-slate-600 text-slate-300"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Exporter en PDF
                </Button>
                
                <Button
                  onClick={handleCopyLink}
                  variant="outline"
                  className="border-slate-600 text-slate-300"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4 mr-2 text-green-400" />
                      Lien copié !
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 mr-2" />
                      Copier le lien
                    </>
                  )}
                </Button>
              </div>
            </motion.div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end pt-4 border-t border-slate-700/50">
          <Button
            variant="outline"
            onClick={onClose}
            className="border-slate-600 text-slate-300"
          >
            <X className="w-4 h-4 mr-2" />
            Fermer
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DocumentSharing;