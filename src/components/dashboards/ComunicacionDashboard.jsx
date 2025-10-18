import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Table, Badge, Modal, Form, Alert, Nav, Tab } from 'react-bootstrap';
import { 
  FaNewspaper, 
  FaEdit, 
  FaTrash, 
  FaPlus, 
  FaBell,
  FaSave,
  FaSignOutAlt,
  FaEye,
  FaCalendarAlt,
  FaTag,
  FaImage
} from 'react-icons/fa';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import newsManagementService from '../../services/newsManagementService';
import contentManagementService from '../../services/contentManagementService';

const ComunicacionDashboard = ({ user }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalNews: 0,
    publishedNews: 0,
    draftNews: 0,
    featuredNews: 0,
    totalContent: 0,
    recentActivity: []
  });

  const [news, setNews] = useState([]);
  const [content, setContent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  // Modales
  const [showNewsModal, setShowNewsModal] = useState(false);
  const [showContentModal, setShowContentModal] = useState(false);

  // Formularios
  const [newsForm, setNewsForm] = useState({
    title: '',
    excerpt: '',
    body: '',
    category: 'general',
    image: '',
    published: false,
    featured: false
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
      const newsStats = await newsManagementService.getNewsStats();
      const contentStats = await contentManagementService.getContentStats();
      
      setStats({
        totalNews: newsStats.total,
        publishedNews: newsStats.published,
        draftNews: newsStats.draft,
        featuredNews: newsStats.featured,
        totalContent: contentStats.total,
        recentActivity: []
      });

      // Cargar datos
      const [newsData, contentData] = await Promise.all([
        newsManagementService.getNews(),
        contentManagementService.getAllContent()
      ]);

      setNews(newsData);
      setContent(contentData);
    } catch (error) {
      console.error('Error cargando datos del dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  // Funciones de gestión de noticias
  const handleCreateNews = async () => {
    try {
      await newsManagementService.createNews(newsForm);
      await loadDashboardData();
      setShowNewsModal(false);
      setNewsForm({ title: '', excerpt: '', body: '', category: 'general', image: '', published: false, featured: false });
    } catch (error) {
      console.error('Error creando noticia:', error);
    }
  };

  const handleUpdateNews = async (newsId) => {
    try {
      await newsManagementService.updateNews(newsId, newsForm);
      await loadDashboardData();
      setShowNewsModal(false);
    } catch (error) {
      console.error('Error actualizando noticia:', error);
    }
  };

  const handleDeleteNews = async (newsId) => {
    if (window.confirm('¿Está seguro de eliminar esta noticia?')) {
      try {
        await newsManagementService.deleteNews(newsId);
        await loadDashboardData();
      } catch (error) {
        console.error('Error eliminando noticia:', error);
      }
    }
  };

  const handleToggleNewsStatus = async (newsId) => {
    try {
      await newsManagementService.toggleNewsStatus(newsId);
      await loadDashboardData();
    } catch (error) {
      console.error('Error cambiando estado de la noticia:', error);
    }
  };

  const handleToggleFeatured = async (newsId) => {
    try {
      await newsManagementService.toggleFeaturedStatus(newsId);
      await loadDashboardData();
    } catch (error) {
      console.error('Error cambiando estado destacado:', error);
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
                    <FaNewspaper className="me-2" />
                    Dashboard de Comunicación
                  </h2>
                  <p className="text-muted mb-0">
                    Bienvenido, <strong>{user?.nombre || user?.username}</strong>
                    <Badge bg="info" className="ms-2">Comunicación</Badge>
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
                <FaBell className="me-2" />
                Resumen
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link 
                eventKey="news" 
                onClick={() => setActiveTab('news')}
                className={`py-3 px-4 ${activeTab === 'news' ? 'bg-primary text-white' : ''}`}
              >
                <FaNewspaper className="me-2" />
                Noticias
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link 
                eventKey="content" 
                onClick={() => setActiveTab('content')}
                className={`py-3 px-4 ${activeTab === 'content' ? 'bg-primary text-white' : ''}`}
              >
                <FaEdit className="me-2" />
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
            title="Total Noticias"
            value={stats.totalNews}
            icon={FaNewspaper}
            color="primary"
            subtitle={`${stats.publishedNews} publicadas`}
          />
        </Col>
        <Col md={3}>
          <StatCard
                  title="Noticias Publicadas"
                  value={stats.publishedNews}
            icon={FaEye}
            color="success"
                  subtitle="Visibles al público"
          />
        </Col>
        <Col md={3}>
          <StatCard
                  title="Borradores"
                  value={stats.draftNews}
                  icon={FaEdit}
                  color="warning"
                  subtitle="En edición"
          />
        </Col>
        <Col md={3}>
          <StatCard
                  title="Destacadas"
                  value={stats.featuredNews}
                  icon={FaTag}
                  color="info"
                  subtitle="Noticias importantes"
          />
        </Col>
      </Row>

      <Row>
              <Col md={8}>
                <Card className="border-0 shadow-sm">
                  <Card.Header className="bg-primary text-white">
                    <h5 className="mb-0">
                      <FaNewspaper className="me-2" />
                      Noticias Recientes
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
                          {news.slice(0, 5).map(item => (
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
                                    {item.featured && <Badge bg="danger" className="ms-2">Destacada</Badge>}
                                  </div>
                                </div>
                              </td>
                              <td className="py-3 px-4">
                                <Badge bg="info">{item.category}</Badge>
                              </td>
                              <td className="py-3 px-4">
                                <Badge bg={item.published ? 'success' : 'warning'}>
                                  {item.published ? 'Publicada' : 'Borrador'}
                              </Badge>
                            </td>
                              <td className="py-3 px-4">
                                <small className="text-muted">
                                  <FaCalendarAlt className="me-1" />
                                  {new Date(item.date).toLocaleDateString()}
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
                  <Card.Header className="bg-info text-white">
                    <h6 className="mb-0">
                      <FaBell className="me-2" />
                      Acciones Rápidas
                    </h6>
                  </Card.Header>
                  <Card.Body>
                    <div className="d-grid gap-2">
                      <Button variant="primary" onClick={() => setShowNewsModal(true)}>
                        <FaPlus className="me-2" />
                        Nueva Noticia
                      </Button>
                      <Button variant="outline-primary" onClick={() => setShowContentModal(true)}>
                        <FaEdit className="me-2" />
                        Nuevo Contenido
                      </Button>
                      <Button variant="outline-info" onClick={() => setActiveTab('news')}>
                        <FaNewspaper className="me-2" />
                        Gestionar Noticias
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </div>
        )}

        {/* Pestaña de Noticias */}
        {activeTab === 'news' && (
          <div>
            <Row className="mb-4">
              <Col>
                <Card className="border-0 shadow-sm">
                  <Card.Body className="py-3">
                    <div className="d-flex justify-content-between align-items-center">
                      <h5 className="mb-0 text-primary">
                        <FaNewspaper className="me-2" />
                        Gestión de Noticias
                      </h5>
                      <Button variant="primary" onClick={() => setShowNewsModal(true)}>
                        <FaPlus className="me-2" />
                        Nueva Noticia
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
                        <th className="border-0 py-3 px-4">Estado</th>
                        <th className="border-0 py-3 px-4">Destacada</th>
                        <th className="border-0 py-3 px-4">Fecha</th>
                        <th className="border-0 py-3 px-4 text-center">Acciones</th>
                        </tr>
                      </thead>
                      <tbody>
                      {news.map(item => (
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
                                <small className="text-muted">{item.excerpt}</small>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <Badge bg="info">{item.category}</Badge>
                          </td>
                          <td className="py-3 px-4">
                            <Badge bg={item.published ? 'success' : 'warning'}>
                              {item.published ? 'Publicada' : 'Borrador'}
                              </Badge>
                            </td>
                          <td className="py-3 px-4">
                            {item.featured && <Badge bg="danger">Destacada</Badge>}
                          </td>
                          <td className="py-3 px-4">
                            <small className="text-muted">
                              <FaCalendarAlt className="me-1" />
                              {new Date(item.date).toLocaleDateString()}
                            </small>
                          </td>
                          <td className="py-3 px-4 text-center">
                            <div className="btn-group" role="group">
                              <Button
                                variant="outline-primary"
                                size="sm"
                                className="me-1"
                                onClick={() => {
                                  setNewsForm(item);
                                  setShowNewsModal(true);
                                }}
                                title="Editar noticia"
                              >
                                <FaEdit />
                              </Button>
                              <Button
                                variant="outline-warning"
                                size="sm"
                                className="me-1"
                                onClick={() => handleToggleNewsStatus(item.id)}
                                title={item.published ? 'Despublicar' : 'Publicar'}
                              >
                                {item.published ? 'Ocultar' : 'Publicar'}
                              </Button>
                              <Button
                                variant="outline-info"
                                size="sm"
                                className="me-1"
                                onClick={() => handleToggleFeatured(item.id)}
                                title={item.featured ? 'Quitar destacado' : 'Destacar'}
                              >
                                <FaTag />
                              </Button>
                              <Button
                                variant="outline-danger"
                                size="sm"
                                onClick={() => handleDeleteNews(item.id)}
                                title="Eliminar noticia"
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
                        <FaEdit className="me-2" />
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

      {/* Modal de Noticias */}
      <Modal show={showNewsModal} onHide={() => setShowNewsModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            <FaNewspaper className="me-2" />
            {newsForm.id ? 'Editar Noticia' : 'Nueva Noticia'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Título</Form.Label>
              <Form.Control
                type="text"
                value={newsForm.title}
                onChange={(e) => setNewsForm({...newsForm, title: e.target.value})}
                placeholder="Ingrese el título de la noticia"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Resumen</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={newsForm.excerpt}
                onChange={(e) => setNewsForm({...newsForm, excerpt: e.target.value})}
                placeholder="Breve resumen de la noticia"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Contenido</Form.Label>
              <Form.Control
                as="textarea"
                rows={6}
                value={newsForm.body}
                onChange={(e) => setNewsForm({...newsForm, body: e.target.value})}
                placeholder="Contenido completo de la noticia"
              />
            </Form.Group>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Categoría</Form.Label>
                  <Form.Select
                    value={newsForm.category}
                    onChange={(e) => setNewsForm({...newsForm, category: e.target.value})}
                  >
                    <option value="general">General</option>
                    <option value="gobierno">Gobierno</option>
                    <option value="servicios">Servicios</option>
                    <option value="eventos">Eventos</option>
                    <option value="emergencias">Emergencias</option>
                    <option value="transparencia">Transparencia</option>
                    <option value="participacion">Participación Ciudadana</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>URL de Imagen</Form.Label>
                  <Form.Control
                    type="text"
                    value={newsForm.image}
                    onChange={(e) => setNewsForm({...newsForm, image: e.target.value})}
                    placeholder="https://ejemplo.com/imagen.jpg"
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Form.Check
                  type="checkbox"
                  label="Publicada"
                  checked={newsForm.published}
                  onChange={(e) => setNewsForm({...newsForm, published: e.target.checked})}
                />
              </Col>
              <Col md={6}>
                <Form.Check
                  type="checkbox"
                  label="Destacada"
                  checked={newsForm.featured}
                  onChange={(e) => setNewsForm({...newsForm, featured: e.target.checked})}
                />
              </Col>
            </Row>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowNewsModal(false)}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={newsForm.id ? () => handleUpdateNews(newsForm.id) : handleCreateNews}>
            <FaSave className="me-2" />
            {newsForm.id ? 'Actualizar' : 'Crear'} Noticia
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal de Contenido */}
      <Modal show={showContentModal} onHide={() => setShowContentModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            <FaEdit className="me-2" />
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
                    <option value="inicio">Inicio</option>
                    <option value="mision-vision">Misión y Visión</option>
                    <option value="historia">Historia</option>
                    <option value="organigrama">Organigrama</option>
                    <option value="autoridades">Autoridades</option>
                    <option value="servicios">Servicios</option>
                    <option value="tarifas">Tarifas</option>
                    <option value="presupuesto">Presupuesto</option>
                    <option value="convenios-contratos">Convenios y Contratos</option>
                    <option value="informes-gestion">Informes de Gestión</option>
                    <option value="reglamentos">Reglamentos</option>
                    <option value="rendicion-cuentas">Rendición de Cuentas</option>
                    <option value="transparencia">Transparencia LOTAIP</option>
                    <option value="buzon">Buzón de Sugerencias</option>
                    <option value="direccion-mapa">Dirección y Mapa</option>
                    <option value="participacion-ciudadana">Participación Ciudadana</option>
                    <option value="entrega-gas">Entrega de Gas</option>
                    <option value="puntos-venta">Puntos de Venta</option>
                    <option value="tipos-cilindros">Tipos de Cilindros</option>
                    <option value="horarios">Horarios</option>
                    <option value="precios-gas">Precios de Gas</option>
                    <option value="promociones-subsidios">Promociones y Subsidios</option>
                    <option value="encuestas">Encuestas</option>
                    <option value="canales-atencion">Canales de Atención</option>
                    <option value="comunicados">Comunicados</option>
                    <option value="actividades">Actividades</option>
                    <option value="campanas">Campañas</option>
                    <option value="telefonos-correos">Teléfonos y Correos</option>
                    <option value="redes-sociales">Redes Sociales</option>
                    <option value="tramites">Trámites</option>
                    <option value="noticias">Noticias</option>
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

export default ComunicacionDashboard;