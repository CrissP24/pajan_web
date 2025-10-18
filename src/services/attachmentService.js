import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

// Función para obtener headers de autenticación
const getAuthHeaders = () => {
  const token = localStorage.getItem('accessToken');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const uploadAttachment = (file, data = {}) => {
  const formData = new FormData();
  formData.append('file', file);
  
  // Agregar datos adicionales
  Object.keys(data).forEach(key => {
    formData.append(key, data[key]);
  });

  return axios.post(`${API_URL}/api/attachments/upload`, formData, {
    headers: {
      ...getAuthHeaders(),
      'Content-Type': 'multipart/form-data'
    }
  });
};

export const getAttachments = (params = {}) =>
  axios.get(`${API_URL}/api/attachments`, {
    params,
    headers: getAuthHeaders()
  });

export const getAttachmentById = (id) =>
  axios.get(`${API_URL}/api/attachments/${id}`, {
    headers: getAuthHeaders()
  });

export const downloadAttachment = (id) =>
  axios.get(`${API_URL}/api/attachments/${id}/download`, {
    headers: getAuthHeaders(),
    responseType: 'blob'
  });

export const updateAttachment = (id, data) =>
  axios.put(`${API_URL}/api/attachments/${id}`, data, {
    headers: getAuthHeaders()
  });

export const deleteAttachment = (id) =>
  axios.delete(`${API_URL}/api/attachments/${id}`, {
    headers: getAuthHeaders()
  });

export const getAttachmentCategories = () =>
  axios.get(`${API_URL}/api/attachments/categories/list`, {
    headers: getAuthHeaders()
  });

export const searchAttachments = (query, params = {}) =>
  axios.get(`${API_URL}/api/attachments`, {
    params: { search: query, ...params },
    headers: getAuthHeaders()
  });