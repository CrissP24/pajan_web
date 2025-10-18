import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Row, Col, Button, Badge, Modal, Form, Alert, Nav, Tab, Container, Breadcrumb, Table, Accordion } from 'react-bootstrap';
import { Home, FileText, Users, Search, Settings, LogOut, TrendingUp, TrendingDown, Trash2, Edit, Bell, BarChart3, Calendar, Eye, FilePlus, FileEdit, Save, X, MessageSquare, ClipboardList, Phone, UserCheck, Shield, Newspaper, ExternalLink, Plus, Download, FileCheck } from 'lucide-react';

const AdminDashboard = ({ user, handleLogout }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(''); // 'rendicion', 'transparencia', 'user'
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState('');
  
  const navigate = useNavigate();

  // Estados para Rendición de Cuentas
  const [rendicionCuentas, setRendicionCuentas] = useState([]);
  const [rendicionForm, setRendicionForm] = useState({
    year: new Date().getFullYear(),
    fase: '',
    titulo: '',
    descripcion: '',
    archivo_url: '',
    orden: 1
  });

  // Estados para Transparencia (LOTAIP)
  const [transparencia, setTransparencia] = useState([]);
  const [transparenciaForm, setTransparenciaForm] = useState({
    year: new Date().getFullYear(),
    mes: '',
    literal: '',
    titulo: '',
    descripcion: '',
    archivo_url: '',
    orden: 1
  });

  // Estados para Usuarios
  const [users, setUsers] = useState([]);
  const [userForm, setUserForm] = useState({
    username: '',
    email: '',
    password: '',
    role: 'user'
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    try {
      // Cargar datos desde localStorage
      const storedRendicion = JSON.parse(localStorage.getItem('rendicionCuentas') || '[]');
      const storedTransparencia = JSON.parse(localStorage.getItem('transparencia') || '[]');
      const storedUsers = JSON.parse(localStorage.getItem('adminUsers') || '[]');

      setRendicionCuentas(storedRendicion);
      setTransparencia(storedTransparencia);
      setUsers(storedUsers);
    } catch (err) {
      setError('Error al cargar datos: ' + err.message);
    }
  };

  // Funciones para Rendición de Cuentas
  const handleCreateRendicion = () => {
    setModalType('rendicion');
    setRendicionForm({
      year: selectedYear,
      fase: '',
      titulo: '',
      descripcion: '',
      archivo_url: '',
      orden: 1
    });
    setShowModal(true);
  };

  const handleSaveRendicion = () => {
    if (!rendicionForm.fase || !rendicionForm.titulo || !rendicionForm.archivo_url) {
      setError('Todos los campos son obligatorios');
      return;
    }

    const newRendicion = {
      id: Date.now(),
      ...rendicionForm,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const updatedRendicion = [...rendicionCuentas, newRendicion];
    setRendicionCuentas(updatedRendicion);
    localStorage.setItem('rendicionCuentas', JSON.stringify(updatedRendicion));
    setShowModal(false);
    setError('');
  };

  const handleDeleteRendicion = (id) => {
    if (window.confirm('¿Está seguro de que desea eliminar este documento?')) {
      const updatedRendicion = rendicionCuentas.filter(item => item.id !== id);
      setRendicionCuentas(updatedRendicion);
      localStorage.setItem('rendicionCuentas', JSON.stringify(updatedRendicion));
    }
  };

  // Funciones para Transparencia (LOTAIP)
  const handleCreateTransparencia = () => {
    setModalType('transparencia');
    setTransparenciaForm({
      year: selectedYear,
      mes: selectedMonth,
      literal: '',
      titulo: '',
      descripcion: '',
      archivo_url: '',
      orden: 1
    });
    setShowModal(true);
  };

  const handleSaveTransparencia = () => {
    if (!transparenciaForm.mes || !transparenciaForm.literal || !transparenciaForm.titulo || !transparenciaForm.archivo_url) {
      setError('Todos los campos son obligatorios');
      return;
    }

    const newTransparencia = {
      id: Date.now(),
      ...transparenciaForm,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const updatedTransparencia = [...transparencia, newTransparencia];
    setTransparencia(updatedTransparencia);
    localStorage.setItem('transparencia', JSON.stringify(updatedTransparencia));
    setShowModal(false);
    setError('');
  };

  const handleDeleteTransparencia = (id) => {
    if (window.confirm('¿Está seguro de que desea eliminar este documento?')) {
      const updatedTransparencia = transparencia.filter(item => item.id !== id);
      setTransparencia(updatedTransparencia);
      localStorage.setItem('transparencia', JSON.stringify(updatedTransparencia));
    }
  };

  // Funciones para Usuarios
  const handleCreateUser = () => {
    setModalType('user');
    setUserForm({
      username: '',
      email: '',
      password: '',
      role: 'user'
    });
    setShowModal(true);
  };

  const handleSaveUser = () => {
    if (!userForm.username || !userForm.email || !userForm.password) {
      setError('Todos los campos son obligatorios');
      return;
    }

    const newUser = {
      id: Date.now(),
      ...userForm,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const updatedUsers = [...users, newUser];
    setUsers(updatedUsers);
    localStorage.setItem('adminUsers', JSON.stringify(updatedUsers));
    setShowModal(false);
    setError('');
  };

  const handleDeleteUser = (id) => {
    if (window.confirm('¿Está seguro de que desea eliminar este usuario?')) {
      const updatedUsers = users.filter(item => item.id !== id);
      setUsers(updatedUsers);
      localStorage.setItem('adminUsers', JSON.stringify(updatedUsers));
    }
  };

  const handleOpenFile = (fileUrl) => {
    window.open(fileUrl, '_blank');
  };

  // Datos para las plantillas
  const fasesRendicion = [
    'FASE 1: PLANIFICACIÓN Y FACILITACIÓN DEL PROCESO POR LA CIUDADANÍA',
    'FASE 2: EVALUACIÓN DE LA GESTIÓN INSTITUCIONAL Y ELABORACIÓN DEL INFORME DE RENDICIÓN DE CUENTAS',
    'FASE 3: DELIBERACIÓN PÚBLICA Y EVALUACIÓN CIUDADANA DEL INFORME DE RENDICIÓN DE CUENTAS',
    'FASE 4: INCORPORACIÓN DE LA OPINIÓN CIUDADANA, RETROALIMENTACIÓN Y SEGUIMIENTO'
  ];

  const literalesTransparencia = [
    { literal: 'A1', titulo: 'Organigrama de la Institución' },
    { literal: 'A2', titulo: 'Base Legal que rige a la institución' },
    { literal: 'A3', titulo: 'Regulaciones y procedimientos internos' },
    { literal: 'A4', titulo: 'Metas y objetivos unidades administrativas' },
    { literal: 'B1', titulo: 'Directorio de la Institución' },
    { literal: 'B2', titulo: 'Distributivo del Personal' },
    { literal: 'C', titulo: 'Remuneración mensual por puesto' },
    { literal: 'D', titulo: 'Servicios que ofrece y la forma de acceder a ellos' },
    { literal: 'E', titulo: 'Texto Íntegro de contratos colectivos vigentes' },
    { literal: 'F1', titulo: 'Formularios o formatos de solicitudes' },
    { literal: 'F2', titulo: 'Solicitud de acceso a la información pública' },
    { literal: 'G', titulo: 'Presupuesto de la Institución' },
    { literal: 'H', titulo: 'Resultados de Auditorías Internas y Gubernamentales' },
    { literal: 'I', titulo: 'Procesos de contrataciones' },
    { literal: 'J', titulo: 'Empresas y personas que han incumplido contratos' },
    { literal: 'K', titulo: 'Planes y programas en ejecución' },
    { literal: 'L', titulo: 'Contratos de crédito externos o internos' },
    { literal: 'M', titulo: 'Mecanismos de rendición de cuentas a la ciudadanía' },
    { literal: 'N', titulo: 'Viáticos, Informes De Trabajo y Justificativos' },
    { literal: 'O', titulo: 'Responsable de atender la información pública' },
    { literal: 'S', titulo: 'Organismos seccionales, resoluciones, actas y planes de desarrollo' }
  ];

  const meses = [
    'ENERO', 'FEBRERO', 'MARZO', 'ABRIL', 'MAYO', 'JUNIO',
    'JULIO', 'AGOSTO', 'SEPTIEMBRE', 'OCTUBRE', 'NOVIEMBRE', 'DICIEMBRE'
  ];

  return (
    <Container fluid className="mt-4">
      <Breadcrumb>
        <Breadcrumb.Item href="#" onClick={() => navigate('/')}>
          <Home size={16} />
        </Breadcrumb.Item>
        <Breadcrumb.Item active>Dashboard Administrador</Breadcrumb.Item>
      </Breadcrumb>

      <Row className="mb-4">
        <Col>
          <h2 className="d-flex align-items-center">
            <Shield className="me-2 text-primary" />
            Dashboard de Administrador
          </h2>
          <p className="text-muted">Control total del sistema - Gestión de usuarios, rendición de cuentas y transparencia</p>
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
              <Users size={32} className="text-primary mb-2" />
              <h4>{users.length}</h4>
              <p className="text-muted mb-0">Usuarios</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center">
            <Card.Body>
              <FileCheck size={32} className="text-success mb-2" />
              <h4>{rendicionCuentas.length}</h4>
              <p className="text-muted mb-0">Rendición de Cuentas</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center">
            <Card.Body>
              <Shield size={32} className="text-info mb-2" />
              <h4>{transparencia.length}</h4>
              <p className="text-muted mb-0">Transparencia</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center">
            <Card.Body>
              <Calendar size={32} className="text-warning mb-2" />
              <h4>{selectedYear}</h4>
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
                  <Nav.Link eventKey="rendicion">Rendición de Cuentas</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="transparencia">Transparencia (LOTAIP)</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="users">Usuarios</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="presidentes">Presidentes Barriales</Nav.Link>
                </Nav.Item>
              </Nav>
            </Card.Header>
            <Card.Body>
              <Tab.Content>
                <Tab.Pane active={activeTab === 'overview'}>
                  <Row>
                    <Col md={8}>
                      <h5>Resumen del Sistema</h5>
                      <Row>
                        <Col md={6}>
                          <Card className="mb-3">
                            <Card.Body>
                              <h6>Usuarios Activos</h6>
                              <p className="text-muted">{users.length} usuarios registrados</p>
                              <Button variant="outline-primary" size="sm" onClick={() => setActiveTab('users')}>
                                Gestionar Usuarios
                              </Button>
                            </Card.Body>
                          </Card>
                        </Col>
                        <Col md={6}>
                          <Card className="mb-3">
                            <Card.Body>
                              <h6>Documentos de Rendición</h6>
                              <p className="text-muted">{rendicionCuentas.length} documentos</p>
                              <Button variant="outline-primary" size="sm" onClick={() => setActiveTab('rendicion')}>
                                Ver Rendición
                              </Button>
                            </Card.Body>
                          </Card>
                        </Col>
                        <Col md={6}>
                          <Card className="mb-3">
                            <Card.Body>
                              <h6>Documentos de Transparencia</h6>
                              <p className="text-muted">{transparencia.length} documentos LOTAIP</p>
                              <Button variant="outline-primary" size="sm" onClick={() => setActiveTab('transparencia')}>
                                Ver Transparencia
                              </Button>
                            </Card.Body>
                          </Card>
                        </Col>
                        <Col md={6}>
                          <Card className="mb-3">
                            <Card.Body>
                              <h6>Total de Documentos</h6>
                              <p className="text-muted">{rendicionCuentas.length + transparencia.length} documentos</p>
                              <Button variant="outline-primary" size="sm" onClick={() => setActiveTab('rendicion')}>
                                Gestionar Todo
                              </Button>
                            </Card.Body>
                          </Card>
                        </Col>
                      </Row>
                    </Col>
                    <Col md={4}>
                      <h5>Acciones Rápidas</h5>
                      <div className="d-grid gap-2">
                        <Button variant="primary" onClick={handleCreateUser}>
                          <Plus size={16} className="me-2" />
                          Nuevo Usuario
                        </Button>
                        <Button variant="outline-primary" onClick={handleCreateRendicion}>
                          <Plus size={16} className="me-2" />
                          Nuevo Documento Rendición
                        </Button>
                        <Button variant="outline-primary" onClick={handleCreateTransparencia}>
                          <Plus size={16} className="me-2" />
                          Nuevo Documento Transparencia
                        </Button>
                      </div>
                    </Col>
                  </Row>
                </Tab.Pane>

                <Tab.Pane active={activeTab === 'rendicion'}>
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <div>
                      <h5>Rendición de Cuentas {selectedYear}</h5>
                      <div className="d-flex gap-2 align-items-center">
                        <Form.Select 
                          style={{ width: 'auto' }}
                          value={selectedYear}
                          onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                        >
                          {Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - i).map(year => (
                            <option key={year} value={year}>{year}</option>
                          ))}
                        </Form.Select>
                      </div>
                    </div>
                    <Button variant="primary" onClick={handleCreateRendicion}>
                      <Plus size={16} className="me-2" />
                      Nuevo Documento
                    </Button>
                  </div>
                  
                  <Accordion>
                    {fasesRendicion.map((fase, index) => {
                      const documentosFase = rendicionCuentas.filter(doc => 
                        doc.fase === fase && doc.year === selectedYear
                      ).sort((a, b) => a.orden - b.orden);
                      
                      return (
                        <Accordion.Item key={index} eventKey={index.toString()}>
                          <Accordion.Header>
                            <strong>{fase}</strong>
                            <Badge bg="secondary" className="ms-2">{documentosFase.length} documentos</Badge>
                          </Accordion.Header>
                          <Accordion.Body>
                            {documentosFase.length > 0 ? (
                              <Table responsive striped>
                                <thead>
                                  <tr>
                                    <th>Documento</th>
                                    <th>Descripción</th>
                                    <th>Orden</th>
                                    <th>Acciones</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {documentosFase.map((doc) => (
                                    <tr key={doc.id}>
                                      <td>
                                        <strong>{doc.titulo}</strong>
                                      </td>
                                      <td>{doc.descripcion}</td>
                                      <td>{doc.orden}</td>
                                      <td>
                                        <Button
                                          variant="outline-primary"
                                          size="sm"
                                          onClick={() => handleOpenFile(doc.archivo_url)}
                                          className="me-1"
                                        >
                                          <ExternalLink size={14} />
                                        </Button>
                                        <Button
                                          variant="outline-danger"
                                          size="sm"
                                          onClick={() => handleDeleteRendicion(doc.id)}
                                        >
                                          <Trash2 size={14} />
                                        </Button>
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </Table>
                            ) : (
                              <p className="text-muted">No hay documentos en esta fase</p>
                            )}
                          </Accordion.Body>
                        </Accordion.Item>
                      );
                    })}
                  </Accordion>
                </Tab.Pane>

                <Tab.Pane active={activeTab === 'transparencia'}>
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <div>
                      <h5>Transparencia (LOTAIP) {selectedYear}</h5>
                      <div className="d-flex gap-2 align-items-center">
                        <Form.Select 
                          style={{ width: 'auto' }}
                          value={selectedYear}
                          onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                        >
                          {Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - i).map(year => (
                            <option key={year} value={year}>{year}</option>
                          ))}
                        </Form.Select>
                        <Form.Select 
                          style={{ width: 'auto' }}
                          value={selectedMonth}
                          onChange={(e) => setSelectedMonth(e.target.value)}
                        >
                          <option value="">Todos los meses</option>
                          {meses.map(mes => (
                            <option key={mes} value={mes}>{mes}</option>
                          ))}
                        </Form.Select>
                      </div>
                    </div>
                    <Button variant="primary" onClick={handleCreateTransparencia}>
                      <Plus size={16} className="me-2" />
                      Nuevo Documento
                    </Button>
                  </div>
                  
                  <Accordion>
                    {meses.map((mes, index) => {
                      const documentosMes = transparencia.filter(doc => 
                        doc.mes === mes && doc.year === selectedYear
                      ).sort((a, b) => a.orden - b.orden);
                      
                      if (selectedMonth && selectedMonth !== mes) return null;
                      
                      return (
                        <Accordion.Item key={index} eventKey={index.toString()}>
                          <Accordion.Header>
                            <strong>{mes}</strong>
                            <Badge bg="secondary" className="ms-2">{documentosMes.length} documentos</Badge>
                          </Accordion.Header>
                          <Accordion.Body>
                            {documentosMes.length > 0 ? (
                              <Table responsive striped>
                                <thead>
                                  <tr>
                                    <th>Literal</th>
                                    <th>Documento</th>
                                    <th>Descripción</th>
                                    <th>Acciones</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {documentosMes.map((doc) => (
                                    <tr key={doc.id}>
                                      <td>
                                        <Badge bg="primary">{doc.literal}</Badge>
                                      </td>
                                      <td>
                                        <strong>{doc.titulo}</strong>
                                      </td>
                                      <td>{doc.descripcion}</td>
                                      <td>
                                        <Button
                                          variant="outline-primary"
                                          size="sm"
                                          onClick={() => handleOpenFile(doc.archivo_url)}
                                          className="me-1"
                                        >
                                          <ExternalLink size={14} />
                                        </Button>
                                        <Button
                                          variant="outline-danger"
                                          size="sm"
                                          onClick={() => handleDeleteTransparencia(doc.id)}
                                        >
                                          <Trash2 size={14} />
                                        </Button>
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </Table>
                            ) : (
                              <p className="text-muted">No hay documentos en este mes</p>
                            )}
                          </Accordion.Body>
                        </Accordion.Item>
                      );
                    })}
                  </Accordion>
                </Tab.Pane>

                <Tab.Pane active={activeTab === 'users'}>
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h5>Gestión de Usuarios</h5>
                    <Button variant="primary" onClick={handleCreateUser}>
                      <Plus size={16} className="me-2" />
                      Nuevo Usuario
                    </Button>
                  </div>
                  
                  <Table responsive striped hover>
                    <thead>
                      <tr>
                        <th>Usuario</th>
                        <th>Email</th>
                        <th>Rol</th>
                        <th>Fecha</th>
                        <th>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((user) => (
                        <tr key={user.id}>
                          <td>
                            <strong>{user.username}</strong>
                          </td>
                          <td>{user.email}</td>
                          <td>
                            <Badge bg="secondary">{user.role}</Badge>
                          </td>
                          <td>
                            {new Date(user.createdAt).toLocaleDateString()}
                          </td>
                          <td>
                            <Button
                              variant="outline-danger"
                              size="sm"
                              onClick={() => handleDeleteUser(user.id)}
                            >
                              <Trash2 size={14} />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </Tab.Pane>

                <Tab.Pane active={activeTab === 'presidentes'}>
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h5>Gestión de Presidentes Barriales</h5>
                    <Button 
                      variant="primary" 
                      onClick={() => navigate('/presidentes-barriales')}
                      style={{ backgroundColor: '#8B4513', borderColor: '#8B4513' }}
                    >
                      <Plus size={16} className="me-2" />
                      Gestionar Presidentes
                    </Button>
                  </div>
                  
                  <Alert variant="info">
                    <strong>Gestión de Presidentes Barriales</strong><br />
                    Acceda al panel completo de gestión de presidentes barriales para crear, editar y administrar 
                    la información de los presidentes de cada barrio del cantón Paján.
                  </Alert>
                  
                  <Row>
                    <Col md={6}>
                      <Card className="mb-3">
                        <Card.Body>
                          <h6>Funcionalidades Disponibles</h6>
                          <ul className="mb-0">
                            <li>Crear nuevos presidentes barriales</li>
                            <li>Editar información existente</li>
                            <li>Gestionar estados (activo/inactivo)</li>
                            <li>Ver estadísticas por barrio</li>
                            <li>Contacto directo (teléfono, email)</li>
                          </ul>
                        </Card.Body>
                      </Card>
                    </Col>
                    <Col md={6}>
                      <Card className="mb-3">
                        <Card.Body>
                          <h6>Acceso Rápido</h6>
                          <div className="d-grid gap-2">
                            <Button 
                              variant="outline-primary" 
                              onClick={() => navigate('/presidentes-barriales')}
                            >
                              Ver Lista Completa
                            </Button>
                            <Button 
                              variant="outline-success" 
                              onClick={() => navigate('/presidentes-barriales')}
                            >
                              Crear Nuevo Presidente
                            </Button>
                          </div>
                        </Card.Body>
                      </Card>
                    </Col>
                  </Row>
                </Tab.Pane>
              </Tab.Content>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Modal para crear elementos */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            Nuevo {
              modalType === 'rendicion' ? 'Documento de Rendición de Cuentas' :
              modalType === 'transparencia' ? 'Documento de Transparencia' :
              modalType === 'user' ? 'Usuario' : 'Elemento'
            }
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {modalType === 'rendicion' && (
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Año *</Form.Label>
                <Form.Select
                  value={rendicionForm.year}
                  onChange={(e) => setRendicionForm({...rendicionForm, year: parseInt(e.target.value)})}
                >
                  {Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - i).map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </Form.Select>
              </Form.Group>
              
              <Form.Group className="mb-3">
                <Form.Label>Fase *</Form.Label>
                <Form.Select
                  value={rendicionForm.fase}
                  onChange={(e) => setRendicionForm({...rendicionForm, fase: e.target.value})}
                >
                  <option value="">Seleccionar fase</option>
                  {fasesRendicion.map((fase, index) => (
                    <option key={index} value={fase}>{fase}</option>
                  ))}
                </Form.Select>
              </Form.Group>
              
              <Form.Group className="mb-3">
                <Form.Label>Título del Documento *</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Ej: Matriz de Consulta Ciudadana"
                  value={rendicionForm.titulo}
                  onChange={(e) => setRendicionForm({...rendicionForm, titulo: e.target.value})}
                />
              </Form.Group>
              
              <Form.Group className="mb-3">
                <Form.Label>Descripción</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  placeholder="Descripción del documento"
                  value={rendicionForm.descripcion}
                  onChange={(e) => setRendicionForm({...rendicionForm, descripcion: e.target.value})}
                />
              </Form.Group>
              
              <Form.Group className="mb-3">
                <Form.Label>URL del Archivo PDF *</Form.Label>
                <Form.Control
                  type="url"
                  placeholder="https://ejemplo.com/documento.pdf"
                  value={rendicionForm.archivo_url}
                  onChange={(e) => setRendicionForm({...rendicionForm, archivo_url: e.target.value})}
                />
                <Form.Text className="text-muted">
                  Ingresa la URL completa del archivo PDF
                </Form.Text>
              </Form.Group>
              
              <Form.Group className="mb-3">
                <Form.Label>Orden</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="1"
                  value={rendicionForm.orden}
                  onChange={(e) => setRendicionForm({...rendicionForm, orden: parseInt(e.target.value)})}
                />
              </Form.Group>
            </Form>
          )}

          {modalType === 'transparencia' && (
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Año *</Form.Label>
                <Form.Select
                  value={transparenciaForm.year}
                  onChange={(e) => setTransparenciaForm({...transparenciaForm, year: parseInt(e.target.value)})}
                >
                  {Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - i).map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </Form.Select>
              </Form.Group>
              
              <Form.Group className="mb-3">
                <Form.Label>Mes *</Form.Label>
                <Form.Select
                  value={transparenciaForm.mes}
                  onChange={(e) => setTransparenciaForm({...transparenciaForm, mes: e.target.value})}
                >
                  <option value="">Seleccionar mes</option>
                  {meses.map(mes => (
                    <option key={mes} value={mes}>{mes}</option>
                  ))}
                </Form.Select>
              </Form.Group>
              
              <Form.Group className="mb-3">
                <Form.Label>Literal *</Form.Label>
                <Form.Select
                  value={transparenciaForm.literal}
                  onChange={(e) => {
                    const selected = literalesTransparencia.find(l => l.literal === e.target.value);
                    setTransparenciaForm({
                      ...transparenciaForm, 
                      literal: e.target.value,
                      titulo: selected ? selected.titulo : ''
                    });
                  }}
                >
                  <option value="">Seleccionar literal</option>
                  {literalesTransparencia.map(literal => (
                    <option key={literal.literal} value={literal.literal}>
                      {literal.literal} - {literal.titulo}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
              
              <Form.Group className="mb-3">
                <Form.Label>Título *</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Título del documento"
                  value={transparenciaForm.titulo}
                  onChange={(e) => setTransparenciaForm({...transparenciaForm, titulo: e.target.value})}
                />
              </Form.Group>
              
              <Form.Group className="mb-3">
                <Form.Label>Descripción</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  placeholder="Descripción del documento"
                  value={transparenciaForm.descripcion}
                  onChange={(e) => setTransparenciaForm({...transparenciaForm, descripcion: e.target.value})}
                />
              </Form.Group>
              
              <Form.Group className="mb-3">
                <Form.Label>URL del Archivo PDF *</Form.Label>
                <Form.Control
                  type="url"
                  placeholder="https://ejemplo.com/documento.pdf"
                  value={transparenciaForm.archivo_url}
                  onChange={(e) => setTransparenciaForm({...transparenciaForm, archivo_url: e.target.value})}
                />
                <Form.Text className="text-muted">
                  Ingresa la URL completa del archivo PDF
                </Form.Text>
              </Form.Group>
            </Form>
          )}

          {modalType === 'user' && (
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Usuario *</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Nombre de usuario"
                  value={userForm.username}
                  onChange={(e) => setUserForm({...userForm, username: e.target.value})}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Email *</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="usuario@ejemplo.com"
                  value={userForm.email}
                  onChange={(e) => setUserForm({...userForm, email: e.target.value})}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Contraseña *</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Contraseña"
                  value={userForm.password}
                  onChange={(e) => setUserForm({...userForm, password: e.target.value})}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Rol</Form.Label>
                <Form.Select
                  value={userForm.role}
                  onChange={(e) => setUserForm({...userForm, role: e.target.value})}
                >
                  <option value="user">Usuario</option>
                  <option value="admin">Administrador</option>
                  <option value="tic">TIC</option>
                  <option value="comunicacion">Comunicación</option>
                  <option value="participacion">Participación</option>
                  <option value="transparencia">Transparencia</option>
                </Form.Select>
              </Form.Group>
            </Form>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={
            modalType === 'rendicion' ? handleSaveRendicion :
            modalType === 'transparencia' ? handleSaveTransparencia :
            modalType === 'user' ? handleSaveUser : null
          }>
            Crear
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default AdminDashboard;