import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { 
  Upload, 
  Search, 
  Grid,
  List,
  FolderPlus
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useSupabaseData } from '@/hooks/useSupabaseData';
import { toast } from '@/components/ui/use-toast';
import DocumentStats from './components/DocumentStats';
import DocumentFilters from './components/DocumentFilters';
import FoldersSection from './components/FoldersSection';
import DocumentGrid from './components/DocumentGrid';
import DocumentList from './components/DocumentList';
import DocumentDetails from './components/DocumentDetails';
import CreateFolderDialog from './components/CreateFolderDialog';
import { useDocumentManager } from './hooks/useDocumentManager';

const DocumentsManager = () => {
  const [documents, setDocuments, documentsLoading, saveDocument, deleteDocument] = useSupabaseData('documents', 'sositech_documents');
  const [folders, setFolders, foldersLoading, saveFolder, deleteFolder] = useSupabaseData('folders', 'sositech_folders');
  
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [selectedCategory, setSelectedCategory] = useState('tous');
  const [selectedFolder, setSelectedFolder] = useState('tous');
  const [sortBy, setSortBy] = useState('date');
  const [showNewFolderDialog, setShowNewFolderDialog] = useState(false);
  const [showDocumentDetails, setShowDocumentDetails] = useState(null);
  
  // Use ref for file input to ensure proper handling
  const fileInputRef = useRef(null);

  const {
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
  } = useDocumentManager({
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
  });

  const handleFileInputChange = (e) => {
    const files = Array.from(e.target.files);
    console.log('Files selected:', files); // Debug log
    
    if (files.length === 0) {
      console.log('No files selected'); // Debug log
      return;
    }

    const validFiles = files.filter(file => {
      const isValidSize = file.size <= 100 * 1024 * 1024; // 100MB
      
      if (!isValidSize) {
        toast({
          title: "Fichier trop volumineux",
          description: `${file.name} dépasse la limite de 100MB`,
          variant: "destructive"
        });
      }
      
      return isValidSize;
    });

    console.log('Valid files:', validFiles); // Debug log

    if (validFiles.length > 0) {
      handleFileUpload(validFiles);
      // Reset the input value to allow uploading the same file again
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const triggerFileUpload = () => {
    console.log('Triggering file upload'); // Debug log
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="p-6 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold gradient-text">Gestion des Documents</h1>
          <p className="text-slate-400">Organisez et gérez vos fichiers de manière professionnelle</p>
        </div>
        <div className="flex items-center space-x-4">
          <CreateFolderDialog
            showDialog={showNewFolderDialog}
            setShowDialog={setShowNewFolderDialog}
            onCreateFolder={handleCreateFolder}
          />
          
          <input
            ref={fileInputRef}
            type="file"
            multiple
            onChange={handleFileInputChange}
            className="hidden"
            accept="*/*"
          />
          
          <Button
            onClick={triggerFileUpload}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            <Upload className="w-4 h-4 mr-2" />
            Télécharger
          </Button>
        </div>
      </motion.div>

      {!documentsLoading && !foldersLoading && (
        <DocumentStats documents={documents} folders={folders} />
      )}

      {!documentsLoading && !foldersLoading && (
        <DocumentFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedFolder={selectedFolder}
        setSelectedFolder={setSelectedFolder}
        sortBy={sortBy}
        setSortBy={setSortBy}
        viewMode={viewMode}
        setViewMode={setViewMode}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        folders={folders}
        categories={categories}
        />
      )}

      {!foldersLoading && selectedFolder === 'tous' && (
        <FoldersSection
          folders={folders}
          documents={documents}
          setSelectedFolder={setSelectedFolder}
        />
      )}

      {/* Loading State */}
      {(documentsLoading || foldersLoading) && (
        <div className="flex items-center justify-center py-12">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      {!documentsLoading && !foldersLoading && (
        <>
          {viewMode === 'grid' ? (
            <DocumentGrid
              documents={filteredDocuments}
              folders={folders}
              onToggleFavorite={handleToggleFavorite}
              onShowDetails={setShowDocumentDetails}
              onDuplicate={handleDuplicateDocument}
              onDelete={handleDeleteDocument}
            />
          ) : (
            <DocumentList
              documents={filteredDocuments}
              folders={folders}
              onShowDetails={setShowDocumentDetails}
              onDelete={handleDeleteDocument}
            />
          )}
        </>
      )}

      <DocumentDetails
        document={showDocumentDetails}
        folders={folders}
        onClose={() => setShowDocumentDetails(null)}
        onMoveToFolder={handleMoveToFolder}
        onAddTag={handleAddTag}
        onRemoveTag={handleRemoveTag}
      />

      {!documentsLoading && !foldersLoading && filteredDocuments.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-slate-800/50 flex items-center justify-center">
            <Upload className="w-12 h-12 text-slate-400" />
          </div>
          <h3 className="text-xl font-semibold text-slate-300 mb-2">Aucun document trouvé</h3>
          <p className="text-slate-400 mb-4">
            {searchTerm ? 'Aucun document ne correspond à votre recherche.' : 'Commencez par télécharger vos premiers documents.'}
          </p>
          <Button
            onClick={triggerFileUpload}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            <Upload className="w-4 h-4 mr-2" />
            Télécharger des Documents
          </Button>
        </motion.div>
      )}
    </div>
  );
};

export default DocumentsManager;