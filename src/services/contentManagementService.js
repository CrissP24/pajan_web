/**
 * Servicio de gestión de contenido dinámico (compatibilidad con API existente)
 */

import contentService from './contentService';

class ContentManagementService {
  // Gestión de contenido por sección
  async getContentBySection(section) {
    const result = await contentService.getContentBySection(section);
    return result.success ? result.data : [];
  }

  async getAllContent() {
    const result = await contentService.getAllContent({ status: 'all' });
    return result.success ? result.data.contents : [];
  }

  async getContentById(id) {
    const result = await contentService.getContentById(id);
    return result.success ? result.data : null;
  }

  async createContent(contentData) {
    // Adaptar formato de datos para compatibilidad
    const adaptedData = {
      title: contentData.title || contentData.name || 'Sin título',
      content: contentData.body || contentData.content || '',
      section: contentData.section,
      type: contentData.type || 'page',
      status: contentData.published ? 'published' : 'draft',
      publishedAt: contentData.published ? new Date().toISOString() : null,
      order: contentData.order || 0,
      isPublic: contentData.isPublic !== undefined ? contentData.isPublic : true,
      tags: contentData.tags || [],
      metaTitle: contentData.metaTitle,
      metaDescription: contentData.metaDescription,
      featuredImage: contentData.image || contentData.featuredImage
    };

    const result = await contentService.createContent(adaptedData);
    return result.success ? result.data : null;
  }

  async updateContent(id, contentData) {
    // Adaptar formato de datos para compatibilidad
    const adaptedData = {};

    if (contentData.title !== undefined) adaptedData.title = contentData.title;
    if (contentData.body !== undefined) adaptedData.content = contentData.body;
    if (contentData.content !== undefined) adaptedData.content = contentData.content;
    if (contentData.section !== undefined) adaptedData.section = contentData.section;
    if (contentData.type !== undefined) adaptedData.type = contentData.type;
    if (contentData.published !== undefined) {
      adaptedData.status = contentData.published ? 'published' : 'draft';
      if (contentData.published) {
        adaptedData.publishedAt = new Date().toISOString();
      }
    }
    if (contentData.order !== undefined) adaptedData.order = contentData.order;
    if (contentData.isPublic !== undefined) adaptedData.isPublic = contentData.isPublic;
    if (contentData.tags !== undefined) adaptedData.tags = contentData.tags;
    if (contentData.metaTitle !== undefined) adaptedData.metaTitle = contentData.metaTitle;
    if (contentData.metaDescription !== undefined) adaptedData.metaDescription = contentData.metaDescription;
    if (contentData.image !== undefined) adaptedData.featuredImage = contentData.image;
    if (contentData.featuredImage !== undefined) adaptedData.featuredImage = contentData.featuredImage;

    const result = await contentService.updateContent(id, adaptedData);
    return result.success ? result.data : null;
  }

  async deleteContent(id) {
    const result = await contentService.deleteContent(id);
    return result.success;
  }

  async toggleContentStatus(id) {
    const content = await this.getContentById(id);
    if (content) {
      const newStatus = content.status === 'published' ? 'draft' : 'published';
      const result = await contentService.updateContent(id, {
        status: newStatus,
        publishedAt: newStatus === 'published' ? new Date().toISOString() : null
      });
      return result.success ? result.data : null;
    }
    return null;
  }

  async reorderContent(contentIds) {
    // Esta función necesita ser implementada en contentService
    // Por ahora, devolver los IDs ordenados
    return contentIds;
  }

  // Gestión de secciones
  async getSections() {
    const result = await contentService.getSections();
    if (result.success) {
      return result.data.map(section => ({
        id: section,
        name: section.charAt(0).toUpperCase() + section.slice(1).replace(/-/g, ' '),
        description: `Sección ${section}`
      }));
    }
    return [];
  }

  // Estadísticas de contenido
  async getContentStats() {
    const result = await contentService.getContentStats();
    if (result.success) {
      return result.data;
    }
    return {
      total: 0,
      published: 0,
      draft: 0,
      archived: 0
    };
  }

  // Búsqueda de contenido
  async searchContent(query) {
    const result = await contentService.searchContent(query);
    if (result.success) {
      return result.data;
    }
    return [];
  }
}

export default new ContentManagementService();

