import React, { useState, useEffect } from 'react';
import axios from 'axios';
const API_URL = import.meta.env.VITE_API_URL;

const Transparencia = () => {
  const [years, setYears] = useState([]);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState('ENERO');
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingDoc, setEditingDoc] = useState(null);
  const [formData, setFormData] = useState({
    year: new Date().getFullYear(),
    mes: 'ENERO',
    literal: '',
    titulo: '',
    descripcion: '',
    archivo_url: '',
    orden: 0
  });

  const meses = [
    'ENERO', 'FEBRERO', 'MARZO', 'ABRIL', 'MAYO', 'JUNIO',
    'JULIO', 'AGOSTO', 'SEPTIEMBRE', 'OCTUBRE', 'NOVIEMBRE', 'DICIEMBRE'
  ];

  const literales = [
    'A1', 'A2', 'A3', 'A4', 'B1', 'B2', 'C', 'D', 'E', 'F1', 'F2', 
    'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'S'
  ];

  const titulosLiterales = {
    'A1': 'Organigrama de la Institución',
    'A2': 'Base Legal que rige a la institución',
    'A3': 'Regulaciones y procedimientos internos',
    'A4': 'Metas y objetivos unidades administrativas',
    'B1': 'Directorio de la Institución',
    'B2': 'Distributivo del Personal',
    'C': 'Remuneración mensual por puesto',
    'D': 'Servicios que ofrece y la forma de acceder a ellos',
    'E': 'Texto Íntegro de contratos colectivos vigentes',
    'F1': 'Formularios o formatos de solicitudes',
    'F2': 'Solicitud de acceso a la información pública',
    'G': 'Presupuesto de la Institución',
    'H': 'Resultados de Auditorías Internas y Gubernamentales',
    'I': 'Procesos de contrataciones',
    'J': 'Empresas y personas que han incumplido contratos',
    'K': 'Planes y programas en ejecución',
    'L': 'Contratos de crédito externos o internos',
    'M': 'Mecanismos de rendición de cuentas a la ciudadanía',
    'N': 'Viáticos, Informes De Trabajo y Justificativos',
    'O': 'Responsable de atender la información pública',
    'S': 'Organismos seccionales, resoluciones, actas y planes de desarrollo'
  };

  useEffect(() => {
    checkUser();
    loadYears();
  }, []);

  useEffect(() => {
    if (selectedYear && selectedMonth) {
      loadDocuments(selectedYear, selectedMonth);
    }
  }, [selectedYear, selectedMonth]);

  const checkUser = () => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      axios.get(`${API_URL}/api/auth/me`, {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(res => setUser(res.data.data || res.data))
        .catch(() => setUser(null));
    }
  };

  const loadYears = () => {
    axios.get(`${API_URL}/api/transparencia/years/list`)
      .then(res => {
        const data = res.data.data || res.data;
        setYears(data.map(item => item));
        if (data.length > 0 && !selectedYear) {
          setSelectedYear(data[0]);
        }
      })
      .catch(err => console.error('Error cargando años:', err))
      .finally(() => setLoading(false));
  };

  const loadDocuments = (year, month) => {
    setLoading(true);
    axios.get(`${API_URL}/api/transparencia`, {
      params: { year, mes: month, limit: 200 }
    })
      .then(res => {
        const data = res.data.data || res.data;
        // backend devuelve { success: true, data: { transparencia: [...], pagination: {...} } }
        const docs = data.transparencia || data;
        setDocuments(docs);
      })
      .catch(err => console.error('Error cargando documentos:', err))
      .finally(() => setLoading(false));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const token = localStorage.getItem('accessToken');
    
    if (editingDoc) {
      axios.put(`${API_URL}/api/transparencia/${editingDoc.id}`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(() => {
          setShowForm(false);
          setEditingDoc(null);
          resetForm();
          loadDocuments(selectedYear, selectedMonth);
        })
        .catch(err => alert('Error al actualizar documento'));
    } else {
      axios.post(`${API_URL}/api/transparencia`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(() => {
          setShowForm(false);
          resetForm();
          loadDocuments(selectedYear, selectedMonth);
        })
        .catch(err => alert('Error al crear documento'));
    }
  };

  const handleEdit = (doc) => {
    setEditingDoc(doc);
    setFormData({
      year: doc.year,
      mes: doc.mes,
      literal: doc.literal,
      titulo: doc.titulo,
      descripcion: doc.descripcion || '',
      archivo_url: doc.archivo_url || '',
      orden: doc.orden
    });
    setShowForm(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('¿Está seguro de eliminar este documento?')) {
      const token = localStorage.getItem('accessToken');
      axios.delete(`${API_URL}/api/transparencia/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(() => loadDocuments(selectedYear, selectedMonth))
        .catch(err => alert('Error al eliminar documento'));
    }
  };

  const resetForm = () => {
    setFormData({
      year: selectedYear,
      mes: selectedMonth,
      literal: '',
      titulo: '',
      descripcion: '',
      archivo_url: '',
      orden: 0
    });
  };

  const canEdit = user && (user.roles.includes('ROLE_ADMIN') || user.roles.includes('ROLE_TIC'));

  return (
    <div className="container mt-4">
      <h2>Transparencia - LOTAIP</h2>
      <p className="text-muted">
        La Ley Orgánica de Transparencia y Acceso a la Información Pública (LOTAIP) 
        obliga a todas las instituciones del Estado que conforman el sector público 
        a difundir a través de la página web institucional información mínima actualizada 
        de naturaleza obligatoria.
      </p>
      <hr />

      {/* Selectores de año y mes */}
      <div className="row mb-4">
        <div className="col-md-4">
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
        <div className="col-md-4">
          <label className="form-label">Seleccionar Mes:</label>
          <select 
            className="form-select" 
            value={selectedMonth} 
            onChange={(e) => setSelectedMonth(e.target.value)}
          >
            {meses.map(mes => (
              <option key={mes} value={mes}>{mes}</option>
            ))}
          </select>
        </div>
        {canEdit && (
          <div className="col-md-4 text-end">
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
                <div className="col-md-3 mb-3">
                  <label className="form-label">Año</label>
                  <input
                    type="number"
                    className="form-control"
                    value={formData.year}
                    onChange={(e) => setFormData({...formData, year: parseInt(e.target.value)})}
                    required
                  />
                </div>
                <div className="col-md-3 mb-3">
                  <label className="form-label">Mes</label>
                  <select
                    className="form-select"
                    value={formData.mes}
                    onChange={(e) => setFormData({...formData, mes: e.target.value})}
                    required
                  >
                    {meses.map(mes => (
                      <option key={mes} value={mes}>{mes}</option>
                    ))}
                  </select>
                </div>
                <div className="col-md-3 mb-3">
                  <label className="form-label">Literal</label>
                  <select
                    className="form-select"
                    value={formData.literal}
                    onChange={(e) => {
                      const literal = e.target.value;
                      setFormData({
                        ...formData, 
                        literal: literal,
                        titulo: titulosLiterales[literal] || ''
                      });
                    }}
                    required
                  >
                    <option value="">Seleccionar literal</option>
                    {literales.map(literal => (
                      <option key={literal} value={literal}>
                        Literal {literal}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-md-3 mb-3">
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
        <div className="card">
          <div className="card-header">
            <h5 className="mb-0">AÑO {selectedYear} - {selectedMonth}</h5>
          </div>
          <div className="card-body">
            {documents.length === 0 ? (
              <p className="text-muted">No hay documentos disponibles para este mes.</p>
            ) : (
              <div className="list-group">
                {documents.map(doc => (
                  <div key={doc.id} className="list-group-item d-flex justify-content-between align-items-center">
                    <div>
                      <h6 className="mb-1">
                        Literal {doc.literal}.- {doc.titulo}
                      </h6>
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
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Transparencia;
