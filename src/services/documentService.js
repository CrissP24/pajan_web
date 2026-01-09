/**
 * Servicio de gestión de documentos basado en localStorage
 */

import localStorageService from './localStorageService';
import authService from './authService';

class DocumentService {
  // Obtener todos los documentos
  async getAllDocuments(params = {}) {
    try {
      const currentUser = authService.getCurrentUser();
      let documents = localStorageService.getItem('documents', []);

      // Aplicar filtros
      const {
        type,
        category,
        status = 'published',
        year,
        page = 1,
        limit = 10,
        search
      } = params;

      // Filtros
      if (type) {
        documents = documents.filter(d => d.type === type);
      }

      if (category) {
        documents = documents.filter(d => d.category === category);
      }

      if (status) {
        documents = documents.filter(d => d.status === status);
      }

      if (year) {
        documents = documents.filter(d => d.year === parseInt(year));
      }

      // Solo mostrar documentos públicos si no está autenticado
      if (!currentUser) {
        documents = documents.filter(d => d.isPublic);
      }

      if (search) {
        const searchTerm = search.toLowerCase();
        documents = documents.filter(d =>
          d.title?.toLowerCase().includes(searchTerm) ||
          d.content?.toLowerCase().includes(searchTerm) ||
          d.description?.toLowerCase().includes(searchTerm)
        );
      }

      // Ordenar por fecha de publicación descendente
      documents.sort((a, b) =>
        new Date(b.publishedAt || b.createdAt) - new Date(a.publishedAt || a.createdAt)
      );

      // Paginación
      const total = documents.length;
      const offset = (page - 1) * limit;
      const paginatedDocuments = documents.slice(offset, offset + limit);

      return {
        success: true,
        data: {
          documents: paginatedDocuments,
          pagination: {
            total,
            page: parseInt(page),
            limit: parseInt(limit),
            pages: Math.ceil(total / limit)
          }
        }
      };
    } catch (error) {
      console.error('Error obteniendo documentos:', error);
      return {
        success: false,
        error: 'Error interno del servidor'
      };
    }
  }

  // Obtener documentos públicos (alias para compatibilidad)
  async getPublicDocuments(params = {}) {
    return this.getAllDocuments({ ...params, status: 'published' });
  }

  // Obtener documentos por tipo
  async getDocumentsByType(type, params = {}) {
    return this.getAllDocuments({ ...params, type });
  }

  // Obtener un documento por ID
  async getDocument(id) {
    try {
      const documents = localStorageService.getItem('documents', []);
      const document = documents.find(d => d.id === id);

      if (!document) {
        return {
          success: false,
          error: 'Documento no encontrado'
        };
      }

      const currentUser = authService.getCurrentUser();

      // Verificar permisos para documentos no públicos
      if (!document.isPublic && !currentUser) {
        return {
          success: false,
          error: 'No tienes permisos para ver este documento'
        };
      }

      // Incrementar contador de vistas
      localStorageService.updateInArray('documents', id, {
        viewCount: (document.viewCount || 0) + 1
      });

      return {
        success: true,
        data: { ...document, viewCount: (document.viewCount || 0) + 1 }
      };
    } catch (error) {
      console.error('Error obteniendo documento:', error);
      return {
        success: false,
        error: 'Error interno del servidor'
      };
    }
  }

  // Obtener un documento público por ID (alias)
  async getPublicDocument(id) {
    return this.getDocument(id);
  }

  // Obtener un documento por slug
  async getDocumentBySlug(slug) {
    try {
      const documents = localStorageService.getItem('documents', []);
      const document = documents.find(d => d.slug === slug);

      if (!document) {
        return {
          success: false,
          error: 'Documento no encontrado'
        };
      }

      const currentUser = authService.getCurrentUser();

      // Verificar permisos para documentos no públicos
      if (!document.isPublic && !currentUser) {
        return {
          success: false,
          error: 'No tienes permisos para ver este documento'
        };
      }

      // Incrementar contador de vistas
      localStorageService.updateInArray('documents', document.id, {
        viewCount: (document.viewCount || 0) + 1
      });

      return {
        success: true,
        data: { ...document, viewCount: (document.viewCount || 0) + 1 }
      };
    } catch (error) {
      console.error('Error obteniendo documento por slug:', error);
      return {
        success: false,
        error: 'Error interno del servidor'
      };
    }
  }

  // Crear un nuevo documento
  async createDocument(documentData) {
    try {
      const currentUser = authService.getCurrentUser();
      if (!currentUser) {
        return {
          success: false,
          error: 'Usuario no autenticado'
        };
      }

      const documents = localStorageService.getItem('documents', []);

      // Generar slug único
      let slug = localStorageService.slugify(documentData.title);
      let counter = 1;
      let originalSlug = slug;

      while (documents.some(d => d.slug === slug)) {
        slug = `${originalSlug}-${counter}`;
        counter++;
      }

      // Crear nuevo documento
      const newDocument = {
        id: localStorageService.generateId(),
        title: documentData.title,
        slug,
        content: documentData.content || '',
        description: documentData.description || '',
        type: documentData.type || 'documento_general',
        category: documentData.category || '',
        status: documentData.status || 'draft',
        publishedAt: documentData.status === 'published' ? new Date().toISOString() : null,
        isPublic: documentData.isPublic !== undefined ? documentData.isPublic : true,
        isFeatured: documentData.isFeatured || false,
        viewCount: 0,
        downloadCount: 0,
        tags: documentData.tags || [],
        metadata: documentData.metadata || {},
        year: documentData.year || null,
        month: documentData.month || null,
        literal: documentData.literal || null,
        phase: documentData.phase || null,
        order: documentData.order || 0,
        user_id: currentUser.id,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      localStorageService.addToArray('documents', newDocument);

      // Log de auditoría
      localStorageService.logActivity(currentUser, 'CREATE', {
        entity: 'Document',
        entityId: newDocument.id,
        newValues: newDocument,
        description: `Usuario ${currentUser.username} creó el documento "${newDocument.title}"`
      });

      return {
        success: true,
        message: 'Documento creado exitosamente',
        data: newDocument
      };
    } catch (error) {
      console.error('Error creando documento:', error);
      return {
        success: false,
        error: 'Error interno del servidor'
      };
    }
  }

  // Actualizar un documento
  async updateDocument(id, documentData) {
    try {
      const currentUser = authService.getCurrentUser();
      if (!currentUser) {
        return {
          success: false,
          error: 'Usuario no autenticado'
        };
      }

      const documents = localStorageService.getItem('documents', []);
      const document = documents.find(d => d.id === id);

      if (!document) {
        return {
          success: false,
          error: 'Documento no encontrado'
        };
      }

      const oldValues = { ...document };

      // Actualizar slug si cambió el título
      let slug = document.slug;
      if (documentData.title && documentData.title !== document.title) {
        slug = localStorageService.slugify(documentData.title);
        let counter = 1;
        let originalSlug = slug;

        while (documents.some(d => d.id !== id && d.slug === slug)) {
          slug = `${originalSlug}-${counter}`;
          counter++;
        }
      }

      // Preparar datos de actualización
      const updateData = {
        updatedAt: new Date().toISOString()
      };

      if (documentData.title !== undefined) updateData.title = documentData.title;
      if (slug !== document.slug) updateData.slug = slug;
      if (documentData.content !== undefined) updateData.content = documentData.content;
      if (documentData.description !== undefined) updateData.description = documentData.description;
      if (documentData.type !== undefined) updateData.type = documentData.type;
      if (documentData.category !== undefined) updateData.category = documentData.category;
      if (documentData.status !== undefined) {
        updateData.status = documentData.status;
        if (documentData.status === 'published' && document.status !== 'published') {
          updateData.publishedAt = new Date().toISOString();
        }
      }
      if (documentData.isPublic !== undefined) updateData.isPublic = documentData.isPublic;
      if (documentData.isFeatured !== undefined) updateData.isFeatured = documentData.isFeatured;
      if (documentData.tags !== undefined) updateData.tags = documentData.tags;
      if (documentData.metadata !== undefined) updateData.metadata = documentData.metadata;
      if (documentData.year !== undefined) updateData.year = documentData.year;
      if (documentData.month !== undefined) updateData.month = documentData.month;
      if (documentData.literal !== undefined) updateData.literal = documentData.literal;
      if (documentData.phase !== undefined) updateData.phase = documentData.phase;
      if (documentData.order !== undefined) updateData.order = documentData.order;

      const updatedDocument = localStorageService.updateInArray('documents', id, updateData);

      // Log de auditoría
      localStorageService.logActivity(currentUser, 'UPDATE', {
        entity: 'Document',
        entityId: id,
        oldValues,
        newValues: updatedDocument,
        description: `Usuario ${currentUser.username} actualizó el documento "${updatedDocument.title}"`
      });

      return {
        success: true,
        message: 'Documento actualizado exitosamente',
        data: updatedDocument
      };
    } catch (error) {
      console.error('Error actualizando documento:', error);
      return {
        success: false,
        error: 'Error interno del servidor'
      };
    }
  }

  // Eliminar un documento
  async deleteDocument(id) {
    try {
      const currentUser = authService.getCurrentUser();
      if (!currentUser) {
        return {
          success: false,
          error: 'Usuario no autenticado'
        };
      }

      const documents = localStorageService.getItem('documents', []);
      const document = documents.find(d => d.id === id);

      if (!document) {
        return {
          success: false,
          error: 'Documento no encontrado'
        };
      }

      const oldValues = { ...document };
      const deleted = localStorageService.removeFromArray('documents', id);

      if (!deleted) {
        return {
          success: false,
          error: 'Error eliminando documento'
        };
      }

      // Log de auditoría
      localStorageService.logActivity(currentUser, 'DELETE', {
        entity: 'Document',
        entityId: id,
        oldValues,
        description: `Usuario ${currentUser.username} eliminó el documento "${document.title}"`
      });

      return {
        success: true,
        message: 'Documento eliminado exitosamente'
      };
    } catch (error) {
      console.error('Error eliminando documento:', error);
      return {
        success: false,
        error: 'Error interno del servidor'
      };
    }
  }

  // Publicar un documento
  async publishDocument(id) {
    return this.updateDocument(id, {
      status: 'published',
      publishedAt: new Date().toISOString()
    });
  }

  // Despublicar un documento
  async unpublishDocument(id) {
    return this.updateDocument(id, {
      status: 'draft',
      publishedAt: null
    });
  }

  // Cambiar estado de publicación
  async togglePublish(id) {
    try {
      const result = await this.getDocument(id);
      if (!result.success) {
        return result;
      }

      const document = result.data;
      const newStatus = document.status === 'published' ? 'draft' : 'published';

      return this.updateDocument(id, {
        status: newStatus,
        publishedAt: newStatus === 'published' ? new Date().toISOString() : null
      });
    } catch (error) {
      console.error('Error cambiando estado de publicación:', error);
      return {
        success: false,
        error: 'Error interno del servidor'
      };
    }
  }

  // Obtener categorías de documentos
  async getCategories() {
    try {
      const documents = localStorageService.getItem('documents', []);
      const categories = [...new Set(documents.map(d => d.category).filter(Boolean))];

      return {
        success: true,
        data: categories
      };
    } catch (error) {
      console.error('Error obteniendo categorías:', error);
      return {
        success: false,
        error: 'Error interno del servidor'
      };
    }
  }

  // Obtener documentos por categoría
  async getDocumentsByCategory(category, params = {}) {
    return this.getAllDocuments({ ...params, category });
  }

  // Buscar documentos
  async searchDocuments(query, params = {}) {
    return this.getAllDocuments({ ...params, search: query });
  }

  // Obtener estadísticas de documentos
  async getDocumentStats() {
    try {
      const documents = localStorageService.getItem('documents', []);

      const total = documents.length;
      const published = documents.filter(d => d.status === 'published').length;
      const draft = documents.filter(d => d.status === 'draft').length;
      const archived = documents.filter(d => d.status === 'archived').length;

      // Estadísticas por tipo
      const byType = {};
      documents.forEach(doc => {
        byType[doc.type] = (byType[doc.type] || 0) + 1;
      });

      // Estadísticas por categoría
      const byCategory = {};
      documents.forEach(doc => {
        if (doc.category) {
          byCategory[doc.category] = (byCategory[doc.category] || 0) + 1;
        }
      });

      return {
        success: true,
        data: {
          total,
          published,
          draft,
          archived,
          byType,
          byCategory
        }
      };
    } catch (error) {
      console.error('Error obteniendo estadísticas:', error);
      return {
        success: false,
        error: 'Error interno del servidor'
      };
    }
  }

  // Obtener documentos por año
  async getDocumentsByYear(year) {
    return this.getAllDocuments({ year });
  }

  // Obtener documentos por año y mes
  async getDocumentsByYearAndMonth(year, month) {
    return this.getAllDocuments({ year, month });
  }

  // Obtener documentos destacados
  async getFeaturedDocuments() {
    return this.getAllDocuments({ isFeatured: true, status: 'published' });
  }

  // Incrementar contador de descargas
  async incrementDownloadCount(id) {
    try {
      const documents = localStorageService.getItem('documents', []);
      const document = documents.find(d => d.id === id);

      if (!document) {
        return {
          success: false,
          error: 'Documento no encontrado'
        };
      }

      const updatedDocument = localStorageService.updateInArray('documents', id, {
        downloadCount: (document.downloadCount || 0) + 1
      });

      return {
        success: true,
        data: updatedDocument
      };
    } catch (error) {
      console.error('Error incrementando contador de descargas:', error);
      return {
        success: false,
        error: 'Error interno del servidor'
      };
    }
  }
}

export default new DocumentService();
