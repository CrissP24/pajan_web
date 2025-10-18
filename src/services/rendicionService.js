import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

// Función para obtener headers de autenticación
const getAuthHeaders = () => {
  const token = localStorage.getItem('accessToken');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const getRendicion = (params = {}) =>
  axios.get(`${API_URL}/api/rendicion`, {
    params,
    headers: getAuthHeaders()
  });

export const getRendicionById = (id) =>
  axios.get(`${API_URL}/api/rendicion/${id}`, {
    headers: getAuthHeaders()
  });

export const createRendicion = (data) =>
  axios.post(`${API_URL}/api/rendicion`, data, {
    headers: getAuthHeaders()
  });

export const updateRendicion = (id, data) =>
  axios.put(`${API_URL}/api/rendicion/${id}`, data, {
    headers: getAuthHeaders()
  });

export const deleteRendicion = (id) =>
  axios.delete(`${API_URL}/api/rendicion/${id}`, {
    headers: getAuthHeaders()
  });

export const publishRendicion = (id) =>
  axios.post(`${API_URL}/api/rendicion/${id}/publish`, {}, {
    headers: getAuthHeaders()
  });

export const getRendicionYears = () =>
  axios.get(`${API_URL}/api/rendicion/years/list`, {
    headers: getAuthHeaders()
  });

export const getRendicionFases = () =>
  axios.get(`${API_URL}/api/rendicion/fases/list`, {
    headers: getAuthHeaders()
  });

export const getRendicionStatistics = () =>
  axios.get(`${API_URL}/api/rendicion/statistics`, {
    headers: getAuthHeaders()
  });

export const searchRendicion = (query, params = {}) =>
  axios.get(`${API_URL}/api/rendicion`, {
    params: { search: query, ...params },
    headers: getAuthHeaders()
  });
