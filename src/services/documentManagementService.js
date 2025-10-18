/**
 * Servicio de gestión de documentos y archivos
 */

import localStorageService from './localStorageService';

class DocumentManagementService {
  // Gestión de documentos
  async getDocuments() {
    return localStorageService.getItem('documents', []);
  }

  async getDocumentById(id) {
    return localStorageService.findInArray('documents', item => item.id === id);
  }

  async getDocumentBySlug(slug) {
    return localStorageService.findInArray('documents', item => item.slug === slug);
  }

  async getPublishedDocuments() {
    const allDocuments = await this.getDocuments();
    return allDocuments.filter(doc => doc.published);
  }

  async getDocumentsByCategory(category) {
    const allDocuments = await this.getDocuments();
    return allDocuments.filter(doc => doc.category === category);
  }

  async getDocumentsBySection(section) {
    const allDocuments = await this.getDocuments();
    return allDocuments.filter(doc => doc.section === section);
  }

  async createDocument(documentData) {
    const document = {
      ...documentData,
      published: documentData.published || false,
      slug: documentData.slug || this.generateSlug(documentData.title),
      attachments: documentData.attachments || []
    };
    const newDocument = localStorageService.addToArray('documents', document);
    localStorageService.logActivity({ username: 'admin' }, 'CREATE_DOCUMENT', { 
      documentId: newDocument.id, 
      title: newDocument.title 
    });
    return newDocument;
  }

  async updateDocument(id, documentData) {
    const updatedDocument = localStorageService.updateInArray('documents', id, documentData);
    if (updatedDocument) {
      localStorageService.logActivity({ username: 'admin' }, 'UPDATE_DOCUMENT', { 
        documentId: id, 
        title: updatedDocument.title 
      });
    }
    return updatedDocument;
  }

  async deleteDocument(id) {
    const document = await this.getDocumentById(id);
    const success = localStorageService.removeFromArray('documents', id);
    if (success) {
      localStorageService.logActivity({ username: 'admin' }, 'DELETE_DOCUMENT', { 
        documentId: id, 
        title: document?.title 
      });
    }
    return success;
  }

  async toggleDocumentStatus(id) {
    const document = await this.getDocumentById(id);
    if (document) {
      const updatedDocument = localStorageService.updateInArray('documents', id, { 
        published: !document.published 
      });
      localStorageService.logActivity({ username: 'admin' }, 'TOGGLE_DOCUMENT_STATUS', { 
        documentId: id, 
        newStatus: updatedDocument.published 
      });
      return updatedDocument;
    }
    return null;
  }

  // Gestión de categorías de documentos
  async getDocumentCategories() {
    return [
      { id: 'planificacion', name: 'Planificación', description: 'Planes y programas' },
      { id: 'presupuesto', name: 'Presupuesto', description: 'Presupuestos municipales' },
      { id: 'contratos', name: 'Contratos', description: 'Contratos y convenios' },
      { id: 'informes', name: 'Informes', description: 'Informes de gestión' },
      { id: 'reglamentos', name: 'Reglamentos', description: 'Normativa interna' },
      { id: 'rendicion', name: 'Rendición de Cuentas', description: 'Rendición de cuentas' },
      { id: 'transparencia', name: 'Transparencia', description: 'Información pública' },
      { id: 'participacion', name: 'Participación Ciudadana', description: 'Participación comunitaria' },
      { id: 'servicios', name: 'Servicios', description: 'Servicios municipales' },
      { id: 'emergencias', name: 'Emergencias', description: 'Protocolos de emergencia' }
    ];
  }

  // Gestión de archivos adjuntos
  async addAttachment(documentId, attachmentData) {
    const document = await this.getDocumentById(documentId);
    if (document) {
      const attachment = {
        ...attachmentData,
        id: localStorageService.generateId(),
        uploadedAt: new Date().toISOString()
      };
      
      const updatedDocument = localStorageService.updateInArray('documents', documentId, {
        attachments: [...(document.attachments || []), attachment]
      });
      
      localStorageService.logActivity({ username: 'admin' }, 'ADD_ATTACHMENT', { 
        documentId, 
        attachmentId: attachment.id,
        fileName: attachment.originalName 
      });
      
      return updatedDocument;
    }
    return null;
  }

  async removeAttachment(documentId, attachmentId) {
    const document = await this.getDocumentById(documentId);
    if (document) {
      const updatedAttachments = (document.attachments || []).filter(att => att.id !== attachmentId);
      const updatedDocument = localStorageService.updateInArray('documents', documentId, {
        attachments: updatedAttachments
      });
      
      localStorageService.logActivity({ username: 'admin' }, 'REMOVE_ATTACHMENT', { 
        documentId, 
        attachmentId 
      });
      
      return updatedDocument;
    }
    return null;
  }

  // Gestión de plantillas de documentos
  async getTemplates() {
    return localStorageService.getItem('document_templates', []);
  }

  async createTemplate(templateData) {
    const template = {
      ...templateData,
      isTemplate: true
    };
    const newTemplate = localStorageService.addToArray('document_templates', template);
    localStorageService.logActivity({ username: 'admin' }, 'CREATE_TEMPLATE', { 
      templateId: newTemplate.id, 
      name: newTemplate.name 
    });
    return newTemplate;
  }

  async updateTemplate(id, templateData) {
    const updatedTemplate = localStorageService.updateInArray('document_templates', id, templateData);
    if (updatedTemplate) {
      localStorageService.logActivity({ username: 'admin' }, 'UPDATE_TEMPLATE', { 
        templateId: id, 
        name: updatedTemplate.name 
      });
    }
    return updatedTemplate;
  }

  async deleteTemplate(id) {
    const template = localStorageService.findInArray('document_templates', item => item.id === id);
    const success = localStorageService.removeFromArray('document_templates', id);
    if (success) {
      localStorageService.logActivity({ username: 'admin' }, 'DELETE_TEMPLATE', { 
        templateId: id, 
        name: template?.name 
      });
    }
    return success;
  }

  // Estadísticas de documentos
  async getDocumentStats() {
    const allDocuments = await this.getDocuments();
    const categories = await this.getDocumentCategories();
    
    const stats = {
      total: allDocuments.length,
      published: allDocuments.filter(d => d.published).length,
      draft: allDocuments.filter(d => !d.published).length,
      withAttachments: allDocuments.filter(d => d.attachments && d.attachments.length > 0).length,
      byCategory: {}
    };

    categories.forEach(category => {
      const categoryDocs = allDocuments.filter(d => d.category === category.id);
      stats.byCategory[category.name] = {
        total: categoryDocs.length,
        published: categoryDocs.filter(d => d.published).length,
        draft: categoryDocs.filter(d => !d.published).length
      };
    });

    return stats;
  }

  // Búsqueda de documentos
  async searchDocuments(query) {
    const allDocuments = await this.getDocuments();
    const searchTerm = query.toLowerCase();
    
    return allDocuments.filter(document => 
      document.title?.toLowerCase().includes(searchTerm) ||
      document.content?.toLowerCase().includes(searchTerm) ||
      document.category?.toLowerCase().includes(searchTerm) ||
      document.section?.toLowerCase().includes(searchTerm)
    );
  }

  // Filtros de documentos
  async filterDocuments(filters = {}) {
    let allDocuments = await this.getDocuments();
    
    if (filters.category) {
      allDocuments = allDocuments.filter(doc => doc.category === filters.category);
    }
    
    if (filters.section) {
      allDocuments = allDocuments.filter(doc => doc.section === filters.section);
    }
    
    if (filters.published !== undefined) {
      allDocuments = allDocuments.filter(doc => doc.published === filters.published);
    }
    
    if (filters.dateFrom) {
      allDocuments = allDocuments.filter(doc => new Date(doc.createdAt) >= new Date(filters.dateFrom));
    }
    
    if (filters.dateTo) {
      allDocuments = allDocuments.filter(doc => new Date(doc.createdAt) <= new Date(filters.dateTo));
    }
    
    return allDocuments;
  }

  // Generar slug único
  generateSlug(title) {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim('-');
  }

  // Verificar si el slug es único
  async isSlugUnique(slug, excludeId = null) {
    const allDocuments = await this.getDocuments();
    return !allDocuments.some(doc => doc.slug === slug && doc.id !== excludeId);
  }
}

export default new DocumentManagementService();

