/**
 * Servicio de gestión de presupuesto basado en localStorage
 */

import localStorageService from './localStorageService';
import authService from './authService';

class BudgetService {

  // Obtener secciones de presupuesto
  async getBudgetSections(options = {}) {
    try {
      let sections = localStorageService.getItem('budget_sections', []);

      // Aplicar filtros
      const { published = true, page = 1, limit = 10 } = options;

      if (published !== undefined) {
        sections = sections.filter(s => s.published === published);
      }

      // Ordenar por orden
      sections.sort((a, b) => a.order - b.order);

      // Paginación
      const total = sections.length;
      const offset = (page - 1) * limit;
      const paginatedSections = sections.slice(offset, offset + limit);

      return {
        success: true,
        data: {
          sections: paginatedSections,
          pagination: {
            total,
            page: parseInt(page),
            limit: parseInt(limit),
            pages: Math.ceil(total / limit)
          }
        }
      };
    } catch (error) {
      console.error('Error obteniendo secciones de presupuesto:', error);
      return {
        success: false,
        error: 'Error interno del servidor'
      };
    }
  }

  // Obtener sección de presupuesto por ID
  async getBudgetSectionById(id) {
    try {
      const sections = localStorageService.getItem('budget_sections', []);
      const section = sections.find(s => s.id === id);

      if (!section) {
        return {
          success: false,
          error: 'Sección de presupuesto no encontrada'
        };
      }

      return {
        success: true,
        data: section
      };
    } catch (error) {
      console.error('Error obteniendo sección de presupuesto:', error);
      return {
        success: false,
        error: 'Error interno del servidor'
      };
    }
  }

  // Crear sección de presupuesto
  async createBudgetSection(sectionData) {
    try {
      const currentUser = authService.getCurrentUser();
      if (!currentUser) {
        return {
          success: false,
          error: 'Usuario no autenticado'
        };
      }

      const sections = localStorageService.getItem('budget_sections', []);

      // Crear nueva sección
      const newSection = {
        id: localStorageService.generateId(),
        title: sectionData.title,
        content: sectionData.content,
        additionalContent: sectionData.additionalContent || '',
        icon: sectionData.icon || 'dollar-sign',
        published: sectionData.published !== undefined ? sectionData.published : true,
        order: sectionData.order || 0,
        user_id: currentUser.id,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      localStorageService.addToArray('budget_sections', newSection);

      // Log de auditoría
      localStorageService.logActivity(currentUser, 'CREATE', {
        entity: 'BudgetSection',
        entityId: newSection.id,
        newValues: newSection,
        description: `Usuario ${currentUser.username} creó la sección de presupuesto "${newSection.title}"`
      });

      return {
        success: true,
        message: 'Sección de presupuesto creada exitosamente',
        data: newSection
      };
    } catch (error) {
      console.error('Error creando sección de presupuesto:', error);
      return {
        success: false,
        error: 'Error interno del servidor'
      };
    }
  }

  // Actualizar sección de presupuesto
  async updateBudgetSection(id, sectionData) {
    try {
      const currentUser = authService.getCurrentUser();
      if (!currentUser) {
        return {
          success: false,
          error: 'Usuario no autenticado'
        };
      }

      const sections = localStorageService.getItem('budget_sections', []);
      const section = sections.find(s => s.id === id);

      if (!section) {
        return {
          success: false,
          error: 'Sección de presupuesto no encontrada'
        };
      }

      const oldValues = { ...section };

      // Preparar datos de actualización
      const updateData = {
        updatedAt: new Date().toISOString()
      };

      if (sectionData.title !== undefined) updateData.title = sectionData.title;
      if (sectionData.content !== undefined) updateData.content = sectionData.content;
      if (sectionData.additionalContent !== undefined) updateData.additionalContent = sectionData.additionalContent;
      if (sectionData.icon !== undefined) updateData.icon = sectionData.icon;
      if (sectionData.published !== undefined) updateData.published = sectionData.published;
      if (sectionData.order !== undefined) updateData.order = sectionData.order;

      const updatedSection = localStorageService.updateInArray('budget_sections', id, updateData);

      // Log de auditoría
      localStorageService.logActivity(currentUser, 'UPDATE', {
        entity: 'BudgetSection',
        entityId: id,
        oldValues,
        newValues: updatedSection,
        description: `Usuario ${currentUser.username} actualizó la sección de presupuesto "${updatedSection.title}"`
      });

      return {
        success: true,
        message: 'Sección de presupuesto actualizada exitosamente',
        data: updatedSection
      };
    } catch (error) {
      console.error('Error actualizando sección de presupuesto:', error);
      return {
        success: false,
        error: 'Error interno del servidor'
      };
    }
  }

  // Eliminar sección de presupuesto
  async deleteBudgetSection(id) {
    try {
      const currentUser = authService.getCurrentUser();
      if (!currentUser) {
        return {
          success: false,
          error: 'Usuario no autenticado'
        };
      }

      const sections = localStorageService.getItem('budget_sections', []);
      const section = sections.find(s => s.id === id);

      if (!section) {
        return {
          success: false,
          error: 'Sección de presupuesto no encontrada'
        };
      }

      const oldValues = { ...section };
      const deleted = localStorageService.removeFromArray('budget_sections', id);

      if (!deleted) {
        return {
          success: false,
          error: 'Error eliminando sección de presupuesto'
        };
      }

      // Log de auditoría
      localStorageService.logActivity(currentUser, 'DELETE', {
        entity: 'BudgetSection',
        entityId: id,
        oldValues,
        description: `Usuario ${currentUser.username} eliminó la sección de presupuesto "${section.title}"`
      });

      return {
        success: true,
        message: 'Sección de presupuesto eliminada exitosamente'
      };
    } catch (error) {
      console.error('Error eliminando sección de presupuesto:', error);
      return {
        success: false,
        error: 'Error interno del servidor'
      };
    }
  }

  // Obtener secciones publicadas (para compatibilidad)
  async getPublishedBudgetSections() {
    const result = await this.getBudgetSections({ published: true });
    return result.success ? result.data.sections : [];
  }

  // Obtener estadísticas de presupuesto
  async getBudgetStats() {
    try {
      const sections = localStorageService.getItem('budget_sections', []);

      const totalSections = sections.length;
      const publishedSections = sections.filter(s => s.published).length;

      return {
        success: true,
        data: {
          totalSections,
          publishedSections
        }
      };
    } catch (error) {
      console.error('Error obteniendo estadísticas de presupuesto:', error);
    return {
        success: false,
        error: 'Error interno del servidor'
      };
    }
  }

  // Crear sección (método de compatibilidad)
  async createBudgetSectionLegacy(sectionData) {
    const result = await this.createBudgetSection(sectionData);
    return result.success ? result.data : null;
  }

  // Actualizar sección (método de compatibilidad)
  async updateBudgetSectionLegacy(id, sectionData) {
    const result = await this.updateBudgetSection(id, sectionData);
    return result.success ? result.data : null;
  }

  // Eliminar sección (método de compatibilidad)
  async deleteBudgetSectionLegacy(id) {
    const result = await this.deleteBudgetSection(id);
    return result.success;
  }

  // Obtener estadísticas (método de compatibilidad)
  async getBudgetStatsLegacy() {
    const result = await this.getBudgetStats();
    return result.success ? result.data : {
      totalSections: 0,
      publishedSections: 0
    };
  }
}

// Crear instancia y exports para compatibilidad
const budgetService = new BudgetService();

// Exports para compatibilidad con código existente
export const getBudgetSections = () => budgetService.getPublishedBudgetSections();
export const getBudgetSectionById = (id) => budgetService.getBudgetSectionById(id).then(r => r.success ? r.data : null);
export const createBudgetSection = (data) => budgetService.createBudgetSectionLegacy(data);
export const updateBudgetSection = (id, data) => budgetService.updateBudgetSectionLegacy(id, data);
export const deleteBudgetSection = (id) => budgetService.deleteBudgetSectionLegacy(id);
export const getBudgetStats = () => budgetService.getBudgetStatsLegacy();

export default budgetService;
