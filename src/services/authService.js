/**
 * Servicio de autenticación conectado al backend
 */

import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

class AuthService {
  // Login de usuario
  async login(username, password) {
    try {
      const response = await axios.post(`${API_URL}/api/auth/login`, {
        username,
        password
      });

      if (response.data.success) {
        const { accessToken, refreshToken, user } = response.data.data;
        
        // Guardar tokens en localStorage
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
        localStorage.setItem('user', JSON.stringify(user));

        return {
          success: true,
          accessToken,
          refreshToken,
          user
        };
      }

      return {
        success: false,
        error: response.data.message || 'Error en el login'
      };
    } catch (error) {
      console.error('Error en login:', error);
      
      if (error.response?.data?.message) {
        return {
          success: false,
          error: error.response.data.message
        };
      }
      
      return {
        success: false,
        error: 'Error de conexión con el servidor'
      };
    }
  }

  // Logout de usuario
  async logout() {
    try {
      const token = localStorage.getItem('accessToken');
      
      if (token) {
        try {
          await axios.post(`${API_URL}/api/auth/logout`, {}, {
            headers: { Authorization: `Bearer ${token}` }
          });
        } catch (error) {
          console.warn('Error notificando logout al servidor:', error);
        }
      }

      // Limpiar localStorage
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      
      return { success: true };
    } catch (error) {
      console.error('Error en logout:', error);
      return { success: false, error: 'Error al cerrar sesión' };
    }
  }

  // Verificar token de acceso
  async verifyToken(token) {
    try {
      if (!token) {
        return { success: false, error: 'Token no proporcionado' };
      }

      const response = await axios.get(`${API_URL}/api/auth/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        return {
          success: true,
          user: response.data.data
        };
      }

      return { success: false, error: 'Token inválido' };
    } catch (error) {
      console.error('Error verificando token:', error);
      
      if (error.response?.status === 401) {
        return { success: false, error: 'Token expirado' };
      }
      
      return { success: false, error: 'Error verificando token' };
    }
  }

  // Obtener usuario actual
  async getCurrentUser() {
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
      const verification = await this.verifyToken(token);
      if (verification.success) {
        return verification.user;
      }

      // Intentar renovar el token
      const refreshResult = await this.refreshToken();
      if (refreshResult.success) {
        return refreshResult.user;
      }

      return null;
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
  async refreshToken() {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) {
        return { success: false, error: 'No hay refresh token' };
      }

      const response = await axios.post(`${API_URL}/api/auth/refresh`, {
        refreshToken
      });

      if (response.data.success) {
        const { accessToken } = response.data.data;
        localStorage.setItem('accessToken', accessToken);
        
        return {
          success: true,
          accessToken,
          user: JSON.parse(localStorage.getItem('user'))
        };
      }

      return { success: false, error: 'Error renovando token' };
    } catch (error) {
      console.error('Error renovando token:', error);
      return { success: false, error: 'Error renovando token' };
    }
  }

  // Cambiar contraseña
  async changePassword(currentPassword, newPassword) {
    try {
      const token = localStorage.getItem('accessToken');
      
      const response = await axios.post(`${API_URL}/api/auth/change-password`, {
        currentPassword,
        newPassword
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        return { 
          success: true, 
          message: response.data.message || 'Contraseña actualizada exitosamente' 
        };
      }

      return { 
        success: false, 
        error: response.data.message || 'Error actualizando contraseña' 
      };
    } catch (error) {
      console.error('Error cambiando contraseña:', error);
      
      if (error.response?.data?.message) {
        return {
          success: false,
          error: error.response.data.message
        };
      }
      
      return { success: false, error: 'Error interno del servidor' };
    }
  }

  // Obtener sesiones activas
  async getActiveSessions() {
    try {
      const token = localStorage.getItem('accessToken');
      
      const response = await axios.get(`${API_URL}/api/admin/audit-logs`, {
        params: { action: 'LOGIN', limit: 100 },
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        return response.data.data.logs;
      }

      return [];
    } catch (error) {
      console.error('Error obteniendo sesiones activas:', error);
      return [];
    }
  }
}

export default new AuthService();

