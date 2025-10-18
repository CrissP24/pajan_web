/**
 * Servicio de gestión de contenido dinámico
 */

import localStorageService from './localStorageService';

class ContentManagementService {
  // Gestión de contenido por sección
  async getContentBySection(section) {
    const allContent = localStorageService.getItem('content', []);
    return allContent.filter(item => item.section === section);
  }

  async getAllContent() {
    return localStorageService.getItem('content', []);
  }

  async getContentById(id) {
    return localStorageService.findInArray('content', item => item.id === id);
  }

  async createContent(contentData) {
    const content = {
      ...contentData,
      published: contentData.published || false,
      order: contentData.order || 0
    };
    const newContent = localStorageService.addToArray('content', content);
    localStorageService.logActivity({ username: 'admin' }, 'CREATE_CONTENT', { 
      contentId: newContent.id, 
      section: newContent.section 
    });
    return newContent;
  }

  async updateContent(id, contentData) {
    const updatedContent = localStorageService.updateInArray('content', id, contentData);
    if (updatedContent) {
      localStorageService.logActivity({ username: 'admin' }, 'UPDATE_CONTENT', { 
        contentId: id, 
        section: updatedContent.section 
      });
    }
    return updatedContent;
  }

  async deleteContent(id) {
    const content = await this.getContentById(id);
    const success = localStorageService.removeFromArray('content', id);
    if (success) {
      localStorageService.logActivity({ username: 'admin' }, 'DELETE_CONTENT', { 
        contentId: id, 
        section: content?.section 
      });
    }
    return success;
  }

  async toggleContentStatus(id) {
    const content = await this.getContentById(id);
    if (content) {
      const updatedContent = localStorageService.updateInArray('content', id, { 
        published: !content.published 
      });
      localStorageService.logActivity({ username: 'admin' }, 'TOGGLE_CONTENT_STATUS', { 
        contentId: id, 
        newStatus: updatedContent.published 
      });
      return updatedContent;
    }
    return null;
  }

  async reorderContent(contentIds) {
    const allContent = await this.getAllContent();
    const reorderedContent = contentIds.map((id, index) => {
      const content = allContent.find(c => c.id === id);
      return { ...content, order: index };
    });
    
    localStorageService.setItem('content', reorderedContent);
    localStorageService.logActivity({ username: 'admin' }, 'REORDER_CONTENT', { 
      reorderedIds: contentIds 
    });
    
    return reorderedContent;
  }

  // Gestión de secciones
  async getSections() {
    return [
      { id: 'inicio', name: 'Inicio', description: 'Página principal' },
      { id: 'mision-vision', name: 'Misión y Visión', description: 'Información institucional' },
      { id: 'historia', name: 'Historia', description: 'Historia del municipio' },
      { id: 'organigrama', name: 'Organigrama', description: 'Estructura organizacional' },
      { id: 'autoridades', name: 'Autoridades', description: 'Autoridades municipales' },
      { id: 'servicios', name: 'Servicios', description: 'Servicios municipales' },
      { id: 'tarifas', name: 'Tarifas', description: 'Tarifas y precios' },
      { id: 'presupuesto', name: 'Presupuesto', description: 'Presupuesto municipal' },
      { id: 'convenios-contratos', name: 'Convenios y Contratos', description: 'Contratos públicos' },
      { id: 'informes-gestion', name: 'Informes de Gestión', description: 'Informes anuales' },
      { id: 'reglamentos', name: 'Reglamentos', description: 'Normativa interna' },
      { id: 'rendicion-cuentas', name: 'Rendición de Cuentas', description: 'Rendición de cuentas' },
      { id: 'transparencia', name: 'Transparencia LOTAIP', description: 'Información pública' },
      { id: 'buzon', name: 'Buzón de Sugerencias', description: 'Quejas y sugerencias' },
      { id: 'direccion-mapa', name: 'Dirección y Mapa', description: 'Ubicación y contacto' },
      { id: 'participacion-ciudadana', name: 'Participación Ciudadana', description: 'Participación comunitaria' },
      { id: 'entrega-gas', name: 'Entrega de Gas', description: 'Servicio de gas domiciliario' },
      { id: 'puntos-venta', name: 'Puntos de Venta', description: 'Puntos de venta de gas' },
      { id: 'tipos-cilindros', name: 'Tipos de Cilindros', description: 'Productos disponibles' },
      { id: 'horarios', name: 'Horarios', description: 'Horarios de atención' },
      { id: 'precios-gas', name: 'Precios de Gas', description: 'Tarifas de gas' },
      { id: 'promociones-subsidios', name: 'Promociones y Subsidios', description: 'Promociones especiales' },
      { id: 'encuestas', name: 'Encuestas', description: 'Encuestas ciudadanas' },
      { id: 'canales-atencion', name: 'Canales de Atención', description: 'Canales de comunicación' },
      { id: 'comunicados', name: 'Comunicados', description: 'Comunicados oficiales' },
      { id: 'actividades', name: 'Actividades', description: 'Actividades comunitarias' },
      { id: 'campanas', name: 'Campañas', description: 'Campañas informativas' },
      { id: 'telefonos-correos', name: 'Teléfonos y Correos', description: 'Información de contacto' },
      { id: 'redes-sociales', name: 'Redes Sociales', description: 'Redes sociales oficiales' },
      { id: 'tramites', name: 'Trámites', description: 'Trámites municipales' },
      { id: 'noticias', name: 'Noticias', description: 'Noticias municipales' }
    ];
  }

  // Estadísticas de contenido
  async getContentStats() {
    const allContent = await this.getAllContent();
    const sections = await this.getSections();
    
    const stats = {
      total: allContent.length,
      published: allContent.filter(c => c.published).length,
      draft: allContent.filter(c => !c.published).length,
      bySection: {}
    };

    sections.forEach(section => {
      const sectionContent = allContent.filter(c => c.section === section.id);
      stats.bySection[section.name] = {
        total: sectionContent.length,
        published: sectionContent.filter(c => c.published).length,
        draft: sectionContent.filter(c => !c.published).length
      };
    });

    return stats;
  }

  // Búsqueda de contenido
  async searchContent(query) {
    const allContent = await this.getAllContent();
    const searchTerm = query.toLowerCase();
    
    return allContent.filter(content => 
      content.title?.toLowerCase().includes(searchTerm) ||
      content.body?.toLowerCase().includes(searchTerm) ||
      content.section?.toLowerCase().includes(searchTerm)
    );
  }
}

export default new ContentManagementService();

