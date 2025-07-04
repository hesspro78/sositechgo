import React from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const DocumentDetails = ({ document, folders, onClose, onMoveToFolder, onAddTag, onRemoveTag }) => {
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <Dialog open={!!document} onOpenChange={() => onClose()}>
      <DialogContent className="glass-effect border-slate-700/50 max-w-2xl">
        {document && (
          <>
            <DialogHeader>
              <DialogTitle className="text-white">{document.name}</DialogTitle>
              <DialogDescription className="text-slate-400">
                Détails et propriétés du document
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-slate-300">Taille</Label>
                  <p className="text-white">{formatFileSize(document.size)}</p>
                </div>
                <div className="space-y-2">
                  <Label className="text-slate-300">Type</Label>
                  <p className="text-white">{document.category}</p>
                </div>
                <div className="space-y-2">
                  <Label className="text-slate-300">Date d'upload</Label>
                  <p className="text-white">{new Date(document.uploadDate).toLocaleDateString()}</p>
                </div>
                <div className="space-y-2">
                  <Label className="text-slate-300">Dossier</Label>
                  <Select 
                    value={document.folderId} 
                    onValueChange={(value) => onMoveToFolder(document.id, value)}
                  >
                    <SelectTrigger className="bg-slate-800/50 border-slate-600">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {folders.map(folder => (
                        <SelectItem key={folder.id} value={folder.id}>{folder.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label className="text-slate-300">Tags</Label>
                <div className="flex flex-wrap gap-2">
                  {(document.tags || []).map((tag, idx) => (
                    <Badge key={idx} variant="outline" className="text-slate-300 border-slate-600">
                      {tag}
                      <button
                        onClick={() => onRemoveTag(document.id, tag)}
                        className="ml-1 text-red-400 hover:text-red-300"
                      >
                        ×
                      </button>
                    </Badge>
                  ))}
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      const tag = prompt('Ajouter un tag:');
                      if (tag) onAddTag(document.id, tag);
                    }}
                    className="border-slate-600 text-slate-300"
                  >
                    <Plus className="w-3 h-3 mr-1" />
                    Ajouter
                  </Button>
                </div>
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default DocumentDetails;