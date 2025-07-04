import React from 'react';
import { motion } from 'framer-motion';
import { Folder } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const FoldersSection = ({ folders, documents, setSelectedFolder }) => {
  const getFolderColor = (color) => {
    const colors = {
      blue: 'from-blue-500 to-cyan-500',
      green: 'from-green-500 to-emerald-500',
      orange: 'from-orange-500 to-red-500',
      purple: 'from-purple-500 to-pink-500',
      yellow: 'from-yellow-500 to-orange-500',
      red: 'from-red-500 to-pink-500'
    };
    return colors[color] || colors.blue;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      <Card className="glass-effect border-slate-700/50">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Folder className="w-5 h-5 text-blue-400" />
            <span>Dossiers</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {folders.map((folder) => (
              <motion.div
                key={folder.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="cursor-pointer"
                onClick={() => setSelectedFolder(folder.id)}
              >
                <div className="p-4 rounded-lg bg-slate-800/30 border border-slate-700/30 hover:border-slate-600/50 transition-all">
                  <div className="flex flex-col items-center space-y-2">
                    <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${getFolderColor(folder.color)} flex items-center justify-center`}>
                      <Folder className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-sm font-medium text-white text-center">{folder.name}</span>
                    <span className="text-xs text-slate-400">
                      {documents.filter(d => d.folderId === folder.id).length} fichier(s)
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default FoldersSection;