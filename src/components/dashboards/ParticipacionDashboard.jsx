import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Table, Badge, Modal, Form, Alert, Tabs, Tab } from 'react-bootstrap';
import { 
  FaUsers, 
  FaEdit, 
  FaPlus, 
  FaDownload, 
  FaComments, 
  FaTrash,
  FaSave,
  FaUpload,
  FaCalendarAlt,
  FaChartBar,
  FaHandsHelping,
  FaVoteYea,
  FaClipboardList,
  FaUserCheck,
  FaUserTimes,
  FaBullhorn,
  FaMapMarkerAlt,
  FaClock,
  FaCheckCircle,
  FaExclamationTriangle
} from 'react-icons/fa';

const ParticipacionDashboard = ({ user, handleLogout }) => {
  const [stats, setStats] = useState({
    totalParticipants: 0,
    activeProjects: 0,
    completedProjects: 0,
    totalMeetings: 0,
    citizenProposals: 0,
    satisfactionRate: 0
  });

  const [projects, setProjects] = useState([]);
  const [meetings, setMeetings] = useState([]);
  const [proposals, setProposals] = useState([]);
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [showMeetingModal, setShowMeetingModal] = useState(false);
  const [showProposalModal, setShowProposalModal] = useState(false);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setStats({
        totalParticipants: 1250,
        activeProjects: 8,
        completedProjects: 15,
        totalMeetings: 24,
        citizenProposals: 45,
        satisfactionRate: 87
      });

      setProjects([
        { id: 1, name: 'Mejoramiento de Parques', status: 'active', participants: 45, budget: 50000, startDate: '2024-01-01', progress: 65 },
        { id: 2, name: 'Construcción de Ciclovía', status: 'active', participants: 78, budget: 75000, startDate: '2024-01-15', progress: 30 },
        { id: 3, name: 'Programa de Reciclaje', status: 'completed', participants: 120, budget: 25000, startDate: '2023-10-01', progress: 100 },
        { id: 4, name: 'Centro Comunitario', status: 'planning', participants: 32, budget: 100000, startDate: '2024-02-01', progress: 10 }
      ]);

      setMeetings([
        { id: 1, title: 'Asamblea Ciudadana', date: '2024-01-25', time: '18:00', location: 'Centro Cívico', participants: 85, status: 'scheduled' },
        { id: 2, title: 'Reunión de Vecinos', date: '2024-01-22', time: '19:00', location: 'Barrio Norte', participants: 45, status: 'completed' },
        { id: 3, title: 'Consulta Pública', date: '2024-01-28', time: '17:00', location: 'Plaza Central', participants: 0, status: 'scheduled' }
      ]);

      setProposals([
        { id: 1, title: 'Nuevo Parque Infantil', author: 'María González', votes: 45, status: 'under_review', date: '2024-01-15' },
        { id: 2, title: 'Mejora del Alumbrado Público', author: 'Carlos Ruiz', votes: 78, status: 'approved', date: '2024-01-10' },
        { id: 3, title: 'Construcción de Cancha Deportiva', author: 'Ana López', votes: 32, status: 'rejected', date: '2024-01-08' }
      ]);
    } catch (error) {
      console.error('Error cargando datos del dashboard:', error);
    }
  };

  const generateReport = async (reportType) => {
    try {
      console.log(`Generando reporte de Participación: ${reportType}`);
      
      // Simular datos del reporte de Participación Ciudadana
      const reportData = {
        tipo: reportType,
        fecha: new Date().toISOString(),
        estadisticas: stats,
        proyectos: projects,
        reuniones: meetings,
        propuestas: proposals,
        generado_por: user?.nombre || user?.username
      };
      
      // Crear y descargar archivo JSON
      const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `reporte_participacion_${reportType}_${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      console.log(`Reporte de Participación Ciudadana ${reportType} generado y descargado exitosamente`);
    } catch (error) {
      console.error('Error generando reporte:', error);
      console.error('Error al generar el reporte');
    }
  };

  const handleProjectAction = (action, projectId) => {
    console.log(`Acción ${action} para proyecto ${projectId}`);
    switch(action) {
      case 'edit':
        setShowProjectModal(true);
        break;
      case 'view':
        console.log(`Viendo proyecto ${projectId}`);
        // Aquí se abriría el modal de vista de proyecto
        break;
      case 'delete':
        if (confirm(`¿Está seguro de eliminar el proyecto ${projectId}?`)) {
          console.log(`Proyecto ${projectId} eliminado`);
          // Aquí se eliminaría el proyecto de la base de datos
        }
        break;
      case 'complete':
        console.log(`Completando proyecto ${projectId}`);
        // Aquí se completaría el proyecto
        break;
      default:
        console.log(`Acción ${action} ejecutada para proyecto ${projectId}`);
    }
  };

  const handleMeetingAction = (action, meetingId) => {
    console.log(`Acción ${action} para reunión ${meetingId}`);
    switch(action) {
      case 'edit':
        setShowMeetingModal(true);
        break;
      case 'view':
        console.log(`Viendo reunión ${meetingId}`);
        // Aquí se abriría el modal de vista de reunión
        break;
      case 'delete':
        if (confirm(`¿Está seguro de eliminar la reunión ${meetingId}?`)) {
          console.log(`Reunión ${meetingId} eliminada`);
          // Aquí se eliminaría la reunión de la base de datos
        }
        break;
      case 'complete':
        console.log(`Completando reunión ${meetingId}`);
        // Aquí se completaría la reunión
        break;
      default:
        console.log(`Acción ${action} ejecutada para reunión ${meetingId}`);
    }
  };

  const handleProposalAction = (action, proposalId) => {
    console.log(`Acción ${action} para propuesta ${proposalId}`);
    switch(action) {
      case 'edit':
        setShowProposalModal(true);
        break;
      case 'view':
        console.log(`Viendo propuesta ${proposalId}`);
        // Aquí se abriría el modal de vista de propuesta
        break;
      case 'approve':
        console.log(`Aprobando propuesta ${proposalId}`);
        // Aquí se aprobaría la propuesta
        break;
      case 'reject':
        if (confirm(`¿Está seguro de rechazar la propuesta ${proposalId}?`)) {
          console.log(`Propuesta ${proposalId} rechazada`);
          // Aquí se rechazaría la propuesta
        }
        break;
      default:
        console.log(`Acción ${action} ejecutada para propuesta ${proposalId}`);
    }
  };

  const handleSaveProject = () => {
    console.log('Proyecto guardado exitosamente');
    setShowProjectModal(false);
    // Aquí se guardaría el proyecto en la base de datos
  };

  const handleSaveMeeting = () => {
    console.log('Reunión guardada exitosamente');
    setShowMeetingModal(false);
    // Aquí se guardaría la reunión en la base de datos
  };

  const handleSaveProposal = () => {
    console.log('Propuesta guardada exitosamente');
    setShowProposalModal(false);
    // Aquí se guardaría la propuesta en la base de datos
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
              <h2>Dashboard de Participación Ciudadana</h2>
              <p className="text-muted">Gestión de Proyectos y Participación - {user?.nombre || user?.username}</p>
            </div>
            <div>
              <Button variant="outline-primary" className="me-2" onClick={() => setShowProjectModal(true)}>
                <FaPlus className="me-2" />
                Nuevo Proyecto
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
            title="Participantes"
            value={stats.totalParticipants}
            icon={FaUsers}
            color="primary"
            subtitle="Ciudadanos activos"
            trend={12}
          />
        </Col>
        <Col md={3}>
          <StatCard
            title="Proyectos Activos"
            value={stats.activeProjects}
            icon={FaHandsHelping}
            color="success"
            subtitle={`${stats.completedProjects} completados`}
            trend={8}
          />
        </Col>
        <Col md={3}>
          <StatCard
            title="Propuestas"
            value={stats.citizenProposals}
            icon={FaVoteYea}
            color="info"
            subtitle="De ciudadanos"
            trend={15}
          />
        </Col>
        <Col md={3}>
          <StatCard
            title="Satisfacción"
            value={`${stats.satisfactionRate}%`}
            icon={FaCheckCircle}
            color="warning"
            subtitle="Ciudadanos satisfechos"
            trend={5}
          />
        </Col>
      </Row>

      {/* Contenido principal con tabs */}
      <Row>
        <Col>
          <Card>
            <Card.Header>
              <Tabs defaultActiveKey="projects" className="mb-0">
                <Tab eventKey="projects" title="Proyectos Ciudadanos">
                  <div className="mt-3">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <h6 className="mb-0">Proyectos de Participación Ciudadana</h6>
                      <div>
                        <Button variant="success" size="sm" className="me-2" onClick={() => setShowProjectModal(true)}>
                          <FaPlus className="me-2" />
                          Nuevo Proyecto
                        </Button>
                        <Button variant="outline-primary" size="sm" onClick={() => generateReport('projects')}>
                          <FaDownload className="me-2" />
                          Reporte
                        </Button>
                      </div>
                    </div>
                    <Table responsive>
                      <thead>
                        <tr>
                          <th>Proyecto</th>
                          <th>Estado</th>
                          <th>Participantes</th>
                          <th>Presupuesto</th>
                          <th>Progreso</th>
                          <th>Fecha Inicio</th>
                          <th>Acciones</th>
                        </tr>
                      </thead>
                      <tbody>
                        {projects.map(project => (
                          <tr key={project.id}>
                            <td>{project.name}</td>
                            <td>
                              <Badge bg={
                                project.status === 'completed' ? 'success' :
                                project.status === 'active' ? 'primary' : 'warning'
                              }>
                                {project.status === 'completed' ? 'Completado' :
                                 project.status === 'active' ? 'Activo' : 'Planificación'}
                              </Badge>
                            </td>
                            <td>{project.participants}</td>
                            <td>${project.budget.toLocaleString()}</td>
                            <td>
                              <div className="d-flex align-items-center">
                                <div className="progress flex-grow-1 me-2" style={{ height: '8px' }}>
                                  <div 
                                    className="progress-bar" 
                                    style={{ width: `${project.progress}%` }}
                                  ></div>
                                </div>
                                <small>{project.progress}%</small>
                              </div>
                            </td>
                            <td>{project.startDate}</td>
                            <td>
                              <Button variant="outline-primary" size="sm" className="me-1" onClick={() => handleProjectAction('edit', project.id)}>
                                <FaEdit />
                              </Button>
                              <Button variant="outline-info" size="sm" className="me-1" onClick={() => handleProjectAction('view', project.id)}>
                                <FaComments />
                              </Button>
                              <Button variant="outline-success" size="sm" className="me-1" onClick={() => handleProjectAction('complete', project.id)}>
                                <FaChartBar />
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </div>
                </Tab>
                
                <Tab eventKey="meetings" title="Reuniones y Asambleas">
                  <div className="mt-3">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <h6 className="mb-0">Reuniones Ciudadanas</h6>
                      <Button variant="primary" size="sm" onClick={() => setShowMeetingModal(true)}>
                        <FaPlus className="me-2" />
                        Nueva Reunión
                      </Button>
                    </div>
                    <Table responsive>
                      <thead>
                        <tr>
                          <th>Título</th>
                          <th>Fecha</th>
                          <th>Hora</th>
                          <th>Ubicación</th>
                          <th>Participantes</th>
                          <th>Estado</th>
                          <th>Acciones</th>
                        </tr>
                      </thead>
                      <tbody>
                        {meetings.map(meeting => (
                          <tr key={meeting.id}>
                            <td>{meeting.title}</td>
                            <td>{meeting.date}</td>
                            <td>{meeting.time}</td>
                            <td>
                              <FaMapMarkerAlt className="me-1" />
                              {meeting.location}
                            </td>
                            <td>{meeting.participants}</td>
                            <td>
                              <Badge bg={meeting.status === 'completed' ? 'success' : 'warning'}>
                                {meeting.status === 'completed' ? 'Realizada' : 'Programada'}
                              </Badge>
                            </td>
                            <td>
                              <Button variant="outline-primary" size="sm" className="me-1" onClick={() => handleMeetingAction('edit', meeting.id)}>
                                <FaEdit />
                              </Button>
                              <Button variant="outline-info" size="sm" className="me-1" onClick={() => handleMeetingAction('view', meeting.id)}>
                                <FaUsers />
                              </Button>
                              <Button variant="outline-success" size="sm" className="me-1" onClick={() => handleMeetingAction('complete', meeting.id)}>
                                <FaClipboardList />
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </div>
                </Tab>

                <Tab eventKey="proposals" title="Propuestas Ciudadanas">
                  <div className="mt-3">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <h6 className="mb-0">Propuestas de Ciudadanos</h6>
                      <Button variant="info" size="sm" onClick={() => setShowProposalModal(true)}>
                        <FaPlus className="me-2" />
                        Nueva Propuesta
                      </Button>
                    </div>
                    <Table responsive>
                      <thead>
                        <tr>
                          <th>Propuesta</th>
                          <th>Autor</th>
                          <th>Votos</th>
                          <th>Estado</th>
                          <th>Fecha</th>
                          <th>Acciones</th>
                        </tr>
                      </thead>
                      <tbody>
                        {proposals.map(proposal => (
                          <tr key={proposal.id}>
                            <td>{proposal.title}</td>
                            <td>{proposal.author}</td>
                            <td>
                              <FaVoteYea className="me-1" />
                              {proposal.votes}
                            </td>
                            <td>
                              <Badge bg={
                                proposal.status === 'approved' ? 'success' :
                                proposal.status === 'rejected' ? 'danger' : 'warning'
                              }>
                                {proposal.status === 'approved' ? 'Aprobada' :
                                 proposal.status === 'rejected' ? 'Rechazada' : 'En Revisión'}
                              </Badge>
                            </td>
                            <td>{proposal.date}</td>
                            <td>
                              <Button variant="outline-primary" size="sm" className="me-1" onClick={() => handleProposalAction('edit', proposal.id)}>
                                <FaEdit />
                              </Button>
                              <Button variant="outline-info" size="sm" className="me-1" onClick={() => handleProposalAction('view', proposal.id)}>
                                <FaComments />
                              </Button>
                              <Button variant="outline-success" size="sm" className="me-1" onClick={() => handleProposalAction('approve', proposal.id)}>
                                <FaCheckCircle />
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </div>
                </Tab>

                <Tab eventKey="analytics" title="Análisis y Métricas">
                  <div className="mt-3">
                    <Row>
                      <Col md={6}>
                        <Card>
                          <Card.Header>
                            <h6 className="mb-0">Participación por Barrio</h6>
                          </Card.Header>
                          <Card.Body>
                            <div className="mb-3">
                              <div className="d-flex justify-content-between">
                                <span>Barrio Norte</span>
                                <strong>45%</strong>
                              </div>
                              <div className="d-flex justify-content-between">
                                <span>Barrio Sur</span>
                                <strong>32%</strong>
                              </div>
                              <div className="d-flex justify-content-between">
                                <span>Centro</span>
                                <strong>23%</strong>
                              </div>
                            </div>
                          </Card.Body>
                        </Card>
                      </Col>
                      <Col md={6}>
                        <Card>
                          <Card.Header>
                            <h6 className="mb-0">Tipo de Participación</h6>
                          </Card.Header>
                          <Card.Body>
                            <div className="mb-3">
                              <div className="d-flex justify-content-between">
                                <span>Propuestas</span>
                                <strong>45%</strong>
                              </div>
                              <div className="d-flex justify-content-between">
                                <span>Reuniones</span>
                                <strong>35%</strong>
                              </div>
                              <div className="d-flex justify-content-between">
                                <span>Proyectos</span>
                                <strong>20%</strong>
                              </div>
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
                              <Button variant="primary" onClick={() => generateReport('participation')}>
                                <FaDownload className="me-2" />
                                Reporte de Participación
                              </Button>
                              <Button variant="success" onClick={() => generateReport('projects')}>
                                <FaDownload className="me-2" />
                                Reporte de Proyectos
                              </Button>
                              <Button variant="info" onClick={() => generateReport('meetings')}>
                                <FaDownload className="me-2" />
                                Reporte de Reuniones
                              </Button>
                              <Button variant="warning" onClick={() => generateReport('proposals')}>
                                <FaDownload className="me-2" />
                                Reporte de Propuestas
                              </Button>
                            </div>
                          </Card.Body>
                        </Card>
                      </Col>
                      <Col md={6}>
                        <Card>
                          <Card.Header>
                            <h6 className="mb-0">Indicadores de Éxito</h6>
                          </Card.Header>
                          <Card.Body>
                            <div className="mb-3">
                              <div className="d-flex justify-content-between">
                                <span>Participación Promedio</span>
                                <strong>78%</strong>
                              </div>
                              <div className="d-flex justify-content-between">
                                <span>Proyectos Exitosos</span>
                                <strong>85%</strong>
                              </div>
                              <div className="d-flex justify-content-between">
                                <span>Tiempo Promedio de Respuesta</span>
                                <strong>2.5 días</strong>
                              </div>
                              <div className="d-flex justify-content-between">
                                <span>Propuestas Implementadas</span>
                                <strong>67%</strong>
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

      {/* Modal para nuevo proyecto */}
      <Modal show={showProjectModal} onHide={() => setShowProjectModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Nuevo Proyecto Ciudadano</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Nombre del Proyecto</Form.Label>
              <Form.Control type="text" placeholder="Nombre del proyecto" />
            </Form.Group>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Presupuesto</Form.Label>
                  <Form.Control type="number" placeholder="Presupuesto en USD" />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Fecha de Inicio</Form.Label>
                  <Form.Control type="date" />
                </Form.Group>
              </Col>
            </Row>
            <Form.Group className="mb-3">
              <Form.Label>Descripción</Form.Label>
              <Form.Control as="textarea" rows={4} placeholder="Descripción del proyecto" />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Objetivos</Form.Label>
              <Form.Control as="textarea" rows={3} placeholder="Objetivos del proyecto" />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Barrio o Zona</Form.Label>
              <Form.Select>
                <option value="norte">Barrio Norte</option>
                <option value="sur">Barrio Sur</option>
                <option value="centro">Centro</option>
                <option value="este">Barrio Este</option>
                <option value="oeste">Barrio Oeste</option>
              </Form.Select>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowProjectModal(false)}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleSaveProject}>
            <FaSave className="me-2" />
            Crear Proyecto
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal para nueva reunión */}
      <Modal show={showMeetingModal} onHide={() => setShowMeetingModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Nueva Reunión Ciudadana</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Título de la Reunión</Form.Label>
              <Form.Control type="text" placeholder="Título de la reunión" />
            </Form.Group>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Fecha</Form.Label>
                  <Form.Control type="date" />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Hora</Form.Label>
                  <Form.Control type="time" />
                </Form.Group>
              </Col>
            </Row>
            <Form.Group className="mb-3">
              <Form.Label>Ubicación</Form.Label>
              <Form.Control type="text" placeholder="Lugar de la reunión" />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Descripción</Form.Label>
              <Form.Control as="textarea" rows={3} placeholder="Descripción de la reunión" />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Tipo de Reunión</Form.Label>
              <Form.Select>
                <option value="asamblea">Asamblea Ciudadana</option>
                <option value="reunion">Reunión de Vecinos</option>
                <option value="consulta">Consulta Pública</option>
                <option value="taller">Taller Participativo</option>
              </Form.Select>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowMeetingModal(false)}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleSaveMeeting}>
            <FaSave className="me-2" />
            Programar Reunión
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal para nueva propuesta */}
      <Modal show={showProposalModal} onHide={() => setShowProposalModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Nueva Propuesta Ciudadana</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Título de la Propuesta</Form.Label>
              <Form.Control type="text" placeholder="Título de la propuesta" />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Proponente</Form.Label>
              <Form.Control type="text" placeholder="Nombre del proponente" />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Descripción</Form.Label>
              <Form.Control as="textarea" rows={4} placeholder="Descripción detallada de la propuesta" />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Justificación</Form.Label>
              <Form.Control as="textarea" rows={3} placeholder="Justificación de la propuesta" />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Impacto Esperado</Form.Label>
              <Form.Control as="textarea" rows={2} placeholder="Impacto esperado de la propuesta" />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowProposalModal(false)}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleSaveProposal}>
            <FaSave className="me-2" />
            Enviar Propuesta
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default ParticipacionDashboard;
