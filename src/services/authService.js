/**
 * Servicio de autenticación basado en localStorage
 */

import localStorageService from './localStorageService';

class AuthService {
  // Login de usuario
  async login(username, password) {
    try {
      // Obtener usuarios de localStorage
      const users = localStorageService.getItem('users', []);

      // Buscar usuario
      const user = users.find(u =>
        (u.username === username || u.email === username) && u.active
      );

      if (!user) {
        return {
          success: false,
          error: 'Credenciales inválidas'
        };
      }

      // Verificar contraseña (en producción esto sería con hash)
      if (user.password !== password) {
        return {
          success: false,
          error: 'Credenciales inválidas'
        };
      }

      // Generar tokens simulados
      const accessToken = this.generateAccessToken(user);
      const refreshToken = this.generateRefreshToken(user);

      // Actualizar último login
      const updatedUser = {
        ...user,
        lastLogin: new Date().toISOString()
      };
      localStorageService.updateInArray('users', user.id, { lastLogin: new Date().toISOString() });

      // Guardar tokens y usuario en localStorage
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('user', JSON.stringify(updatedUser));

      // Log de auditoría
      localStorageService.logActivity(updatedUser, 'LOGIN', {
        ip: '127.0.0.1',
        userAgent: navigator.userAgent,
        description: `Usuario ${user.username} inició sesión`
      });

      return {
        success: true,
        accessToken,
        refreshToken,
        user: updatedUser
      };
    } catch (error) {
      console.error('Error en login:', error);
      return {
        success: false,
        error: 'Error interno del sistema'
      };
    }
  }

  // Logout de usuario
  async logout() {
    try {
      const user = this.getCurrentUser();

      if (user) {
        // Log de auditoría
        localStorageService.logActivity(user, 'LOGOUT', {
          ip: '127.0.0.1',
          userAgent: navigator.userAgent,
          description: `Usuario ${user.username} cerró sesión`
        });
      }

      // Limpiar localStorage
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');

      return { success: true };
    } catch (error) {
      console.error('Error en logout:', error);
      // Limpiar de todas formas
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      return { success: false, error: 'Error al cerrar sesión' };
    }
  }

  // Verificar token de acceso
  async verifyToken(token) {
    try {
      if (!token) {
        return { success: false, error: 'Token no proporcionado' };
      }

      const decoded = this.decodeToken(token);
      if (!decoded) {
        return { success: false, error: 'Token inválido' };
      }

      // Verificar expiración
      if (this.isTokenExpired(token)) {
        return { success: false, error: 'Token expirado' };
      }

      // Obtener usuario actualizado
      const users = localStorageService.getItem('users', []);
      const user = users.find(u => u.id === decoded.userId && u.active);

      if (!user) {
        return { success: false, error: 'Usuario no encontrado' };
      }

      return {
        success: true,
        user: user
      };
    } catch (error) {
      console.error('Error verificando token:', error);
      return { success: false, error: 'Error verificando token' };
    }
  }

  // Obtener usuario actual
  getCurrentUser() {
    try {
      const userStr = localStorage.getItem('user');
      if (!userStr) {
        return null;
      }

      const user = JSON.parse(userStr);
      const token = localStorage.getItem('accessToken');

      if (!token) {
        return null;
      }

      // Verificar si el token sigue siendo válido
      if (this.isTokenExpired(token)) {
        // Intentar renovar el token
        const refreshResult = this.refreshToken();
        if (refreshResult.success) {
          return refreshResult.user;
        }
        return null;
      }

      return user;
    } catch (error) {
      console.error('Error obteniendo usuario actual:', error);
      return null;
    }
  }

  // Verificar permisos de usuario
  hasPermission(user, requiredRole) {
    if (!user || !user.roles) {
      return false;
    }

    // Superadministrador tiene acceso a todo
    if (user.roles.includes('Superadministrador')) {
      return true;
    }

    // Verificar si el usuario tiene el rol requerido
    return user.roles.includes(requiredRole);
  }

  // Verificar múltiples permisos (OR)
  hasAnyPermission(user, requiredRoles) {
    if (!user || !user.roles) {
      return false;
    }

    // Superadministrador tiene acceso a todo
    if (user.roles.includes('Superadministrador')) {
      return true;
    }

    // Verificar si el usuario tiene alguno de los roles requeridos
    return requiredRoles.some(role => user.roles.includes(role));
  }

  // Verificar múltiples permisos (AND)
  hasAllPermissions(user, requiredRoles) {
    if (!user || !user.roles) {
      return false;
    }

    // Superadministrador tiene acceso a todo
    if (user.roles.includes('Superadministrador')) {
      return true;
    }

    // Verificar si el usuario tiene todos los roles requeridos
    return requiredRoles.every(role => user.roles.includes(role));
  }

  // Generar token de acceso (simulado)
  generateAccessToken(user) {
    const payload = {
      userId: user.id,
      username: user.username,
      roles: user.roles,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60) // 24 horas
    };

    // En un sistema real, esto sería un JWT firmado
    return btoa(JSON.stringify(payload));
  }

  // Generar refresh token (simulado)
  generateRefreshToken(user) {
    const payload = {
      userId: user.id,
      username: user.username,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + (7 * 24 * 60 * 60) // 7 días
    };

    return btoa(JSON.stringify(payload));
  }

  // Decodificar token (simulado)
  decodeToken(token) {
    try {
      const payload = JSON.parse(atob(token));
      return payload;
    } catch (error) {
      return null;
    }
  }

  // Verificar si el token ha expirado
  isTokenExpired(token) {
    try {
      const payload = this.decodeToken(token);
      if (!payload || !payload.exp) {
        return true;
      }

      const currentTime = Math.floor(Date.now() / 1000);
      return currentTime >= payload.exp;
    } catch (error) {
      return true;
    }
  }

  // Renovar token
  refreshToken() {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) {
        return { success: false, error: 'No hay refresh token' };
      }

      if (this.isTokenExpired(refreshToken)) {
        return { success: false, error: 'Refresh token expirado' };
      }

      const decoded = this.decodeToken(refreshToken);
      if (!decoded) {
        return { success: false, error: 'Refresh token inválido' };
      }

      // Obtener usuario
      const users = localStorageService.getItem('users', []);
      const user = users.find(u => u.id === decoded.userId && u.active);

      if (!user) {
        return { success: false, error: 'Usuario no encontrado' };
      }

      // Generar nuevo access token
      const accessToken = this.generateAccessToken(user);
      localStorage.setItem('accessToken', accessToken);

      return {
        success: true,
        accessToken,
        user: user
      };
    } catch (error) {
      console.error('Error renovando token:', error);
      return { success: false, error: 'Error renovando token' };
    }
  }

  // Cambiar contraseña
  async changePassword(userId, currentPassword, newPassword) {
    try {
      const users = localStorageService.getItem('users', []);
      const user = users.find(u => u.id === userId);

      if (!user) {
        return { success: false, error: 'Usuario no encontrado' };
      }

      // Verificar contraseña actual
      if (user.password !== currentPassword) {
        return { success: false, error: 'Contraseña actual incorrecta' };
      }

      // Actualizar contraseña
      localStorageService.updateInArray('users', userId, {
        password: newPassword,
        passwordChangedAt: new Date().toISOString()
      });

      // Log de auditoría
      localStorageService.logActivity(user, 'UPDATE', {
        entity: 'User',
        entityId: userId,
        description: `Usuario ${user.username} cambió su contraseña`
      });

      return {
        success: true,
        message: 'Contraseña actualizada exitosamente'
      };
    } catch (error) {
      console.error('Error cambiando contraseña:', error);
      return { success: false, error: 'Error interno del servidor' };
    }
  }

  // Obtener sesiones activas (simulado)
  async getActiveSessions() {
    try {
      const auditLogs = localStorageService.getItem('audit_logs', []);

      // Filtrar logs de login recientes (últimas 24 horas)
      const oneDayAgo = new Date();
      oneDayAgo.setDate(oneDayAgo.getDate() - 1);

      return auditLogs
        .filter(log => log.action === 'LOGIN' && new Date(log.timestamp) > oneDayAgo)
        .slice(0, 100); // Últimas 100 sesiones
    } catch (error) {
      console.error('Error obteniendo sesiones activas:', error);
      return [];
    }
  }

  // Obtener información del usuario actual (para /me)
  async getMe() {
    try {
      const user = this.getCurrentUser();
      if (!user) {
        return { success: false, error: 'Usuario no autenticado' };
      }

      return {
        success: true,
        data: user
      };
    } catch (error) {
      console.error('Error obteniendo información del usuario:', error);
      return { success: false, error: 'Error interno del servidor' };
    }
  }
}

export default new AuthService();

