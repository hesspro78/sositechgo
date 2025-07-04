import React from 'react';
import { motion } from 'framer-motion';
import { FileText, Folder, Star, Image } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const DocumentStats = ({ documents, folders }) => {
  const stats = [
    { label: 'Total Documents', value: documents.length, color: 'from-blue-500 to-cyan-500', icon: FileText },
    { label: 'Dossiers', value: folders.length, color: 'from-purple-500 to-pink-500', icon: Folder },
    { label: 'Favoris', value: documents.filter(d => d.isFavorite).length, color: 'from-yellow-500 to-orange-500', icon: Star },
    { label: 'Images', value: documents.filter(d => d.category === 'images').length, color: 'from-green-500 to-emerald-500', icon: Image },
    { label: 'PDF', value: documents.filter(d => d.category === 'pdf').length, color: 'from-red-500 to-pink-500', icon: FileText }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <Card className="glass-effect border-slate-700/50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">{stat.label}</p>
                  <p className="text-2xl font-bold text-white">{stat.value}</p>
                </div>
                <div className={`w-10 h-10 rounded-lg bg-gradient-to-r ${stat.color} flex items-center justify-center`}>
                  <stat.icon className="w-5 h-5 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
};

export default DocumentStats;