import jsPDF from 'jspdf';
import 'jspdf-autotable';

export const generateProjectPDF = (project, options = {}) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.width;
  const margin = 20;
  
  // Configuration
  const primaryColor = [96, 165, 250]; // Blue
  const secondaryColor = [148, 163, 184]; // Slate
  const textColor = [51, 65, 85]; // Dark slate
  
  let yPosition = margin;
  
  // En-tête avec logo et titre
  doc.setFillColor(...primaryColor);
  doc.rect(0, 0, pageWidth, 40, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text('RAPPORT DE PROJET', margin, 25);
  
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text(`Généré le ${new Date().toLocaleDateString('fr-FR')}`, pageWidth - margin - 60, 25);
  
  yPosition = 60;
  
  // Informations générales du projet
  doc.setTextColor(...textColor);
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('INFORMATIONS GÉNÉRALES', margin, yPosition);
  yPosition += 15;
  
  const projectInfo = [
    ['Nature des travaux', project.nature || 'Non spécifié'],
    ['Description', project.description || 'Aucune description'],
    ['Client', project.client || 'Non spécifié'],
    ['Responsable', project.responsable || 'Non assigné'],
    ['Statut', project.status || 'En attente'],
    ['Date de début', project.dateDebut ? new Date(project.dateDebut).toLocaleDateString('fr-FR') : 'Non définie'],
    ['Date de fin', project.dateFin ? new Date(project.dateFin).toLocaleDateString('fr-FR') : 'Non définie'],
    ['Avancement', `${project.avancement || 0}%`]
  ];
  
  doc.autoTable({
    startY: yPosition,
    head: [['Champ', 'Valeur']],
    body: projectInfo,
    theme: 'grid',
    headStyles: {
      fillColor: primaryColor,
      textColor: [255, 255, 255],
      fontStyle: 'bold'
    },
    bodyStyles: {
      textColor: textColor
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252]
    },
    margin: { left: margin, right: margin }
  });
  
  yPosition = doc.lastAutoTable.finalY + 20;
  
  // Matériaux requis
  if (project.materiaux && project.materiaux.length > 0) {
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('MATÉRIAUX REQUIS', margin, yPosition);
    yPosition += 10;
    
    const materiauxData = project.materiaux.map(materiau => [
      materiau.nom || 'Non spécifié',
      materiau.quantite || '0',
      materiau.unite || 'unité'
    ]);
    
    doc.autoTable({
      startY: yPosition,
      head: [['Matériau', 'Quantité', 'Unité']],
      body: materiauxData,
      theme: 'grid',
      headStyles: {
        fillColor: primaryColor,
        textColor: [255, 255, 255],
        fontStyle: 'bold'
      },
      bodyStyles: {
        textColor: textColor
      },
      alternateRowStyles: {
        fillColor: [248, 250, 252]
      },
      margin: { left: margin, right: margin }
    });
    
    yPosition = doc.lastAutoTable.finalY + 20;
  }
  
  // Suivi d'avancement
  if (project.progressEntries && project.progressEntries.length > 0) {
    // Nouvelle page si nécessaire
    if (yPosition > 200) {
      doc.addPage();
      yPosition = margin;
    }
    
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('SUIVI D\'AVANCEMENT', margin, yPosition);
    yPosition += 10;
    
    const progressData = project.progressEntries.map(entry => [
      new Date(entry.timestamp).toLocaleDateString('fr-FR'),
      entry.description || 'Aucune description',
      entry.responsable || 'Non spécifié',
      entry.statut || 'En cours'
    ]);
    
    doc.autoTable({
      startY: yPosition,
      head: [['Date', 'Description', 'Responsable', 'Statut']],
      body: progressData,
      theme: 'grid',
      headStyles: {
        fillColor: primaryColor,
        textColor: [255, 255, 255],
        fontStyle: 'bold'
      },
      bodyStyles: {
        textColor: textColor,
        fontSize: 10
      },
      alternateRowStyles: {
        fillColor: [248, 250, 252]
      },
      margin: { left: margin, right: margin },
      columnStyles: {
        1: { cellWidth: 80 }
      }
    });
    
    yPosition = doc.lastAutoTable.finalY + 20;
  }
  
  // Pied de page
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(10);
    doc.setTextColor(...secondaryColor);
    doc.text(
      `Page ${i} sur ${pageCount}`,
      pageWidth - margin - 30,
      doc.internal.pageSize.height - 10
    );
    doc.text(
      'Généré par Sositech Go',
      margin,
      doc.internal.pageSize.height - 10
    );
  }
  
  return doc;
};

export const generateMultipleProjectsPDF = (projects) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.width;
  const margin = 20;
  
  // En-tête
  doc.setFillColor(96, 165, 250);
  doc.rect(0, 0, pageWidth, 40, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text('RAPPORT MULTI-PROJETS', margin, 25);
  
  doc.setFontSize(12);
  doc.text(`${projects.length} projet(s) - ${new Date().toLocaleDateString('fr-FR')}`, margin, 35);
  
  let yPosition = 60;
  
  // Résumé des projets
  doc.setTextColor(51, 65, 85);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('RÉSUMÉ DES PROJETS', margin, yPosition);
  yPosition += 15;
  
  const summaryData = projects.map(project => [
    project.nature || 'Non spécifié',
    project.client || 'Non spécifié',
    project.status || 'En attente',
    `${project.avancement || 0}%`,
    project.dateFin ? new Date(project.dateFin).toLocaleDateString('fr-FR') : 'Non définie'
  ]);
  
  doc.autoTable({
    startY: yPosition,
    head: [['Projet', 'Client', 'Statut', 'Avancement', 'Échéance']],
    body: summaryData,
    theme: 'grid',
    headStyles: {
      fillColor: [96, 165, 250],
      textColor: [255, 255, 255],
      fontStyle: 'bold'
    },
    bodyStyles: {
      textColor: [51, 65, 85],
      fontSize: 10
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252]
    },
    margin: { left: margin, right: margin }
  });
  
  // Détails de chaque projet sur des pages séparées
  projects.forEach((project, index) => {
    doc.addPage();
    
    // Générer le PDF pour ce projet et l'ajouter
    const projectDoc = generateProjectPDF(project);
    const projectPages = projectDoc.internal.getNumberOfPages();
    
    for (let i = 1; i <= projectPages; i++) {
      if (i > 1) doc.addPage();
      
      // Copier le contenu de la page du projet
      const pageContent = projectDoc.internal.pages[i];
      doc.internal.pages[doc.internal.getNumberOfPages()] = pageContent;
    }
  });
  
  return doc;
};

export const downloadPDF = (doc, filename) => {
  try {
    doc.save(filename);
    return { success: true };
  } catch (error) {
    console.error('Erreur lors du téléchargement du PDF:', error);
    return { success: false, error: error.message };
  }
};