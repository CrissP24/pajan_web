/**
 * Servicio de gestión de documentos y archivos (compatibilidad con API existente)
 */

import documentService from './documentService';
import localStorageService from './localStorageService';

class DocumentManagementService {
  // Gestión de documentos
  async getDocuments(params = {}) {
    const result = await documentService.getAllDocuments({ ...params, status: 'published' });
    return result && result.success ? result.data.documents : [];
  }

  async getDocumentById(id) {
    const result = await documentService.getDocument(id);
    return result && result.success ? result.data : null;
  }

  async getDocumentBySlug(slug) {
    const result = await documentService.getDocumentBySlug(slug);
    return result && result.success ? result.data : null;
  }

  async getPublishedDocuments() {
    return this.getDocuments({ status: 'published' });
  }

  async getDocumentsByCategory(category) {
    const result = await documentService.getAllDocuments({ category, status: 'published' });
    return result && result.success ? result.data.documents : [];
  }

  async getDocumentsBySection(section) {
    const result = await documentService.getAllDocuments({ status: 'published' });
    return result && result.success ? result.data.documents.filter(doc => doc.type === section) : [];
  }

  async createDocument(documentData) {
    const adaptedData = {
      title: documentData.title,
      content: documentData.content || documentData.body || '',
      description: documentData.description || '',
      type: documentData.type || 'documento_general',
      category: documentData.category || '',
      status: documentData.published ? 'published' : 'draft',
      isPublic: documentData.isPublic !== undefined ? documentData.isPublic : true,
      tags: documentData.tags || [],
      year: documentData.year,
      month: documentData.month,
      literal: documentData.literal,
      phase: documentData.phase,
      order: documentData.order || 0
    };

    const result = await documentService.createDocument(adaptedData);
    return result && result.success ? result.data : null;
  }

  async updateDocument(id, documentData) {
    const adaptedData = {};

    if (documentData.title !== undefined) adaptedData.title = documentData.title;
    if (documentData.content !== undefined) adaptedData.content = documentData.content;
    if (documentData.body !== undefined) adaptedData.content = documentData.body;
    if (documentData.description !== undefined) adaptedData.description = documentData.description;
    if (documentData.type !== undefined) adaptedData.type = documentData.type;
    if (documentData.category !== undefined) adaptedData.category = documentData.category;
    if (documentData.published !== undefined) {
      adaptedData.status = documentData.published ? 'published' : 'draft';
      if (documentData.published) adaptedData.publishedAt = new Date().toISOString();
    }
    if (documentData.isPublic !== undefined) adaptedData.isPublic = documentData.isPublic;
    if (documentData.tags !== undefined) adaptedData.tags = documentData.tags;
    if (documentData.year !== undefined) adaptedData.year = documentData.year;
    if (documentData.month !== undefined) adaptedData.month = documentData.month;
    if (documentData.literal !== undefined) adaptedData.literal = documentData.literal;
    if (documentData.phase !== undefined) adaptedData.phase = documentData.phase;
    if (documentData.order !== undefined) adaptedData.order = documentData.order;

    const result = await documentService.updateDocument(id, adaptedData);
    return result && result.success ? result.data : null;
  }

  async deleteDocument(id) {
    const result = await documentService.deleteDocument(id);
    return result && result.success;
  }

  async toggleDocumentStatus(id) {
    const document = await this.getDocumentById(id);
    if (!document) return null;
    const newStatus = document.status === 'published' ? 'draft' : 'published';
    const result = await documentService.updateDocument(id, {
      status: newStatus,
      publishedAt: newStatus === 'published' ? new Date().toISOString() : null
    });
    return result && result.success ? result.data : null;
  }

  // Gestión de categorías
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

  // Adjuntos: compatibilidad (delegar a attachmentService en caso de existir)
  async addAttachment(documentId, attachmentData) {
    return this.getDocumentById(documentId);
  }

  async removeAttachment(documentId, attachmentId) {
    return this.getDocumentById(documentId);
  }

  // Plantillas usando localStorageService para compatibilidad
  async getTemplates() {
    return localStorageService.getItem('document_templates', []);
  }

  async createTemplate(templateData) {
    const template = { ...templateData, isTemplate: true };
    const newTemplate = localStorageService.addToArray('document_templates', template);
    localStorageService.logActivity({ username: 'admin' }, 'CREATE_TEMPLATE', { templateId: newTemplate.id, name: newTemplate.name });
    return newTemplate;
  }

  async updateTemplate(id, templateData) {
    const updatedTemplate = localStorageService.updateInArray('document_templates', id, templateData);
    if (updatedTemplate) localStorageService.logActivity({ username: 'admin' }, 'UPDATE_TEMPLATE', { templateId: id, name: updatedTemplate.name });
    return updatedTemplate;
  }

  async deleteTemplate(id) {
    const template = localStorageService.findInArray('document_templates', item => item.id === id);
    const success = localStorageService.removeFromArray('document_templates', id);
    if (success) localStorageService.logActivity({ username: 'admin' }, 'DELETE_TEMPLATE', { templateId: id, name: template?.name });
    return success;
  }

  // Estadísticas
  async getDocumentStats() {
    const result = await documentService.getDocumentStats();
    if (result && result.success) return result.data;
    // fallback
    return { total: 0, published: 0, draft: 0, archived: 0 };
  }

  // Búsqueda y filtros
  async searchDocuments(query) {
    const allDocuments = await this.getDocuments();
    const searchTerm = (query || '').toLowerCase();
    return allDocuments.filter(doc => (doc.title || '').toLowerCase().includes(searchTerm) || (doc.content || '').toLowerCase().includes(searchTerm) || (doc.category || '').toLowerCase().includes(searchTerm) || (doc.section || '').toLowerCase().includes(searchTerm));
  }

  async filterDocuments(filters = {}) {
    let allDocuments = await this.getDocuments();
    if (filters.category) allDocuments = allDocuments.filter(d => d.category === filters.category);
    if (filters.section) allDocuments = allDocuments.filter(d => d.section === filters.section);
    if (filters.published !== undefined) allDocuments = allDocuments.filter(d => d.published === filters.published);
    if (filters.dateFrom) allDocuments = allDocuments.filter(doc => new Date(doc.createdAt) >= new Date(filters.dateFrom));
    if (filters.dateTo) allDocuments = allDocuments.filter(doc => new Date(doc.createdAt) <= new Date(filters.dateTo));
    return allDocuments;
  }

  // Slug helpers
  generateSlug(title) {
    return (title || '')
      .toLowerCase()
      .replace(/[^a-z0-9\\s-]/g, '')
      .replace(/\\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  }

  async isSlugUnique(slug, excludeId = null) {
    const allDocuments = await this.getDocuments();
    return !allDocuments.some(doc => doc.slug === slug && doc.id !== excludeId);
  }
}

export default new DocumentManagementService();

