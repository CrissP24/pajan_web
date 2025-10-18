import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Table, Badge, Modal, Form, Alert, Nav, Tab } from 'react-bootstrap';
import { 
  FaUsers, 
  FaChartBar, 
  FaFileAlt, 
  FaNewspaper, 
  FaEdit, 
  FaTrash, 
  FaPlus,
  FaCog,
  FaShieldAlt,
  FaBell,
  FaFileInvoice,
  FaSave,
  FaUserPlus,
  FaSignOutAlt
} from 'react-icons/fa';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import adminService from '../../services/adminService';
import contentManagementService from '../../services/contentManagementService';
import newsManagementService from '../../services/newsManagementService';
import documentManagementService from '../../services/documentManagementService';
import proceduresService from '../../services/proceduresService';
import budgetService from '../../services/budgetService';

const AdminDashboard = ({ user }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalDocuments: 0,
    totalNews: 0,
    totalContent: 0,
    totalProcedures: 0,
    totalBudgetSections: 0,
    activeUsers: 0,
    recentActivity: []
  });

  const [users, setUsers] = useState([]);
  const [content, setContent] = useState([]);
  const [news, setNews] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [procedures, setProcedures] = useState([]);
  const [budgetSections, setBudgetSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  // Modales
  const [showUserModal, setShowUserModal] = useState(false);
  const [showContentModal, setShowContentModal] = useState(false);
  const [showNewsModal, setShowNewsModal] = useState(false);
  const [showDocumentModal, setShowDocumentModal] = useState(false);
  const [showProcedureModal, setShowProcedureModal] = useState(false);
  const [showBudgetModal, setShowBudgetModal] = useState(false);

  // Formularios
  const [userForm, setUserForm] = useState({
    username: '',
    email: '',
    nombre: '',
    roles: [],
    active: true
  });
  const [contentForm, setContentForm] = useState({
    section: '',
    title: '',
    body: '',
    image: '',
    published: false,
    order: 0
  });
  const [newsForm, setNewsForm] = useState({
    title: '',
    excerpt: '',
    body: '',
    category: 'general',
    image: '',
    published: false,
    featured: false
  });
  const [documentForm, setDocumentForm] = useState({
    title: '',
    content: '',
    category: '',
    section: '',
    published: false,
    slug: ''
  });
  const [procedureForm, setProcedureForm] = useState({
    type: 'certificate',
    title: '',
    description: '',
    requirements: [],
    cost: 0,
    duration: '',
    category: '',
    active: true
  });
  const [budgetForm, setBudgetForm] = useState({
    title: '',
    content: '',
    additionalContent: '',
    icon: 'dollar',
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
      const statsData = await adminService.getSystemStats();
      const proceduresStats = await proceduresService.getProceduresStats();
      const budgetStats = await budgetService.getBudgetStats();
      
      setStats({
        ...statsData,
        totalProcedures: proceduresStats.total,
        totalBudgetSections: budgetStats.totalSections
      });

      // Cargar datos de cada módulo
      const [usersData, contentData, newsData, documentsData, proceduresData, budgetSectionsData] = await Promise.all([
        adminService.getUsers(),
        contentManagementService.getAllContent(),
        newsManagementService.getNews(),
        documentManagementService.getDocuments(),
        proceduresService.getProcedures(),
        budgetService.getBudgetSections()
      ]);

      setUsers(usersData);
      setContent(contentData);
      setNews(newsData);
      setDocuments(documentsData);
      setProcedures(proceduresData);
      setBudgetSections(budgetSectionsData);
    } catch (error) {
      console.error('Error cargando datos del dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  // Funciones de gestión de usuarios
  const handleCreateUser = async () => {
    try {
      await adminService.createUser(userForm);
      await loadDashboardData();
      setShowUserModal(false);
      setUserForm({ username: '', email: '', nombre: '', roles: [], active: true });
    } catch (error) {
      console.error('Error creando usuario:', error);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('¿Está seguro de eliminar este usuario?')) {
      try {
        await adminService.deleteUser(userId);
        await loadDashboardData();
      } catch (error) {
        console.error('Error eliminando usuario:', error);
      }
    }
  };

  const handleToggleUserStatus = async (userId) => {
    try {
      await adminService.toggleUserStatus(userId);
      await loadDashboardData();
    } catch (error) {
      console.error('Error cambiando estado del usuario:', error);
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

  // Funciones de gestión de trámites
  const handleCreateProcedure = async () => {
    try {
      await proceduresService.createProcedure(procedureForm);
      await loadDashboardData();
      setShowProcedureModal(false);
      setProcedureForm({ type: 'certificate', title: '', description: '', requirements: [], cost: 0, duration: '', category: '', active: true });
    } catch (error) {
      console.error('Error creando trámite:', error);
    }
  };

  const handleUpdateProcedure = async (procedureId) => {
    try {
      await proceduresService.updateProcedure(procedureId, procedureForm);
      await loadDashboardData();
      setShowProcedureModal(false);
    } catch (error) {
      console.error('Error actualizando trámite:', error);
    }
  };

  const handleDeleteProcedure = async (procedureId) => {
    if (window.confirm('¿Está seguro de eliminar este trámite?')) {
      try {
        await proceduresService.deleteProcedure(procedureId);
        await loadDashboardData();
      } catch (error) {
        console.error('Error eliminando trámite:', error);
      }
    }
  };

  const handleToggleProcedureStatus = async (procedureId) => {
    try {
      await proceduresService.toggleProcedureStatus(procedureId);
      await loadDashboardData();
    } catch (error) {
      console.error('Error cambiando estado del trámite:', error);
    }
  };

  // Funciones de gestión de presupuesto
  const handleCreateBudgetSection = async () => {
    try {
      await budgetService.createBudgetSection(budgetForm);
      await loadDashboardData();
      setShowBudgetModal(false);
      setBudgetForm({ title: '', content: '', additionalContent: '', icon: 'dollar', published: false, order: 0 });
    } catch (error) {
      console.error('Error creando sección de presupuesto:', error);
    }
  };

  const handleUpdateBudgetSection = async (budgetSectionId) => {
    try {
      await budgetService.updateBudgetSection(budgetSectionId, budgetForm);
      await loadDashboardData();
      setShowBudgetModal(false);
    } catch (error) {
      console.error('Error actualizando sección de presupuesto:', error);
    }
  };

  const handleDeleteBudgetSection = async (budgetSectionId) => {
    if (window.confirm('¿Está seguro de eliminar esta sección de presupuesto?')) {
      try {
        await budgetService.deleteBudgetSection(budgetSectionId);
        await loadDashboardData();
      } catch (error) {
        console.error('Error eliminando sección de presupuesto:', error);
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
                    <FaCog className="me-2" />
                    Dashboard Administrativo
                  </h2>
                  <p className="text-muted mb-0">
                    Bienvenido, <strong>{user?.nombre || user?.username}</strong>
                    <Badge bg="success" className="ms-2">{user?.roles?.[0]}</Badge>
                  </p>
            </div>
                <div className="d-flex gap-2">
                  <Button 
                    variant="outline-primary" 
                    size="sm"
                    onClick={() => window.location.reload()}
                  >
                    <FaCog className="me-1" />
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
                <FaChartBar className="me-2" />
                Resumen
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link 
                eventKey="users" 
                onClick={() => setActiveTab('users')}
                className={`py-3 px-4 ${activeTab === 'users' ? 'bg-primary text-white' : ''}`}
              >
                <FaUsers className="me-2" />
                Usuarios
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
                eventKey="procedures" 
                onClick={() => setActiveTab('procedures')}
                className={`py-3 px-4 ${activeTab === 'procedures' ? 'bg-primary text-white' : ''}`}
              >
                <FaCog className="me-2" />
                Trámites
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link 
                eventKey="budget" 
                onClick={() => setActiveTab('budget')}
                className={`py-3 px-4 ${activeTab === 'budget' ? 'bg-primary text-white' : ''}`}
              >
                <FaChartBar className="me-2" />
                Presupuesto
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
            title="Total Usuarios"
            value={stats.totalUsers}
            icon={FaUsers}
            color="primary"
            subtitle={`${stats.activeUsers} activos`}
          />
        </Col>
        <Col md={3}>
          <StatCard
                  title="Contenido"
                  value={stats.totalContent}
            icon={FaFileAlt}
            color="success"
                  subtitle="Páginas dinámicas"
          />
        </Col>
        <Col md={3}>
          <StatCard
            title="Noticias"
            value={stats.totalNews}
            icon={FaNewspaper}
            color="info"
            subtitle="Publicadas"
          />
        </Col>
        <Col md={3}>
          <StatCard
                  title="Documentos"
                  value={stats.totalDocuments}
                  icon={FaFileInvoice}
            color="warning"
                  subtitle="En el sistema"
          />
        </Col>
      </Row>

      <Row className="mt-3">
        <Col md={3}>
          <StatCard
            title="Trámites"
            value={stats.totalProcedures}
            icon={FaCog}
            color="secondary"
            subtitle="Disponibles"
          />
        </Col>
        <Col md={3}>
          <StatCard
            title="Presupuesto"
            value={stats.totalBudgetSections}
            icon={FaChartBar}
            color="dark"
            subtitle="Secciones"
          />
                </Col>
                <Col md={6}>
          <Card className="h-100">
            <Card.Body className="d-flex align-items-center">
              <div className="flex-grow-1">
                <h6 className="text-muted mb-2">Sistema Completo</h6>
                <h4 className="mb-0 text-success">Funcionando</h4>
                <small className="text-muted">Todos los módulos activos</small>
                  </div>
              <div className="p-3 rounded-3 bg-success text-white">
                <FaCog size={28} />
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col md={8}>
          <Card>
            <Card.Header>
              <h5 className="mb-0">Actividad Reciente</h5>
            </Card.Header>
            <Card.Body>
              <Table responsive>
                <thead>
                  <tr>
                    <th>Acción</th>
                    <th>Usuario</th>
                    <th>Tiempo</th>
                  </tr>
                </thead>
                <tbody>
                        {stats.recentActivity.map(activity => (
                    <tr key={activity.id}>
                      <td>{activity.action}</td>
                      <td>{activity.user}</td>
                            <td>{new Date(activity.timestamp).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
                <Card>
            <Card.Header>
              <h6 className="mb-0">
                <FaBell className="me-2" />
                      Estado del Sistema
              </h6>
            </Card.Header>
            <Card.Body>
                    <Alert variant="success" className="py-2">
                      <small>Sistema funcionando correctamente</small>
              </Alert>
              <Alert variant="info" className="py-2">
                      <small>Última actualización: {new Date().toLocaleString()}</small>
              </Alert>
            </Card.Body>
          </Card>
              </Col>
            </Row>
          </div>
        )}

        {/* Pestaña de Usuarios */}
        {activeTab === 'users' && (
          <div>
            <Row className="mb-4">
              <Col>
                <Card className="border-0 shadow-sm">
                  <Card.Body className="py-3">
                    <div className="d-flex justify-content-between align-items-center">
                      <h5 className="mb-0 text-primary">
                        <FaUsers className="me-2" />
                        Gestión de Usuarios
                      </h5>
                      <Button variant="primary" onClick={() => setShowUserModal(true)}>
                        <FaUserPlus className="me-2" />
                        Nuevo Usuario
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
                        <th className="border-0 py-3 px-4">Usuario</th>
                        <th className="border-0 py-3 px-4">Email</th>
                        <th className="border-0 py-3 px-4">Nombre</th>
                        <th className="border-0 py-3 px-4">Roles</th>
                        <th className="border-0 py-3 px-4">Estado</th>
                        <th className="border-0 py-3 px-4 text-center">Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map(user => (
                        <tr key={user.id} className="border-bottom">
                          <td className="py-3 px-4">
                            <div className="d-flex align-items-center">
                              <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-3" style={{width: '40px', height: '40px'}}>
                                {user.username.charAt(0).toUpperCase()}
                              </div>
                              <strong>{user.username}</strong>
                            </div>
                          </td>
                          <td className="py-3 px-4">{user.email}</td>
                          <td className="py-3 px-4">{user.nombre}</td>
                          <td className="py-3 px-4">
                            {user.roles.map(role => (
                              <Badge key={role} bg="info" className="me-1">{role}</Badge>
                            ))}
                          </td>
                          <td className="py-3 px-4">
                            <Badge bg={user.active ? 'success' : 'danger'}>
                              {user.active ? 'Activo' : 'Inactivo'}
                            </Badge>
                          </td>
                          <td className="py-3 px-4 text-center">
                            <div className="btn-group" role="group">
                              <Button
                                variant="outline-warning"
                                size="sm"
                                className="me-1"
                                onClick={() => handleToggleUserStatus(user.id)}
                                title={user.active ? 'Desactivar usuario' : 'Activar usuario'}
                              >
                                {user.active ? 'Desactivar' : 'Activar'}
                              </Button>
                              <Button
                                variant="outline-danger"
                                size="sm"
                                onClick={() => handleDeleteUser(user.id)}
                                title="Eliminar usuario"
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
            <Row className="mb-3">
              <Col>
                <Button variant="primary" onClick={() => setShowContentModal(true)}>
                  <FaPlus className="me-2" />
                  Nuevo Contenido
                </Button>
              </Col>
            </Row>
          <Card>
            <Card.Header>
                <h5 className="mb-0">Gestión de Contenido</h5>
            </Card.Header>
            <Card.Body>
                <Table responsive>
                  <thead>
                    <tr>
                      <th>Título</th>
                      <th>Sección</th>
                      <th>Estado</th>
                      <th>Orden</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {content.map(item => (
                      <tr key={item.id}>
                        <td>{item.title}</td>
                        <td>{item.section}</td>
                        <td>
                          <Badge bg={item.published ? 'success' : 'warning'}>
                            {item.published ? 'Publicado' : 'Borrador'}
                          </Badge>
                        </td>
                        <td>{item.order}</td>
                        <td>
                          <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={() => handleDeleteContent(item.id)}
                          >
                            <FaTrash />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
          </div>
        )}

        {/* Pestaña de Noticias */}
        {activeTab === 'news' && (
          <div>
            <Row className="mb-3">
              <Col>
                <Button variant="primary" onClick={() => setShowNewsModal(true)}>
                  <FaPlus className="me-2" />
                  Nueva Noticia
                </Button>
              </Col>
            </Row>
            <Card>
              <Card.Header>
                <h5 className="mb-0">Gestión de Noticias</h5>
              </Card.Header>
              <Card.Body>
                <Table responsive>
                  <thead>
                    <tr>
                      <th>Título</th>
                      <th>Categoría</th>
                      <th>Estado</th>
                      <th>Destacada</th>
                      <th>Fecha</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {news.map(item => (
                      <tr key={item.id}>
                        <td>{item.title}</td>
                        <td>
                          <Badge bg="info">{item.category}</Badge>
                        </td>
                        <td>
                          <Badge bg={item.published ? 'success' : 'warning'}>
                            {item.published ? 'Publicada' : 'Borrador'}
                          </Badge>
                        </td>
                        <td>
                          {item.featured && <Badge bg="danger">Destacada</Badge>}
                        </td>
                        <td>{new Date(item.date).toLocaleDateString()}</td>
                        <td>
                          <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={() => handleDeleteNews(item.id)}
                          >
                            <FaTrash />
                </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
          </div>
        )}

        {/* Pestaña de Documentos */}
        {activeTab === 'documents' && (
          <div>
            <Row className="mb-3">
              <Col>
                <Button variant="primary" onClick={() => setShowDocumentModal(true)}>
                  <FaPlus className="me-2" />
                  Nuevo Documento
                </Button>
              </Col>
            </Row>
            <Card>
              <Card.Header>
                <h5 className="mb-0">Gestión de Documentos</h5>
              </Card.Header>
              <Card.Body>
                <Table responsive>
                  <thead>
                    <tr>
                      <th>Título</th>
                      <th>Categoría</th>
                      <th>Sección</th>
                      <th>Estado</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {documents.map(item => (
                      <tr key={item.id}>
                        <td>{item.title}</td>
                        <td>
                          <Badge bg="secondary">{item.category}</Badge>
                        </td>
                        <td>{item.section}</td>
                        <td>
                          <Badge bg={item.published ? 'success' : 'warning'}>
                            {item.published ? 'Publicado' : 'Borrador'}
                          </Badge>
                        </td>
                        <td>
                          <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={() => handleDeleteDocument(item.id)}
                          >
                            <FaTrash />
                </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
            </Card.Body>
          </Card>
          </div>
        )}

        {/* Pestaña de Trámites */}
        {activeTab === 'procedures' && (
          <div>
            <Row className="mb-4">
              <Col>
                <Card className="border-0 shadow-sm">
                  <Card.Body className="py-3">
                    <div className="d-flex justify-content-between align-items-center">
                      <h5 className="mb-0 text-primary">
                  <FaCog className="me-2" />
                        Gestión de Trámites en Línea
                      </h5>
                      <Button variant="primary" onClick={() => setShowProcedureModal(true)}>
                        <FaPlus className="me-2" />
                        Nuevo Trámite
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
                        <th className="border-0 py-3 px-4">Tipo</th>
                        <th className="border-0 py-3 px-4">Categoría</th>
                        <th className="border-0 py-3 px-4">Costo</th>
                        <th className="border-0 py-3 px-4">Duración</th>
                        <th className="border-0 py-3 px-4">Estado</th>
                        <th className="border-0 py-3 px-4 text-center">Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {procedures.map(item => (
                        <tr key={item.id} className="border-bottom">
                          <td className="py-3 px-4">
                            <div>
                              <strong>{item.title}</strong>
                              <br />
                              <small className="text-muted">{item.description}</small>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <Badge bg={item.type === 'certificate' ? 'info' : 'success'}>
                              {item.type === 'certificate' ? 'Certificado' : 'Pago'}
                            </Badge>
                          </td>
                          <td className="py-3 px-4">
                            <Badge bg="secondary">{item.category}</Badge>
                          </td>
                          <td className="py-3 px-4">
                            ${item.cost.toFixed(2)}
                          </td>
                          <td className="py-3 px-4">
                            {item.duration}
                          </td>
                          <td className="py-3 px-4">
                            <Badge bg={item.active ? 'success' : 'danger'}>
                              {item.active ? 'Activo' : 'Inactivo'}
                            </Badge>
                          </td>
                          <td className="py-3 px-4 text-center">
                            <div className="btn-group" role="group">
                              <Button
                                variant="outline-primary"
                                size="sm"
                                className="me-1"
                                onClick={() => {
                                  setProcedureForm(item);
                                  setShowProcedureModal(true);
                                }}
                                title="Editar trámite"
                              >
                                <FaEdit />
                </Button>
                              <Button
                                variant="outline-warning"
                                size="sm"
                                className="me-1"
                                onClick={() => handleToggleProcedureStatus(item.id)}
                                title={item.active ? 'Desactivar' : 'Activar'}
                              >
                                {item.active ? 'Desactivar' : 'Activar'}
                </Button>
                              <Button
                                variant="outline-danger"
                                size="sm"
                                onClick={() => handleDeleteProcedure(item.id)}
                                title="Eliminar trámite"
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

        {/* Pestaña de Presupuesto */}
        {activeTab === 'budget' && (
          <div>
            <Row className="mb-4">
              <Col>
                <Card className="border-0 shadow-sm">
                  <Card.Body className="py-3">
                    <div className="d-flex justify-content-between align-items-center">
                      <h5 className="mb-0 text-primary">
                        <FaChartBar className="me-2" />
                        Gestión de Presupuesto Municipal
                      </h5>
                      <Button variant="primary" onClick={() => setShowBudgetModal(true)}>
                        <FaPlus className="me-2" />
                        Nueva Sección
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
                        <th className="border-0 py-3 px-4">Contenido</th>
                        <th className="border-0 py-3 px-4">Icono</th>
                        <th className="border-0 py-3 px-4">Orden</th>
                        <th className="border-0 py-3 px-4">Estado</th>
                        <th className="border-0 py-3 px-4 text-center">Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {budgetSections.map(item => (
                        <tr key={item.id} className="border-bottom">
                          <td className="py-3 px-4">
                            <strong>{item.title}</strong>
                          </td>
                          <td className="py-3 px-4">
                            <div>
                              <small className="text-muted">
                                {item.content?.substring(0, 100)}...
                              </small>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <Badge bg="info">{item.icon}</Badge>
                          </td>
                          <td className="py-3 px-4">{item.order}</td>
                          <td className="py-3 px-4">
                            <Badge bg={item.published ? 'success' : 'warning'}>
                              {item.published ? 'Publicado' : 'Borrador'}
                            </Badge>
                          </td>
                          <td className="py-3 px-4 text-center">
                            <div className="btn-group" role="group">
                              <Button
                                variant="outline-primary"
                                size="sm"
                                className="me-1"
                                onClick={() => {
                                  setBudgetForm(item);
                                  setShowBudgetModal(true);
                                }}
                                title="Editar sección"
                              >
                                <FaEdit />
                              </Button>
                              <Button
                                variant="outline-danger"
                                size="sm"
                                onClick={() => handleDeleteBudgetSection(item.id)}
                                title="Eliminar sección"
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

      {/* Modal de Usuario */}
      <Modal show={showUserModal} onHide={() => setShowUserModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Nuevo Usuario</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Row>
              <Col md={6}>
            <Form.Group className="mb-3">
                  <Form.Label>Usuario</Form.Label>
                  <Form.Control
                    type="text"
                    value={userForm.username}
                    onChange={(e) => setUserForm({...userForm, username: e.target.value})}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    value={userForm.email}
                    onChange={(e) => setUserForm({...userForm, email: e.target.value})}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Form.Group className="mb-3">
              <Form.Label>Nombre Completo</Form.Label>
              <Form.Control
                type="text"
                value={userForm.nombre}
                onChange={(e) => setUserForm({...userForm, nombre: e.target.value})}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Roles</Form.Label>
              <Form.Select
                multiple
                value={userForm.roles}
                onChange={(e) => {
                  const selectedRoles = Array.from(e.target.selectedOptions, option => option.value);
                  setUserForm({...userForm, roles: selectedRoles});
                }}
              >
                <option value="Superadministrador">Superadministrador</option>
                <option value="Comunicación">Comunicación</option>
                <option value="Transparencia">Transparencia</option>
                <option value="TIC">TIC</option>
                <option value="Participación Ciudadana">Participación Ciudadana</option>
              </Form.Select>
            </Form.Group>
            <Form.Check
              type="checkbox"
              label="Usuario Activo"
              checked={userForm.active}
              onChange={(e) => setUserForm({...userForm, active: e.target.checked})}
            />
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowUserModal(false)}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleCreateUser}>
            <FaSave className="me-2" />
            Crear Usuario
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal de Contenido */}
      <Modal show={showContentModal} onHide={() => setShowContentModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Nuevo Contenido</Modal.Title>
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
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Contenido</Form.Label>
              <Form.Control
                as="textarea"
                rows={6}
                value={contentForm.body}
                onChange={(e) => setContentForm({...contentForm, body: e.target.value})}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>URL de Imagen</Form.Label>
              <Form.Control
                type="text"
                value={contentForm.image}
                onChange={(e) => setContentForm({...contentForm, image: e.target.value})}
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
          <Button variant="primary" onClick={handleCreateContent}>
            <FaSave className="me-2" />
            Crear Contenido
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal de Noticias */}
      <Modal show={showNewsModal} onHide={() => setShowNewsModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Nueva Noticia</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Título</Form.Label>
              <Form.Control
                type="text"
                value={newsForm.title}
                onChange={(e) => setNewsForm({...newsForm, title: e.target.value})}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Resumen</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={newsForm.excerpt}
                onChange={(e) => setNewsForm({...newsForm, excerpt: e.target.value})}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Contenido</Form.Label>
              <Form.Control
                as="textarea"
                rows={6}
                value={newsForm.body}
                onChange={(e) => setNewsForm({...newsForm, body: e.target.value})}
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
          <Button variant="primary" onClick={handleCreateNews}>
            <FaSave className="me-2" />
            Crear Noticia
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal de Documentos */}
      <Modal show={showDocumentModal} onHide={() => setShowDocumentModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Nuevo Documento</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Título</Form.Label>
              <Form.Control
                type="text"
                value={documentForm.title}
                onChange={(e) => setDocumentForm({...documentForm, title: e.target.value})}
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
          <Button variant="primary" onClick={handleCreateDocument}>
            <FaSave className="me-2" />
            Crear Documento
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal de Trámites */}
      <Modal show={showProcedureModal} onHide={() => setShowProcedureModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            <FaCog className="me-2" />
            {procedureForm.id ? 'Editar Trámite' : 'Nuevo Trámite'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Título</Form.Label>
              <Form.Control
                type="text"
                value={procedureForm.title}
                onChange={(e) => setProcedureForm({...procedureForm, title: e.target.value})}
                placeholder="Ingrese el título del trámite"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Descripción</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={procedureForm.description}
                onChange={(e) => setProcedureForm({...procedureForm, description: e.target.value})}
                placeholder="Descripción del trámite"
              />
            </Form.Group>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Tipo</Form.Label>
                  <Form.Select
                    value={procedureForm.type}
                    onChange={(e) => setProcedureForm({...procedureForm, type: e.target.value})}
                  >
                    <option value="certificate">Certificado</option>
                    <option value="payment">Pago</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Categoría</Form.Label>
                  <Form.Control
                    type="text"
                    value={procedureForm.category}
                    onChange={(e) => setProcedureForm({...procedureForm, category: e.target.value})}
                    placeholder="categoría"
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Costo ($)</Form.Label>
                  <Form.Control
                    type="number"
                    step="0.01"
                    value={procedureForm.cost}
                    onChange={(e) => setProcedureForm({...procedureForm, cost: parseFloat(e.target.value)})}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Duración</Form.Label>
                  <Form.Control
                    type="text"
                    value={procedureForm.duration}
                    onChange={(e) => setProcedureForm({...procedureForm, duration: e.target.value})}
                    placeholder="ej: 2-3 días hábiles"
                  />
                </Form.Group>
              </Col>
            </Row>
            <Form.Check
              type="checkbox"
              label="Activo"
              checked={procedureForm.active}
              onChange={(e) => setProcedureForm({...procedureForm, active: e.target.checked})}
            />
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowProcedureModal(false)}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={procedureForm.id ? () => handleUpdateProcedure(procedureForm.id) : handleCreateProcedure}>
            <FaSave className="me-2" />
            {procedureForm.id ? 'Actualizar' : 'Crear'} Trámite
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal de Presupuesto */}
      <Modal show={showBudgetModal} onHide={() => setShowBudgetModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            <FaChartBar className="me-2" />
            {budgetForm.id ? 'Editar Sección' : 'Nueva Sección de Presupuesto'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Título</Form.Label>
              <Form.Control
                type="text"
                value={budgetForm.title}
                onChange={(e) => setBudgetForm({...budgetForm, title: e.target.value})}
                placeholder="Ingrese el título de la sección"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Contenido Principal</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                value={budgetForm.content}
                onChange={(e) => setBudgetForm({...budgetForm, content: e.target.value})}
                placeholder="Contenido principal de la sección"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Contenido Adicional</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={budgetForm.additionalContent}
                onChange={(e) => setBudgetForm({...budgetForm, additionalContent: e.target.value})}
                placeholder="Contenido adicional (opcional)"
              />
            </Form.Group>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Icono</Form.Label>
                  <Form.Select
                    value={budgetForm.icon}
                    onChange={(e) => setBudgetForm({...budgetForm, icon: e.target.value})}
                  >
                    <option value="dollar">💰 Dólar</option>
                    <option value="chart">📊 Gráfico</option>
                    <option value="file">📄 Archivo</option>
                    <option value="list">📋 Lista</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Orden</Form.Label>
                  <Form.Control
                    type="number"
                    value={budgetForm.order}
                    onChange={(e) => setBudgetForm({...budgetForm, order: parseInt(e.target.value)})}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Form.Check
              type="checkbox"
              label="Publicado"
              checked={budgetForm.published}
              onChange={(e) => setBudgetForm({...budgetForm, published: e.target.checked})}
            />
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowBudgetModal(false)}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={budgetForm.id ? () => handleUpdateBudgetSection(budgetForm.id) : handleCreateBudgetSection}>
            <FaSave className="me-2" />
            {budgetForm.id ? 'Actualizar' : 'Crear'} Sección
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default AdminDashboard;