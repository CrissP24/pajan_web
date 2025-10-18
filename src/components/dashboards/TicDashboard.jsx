import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Table, Badge, Modal, Form, Alert, Tabs, Tab } from 'react-bootstrap';
import { 
  FaCode, 
  FaFileAlt, 
  FaEdit, 
  FaPlus, 
  FaDownload, 
  FaCog, 
  FaEye, 
  FaTrash,
  FaSave,
  FaUpload,
  FaFileCode,
  FaGlobe,
  FaMobile,
  FaDesktop,
  FaChartBar,
  FaWrench,
  FaUsers
} from 'react-icons/fa';

const TicDashboard = ({ user, handleLogout }) => {
  const [stats, setStats] = useState({
    totalTemplates: 0,
    activeWebContent: 0,
    systemHealth: 100,
    pendingUpdates: 0,
    mobileUsers: 0,
    webUsers: 0
  });

  const [templates, setTemplates] = useState([]);
  const [webContent, setWebContent] = useState([]);
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [showContentModal, setShowContentModal] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [selectedContent, setSelectedContent] = useState(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setStats({
        totalTemplates: 12,
        activeWebContent: 45,
        systemHealth: 98,
        pendingUpdates: 2,
        mobileUsers: 156,
        webUsers: 234
      });

      setTemplates([
        { id: 1, name: 'Plantilla Rendición de Cuentas', type: 'document', status: 'active', lastModified: '2024-01-15' },
        { id: 2, name: 'Plantilla Transparencia', type: 'document', status: 'active', lastModified: '2024-01-10' },
        { id: 3, name: 'Plantilla Noticias', type: 'news', status: 'draft', lastModified: '2024-01-12' },
        { id: 4, name: 'Plantilla Participación', type: 'participation', status: 'active', lastModified: '2024-01-08' }
      ]);

      setWebContent([
        { id: 1, section: 'Inicio', title: 'Página Principal', status: 'published', lastModified: '2024-01-15' },
        { id: 2, section: 'Noticias', title: 'Últimas Noticias', status: 'published', lastModified: '2024-01-14' },
        { id: 3, section: 'Transparencia', title: 'Información Pública', status: 'draft', lastModified: '2024-01-13' },
        { id: 4, section: 'Participación', title: 'Participación Ciudadana', status: 'published', lastModified: '2024-01-12' }
      ]);
    } catch (error) {
      console.error('Error cargando datos del dashboard:', error);
    }
  };

  const generateReport = async (reportType) => {
    try {
      console.log(`Generando reporte TIC: ${reportType}`);
      
      // Simular datos del reporte TIC
      const reportData = {
        tipo: reportType,
        fecha: new Date().toISOString(),
        estadisticas: stats,
        plantillas: templates,
        contenido_web: webContent,
        generado_por: user?.nombre || user?.username
      };
      
      // Crear y descargar archivo JSON
      const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `reporte_tic_${reportType}_${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      console.log(`Reporte TIC ${reportType} generado y descargado exitosamente`);
    } catch (error) {
      console.error('Error generando reporte:', error);
      console.error('Error al generar el reporte');
    }
  };

  const handleTemplateAction = (action, templateId) => {
    console.log(`Acción ${action} para plantilla ${templateId}`);
    switch(action) {
      case 'edit':
        setSelectedTemplate(templateId);
        setShowTemplateModal(true);
        break;
      case 'view':
        console.log(`Viendo plantilla ${templateId}`);
        // Aquí se abriría el modal de vista de plantilla
        break;
      case 'delete':
        if (confirm(`¿Está seguro de eliminar la plantilla ${templateId}?`)) {
          console.log(`Plantilla ${templateId} eliminada`);
          // Aquí se eliminaría la plantilla de la base de datos
        }
        break;
      default:
        console.log(`Acción ${action} ejecutada para plantilla ${templateId}`);
    }
  };

  const handleContentAction = (action, contentId) => {
    console.log(`Acción ${action} para contenido ${contentId}`);
    switch(action) {
      case 'edit':
        setSelectedContent(contentId);
        setShowContentModal(true);
        break;
      case 'view':
        console.log(`Viendo contenido ${contentId}`);
        // Aquí se abriría el modal de vista de contenido
        break;
      case 'upload':
        console.log(`Subiendo contenido ${contentId}`);
        // Aquí se iniciaría el proceso de subida de contenido
        break;
      default:
        console.log(`Acción ${action} ejecutada para contenido ${contentId}`);
    }
  };

  const handleSystemAction = (action) => {
    console.log(`Acción del sistema TIC: ${action}`);
    switch(action) {
      case 'config':
        console.log('Abriendo configuración del sistema TIC');
        // Aquí se abriría el modal de configuración TIC
        break;
      case 'maintenance':
        console.log('Iniciando mantenimiento del sistema');
        // Aquí se iniciaría el proceso de mantenimiento
        break;
      case 'stats':
        console.log('Mostrando estadísticas del sistema');
        // Aquí se mostrarían las estadísticas del sistema
        break;
      default:
        console.log(`Acción del sistema TIC ${action} ejecutada`);
    }
  };

  const handleSaveTemplate = () => {
    console.log('Plantilla guardada exitosamente');
    setShowTemplateModal(false);
    // Aquí se guardaría la plantilla en la base de datos
  };

  const handleSaveContent = () => {
    console.log('Contenido guardado exitosamente');
    setShowContentModal(false);
    // Aquí se guardaría el contenido en la base de datos
  };

  const StatCard = ({ title, value, icon: Icon, color, subtitle, trend }) => (
    <Card className="mb-4">
      <Card.Body>
        <div className="d-flex align-items-center">
          <div className={`p-3 rounded-circle bg-${color} text-white me-3`}>
            <Icon size={24} />
          </div>
          <div>
            <h6 className="mb-0">{title}</h6>
            <h3 className="mb-0">{value}</h3>
            {subtitle && <small className="text-muted">{subtitle}</small>}
            {trend && <small className={`text-${trend > 0 ? 'success' : 'danger'}`}>
              {trend > 0 ? '+' : ''}{trend}%
            </small>}
          </div>
        </div>
      </Card.Body>
    </Card>
  );

  return (
    <Container fluid className="py-4">
      {/* Header */}
      <Row className="mb-4">
        <Col>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h2>Dashboard TIC</h2>
              <p className="text-muted">Gestión de Sistemas y Contenido Web - {user?.nombre || user?.username}</p>
            </div>
            <div>
              <Button variant="outline-primary" className="me-2" onClick={() => setShowTemplateModal(true)}>
                <FaFileCode className="me-2" />
                Nueva Plantilla
              </Button>
              <Button variant="outline-secondary" onClick={handleLogout}>
                Cerrar Sesión
              </Button>
            </div>
          </div>
        </Col>
      </Row>

      {/* Estadísticas principales */}
      <Row>
        <Col md={3}>
          <StatCard
            title="Plantillas"
            value={stats.totalTemplates}
            icon={FaFileCode}
            color="primary"
            subtitle="Activas"
            trend={5}
          />
        </Col>
        <Col md={3}>
          <StatCard
            title="Contenido Web"
            value={stats.activeWebContent}
            icon={FaGlobe}
            color="success"
            subtitle="Secciones"
            trend={12}
          />
        </Col>
        <Col md={3}>
          <StatCard
            title="Salud del Sistema"
            value={`${stats.systemHealth}%`}
            icon={FaWrench}
            color="info"
            subtitle="Estable"
            trend={2}
          />
        </Col>
        <Col md={3}>
          <StatCard
            title="Usuarios Activos"
            value={stats.mobileUsers + stats.webUsers}
            icon={FaUsers}
            color="warning"
            subtitle={`${stats.mobileUsers} móvil, ${stats.webUsers} web`}
            trend={8}
          />
        </Col>
      </Row>

      {/* Contenido principal con tabs */}
      <Row>
        <Col>
          <Card>
            <Card.Header>
              <Tabs defaultActiveKey="templates" className="mb-0">
                <Tab eventKey="templates" title="Plantillas de Documentos">
                  <div className="mt-3">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <h6 className="mb-0">Plantillas del Sistema</h6>
                      <Button variant="primary" size="sm" onClick={() => setShowTemplateModal(true)}>
                        <FaPlus className="me-2" />
                        Nueva Plantilla
                      </Button>
                    </div>
                    <Table responsive>
                      <thead>
                        <tr>
                          <th>Nombre</th>
                          <th>Tipo</th>
                          <th>Estado</th>
                          <th>Última Modificación</th>
                          <th>Acciones</th>
                        </tr>
                      </thead>
                      <tbody>
                        {templates.map(template => (
                          <tr key={template.id}>
                            <td>{template.name}</td>
                            <td>
                              <Badge bg="secondary">{template.type}</Badge>
                            </td>
                            <td>
                              <Badge bg={template.status === 'active' ? 'success' : 'warning'}>
                                {template.status}
                              </Badge>
                            </td>
                            <td>{template.lastModified}</td>
                            <td>
                              <Button variant="outline-primary" size="sm" className="me-1" onClick={() => handleTemplateAction('edit', template.id)}>
                                <FaEdit />
                              </Button>
                              <Button variant="outline-info" size="sm" className="me-1" onClick={() => handleTemplateAction('view', template.id)}>
                                <FaEye />
                              </Button>
                              <Button variant="outline-danger" size="sm" onClick={() => handleTemplateAction('delete', template.id)}>
                                <FaTrash />
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </div>
                </Tab>
                
                <Tab eventKey="content" title="Contenido Web">
                  <div className="mt-3">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <h6 className="mb-0">Gestión de Contenido Web</h6>
                      <Button variant="success" size="sm" onClick={() => setShowContentModal(true)}>
                        <FaPlus className="me-2" />
                        Nuevo Contenido
                      </Button>
                    </div>
                    <Table responsive>
                      <thead>
                        <tr>
                          <th>Sección</th>
                          <th>Título</th>
                          <th>Estado</th>
                          <th>Última Modificación</th>
                          <th>Acciones</th>
                        </tr>
                      </thead>
                      <tbody>
                        {webContent.map(content => (
                          <tr key={content.id}>
                            <td>{content.section}</td>
                            <td>{content.title}</td>
                            <td>
                              <Badge bg={content.status === 'published' ? 'success' : 'warning'}>
                                {content.status}
                              </Badge>
                            </td>
                            <td>{content.lastModified}</td>
                            <td>
                              <Button variant="outline-primary" size="sm" className="me-1" onClick={() => handleContentAction('edit', content.id)}>
                                <FaEdit />
                              </Button>
                              <Button variant="outline-info" size="sm" className="me-1" onClick={() => handleContentAction('view', content.id)}>
                                <FaEye />
                              </Button>
                              <Button variant="outline-success" size="sm" className="me-1" onClick={() => handleContentAction('upload', content.id)}>
                                <FaUpload />
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </div>
                </Tab>

                <Tab eventKey="system" title="Sistema">
                  <div className="mt-3">
                    <Row>
                      <Col md={6}>
                        <Card>
                          <Card.Header>
                            <h6 className="mb-0">Estado del Sistema</h6>
                          </Card.Header>
                          <Card.Body>
                            <div className="mb-3">
                              <div className="d-flex justify-content-between">
                                <span>Servidor Web</span>
                                <Badge bg="success">Activo</Badge>
                              </div>
                              <div className="d-flex justify-content-between">
                                <span>Base de Datos</span>
                                <Badge bg="success">Conectada</Badge>
                              </div>
                              <div className="d-flex justify-content-between">
                                <span>API Backend</span>
                                <Badge bg="success">Funcionando</Badge>
                              </div>
                            </div>
                          </Card.Body>
                        </Card>
                      </Col>
                      <Col md={6}>
                        <Card>
                          <Card.Header>
                            <h6 className="mb-0">Acciones del Sistema</h6>
                          </Card.Header>
                          <Card.Body>
                            <div className="d-grid gap-2">
                              <Button variant="outline-primary" size="sm" onClick={() => handleSystemAction('config')}>
                                <FaCog className="me-2" />
                                Configuración
                              </Button>
                              <Button variant="outline-warning" size="sm" onClick={() => handleSystemAction('maintenance')}>
                                <FaWrench className="me-2" />
                                Mantenimiento
                              </Button>
                              <Button variant="outline-info" size="sm" onClick={() => handleSystemAction('stats')}>
                                <FaChartBar className="me-2" />
                                Estadísticas
                              </Button>
                            </div>
                          </Card.Body>
                        </Card>
                      </Col>
                    </Row>
                  </div>
                </Tab>

                <Tab eventKey="reports" title="Reportes">
                  <div className="mt-3">
                    <Row>
                      <Col md={6}>
                        <Card>
                          <Card.Header>
                            <h6 className="mb-0">Generar Reportes</h6>
                          </Card.Header>
                          <Card.Body>
                            <div className="d-grid gap-2">
                              <Button variant="primary" onClick={() => generateReport('templates')}>
                                <FaDownload className="me-2" />
                                Reporte de Plantillas
                              </Button>
                              <Button variant="success" onClick={() => generateReport('content')}>
                                <FaDownload className="me-2" />
                                Reporte de Contenido
                              </Button>
                              <Button variant="info" onClick={() => generateReport('system')}>
                                <FaDownload className="me-2" />
                                Reporte del Sistema
                              </Button>
                              <Button variant="warning" onClick={() => generateReport('usage')}>
                                <FaDownload className="me-2" />
                                Reporte de Uso
                              </Button>
                            </div>
                          </Card.Body>
                        </Card>
                      </Col>
                      <Col md={6}>
                        <Card>
                          <Card.Header>
                            <h6 className="mb-0">Reportes Recientes</h6>
                          </Card.Header>
                          <Card.Body>
                            <div className="list-group list-group-flush">
                              <div className="list-group-item d-flex justify-content-between align-items-center">
                                <div>
                                  <small className="text-muted">Reporte de Plantillas</small>
                                  <br />
                                  <small>2024-01-15</small>
                                </div>
                                <Button variant="outline-primary" size="sm">
                                  <FaDownload />
                                </Button>
                              </div>
                              <div className="list-group-item d-flex justify-content-between align-items-center">
                                <div>
                                  <small className="text-muted">Reporte de Contenido</small>
                                  <br />
                                  <small>2024-01-14</small>
                                </div>
                                <Button variant="outline-primary" size="sm">
                                  <FaDownload />
                                </Button>
                              </div>
                            </div>
                          </Card.Body>
                        </Card>
                      </Col>
                    </Row>
                  </div>
                </Tab>
              </Tabs>
            </Card.Header>
          </Card>
        </Col>
      </Row>

      {/* Modal para nueva plantilla */}
      <Modal show={showTemplateModal} onHide={() => setShowTemplateModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Nueva Plantilla</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Nombre de la Plantilla</Form.Label>
                  <Form.Control type="text" placeholder="Ingrese el nombre" />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Tipo</Form.Label>
                  <Form.Select>
                    <option value="document">Documento</option>
                    <option value="news">Noticia</option>
                    <option value="participation">Participación</option>
                    <option value="transparency">Transparencia</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
            <Form.Group className="mb-3">
              <Form.Label>Descripción</Form.Label>
              <Form.Control as="textarea" rows={3} placeholder="Descripción de la plantilla" />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Archivo de Plantilla</Form.Label>
              <Form.Control type="file" accept=".docx,.pdf,.html" />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowTemplateModal(false)}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleSaveTemplate}>
            <FaSave className="me-2" />
            Guardar Plantilla
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal para nuevo contenido */}
      <Modal show={showContentModal} onHide={() => setShowContentModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Nuevo Contenido Web</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Sección</Form.Label>
                  <Form.Select>
                    <option value="inicio">Inicio</option>
                    <option value="noticias">Noticias</option>
                    <option value="transparencia">Transparencia</option>
                    <option value="participacion">Participación</option>
                    <option value="contacto">Contacto</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Título</Form.Label>
                  <Form.Control type="text" placeholder="Título del contenido" />
                </Form.Group>
              </Col>
            </Row>
            <Form.Group className="mb-3">
              <Form.Label>Contenido</Form.Label>
              <Form.Control as="textarea" rows={6} placeholder="Contenido HTML o texto" />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Imagen</Form.Label>
              <Form.Control type="file" accept="image/*" />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowContentModal(false)}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleSaveContent}>
            <FaSave className="me-2" />
            Guardar Contenido
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default TicDashboard;
