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
          password: 'admin123', // En producción esto sería hash
          email: 'admin@gadpajan.gob.ec',
          nombre: 'Administrador Principal',
          apellido: 'Sistema',
          telefono: '(04) 2XX-XXXX',
          roles: ['Superadministrador'],
          active: true,
          lastLogin: null,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: 'comunicacion_1',
          username: 'comunicacion',
          password: 'comunicacion123',
          email: 'comunicacion@gadpajan.gob.ec',
          nombre: 'Responsable de Comunicación',
          apellido: '',
          telefono: '(04) 2XX-XXXX',
          roles: ['Comunicación'],
          active: true,
          lastLogin: null,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: 'transparencia_1',
          username: 'transparencia',
          password: 'transparencia123',
          email: 'transparencia@gadpajan.gob.ec',
          nombre: 'Responsable de Transparencia',
          apellido: '',
          telefono: '(04) 2XX-XXXX',
          roles: ['Transparencia'],
          active: true,
          lastLogin: null,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: 'tic_1',
          username: 'tic',
          password: 'tic123',
          email: 'tic@gadpajan.gob.ec',
          nombre: 'Responsable de TIC',
          apellido: '',
          telefono: '(04) 2XX-XXXX',
          roles: ['TIC'],
          active: true,
          lastLogin: null,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: 'participacion_1',
          username: 'participacion',
          password: 'participacion123',
          email: 'participacion@gadpajan.gob.ec',
          nombre: 'Responsable de Participación Ciudadana',
          apellido: '',
          telefono: '(04) 2XX-XXXX',
          roles: ['Participación Ciudadana'],
          active: true,
          lastLogin: null,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ];
      this.setItem('users', defaultUsers);
    }

    // Inicializar contenido por defecto
    if (!this.getItem('contents')) {
      const defaultContents = [
        {
          id: 'content_1',
          title: 'Bienvenidos al GAD Municipal de Paján',
          slug: 'bienvenidos-gad-municipal-pajan',
          content: '<p>El Gobierno Autónomo Descentralizado Municipal de Paján es una institución comprometida con el desarrollo integral de nuestro cantón. Nuestro compromiso es trabajar de manera transparente, eficiente y participativa para mejorar la calidad de vida de nuestros ciudadanos.</p><p>En esta plataforma digital encontrará información sobre nuestros servicios, procedimientos administrativos, noticias relevantes y datos de transparencia institucional.</p>',
          section: 'inicio',
          type: 'page',
          status: 'published',
          publishedAt: new Date().toISOString(),
          metaTitle: 'GAD Municipal de Paján - Inicio',
          metaDescription: 'Gobierno Autónomo Descentralizado Municipal de Paján. Información institucional, servicios y transparencia.',
          featuredImage: '/images/logo-gad-pajan.png',
          order: 1,
          isPublic: true,
          tags: ['inicio', 'bienvenida', 'institucional'],
          viewCount: 0,
          user_id: 'admin_1',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: 'content_2',
          title: 'Misión y Visión',
          slug: 'mision-vision',
          content: '<h2>Nuestra Misión</h2><p>Brindar servicios públicos de calidad, promover el desarrollo sostenible y fomentar la participación ciudadana para mejorar la calidad de vida de los habitantes del cantón Paján.</p><h2>Nuestra Visión</h2><p>Ser un municipio moderno, eficiente y transparente, líder en desarrollo local sostenible y gestión participativa.</p>',
          section: 'mision-vision',
          type: 'page',
          status: 'published',
          publishedAt: new Date().toISOString(),
          metaTitle: 'Misión y Visión - GAD Municipal de Paján',
          metaDescription: 'Conozca la misión y visión del Gobierno Autónomo Descentralizado Municipal de Paján.',
          featuredImage: null,
          order: 1,
          isPublic: true,
          tags: ['mision', 'vision', 'institucional'],
          viewCount: 0,
          user_id: 'admin_1',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ];
      this.setItem('contents', defaultContents);
    }

    // Inicializar noticias por defecto
    if (!this.getItem('news')) {
      const defaultNews = [
        {
          id: 'news_1',
          title: 'Nueva gestión municipal 2024-2027 inicia con entusiasmo',
          slug: 'nueva-gestion-municipal-2024-2027',
          content: '<p>El Gobierno Autónomo Descentralizado Municipal de Paján inicia una nueva gestión 2024-2027 con compromisos claros hacia la comunidad. Durante este período se priorizarán proyectos de desarrollo urbano, mejoramiento de servicios públicos y fortalecimiento de la participación ciudadana.</p><p>La alcaldesa y su equipo de trabajo han establecido como prioridades principales: la modernización de la infraestructura vial, la implementación de programas de vivienda social, el desarrollo de proyectos ambientales y la digitalización de trámites municipales.</p>',
          excerpt: 'El GAD Municipal de Paján inicia una nueva gestión con compromisos claros hacia la comunidad y proyectos ambiciosos de desarrollo.',
          type: 'noticia',
          category: 'General',
          status: 'published',
          publishedAt: new Date().toISOString(),
          isPublic: true,
          isFeatured: true,
          isBreaking: false,
          featuredImage: '/images/noticias/gestion-2024.jpg',
          gallery: [],
          viewCount: 0,
          tags: ['gestion municipal', '2024', 'desarrollo'],
          priority: 'high',
          expiresAt: null,
          user_id: 'admin_1',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: 'news_2',
          title: 'Campaña de vacunación antirrábica en zonas rurales',
          slug: 'campana-vacunacion-antirrabica-zonas-rurales',
          content: '<p>El GAD Municipal de Paján, en coordinación con el Ministerio de Agricultura y Ganadería, inicia una campaña de vacunación antirrábica gratuita para mascotas en todas las zonas rurales del cantón.</p><p>La campaña se realizará durante los próximos 15 días en los siguientes puntos: Centro de Salud Paján, Subcentros de Salud de las parroquias rurales, y brigadas móviles que visitarán las comunidades más alejadas.</p>',
          excerpt: 'Campaña gratuita de vacunación antirrábica para mascotas en todas las zonas rurales del cantón Paján.',
          type: 'comunicado',
          category: 'Salud',
          status: 'published',
          publishedAt: new Date().toISOString(),
          isPublic: true,
          isFeatured: false,
          isBreaking: false,
          featuredImage: '/images/noticias/vacunacion.jpg',
          gallery: [],
          viewCount: 0,
          tags: ['vacunacion', 'salud', 'mascotas', 'campana'],
          priority: 'medium',
          expiresAt: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(), // 15 días
          user_id: 'comunicacion_1',
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
          slug: 'plan-desarrollo-ordenamiento-territorial-2024-2027',
          content: '<h1>Plan de Desarrollo y Ordenamiento Territorial 2024-2027</h1><h2>Introducción</h2><p>El Plan de Desarrollo y Ordenamiento Territorial (PDOT) 2024-2027 del cantón Paján establece las directrices estratégicas para el desarrollo sostenible del territorio, considerando aspectos ambientales, sociales, económicos y culturales.</p><h2>Objetivos Estratégicos</h2><ul><li>Desarrollo urbano ordenado y sostenible</li><li>Protección del medio ambiente y recursos naturales</li><li>Fortalecimiento de la economía local</li><li>Mejoramiento de la calidad de vida de los ciudadanos</li></ul>',
          description: 'Documento que establece las directrices estratégicas para el desarrollo del cantón Paján en el período 2024-2027.',
          type: 'rendicion_cuenta',
          category: 'Planificación',
          status: 'published',
          publishedAt: new Date().toISOString(),
          isPublic: true,
          isFeatured: true,
          viewCount: 0,
          downloadCount: 0,
          tags: ['plan desarrollo', 'ordenamiento territorial', '2024-2027'],
          metadata: { year: 2024, phase: 'Planificación' },
          year: 2024,
          month: null,
          literal: null,
          order: 1,
          user_id: 'admin_1',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: 'doc_2',
          title: 'Presupuesto Municipal 2024',
          slug: 'presupuesto-municipal-2024',
          content: '<h1>Presupuesto Municipal 2024</h1><h2>Resumen Ejecutivo</h2><p>El presupuesto municipal para el año 2024 asciende a $2.5 millones de dólares, distribuido en las siguientes categorías:</p><ul><li>Administración General: 35%</li><li>Servicios Públicos: 25%</li><li>Desarrollo Urbano: 20%</li><li>Educación y Cultura: 10%</li><li>Salud y Bienestar Social: 10%</li></ul>',
          description: 'Presupuesto municipal aprobado para el ejercicio fiscal 2024.',
          type: 'presupuesto',
          category: 'Financiero',
          status: 'published',
          publishedAt: new Date().toISOString(),
          isPublic: true,
          isFeatured: false,
          viewCount: 0,
          downloadCount: 0,
          tags: ['presupuesto', '2024', 'financiero'],
          metadata: { year: 2024 },
          year: 2024,
          month: null,
          literal: null,
          order: 1,
          user_id: 'transparencia_1',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ];
      this.setItem('documents', defaultDocuments);
    }

    // Inicializar adjuntos por defecto
    if (!this.getItem('attachments')) {
      this.setItem('attachments', []);
    }

    // Inicializar trámites por defecto
    if (!this.getItem('procedures')) {
      const defaultProcedures = [
        {
          id: 'proc_1',
          type: 'certificate',
          title: 'Certificado de Residencia',
          description: 'Documento que acredita la residencia en el cantón de Paján',
          requirements: [
            'Cédula de identidad original y copia',
            'Comprobante de domicilio (recibo de agua, luz o teléfono)',
            'Pago de tasa municipal correspondiente'
          ],
          cost: 5.00,
          processingTime: '2-3 días hábiles',
          responsibleOffice: 'Ventanilla Única',
          published: true,
          order: 1,
          user_id: 'admin_1',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: 'proc_2',
          type: 'license',
          title: 'Licencia de Construcción',
          description: 'Autorización para realizar obras de construcción, ampliación o remodelación',
          requirements: [
            'Plano arquitectónico aprobado',
            'Certificado de propiedad o arrendamiento',
            'Pago de tasas correspondientes',
            'Estudio de impacto ambiental (para obras mayores)'
          ],
          cost: 50.00,
          processingTime: '5-10 días hábiles',
          responsibleOffice: 'Dirección de Planificación Urbana',
          published: true,
          order: 2,
          user_id: 'admin_1',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ];
      this.setItem('procedures', defaultProcedures);
    }

    // Inicializar secciones de presupuesto por defecto
    if (!this.getItem('budget_sections')) {
      const defaultBudgetSections = [
        {
          id: 'budget_section_1',
          title: 'Transparencia Presupuestaria',
          content: 'El GAD Municipal de Paján mantiene un compromiso firme con la transparencia en la gestión de los recursos públicos. Aquí podrá encontrar información detallada sobre nuestro presupuesto anual, ejecución financiera y rendición de cuentas.',
          additionalContent: 'Nuestro presupuesto está diseñado para promover el desarrollo integral del cantón, priorizando las necesidades de la comunidad y garantizando el uso eficiente de los recursos públicos.',
          icon: 'dollar-sign',
          published: true,
          order: 1,
          user_id: 'transparencia_1',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: 'budget_section_2',
          title: 'Ejecución Financiera',
          content: 'Información detallada sobre la ejecución del presupuesto municipal, incluyendo ingresos, gastos y balances financieros.',
          additionalContent: 'Seguimiento mensual de la ejecución presupuestaria y reportes de cumplimiento financiero.',
          icon: 'trending-up',
          published: true,
          order: 2,
          user_id: 'transparencia_1',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ];
      this.setItem('budget_sections', defaultBudgetSections);
    }

    // Inicializar presidentes barriales por defecto
    if (!this.getItem('presidentes_barriales')) {
      const defaultPresidentes = [
        {
          id: 'presidente_1',
          nombre: 'Juan Pérez',
          apellido: 'González',
          cedula: '0101010101',
          telefono: '0987654321',
          email: 'juan.perez@email.com',
          barrio: 'Centro Histórico',
          parroquia: 'Paján',
          estado: 'Activo',
          fecha_designacion: new Date('2024-01-15').toISOString(),
          user_id: 'participacion_1',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ];
      this.setItem('presidentes_barriales', defaultPresidentes);
    }

    // Inicializar configuraciones del sistema
    if (!this.getItem('system_config')) {
      const defaultConfig = {
        site_name: 'GAD Municipal de Paján',
        site_description: 'Gobierno Autónomo Descentralizado Municipal de Paján',
        contact_email: 'info@gadpajan.gob.ec',
        contact_phone: '(04) 2XX-XXXX',
        address: 'Av. Principal, Centro Histórico, Paján',
        social_media: {
          facebook: 'https://facebook.com/gadpajan',
          twitter: 'https://twitter.com/gadpajan',
          instagram: 'https://instagram.com/gadpajan',
          youtube: 'https://youtube.com/gadpajan'
        },
        maintenance_mode: false,
        allow_registration: false,
        default_language: 'es',
        timezone: 'America/Guayaquil',
        logo_url: '/images/logo-gad-pajan.png',
        favicon_url: '/favicon.ico'
      };
      this.setItem('system_config', defaultConfig);
    }

    // Inicializar actividades de auditoría
    if (!this.getItem('audit_logs')) {
      this.setItem('audit_logs', []);
    }

    // Inicializar tokens de sesión
    if (!this.getItem('sessions')) {
      this.setItem('sessions', []);
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

