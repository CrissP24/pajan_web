import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Button, Badge, Modal, Form, Alert, Nav, Tab, Container, Breadcrumb } from 'react-bootstrap';
import { Plus, Edit, Trash2, Eye, Upload, Download, FileText, Image, Video, Music, MessageSquare, Newspaper, Users, Home, ChevronRight, TrendingUp, Calendar, FileArchive, Shield, FileCheck } from 'lucide-react';
import documentService from '../services/documentService';
import attachmentService from '../services/attachmentService';
import { useNavigate } from 'react-router-dom';

const TransparenciaDashboard = ({ user, handleLogout }) => {
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
      const response = await documentService.getTransparenciaDocuments(token);
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

  const getDocumentTypeIcon = (type) => {
    switch (type) {
      case 'noticia': return <Newspaper className="text-primary" />;
      case 'comunicado': return <MessageSquare className="text-info" />;
      case 'documento': return <FileText className="text-success" />;
      case 'imagen': return <Image className="text-warning" />;
      case 'video': return <Video className="text-danger" />;
      case 'audio': return <Music className="text-secondary" />;
      default: return <FileText className="text-muted" />;
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'published':
        return <Badge bg="success">Publicado</Badge>;
      case 'draft':
        return <Badge bg="warning" text="dark">Borrador</Badge>;
      case 'archived':
        return <Badge bg="secondary">Archivado</Badge>;
      default:
        return <Badge bg="light" text="dark">{status}</Badge>;
    }
  };

  if (loading) {
    return (
      <Container className="mt-4">
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
        </div>
      </Container>
    );
  }

  return (
    <Container fluid className="mt-4">
      <Breadcrumb>
        <Breadcrumb.Item href="#" onClick={() => navigate('/')}>
          <Home size={16} />
        </Breadcrumb.Item>
        <Breadcrumb.Item active>Dashboard Transparencia</Breadcrumb.Item>
      </Breadcrumb>

      <Row className="mb-4">
        <Col>
          <h2 className="d-flex align-items-center">
            <Shield className="me-2 text-primary" />
            Dashboard de Transparencia
          </h2>
          <p className="text-muted">Gestión de documentos de transparencia y LOTAIP</p>
        </Col>
        <Col xs="auto">
          <Button variant="outline-secondary" onClick={handleLogout}>
            Cerrar Sesión
          </Button>
        </Col>
      </Row>

      {error && (
        <Alert variant="danger" dismissible onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      <Row className="mb-4">
        <Col md={3}>
          <Card className="text-center">
            <Card.Body>
              <FileCheck size={32} className="text-primary mb-2" />
              <h4>{documents.length}</h4>
              <p className="text-muted mb-0">Documentos</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center">
            <Card.Body>
              <FileArchive size={32} className="text-success mb-2" />
              <h4>{attachments.length}</h4>
              <p className="text-muted mb-0">Archivos</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center">
            <Card.Body>
              <TrendingUp size={32} className="text-info mb-2" />
              <h4>{documents.filter(d => d.status === 'published').length}</h4>
              <p className="text-muted mb-0">Publicados</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center">
            <Card.Body>
              <Calendar size={32} className="text-warning mb-2" />
              <h4>{new Date().getFullYear()}</h4>
              <p className="text-muted mb-0">Año Actual</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col>
          <Card>
            <Card.Header>
              <Nav variant="tabs" activeKey={activeTab} onSelect={(k) => setActiveTab(k)}>
                <Nav.Item>
                  <Nav.Link eventKey="overview">Vista General</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="documents">Documentos</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="attachments">Archivos</Nav.Link>
                </Nav.Item>
              </Nav>
            </Card.Header>
            <Card.Body>
              <Tab.Content>
                <Tab.Pane active={activeTab === 'overview'}>
                  <Row>
                    <Col md={8}>
                      <h5>Documentos Recientes</h5>
                      {documents.slice(0, 5).map((doc) => (
                        <Card key={doc.id} className="mb-2">
                          <Card.Body className="py-2">
                            <Row className="align-items-center">
                              <Col xs="auto">
                                {getDocumentTypeIcon(doc.type)}
                              </Col>
                              <Col>
                                <h6 className="mb-0">{doc.title}</h6>
                                <small className="text-muted">
                                  {new Date(doc.createdAt).toLocaleDateString()}
                                </small>
                              </Col>
                              <Col xs="auto">
                                {getStatusBadge(doc.status)}
                              </Col>
                            </Row>
                          </Card.Body>
                        </Card>
                      ))}
                    </Col>
                    <Col md={4}>
                      <h5>Acciones Rápidas</h5>
                      <div className="d-grid gap-2">
                        <Button variant="primary" onClick={handleCreateDocument}>
                          <Plus size={16} className="me-2" />
                          Nuevo Documento
                        </Button>
                        <Button variant="outline-primary" onClick={() => setShowAttachmentModal(true)}>
                          <Upload size={16} className="me-2" />
                          Subir Archivo
                        </Button>
                        <Button variant="outline-secondary" onClick={() => navigate('/transparencia')}>
                          <Eye size={16} className="me-2" />
                          Ver Página Pública
                        </Button>
                      </div>
                    </Col>
                  </Row>
                </Tab.Pane>

                <Tab.Pane active={activeTab === 'documents'}>
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h5>Documentos de Transparencia</h5>
                    <Button variant="primary" onClick={handleCreateDocument}>
                      <Plus size={16} className="me-2" />
                      Nuevo Documento
                    </Button>
                  </div>
                  
                  {documents.map((doc) => (
                    <Card key={doc.id} className="mb-3">
                      <Card.Body>
                        <Row className="align-items-center">
                          <Col xs="auto">
                            {getDocumentTypeIcon(doc.type)}
                          </Col>
                          <Col>
                            <h6 className="mb-1">{doc.title}</h6>
                            <p className="text-muted mb-1">{doc.excerpt}</p>
                            <small className="text-muted">
                              Creado: {new Date(doc.createdAt).toLocaleDateString()}
                              {doc.updatedAt !== doc.createdAt && 
                                ` | Actualizado: ${new Date(doc.updatedAt).toLocaleDateString()}`
                              }
                            </small>
                          </Col>
                          <Col xs="auto">
                            {getStatusBadge(doc.status)}
                          </Col>
                          <Col xs="auto">
                            <Button
                              variant="outline-primary"
                              size="sm"
                              onClick={() => handleEditDocument(doc)}
                              className="me-1"
                            >
                              <Edit size={14} />
                            </Button>
                            <Button
                              variant="outline-success"
                              size="sm"
                              onClick={() => handleTogglePublish(doc.id)}
                              className="me-1"
                            >
                              {doc.status === 'published' ? <Eye size={14} /> : <Eye size={14} />}
                            </Button>
                            <Button
                              variant="outline-danger"
                              size="sm"
                              onClick={() => handleDeleteDocument(doc.id)}
                            >
                              <Trash2 size={14} />
                            </Button>
                          </Col>
                        </Row>
                      </Card.Body>
                    </Card>
                  ))}
                </Tab.Pane>

                <Tab.Pane active={activeTab === 'attachments'}>
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h5>Archivos Adjuntos</h5>
                    <Button variant="primary" onClick={() => setShowAttachmentModal(true)}>
                      <Upload size={16} className="me-2" />
                      Subir Archivo
                    </Button>
                  </div>
                  
                  <Row>
                    {attachments.map((attachment) => (
                      <Col md={4} key={attachment.id}>
                        <Card className="mb-3">
                          <Card.Body>
                            <div className="text-center mb-2">
                              <FileArchive size={32} className="text-primary" />
                            </div>
                            <h6 className="text-center">{attachment.filename}</h6>
                            <p className="text-muted text-center small">
                              {attachment.filesize} bytes
                            </p>
                            <div className="d-grid gap-1">
                              <Button variant="outline-primary" size="sm">
                                <Download size={14} className="me-1" />
                                Descargar
                              </Button>
                            </div>
                          </Card.Body>
                        </Card>
                      </Col>
                    ))}
                  </Row>
                </Tab.Pane>
              </Tab.Content>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Modal para crear/editar documento */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            {editingDocument ? 'Editar Documento' : 'Nuevo Documento'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Título</Form.Label>
              <Form.Control
                type="text"
                placeholder="Título del documento"
                defaultValue={editingDocument?.title || ''}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Contenido</Form.Label>
              <Form.Control
                as="textarea"
                rows={10}
                placeholder="Contenido del documento"
                defaultValue={editingDocument?.content || ''}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Tipo</Form.Label>
              <Form.Select defaultValue={editingDocument?.type || 'documento'}>
                <option value="documento">Documento</option>
                <option value="noticia">Noticia</option>
                <option value="comunicado">Comunicado</option>
              </Form.Select>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={() => handleSaveDocument({})}>
            Guardar
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal para subir archivo */}
      <Modal show={showAttachmentModal} onHide={() => setShowAttachmentModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Subir Archivo</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Seleccionar Archivo</Form.Label>
              <Form.Control
                type="file"
                onChange={(e) => setSelectedFile(e.target.files[0])}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAttachmentModal(false)}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleFileUpload}>
            Subir
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default TransparenciaDashboard;
