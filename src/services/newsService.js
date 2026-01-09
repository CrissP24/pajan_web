/**
 * Servicio de gestión de noticias basado en localStorage
 */

import localStorageService from './localStorageService';
import authService from './authService';

class NewsService {
  // Obtener todas las noticias
  async getNews(params = {}) {
    try {
      const currentUser = authService.getCurrentUser();
      let news = localStorageService.getItem('news', []);

      // Aplicar filtros
      const {
        type,
        category,
        status = 'published',
        featured,
        breaking,
        page = 1,
        limit = 10,
        search
      } = params;

      // Filtros
      if (type) {
        news = news.filter(n => n.type === type);
      }

      if (category) {
        news = news.filter(n => n.category === category);
      }

      if (status) {
        news = news.filter(n => n.status === status);
      }

      if (featured !== undefined) {
        news = news.filter(n => n.isFeatured === (featured === 'true' || featured === true));
      }

      if (breaking !== undefined) {
        news = news.filter(n => n.isBreaking === (breaking === 'true' || breaking === true));
      }

      // Solo mostrar noticias públicas si no está autenticado
      if (!currentUser) {
        news = news.filter(n => n.isPublic);
      }

      if (search) {
        const searchTerm = search.toLowerCase();
        news = news.filter(n =>
          n.title?.toLowerCase().includes(searchTerm) ||
          n.content?.toLowerCase().includes(searchTerm) ||
          n.excerpt?.toLowerCase().includes(searchTerm)
        );
      }

      // Ordenar por fecha de publicación descendente
      news.sort((a, b) =>
        new Date(b.publishedAt || b.createdAt) - new Date(a.publishedAt || a.createdAt)
      );

      // Paginación
      const total = news.length;
      const offset = (page - 1) * limit;
      const paginatedNews = news.slice(offset, offset + limit);

      return {
        success: true,
        data: {
          news: paginatedNews,
          pagination: {
            total,
            page: parseInt(page),
            limit: parseInt(limit),
            pages: Math.ceil(total / limit)
          }
        }
      };
    } catch (error) {
      console.error('Error obteniendo noticias:', error);
      return {
        success: false,
        error: 'Error interno del servidor'
      };
    }
  }

  // Obtener noticia por ID
  async getNewsById(id) {
    try {
      const news = localStorageService.getItem('news', []);
      const newsItem = news.find(n => n.id === id);

      if (!newsItem) {
        return {
          success: false,
          error: 'Noticia no encontrada'
        };
      }

      const currentUser = authService.getCurrentUser();

      // Verificar permisos para noticias no públicas
      if (!newsItem.isPublic && !currentUser) {
        return {
          success: false,
          error: 'No tienes permisos para ver esta noticia'
        };
      }

      // Incrementar contador de vistas
      localStorageService.updateInArray('news', id, {
        viewCount: (newsItem.viewCount || 0) + 1
      });

      return {
        success: true,
        data: { ...newsItem, viewCount: (newsItem.viewCount || 0) + 1 }
      };
    } catch (error) {
      console.error('Error obteniendo noticia:', error);
      return {
        success: false,
        error: 'Error interno del servidor'
      };
    }
  }

  // Obtener noticia por slug
  async getNewsBySlug(slug) {
    try {
      const news = localStorageService.getItem('news', []);
      const newsItem = news.find(n => n.slug === slug);

      if (!newsItem) {
        return {
          success: false,
          error: 'Noticia no encontrada'
        };
      }

      const currentUser = authService.getCurrentUser();

      // Verificar permisos para noticias no públicas
      if (!newsItem.isPublic && !currentUser) {
        return {
          success: false,
          error: 'No tienes permisos para ver esta noticia'
        };
      }

      // Incrementar contador de vistas
      localStorageService.updateInArray('news', newsItem.id, {
        viewCount: (newsItem.viewCount || 0) + 1
      });

      return {
        success: true,
        data: { ...newsItem, viewCount: (newsItem.viewCount || 0) + 1 }
      };
    } catch (error) {
      console.error('Error obteniendo noticia por slug:', error);
      return {
        success: false,
        error: 'Error interno del servidor'
      };
    }
  }

  // Crear nueva noticia
  async createNews(newsData) {
    try {
      const currentUser = authService.getCurrentUser();
      if (!currentUser) {
        return {
          success: false,
          error: 'Usuario no autenticado'
        };
      }

      const news = localStorageService.getItem('news', []);

      // Generar slug único
      let slug = localStorageService.slugify(newsData.title);
      let counter = 1;
      let originalSlug = slug;

      while (news.some(n => n.slug === slug)) {
        slug = `${originalSlug}-${counter}`;
        counter++;
      }

      // Crear nueva noticia
      const newNews = {
        id: localStorageService.generateId(),
        title: newsData.title,
        slug,
        content: newsData.content,
        excerpt: newsData.excerpt || '',
        type: newsData.type || 'noticia',
        category: newsData.category || '',
        status: newsData.status || 'draft',
        publishedAt: newsData.status === 'published' ? new Date().toISOString() : null,
        isPublic: newsData.isPublic !== undefined ? newsData.isPublic : true,
        isFeatured: newsData.isFeatured || false,
        isBreaking: newsData.isBreaking || false,
        featuredImage: newsData.featuredImage || null,
        gallery: newsData.gallery || [],
        viewCount: 0,
        tags: newsData.tags || [],
        metadata: newsData.metadata || {},
        priority: newsData.priority || 'medium',
        expiresAt: newsData.expiresAt || null,
        eventDate: newsData.eventDate || null,
        eventLocation: newsData.eventLocation || null,
        user_id: currentUser.id,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      localStorageService.addToArray('news', newNews);

      // Log de auditoría
      localStorageService.logActivity(currentUser, 'CREATE', {
        entity: 'News',
        entityId: newNews.id,
        newValues: newNews,
        description: `Usuario ${currentUser.username} creó la noticia "${newNews.title}"`
      });

      return {
        success: true,
        message: 'Noticia creada exitosamente',
        data: newNews
      };
    } catch (error) {
      console.error('Error creando noticia:', error);
      return {
        success: false,
        error: 'Error interno del servidor'
      };
    }
  }

  // Actualizar noticia
  async updateNews(id, newsData) {
    try {
      const currentUser = authService.getCurrentUser();
      if (!currentUser) {
        return {
          success: false,
          error: 'Usuario no autenticado'
        };
      }

      const news = localStorageService.getItem('news', []);
      const newsItem = news.find(n => n.id === id);

      if (!newsItem) {
        return {
          success: false,
          error: 'Noticia no encontrada'
        };
      }

      const oldValues = { ...newsItem };

      // Actualizar slug si cambió el título
      let slug = newsItem.slug;
      if (newsData.title && newsData.title !== newsItem.title) {
        slug = localStorageService.slugify(newsData.title);
        let counter = 1;
        let originalSlug = slug;

        while (news.some(n => n.id !== id && n.slug === slug)) {
          slug = `${originalSlug}-${counter}`;
          counter++;
        }
      }

      // Preparar datos de actualización
      const updateData = {
        updatedAt: new Date().toISOString()
      };

      if (newsData.title !== undefined) updateData.title = newsData.title;
      if (slug !== newsItem.slug) updateData.slug = slug;
      if (newsData.content !== undefined) updateData.content = newsData.content;
      if (newsData.excerpt !== undefined) updateData.excerpt = newsData.excerpt;
      if (newsData.type !== undefined) updateData.type = newsData.type;
      if (newsData.category !== undefined) updateData.category = newsData.category;
      if (newsData.status !== undefined) {
        updateData.status = newsData.status;
        if (newsData.status === 'published' && newsItem.status !== 'published') {
          updateData.publishedAt = new Date().toISOString();
        }
      }
      if (newsData.isPublic !== undefined) updateData.isPublic = newsData.isPublic;
      if (newsData.isFeatured !== undefined) updateData.isFeatured = newsData.isFeatured;
      if (newsData.isBreaking !== undefined) updateData.isBreaking = newsData.isBreaking;
      if (newsData.featuredImage !== undefined) updateData.featuredImage = newsData.featuredImage;
      if (newsData.gallery !== undefined) updateData.gallery = newsData.gallery;
      if (newsData.tags !== undefined) updateData.tags = newsData.tags;
      if (newsData.metadata !== undefined) updateData.metadata = newsData.metadata;
      if (newsData.priority !== undefined) updateData.priority = newsData.priority;
      if (newsData.expiresAt !== undefined) updateData.expiresAt = newsData.expiresAt;
      if (newsData.eventDate !== undefined) updateData.eventDate = newsData.eventDate;
      if (newsData.eventLocation !== undefined) updateData.eventLocation = newsData.eventLocation;

      const updatedNews = localStorageService.updateInArray('news', id, updateData);

      // Log de auditoría
      localStorageService.logActivity(currentUser, 'UPDATE', {
        entity: 'News',
        entityId: id,
        oldValues,
        newValues: updatedNews,
        description: `Usuario ${currentUser.username} actualizó la noticia "${updatedNews.title}"`
      });

      return {
        success: true,
        message: 'Noticia actualizada exitosamente',
        data: updatedNews
      };
    } catch (error) {
      console.error('Error actualizando noticia:', error);
      return {
        success: false,
        error: 'Error interno del servidor'
      };
    }
  }

  // Eliminar noticia
  async deleteNews(id) {
    try {
      const currentUser = authService.getCurrentUser();
      if (!currentUser) {
        return {
          success: false,
          error: 'Usuario no autenticado'
        };
      }

      const news = localStorageService.getItem('news', []);
      const newsItem = news.find(n => n.id === id);

      if (!newsItem) {
        return {
          success: false,
          error: 'Noticia no encontrada'
        };
      }

      const oldValues = { ...newsItem };
      const deleted = localStorageService.removeFromArray('news', id);

      if (!deleted) {
        return {
          success: false,
          error: 'Error eliminando noticia'
        };
      }

      // Log de auditoría
      localStorageService.logActivity(currentUser, 'DELETE', {
        entity: 'News',
        entityId: id,
        oldValues,
        description: `Usuario ${currentUser.username} eliminó la noticia "${newsItem.title}"`
      });

      return {
        success: true,
        message: 'Noticia eliminada exitosamente'
      };
    } catch (error) {
      console.error('Error eliminando noticia:', error);
      return {
        success: false,
        error: 'Error interno del servidor'
      };
    }
  }

  // Publicar noticia
  async publishNews(id) {
    return this.updateNews(id, {
      status: 'published',
      publishedAt: new Date().toISOString()
    });
  }

  // Obtener noticias destacadas
  async getFeaturedNews() {
    return this.getNews({ featured: true, status: 'published' });
  }

  // Obtener noticias por tipo
  async getNewsByType(type, params = {}) {
    return this.getNews({ ...params, type });
  }

  // Obtener noticias destacadas (método alternativo)
  async getPublishedNews(params = {}) {
    return this.getNews({ ...params, status: 'published' });
  }

  // Buscar noticias
  async searchNews(query, params = {}) {
    return this.getNews({ ...params, search: query });
  }

  // Obtener estadísticas de noticias
  async getNewsStats() {
    try {
      const news = localStorageService.getItem('news', []);

      const total = news.length;
      const published = news.filter(n => n.status === 'published').length;
      const draft = news.filter(n => n.status === 'draft').length;
      const archived = news.filter(n => n.status === 'archived').length;
      const featured = news.filter(n => n.isFeatured).length;
      const breaking = news.filter(n => n.isBreaking).length;

      // Estadísticas por tipo
      const byType = {};
      news.forEach(item => {
        byType[item.type] = (byType[item.type] || 0) + 1;
      });

      // Estadísticas por categoría
      const byCategory = {};
      news.forEach(item => {
        if (item.category) {
          byCategory[item.category] = (byCategory[item.category] || 0) + 1;
        }
      });

      return {
        success: true,
        data: {
          total,
          published,
          draft,
          archived,
          featured,
          breaking,
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

  // Obtener noticias por prioridad
  async getNewsByPriority(priority) {
    return this.getNews({ priority, status: 'published' });
  }

  // Obtener eventos próximos
  async getUpcomingEvents() {
    try {
      const news = localStorageService.getItem('news', []);
      const currentUser = authService.getCurrentUser();

      let events = news.filter(n =>
        n.type === 'evento' &&
        n.status === 'published' &&
        n.eventDate &&
        new Date(n.eventDate) >= new Date()
      );

      // Solo mostrar eventos públicos si no está autenticado
      if (!currentUser) {
        events = events.filter(e => e.isPublic);
      }

      // Ordenar por fecha de evento
      events.sort((a, b) => new Date(a.eventDate) - new Date(b.eventDate));

      return {
        success: true,
        data: events
      };
    } catch (error) {
      console.error('Error obteniendo eventos próximos:', error);
      return {
        success: false,
        error: 'Error interno del servidor'
      };
    }
  }

  // Cambiar estado de publicación
  async togglePublish(id) {
    try {
      const result = await this.getNewsById(id);
      if (!result.success) {
        return result;
      }

      const newsItem = result.data;
      const newStatus = newsItem.status === 'published' ? 'draft' : 'published';

      return this.updateNews(id, {
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
}

// Cambiar exports para mantener compatibilidad
const newsService = new NewsService();

export const getNews = (params = {}) => newsService.getNews(params);
export const getNewsById = (id) => newsService.getNewsById(id);
export const getNewsBySlug = (slug) => newsService.getNewsBySlug(slug);
export const createNews = (data) => newsService.createNews(data);
export const updateNews = (id, data) => newsService.updateNews(id, data);
export const deleteNews = (id) => newsService.deleteNews(id);
export const publishNews = (id) => newsService.publishNews(id);
export const getFeaturedNews = () => newsService.getFeaturedNews();
export const getPublishedNews = (params = {}) => newsService.getPublishedNews(params);

export default newsService;

export const getBreakingNews = () =>
  axios.get(`${API_URL}/api/news/breaking/list`, {
    headers: getAuthHeaders()
  });

export const getUpcomingEvents = () =>
  axios.get(`${API_URL}/api/news/events/upcoming`, {
    headers: getAuthHeaders()
  });

export const searchNews = (query, params = {}) =>
  axios.get(`${API_URL}/api/news`, {
    params: { search: query, ...params },
    headers: getAuthHeaders()
  }); 