# Backend del GAD Municipal de Paján

Sistema backend completo para la gestión municipal con Express.js, PostgreSQL y Sequelize.

## Características

- **Autenticación JWT** con roles y permisos
- **Base de datos PostgreSQL** con Sequelize ORM
- **API RESTful** completa
- **Sistema de roles** (Superadministrador, TIC, Comunicación, Participación Ciudadana, Transparencia)
- **Gestión de contenido** dinámico
- **Sistema de noticias** y comunicados
- **Gestión de presidentes barriales**
- **Rendición de cuentas** y transparencia (LOTAIP)
- **Sistema de archivos** adjuntos
- **Logs de auditoría** completos
- **Dashboards** especializados por rol

## Instalación

### Prerrequisitos

- Node.js 18+
- PostgreSQL 12+
- npm o yarn

### Configuración

1. **Clonar el repositorio**
```bash
git clone <repository-url>
cd backend
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar variables de entorno**
```bash
cp env.example .env
```

Editar el archivo `.env` con tus configuraciones:
```env
NODE_ENV=development
PORT=8080
HOST=localhost

# Base de datos PostgreSQL
DB_HOST=localhost
DB_PORT=5432
DB_NAME=pajan_db
DB_USER=pajan_user
DB_PASSWORD=pajan_password

# JWT
JWT_SECRET=tu_jwt_secret_muy_seguro_aqui
JWT_EXPIRES_IN=24h
JWT_REFRESH_EXPIRES_IN=7d

# CORS
CORS_ORIGIN=http://localhost:5173

# Uploads
UPLOAD_PATH=./uploads
MAX_FILE_SIZE=10485760
```

4. **Configurar base de datos**
```bash
# Crear base de datos
createdb pajan_db

# Crear usuario (opcional)
psql -c "CREATE USER pajan_user WITH PASSWORD 'pajan_password';"
psql -c "GRANT ALL PRIVILEGES ON DATABASE pajan_db TO pajan_user;"
```

5. **Ejecutar migraciones**
```bash
npm run migrate
```

6. **Poblar datos iniciales**
```bash
npm run seed
```

7. **Iniciar servidor**
```bash
# Desarrollo
npm run dev

# Producción
npm start
```

## Estructura del Proyecto

```
backend/
├── config/
│   └── database.js          # Configuración de base de datos
├── middleware/
│   ├── auth.js              # Middleware de autenticación
│   └── errorHandler.js      # Manejo de errores
├── models/
│   ├── index.js             # Índice de modelos
│   ├── User.js              # Modelo de usuario
│   ├── Content.js           # Modelo de contenido
│   ├── Document.js          # Modelo de documento
│   ├── News.js              # Modelo de noticia
│   ├── Attachment.js        # Modelo de archivo adjunto
│   ├── PresidenteBarrial.js # Modelo de presidente barrial
│   ├── RendicionCuenta.js   # Modelo de rendición de cuentas
│   ├── Transparencia.js     # Modelo de transparencia
│   └── AuditLog.js          # Modelo de log de auditoría
├── routes/
│   ├── auth.js              # Rutas de autenticación
│   ├── users.js             # Rutas de usuarios
│   ├── content.js           # Rutas de contenido
│   ├── documents.js          # Rutas de documentos
│   ├── news.js              # Rutas de noticias
│   ├── attachments.js       # Rutas de archivos adjuntos
│   ├── admin.js             # Rutas de administración
│   ├── dashboards.js        # Rutas de dashboards
│   ├── presidentes.js       # Rutas de presidentes barriales
│   ├── rendicion.js         # Rutas de rendición de cuentas
│   └── transparencia.js     # Rutas de transparencia
├── scripts/
│   ├── migrate.js          # Script de migración
│   └── seed.js              # Script de datos iniciales
├── utils/
│   └── logger.js            # Configuración de logging
├── uploads/                 # Directorio de archivos subidos
├── logs/                    # Directorio de logs
├── server.js               # Servidor principal
├── package.json            # Dependencias y scripts
└── README.md               # Este archivo
```

## API Endpoints

### Autenticación
- `POST /api/auth/login` - Iniciar sesión
- `POST /api/auth/register` - Registrar usuario (Solo Superadministrador)
- `POST /api/auth/refresh` - Renovar token
- `POST /api/auth/logout` - Cerrar sesión
- `GET /api/auth/me` - Obtener usuario actual
- `POST /api/auth/change-password` - Cambiar contraseña

### Usuarios
- `GET /api/users` - Listar usuarios (Solo Superadministrador)
- `GET /api/users/:id` - Obtener usuario por ID
- `PUT /api/users/:id` - Actualizar usuario
- `DELETE /api/users/:id` - Eliminar usuario
- `POST /api/users/:id/activate` - Activar usuario
- `POST /api/users/:id/deactivate` - Desactivar usuario

### Contenido
- `GET /api/content` - Listar contenido
- `GET /api/content/:id` - Obtener contenido por ID
- `GET /api/content/slug/:slug` - Obtener contenido por slug
- `POST /api/content` - Crear contenido
- `PUT /api/content/:id` - Actualizar contenido
- `DELETE /api/content/:id` - Eliminar contenido
- `POST /api/content/:id/publish` - Publicar contenido
- `POST /api/content/:id/unpublish` - Despublicar contenido

### Documentos
- `GET /api/documents` - Listar documentos
- `GET /api/documents/public` - Listar documentos públicos
- `GET /api/documents/:id` - Obtener documento por ID
- `GET /api/documents/public/slug/:slug` - Obtener documento público por slug
- `POST /api/documents` - Crear documento
- `PUT /api/documents/:id` - Actualizar documento
- `DELETE /api/documents/:id` - Eliminar documento
- `POST /api/documents/:id/publish` - Publicar documento

### Noticias
- `GET /api/news` - Listar noticias
- `GET /api/news/:id` - Obtener noticia por ID
- `GET /api/news/slug/:slug` - Obtener noticia por slug
- `POST /api/news` - Crear noticia
- `PUT /api/news/:id` - Actualizar noticia
- `DELETE /api/news/:id` - Eliminar noticia
- `POST /api/news/:id/publish` - Publicar noticia
- `GET /api/news/featured/list` - Noticias destacadas
- `GET /api/news/breaking/list` - Noticias urgentes
- `GET /api/news/events/upcoming` - Eventos próximos

### Archivos Adjuntos
- `POST /api/attachments/upload` - Subir archivo
- `GET /api/attachments` - Listar archivos
- `GET /api/attachments/:id` - Obtener archivo por ID
- `GET /api/attachments/:id/download` - Descargar archivo
- `PUT /api/attachments/:id` - Actualizar archivo
- `DELETE /api/attachments/:id` - Eliminar archivo

### Presidentes Barriales
- `GET /api/presidentes` - Listar presidentes
- `GET /api/presidentes/:id` - Obtener presidente por ID
- `POST /api/presidentes` - Crear presidente
- `PUT /api/presidentes/:id` - Actualizar presidente
- `DELETE /api/presidentes/:id` - Eliminar presidente
- `POST /api/presidentes/:id/activate` - Activar presidente
- `POST /api/presidentes/:id/deactivate` - Desactivar presidente

### Rendición de Cuentas
- `GET /api/rendicion` - Listar documentos de rendición
- `GET /api/rendicion/:id` - Obtener documento por ID
- `POST /api/rendicion` - Crear documento
- `PUT /api/rendicion/:id` - Actualizar documento
- `DELETE /api/rendicion/:id` - Eliminar documento
- `POST /api/rendicion/:id/publish` - Publicar documento

### Transparencia (LOTAIP)
- `GET /api/transparencia` - Listar documentos de transparencia
- `GET /api/transparencia/:id` - Obtener documento por ID
- `POST /api/transparencia` - Crear documento
- `PUT /api/transparencia/:id` - Actualizar documento
- `DELETE /api/transparencia/:id` - Eliminar documento
- `POST /api/transparencia/:id/publish` - Publicar documento

### Administración
- `GET /api/admin/dashboard` - Dashboard de administración
- `GET /api/admin/statistics` - Estadísticas detalladas
- `GET /api/admin/audit-logs` - Logs de auditoría
- `GET /api/admin/system-info` - Información del sistema
- `POST /api/admin/cleanup` - Limpiar datos antiguos

### Dashboards
- `GET /api/dashboards/tic` - Dashboard TIC
- `GET /api/dashboards/comunicacion` - Dashboard Comunicación
- `GET /api/dashboards/participacion` - Dashboard Participación
- `GET /api/dashboards/transparencia` - Dashboard Transparencia
- `GET /api/dashboards/statistics` - Estadísticas generales

## Roles y Permisos

### Superadministrador
- Acceso completo a todas las funcionalidades
- Gestión de usuarios
- Configuración del sistema
- Logs de auditoría

### TIC
- Gestión de contenido
- Gestión de documentos
- Gestión de páginas web

### Comunicación
- Gestión de noticias
- Gestión de comunicados
- Gestión de redes sociales

### Participación Ciudadana
- Gestión de actividades
- Gestión de participación
- Gestión de presidentes barriales

### Transparencia
- Gestión de transparencia
- Gestión de rendición de cuentas
- Gestión de documentos LOTAIP

## Usuarios por Defecto

Después de ejecutar el seed, se crean los siguientes usuarios:

- **admin** / admin123 (Superadministrador)
- **tic** / tic123 (TIC)
- **comunicacion** / comunicacion123 (Comunicación)
- **participacion** / participacion123 (Participación Ciudadana)
- **transparencia** / transparencia123 (Transparencia)

## Scripts Disponibles

```bash
# Desarrollo
npm run dev

# Producción
npm start

# Migración de base de datos
npm run migrate

# Poblar datos iniciales
npm run seed

# Tests
npm test
```

## Configuración de Producción

1. Configurar variables de entorno para producción
2. Configurar base de datos PostgreSQL en servidor
3. Configurar logs y monitoreo
4. Configurar backup de base de datos
5. Configurar SSL/TLS
6. Configurar firewall y seguridad

## Contribución

1. Fork el proyecto
2. Crear una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir un Pull Request

## Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para detalles.
