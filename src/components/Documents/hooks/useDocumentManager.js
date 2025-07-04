import { toast } from '@/components/ui/use-toast';

export const useDocumentManager = ({
  documents,
  setDocuments,
  folders,
  setFolders,
  searchTerm,
  selectedCategory,
  selectedFolder,
  sortBy,
  setShowNewFolderDialog,
  setShowDocumentDetails,
  saveDocument,
  deleteDocument,
  saveFolder,
  deleteFolder
}) => {
  const getFileCategory = (type) => {
    if (type.includes('image/')) return 'images';
    if (type === 'application/pdf') return 'pdf';
    if (type.includes('text/') || type.includes('document') || type.includes('word') || type.includes('excel') || type.includes('powerpoint')) return 'documents';
    if (type.includes('video/')) return 'videos';
    if (type.includes('audio/')) return 'audio';
    return 'autres';
  };

  const handleFileUpload = async (files, folderId = 'general') => {
    console.log('Processing files:', files); // Debug log
    
    try {
      for (const file of files) {
        console.log('Processing file:', file.name, file.type, file.size); // Debug log
        
        const documentData = {
          name: file.name,
          size: file.size,
          type: file.type || 'application/octet-stream',
          category: getFileCategory(file.type || ''),
          folder_id: folderId,
          tags: [],
          description: '',
          is_favorite: false,
          version: 1,
          url: URL.createObjectURL(file)
        };
        
        await saveDocument(documentData);
      }
      
      toast({
        title: "Documents ajoutés",
        description: `${files.length} document(s) ajouté(s) avec succès`
      });
      
      console.log('Documents saved successfully'); // Debug log
    } catch (error) {
      console.error('Error uploading files:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors du téléchargement des fichiers",
        variant: "destructive"
      });
    }
  };

  const handleCreateFolder = async (name, color) => {
    if (!name.trim()) {
      toast({
        title: "Nom requis",
        description: "Veuillez saisir un nom pour le dossier",
        variant: "destructive"
      });
      return false;
    }

    try {
      const folderData = {
        name: name,
        color: color
      };

      await saveFolder(folderData);
      setShowNewFolderDialog(false);
      
      toast({
        title: "Dossier créé",
        description: `Le dossier "${name}" a été créé avec succès`
      });
      
      return true;
    } catch (error) {
      console.error('Error creating folder:', error);
      toast({
        title: "Erreur",
        description: "Impossible de créer le dossier",
        variant: "destructive"
      });
      return false;
    }
  };

  const handleToggleFavorite = async (documentId) => {
    const document = documents.find(doc => doc.id === documentId);
    if (document) {
      const updatedDocument = {
        ...document,
        is_favorite: !document.is_favorite
      };
      await saveDocument(updatedDocument);
    }
  };

  const handleAddTag = async (documentId, tag) => {
    if (!tag.trim()) return;
    
    const document = documents.find(doc => doc.id === documentId);
    if (document) {
      const updatedDocument = {
        ...document,
        tags: [...(document.tags || []), tag.trim()]
      };
      await saveDocument(updatedDocument);
    }
  };

  const handleRemoveTag = async (documentId, tagToRemove) => {
    const document = documents.find(doc => doc.id === documentId);
    if (document) {
      const updatedDocument = {
        ...document,
        tags: document.tags.filter(tag => tag !== tagToRemove)
      };
      await saveDocument(updatedDocument);
    }
  };

  const handleMoveToFolder = async (documentId, folderId) => {
    const document = documents.find(doc => doc.id === documentId);
    if (document) {
      const updatedDocument = {
        ...document,
        folder_id: folderId
      };
      await saveDocument(updatedDocument);
      
      const folderName = folders.find(f => f.id === folderId)?.name || 'Général';
      toast({
        title: "Document déplacé",
        description: `Document déplacé vers "${folderName}"`
      });
    }
  };

  const handleDuplicateDocument = async (document) => {
    const duplicatedDoc = {
      name: `Copie de ${document.name}`,
      size: document.size,
      type: document.type,
      category: document.category,
      folder_id: document.folder_id,
      tags: document.tags || [],
      description: document.description,
      is_favorite: false,
      version: 1,
      url: document.url
    };
    
    await saveDocument(duplicatedDoc);
    
    toast({
      title: "Document dupliqué",
      description: "Une copie du document a été créée"
    });
  };

  const handleDeleteDocument = async (id) => {
    await deleteDocument(id);
    
    toast({
      title: "Document supprimé",
      description: "Le document a été supprimé avec succès.",
    });
  };

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (doc.tags || []).some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'tous' || doc.category === selectedCategory;
    const matchesFolder = selectedFolder === 'tous' || doc.folder_id === selectedFolder;
    return matchesSearch && matchesCategory && matchesFolder;
  }).sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name);
      case 'size':
        return b.size - a.size;
      case 'type':
        return a.category.localeCompare(b.category);
      case 'date':
      default:
        return new Date(b.created_at || b.uploadDate) - new Date(a.created_at || a.uploadDate);
    }
  });

  const categories = [
    { id: 'tous', label: 'Tous', count: documents.length },
    { id: 'images', label: 'Images', count: documents.filter(d => d.category === 'images').length },
    { id: 'pdf', label: 'PDF', count: documents.filter(d => d.category === 'pdf').length },
    { id: 'documents', label: 'Documents', count: documents.filter(d => d.category === 'documents').length },
    { id: 'autres', label: 'Autres', count: documents.filter(d => d.category === 'autres').length }
  ];

  return {
    handleFileUpload,
    handleCreateFolder,
    handleToggleFavorite,
    handleAddTag,
    handleRemoveTag,
    handleMoveToFolder,
    handleDuplicateDocument,
    handleDeleteDocument,
    filteredDocuments,
    categories
  };
};