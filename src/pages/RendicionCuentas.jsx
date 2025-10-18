import React, { useState, useEffect } from 'react';
import axios from 'axios';
const API_URL = import.meta.env.VITE_API_URL;

const RendicionCuentas = () => {
  const [years, setYears] = useState([]);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingDoc, setEditingDoc] = useState(null);
  const [formData, setFormData] = useState({
    year: new Date().getFullYear(),
    fase: '',
    titulo: '',
    descripcion: '',
    archivo_url: '',
    orden: 0
  });

  useEffect(() => {
    checkUser();
    loadYears();
  }, []);

  useEffect(() => {
    if (selectedYear) {
      loadDocuments(selectedYear);
    }
  }, [selectedYear]);

  const checkUser = () => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.get(`${API_URL}/api/auth/me`, {
        headers: { 'x-access-token': token }
      })
        .then(res => setUser(res.data))
        .catch(() => setUser(null));
    }
  };

  const loadYears = () => {
    axios.get(`${API_URL}/api/rendicion-cuentas/years`)
      .then(res => {
        setYears(res.data.map(item => item.year));
        if (res.data.length > 0 && !selectedYear) {
          setSelectedYear(res.data[0].year);
        }
      })
      .catch(err => console.error('Error cargando años:', err))
      .finally(() => setLoading(false));
  };

  const loadDocuments = (year) => {
    setLoading(true);
    axios.get(`${API_URL}/api/rendicion-cuentas/year/${year}`)
      .then(res => setDocuments(res.data))
      .catch(err => console.error('Error cargando documentos:', err))
      .finally(() => setLoading(false));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    
    if (editingDoc) {
      axios.put(`${API_URL}/api/rendicion-cuentas/${editingDoc.id}`, formData, {
        headers: { 'x-access-token': token }
      })
        .then(() => {
          setShowForm(false);
          setEditingDoc(null);
          resetForm();
          loadDocuments(selectedYear);
        })
        .catch(err => alert('Error al actualizar documento'));
    } else {
      axios.post(`${API_URL}/api/rendicion-cuentas`, formData, {
        headers: { 'x-access-token': token }
      })
        .then(() => {
          setShowForm(false);
          resetForm();
          loadDocuments(selectedYear);
        })
        .catch(err => alert('Error al crear documento'));
    }
  };

  const handleEdit = (doc) => {
    setEditingDoc(doc);
    setFormData({
      year: doc.year,
      fase: doc.fase,
      titulo: doc.titulo,
      descripcion: doc.descripcion || '',
      archivo_url: doc.archivo_url || '',
      orden: doc.orden
    });
    setShowForm(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('¿Está seguro de eliminar este documento?')) {
      const token = localStorage.getItem('token');
      axios.delete(`${API_URL}/api/rendicion-cuentas/${id}`, {
        headers: { 'x-access-token': token }
      })
        .then(() => loadDocuments(selectedYear))
        .catch(err => alert('Error al eliminar documento'));
    }
  };

  const resetForm = () => {
    setFormData({
      year: selectedYear,
      fase: '',
      titulo: '',
      descripcion: '',
      archivo_url: '',
      orden: 0
    });
  };

  const canEdit = user && (user.roles.includes('ROLE_ADMIN') || user.roles.includes('ROLE_TIC'));

  const fases = [
    'FASE 1: PLANIFICACIÓN Y FACILITACIÓN DEL PROCESO POR LA CIUDADANÍA',
    'FASE 2: EVALUACIÓN DE LA GESTIÓN INSTITUCIONAL Y ELABORACIÓN DEL INFORME DE RENDICIÓN DE CUENTAS',
    'FASE 3: DELIBERACIÓN PÚBLICA Y EVALUACIÓN CIUDADANA DEL INFORME DE RENDICIÓN DE CUENTAS',
    'FASE 4: INCORPORACIÓN DE LA OPINIÓN CIUDADANA, RETROALIMENTACIÓN Y SEGUIMIENTO'
  ];

  return (
    <div className="container mt-4">
      <h2>Rendición de Cuentas</h2>
      <hr />

      {/* Selector de año */}
      <div className="row mb-4">
        <div className="col-md-6">
          <label className="form-label">Seleccionar Año:</label>
          <select 
            className="form-select" 
            value={selectedYear} 
            onChange={(e) => setSelectedYear(parseInt(e.target.value))}
          >
            {years.map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>
        {canEdit && (
          <div className="col-md-6 text-end">
            <button 
              className="btn btn-primary" 
              onClick={() => {
                setShowForm(true);
                setEditingDoc(null);
                resetForm();
              }}
            >
              Agregar Documento
            </button>
          </div>
        )}
      </div>

      {/* Formulario de edición/creación */}
      {showForm && canEdit && (
        <div className="card mb-4">
          <div className="card-body">
            <h5 className="card-title">
              {editingDoc ? 'Editar Documento' : 'Nuevo Documento'}
            </h5>
            <form onSubmit={handleSubmit}>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">Año</label>
                  <input
                    type="number"
                    className="form-control"
                    value={formData.year}
                    onChange={(e) => setFormData({...formData, year: parseInt(e.target.value)})}
                    required
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">Orden</label>
                  <input
                    type="number"
                    className="form-control"
                    value={formData.orden}
                    onChange={(e) => setFormData({...formData, orden: parseInt(e.target.value)})}
                    required
                  />
                </div>
              </div>
              <div className="mb-3">
                <label className="form-label">Fase</label>
                <select
                  className="form-select"
                  value={formData.fase}
                  onChange={(e) => setFormData({...formData, fase: e.target.value})}
                  required
                >
                  <option value="">Seleccionar fase</option>
                  {fases.map(fase => (
                    <option key={fase} value={fase}>{fase}</option>
                  ))}
                </select>
              </div>
              <div className="mb-3">
                <label className="form-label">Título</label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.titulo}
                  onChange={(e) => setFormData({...formData, titulo: e.target.value})}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Descripción</label>
                <textarea
                  className="form-control"
                  value={formData.descripcion}
                  onChange={(e) => setFormData({...formData, descripcion: e.target.value})}
                  rows="3"
                />
              </div>
              <div className="mb-3">
                <label className="form-label">URL del Archivo PDF</label>
                <input
                  type="url"
                  className="form-control"
                  value={formData.archivo_url}
                  onChange={(e) => setFormData({...formData, archivo_url: e.target.value})}
                  placeholder="https://ejemplo.com/documento.pdf"
                />
              </div>
              <div className="d-flex gap-2">
                <button type="submit" className="btn btn-success">
                  {editingDoc ? 'Actualizar' : 'Crear'}
                </button>
                <button 
                  type="button" 
                  className="btn btn-secondary"
                  onClick={() => {
                    setShowForm(false);
                    setEditingDoc(null);
                    resetForm();
                  }}
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Lista de documentos */}
      {loading ? (
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
        </div>
      ) : (
        <div>
          {fases.map(fase => {
            const faseDocs = documents.filter(doc => doc.fase === fase);
            if (faseDocs.length === 0) return null;
            
            return (
              <div key={fase} className="card mb-4">
                <div className="card-header">
                  <h5 className="mb-0">{fase}</h5>
                </div>
                <div className="card-body">
                  <div className="list-group">
                    {faseDocs.map(doc => (
                      <div key={doc.id} className="list-group-item d-flex justify-content-between align-items-center">
                        <div>
                          <h6 className="mb-1">{doc.titulo}</h6>
                          {doc.descripcion && <p className="mb-1 text-muted">{doc.descripcion}</p>}
                        </div>
                        <div className="d-flex gap-2">
                          {doc.archivo_url && (
                            <a 
                              href={doc.archivo_url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="btn btn-sm btn-primary"
                            >
                              Ver PDF
                            </a>
                          )}
                          {canEdit && (
                            <>
                              <button 
                                className="btn btn-sm btn-warning"
                                onClick={() => handleEdit(doc)}
                              >
                                Editar
                              </button>
                              <button 
                                className="btn btn-sm btn-danger"
                                onClick={() => handleDelete(doc.id)}
                              >
                                Eliminar
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default RendicionCuentas;
