/**
 * Servicio base para manejo de localStorage
 * Simula una base de datos local para el sistema de gestión
 */

class LocalStorageService {
  constructor() {
    this.prefix = 'gad_pajan_';
  }

  // Métodos genéricos para localStorage
  setItem(key, value) {
    try {
      const serializedValue = JSON.stringify(value);
      localStorage.setItem(this.prefix + key, serializedValue);
      return true;
    } catch (error) {
      console.error('Error guardando en localStorage:', error);
      return false;
    }
  }

  getItem(key, defaultValue = null) {
    try {
      const item = localStorage.getItem(this.prefix + key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error('Error leyendo de localStorage:', error);
      return defaultValue;
    }
  }

  removeItem(key) {
    try {
      localStorage.removeItem(this.prefix + key);
      return true;
    } catch (error) {
      console.error('Error eliminando de localStorage:', error);
      return false;
    }
  }

  clear() {
    try {
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.startsWith(this.prefix)) {
          localStorage.removeItem(key);
        }
      });
      return true;
    } catch (error) {
      console.error('Error limpiando localStorage:', error);
      return false;
    }
  }

  // Métodos específicos para arrays
  addToArray(key, item) {
    const array = this.getItem(key, []);
    const newItem = {
      ...item,
      id: this.generateId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    array.push(newItem);
    this.setItem(key, array);
    return newItem;
  }

  updateInArray(key, id, updates) {
    const array = this.getItem(key, []);
    const index = array.findIndex(item => item.id === id);
    if (index !== -1) {
      array[index] = {
        ...array[index],
        ...updates,
        updatedAt: new Date().toISOString()
      };
      this.setItem(key, array);
      return array[index];
    }
    return null;
  }

  removeFromArray(key, id) {
    const array = this.getItem(key, []);
    const filteredArray = array.filter(item => item.id !== id);
    this.setItem(key, filteredArray);
    return filteredArray.length !== array.length;
  }

  findInArray(key, predicate) {
    const array = this.getItem(key, []);
    return array.find(predicate);
  }

  filterArray(key, predicate) {
    const array = this.getItem(key, []);
    return array.filter(predicate);
  }

  // Generar ID único
  generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  // Inicializar datos por defecto
  initializeDefaultData() {
    // Inicializar usuarios por defecto
    if (!this.getItem('users')) {
      const defaultUsers = [
        {
          id: 'admin_1',
          username: 'admin',
          email: 'admin@gadpajan.gob.ec',
          nombre: 'Administrador Principal',
          roles: ['Superadministrador'],
          active: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: 'comunicacion_1',
          username: 'comunicacion',
          email: 'comunicacion@gadpajan.gob.ec',
          nombre: 'Responsable de Comunicación',
          roles: ['Comunicación'],
          active: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: 'transparencia_1',
          username: 'transparencia',
          email: 'transparencia@gadpajan.gob.ec',
          nombre: 'Responsable de Transparencia',
          roles: ['Transparencia'],
          active: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: 'tic_1',
          username: 'tic',
          email: 'tic@gadpajan.gob.ec',
          nombre: 'Responsable de TIC',
          roles: ['TIC'],
          active: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: 'participacion_1',
          username: 'participacion',
          email: 'participacion@gadpajan.gob.ec',
          nombre: 'Responsable de Participación Ciudadana',
          roles: ['Participación Ciudadana'],
          active: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ];
      this.setItem('users', defaultUsers);
    }

    // Inicializar contenido por defecto
    if (!this.getItem('content')) {
      const defaultContent = [
        {
          id: 'content_1',
          section: 'inicio',
          title: 'Bienvenidos al GAD Municipal de Paján',
          body: '<p>El Gobierno Autónomo Descentralizado Municipal de Paján es una institución comprometida con el desarrollo integral de nuestro cantón.</p>',
          image: '/imagen/inicio.png',
          published: true,
          order: 1,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ];
      this.setItem('content', defaultContent);
    }

    // Inicializar noticias por defecto
    if (!this.getItem('news')) {
      const defaultNews = [
        {
          id: 'news_1',
          title: 'Nueva gestión municipal 2024-2027',
          excerpt: 'El GAD Municipal de Paján inicia una nueva gestión con compromisos claros hacia la comunidad.',
          body: '<p>Contenido completo de la noticia...</p>',
          category: 'General',
          image: '/imagen/logo.png',
          published: true,
          featured: true,
          date: new Date().toISOString(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ];
      this.setItem('news', defaultNews);
    }

    // Inicializar documentos por defecto
    if (!this.getItem('documents')) {
      const defaultDocuments = [
        {
          id: 'doc_1',
          title: 'Plan de Desarrollo y Ordenamiento Territorial 2024-2027',
          content: '<h1>Plan de Desarrollo y Ordenamiento Territorial</h1><p>Contenido del documento...</p>',
          category: 'Planificación',
          section: 'transparencia',
          published: true,
          slug: 'pdot-2024-2027',
          attachments: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ];
      this.setItem('documents', defaultDocuments);
    }

    // Inicializar configuraciones del sistema
    if (!this.getItem('system_config')) {
      const defaultConfig = {
        site_name: 'GAD Municipal de Paján',
        site_description: 'Gobierno Autónomo Descentralizado Municipal de Paján',
        contact_email: 'info@gadpajan.gob.ec',
        contact_phone: '(04) 2XX-XXXX',
        address: 'Av. Principal, Paján',
        social_media: {
          facebook: '',
          twitter: '',
          instagram: '',
          youtube: ''
        },
        maintenance_mode: false,
        allow_registration: false,
        default_language: 'es',
        timezone: 'America/Guayaquil'
      };
      this.setItem('system_config', defaultConfig);
    }

    // Inicializar actividades de auditoría
    if (!this.getItem('audit_logs')) {
      this.setItem('audit_logs', []);
    }
  }

  // Registrar actividad de auditoría
  logActivity(user, action, details = {}) {
    const logs = this.getItem('audit_logs', []);
    const logEntry = {
      id: this.generateId(),
      user: user.username || user.nombre || 'Sistema',
      action,
      details,
      timestamp: new Date().toISOString(),
      ip: '127.0.0.1' // En un entorno real, esto vendría del servidor
    };
    logs.unshift(logEntry);
    
    // Mantener solo los últimos 1000 logs
    if (logs.length > 1000) {
      logs.splice(1000);
    }
    
    this.setItem('audit_logs', logs);
  }
}

// Crear instancia singleton
const localStorageService = new LocalStorageService();

// Inicializar datos por defecto
localStorageService.initializeDefaultData();

export default localStorageService;

