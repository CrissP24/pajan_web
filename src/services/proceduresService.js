/**
 * Servicio de gestión de trámites basado en localStorage
 */

import localStorageService from './localStorageService';
import authService from './authService';

class ProceduresService {
  // Obtener todos los trámites
  async getProcedures(options = {}) {
    try {
      let procedures = localStorageService.getItem('procedures', []);

      // Aplicar filtros
      const {
        type,
        category,
        published = true,
        page = 1,
        limit = 10,
        search
      } = options;

      if (type) {
        procedures = procedures.filter(p => p.type === type);
      }

      if (category) {
        procedures = procedures.filter(p => p.category === category);
      }

      if (published !== undefined) {
        procedures = procedures.filter(p => p.published === published);
      }

      if (search) {
        const searchTerm = search.toLowerCase();
        procedures = procedures.filter(p =>
          p.title?.toLowerCase().includes(searchTerm) ||
          p.description?.toLowerCase().includes(searchTerm)
        );
      }

      // Ordenar por orden y fecha de creación
      procedures.sort((a, b) => {
        if (a.order !== b.order) {
          return a.order - b.order;
        }
        return new Date(b.createdAt) - new Date(a.createdAt);
      });

      // Paginación
      const total = procedures.length;
      const offset = (page - 1) * limit;
      const paginatedProcedures = procedures.slice(offset, offset + limit);

      return {
        success: true,
        data: {
          procedures: paginatedProcedures,
          pagination: {
            total,
            page: parseInt(page),
            limit: parseInt(limit),
            pages: Math.ceil(total / limit)
          }
        }
      };
    } catch (error) {
      console.error('Error obteniendo trámites:', error);
      return {
        success: false,
        error: 'Error interno del servidor'
      };
    }
  }

  // Obtener trámite por ID
  async getProcedureById(id) {
    try {
      const procedures = localStorageService.getItem('procedures', []);
      const procedure = procedures.find(p => p.id === id);

      if (!procedure) {
        return {
          success: false,
          error: 'Trámite no encontrado'
        };
      }

      return {
        success: true,
        data: procedure
      };
    } catch (error) {
      console.error('Error obteniendo trámite:', error);
      return {
        success: false,
        error: 'Error interno del servidor'
      };
    }
  }

  // Crear nuevo trámite
  async createProcedure(procedureData) {
    try {
      const currentUser = authService.getCurrentUser();
      if (!currentUser) {
        return {
          success: false,
          error: 'Usuario no autenticado'
        };
      }

      const procedures = localStorageService.getItem('procedures', []);

      // Crear nuevo trámite
    const newProcedure = { 
        id: localStorageService.generateId(),
        type: procedureData.type || 'certificate',
        title: procedureData.title,
        description: procedureData.description || '',
        requirements: procedureData.requirements || [],
        cost: procedureData.cost || 0,
        processingTime: procedureData.processingTime || '',
        responsibleOffice: procedureData.responsibleOffice || '',
        published: procedureData.published !== undefined ? procedureData.published : true,
        order: procedureData.order || 0,
        user_id: currentUser.id,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      localStorageService.addToArray('procedures', newProcedure);

      // Log de auditoría
      localStorageService.logActivity(currentUser, 'CREATE', {
        entity: 'Procedure',
        entityId: newProcedure.id,
        newValues: newProcedure,
        description: `Usuario ${currentUser.username} creó el trámite "${newProcedure.title}"`
      });

      return {
        success: true,
        message: 'Trámite creado exitosamente',
        data: newProcedure
      };
    } catch (error) {
      console.error('Error creando trámite:', error);
      return {
        success: false,
        error: 'Error interno del servidor'
      };
    }
  }

  // Actualizar trámite
  async updateProcedure(id, procedureData) {
    try {
      const currentUser = authService.getCurrentUser();
      if (!currentUser) {
        return {
          success: false,
          error: 'Usuario no autenticado'
        };
      }

      const procedures = localStorageService.getItem('procedures', []);
      const procedure = procedures.find(p => p.id === id);

      if (!procedure) {
    return {
          success: false,
          error: 'Trámite no encontrado'
        };
      }

      const oldValues = { ...procedure };

      // Preparar datos de actualización
      const updateData = {
        updatedAt: new Date().toISOString()
      };

      if (procedureData.type !== undefined) updateData.type = procedureData.type;
      if (procedureData.title !== undefined) updateData.title = procedureData.title;
      if (procedureData.description !== undefined) updateData.description = procedureData.description;
      if (procedureData.requirements !== undefined) updateData.requirements = procedureData.requirements;
      if (procedureData.cost !== undefined) updateData.cost = procedureData.cost;
      if (procedureData.processingTime !== undefined) updateData.processingTime = procedureData.processingTime;
      if (procedureData.responsibleOffice !== undefined) updateData.responsibleOffice = procedureData.responsibleOffice;
      if (procedureData.published !== undefined) updateData.published = procedureData.published;
      if (procedureData.order !== undefined) updateData.order = procedureData.order;

      const updatedProcedure = localStorageService.updateInArray('procedures', id, updateData);

      // Log de auditoría
      localStorageService.logActivity(currentUser, 'UPDATE', {
        entity: 'Procedure',
        entityId: id,
        oldValues,
        newValues: updatedProcedure,
        description: `Usuario ${currentUser.username} actualizó el trámite "${updatedProcedure.title}"`
      });

      return {
        success: true,
        message: 'Trámite actualizado exitosamente',
        data: updatedProcedure
      };
    } catch (error) {
      console.error('Error actualizando trámite:', error);
      return {
        success: false,
        error: 'Error interno del servidor'
      };
    }
  }

  // Eliminar trámite
  async deleteProcedure(id) {
    try {
      const currentUser = authService.getCurrentUser();
      if (!currentUser) {
        return {
          success: false,
          error: 'Usuario no autenticado'
        };
      }

      const procedures = localStorageService.getItem('procedures', []);
      const procedure = procedures.find(p => p.id === id);

      if (!procedure) {
        return {
          success: false,
          error: 'Trámite no encontrado'
        };
      }

      const oldValues = { ...procedure };
      const deleted = localStorageService.removeFromArray('procedures', id);

      if (!deleted) {
        return {
          success: false,
          error: 'Error eliminando trámite'
        };
      }

      // Log de auditoría
      localStorageService.logActivity(currentUser, 'DELETE', {
        entity: 'Procedure',
        entityId: id,
        oldValues,
        description: `Usuario ${currentUser.username} eliminó el trámite "${procedure.title}"`
      });

      return {
        success: true,
        message: 'Trámite eliminado exitosamente'
      };
    } catch (error) {
      console.error('Error eliminando trámite:', error);
      return {
        success: false,
        error: 'Error interno del servidor'
      };
    }
  }

  // Cambiar estado de publicación
  async toggleProcedureStatus(id) {
    try {
      const procedures = localStorageService.getItem('procedures', []);
      const procedure = procedures.find(p => p.id === id);

      if (!procedure) {
        return {
          success: false,
          error: 'Trámite no encontrado'
        };
      }

      const newStatus = procedure.published ? false : true;
      const result = await this.updateProcedure(id, { published: newStatus });

      return result;
    } catch (error) {
      console.error('Error cambiando estado del trámite:', error);
      return {
        success: false,
        error: 'Error interno del servidor'
      };
    }
  }

  // Obtener trámites por tipo
  async getProceduresByType(type, options = {}) {
    return this.getProcedures({ ...options, type });
  }

  // Obtener trámites por categoría
  async getProceduresByCategory(category, options = {}) {
    return this.getProcedures({ ...options, category });
  }

  // Buscar trámites
  async searchProcedures(query, options = {}) {
    return this.getProcedures({ ...options, search: query });
  }

  // Obtener estadísticas de trámites
  async getProceduresStats() {
    try {
      const procedures = localStorageService.getItem('procedures', []);

      const total = procedures.length;
      const published = procedures.filter(p => p.published).length;
      const certificates = procedures.filter(p => p.type === 'certificate' && p.published).length;
      const licenses = procedures.filter(p => p.type === 'license' && p.published).length;
      const payments = procedures.filter(p => p.type === 'payment' && p.published).length;

      return {
        success: true,
        data: {
          total,
          published,
          certificates,
          licenses,
          payments
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

  // Obtener trámites publicados (para compatibilidad)
  async getPublishedProcedures() {
    const result = await this.getProcedures({ published: true });
    return result.success ? result.data.procedures : [];
  }

  // Crear trámite (método de compatibilidad)
  async createProcedureLegacy(procedureData) {
    const result = await this.createProcedure({
      type: procedureData.type,
      title: procedureData.title,
      description: procedureData.description,
      requirements: procedureData.requirements || [],
      cost: procedureData.cost || 0,
      processingTime: procedureData.duration || procedureData.processingTime,
      responsibleOffice: procedureData.responsibleOffice || '',
      published: procedureData.published !== undefined ? procedureData.published : true,
      order: procedureData.order || 0
    });
    return result.success ? result.data : null;
  }

  // Actualizar trámite (método de compatibilidad)
  async updateProcedureLegacy(id, procedureData) {
    const result = await this.updateProcedure(id, {
      type: procedureData.type,
      title: procedureData.title,
      description: procedureData.description,
      requirements: procedureData.requirements,
      cost: procedureData.cost,
      processingTime: procedureData.duration || procedureData.processingTime,
      responsibleOffice: procedureData.responsibleOffice,
      published: procedureData.published !== undefined ? procedureData.published : procedureData.active,
      order: procedureData.order
    });
    return result.success ? result.data : null;
  }

  // Eliminar trámite (método de compatibilidad)
  async deleteProcedureLegacy(id) {
    const result = await this.deleteProcedure(id);
    return result.success;
  }

  // Cambiar estado (método de compatibilidad)
  async toggleProcedureStatusLegacy(id) {
    const result = await this.toggleProcedureStatus(id);
    return result.success ? result.data : null;
  }

  // Obtener estadísticas (método de compatibilidad)
  async getProceduresStatsLegacy() {
    const result = await this.getProceduresStats();
    return result.success ? result.data : {
      total: 0,
      active: 0,
      certificates: 0,
      payments: 0
    };
  }
}

// Crear instancia y exports para compatibilidad
const proceduresService = new ProceduresService();

// Exports para compatibilidad con código existente
export const getProcedures = () => proceduresService.getPublishedProcedures();
export const getProceduresByType = (type) => proceduresService.getProceduresByType(type).then(r => r.success ? r.data.procedures : []);
export const getProceduresByCategory = (category) => proceduresService.getProceduresByCategory(category).then(r => r.success ? r.data.procedures : []);
export const getProcedureById = (id) => proceduresService.getProcedureById(id).then(r => r.success ? r.data : null);
export const createProcedure = (data) => proceduresService.createProcedureLegacy(data);
export const updateProcedure = (id, data) => proceduresService.updateProcedureLegacy(id, data);
export const deleteProcedure = (id) => proceduresService.deleteProcedureLegacy(id);
export const toggleProcedureStatus = (id) => proceduresService.toggleProcedureStatusLegacy(id);
export const getProceduresStats = () => proceduresService.getProceduresStatsLegacy();

export default proceduresService;
