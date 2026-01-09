/**
 * Servicio de gestión de contenido basado en localStorage
 */

import localStorageService from './localStorageService';
import authService from './authService';

class ContentService {
  // Obtener contenido por sección
  async getContentBySection(section) {
    try {
      const contents = localStorageService.getItem('contents', []);

      // Filtrar por sección y contenido público
      const filteredContents = contents.filter(content =>
        content.section === section &&
        content.status === 'published' &&
        content.isPublic
      );

      // Ordenar por orden y fecha de publicación
      filteredContents.sort((a, b) => {
        if (a.order !== b.order) {
          return a.order - b.order;
        }
        return new Date(b.publishedAt || b.createdAt) - new Date(a.publishedAt || a.createdAt);
      });

      return {
        success: true,
        data: filteredContents
      };
    } catch (error) {
      console.error('Error obteniendo contenido por sección:', error);
      return {
        success: false,
        error: 'Error interno del servidor'
      };
    }
  }

  // Obtener todo el contenido
  async getAllContent(options = {}) {
    try {
      const currentUser = authService.getCurrentUser();
      let contents = localStorageService.getItem('contents', []);

      // Aplicar filtros
      const {
        section,
        type,
        status = 'published',
        page = 1,
        limit = 10,
        search
      } = options;

      // Filtros
      if (section) {
        contents = contents.filter(c => c.section === section);
      }

      if (type) {
        contents = contents.filter(c => c.type === type);
      }

      if (status) {
        contents = contents.filter(c => c.status === status);
      }

      // Solo mostrar contenido público si no está autenticado
      if (!currentUser) {
        contents = contents.filter(c => c.isPublic);
      }

      if (search) {
        const searchTerm = search.toLowerCase();
        contents = contents.filter(c =>
          c.title?.toLowerCase().includes(searchTerm) ||
          c.content?.toLowerCase().includes(searchTerm)
        );
      }

      // Ordenar por fecha de publicación descendente
      contents.sort((a, b) =>
        new Date(b.publishedAt || b.createdAt) - new Date(a.publishedAt || a.createdAt)
      );

      // Paginación
      const total = contents.length;
      const offset = (page - 1) * limit;
      const paginatedContents = contents.slice(offset, offset + limit);

      return {
        success: true,
        data: {
          contents: paginatedContents,
          pagination: {
            total,
            page: parseInt(page),
            limit: parseInt(limit),
            pages: Math.ceil(total / limit)
          }
        }
      };
    } catch (error) {
      console.error('Error obteniendo contenido:', error);
      return {
        success: false,
        error: 'Error interno del servidor'
      };
    }
  }

  // Obtener contenido por ID
  async getContentById(id) {
    try {
      const contents = localStorageService.getItem('contents', []);
      const content = contents.find(c => c.id === id);

      if (!content) {
        return {
          success: false,
          error: 'Contenido no encontrado'
        };
      }

      const currentUser = authService.getCurrentUser();

      // Verificar permisos para contenido no público
      if (!content.isPublic && !currentUser) {
        return {
          success: false,
          error: 'No tienes permisos para ver este contenido'
        };
      }

      // Incrementar contador de vistas
      localStorageService.updateInArray('contents', id, {
        viewCount: (content.viewCount || 0) + 1
      });

      return {
        success: true,
        data: { ...content, viewCount: (content.viewCount || 0) + 1 }
      };
    } catch (error) {
      console.error('Error obteniendo contenido:', error);
      return {
        success: false,
        error: 'Error interno del servidor'
      };
    }
  }

  // Obtener contenido por slug
  async getContentBySlug(slug) {
    try {
      const contents = localStorageService.getItem('contents', []);
      const content = contents.find(c => c.slug === slug);

      if (!content) {
        return {
          success: false,
          error: 'Contenido no encontrado'
        };
      }

      const currentUser = authService.getCurrentUser();

      // Verificar permisos para contenido no público
      if (!content.isPublic && !currentUser) {
        return {
          success: false,
          error: 'No tienes permisos para ver este contenido'
        };
      }

      // Incrementar contador de vistas
      localStorageService.updateInArray('contents', slug, {
        viewCount: (content.viewCount || 0) + 1
      }, 'slug');

      return {
        success: true,
        data: { ...content, viewCount: (content.viewCount || 0) + 1 }
      };
    } catch (error) {
      console.error('Error obteniendo contenido por slug:', error);
      return {
        success: false,
        error: 'Error interno del servidor'
      };
    }
  }

  // Crear contenido
  async createContent(contentData) {
    try {
      const currentUser = authService.getCurrentUser();
      if (!currentUser) {
        return {
          success: false,
          error: 'Usuario no autenticado'
        };
      }

      const contents = localStorageService.getItem('contents', []);

      // Generar slug único
      let slug = localStorageService.slugify(contentData.title);
      let counter = 1;
      let originalSlug = slug;

      while (contents.some(c => c.slug === slug)) {
        slug = `${originalSlug}-${counter}`;
        counter++;
      }

      // Crear nuevo contenido
      const newContent = {
        id: localStorageService.generateId(),
        title: contentData.title,
        slug,
        content: contentData.content,
        section: contentData.section,
        type: contentData.type || 'page',
        status: contentData.status || 'draft',
        publishedAt: contentData.status === 'published' ? new Date().toISOString() : null,
        metaTitle: contentData.metaTitle,
        metaDescription: contentData.metaDescription,
        featuredImage: contentData.featuredImage,
        order: contentData.order || 0,
        isPublic: contentData.isPublic !== undefined ? contentData.isPublic : true,
        tags: contentData.tags || [],
        customFields: contentData.customFields || {},
        viewCount: 0,
        user_id: currentUser.id,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      localStorageService.addToArray('contents', newContent);

      // Log de auditoría
      localStorageService.logActivity(currentUser, 'CREATE', {
        entity: 'Content',
        entityId: newContent.id,
        newValues: newContent,
        description: `Usuario ${currentUser.username} creó el contenido "${newContent.title}"`
      });

      return {
        success: true,
        message: 'Contenido creado exitosamente',
        data: newContent
      };
    } catch (error) {
      console.error('Error creando contenido:', error);
      return {
        success: false,
        error: 'Error interno del servidor'
      };
    }
  }

  // Actualizar contenido
  async updateContent(id, contentData) {
    try {
      const currentUser = authService.getCurrentUser();
      if (!currentUser) {
        return {
          success: false,
          error: 'Usuario no autenticado'
        };
      }

      const contents = localStorageService.getItem('contents', []);
      const content = contents.find(c => c.id === id);

      if (!content) {
        return {
          success: false,
          error: 'Contenido no encontrado'
        };
      }

      const oldValues = { ...content };

      // Actualizar slug si cambió el título
      let slug = content.slug;
      if (contentData.title && contentData.title !== content.title) {
        slug = localStorageService.slugify(contentData.title);
        let counter = 1;
        let originalSlug = slug;

        while (contents.some(c => c.id !== id && c.slug === slug)) {
          slug = `${originalSlug}-${counter}`;
          counter++;
        }
      }

      // Preparar datos de actualización
      const updateData = {
        updatedAt: new Date().toISOString()
      };

      if (contentData.title !== undefined) updateData.title = contentData.title;
      if (slug !== content.slug) updateData.slug = slug;
      if (contentData.content !== undefined) updateData.content = contentData.content;
      if (contentData.section !== undefined) updateData.section = contentData.section;
      if (contentData.type !== undefined) updateData.type = contentData.type;
      if (contentData.status !== undefined) {
        updateData.status = contentData.status;
        if (contentData.status === 'published' && content.status !== 'published') {
          updateData.publishedAt = new Date().toISOString();
        }
      }
      if (contentData.metaTitle !== undefined) updateData.metaTitle = contentData.metaTitle;
      if (contentData.metaDescription !== undefined) updateData.metaDescription = contentData.metaDescription;
      if (contentData.featuredImage !== undefined) updateData.featuredImage = contentData.featuredImage;
      if (contentData.order !== undefined) updateData.order = contentData.order;
      if (contentData.isPublic !== undefined) updateData.isPublic = contentData.isPublic;
      if (contentData.tags !== undefined) updateData.tags = contentData.tags;
      if (contentData.customFields !== undefined) updateData.customFields = contentData.customFields;

      const updatedContent = localStorageService.updateInArray('contents', id, updateData);

      // Log de auditoría
      localStorageService.logActivity(currentUser, 'UPDATE', {
        entity: 'Content',
        entityId: id,
        oldValues,
        newValues: updatedContent,
        description: `Usuario ${currentUser.username} actualizó el contenido "${updatedContent.title}"`
      });

      return {
        success: true,
        message: 'Contenido actualizado exitosamente',
        data: updatedContent
      };
    } catch (error) {
      console.error('Error actualizando contenido:', error);
      return {
        success: false,
        error: 'Error interno del servidor'
      };
    }
  }

  // Eliminar contenido
  async deleteContent(id) {
    try {
      const currentUser = authService.getCurrentUser();
      if (!currentUser) {
        return {
          success: false,
          error: 'Usuario no autenticado'
        };
      }

      const contents = localStorageService.getItem('contents', []);
      const content = contents.find(c => c.id === id);

      if (!content) {
        return {
          success: false,
          error: 'Contenido no encontrado'
        };
      }

      const oldValues = { ...content };
      const deleted = localStorageService.removeFromArray('contents', id);

      if (!deleted) {
        return {
          success: false,
          error: 'Error eliminando contenido'
        };
      }

      // Log de auditoría
      localStorageService.logActivity(currentUser, 'DELETE', {
        entity: 'Content',
        entityId: id,
        oldValues,
        description: `Usuario ${currentUser.username} eliminó el contenido "${content.title}"`
      });

      return {
        success: true,
        message: 'Contenido eliminado exitosamente'
      };
    } catch (error) {
      console.error('Error eliminando contenido:', error);
      return {
        success: false,
        error: 'Error interno del servidor'
      };
    }
  }

  // Publicar contenido
  async publishContent(id) {
    try {
      return this.updateContent(id, {
        status: 'published',
        publishedAt: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error publicando contenido:', error);
      return {
        success: false,
        error: 'Error interno del servidor'
      };
    }
  }

  // Despublicar contenido
  async unpublishContent(id) {
    try {
      return this.updateContent(id, {
        status: 'draft',
        publishedAt: null
      });
    } catch (error) {
      console.error('Error despublicando contenido:', error);
      return {
        success: false,
        error: 'Error interno del servidor'
      };
    }
  }

  // Obtener secciones disponibles
  async getSections() {
    try {
      // Secciones predefinidas del sistema
      const sections = [
        'inicio',
        'mision-vision',
        'organigrama',
        'autoridades',
        'servicios',
        'presupuesto',
        'transparencia',
        'participacion-ciudadana',
        'noticias',
        'contacto'
      ];

      return {
        success: true,
        data: sections
      };
    } catch (error) {
      console.error('Error obteniendo secciones:', error);
      return {
        success: false,
        error: 'Error interno del servidor'
      };
    }
  }

  // Buscar contenido
  async searchContent(query) {
    try {
      const contents = localStorageService.getItem('contents', []);
      const currentUser = authService.getCurrentUser();

      const filteredContents = contents.filter(content => {
        // Solo contenido público si no está autenticado
        if (!currentUser && !content.isPublic) {
          return false;
        }

        // Solo contenido publicado
        if (content.status !== 'published') {
          return false;
        }

        // Búsqueda en título y contenido
        const searchTerm = query.toLowerCase();
        return (
          content.title?.toLowerCase().includes(searchTerm) ||
          content.content?.toLowerCase().includes(searchTerm) ||
          content.metaDescription?.toLowerCase().includes(searchTerm)
        );
      });

      // Ordenar por relevancia (título primero, luego contenido)
      filteredContents.sort((a, b) => {
        const aTitle = a.title?.toLowerCase().includes(query.toLowerCase()) ? 1 : 0;
        const bTitle = b.title?.toLowerCase().includes(query.toLowerCase()) ? 1 : 0;

        if (aTitle !== bTitle) {
          return bTitle - aTitle;
        }

        return new Date(b.publishedAt || b.createdAt) - new Date(a.publishedAt || a.createdAt);
      });

      return {
        success: true,
        data: filteredContents
      };
    } catch (error) {
      console.error('Error buscando contenido:', error);
      return {
        success: false,
        error: 'Error interno del servidor'
      };
    }
  }

  // Obtener estadísticas de contenido
  async getContentStats() {
    try {
      const contents = localStorageService.getItem('contents', []);

      const total = contents.length;
      const published = contents.filter(c => c.status === 'published').length;
      const draft = contents.filter(c => c.status === 'draft').length;
      const archived = contents.filter(c => c.status === 'archived').length;

      return {
        success: true,
        data: {
          total,
          published,
          draft,
          archived
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
}

export default new ContentService(); 