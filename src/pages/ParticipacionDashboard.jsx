import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Button, Badge, Modal, Form, Alert, Nav, Tab, Container, Breadcrumb, Table } from 'react-bootstrap';
import { Plus, Edit, Trash2, Eye, Upload, Download, FileText, Link, Users, Home, ChevronRight, TrendingUp, Calendar, FileArchive, MessageSquare, ClipboardList, Phone, UserCheck, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ParticipacionDashboard = ({ user, handleLogout }) => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingDocument, setEditingDocument] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const navigate = useNavigate();

  const token = localStorage.getItem('accessToken');

  // Formulario para nuevo documento
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    fileUrl: '',
    category: 'participacion',
    type: 'document'
  });

  useEffect(() => {
    loadDocuments();
  }, [activeTab]);

  const loadDocuments = async () => {
    try {
      setLoading(true);
      // Simular carga de documentos desde localStorage
      const storedDocs = JSON.parse(localStorage.getItem('participacionDocuments') || '[]');
      setDocuments(storedDocs);
    } catch (err) {
      setError('Error al cargar documentos: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateDocument = () => {
    setEditingDocument(null);
    setFormData({
      title: '',
      description: '',
      fileUrl: '',
      category: 'participacion',
      type: 'document'
    });
    setShowModal(true);
  };

  const handleEditDocument = (document) => {
    setEditingDocument(document);
    setFormData({
      title: document.title || '',
      description: document.description || '',
      fileUrl: document.fileUrl || '',
      category: document.category || 'participacion',
      type: document.type || 'document'
    });
    setShowModal(true);
  };

  const handleDeleteDocument = async (id) => {
    if (window.confirm('¿Está seguro de que desea eliminar este documento?')) {
      try {
        const updatedDocs = documents.filter(doc => doc.id !== id);
        setDocuments(updatedDocs);
        localStorage.setItem('participacionDocuments', JSON.stringify(updatedDocs));
      } catch (err) {
        setError('Error al eliminar documento: ' + err.message);
      }
    }
  };

  const handleSaveDocument = async () => {
    try {
      if (!formData.title || !formData.fileUrl) {
        setError('El título y la URL del archivo son obligatorios');
        return;
      }

      const newDocument = {
        id: editingDocument ? editingDocument.id : Date.now(),
        title: formData.title,
        description: formData.description,
        fileUrl: formData.fileUrl,
        category: formData.category,
        type: formData.type,
        createdAt: editingDocument ? editingDocument.createdAt : new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      let updatedDocs;
      if (editingDocument) {
        updatedDocs = documents.map(doc => 
          doc.id === editingDocument.id ? newDocument : doc
        );
      } else {
        updatedDocs = [...documents, newDocument];
      }

      setDocuments(updatedDocs);
      localStorage.setItem('participacionDocuments', JSON.stringify(updatedDocs));
      setShowModal(false);
      setError('');
    } catch (err) {
      setError('Error al guardar documento: ' + err.message);
    }
  };

  const handleOpenFile = (fileUrl) => {
    window.open(fileUrl, '_blank');
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'buzon': return <MessageSquare className="text-primary" />;
      case 'encuestas': return <ClipboardList className="text-success" />;
      case 'canales-atencion': return <Phone className="text-info" />;
      case 'participacion': return <Users className="text-warning" />;
      default: return <FileText className="text-muted" />;
    }
  };

  const getCategoryName = (category) => {
    switch (category) {
      case 'buzon': return 'Buzón de Quejas';
      case 'encuestas': return 'Encuestas';
      case 'canales-atencion': return 'Canales de Atención';
      case 'participacion': return 'Participación Ciudadana';
      default: return category;
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
        <Breadcrumb.Item active>Dashboard Participación Ciudadana</Breadcrumb.Item>
      </Breadcrumb>

      <Row className="mb-4">
        <Col>
          <h2 className="d-flex align-items-center">
            <Users className="me-2 text-primary" />
            Dashboard de Participación Ciudadana
          </h2>
          <p className="text-muted">Gestión de documentos y enlaces para participación ciudadana</p>
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
              <FileText size={32} className="text-primary mb-2" />
              <h4>{documents.length}</h4>
              <p className="text-muted mb-0">Documentos</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center">
            <Card.Body>
              <MessageSquare size={32} className="text-success mb-2" />
              <h4>{documents.filter(d => d.category === 'buzon').length}</h4>
              <p className="text-muted mb-0">Buzón de Quejas</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center">
            <Card.Body>
              <ClipboardList size={32} className="text-info mb-2" />
              <h4>{documents.filter(d => d.category === 'encuestas').length}</h4>
              <p className="text-muted mb-0">Encuestas</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center">
            <Card.Body>
              <Phone size={32} className="text-warning mb-2" />
              <h4>{documents.filter(d => d.category === 'canales-atencion').length}</h4>
              <p className="text-muted mb-0">Canales de Atención</p>
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
                                {getCategoryIcon(doc.category)}
                              </Col>
                              <Col>
                                <h6 className="mb-0">{doc.title}</h6>
                                <small className="text-muted">
                                  {new Date(doc.createdAt).toLocaleDateString()}
                                </small>
                              </Col>
                              <Col xs="auto">
                                <Badge bg="secondary">{getCategoryName(doc.category)}</Badge>
                              </Col>
                            </Row>
                          </Card.Body>
                        </Card>
                      ))}
                      {documents.length === 0 && (
                        <Card className="mb-2">
                          <Card.Body className="text-center text-muted">
                            <FileText size={48} className="mb-2" />
                            <p>No hay documentos disponibles</p>
                            <Button variant="primary" onClick={handleCreateDocument}>
                              <Plus size={16} className="me-2" />
                              Crear Primer Documento
                            </Button>
                          </Card.Body>
                        </Card>
                      )}
                    </Col>
                    <Col md={4}>
                      <h5>Acciones Rápidas</h5>
                      <div className="d-grid gap-2">
                        <Button variant="primary" onClick={handleCreateDocument}>
                          <Plus size={16} className="me-2" />
                          Nuevo Documento
                        </Button>
                        <Button variant="outline-primary" onClick={() => navigate('/participacion-ciudadana')}>
                          <Eye size={16} className="me-2" />
                          Ver Página Pública
                        </Button>
                      </div>
                    </Col>
                  </Row>
                </Tab.Pane>

                <Tab.Pane active={activeTab === 'documents'}>
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h5>Documentos de Participación Ciudadana</h5>
                    <Button variant="primary" onClick={handleCreateDocument}>
                      <Plus size={16} className="me-2" />
                      Nuevo Documento
                    </Button>
                  </div>
                  
                  <Table responsive striped hover>
                    <thead>
                      <tr>
                        <th>Documento</th>
                        <th>Categoría</th>
                        <th>Fecha</th>
                        <th>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {documents.map((doc) => (
                        <tr key={doc.id}>
                          <td>
                            <div className="d-flex align-items-center">
                              {getCategoryIcon(doc.category)}
                              <div className="ms-2">
                                <strong>{doc.title}</strong>
                                {doc.description && (
                                  <div className="text-muted small">{doc.description}</div>
                                )}
                              </div>
                            </div>
                          </td>
                          <td>
                            <Badge bg="secondary">{getCategoryName(doc.category)}</Badge>
                          </td>
                          <td>
                            {new Date(doc.createdAt).toLocaleDateString()}
                          </td>
                          <td>
                            <Button
                              variant="outline-primary"
                              size="sm"
                              onClick={() => handleOpenFile(doc.fileUrl)}
                              className="me-1"
                            >
                              <ExternalLink size={14} />
                            </Button>
                            <Button
                              variant="outline-warning"
                              size="sm"
                              onClick={() => handleEditDocument(doc)}
                              className="me-1"
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
                  </Table>
                  
                  {documents.length === 0 && (
                    <div className="text-center py-5">
                      <FileText size={64} className="text-muted mb-3" />
                      <h5 className="text-muted">No hay documentos</h5>
                      <p className="text-muted">Comienza creando tu primer documento</p>
                      <Button variant="primary" onClick={handleCreateDocument}>
                        <Plus size={16} className="me-2" />
                        Crear Documento
                      </Button>
                    </div>
                  )}
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
              <Form.Label>Título del Documento *</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ej: Formulario de Quejas y Sugerencias"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Descripción</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Descripción breve del documento"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>URL del Archivo *</Form.Label>
              <Form.Control
                type="url"
                placeholder="https://ejemplo.com/archivo.pdf"
                value={formData.fileUrl}
                onChange={(e) => setFormData({...formData, fileUrl: e.target.value})}
              />
              <Form.Text className="text-muted">
                Ingresa la URL completa del archivo (PDF, Word, Excel, etc.)
              </Form.Text>
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Categoría</Form.Label>
              <Form.Select
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
              >
                <option value="buzon">Buzón de Quejas y Sugerencias</option>
                <option value="encuestas">Encuestas y Opiniones</option>
                <option value="canales-atencion">Canales de Atención</option>
                <option value="participacion">Participación Ciudadana</option>
              </Form.Select>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleSaveDocument}>
            {editingDocument ? 'Actualizar' : 'Crear'} Documento
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default ParticipacionDashboard;
