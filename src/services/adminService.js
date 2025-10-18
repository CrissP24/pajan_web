import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

// Función para obtener headers de autenticación
const getAuthHeaders = () => {
  const token = localStorage.getItem('accessToken');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const getAdminDashboard = () =>
  axios.get(`${API_URL}/api/admin/dashboard`, {
    headers: getAuthHeaders()
  });

export const getAdminStatistics = (period = '30d') =>
  axios.get(`${API_URL}/api/admin/statistics`, {
    params: { period },
    headers: getAuthHeaders()
  });

export const getAuditLogs = (params = {}) =>
  axios.get(`${API_URL}/api/admin/audit-logs`, {
    params,
    headers: getAuthHeaders()
  });

export const getSystemInfo = () =>
  axios.get(`${API_URL}/api/admin/system-info`, {
    headers: getAuthHeaders()
  });

export const cleanupData = (daysToKeep, cleanupType) =>
  axios.post(`${API_URL}/api/admin/cleanup`, {
    daysToKeep,
    cleanupType
  }, {
    headers: getAuthHeaders()
  });

export const getTicDashboard = () =>
  axios.get(`${API_URL}/api/dashboards/tic`, {
    headers: getAuthHeaders()
  });

export const getComunicacionDashboard = () =>
  axios.get(`${API_URL}/api/dashboards/comunicacion`, {
    headers: getAuthHeaders()
  });

export const getParticipacionDashboard = () =>
  axios.get(`${API_URL}/api/dashboards/participacion`, {
    headers: getAuthHeaders()
  });

export const getTransparenciaDashboard = () =>
  axios.get(`${API_URL}/api/dashboards/transparencia`, {
    headers: getAuthHeaders()
  });

export const getDashboardStatistics = (period = '30d') =>
  axios.get(`${API_URL}/api/dashboards/statistics`, {
    params: { period },
    headers: getAuthHeaders()
  });