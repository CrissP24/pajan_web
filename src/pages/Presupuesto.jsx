import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Badge, Alert, Tabs, Tab } from 'react-bootstrap';
import './PublicPages.css';
import { FaChartBar, FaDollarSign, FaDownload, FaEye, FaFileAlt, FaCalculator, FaBalanceScale, FaArrowDown, FaArrowUp } from 'react-icons/fa';

// Alias claros para los íconos de tendencia (compatibles con react-icons/fa)
const FaTrendingDown = FaArrowDown;
const FaTrendingUp = FaArrowUp;
import budgetService from '../services/budgetService';

const Presupuesto = () => {
  const [budgetSections, setBudgetSections] = useState([]);
  const [budgetData, setBudgetData] = useState({});
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    loadBudgetData();
  }, []);

  const loadBudgetData = async () => {
    try {
      const [sectionsData, budgetInfo] = await Promise.all([
        budgetService.getBudgetSections(),
        budgetService.getBudgetData()
      ]);
      
      setBudgetSections(sectionsData.filter(section => section.published));
      setBudgetData(budgetInfo);
    } catch (error) {
      console.error('Error cargando datos del presupuesto:', error);
    } finally {
      setLoading(false);
    }
  };

  const getIconComponent = (iconName) => {
    const icons = {
      dollar: FaDollarSign,
      chart: FaChartBar,
      calculator: FaCalculator,
      trend: FaTrendingUp,
      balance: FaBalanceScale,
      file: FaFileAlt
    };
    return icons[iconName] || FaChartBar;
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-EC', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount);
  };


  if (loading) {
    return (
      <Container className="py-5">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
          <p className="mt-3">Cargando información del presupuesto...</p>
        </div>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      {/* Header */}
      <Row className="mb-5">
        <Col>
          <div className="text-center">
            <h1 className="display-4 fw-bold text-primary mb-3">
              <FaChartBar className="me-3" />
              Presupuesto Municipal
            </h1>
            <p className="lead text-muted">
              Transparencia en la gestión financiera del GAD Municipal de Paján
                </p>
              </div>
        </Col>
      </Row>

      {/* Resumen Ejecutivo */}
      <Row className="mb-5">
        <Col>
          <Card className="border-0 shadow-sm">
            <Card.Header className="bg-primary text-white">
              <h4 className="mb-0">
                <FaBalanceScale className="me-2" />
                Resumen Ejecutivo {budgetData.year || new Date().getFullYear()}
              </h4>
            </Card.Header>
            <Card.Body>
              <Row>
                <Col md={3}>
                  <div className="text-center p-3">
                    <h3 className="text-primary">{formatCurrency(budgetData.totalIncome || 0)}</h3>
                    <p className="text-muted mb-0">Ingresos Totales</p>
                    <small className="text-success">
                      <FaTrendingUp className="me-1" />
                      +5.2% vs año anterior
                    </small>
              </div>
                </Col>
                <Col md={3}>
                  <div className="text-center p-3">
                    <h3 className="text-success">{formatCurrency(budgetData.totalExpenses || 0)}</h3>
                    <p className="text-muted mb-0">Gastos Totales</p>
                    <small className="text-info">
                      <FaTrendingDown className="me-1" />
                      -2.1% vs año anterior
                    </small>
                    </div>
                </Col>
                <Col md={3}>
                  <div className="text-center p-3">
                    <h3 className="text-info">{formatCurrency((budgetData.totalIncome || 0) - (budgetData.totalExpenses || 0))}</h3>
                    <p className="text-muted mb-0">Balance</p>
                    <small className="text-success">
                      <FaTrendingUp className="me-1" />
                      Superávit
                    </small>
                  </div>
                </Col>
                <Col md={3}>
                  <div className="text-center p-3">
                    <h3 className="text-warning">{budgetData.executionRate || 0}%</h3>
                    <p className="text-muted mb-0">Ejecución</p>
                    <small className="text-muted">
                      Al {new Date().toLocaleDateString('es-ES', { month: 'long' })}
                    </small>
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Navegación por pestañas */}
      <Row className="mb-4">
        <Col>
          <Card className="border-0 shadow-sm">
            <Card.Body className="p-0">
              <Tabs 
                activeKey={activeTab} 
                onSelect={(k) => setActiveTab(k)}
                className="border-0"
              >
                <Tab eventKey="overview" title="Resumen General">
                  <div className="p-4">
                    <Row>
                      <Col md={6}>
                        <Card className="border-0 shadow-sm">
                          <Card.Header className="bg-light">
                            <h5 className="mb-0">Distribución de Ingresos</h5>
                          </Card.Header>
                          <Card.Body>
                            <div className="mb-3">
                              <div className="d-flex justify-content-between">
                                <span>Impuestos Municipales</span>
                                <strong>45%</strong>
                              </div>
                              <div className="progress mb-2" style={{ height: '8px' }}>
                                <div className="progress-bar bg-primary" style={{ width: '45%' }}></div>
                </div>
                      </div>
                            <div className="mb-3">
                              <div className="d-flex justify-content-between">
                                <span>Transferencias del Estado</span>
                                <strong>35%</strong>
                      </div>
                              <div className="progress mb-2" style={{ height: '8px' }}>
                                <div className="progress-bar bg-success" style={{ width: '35%' }}></div>
                      </div>
                    </div>
                            <div className="mb-3">
                              <div className="d-flex justify-content-between">
                                <span>Otros Ingresos</span>
                                <strong>20%</strong>
                              </div>
                              <div className="progress mb-2" style={{ height: '8px' }}>
                                <div className="progress-bar bg-info" style={{ width: '20%' }}></div>
                  </div>
                </div>
                          </Card.Body>
                        </Card>
                      </Col>
                      <Col md={6}>
                        <Card className="border-0 shadow-sm">
                          <Card.Header className="bg-light">
                            <h5 className="mb-0">Distribución de Gastos</h5>
                          </Card.Header>
                          <Card.Body>
                            <div className="mb-3">
                              <div className="d-flex justify-content-between">
                                <span>Servicios Públicos</span>
                                <strong>40%</strong>
                              </div>
                              <div className="progress mb-2" style={{ height: '8px' }}>
                                <div className="progress-bar bg-warning" style={{ width: '40%' }}></div>
              </div>
            </div>
                            <div className="mb-3">
                              <div className="d-flex justify-content-between">
                                <span>Infraestructura</span>
                                <strong>30%</strong>
              </div>
                              <div className="progress mb-2" style={{ height: '8px' }}>
                                <div className="progress-bar bg-danger" style={{ width: '30%' }}></div>
                    </div>
                  </div>
                            <div className="mb-3">
                              <div className="d-flex justify-content-between">
                                <span>Administración</span>
                                <strong>20%</strong>
                              </div>
                              <div className="progress mb-2" style={{ height: '8px' }}>
                                <div className="progress-bar bg-secondary" style={{ width: '20%' }}></div>
                    </div>
                  </div>
                            <div className="mb-3">
                              <div className="d-flex justify-content-between">
                                <span>Otros Gastos</span>
                                <strong>10%</strong>
                              </div>
                              <div className="progress mb-2" style={{ height: '8px' }}>
                                <div className="progress-bar bg-dark" style={{ width: '10%' }}></div>
                              </div>
                    </div>
                          </Card.Body>
                        </Card>
                      </Col>
                    </Row>
                  </div>
                </Tab>

                <Tab eventKey="sections" title="Secciones del Presupuesto">
                  <div className="p-4">
                    <Row>
                      {budgetSections.map((section) => {
                        const IconComponent = getIconComponent(section.icon);
                        return (
                          <Col key={section.id} md={6} lg={4} className="mb-4">
                            <Card className="h-100 border-0 shadow-sm budget-section">
                              <Card.Header className="bg-light">
                                <div className="d-flex align-items-center">
                                  <IconComponent className="me-2 text-primary" />
                                  <h6 className="mb-0">{section.title}</h6>
                                </div>
                              </Card.Header>
                              <Card.Body>
                                <p className="text-muted small">
                                  {section.content?.substring(0, 150)}...
                                </p>
                                {section.additionalContent && (
                                  <div className="mt-3">
                                    <h6 className="small text-muted">Información Adicional:</h6>
                                    <p className="small text-muted">
                                      {section.additionalContent.substring(0, 100)}...
                                    </p>
                                  </div>
                                )}
                                <div className="mt-3">
                                  <Badge bg="info" className="me-2">
                                    Orden: {section.order}
                                  </Badge>
                                  <Badge bg="success">
                                    Publicado
                                  </Badge>
                    </div>
                              </Card.Body>
                              <Card.Footer className="bg-light">
                                <Button 
                                  variant="outline-primary" 
                                  size="sm" 
                                  className="w-100"
                                  onClick={() => {
                                    alert(`Ver detalles de: ${section.title}`);
                                  }}
                                >
                                  <FaEye className="me-1" />
                                  Ver Detalles
                                </Button>
                              </Card.Footer>
                            </Card>
                          </Col>
                        );
                      })}
                    </Row>
                  </div>
                </Tab>

                <Tab eventKey="execution" title="Ejecución Presupuestaria">
                  <div className="p-4">
                    <Row>
                      <Col md={6}>
                        <Card className="border-0 shadow-sm">
                          <Card.Header className="bg-light">
                            <h5 className="mb-0">Ejecución por Mes</h5>
                          </Card.Header>
                          <Card.Body>
                            <div className="mb-3">
                              <div className="d-flex justify-content-between">
                                <span>Enero</span>
                                <strong>85%</strong>
                </div>
                              <div className="progress mb-2" style={{ height: '8px' }}>
                                <div className="progress-bar bg-success" style={{ width: '85%' }}></div>
              </div>
            </div>
                            <div className="mb-3">
                              <div className="d-flex justify-content-between">
                                <span>Febrero</span>
                                <strong>92%</strong>
              </div>
                              <div className="progress mb-2" style={{ height: '8px' }}>
                                <div className="progress-bar bg-success" style={{ width: '92%' }}></div>
                      </div>
                    </div>
                            <div className="mb-3">
                              <div className="d-flex justify-content-between">
                                <span>Marzo</span>
                                <strong>78%</strong>
                              </div>
                              <div className="progress mb-2" style={{ height: '8px' }}>
                                <div className="progress-bar bg-warning" style={{ width: '78%' }}></div>
                      </div>
                    </div>
                            <div className="mb-3">
                              <div className="d-flex justify-content-between">
                                <span>Abril</span>
                                <strong>88%</strong>
                              </div>
                              <div className="progress mb-2" style={{ height: '8px' }}>
                                <div className="progress-bar bg-success" style={{ width: '88%' }}></div>
                      </div>
                    </div>
                          </Card.Body>
                        </Card>
                      </Col>
                      <Col md={6}>
                        <Card className="border-0 shadow-sm">
                          <Card.Header className="bg-light">
                            <h5 className="mb-0">Indicadores de Gestión</h5>
                          </Card.Header>
                          <Card.Body>
                            <div className="mb-3">
                              <div className="d-flex justify-content-between align-items-center">
                                <span>Eficiencia Presupuestaria</span>
                                <Badge bg="success">Excelente</Badge>
                  </div>
                </div>
                            <div className="mb-3">
                              <div className="d-flex justify-content-between align-items-center">
                                <span>Cumplimiento de Metas</span>
                                <Badge bg="success">95%</Badge>
                    </div>
                  </div>
                            <div className="mb-3">
                              <div className="d-flex justify-content-between align-items-center">
                                <span>Transparencia</span>
                                <Badge bg="info">100%</Badge>
                    </div>
                  </div>
                            <div className="mb-3">
                              <div className="d-flex justify-content-between align-items-center">
                                <span>Control de Gastos</span>
                                <Badge bg="success">Óptimo</Badge>
                    </div>
                  </div>
                          </Card.Body>
                        </Card>
                      </Col>
                    </Row>
                  </div>
                </Tab>

                <Tab eventKey="documents" title="Documentos">
                  <div className="p-4">
                    <Row>
                      <Col md={6}>
                        <Card className="border-0 shadow-sm">
                          <Card.Header className="bg-light">
                            <h5 className="mb-0">Presupuesto Anual</h5>
                          </Card.Header>
                          <Card.Body>
                            <p className="text-muted">
                              Documento oficial del presupuesto municipal para el año {budgetData.year || new Date().getFullYear()}
                            </p>
                            <Button variant="primary" className="me-2">
                              <FaDownload className="me-1" />
                              Descargar PDF
                            </Button>
                            <Button variant="outline-secondary">
                              <FaEye className="me-1" />
                              Ver Online
                            </Button>
                          </Card.Body>
                        </Card>
                      </Col>
                      <Col md={6}>
                        <Card className="border-0 shadow-sm">
                          <Card.Header className="bg-light">
                            <h5 className="mb-0">Informes de Ejecución</h5>
                          </Card.Header>
                          <Card.Body>
                            <p className="text-muted">
                              Informes trimestrales de ejecución presupuestaria
                            </p>
                            <Button variant="success" className="me-2">
                              <FaDownload className="me-1" />
                              Q1 2024
                            </Button>
                            <Button variant="success" className="me-2">
                              <FaDownload className="me-1" />
                              Q2 2024
                            </Button>
                            <Button variant="outline-success">
                              <FaDownload className="me-1" />
                              Q3 2024
                            </Button>
                          </Card.Body>
                        </Card>
                      </Col>
                    </Row>
                  </div>
                </Tab>
              </Tabs>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Información de Contacto */}
      <Row className="mt-5">
        <Col>
          <Card className="border-0 shadow-sm">
            <Card.Body className="text-center">
              <h4 className="text-primary mb-3">¿Necesitas más información?</h4>
              <p className="text-muted mb-4">
                Para consultas específicas sobre el presupuesto municipal, contacta a nuestro equipo de finanzas.
              </p>
              <div className="row">
                <div className="col-md-4">
                  <div className="p-3">
                    <FaFileAlt className="text-primary mb-2" size={24} />
                    <h6>Documentos Oficiales</h6>
                    <p className="small text-muted mb-0">
                      Presupuesto aprobado<br />
                      Informes de ejecución
                    </p>
                  </div>
                    </div>
                <div className="col-md-4">
                  <div className="p-3">
                    <FaCalculator className="text-success mb-2" size={24} />
                    <h6>Transparencia</h6>
                    <p className="small text-muted mb-0">
                      Datos actualizados<br />
                      Información verificable
                    </p>
                  </div>
                    </div>
                <div className="col-md-4">
                  <div className="p-3">
                    <FaChartBar className="text-info mb-2" size={24} />
                    <h6>Análisis</h6>
                    <p className="small text-muted mb-0">
                      Indicadores de gestión<br />
                      Comparativas anuales
                    </p>
                  </div>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Presupuesto; 