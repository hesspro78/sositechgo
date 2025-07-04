import React from 'react';
import { motion } from 'framer-motion';
import { Star, Eye, Download, Copy, Trash2, FileText, Image, File } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/components/ui/use-toast';

const DocumentGrid = ({ documents, folders, onToggleFavorite, onShowDetails, onDuplicate, onDelete }) => {
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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {documents.map((document, index) => {
        const IconComponent = getFileIcon(document.category);
        const folder = folders.find(f => f.id === document.folderId);
        
        return (
          <motion.div
            key={document.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card className="glass-effect border-slate-700/50 hover:border-slate-600/50 transition-all duration-300 group">
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center justify-center w-16 h-16 rounded-lg bg-slate-800/50">
                      <IconComponent className="w-8 h-8 text-slate-400" />
                    </div>
                    <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => onToggleFavorite(document.id)}
                        className={`text-slate-400 hover:text-yellow-400 ${document.isFavorite ? 'text-yellow-400' : ''}`}
                      >
                        <Star className={`w-4 h-4 ${document.isFavorite ? 'fill-current' : ''}`} />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="text-center">
                    <h3 className="font-medium text-white truncate" title={document.name}>
                      {document.name}
                    </h3>
                    <p className="text-xs text-slate-400 mt-1">
                      {formatFileSize(document.size)}
                    </p>
                    <p className="text-xs text-slate-500">
                      {new Date(document.uploadDate).toLocaleDateString()}
                    </p>
                  </div>

                  {folder && (
                    <div className="flex justify-center">
                      <Badge variant="outline" className={`text-xs bg-gradient-to-r ${getFolderColor(folder.color)} text-white border-0`}>
                        {folder.name}
                      </Badge>
                    </div>
                  )}

                  {document.tags && document.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 justify-center">
                      {document.tags.slice(0, 2).map((tag, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs text-slate-400 border-slate-600">
                          {tag}
                        </Badge>
                      ))}
                      {document.tags.length > 2 && (
                        <Badge variant="outline" className="text-xs text-slate-400 border-slate-600">
                          +{document.tags.length - 2}
                        </Badge>
                      )}
                    </div>
                  )}

                  <div className="flex items-center justify-center space-x-1">
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
                      onClick={() => onDuplicate(document)}
                      className="text-slate-400 hover:text-purple-400"
                    >
                      <Copy className="w-4 h-4" />
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
                </div>
              </CardContent>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
};

export default DocumentGrid;