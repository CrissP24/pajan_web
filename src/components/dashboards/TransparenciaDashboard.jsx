import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Table, Badge, Modal, Form, Alert, Nav, Tab } from 'react-bootstrap';
import { 
  FaFileInvoice, 
  FaEdit, 
  FaTrash, 
  FaPlus,
  FaEye,
  FaSave,
  FaSignOutAlt,
  FaDownload,
  FaCalendarAlt,
  FaTag,
  FaFileAlt
} from 'react-icons/fa';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import documentManagementService from '../../services/documentManagementService';
import contentManagementService from '../../services/contentManagementService';

const TransparenciaDashboard = ({ user }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalDocuments: 0,
    publishedDocuments: 0,
    draftDocuments: 0,
    totalContent: 0,
    recentActivity: []
  });

  const [documents, setDocuments] = useState([]);
  const [content, setContent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  // Modales
  const [showDocumentModal, setShowDocumentModal] = useState(false);
  const [showContentModal, setShowContentModal] = useState(false);

  // Formularios
  const [documentForm, setDocumentForm] = useState({
    title: '',
    content: '',
    category: '',
    section: '',
    published: false,
    slug: ''
  });
  const [contentForm, setContentForm] = useState({
    section: '',
    title: '',
    body: '',
    image: '',
    published: false,
    order: 0
  });

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Cargar estadísticas
      const documentStats = await documentManagementService.getDocumentStats();
      const contentStats = await contentManagementService.getContentStats();
      
      setStats({
        totalDocuments: documentStats.total,
        publishedDocuments: documentStats.published,
        draftDocuments: documentStats.draft,
        totalContent: contentStats.total,
        recentActivity: []
      });

      // Cargar datos
      const [documentsData, contentData] = await Promise.all([
        documentManagementService.getDocuments(),
        contentManagementService.getAllContent()
      ]);

      setDocuments(documentsData);
      setContent(contentData);
    } catch (error) {
      console.error('Error cargando datos del dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  // Funciones de gestión de documentos
  const handleCreateDocument = async () => {
    try {
      await documentManagementService.createDocument(documentForm);
      await loadDashboardData();
      setShowDocumentModal(false);
      setDocumentForm({ title: '', content: '', category: '', section: '', published: false, slug: '' });
    } catch (error) {
      console.error('Error creando documento:', error);
    }
  };

  const handleUpdateDocument = async (documentId) => {
    try {
      await documentManagementService.updateDocument(documentId, documentForm);
      await loadDashboardData();
      setShowDocumentModal(false);
    } catch (error) {
      console.error('Error actualizando documento:', error);
    }
  };

  const handleDeleteDocument = async (documentId) => {
    if (window.confirm('¿Está seguro de eliminar este documento?')) {
      try {
        await documentManagementService.deleteDocument(documentId);
        await loadDashboardData();
      } catch (error) {
        console.error('Error eliminando documento:', error);
      }
    }
  };

  const handleToggleDocumentStatus = async (documentId) => {
    try {
      await documentManagementService.toggleDocumentStatus(documentId);
      await loadDashboardData();
    } catch (error) {
      console.error('Error cambiando estado del documento:', error);
    }
  };

  // Funciones de gestión de contenido
  const handleCreateContent = async () => {
    try {
      await contentManagementService.createContent(contentForm);
      await loadDashboardData();
      setShowContentModal(false);
      setContentForm({ section: '', title: '', body: '', image: '', published: false, order: 0 });
    } catch (error) {
      console.error('Error creando contenido:', error);
    }
  };

  const handleDeleteContent = async (contentId) => {
    if (window.confirm('¿Está seguro de eliminar este contenido?')) {
      try {
        await contentManagementService.deleteContent(contentId);
        await loadDashboardData();
      } catch (error) {
        console.error('Error eliminando contenido:', error);
      }
    }
  };

  // Función de logout
  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  const StatCard = ({ title, value, icon: Icon, color, subtitle, trend }) => (
    <Card className="mb-4 border-0 shadow-sm h-100">
      <Card.Body className="p-4">
        <div className="d-flex align-items-center justify-content-between">
          <div className="flex-grow-1">
            <h6 className="text-muted mb-2 fw-semibold text-uppercase small">{title}</h6>
            <h2 className="mb-1 fw-bold text-dark">{value}</h2>
            {subtitle && <small className="text-muted">{subtitle}</small>}
            {trend && (
              <div className="mt-2">
                <Badge bg={trend > 0 ? 'success' : 'danger'} className="small">
                  {trend > 0 ? '+' : ''}{trend}%
                </Badge>
              </div>
            )}
          </div>
          <div className={`p-3 rounded-3 bg-${color} text-white`}>
            <Icon size={28} />
          </div>
        </div>
      </Card.Body>
    </Card>
  );

  if (loading) {
    return (
      <Container fluid className="py-4">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
          <p className="mt-3">Cargando dashboard...</p>
        </div>
      </Container>
    );
  }

  return (
    <Container fluid className="py-4">
      {/* Header */}
      <Row className="mb-4">
        <Col>
          <Card className="border-0 shadow-sm">
            <Card.Body className="py-4">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h2 className="mb-1 text-primary">
                    <FaEye className="me-2" />
                    Dashboard de Transparencia
                  </h2>
                  <p className="text-muted mb-0">
                    Bienvenido, <strong>{user?.nombre || user?.username}</strong>
                    <Badge bg="warning" className="ms-2">Transparencia</Badge>
                  </p>
                </div>
                <div className="d-flex gap-2">
                  <Button 
                    variant="outline-primary" 
                    size="sm"
                    onClick={() => window.location.reload()}
                  >
                    Actualizar
                  </Button>
                  <Button 
                    variant="outline-danger" 
                    onClick={handleLogout}
                  >
                    <FaSignOutAlt className="me-1" />
                    Cerrar Sesión
                  </Button>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Navegación por pestañas */}
      <Card className="mb-4">
        <Card.Body className="p-0">
          <Nav variant="tabs" defaultActiveKey="overview" className="border-0">
            <Nav.Item>
              <Nav.Link 
                eventKey="overview" 
                onClick={() => setActiveTab('overview')}
                className={`py-3 px-4 ${activeTab === 'overview' ? 'bg-primary text-white' : ''}`}
              >
                <FaEye className="me-2" />
                Resumen
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link 
                eventKey="documents" 
                onClick={() => setActiveTab('documents')}
                className={`py-3 px-4 ${activeTab === 'documents' ? 'bg-primary text-white' : ''}`}
              >
                <FaFileInvoice className="me-2" />
                Documentos
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link 
                eventKey="content" 
                onClick={() => setActiveTab('content')}
                className={`py-3 px-4 ${activeTab === 'content' ? 'bg-primary text-white' : ''}`}
              >
                <FaFileAlt className="me-2" />
                Contenido
              </Nav.Link>
            </Nav.Item>
          </Nav>
        </Card.Body>
      </Card>

      {/* Contenido de las pestañas */}
      <Tab.Content>
        {/* Pestaña de Resumen */}
        {activeTab === 'overview' && (
          <div>
            <Row>
              <Col md={3}>
                <StatCard
                  title="Total Documentos"
                  value={stats.totalDocuments}
                  icon={FaFileInvoice}
                  color="primary"
                  subtitle={`${stats.publishedDocuments} publicados`}
                />
              </Col>
              <Col md={3}>
                <StatCard
                  title="Documentos Publicados"
                  value={stats.publishedDocuments}
                  icon={FaEye}
                  color="success"
                  subtitle="Visibles al público"
                />
              </Col>
              <Col md={3}>
                <StatCard
                  title="Borradores"
                  value={stats.draftDocuments}
                  icon={FaEdit}
                  color="warning"
                  subtitle="En edición"
                />
              </Col>
              <Col md={3}>
                <StatCard
                  title="Contenido"
                  value={stats.totalContent}
                  icon={FaFileAlt}
                  color="info"
                  subtitle="Páginas dinámicas"
                />
              </Col>
            </Row>

            <Row>
              <Col md={8}>
                <Card className="border-0 shadow-sm">
                  <Card.Header className="bg-primary text-white">
                    <h5 className="mb-0">
                      <FaFileInvoice className="me-2" />
                      Documentos Recientes
                    </h5>
                  </Card.Header>
                  <Card.Body className="p-0">
                    <div className="table-responsive">
                      <Table className="mb-0">
                        <thead className="table-light">
                          <tr>
                            <th className="border-0 py-3 px-4">Título</th>
                            <th className="border-0 py-3 px-4">Categoría</th>
                            <th className="border-0 py-3 px-4">Estado</th>
                            <th className="border-0 py-3 px-4">Fecha</th>
                          </tr>
                        </thead>
                        <tbody>
                          {documents.slice(0, 5).map(item => (
                            <tr key={item.id} className="border-bottom">
                              <td className="py-3 px-4">
                                <div className="d-flex align-items-center">
                                  <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-3" style={{width: '40px', height: '40px'}}>
                                    <FaFileInvoice />
                                  </div>
                                  <div>
                                    <strong>{item.title}</strong>
                                    <br />
                                    <small className="text-muted">{item.section}</small>
                                  </div>
                                </div>
                              </td>
                              <td className="py-3 px-4">
                                <Badge bg="info">{item.category}</Badge>
                              </td>
                              <td className="py-3 px-4">
                                <Badge bg={item.published ? 'success' : 'warning'}>
                                  {item.published ? 'Publicado' : 'Borrador'}
                                </Badge>
                              </td>
                              <td className="py-3 px-4">
                                <small className="text-muted">
                                  <FaCalendarAlt className="me-1" />
                                  {new Date(item.createdAt).toLocaleDateString()}
                                </small>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={4}>
                <Card className="border-0 shadow-sm">
                  <Card.Header className="bg-warning text-white">
                    <h6 className="mb-0">
                      <FaEye className="me-2" />
                      Acciones Rápidas
                    </h6>
                  </Card.Header>
                  <Card.Body>
                    <div className="d-grid gap-2">
                      <Button variant="primary" onClick={() => setShowDocumentModal(true)}>
                        <FaPlus className="me-2" />
                        Nuevo Documento
                      </Button>
                      <Button variant="outline-primary" onClick={() => setShowContentModal(true)}>
                        <FaFileAlt className="me-2" />
                        Nuevo Contenido
                      </Button>
                      <Button variant="outline-info" onClick={() => setActiveTab('documents')}>
                        <FaFileInvoice className="me-2" />
                        Gestionar Documentos
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </div>
        )}

        {/* Pestaña de Documentos */}
        {activeTab === 'documents' && (
          <div>
            <Row className="mb-4">
              <Col>
                <Card className="border-0 shadow-sm">
                  <Card.Body className="py-3">
                    <div className="d-flex justify-content-between align-items-center">
                      <h5 className="mb-0 text-primary">
                        <FaFileInvoice className="me-2" />
                        Gestión de Documentos
                      </h5>
                      <Button variant="primary" onClick={() => setShowDocumentModal(true)}>
                        <FaPlus className="me-2" />
                        Nuevo Documento
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
            <Card className="border-0 shadow-sm">
              <Card.Body className="p-0">
                <div className="table-responsive">
                  <Table className="mb-0">
                    <thead className="table-light">
                      <tr>
                        <th className="border-0 py-3 px-4">Título</th>
                        <th className="border-0 py-3 px-4">Categoría</th>
                        <th className="border-0 py-3 px-4">Sección</th>
                        <th className="border-0 py-3 px-4">Estado</th>
                        <th className="border-0 py-3 px-4">Fecha</th>
                        <th className="border-0 py-3 px-4 text-center">Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {documents.map(item => (
                        <tr key={item.id} className="border-bottom">
                          <td className="py-3 px-4">
                            <div className="d-flex align-items-center">
                              <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-3" style={{width: '40px', height: '40px'}}>
                                <FaFileInvoice />
                              </div>
                              <div>
                                <strong>{item.title}</strong>
                                <br />
                                <small className="text-muted">
                                  {item.content?.substring(0, 100)}...
                                </small>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <Badge bg="info">{item.category}</Badge>
                          </td>
                          <td className="py-3 px-4">
                            <Badge bg="secondary">{item.section}</Badge>
                          </td>
                          <td className="py-3 px-4">
                            <Badge bg={item.published ? 'success' : 'warning'}>
                              {item.published ? 'Publicado' : 'Borrador'}
                            </Badge>
                          </td>
                          <td className="py-3 px-4">
                            <small className="text-muted">
                              <FaCalendarAlt className="me-1" />
                              {new Date(item.createdAt).toLocaleDateString()}
                            </small>
                          </td>
                          <td className="py-3 px-4 text-center">
                            <div className="btn-group" role="group">
                              <Button
                                variant="outline-primary"
                                size="sm"
                                className="me-1"
                                onClick={() => {
                                  setDocumentForm(item);
                                  setShowDocumentModal(true);
                                }}
                                title="Editar documento"
                              >
                                <FaEdit />
                              </Button>
                              <Button
                                variant="outline-warning"
                                size="sm"
                                className="me-1"
                                onClick={() => handleToggleDocumentStatus(item.id)}
                                title={item.published ? 'Despublicar' : 'Publicar'}
                              >
                                {item.published ? 'Ocultar' : 'Publicar'}
                              </Button>
                              <Button
                                variant="outline-info"
                                size="sm"
                                className="me-1"
                                title="Ver documento"
                              >
                                <FaEye />
                              </Button>
                              <Button
                                variant="outline-danger"
                                size="sm"
                                onClick={() => handleDeleteDocument(item.id)}
                                title="Eliminar documento"
                              >
                                <FaTrash />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              </Card.Body>
            </Card>
          </div>
        )}

        {/* Pestaña de Contenido */}
        {activeTab === 'content' && (
          <div>
            <Row className="mb-4">
              <Col>
                <Card className="border-0 shadow-sm">
                  <Card.Body className="py-3">
                    <div className="d-flex justify-content-between align-items-center">
                      <h5 className="mb-0 text-primary">
                        <FaFileAlt className="me-2" />
                        Gestión de Contenido
                      </h5>
                      <Button variant="primary" onClick={() => setShowContentModal(true)}>
                        <FaPlus className="me-2" />
                        Nuevo Contenido
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
            <Card className="border-0 shadow-sm">
              <Card.Body className="p-0">
                <div className="table-responsive">
                  <Table className="mb-0">
                    <thead className="table-light">
                      <tr>
                        <th className="border-0 py-3 px-4">Título</th>
                        <th className="border-0 py-3 px-4">Sección</th>
                        <th className="border-0 py-3 px-4">Estado</th>
                        <th className="border-0 py-3 px-4">Orden</th>
                        <th className="border-0 py-3 px-4 text-center">Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {content.map(item => (
                        <tr key={item.id} className="border-bottom">
                          <td className="py-3 px-4">
                            <div className="d-flex align-items-center">
                              {item.image && (
                                <img 
                                  src={item.image} 
                                  alt={item.title}
                                  className="rounded me-3"
                                  style={{width: '40px', height: '40px', objectFit: 'cover'}}
                                />
                              )}
                              <div>
                                <strong>{item.title}</strong>
                                <br />
                                <small className="text-muted">
                                  {item.body?.substring(0, 100)}...
                                </small>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <Badge bg="secondary">{item.section}</Badge>
                          </td>
                          <td className="py-3 px-4">
                            <Badge bg={item.published ? 'success' : 'warning'}>
                              {item.published ? 'Publicado' : 'Borrador'}
                            </Badge>
                          </td>
                          <td className="py-3 px-4">{item.order}</td>
                          <td className="py-3 px-4 text-center">
                            <div className="btn-group" role="group">
                              <Button
                                variant="outline-primary"
                                size="sm"
                                className="me-1"
                                onClick={() => {
                                  setContentForm(item);
                                  setShowContentModal(true);
                                }}
                                title="Editar contenido"
                              >
                                <FaEdit />
                              </Button>
                              <Button
                                variant="outline-danger"
                                size="sm"
                                onClick={() => handleDeleteContent(item.id)}
                                title="Eliminar contenido"
                              >
                                <FaTrash />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              </Card.Body>
            </Card>
          </div>
        )}
      </Tab.Content>

      {/* Modal de Documentos */}
      <Modal show={showDocumentModal} onHide={() => setShowDocumentModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            <FaFileInvoice className="me-2" />
            {documentForm.id ? 'Editar Documento' : 'Nuevo Documento'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Título</Form.Label>
              <Form.Control
                type="text"
                value={documentForm.title}
                onChange={(e) => setDocumentForm({...documentForm, title: e.target.value})}
                placeholder="Ingrese el título del documento"
              />
            </Form.Group>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Categoría</Form.Label>
                  <Form.Select
                    value={documentForm.category}
                    onChange={(e) => setDocumentForm({...documentForm, category: e.target.value})}
                  >
                    <option value="">Seleccionar categoría</option>
                    <option value="planificacion">Planificación</option>
                    <option value="presupuesto">Presupuesto</option>
                    <option value="contratos">Contratos</option>
                    <option value="informes">Informes</option>
                    <option value="reglamentos">Reglamentos</option>
                    <option value="rendicion">Rendición de Cuentas</option>
                    <option value="transparencia">Transparencia</option>
                    <option value="participacion">Participación Ciudadana</option>
                    <option value="servicios">Servicios</option>
                    <option value="emergencias">Emergencias</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Sección</Form.Label>
                  <Form.Select
                    value={documentForm.section}
                    onChange={(e) => setDocumentForm({...documentForm, section: e.target.value})}
                  >
                    <option value="">Seleccionar sección</option>
                    <option value="transparencia">Transparencia</option>
                    <option value="rendicion-cuentas">Rendición de Cuentas</option>
                    <option value="presupuesto">Presupuesto</option>
                    <option value="convenios-contratos">Convenios y Contratos</option>
                    <option value="informes-gestion">Informes de Gestión</option>
                    <option value="reglamentos">Reglamentos</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
            <Form.Group className="mb-3">
              <Form.Label>Contenido</Form.Label>
              <Form.Control
                as="textarea"
                rows={8}
                value={documentForm.content}
                onChange={(e) => setDocumentForm({...documentForm, content: e.target.value})}
                placeholder="Contenido del documento (puede incluir HTML)"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Slug (URL amigable)</Form.Label>
              <Form.Control
                type="text"
                value={documentForm.slug}
                onChange={(e) => setDocumentForm({...documentForm, slug: e.target.value})}
                placeholder="ejemplo-documento-2024"
              />
            </Form.Group>
            <Form.Check
              type="checkbox"
              label="Publicado"
              checked={documentForm.published}
              onChange={(e) => setDocumentForm({...documentForm, published: e.target.checked})}
            />
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDocumentModal(false)}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={documentForm.id ? () => handleUpdateDocument(documentForm.id) : handleCreateDocument}>
            <FaSave className="me-2" />
            {documentForm.id ? 'Actualizar' : 'Crear'} Documento
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal de Contenido */}
      <Modal show={showContentModal} onHide={() => setShowContentModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            <FaFileAlt className="me-2" />
            {contentForm.id ? 'Editar Contenido' : 'Nuevo Contenido'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Sección</Form.Label>
                  <Form.Select
                    value={contentForm.section}
                    onChange={(e) => setContentForm({...contentForm, section: e.target.value})}
                  >
                    <option value="">Seleccionar sección</option>
                    <option value="transparencia">Transparencia</option>
                    <option value="rendicion-cuentas">Rendición de Cuentas</option>
                    <option value="presupuesto">Presupuesto</option>
                    <option value="convenios-contratos">Convenios y Contratos</option>
                    <option value="informes-gestion">Informes de Gestión</option>
                    <option value="reglamentos">Reglamentos</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Orden</Form.Label>
                  <Form.Control
                    type="number"
                    value={contentForm.order}
                    onChange={(e) => setContentForm({...contentForm, order: parseInt(e.target.value)})}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Form.Group className="mb-3">
              <Form.Label>Título</Form.Label>
              <Form.Control
                type="text"
                value={contentForm.title}
                onChange={(e) => setContentForm({...contentForm, title: e.target.value})}
                placeholder="Ingrese el título del contenido"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Contenido</Form.Label>
              <Form.Control
                as="textarea"
                rows={6}
                value={contentForm.body}
                onChange={(e) => setContentForm({...contentForm, body: e.target.value})}
                placeholder="Contenido del artículo (puede incluir HTML)"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>URL de Imagen</Form.Label>
              <Form.Control
                type="text"
                value={contentForm.image}
                onChange={(e) => setContentForm({...contentForm, image: e.target.value})}
                placeholder="https://ejemplo.com/imagen.jpg"
              />
            </Form.Group>
            <Form.Check
              type="checkbox"
              label="Publicado"
              checked={contentForm.published}
              onChange={(e) => setContentForm({...contentForm, published: e.target.checked})}
            />
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowContentModal(false)}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={contentForm.id ? () => handleUpdateContent(contentForm.id) : handleCreateContent}>
            <FaSave className="me-2" />
            {contentForm.id ? 'Actualizar' : 'Crear'} Contenido
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default TransparenciaDashboard;