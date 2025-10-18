/**
 * Servicio de gestión de noticias y comunicados
 */

import localStorageService from './localStorageService';

class NewsManagementService {
  // Gestión de noticias
  async getNews() {
    return localStorageService.getItem('news', []);
  }

  async getNewsById(id) {
    return localStorageService.findInArray('news', item => item.id === id);
  }

  async getPublishedNews() {
    const allNews = await this.getNews();
    return allNews.filter(news => news.published);
  }

  async getFeaturedNews() {
    const allNews = await this.getNews();
    return allNews.filter(news => news.published && news.featured);
  }

  async createNews(newsData) {
    const news = {
      ...newsData,
      published: newsData.published || false,
      featured: newsData.featured || false,
      date: newsData.date || new Date().toISOString()
    };
    const newNews = localStorageService.addToArray('news', news);
    localStorageService.logActivity({ username: 'admin' }, 'CREATE_NEWS', { 
      newsId: newNews.id, 
      title: newNews.title 
    });
    return newNews;
  }

  async updateNews(id, newsData) {
    const updatedNews = localStorageService.updateInArray('news', id, newsData);
    if (updatedNews) {
      localStorageService.logActivity({ username: 'admin' }, 'UPDATE_NEWS', { 
        newsId: id, 
        title: updatedNews.title 
      });
    }
    return updatedNews;
  }

  async deleteNews(id) {
    const news = await this.getNewsById(id);
    const success = localStorageService.removeFromArray('news', id);
    if (success) {
      localStorageService.logActivity({ username: 'admin' }, 'DELETE_NEWS', { 
        newsId: id, 
        title: news?.title 
      });
    }
    return success;
  }

  async toggleNewsStatus(id) {
    const news = await this.getNewsById(id);
    if (news) {
      const updatedNews = localStorageService.updateInArray('news', id, { 
        published: !news.published 
      });
      localStorageService.logActivity({ username: 'admin' }, 'TOGGLE_NEWS_STATUS', { 
        newsId: id, 
        newStatus: updatedNews.published 
      });
      return updatedNews;
    }
    return null;
  }

  async toggleFeaturedStatus(id) {
    const news = await this.getNewsById(id);
    if (news) {
      const updatedNews = localStorageService.updateInArray('news', id, { 
        featured: !news.featured 
      });
      localStorageService.logActivity({ username: 'admin' }, 'TOGGLE_FEATURED_STATUS', { 
        newsId: id, 
        newFeatured: updatedNews.featured 
      });
      return updatedNews;
    }
    return null;
  }

  // Gestión de categorías
  async getCategories() {
    return [
      { id: 'general', name: 'General', color: '#007bff' },
      { id: 'gobierno', name: 'Gobierno', color: '#28a745' },
      { id: 'servicios', name: 'Servicios', color: '#17a2b8' },
      { id: 'eventos', name: 'Eventos', color: '#ffc107' },
      { id: 'emergencias', name: 'Emergencias', color: '#dc3545' },
      { id: 'transparencia', name: 'Transparencia', color: '#6f42c1' },
      { id: 'participacion', name: 'Participación Ciudadana', color: '#fd7e14' }
    ];
  }

  async createCategory(categoryData) {
    const categories = localStorageService.getItem('news_categories', []);
    const newCategory = {
      ...categoryData,
      id: localStorageService.generateId()
    };
    categories.push(newCategory);
    localStorageService.setItem('news_categories', categories);
    return newCategory;
  }

  async updateCategory(id, categoryData) {
    const categories = localStorageService.getItem('news_categories', []);
    const index = categories.findIndex(cat => cat.id === id);
    if (index !== -1) {
      categories[index] = { ...categories[index], ...categoryData };
      localStorageService.setItem('news_categories', categories);
      return categories[index];
    }
    return null;
  }

  async deleteCategory(id) {
    const categories = localStorageService.getItem('news_categories', []);
    const filteredCategories = categories.filter(cat => cat.id !== id);
    localStorageService.setItem('news_categories', filteredCategories);
    return filteredCategories.length !== categories.length;
  }

  // Estadísticas de noticias
  async getNewsStats() {
    const allNews = await this.getNews();
    const categories = await this.getCategories();
    
    const stats = {
      total: allNews.length,
      published: allNews.filter(n => n.published).length,
      draft: allNews.filter(n => !n.published).length,
      featured: allNews.filter(n => n.featured).length,
      byCategory: {}
    };

    categories.forEach(category => {
      const categoryNews = allNews.filter(n => n.category === category.id);
      stats.byCategory[category.name] = {
        total: categoryNews.length,
        published: categoryNews.filter(n => n.published).length,
        draft: categoryNews.filter(n => !n.published).length
      };
    });

    return stats;
  }

  // Búsqueda de noticias
  async searchNews(query) {
    const allNews = await this.getNews();
    const searchTerm = query.toLowerCase();
    
    return allNews.filter(news => 
      news.title?.toLowerCase().includes(searchTerm) ||
      news.excerpt?.toLowerCase().includes(searchTerm) ||
      news.body?.toLowerCase().includes(searchTerm) ||
      news.category?.toLowerCase().includes(searchTerm)
    );
  }

  // Filtros de noticias
  async filterNews(filters = {}) {
    let allNews = await this.getNews();
    
    if (filters.category) {
      allNews = allNews.filter(news => news.category === filters.category);
    }
    
    if (filters.published !== undefined) {
      allNews = allNews.filter(news => news.published === filters.published);
    }
    
    if (filters.featured !== undefined) {
      allNews = allNews.filter(news => news.featured === filters.featured);
    }
    
    if (filters.dateFrom) {
      allNews = allNews.filter(news => new Date(news.date) >= new Date(filters.dateFrom));
    }
    
    if (filters.dateTo) {
      allNews = allNews.filter(news => new Date(news.date) <= new Date(filters.dateTo));
    }
    
    return allNews;
  }

  // Gestión de comunicados
  async getComunicados() {
    return localStorageService.getItem('comunicados', []);
  }

  async createComunicado(comunicadoData) {
    const comunicado = {
      ...comunicadoData,
      type: 'comunicado',
      published: comunicadoData.published || false,
      date: comunicadoData.date || new Date().toISOString()
    };
    const newComunicado = localStorageService.addToArray('comunicados', comunicado);
    localStorageService.logActivity({ username: 'admin' }, 'CREATE_COMUNICADO', { 
      comunicadoId: newComunicado.id, 
      title: newComunicado.title 
    });
    return newComunicado;
  }

  async updateComunicado(id, comunicadoData) {
    const updatedComunicado = localStorageService.updateInArray('comunicados', id, comunicadoData);
    if (updatedComunicado) {
      localStorageService.logActivity({ username: 'admin' }, 'UPDATE_COMUNICADO', { 
        comunicadoId: id, 
        title: updatedComunicado.title 
      });
    }
    return updatedComunicado;
  }

  async deleteComunicado(id) {
    const comunicado = localStorageService.findInArray('comunicados', item => item.id === id);
    const success = localStorageService.removeFromArray('comunicados', id);
    if (success) {
      localStorageService.logActivity({ username: 'admin' }, 'DELETE_COMUNICADO', { 
        comunicadoId: id, 
        title: comunicado?.title 
      });
    }
    return success;
  }
}

export default new NewsManagementService();

