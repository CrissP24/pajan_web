import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Button, Badge, Modal, Form, Alert, Nav, Tab, Container, Breadcrumb } from 'react-bootstrap';
import { Plus, Edit, Trash2, Eye, Upload, Download, FileText, Image, Video, Music, MessageSquare, Newspaper, Users, Home, ChevronRight, TrendingUp, Calendar, FileArchive } from 'lucide-react';
import documentService from '../services/documentService';
import attachmentService from '../services/attachmentService';
import { useNavigate } from 'react-router-dom';

const ComunicacionDashboard = ({ user, handleLogout }) => {
  const [documents, setDocuments] = useState([]);
  const [attachments, setAttachments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingDocument, setEditingDocument] = useState(null);
  const [showAttachmentModal, setShowAttachmentModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const navigate = useNavigate();

  const token = localStorage.getItem('accessToken');

  useEffect(() => {
    loadDocuments();
    loadAttachments();
  }, [activeTab]);

  const loadDocuments = async () => {
    try {
      setLoading(true);
      const response = await documentService.getComunicacionNews(token);
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

  const getDocumentTypeIcon = (type) => {
    switch (type) {
      case 'news':
        return <Newspaper size={16} />;
      case 'communication':
        return <MessageSquare size={16} />;
      default:
        return <FileText size={16} />;
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
          <p className="mt-3 text-muted">Cargando dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-light min-vh-100">
      {/* Header */}
      <div className="bg-white border-bottom shadow-sm">
        <Container fluid>
          <div className="d-flex justify-content-between align-items-center py-3">
            <div>
              <Breadcrumb className="mb-0">
                <Breadcrumb.Item href="/">
                  <Home size={16} className="me-1" />
                  Inicio
                </Breadcrumb.Item>
                <Breadcrumb.Item active>
                  <ChevronRight size={16} className="me-1" />
                  Gestión de Comunicaciones
                </Breadcrumb.Item>
              </Breadcrumb>
              <h2 className="mb-0 text-primary">
                <MessageSquare size={24} className="me-2" />
                Dashboard Comunicación
              </h2>
              <p className="text-muted mb-0">Bienvenido, {user?.username}</p>
            </div>
            <div>
              <Button variant="outline-danger" onClick={handleLogout} className="d-flex align-items-center">
                <Users size={16} className="me-2" />
                Cerrar Sesión
              </Button>
            </div>
          </div>
        </Container>
      </div>

      <Container fluid className="py-4">
        {error && <Alert variant="danger" onClose={() => setError('')} dismissible>{error}</Alert>}

        {/* Stats Cards */}
        <Row className="mb-4">
          <Col md={3}>
            <Card className="border-0 shadow-sm h-100">
              <Card.Body className="text-center">
                <div className="bg-primary bg-opacity-10 rounded-circle d-inline-flex p-3 mb-3">
                  <Newspaper size={24} className="text-primary" />
                </div>
                <h4 className="mb-1">{documents.filter(d => d.type === 'news').length}</h4>
                <p className="text-muted mb-0">Noticias</p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="border-0 shadow-sm h-100">
              <Card.Body className="text-center">
                <div className="bg-success bg-opacity-10 rounded-circle d-inline-flex p-3 mb-3">
                  <MessageSquare size={24} className="text-success" />
                </div>
                <h4 className="mb-1">{documents.filter(d => d.type === 'communication').length}</h4>
                <p className="text-muted mb-0">Comunicados</p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="border-0 shadow-sm h-100">
              <Card.Body className="text-center">
                <div className="bg-warning bg-opacity-10 rounded-circle d-inline-flex p-3 mb-3">
                  <TrendingUp size={24} className="text-warning" />
                </div>
                <h4 className="mb-1">{documents.filter(d => d.status === 'published').length}</h4>
                <p className="text-muted mb-0">Publicados</p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="border-0 shadow-sm h-100">
              <Card.Body className="text-center">
                <div className="bg-info bg-opacity-10 rounded-circle d-inline-flex p-3 mb-3">
                  <FileArchive size={24} className="text-info" />
                </div>
                <h4 className="mb-1">{attachments.length}</h4>
                <p className="text-muted mb-0">Archivos</p>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Navigation Tabs */}
        <Card className="border-0 shadow-sm">
          <Card.Header className="bg-white border-0">
            <Nav variant="tabs" className="border-0" activeKey={activeTab} onSelect={(k) => setActiveTab(k)}>
              <Nav.Item>
                <Nav.Link eventKey="overview" className="border-0">
                  <TrendingUp size={16} className="me-2" />
                  Vista General
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="news" className="border-0">
                  <Newspaper size={16} className="me-2" />
                  Noticias
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="communications" className="border-0">
                  <MessageSquare size={16} className="me-2" />
                  Comunicados
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="attachments" className="border-0">
                  <FileArchive size={16} className="me-2" />
                  Archivos
                </Nav.Link>
              </Nav.Item>
            </Nav>
          </Card.Header>
          <Card.Body className="p-0">
            <Tab.Content>
              {/* Overview Tab */}
              <Tab.Pane active={activeTab === 'overview'} className="p-4">
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h4>Vista General de Comunicaciones</h4>
                  <Button variant="primary" onClick={handleCreateDocument} className="d-flex align-items-center">
                    <Plus size={20} className="me-2" />
                    Nuevo Contenido
                  </Button>
                </div>
                
                <Row>
                  <Col md={8}>
                    <Card className="border-0 shadow-sm">
                      <Card.Header className="bg-white">
                        <h6 className="mb-0">Contenido Reciente</h6>
                      </Card.Header>
                      <Card.Body>
                        {documents.length === 0 ? (
                          <p className="text-muted text-center py-4">No hay contenido disponible.</p>
                        ) : (
                          <div className="table-responsive">
                            <table className="table table-hover">
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
                                {documents.slice(0, 5).map((doc) => (
                                  <tr key={doc.id}>
                                    <td>
                                      <div className="d-flex align-items-center">
                                        {getDocumentTypeIcon(doc.type)}
                                        <span className="ms-2">{doc.title}</span>
                                      </div>
                                    </td>
                                    <td>
                                      <Badge bg="light" text="dark">{doc.type}</Badge>
                                    </td>
                                    <td>{getStatusBadge(doc.status)}</td>
                                    <td>{new Date(doc.createdAt).toLocaleDateString()}</td>
                                    <td>
                                      <Button
                                        variant="outline-primary"
                                        size="sm"
                                        className="me-1"
                                        onClick={() => navigate(`/document/${doc.slug}`)}
                                      >
                                        <Eye size={14} />
                                      </Button>
                                      <Button
                                        variant="outline-warning"
                                        size="sm"
                                        className="me-1"
                                        onClick={() => handleEditDocument(doc)}
                                      >
                                        <Edit size={14} />
                                      </Button>
                                      <Button
                                        variant="outline-danger"
                                        size="sm"
                                        onClick={() => handleDeleteDocument(doc.id)}
                                      >
                                        <Trash2 size={14} />
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
                    <Card className="border-0 shadow-sm">
                      <Card.Header className="bg-white">
                        <h6 className="mb-0">Acciones Rápidas</h6>
                      </Card.Header>
                      <Card.Body>
                        <div className="d-grid gap-2">
                          <Button variant="outline-primary" onClick={handleCreateDocument}>
                            <Plus size={16} className="me-2" />
                            Crear Noticia
                          </Button>
                          <Button variant="outline-success" onClick={handleCreateDocument}>
                            <MessageSquare size={16} className="me-2" />
                            Crear Comunicado
                          </Button>
                          <Button variant="outline-info" onClick={() => setShowAttachmentModal(true)}>
                            <Upload size={16} className="me-2" />
                            Subir Archivo
                          </Button>
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>
                </Row>
              </Tab.Pane>

              {/* News Tab */}
              <Tab.Pane active={activeTab === 'news'} className="p-4">
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h4>Gestión de Noticias</h4>
                  <Button variant="primary" onClick={handleCreateDocument} className="d-flex align-items-center">
                    <Plus size={20} className="me-2" />
                    Nueva Noticia
                  </Button>
                </div>
                
                <Card className="border-0 shadow-sm">
                  <Card.Body>
                    {documents.filter(d => d.type === 'news').length === 0 ? (
                      <p className="text-muted text-center py-4">No hay noticias disponibles.</p>
                    ) : (
                      <div className="table-responsive">
                        <table className="table table-hover">
                          <thead>
                            <tr>
                              <th>Título</th>
                              <th>Estado</th>
                              <th>Fecha</th>
                              <th>Acciones</th>
                            </tr>
                          </thead>
                          <tbody>
                            {documents.filter(d => d.type === 'news').map((doc) => (
                              <tr key={doc.id}>
                                <td>
                                  <div className="d-flex align-items-center">
                                    <Newspaper size={16} className="me-2" />
                                    {doc.title}
                                  </div>
                                </td>
                                <td>{getStatusBadge(doc.status)}</td>
                                <td>{new Date(doc.createdAt).toLocaleDateString()}</td>
                                <td>
                                  <Button
                                    variant="outline-primary"
                                    size="sm"
                                    className="me-1"
                                    onClick={() => navigate(`/document/${doc.slug}`)}
                                  >
                                    <Eye size={14} />
                                  </Button>
                                  <Button
                                    variant="outline-warning"
                                    size="sm"
                                    className="me-1"
                                    onClick={() => handleEditDocument(doc)}
                                  >
                                    <Edit size={14} />
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
                                    <Trash2 size={14} />
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
              </Tab.Pane>

              {/* Communications Tab */}
              <Tab.Pane active={activeTab === 'communications'} className="p-4">
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h4>Gestión de Comunicados</h4>
                  <Button variant="primary" onClick={handleCreateDocument} className="d-flex align-items-center">
                    <Plus size={20} className="me-2" />
                    Nuevo Comunicado
                  </Button>
                </div>
                
                <Card className="border-0 shadow-sm">
                  <Card.Body>
                    {documents.filter(d => d.type === 'communication').length === 0 ? (
                      <p className="text-muted text-center py-4">No hay comunicados disponibles.</p>
                    ) : (
                      <div className="table-responsive">
                        <table className="table table-hover">
                          <thead>
                            <tr>
                              <th>Título</th>
                              <th>Estado</th>
                              <th>Fecha</th>
                              <th>Acciones</th>
                            </tr>
                          </thead>
                          <tbody>
                            {documents.filter(d => d.type === 'communication').map((doc) => (
                              <tr key={doc.id}>
                                <td>
                                  <div className="d-flex align-items-center">
                                    <MessageSquare size={16} className="me-2" />
                                    {doc.title}
                                  </div>
                                </td>
                                <td>{getStatusBadge(doc.status)}</td>
                                <td>{new Date(doc.createdAt).toLocaleDateString()}</td>
                                <td>
                                  <Button
                                    variant="outline-primary"
                                    size="sm"
                                    className="me-1"
                                    onClick={() => navigate(`/document/${doc.slug}`)}
                                  >
                                    <Eye size={14} />
                                  </Button>
                                  <Button
                                    variant="outline-warning"
                                    size="sm"
                                    className="me-1"
                                    onClick={() => handleEditDocument(doc)}
                                  >
                                    <Edit size={14} />
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
                                    <Trash2 size={14} />
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
              </Tab.Pane>

              {/* Attachments Tab */}
              <Tab.Pane active={activeTab === 'attachments'} className="p-4">
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h4>Gestión de Archivos</h4>
                  <Button variant="outline-primary" onClick={() => setShowAttachmentModal(true)} className="d-flex align-items-center">
                    <Upload size={20} className="me-2" />
                    Subir Archivo
                  </Button>
                </div>
                
                <Card className="border-0 shadow-sm">
                  <Card.Body>
                    {attachments.length === 0 ? (
                      <p className="text-muted text-center py-4">No hay archivos adjuntos.</p>
                    ) : (
                      <div>
                        {attachments.slice(0, 20).map((attachment) => (
                          <div key={attachment.id} className="d-flex align-items-center p-3 border-bottom">
                            <div className="me-3">
                              {getFileIcon(attachment.type)}
                            </div>
                            <div className="flex-grow-1">
                              <h6 className="mb-1">{attachment.originalName}</h6>
                              <small className="text-muted">
                                {(attachment.size / 1024 / 1024).toFixed(2)} MB • 
                                {new Date(attachment.createdAt).toLocaleDateString()}
                              </small>
                            </div>
                            <Button
                              variant="outline-primary"
                              size="sm"
                              onClick={() => window.open(`http://localhost:8080${attachment.url}`, '_blank')}
                            >
                              <Download size={16} />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </Card.Body>
                </Card>
              </Tab.Pane>
            </Tab.Content>
          </Card.Body>
        </Card>
      </Container>

      {/* Modal para crear/editar documento */}
      <DocumentModal
        show={showModal}
        onHide={() => setShowModal(false)}
        document={editingDocument}
        onSave={handleSaveDocument}
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
const DocumentModal = ({ show, onHide, document, onSave }) => {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    type: 'news',
    category: '',
    status: 'draft',
    isPublic: true
  });

  useEffect(() => {
    if (document) {
      setFormData({
        title: document.title || '',
        content: document.content || '',
        type: document.type || 'news',
        category: document.category || '',
        status: document.status || 'draft',
        isPublic: document.isPublic !== undefined ? document.isPublic : true
      });
    } else {
      setFormData({
        title: '',
        content: '',
        type: 'news',
        category: '',
        status: 'draft',
        isPublic: true
      });
    }
  }, [document]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Modal show={show} onHide={onHide} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>{document ? 'Editar' : 'Crear'} Contenido</Modal.Title>
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
              <option value="news">Noticia</option>
              <option value="communication">Comunicado</option>
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

export default ComunicacionDashboard;
