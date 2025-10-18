# Sistema de Gestión Municipal - GAD Paján

Sistema completo de gestión municipal desarrollado con React.js, Express.js y PostgreSQL para el Gobierno Autónomo Descentralizado Municipal de Paján.

## 🚀 Características Principales

### Frontend (React.js)
- **Dashboard Administrativo** con roles especializados
- **Gestión de Contenido** dinámico y administrable
- **Sistema de Noticias** y comunicados
- **Gestión de Presidentes Barriales**
- **Rendición de Cuentas** y transparencia (LOTAIP)
- **Sistema de Archivos** adjuntos
- **Panel de Accesibilidad** y multiidioma
- **Diseño Responsivo** y moderno

### Backend (Express.js + PostgreSQL)
- **API RESTful** completa
- **Autenticación JWT** con roles y permisos
- **Base de datos PostgreSQL** con Sequelize ORM
- **Sistema de archivos** con subida y gestión
- **Logs de auditoría** completos
- **Dashboards especializados** por rol
- **Validación de datos** robusta
- **Manejo de errores** centralizado

## 🏗️ Arquitectura del Sistema

### Roles de Usuario
- **Superadministrador**: Acceso completo al sistema
- **TIC**: Gestión de contenido y páginas web
- **Comunicación**: Gestión de noticias y comunicados
- **Participación Ciudadana**: Gestión de actividades y presidentes barriales
- **Transparencia**: Gestión de rendición de cuentas y documentos LOTAIP

### Módulos Principales
1. **Gestión de Contenido**: Páginas dinámicas y secciones
2. **Sistema de Noticias**: Noticias, comunicados, eventos
3. **Presidentes Barriales**: Gestión de líderes comunitarios
4. **Rendición de Cuentas**: Documentos por fases y años
5. **Transparencia**: Documentos LOTAIP por literales
6. **Gestión de Archivos**: Subida y organización de documentos
7. **Administración**: Usuarios, estadísticas, logs

## 🛠️ Tecnologías Utilizadas

### Frontend
- **React 18** - Framework principal
- **React Router** - Navegación
- **Bootstrap 5** - Framework CSS
- **Axios** - Cliente HTTP
- **React Icons** - Iconografía
- **Vite** - Build tool

### Backend
- **Node.js** - Runtime
- **Express.js** - Framework web
- **PostgreSQL** - Base de datos
- **Sequelize** - ORM
- **JWT** - Autenticación
- **Multer** - Subida de archivos
- **Winston** - Logging
- **Bcrypt** - Encriptación

## 📦 Instalación y Configuración

### Prerrequisitos
- Node.js 18+
- PostgreSQL 12+
- npm o yarn

### 1. Clonar el Repositorio
```bash
git clone <repository-url>
cd pajan
```

### 2. Configurar Backend
```bash
cd backend
npm install

# Configurar variables de entorno
cp env.example .env
# Editar .env con tus configuraciones

# Configurar base de datos
createdb pajan_db

# Ejecutar migraciones
npm run migrate

# Poblar datos iniciales
npm run seed

# Iniciar servidor
npm run dev
```

### 3. Configurar Frontend
```bash
cd ../src
npm install

# Configurar variables de entorno
cp env.example .env
# Editar .env con la URL del backend

# Iniciar aplicación
npm run dev
```

## 🔧 Configuración de Base de Datos

### Variables de Entorno Backend
```env
NODE_ENV=development
PORT=8080
DB_HOST=localhost
DB_PORT=5432
DB_NAME=pajan_db
DB_USER=pajan_user
DB_PASSWORD=pajan_password
JWT_SECRET=tu_jwt_secret_muy_seguro
CORS_ORIGIN=http://localhost:5173
```

### Variables de Entorno Frontend
```env
VITE_API_URL=http://localhost:8080
VITE_APP_NAME=GAD Municipal de Paján
```

## 👥 Usuarios por Defecto

Después de ejecutar el seed, se crean los siguientes usuarios:

| Usuario | Contraseña | Rol |
|---------|------------|-----|
| admin | admin123 | Superadministrador |
| tic | tic123 | TIC |
| comunicacion | comunicacion123 | Comunicación |
| participacion | participacion123 | Participación Ciudadana |
| transparencia | transparencia123 | Transparencia |

## 📊 Estructura de la Base de Datos

### Tablas Principales
- **users** - Usuarios del sistema
- **contents** - Contenido dinámico
- **documents** - Documentos generales
- **news** - Noticias y comunicados
- **attachments** - Archivos adjuntos
- **presidentes_barriales** - Presidentes barriales
- **rendicion_cuentas** - Documentos de rendición
- **transparencia** - Documentos LOTAIP
- **audit_logs** - Logs de auditoría

## 🚀 Scripts Disponibles

### Backend
```bash
npm start          # Producción
npm run dev        # Desarrollo
npm run migrate    # Migrar base de datos
npm run seed       # Poblar datos iniciales
npm test           # Ejecutar tests
```

### Frontend
```bash
npm run dev        # Desarrollo
npm run build      # Construir para producción
npm run preview    # Vista previa de producción
npm run lint       # Linter
```

## 📱 Funcionalidades por Rol

### Superadministrador
- Gestión completa de usuarios
- Acceso a todos los módulos
- Estadísticas del sistema
- Logs de auditoría
- Configuración del sistema

### TIC
- Gestión de contenido dinámico
- Gestión de páginas web
- Gestión de documentos técnicos
- Dashboard con estadísticas de contenido

### Comunicación
- Gestión de noticias
- Gestión de comunicados
- Gestión de eventos
- Dashboard con estadísticas de noticias

### Participación Ciudadana
- Gestión de presidentes barriales
- Gestión de actividades
- Gestión de participación ciudadana
- Dashboard con estadísticas de participación

### Transparencia
- Gestión de rendición de cuentas
- Gestión de documentos LOTAIP
- Gestión de transparencia
- Dashboard con estadísticas de transparencia

## 🔒 Seguridad

- **Autenticación JWT** con tokens de acceso y renovación
- **Encriptación de contraseñas** con bcrypt
- **Validación de datos** en frontend y backend
- **CORS configurado** para dominios específicos
- **Rate limiting** para prevenir abuso
- **Logs de auditoría** para todas las acciones
- **Soft deletes** para preservar datos

## 📈 Monitoreo y Logs

- **Logs de aplicación** con Winston
- **Logs de auditoría** para todas las acciones
- **Métricas de uso** por usuario y módulo
- **Estadísticas de rendimiento**
- **Monitoreo de errores**

## 🚀 Despliegue

### Backend
1. Configurar variables de entorno de producción
2. Configurar base de datos PostgreSQL
3. Configurar SSL/TLS
4. Configurar proxy reverso (Nginx)
5. Configurar PM2 para gestión de procesos

### Frontend
1. Construir aplicación: `npm run build`
2. Servir archivos estáticos
3. Configurar proxy para API
4. Configurar SSL/TLS

## 🤝 Contribución

1. Fork el proyecto
2. Crear una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para detalles.

## 📞 Soporte

Para soporte técnico o consultas:
- Email: soporte@pajan.gob.ec
- Teléfono: +593 XX XXX XXXX
- Dirección: GAD Municipal de Paján, Manabí, Ecuador

## 🎯 Roadmap

### Versión 1.1
- [ ] Sistema de notificaciones push
- [ ] Integración con redes sociales
- [ ] API móvil
- [ ] Sistema de reportes avanzados

### Versión 1.2
- [ ] Integración con sistemas externos
- [ ] Dashboard de analytics
- [ ] Sistema de workflow
- [ ] Integración con firma digital

---

**Desarrollado con ❤️ para el GAD Municipal de Paján**