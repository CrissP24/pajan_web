import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

// Función para obtener headers de autenticación
const getAuthHeaders = () => {
  const token = localStorage.getItem('accessToken');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const getPresidentes = (params = {}) =>
  axios.get(`${API_URL}/api/presidentes`, {
    params,
    headers: getAuthHeaders()
  });

export const getPresidenteById = (id) =>
  axios.get(`${API_URL}/api/presidentes/${id}`, {
    headers: getAuthHeaders()
  });

export const createPresidente = (data) =>
  axios.post(`${API_URL}/api/presidentes`, data, {
    headers: getAuthHeaders()
  });

export const updatePresidente = (id, data) =>
  axios.put(`${API_URL}/api/presidentes/${id}`, data, {
    headers: getAuthHeaders()
  });

export const deletePresidente = (id) =>
  axios.delete(`${API_URL}/api/presidentes/${id}`, {
    headers: getAuthHeaders()
  });

export const activatePresidente = (id) =>
  axios.post(`${API_URL}/api/presidentes/${id}/activate`, {}, {
    headers: getAuthHeaders()
  });

export const deactivatePresidente = (id, motivo) =>
  axios.post(`${API_URL}/api/presidentes/${id}/deactivate`, { motivo }, {
    headers: getAuthHeaders()
  });

export const getBarrios = () =>
  axios.get(`${API_URL}/api/presidentes/barrios/list`, {
    headers: getAuthHeaders()
  });

export const getPresidentesStatistics = () =>
  axios.get(`${API_URL}/api/presidentes/statistics`, {
    headers: getAuthHeaders()
  });

export const searchPresidentes = (query, params = {}) =>
  axios.get(`${API_URL}/api/presidentes`, {
    params: { search: query, ...params },
    headers: getAuthHeaders()
  });
