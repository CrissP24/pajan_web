import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

// Función para obtener headers de autenticación
const getAuthHeaders = () => {
  const token = localStorage.getItem('accessToken');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

class DocumentService {
  // Obtener todos los documentos
  async getAllDocuments(params = {}) {
    const response = await axios.get(`${API_URL}/api/documents`, { 
      params,
      headers: getAuthHeaders()
    });
    return response.data;
  }

  // Obtener documentos públicos
  async getPublicDocuments(params = {}) {
    const response = await axios.get(`${API_URL}/api/documents/public`, { params });
    return response.data;
  }

  // Obtener documentos por tipo
  async getDocumentsByType(type, params = {}) {
    const response = await axios.get(`${API_URL}/api/documents/type/${type}`, { 
      params,
      headers: getAuthHeaders()
    });
    return response.data;
  }

  // Obtener un documento por ID
  async getDocument(id) {
    const response = await axios.get(`${API_URL}/api/documents/${id}`, {
      headers: getAuthHeaders()
    });
    return response.data;
  }

  // Obtener un documento público por ID
  async getPublicDocument(id) {
    const response = await axios.get(`${API_URL}/api/documents/public/${id}`);
    return response.data;
  }

  // Obtener un documento por slug
  async getDocumentBySlug(slug) {
    const response = await axios.get(`${API_URL}/api/documents/public/slug/${slug}`);
    return response.data;
  }

  // Crear un nuevo documento
  async createDocument(documentData) {
    const response = await axios.post(`${API_URL}/api/documents`, documentData, {
      headers: getAuthHeaders()
    });
    return response.data;
  }

  // Actualizar un documento
  async updateDocument(id, documentData) {
    const response = await axios.put(`${API_URL}/api/documents/${id}`, documentData, {
      headers: getAuthHeaders()
    });
    return response.data;
  }

  // Eliminar un documento
  async deleteDocument(id) {
    const response = await axios.delete(`${API_URL}/api/documents/${id}`, {
      headers: getAuthHeaders()
    });
    return response.data;
  }

  // Publicar un documento
  async publishDocument(id) {
    const response = await axios.post(`${API_URL}/api/documents/${id}/publish`, {}, {
      headers: getAuthHeaders()
    });
    return response.data;
  }

  // Obtener categorías de documentos
  async getCategories() {
    const response = await axios.get(`${API_URL}/api/documents/categories/list`, {
      headers: getAuthHeaders()
    });
    return response.data;
  }

  // Obtener documentos por categoría
  async getDocumentsByCategory(category, params = {}) {
    const response = await axios.get(`${API_URL}/api/documents`, {
      params: { category, ...params },
      headers: getAuthHeaders()
    });
    return response.data;
  }

  // Buscar documentos
  async searchDocuments(query, params = {}) {
    const response = await axios.get(`${API_URL}/api/documents`, {
      params: { search: query, ...params },
      headers: getAuthHeaders()
    });
    return response.data;
  }
}

export default new DocumentService();
