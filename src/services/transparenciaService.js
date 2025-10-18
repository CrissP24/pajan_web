import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

// Función para obtener headers de autenticación
const getAuthHeaders = () => {
  const token = localStorage.getItem('accessToken');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const getTransparencia = (params = {}) =>
  axios.get(`${API_URL}/api/transparencia`, {
    params,
    headers: getAuthHeaders()
  });

export const getTransparenciaById = (id) =>
  axios.get(`${API_URL}/api/transparencia/${id}`, {
    headers: getAuthHeaders()
  });

export const createTransparencia = (data) =>
  axios.post(`${API_URL}/api/transparencia`, data, {
    headers: getAuthHeaders()
  });

export const updateTransparencia = (id, data) =>
  axios.put(`${API_URL}/api/transparencia/${id}`, data, {
    headers: getAuthHeaders()
  });

export const deleteTransparencia = (id) =>
  axios.delete(`${API_URL}/api/transparencia/${id}`, {
    headers: getAuthHeaders()
  });

export const publishTransparencia = (id) =>
  axios.post(`${API_URL}/api/transparencia/${id}/publish`, {}, {
    headers: getAuthHeaders()
  });

export const getTransparenciaYears = () =>
  axios.get(`${API_URL}/api/transparencia/years/list`, {
    headers: getAuthHeaders()
  });

export const getTransparenciaMeses = () =>
  axios.get(`${API_URL}/api/transparencia/meses/list`, {
    headers: getAuthHeaders()
  });

export const getTransparenciaLiterales = () =>
  axios.get(`${API_URL}/api/transparencia/literales/list`, {
    headers: getAuthHeaders()
  });

export const getTransparenciaStatistics = () =>
  axios.get(`${API_URL}/api/transparencia/statistics`, {
    headers: getAuthHeaders()
  });

export const searchTransparencia = (query, params = {}) =>
  axios.get(`${API_URL}/api/transparencia`, {
    params: { search: query, ...params },
    headers: getAuthHeaders()
  });
