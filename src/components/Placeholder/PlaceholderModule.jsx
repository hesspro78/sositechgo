import React from 'react';
import { motion } from 'framer-motion';
import { Construction } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/components/ui/use-toast';

const PlaceholderModule = ({ title, description, icon: Icon }) => {
  return (
    <div className="p-6 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-2"
      >
        <h1 className="text-3xl font-bold gradient-text">{title}</h1>
        <p className="text-slate-400">{description}</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex items-center justify-center min-h-[400px]"
      >
        <Card className="glass-effect border-slate-700/50 max-w-md w-full">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center mb-4">
              {Icon ? <Icon className="w-8 h-8 text-white" /> : <Construction className="w-8 h-8 text-white" />}
            </div>
            <CardTitle className="text-white">Module en Développement</CardTitle>
            <CardDescription className="text-slate-400">
              Cette fonctionnalité sera bientôt disponible
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-slate-300 mb-6">
              Nous travaillons activement sur ce module pour vous offrir la meilleure expérience possible.
            </p>
            <Button
              onClick={() => toast({
                title: "🚧 Fonctionnalité non implémentée",
                description: "Vous pouvez la demander dans votre prochaine requête ! 🚀"
              })}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              Demander cette Fonctionnalité
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default PlaceholderModule;