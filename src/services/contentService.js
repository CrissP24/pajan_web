import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

// Función para obtener headers de autenticación
const getAuthHeaders = () => {
  const token = localStorage.getItem('accessToken');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const getContentBySection = (section) =>
  axios.get(`${API_URL}/api/content`, {
    params: { section },
    headers: getAuthHeaders()
  });

export const getAllContent = (params = {}) =>
  axios.get(`${API_URL}/api/content`, {
    params,
    headers: getAuthHeaders()
  });

export const getContentById = (id) =>
  axios.get(`${API_URL}/api/content/${id}`, {
    headers: getAuthHeaders()
  });

export const getContentBySlug = (slug) =>
  axios.get(`${API_URL}/api/content/slug/${slug}`, {
    headers: getAuthHeaders()
  });

export const createContent = (data) =>
  axios.post(`${API_URL}/api/content`, data, {
    headers: getAuthHeaders()
  });

export const updateContent = (id, data) =>
  axios.put(`${API_URL}/api/content/${id}`, data, {
    headers: getAuthHeaders()
  });

export const deleteContent = (id) =>
  axios.delete(`${API_URL}/api/content/${id}`, {
    headers: getAuthHeaders()
  });

export const publishContent = (id) =>
  axios.post(`${API_URL}/api/content/${id}/publish`, {}, {
    headers: getAuthHeaders()
  });

export const unpublishContent = (id) =>
  axios.post(`${API_URL}/api/content/${id}/unpublish`, {}, {
    headers: getAuthHeaders()
  });

export const getSections = () =>
  axios.get(`${API_URL}/api/content/sections/list`, {
    headers: getAuthHeaders()
  }); 