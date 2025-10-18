import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

// Función para obtener headers de autenticación
const getAuthHeaders = () => {
  const token = localStorage.getItem('accessToken');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const getNews = (params = {}) =>
  axios.get(`${API_URL}/api/news`, {
    params,
    headers: getAuthHeaders()
  });

export const getNewsById = (id) =>
  axios.get(`${API_URL}/api/news/${id}`, {
    headers: getAuthHeaders()
  });

export const getNewsBySlug = (slug) =>
  axios.get(`${API_URL}/api/news/slug/${slug}`, {
    headers: getAuthHeaders()
  });

export const createNews = (data) =>
  axios.post(`${API_URL}/api/news`, data, {
    headers: getAuthHeaders()
  });

export const updateNews = (id, data) =>
  axios.put(`${API_URL}/api/news/${id}`, data, {
    headers: getAuthHeaders()
  });

export const deleteNews = (id) =>
  axios.delete(`${API_URL}/api/news/${id}`, {
    headers: getAuthHeaders()
  });

export const publishNews = (id) =>
  axios.post(`${API_URL}/api/news/${id}/publish`, {}, {
    headers: getAuthHeaders()
  });

export const getFeaturedNews = () =>
  axios.get(`${API_URL}/api/news/featured/list`, {
    headers: getAuthHeaders()
  });

export const getBreakingNews = () =>
  axios.get(`${API_URL}/api/news/breaking/list`, {
    headers: getAuthHeaders()
  });

export const getUpcomingEvents = () =>
  axios.get(`${API_URL}/api/news/events/upcoming`, {
    headers: getAuthHeaders()
  });

export const searchNews = (query, params = {}) =>
  axios.get(`${API_URL}/api/news`, {
    params: { search: query, ...params },
    headers: getAuthHeaders()
  }); 