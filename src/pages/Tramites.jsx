import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Badge, Button, Form, InputGroup, Alert } from 'react-bootstrap';
import './PublicPages.css';
import { 
  FaSearch, 
  FaFileAlt, 
  FaDollarSign, 
  FaClock, 
  FaCheckCircle,
  FaCertificate,
  FaCreditCard,
  FaFilter,
  FaDownload
} from 'react-icons/fa';
import proceduresService from '../services/proceduresService';

const Tramites = () => {
  const [procedures, setProcedures] = useState([]);
  const [filteredProcedures, setFilteredProcedures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedType, setSelectedType] = useState('all');

  useEffect(() => {
    loadProcedures();
  }, []);

  useEffect(() => {
    filterProcedures();
  }, [procedures, searchTerm, selectedCategory, selectedType]);

  const loadProcedures = async () => {
    try {
      const data = await proceduresService.getProcedures();
      setProcedures(data);
    } catch (error) {
      console.error('Error cargando trámites:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterProcedures = () => {
    let filtered = procedures.filter(procedure => procedure.active);

    if (searchTerm) {
      filtered = filtered.filter(procedure =>
        procedure.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        procedure.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(procedure => procedure.category === selectedCategory);
    }

    if (selectedType !== 'all') {
      filtered = filtered.filter(procedure => procedure.type === selectedType);
    }

    setFilteredProcedures(filtered);
  };

  const getTypeIcon = (type) => {
    return type === 'certificate' ? FaCertificate : FaCreditCard;
  };

  const getTypeColor = (type) => {
    return type === 'certificate' ? 'primary' : 'success';
  };

  const getTypeLabel = (type) => {
    return type === 'certificate' ? 'Certificado' : 'Pago';
  };

  const categories = [...new Set(procedures.map(p => p.category))];
  const types = [...new Set(procedures.map(p => p.type))];

  if (loading) {
    return (
      <Container className="py-5">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
          <p className="mt-3">Cargando trámites disponibles...</p>
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
              <FaFileAlt className="me-3" />
              Trámites en Línea
            </h1>
            <p className="lead text-muted">
              Realiza tus trámites municipales de forma rápida y segura desde la comodidad de tu hogar
            </p>
          </div>
        </Col>
      </Row>

      {/* Filtros */}
      <Row className="mb-4">
        <Col>
          <Card className="border-0 shadow-sm">
            <Card.Body>
              <Row className="g-3">
                <Col md={4}>
                  <InputGroup>
                    <InputGroup.Text>
                      <FaSearch />
                    </InputGroup.Text>
                    <Form.Control
                      type="text"
                      placeholder="Buscar trámite..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </InputGroup>
                </Col>
                <Col md={3}>
                  <Form.Select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                  >
                    <option value="all">Todas las categorías</option>
                    {categories.map(category => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </Form.Select>
                </Col>
                <Col md={3}>
                  <Form.Select
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                  >
                    <option value="all">Todos los tipos</option>
                    {types.map(type => (
                      <option key={type} value={type}>
                        {getTypeLabel(type)}
                      </option>
                    ))}
                  </Form.Select>
                </Col>
                <Col md={2}>
                  <Button 
                    variant="outline-primary" 
                    className="w-100"
                    onClick={() => {
                      setSearchTerm('');
                      setSelectedCategory('all');
                      setSelectedType('all');
                    }}
                  >
                    <FaFilter className="me-1" />
                    Limpiar
                  </Button>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Estadísticas */}
      <Row className="mb-4">
        <Col md={3}>
          <Card className="text-center border-0 shadow-sm">
            <Card.Body>
              <h3 className="text-primary">{filteredProcedures.length}</h3>
              <p className="text-muted mb-0">Trámites Disponibles</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center border-0 shadow-sm">
            <Card.Body>
              <h3 className="text-success">
                {filteredProcedures.filter(p => p.type === 'certificate').length}
              </h3>
              <p className="text-muted mb-0">Certificados</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center border-0 shadow-sm">
            <Card.Body>
              <h3 className="text-info">
                {filteredProcedures.filter(p => p.type === 'payment').length}
              </h3>
              <p className="text-muted mb-0">Pagos</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center border-0 shadow-sm">
            <Card.Body>
              <h3 className="text-warning">
                {categories.length}
              </h3>
              <p className="text-muted mb-0">Categorías</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Lista de Trámites */}
      {filteredProcedures.length === 0 ? (
        <Row>
          <Col>
            <Alert variant="info" className="text-center">
              <FaSearch className="me-2" />
              No se encontraron trámites con los filtros seleccionados.
            </Alert>
          </Col>
        </Row>
      ) : (
        <Row>
          {filteredProcedures.map((procedure) => {
            const TypeIcon = getTypeIcon(procedure.type);
            const typeColor = getTypeColor(procedure.type);
            
            return (
              <Col key={procedure.id} md={6} lg={4} className="mb-4">
                <Card className="h-100 border-0 shadow-sm tramite-card">
                  <Card.Header className={`bg-${typeColor} text-white`}>
                    <div className="d-flex align-items-center">
                      <TypeIcon className="me-2" />
                      <div>
                        <h6 className="mb-0">{getTypeLabel(procedure.type)}</h6>
                        <small>{procedure.category}</small>
                      </div>
                    </div>
                  </Card.Header>
                  <Card.Body className="d-flex flex-column">
                    <h5 className="card-title text-primary">{procedure.title}</h5>
                    <p className="card-text text-muted flex-grow-1">
                      {procedure.description}
                    </p>
                    
                    <div className="mb-3">
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <small className="text-muted">
                          <FaDollarSign className="me-1" />
                          Costo
                        </small>
                        <strong className="text-success">
                          ${procedure.cost.toFixed(2)}
                        </strong>
                      </div>
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <small className="text-muted">
                          <FaClock className="me-1" />
                          Duración
                        </small>
                        <strong>{procedure.duration}</strong>
                      </div>
                    </div>

                    {procedure.requirements && procedure.requirements.length > 0 && (
                      <div className="mb-3">
                        <h6 className="small text-muted mb-2">Requisitos:</h6>
                        <ul className="small mb-0">
                          {procedure.requirements.slice(0, 3).map((req, index) => (
                            <li key={index}>{req}</li>
                          ))}
                          {procedure.requirements.length > 3 && (
                            <li className="text-muted">
                              +{procedure.requirements.length - 3} más...
                            </li>
                          )}
                        </ul>
                      </div>
                    )}

                    <div className="mt-auto">
                      <Button 
                        variant={typeColor} 
                        className="w-100 mb-2"
                        onClick={() => {
                          // Aquí se implementaría la lógica para iniciar el trámite
                          alert(`Iniciando trámite: ${procedure.title}`);
                        }}
                      >
                        <FaCheckCircle className="me-2" />
                        Iniciar Trámite
                      </Button>
                      <Button 
                        variant="outline-secondary" 
                        size="sm" 
                        className="w-100"
                        onClick={() => {
                          // Aquí se implementaría la lógica para ver más detalles
                          alert(`Ver detalles de: ${procedure.title}`);
                        }}
                      >
                        <FaDownload className="me-1" />
                        Ver Detalles
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            );
          })}
        </Row>
      )}

      {/* Información adicional */}
      <Row className="mt-5">
        <Col>
          <Card className="border-0 shadow-sm">
            <Card.Body className="text-center">
              <h4 className="text-primary mb-3">¿Necesitas ayuda?</h4>
              <p className="text-muted mb-4">
                Si tienes dudas sobre algún trámite o necesitas asistencia, no dudes en contactarnos.
              </p>
              <div className="row">
                <div className="col-md-4">
                  <div className="p-3">
                    <FaClock className="text-primary mb-2" size={24} />
                    <h6>Horarios de Atención</h6>
                    <p className="small text-muted mb-0">
                      Lunes a Viernes<br />
                      8:00 AM - 5:00 PM
                    </p>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="p-3">
                    <FaFileAlt className="text-success mb-2" size={24} />
                    <h6>Documentos Requeridos</h6>
                    <p className="small text-muted mb-0">
                      Cédula de identidad<br />
                      Comprobantes necesarios
                    </p>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="p-3">
                    <FaCheckCircle className="text-info mb-2" size={24} />
                    <h6>Proceso Seguro</h6>
                    <p className="small text-muted mb-0">
                      Transacciones seguras<br />
                      Datos protegidos
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

export default Tramites;