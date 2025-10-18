import React, { createContext, useContext, useState, useEffect } from 'react';
import authService from '../services/authService';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => {
    const storedToken = localStorage.getItem('accessToken');
    return storedToken && storedToken !== 'undefined' && storedToken !== 'null' ? storedToken : null;
  });
  const [loading, setLoading] = useState(true);

  // Verificar token al cargar la aplicación
  useEffect(() => {
    const verifyToken = async () => {
      // Limpiar localStorage de valores inválidos
      const invalidValues = ['undefined', 'null', ''];
      invalidValues.forEach(value => {
        if (localStorage.getItem('accessToken') === value) {
          localStorage.removeItem('accessToken');
        }
        if (localStorage.getItem('userRoles') === value) {
          localStorage.removeItem('userRoles');
        }
        if (localStorage.getItem('username') === value) {
          localStorage.removeItem('username');
        }
      });

      if (token) {
        try {
          const verification = await authService.verifyToken(token);
          if (verification.success) {
            setUser(verification.user);
          } else {
            // Token inválido, limpiar sesión
            logout();
          }
        } catch (error) {
          console.error('Error verificando token:', error);
          logout();
        }
      }
      setLoading(false);
    };

    verifyToken();
  }, [token]);

  const login = async (username, password) => {
    try {
      console.log('Intentando login con:', { username, password });
      const result = await authService.login(username, password);

      if (result.success) {
        setToken(result.accessToken);
        setUser(result.user);
        console.log('Login exitoso:', result.user);
        return { success: true };
      } else {
        console.error('Error en login:', result.error);
        return {
          success: false,
          error: result.error
        };
      }
    } catch (error) {
      console.error('Error en login:', error);
      return {
        success: false,
        error: 'Error interno del servidor'
      };
    }
  };

  const register = async (userData) => {
    try {
      // En un sistema real, aquí se registraría el usuario
      // Por ahora, solo simulamos el registro
      return { 
        success: true, 
        message: 'Usuario registrado exitosamente. Contacte al administrador para activar su cuenta.' 
      };
    } catch (error) {
      console.error('Error en registro:', error);
      return {
        success: false,
        error: 'Error al registrar usuario'
      };
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
      setUser(null);
      setToken(null);
    } catch (error) {
      console.error('Error en logout:', error);
      // Limpiar sesión local aunque haya error
      setUser(null);
      setToken(null);
    }
  };

  const updateUser = (userData) => {
    setUser(userData);
  };

  const hasPermission = (requiredRole) => {
    return authService.hasPermission(user, requiredRole);
  };

  const hasAnyPermission = (requiredRoles) => {
    return authService.hasAnyPermission(user, requiredRoles);
  };

  const hasAllPermissions = (requiredRoles) => {
    return authService.hasAllPermissions(user, requiredRoles);
  };

  const changePassword = async (currentPassword, newPassword) => {
    if (!user) {
      return { success: false, error: 'Usuario no autenticado' };
    }

    try {
      const result = await authService.changePassword(user.id, currentPassword, newPassword);
      return result;
    } catch (error) {
      console.error('Error cambiando contraseña:', error);
      return { success: false, error: 'Error interno del servidor' };
    }
  };

  const refreshToken = async () => {
    try {
      const result = await authService.refreshToken();
      if (result.success) {
        setToken(result.accessToken);
        setUser(result.user);
        return { success: true };
      }
      return { success: false, error: result.error };
    } catch (error) {
      console.error('Error renovando token:', error);
      return { success: false, error: 'Error renovando token' };
    }
  };

  const value = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    updateUser,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    changePassword,
    refreshToken
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
