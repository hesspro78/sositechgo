import React from 'react';
import { motion } from 'framer-motion';
import { Star, Eye, Download, Trash2, FileText, Image, File } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/components/ui/use-toast';

const DocumentList = ({ documents, folders, onShowDetails, onDelete }) => {
  const getFileIcon = (category) => {
    switch (category) {
      case 'images':
        return Image;
      case 'pdf':
        return FileText;
      case 'documents':
        return File;
      default:
        return File;
    }
  };

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

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <Card className="glass-effect border-slate-700/50">
      <CardContent className="p-0">
        <div className="space-y-0">
          {documents.map((document, index) => {
            const IconComponent = getFileIcon(document.category);
            const folder = folders.find(f => f.id === document.folderId);
            
            return (
              <motion.div
                key={document.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-center justify-between p-4 border-b border-slate-700/30 last:border-b-0 hover:bg-slate-800/30 transition-colors group"
              >
                <div className="flex items-center space-x-4 flex-1">
                  <div className="w-10 h-10 rounded-lg bg-slate-800/50 flex items-center justify-center">
                    <IconComponent className="w-5 h-5 text-slate-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      <h3 className="font-medium text-white truncate">{document.name}</h3>
                      {document.isFavorite && (
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      )}
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-slate-400">
                      <span>{formatFileSize(document.size)}</span>
                      <span>{new Date(document.uploadDate).toLocaleDateString()}</span>
                      {folder && (
                        <Badge variant="outline" className={`text-xs bg-gradient-to-r ${getFolderColor(folder.color)} text-white border-0`}>
                          {folder.name}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onShowDetails(document)}
                    className="text-slate-400 hover:text-blue-400"
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => toast({
                      title: "🚧 Fonctionnalité non implémentée",
                      description: "Vous pouvez la demander dans votre prochaine requête ! 🚀"
                    })}
                    className="text-slate-400 hover:text-green-400"
                  >
                    <Download className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onDelete(document.id)}
                    className="text-slate-400 hover:text-red-400"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default DocumentList;