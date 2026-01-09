/**
 * Servicio de gestión de usuarios basado en localStorage
 */

import localStorageService from './localStorageService';
import authService from './authService';

class UserService {
  // Obtener todos los usuarios
  async getUsers(options = {}) {
    try {
      // Verificar permisos
      const currentUser = authService.getCurrentUser();
      if (!currentUser || !authService.hasPermission(currentUser, 'Superadministrador')) {
        return {
          success: false,
          error: 'No tienes permisos para ver usuarios'
        };
      }

      let users = localStorageService.getItem('users', []);

      // Aplicar filtros
      const { page = 1, limit = 10, search, role, active } = options;

      // Filtro de búsqueda
      if (search) {
        const searchTerm = search.toLowerCase();
        users = users.filter(user =>
          user.nombre?.toLowerCase().includes(searchTerm) ||
          user.apellido?.toLowerCase().includes(searchTerm) ||
          user.username?.toLowerCase().includes(searchTerm) ||
          user.email?.toLowerCase().includes(searchTerm)
        );
      }

      // Filtro por rol
      if (role) {
        users = users.filter(user => user.roles?.includes(role));
      }

      // Filtro por estado activo
      if (active !== undefined) {
        users = users.filter(user => user.active === (active === 'true' || active === true));
      }

      // Ordenar por fecha de creación descendente
      users.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      // Paginación
      const total = users.length;
      const offset = (page - 1) * limit;
      const paginatedUsers = users.slice(offset, offset + limit);

      return {
        success: true,
        data: {
          users: paginatedUsers,
          pagination: {
            total,
            page: parseInt(page),
            limit: parseInt(limit),
            pages: Math.ceil(total / limit)
          }
        }
      };
    } catch (error) {
      console.error('Error obteniendo usuarios:', error);
      return {
        success: false,
        error: 'Error interno del servidor'
      };
    }
  }

  // Obtener usuario por ID
  async getUserById(id) {
    try {
      // Verificar permisos
      const currentUser = authService.getCurrentUser();
      if (!currentUser || !authService.hasPermission(currentUser, 'Superadministrador')) {
        return {
          success: false,
          error: 'No tienes permisos para ver este usuario'
        };
      }

      const users = localStorageService.getItem('users', []);
      const user = users.find(u => u.id === id);

      if (!user) {
        return {
          success: false,
          error: 'Usuario no encontrado'
        };
      }

      return {
        success: true,
        data: user
      };
    } catch (error) {
      console.error('Error obteniendo usuario:', error);
      return {
        success: false,
        error: 'Error interno del servidor'
      };
    }
  }

  // Crear usuario
  async createUser(userData) {
    try {
      // Verificar permisos
      const currentUser = authService.getCurrentUser();
      if (!currentUser || !authService.hasPermission(currentUser, 'Superadministrador')) {
        return {
          success: false,
          error: 'No tienes permisos para crear usuarios'
        };
      }

      const users = localStorageService.getItem('users', []);

      // Verificar si el usuario ya existe
      const existingUser = users.find(u =>
        u.username === userData.username || u.email === userData.email
      );

      if (existingUser) {
        return {
          success: false,
          error: 'El usuario o email ya existe'
        };
      }

      // Crear nuevo usuario
      const newUser = {
        id: localStorageService.generateId(),
        username: userData.username,
        email: userData.email,
        password: userData.password,
        nombre: userData.nombre,
        apellido: userData.apellido || '',
        telefono: userData.telefono || '',
        roles: userData.roles || ['user'],
        active: userData.active !== undefined ? userData.active : true,
        lastLogin: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      localStorageService.addToArray('users', newUser);

      // Log de auditoría
      localStorageService.logActivity(currentUser, 'CREATE', {
        entity: 'User',
        entityId: newUser.id,
        newValues: newUser,
        description: `Usuario ${currentUser.username} creó el usuario ${newUser.username}`
      });

      // Remover contraseña del objeto retornado
      const { password, ...userWithoutPassword } = newUser;

      return {
        success: true,
        message: 'Usuario creado exitosamente',
        data: userWithoutPassword
      };
    } catch (error) {
      console.error('Error creando usuario:', error);
      return {
        success: false,
        error: 'Error interno del servidor'
      };
    }
  }

  // Actualizar usuario
  async updateUser(id, userData) {
    try {
      // Verificar permisos
      const currentUser = authService.getCurrentUser();
      if (!currentUser || !authService.hasPermission(currentUser, 'Superadministrador')) {
        return {
          success: false,
          error: 'No tienes permisos para actualizar usuarios'
        };
      }

      const users = localStorageService.getItem('users', []);
      const user = users.find(u => u.id === id);

      if (!user) {
        return {
          success: false,
          error: 'Usuario no encontrado'
        };
      }

      const oldValues = { ...user };

      // Actualizar campos permitidos
      const updateData = {};
      if (userData.username !== undefined) updateData.username = userData.username;
      if (userData.email !== undefined) updateData.email = userData.email;
      if (userData.nombre !== undefined) updateData.nombre = userData.nombre;
      if (userData.apellido !== undefined) updateData.apellido = userData.apellido;
      if (userData.telefono !== undefined) updateData.telefono = userData.telefono;
      if (userData.roles !== undefined) updateData.roles = userData.roles;
      if (userData.active !== undefined) updateData.active = userData.active;

      const updatedUser = localStorageService.updateInArray('users', id, updateData);

      if (!updatedUser) {
        return {
          success: false,
          error: 'Error actualizando usuario'
        };
      }

      // Log de auditoría
      localStorageService.logActivity(currentUser, 'UPDATE', {
        entity: 'User',
        entityId: id,
        oldValues,
        newValues: updatedUser,
        description: `Usuario ${currentUser.username} actualizó el usuario ${updatedUser.username}`
      });

      return {
        success: true,
        message: 'Usuario actualizado exitosamente',
        data: updatedUser
      };
    } catch (error) {
      console.error('Error actualizando usuario:', error);
      return {
        success: false,
        error: 'Error interno del servidor'
      };
    }
  }

  // Eliminar usuario
  async deleteUser(id) {
    try {
      // Verificar permisos
      const currentUser = authService.getCurrentUser();
      if (!currentUser || !authService.hasPermission(currentUser, 'Superadministrador')) {
        return {
          success: false,
          error: 'No tienes permisos para eliminar usuarios'
        };
      }

      const users = localStorageService.getItem('users', []);
      const user = users.find(u => u.id === id);

      if (!user) {
        return {
          success: false,
          error: 'Usuario no encontrado'
        };
      }

      // No permitir eliminar el propio usuario
      if (user.id === currentUser.id) {
        return {
          success: false,
          error: 'No puedes eliminar tu propio usuario'
        };
      }

      const oldValues = { ...user };
      const deleted = localStorageService.removeFromArray('users', id);

      if (!deleted) {
        return {
          success: false,
          error: 'Error eliminando usuario'
        };
      }

      // Log de auditoría
      localStorageService.logActivity(currentUser, 'DELETE', {
        entity: 'User',
        entityId: id,
        oldValues,
        description: `Usuario ${currentUser.username} eliminó el usuario ${user.username}`
      });

      return {
        success: true,
        message: 'Usuario eliminado exitosamente'
      };
    } catch (error) {
      console.error('Error eliminando usuario:', error);
      return {
        success: false,
        error: 'Error interno del servidor'
      };
    }
  }

  // Activar usuario
  async activateUser(id) {
    try {
      // Verificar permisos
      const currentUser = authService.getCurrentUser();
      if (!currentUser || !authService.hasPermission(currentUser, 'Superadministrador')) {
        return {
          success: false,
          error: 'No tienes permisos para activar usuarios'
        };
      }

      const updatedUser = localStorageService.updateInArray('users', id, { active: true });

      if (!updatedUser) {
        return {
          success: false,
          error: 'Usuario no encontrado'
        };
      }

      // Log de auditoría
      localStorageService.logActivity(currentUser, 'ACTIVATE', {
        entity: 'User',
        entityId: id,
        description: `Usuario ${currentUser.username} activó el usuario ${updatedUser.username}`
      });

      return {
        success: true,
        message: 'Usuario activado exitosamente',
        data: updatedUser
      };
    } catch (error) {
      console.error('Error activando usuario:', error);
      return {
        success: false,
        error: 'Error interno del servidor'
      };
    }
  }

  // Desactivar usuario
  async deactivateUser(id) {
    try {
      // Verificar permisos
      const currentUser = authService.getCurrentUser();
      if (!currentUser || !authService.hasPermission(currentUser, 'Superadministrador')) {
        return {
          success: false,
          error: 'No tienes permisos para desactivar usuarios'
        };
      }

      const users = localStorageService.getItem('users', []);
      const user = users.find(u => u.id === id);

      if (!user) {
        return {
          success: false,
          error: 'Usuario no encontrado'
        };
      }

      // No permitir desactivar el propio usuario
      if (user.id === currentUser.id) {
        return {
          success: false,
          error: 'No puedes desactivar tu propio usuario'
        };
      }

      const updatedUser = localStorageService.updateInArray('users', id, { active: false });

      // Log de auditoría
      localStorageService.logActivity(currentUser, 'DEACTIVATE', {
        entity: 'User',
        entityId: id,
        description: `Usuario ${currentUser.username} desactivó el usuario ${user.username}`
      });

      return {
        success: true,
        message: 'Usuario desactivado exitosamente',
        data: updatedUser
      };
    } catch (error) {
      console.error('Error desactivando usuario:', error);
      return {
        success: false,
        error: 'Error interno del servidor'
      };
    }
  }

  // Obtener roles disponibles
  async getAvailableRoles() {
    try {
      const roles = [
        'Superadministrador',
        'TIC',
        'Comunicación',
        'Participación Ciudadana',
        'Transparencia',
        'user'
      ];

      return {
        success: true,
        data: roles
      };
    } catch (error) {
      console.error('Error obteniendo roles:', error);
      return {
        success: false,
        error: 'Error interno del servidor'
      };
    }
  }

  // Obtener estadísticas de usuarios
  async getUserStatistics() {
    try {
      // Verificar permisos
      const currentUser = authService.getCurrentUser();
      if (!currentUser || !authService.hasPermission(currentUser, 'Superadministrador')) {
        return {
          success: false,
          error: 'No tienes permisos para ver estadísticas'
        };
      }

      const users = localStorageService.getItem('users', []);

      const total = users.length;
      const active = users.filter(u => u.active).length;
      const inactive = users.filter(u => !u.active).length;

      // Estadísticas por rol
      const roleStats = {};
      users.forEach(user => {
        user.roles?.forEach(role => {
          roleStats[role] = (roleStats[role] || 0) + 1;
        });
      });

      const roleStatsArray = Object.entries(roleStats).map(([role, count]) => ({
        role,
        count
      }));

      return {
        success: true,
        data: {
          total,
          active,
          inactive,
          roleStats: roleStatsArray
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
}

export default new UserService(); 