import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Button, Badge, Modal, Form, Alert } from 'react-bootstrap';
import { Plus, Edit, Trash2, Eye, Upload, Download, FileText, Image, Video, Music } from 'lucide-react';
import documentService from '../services/documentService';
import attachmentService from '../services/attachmentService';
import { useNavigate } from 'react-router-dom';

const DocumentManagement = () => {
  const [documents, setDocuments] = useState([]);
  const [attachments, setAttachments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingDocument, setEditingDocument] = useState(null);
  const [showAttachmentModal, setShowAttachmentModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [userRole, setUserRole] = useState('');
  const [currentType, setCurrentType] = useState('all');
  const navigate = useNavigate();

  const token = localStorage.getItem('accessToken');
  const userRoles = JSON.parse(localStorage.getItem('userRoles') || '[]');

  useEffect(() => {
    if (userRoles.includes('admin')) {
      setUserRole('admin');
      setCurrentType('all'); // Admin ve todo
    } else if (userRoles.includes('tic')) {
      setUserRole('tic');
      setCurrentType('all'); // TIC ve todo (gestión completa de la página web)
    } else if (userRoles.includes('comunicacion')) {
      setUserRole('comunicacion');
      setCurrentType('news');
    } else if (userRoles.includes('participacion')) {
      setUserRole('participacion');
      setCurrentType('participation');
    } else if (userRoles.includes('transparencia')) {
      setUserRole('transparencia');
      setCurrentType('transparency');
    }
    
    loadDocuments();
    loadAttachments();
  }, [currentType]);

  const loadDocuments = async () => {
    try {
      setLoading(true);
      let response;
      
      switch (userRole) {
        case 'admin':
        case 'tic':
          // Admin y TIC ven todos los documentos
          response = await documentService.getAllDocuments({ type: currentType }, token);
          break;
        case 'comunicacion':
          response = await documentService.getComunicacionNews(token);
          break;
        case 'participacion':
          response = await documentService.getParticipacionActivities(token);
          break;
        case 'transparencia':
          response = await documentService.getTransparenciaDocuments(token);
          break;
        default:
          response = await documentService.getAllDocuments({ type: currentType }, token);
      }
      
      setDocuments(response.documents || response);
    } catch (err) {
      setError('Error al cargar documentos: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const loadAttachments = async () => {
    try {
      const response = await attachmentService.getAllAttachments({}, token);
      setAttachments(response.attachments || response);
    } catch (err) {
      console.error('Error al cargar archivos adjuntos:', err);
    }
  };

  const handleCreateDocument = () => {
    setEditingDocument(null);
    setShowModal(true);
  };

  const handleEditDocument = (document) => {
    setEditingDocument(document);
    setShowModal(true);
  };

  const handleDeleteDocument = async (id) => {
    if (window.confirm('¿Está seguro de que desea eliminar este documento?')) {
      try {
        await documentService.deleteDocument(id, token);
        loadDocuments();
      } catch (err) {
        setError('Error al eliminar documento: ' + err.message);
      }
    }
  };

  const handleTogglePublish = async (id) => {
    try {
      await documentService.togglePublish(id, token);
      loadDocuments();
    } catch (err) {
      setError('Error al cambiar estado: ' + err.message);
    }
  };

  const handleSaveDocument = async (documentData) => {
    try {
      if (editingDocument) {
        await documentService.updateDocument(editingDocument.id, documentData, token);
      } else {
        await documentService.createDocument(documentData, token);
      }
      setShowModal(false);
      loadDocuments();
    } catch (err) {
      setError('Error al guardar documento: ' + err.message);
    }
  };

  const handleFileUpload = async () => {
    if (!selectedFile) return;
    
    try {
      await attachmentService.uploadFile(selectedFile, '', null, token);
      setShowAttachmentModal(false);
      setSelectedFile(null);
      loadAttachments();
    } catch (err) {
      setError('Error al subir archivo: ' + err.message);
    }
  };

  const handleDownloadAttachment = async (attachment) => {
    try {
      const blob = await attachmentService.downloadAttachment(attachment.id, token);
      attachmentService.downloadFile(blob, attachment.originalName);
    } catch (err) {
      setError('Error al descargar archivo: ' + err.message);
    }
  };

  const getTypeLabel = (type) => {
    const labels = {
      'page': 'Página Web',
      'news': 'Noticia',
      'communication': 'Comunicado',
      'participation': 'Participación',
      'transparency': 'Transparencia',
      'service': 'Servicio',
      'regulation': 'Reglamento'
    };
    return labels[type] || type;
  };

  const getStatusBadge = (status) => {
    const variants = {
      'draft': 'secondary',
      'published': 'success',
      'archived': 'warning'
    };
    return <Badge bg={variants[status]}>{status}</Badge>;
  };

  const getFileIcon = (type) => {
    switch (type) {
      case 'image':
        return <Image size={20} />;
      case 'video':
        return <Video size={20} />;
      case 'audio':
        return <Music size={20} />;
      default:
        return <FileText size={20} />;
    }
  };

  if (loading) {
    return <div className="text-center p-5">Cargando...</div>;
  }

  return (
    <div className="container-fluid p-4">
             <div className="d-flex justify-content-between align-items-center mb-4">
         <h2>
           {userRole === 'admin' ? 'Administración del Sistema' : 
            userRole === 'tic' ? 'Gestión Completa de la Página Web' :
            `Gestión Documental - ${userRole.toUpperCase()}`}
         </h2>
        <div>
          <Button variant="primary" onClick={handleCreateDocument} className="me-2">
            <Plus size={20} className="me-2" />
            Nuevo Documento
          </Button>
          <Button variant="outline-primary" onClick={() => setShowAttachmentModal(true)}>
            <Upload size={20} className="me-2" />
            Subir Archivo
          </Button>
        </div>
      </div>

      {error && <Alert variant="danger" onClose={() => setError('')} dismissible>{error}</Alert>}

      <Row>
        <Col md={8}>
          <Card>
            <Card.Header>
              <h5>Documentos</h5>
            </Card.Header>
            <Card.Body>
              {documents.length === 0 ? (
                <p className="text-muted">No hay documentos disponibles.</p>
              ) : (
                <div className="table-responsive">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Título</th>
                        <th>Tipo</th>
                        <th>Estado</th>
                        <th>Fecha</th>
                        <th>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {documents.map((doc) => (
                        <tr key={doc.id}>
                          <td>{doc.title}</td>
                          <td>{getTypeLabel(doc.type)}</td>
                          <td>{getStatusBadge(doc.status)}</td>
                          <td>{new Date(doc.createdAt).toLocaleDateString()}</td>
                          <td>
                            <Button
                              variant="outline-primary"
                              size="sm"
                              className="me-1"
                              onClick={() => navigate(`/document/${doc.slug}`)}
                            >
                              <Eye size={16} />
                            </Button>
                            <Button
                              variant="outline-warning"
                              size="sm"
                              className="me-1"
                              onClick={() => handleEditDocument(doc)}
                            >
                              <Edit size={16} />
                            </Button>
                            <Button
                              variant="outline-success"
                              size="sm"
                              className="me-1"
                              onClick={() => handleTogglePublish(doc.id)}
                            >
                              {doc.status === 'published' ? 'Despublicar' : 'Publicar'}
                            </Button>
                            <Button
                              variant="outline-danger"
                              size="sm"
                              onClick={() => handleDeleteDocument(doc.id)}
                            >
                              <Trash2 size={16} />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          <Card>
            <Card.Header>
              <h5>Archivos Adjuntos</h5>
            </Card.Header>
            <Card.Body>
              {attachments.length === 0 ? (
                <p className="text-muted">No hay archivos adjuntos.</p>
              ) : (
                <div>
                  {attachments.slice(0, 10).map((attachment) => (
                    <div key={attachment.id} className="d-flex align-items-center p-2 border-bottom">
                      <div className="me-2">
                        {getFileIcon(attachment.type)}
                      </div>
                      <div className="flex-grow-1">
                        <small className="d-block text-truncate">{attachment.originalName}</small>
                        <small className="text-muted">
                          {(attachment.size / 1024 / 1024).toFixed(2)} MB
                        </small>
                      </div>
                      <Button
                        variant="outline-primary"
                        size="sm"
                        onClick={() => handleDownloadAttachment(attachment)}
                      >
                        <Download size={16} />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Modal para crear/editar documento */}
      <DocumentModal
        show={showModal}
        onHide={() => setShowModal(false)}
        document={editingDocument}
        onSave={handleSaveDocument}
        userRole={userRole}
      />

      {/* Modal para subir archivo */}
      <AttachmentModal
        show={showAttachmentModal}
        onHide={() => setShowAttachmentModal(false)}
        onUpload={handleFileUpload}
        selectedFile={selectedFile}
        onFileSelect={setSelectedFile}
      />
    </div>
  );
};

// Componente Modal para Documentos
const DocumentModal = ({ show, onHide, document, onSave, userRole }) => {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    type: 'page',
    category: '',
    status: 'draft',
    isPublic: true
  });

  useEffect(() => {
    if (document) {
      setFormData({
        title: document.title || '',
        content: document.content || '',
        type: document.type || 'page',
        category: document.category || '',
        status: document.status || 'draft',
        isPublic: document.isPublic !== undefined ? document.isPublic : true
      });
    } else {
      setFormData({
        title: '',
        content: '',
        type: userRole === 'tic' ? 'page' : userRole === 'comunicacion' ? 'news' : 'participation',
        category: '',
        status: 'draft',
        isPublic: true
      });
    }
  }, [document, userRole]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  const getTypeOptions = () => {
    const options = {
      'tic': ['page', 'news', 'communication', 'participation', 'transparency', 'service', 'regulation'], // TIC puede crear cualquier tipo
      'comunicacion': ['news', 'communication'],
      'participacion': ['participation'],
      'transparencia': ['transparency'],
      'admin': ['page', 'news', 'communication', 'participation', 'transparency', 'service', 'regulation']
    };
    return options[userRole] || ['page'];
  };

  return (
    <Modal show={show} onHide={onHide} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>{document ? 'Editar' : 'Crear'} Documento</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Título</Form.Label>
            <Form.Control
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Tipo</Form.Label>
            <Form.Select
              value={formData.type}
              onChange={(e) => setFormData({...formData, type: e.target.value})}
            >
              {getTypeOptions().map(type => (
                <option key={type} value={type}>
                  {type === 'page' ? 'Página Web' :
                   type === 'news' ? 'Noticia' :
                   type === 'communication' ? 'Comunicado' :
                   type === 'participation' ? 'Participación' :
                   type === 'transparency' ? 'Transparencia' :
                   type === 'service' ? 'Servicio' :
                   type === 'regulation' ? 'Reglamento' : type}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Categoría</Form.Label>
            <Form.Control
              type="text"
              value={formData.category}
              onChange={(e) => setFormData({...formData, category: e.target.value})}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Contenido</Form.Label>
            <Form.Control
              as="textarea"
              rows={10}
              value={formData.content}
              onChange={(e) => setFormData({...formData, content: e.target.value})}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Estado</Form.Label>
            <Form.Select
              value={formData.status}
              onChange={(e) => setFormData({...formData, status: e.target.value})}
            >
              <option value="draft">Borrador</option>
              <option value="published">Publicado</option>
              <option value="archived">Archivado</option>
            </Form.Select>
          </Form.Group>

          <Form.Check
            type="checkbox"
            label="Público"
            checked={formData.isPublic}
            onChange={(e) => setFormData({...formData, isPublic: e.target.checked})}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onHide}>
            Cancelar
          </Button>
          <Button variant="primary" type="submit">
            {document ? 'Actualizar' : 'Crear'}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

// Componente Modal para Archivos
const AttachmentModal = ({ show, onHide, onUpload, selectedFile, onFileSelect }) => {
  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Subir Archivo</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form.Group>
          <Form.Label>Seleccionar Archivo</Form.Label>
          <Form.Control
            type="file"
            onChange={(e) => onFileSelect(e.target.files[0])}
            accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.xls,.xlsx,.txt"
          />
        </Form.Group>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Cancelar
        </Button>
        <Button variant="primary" onClick={onUpload} disabled={!selectedFile}>
          Subir
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default DocumentManagement;
