const { sequelize, User, Content, Document, News, PresidenteBarrial, RendicionCuenta, Transparencia } = require('../models');
const bcrypt = require('bcryptjs');
const logger = require('../utils/logger');

async function seed() {
  try {
    logger.info('Iniciando seed de datos iniciales...');

    // Asegurar conexión y sincronizar modelos antes de insertar datos
    console.log('Seed: autenticando conexión...');
    logger.info('Seed: autenticando conexión...');
    await sequelize.authenticate();
    console.log('Seed: autenticado.');
    if (process.env.SKIP_SYNC === 'true') {
      console.log('Seed: SKIP_SYNC=true, saltando sincronización de modelos.');
    } else {
      console.log('Seed: sincronizando modelos...');
      await sequelize.sync({ alter: true });
    }
    logger.info('Conexión verificada y modelos sincronizados para seed.');
    console.log('Conexión verificada y modelos sincronizados para seed.');

    // Crear usuarios por defecto
    const users = [
      {
        username: 'admin',
        email: 'admin@pajan.gob.ec',
        password: await bcrypt.hash('admin123', 12),
        nombre: 'Administrador',
        apellido: 'Sistema',
        roles: ['Superadministrador'],
        active: true
      },
      {
        username: 'tic',
        email: 'tic@pajan.gob.ec',
        password: await bcrypt.hash('tic123', 12),
        nombre: 'TIC',
        apellido: 'Usuario',
        roles: ['TIC'],
        active: true
      },
      {
        username: 'comunicacion',
        email: 'comunicacion@pajan.gob.ec',
        password: await bcrypt.hash('comunicacion123', 12),
        nombre: 'Comunicación',
        apellido: 'Usuario',
        roles: ['Comunicación'],
        active: true
      },
      {
        username: 'participacion',
        email: 'participacion@pajan.gob.ec',
        password: await bcrypt.hash('participacion123', 12),
        nombre: 'Participación',
        apellido: 'Ciudadana',
        roles: ['Participación Ciudadana'],
        active: true
      },
      {
        username: 'transparencia',
        email: 'transparencia@pajan.gob.ec',
        password: await bcrypt.hash('transparencia123', 12),
        nombre: 'Transparencia',
        apellido: 'Usuario',
        roles: ['Transparencia'],
        active: true
      }
    ];

    for (const userData of users) {
      console.log(`Verificando usuario: ${userData.username}`);
      const existingUser = await User.findOne({ where: { username: userData.username } });
      if (!existingUser) {
        await User.create(userData);
        logger.info(`Usuario ${userData.username} creado`);
        console.log(`Usuario ${userData.username} creado`);
      } else {
        console.log(`Usuario ${userData.username} ya existe`);
      }
    }

    // Crear contenido inicial
    const adminUser = await User.findOne({ where: { username: 'admin' } });
    
    const initialContent = [
      {
        title: 'Misión y Visión',
        slug: 'mision-vision',
        content: `
          <h2>Misión</h2>
          <p>El Gobierno Autónomo Descentralizado Municipal de Paján tiene como misión garantizar el desarrollo integral y sostenible del cantón, promoviendo la participación ciudadana, la transparencia en la gestión pública y el mejoramiento de la calidad de vida de sus habitantes.</p>
          
          <h2>Visión</h2>
          <p>Ser un cantón próspero, inclusivo y sostenible, reconocido por su gestión transparente, participativa y eficiente, que promueva el desarrollo económico, social y ambiental para el bienestar de toda la comunidad pajaneña.</p>
        `,
        section: 'institucional',
        type: 'page',
        status: 'published',
        isPublic: true,
        user_id: adminUser.id
      },
      {
        title: 'Historia del Cantón',
        slug: 'historia',
        content: `
          <h2>Historia de Paján</h2>
          <p>Paján es un cantón de la provincia de Manabí, Ecuador, conocido por su rica historia y tradiciones. Fundado oficialmente el 15 de octubre de 1861, el cantón ha crecido y se ha desarrollado manteniendo sus raíces culturales y su identidad manabita.</p>
          
          <h3>Orígenes</h3>
          <p>La historia de Paján se remonta a épocas prehispánicas, cuando las comunidades indígenas habitaron estas tierras fértiles. Con la llegada de los españoles, la región se convirtió en un importante centro agrícola y ganadero.</p>
          
          <h3>Desarrollo</h3>
          <p>A lo largo de los años, Paján ha experimentado un crecimiento constante, desarrollando su infraestructura, servicios públicos y economía local, siempre manteniendo su carácter rural y comunitario.</p>
        `,
        section: 'institucional',
        type: 'page',
        status: 'published',
        isPublic: true,
        user_id: adminUser.id
      },
      {
        title: 'Organigrama Institucional',
        slug: 'organigrama',
        content: `
          <h2>Estructura Organizacional</h2>
          <p>El GAD Municipal de Paján cuenta con una estructura organizacional que garantiza la eficiencia en la prestación de servicios y la gestión municipal.</p>
          
          <h3>Alcaldía</h3>
          <ul>
            <li>Alcalde</li>
            <li>Vicealcalde</li>
            <li>Secretario General</li>
          </ul>
          
          <h3>Direcciones</h3>
          <ul>
            <li>Dirección de Planificación</li>
            <li>Dirección de Obras Públicas</li>
            <li>Dirección de Desarrollo Social</li>
            <li>Dirección de Gestión Ambiental</li>
            <li>Dirección de Gestión Financiera</li>
          </ul>
        `,
        section: 'institucional',
        type: 'page',
        status: 'published',
        isPublic: true,
        user_id: adminUser.id
      }
    ];

    for (const contentData of initialContent) {
      const existingContent = await Content.findOne({ where: { slug: contentData.slug } });
      if (!existingContent) {
        await Content.create(contentData);
        logger.info(`Contenido ${contentData.title} creado`);
        console.log(`Contenido ${contentData.title} creado`);
      } else {
        console.log(`Contenido ${contentData.title} ya existe`);
      }
    }

    // Crear noticias iniciales
    const comunicacionUser = await User.findOne({ where: { username: 'comunicacion' } });
    
    const initialNews = [
      {
        title: 'Bienvenidos al nuevo portal web del GAD Municipal de Paján',
        slug: 'bienvenidos-nuevo-portal-web',
        content: `
          <p>El Gobierno Autónomo Descentralizado Municipal de Paján se complace en presentar su nuevo portal web, diseñado para brindar un mejor servicio a la ciudadanía y promover la transparencia en la gestión pública.</p>
          
          <p>Este nuevo sitio web incluye:</p>
          <ul>
            <li>Información institucional actualizada</li>
            <li>Servicios municipales en línea</li>
            <li>Portal de transparencia</li>
            <li>Noticias y comunicados oficiales</li>
            <li>Participación ciudadana</li>
          </ul>
          
          <p>Invitamos a todos los ciudadanos a explorar las nuevas funcionalidades y mantenerse informados sobre las actividades del municipio.</p>
        `,
        excerpt: 'Presentamos nuestro nuevo portal web con mejoras en servicios y transparencia.',
        type: 'noticia',
        status: 'published',
        isPublic: true,
        isFeatured: true,
        user_id: comunicacionUser.id
      }
    ];

    for (const newsData of initialNews) {
      const existingNews = await News.findOne({ where: { slug: newsData.slug } });
      if (!existingNews) {
        await News.create(newsData);
        logger.info(`Noticia ${newsData.title} creada`);
        console.log(`Noticia ${newsData.title} creada`);
      } else {
        console.log(`Noticia ${newsData.title} ya existe`);
      }
    }

    // Crear presidentes barriales de ejemplo
    const participacionUser = await User.findOne({ where: { username: 'participacion' } });
    
    const initialPresidentes = [
      {
        nombre: 'Juan',
        apellido: 'Pérez',
        cedula: '1234567890',
        telefono: '0987654321',
        email: 'juan.perez@email.com',
        barrio: 'Centro',
        direccion: 'Calle Principal #123',
        fechaInicio: '2024-01-01',
        estado: 'Activo',
        user_id: participacionUser.id
      },
      {
        nombre: 'María',
        apellido: 'González',
        cedula: '0987654321',
        telefono: '0912345678',
        email: 'maria.gonzalez@email.com',
        barrio: 'Norte',
        direccion: 'Av. Norte #456',
        fechaInicio: '2024-01-15',
        estado: 'Activo',
        user_id: participacionUser.id
      }
    ];

    for (const presidenteData of initialPresidentes) {
      const existingPresidente = await PresidenteBarrial.findOne({ where: { cedula: presidenteData.cedula } });
      if (!existingPresidente) {
        await PresidenteBarrial.create(presidenteData);
        logger.info(`Presidente barrial ${presidenteData.nombre} ${presidenteData.apellido} creado`);
      }
    }

    // Crear documentos de rendición de cuentas de ejemplo
    const transparenciaUser = await User.findOne({ where: { username: 'transparencia' } });
    
    const initialRendicion = [
      {
        year: 2024,
        fase: 'FASE_1',
        titulo: 'Matriz de Consulta Ciudadana 2024',
        descripcion: 'Documento que contiene la matriz de consulta ciudadana para el proceso de rendición de cuentas 2024.',
        archivo_url: 'https://ejemplo.com/rendicion/2024/fase1/matriz-consulta.pdf',
        orden: 1,
        status: 'published',
        isPublic: true,
        user_id: transparenciaUser.id
      },
      {
        year: 2024,
        fase: 'FASE_2',
        titulo: 'Informe de Gestión 2024',
        descripcion: 'Informe detallado de la gestión institucional del GAD Municipal de Paján durante el año 2024.',
        archivo_url: 'https://ejemplo.com/rendicion/2024/fase2/informe-gestion.pdf',
        orden: 1,
        status: 'published',
        isPublic: true,
        user_id: transparenciaUser.id
      }
    ];

    for (const rendicionData of initialRendicion) {
      const existingRendicion = await RendicionCuenta.findOne({ 
        where: { 
          year: rendicionData.year, 
          fase: rendicionData.fase, 
          titulo: rendicionData.titulo 
        } 
      });
      if (!existingRendicion) {
        await RendicionCuenta.create(rendicionData);
        logger.info(`Documento de rendición ${rendicionData.titulo} creado`);
      }
    }

    // Crear documentos de transparencia de ejemplo
    const initialTransparencia = [
      {
        year: 2024,
        mes: 'ENERO',
        literal: 'A1',
        titulo: 'Organigrama de la Institución',
        descripcion: 'Organigrama actualizado del GAD Municipal de Paján correspondiente al mes de enero 2024.',
        archivo_url: 'https://ejemplo.com/transparencia/2024/enero/A1-organigrama.pdf',
        orden: 1,
        status: 'published',
        isPublic: true,
        user_id: transparenciaUser.id
      },
      {
        year: 2024,
        mes: 'ENERO',
        literal: 'G',
        titulo: 'Presupuesto de la Institución',
        descripcion: 'Presupuesto institucional del GAD Municipal de Paján para el año 2024.',
        archivo_url: 'https://ejemplo.com/transparencia/2024/enero/G-presupuesto.pdf',
        orden: 2,
        status: 'published',
        isPublic: true,
        user_id: transparenciaUser.id
      }
    ];

    for (const transparenciaData of initialTransparencia) {
      const existingTransparencia = await Transparencia.findOne({ 
        where: { 
          year: transparenciaData.year, 
          mes: transparenciaData.mes, 
          literal: transparenciaData.literal,
          titulo: transparenciaData.titulo
        } 
      });
      if (!existingTransparencia) {
        await Transparencia.create(transparenciaData);
        logger.info(`Documento de transparencia ${transparenciaData.titulo} creado`);
      }
    }

    logger.info('Seed completado exitosamente.');
    process.exit(0);
  } catch (error) {
    logger.error('Error durante el seed:', error);
    process.exit(1);
  }
}

seed();
