import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Badge, Button, Form, InputGroup, Alert, Tabs, Tab } from 'react-bootstrap';
import './PublicPages.css';
import { 
  FaSearch, 
  FaNewspaper, 
  FaCalendarAlt, 
  FaEye,
  FaFilter,
  FaStar,
  FaTag,
  FaDownload,
  FaShare,
  FaChevronRight
} from 'react-icons/fa';
import newsManagementService from '../services/newsManagementService';

const NoticiasComunicados = () => {
  const [news, setNews] = useState([]);
  const [filteredNews, setFilteredNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    loadNews();
  }, []);

  useEffect(() => {
    filterNews();
  }, [news, searchTerm, selectedCategory, selectedType, activeTab]);

  const loadNews = async () => {
    try {
      const data = await newsManagementService.getPublishedNews();
      setNews(data);
    } catch (error) {
      console.error('Error cargando noticias:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterNews = () => {
    let filtered = news.filter(item => item.published);

    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.body.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(item => item.category === selectedCategory);
    }

    if (selectedType !== 'all') {
      if (selectedType === 'featured') {
        filtered = filtered.filter(item => item.featured);
      } else if (selectedType === 'recent') {
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        filtered = filtered.filter(item => new Date(item.date) > oneWeekAgo);
      }
    }

    if (activeTab !== 'all') {
      if (activeTab === 'featured') {
        filtered = filtered.filter(item => item.featured);
      } else if (activeTab === 'recent') {
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        filtered = filtered.filter(item => new Date(item.date) > oneWeekAgo);
      }
    }

    // Ordenar por fecha descendente
    filtered.sort((a, b) => new Date(b.date) - new Date(a.date));

    setFilteredNews(filtered);
  };

  const getCategoryColor = (category) => {
    const colors = {
      'General': 'primary',
      'Eventos': 'success',
      'Servicios': 'info',
      'Transparencia': 'warning',
      'Participación': 'secondary',
      'TIC': 'dark',
      'Comunicación': 'danger'
    };
    return colors[category] || 'primary';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const categories = [...new Set(news.map(item => item.category))];
  const featuredNews = news.filter(item => item.featured && item.published);
  const recentNews = news.filter(item => {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    return new Date(item.date) > oneWeekAgo && item.published;
  });

  if (loading) {
    return (
      <Container className="py-5">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
          <p className="mt-3">Cargando noticias y comunicados...</p>
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
              <FaNewspaper className="me-3" />
              Noticias y Comunicados
            </h1>
            <p className="lead text-muted">
              Mantente informado sobre las últimas noticias y comunicados del GAD Municipal de Paján
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
                      placeholder="Buscar noticias..."
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
                    <option value="featured">Destacadas</option>
                    <option value="recent">Recientes</option>
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
                      setActiveTab('all');
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
              <h3 className="text-primary">{filteredNews.length}</h3>
              <p className="text-muted mb-0">Noticias Encontradas</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center border-0 shadow-sm">
            <Card.Body>
              <h3 className="text-success">{featuredNews.length}</h3>
              <p className="text-muted mb-0">Noticias Destacadas</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center border-0 shadow-sm">
            <Card.Body>
              <h3 className="text-info">{recentNews.length}</h3>
              <p className="text-muted mb-0">Esta Semana</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center border-0 shadow-sm">
            <Card.Body>
              <h3 className="text-warning">{categories.length}</h3>
              <p className="text-muted mb-0">Categorías</p>
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
                <Tab eventKey="all" title="Todas las Noticias">
                  <div className="p-4">
                    {filteredNews.length === 0 ? (
                      <Alert variant="info" className="text-center">
                        <FaSearch className="me-2" />
                        No se encontraron noticias con los filtros seleccionados.
                      </Alert>
                    ) : (
                      <Row>
                        {filteredNews.map((item) => (
                          <Col key={item.id} md={6} lg={4} className="mb-4">
                            <Card className="h-100 border-0 shadow-sm news-card">
                              {item.image && (
                                <div className="position-relative">
                                  <img 
                                    src={item.image} 
                                    alt={item.title}
                                    className="card-img-top"
                                    style={{ height: '200px', objectFit: 'cover' }}
                                  />
                                  {item.featured && (
                                    <Badge 
                                      bg="danger" 
                                      className="position-absolute top-0 start-0 m-2"
                                    >
                                      <FaStar className="me-1" />
                                      Destacada
                                    </Badge>
                                  )}
                                </div>
                              )}
                              <Card.Body className="d-flex flex-column">
                                <div className="mb-2">
                                  <Badge bg={getCategoryColor(item.category)} className="me-2">
                                    <FaTag className="me-1" />
                                    {item.category}
                                  </Badge>
                                  <small className="text-muted">
                                    <FaCalendarAlt className="me-1" />
                                    {formatDate(item.date)}
                                  </small>
                                </div>
                                <h5 className="card-title text-primary">{item.title}</h5>
                                <p className="card-text text-muted flex-grow-1">
                                  {item.excerpt}
                                </p>
                                <div className="mt-auto">
                                  <Button 
                                    variant="outline-primary" 
                                    className="w-100 mb-2"
                                    onClick={() => {
                                      alert(`Ver noticia: ${item.title}`);
                                    }}
                                  >
                                    <FaEye className="me-2" />
                                    Leer Más
                                  </Button>
                                  <div className="d-flex gap-2">
                                    <Button 
                                      variant="outline-secondary" 
                                      size="sm" 
                                      className="flex-grow-1"
                                      onClick={() => {
                                        alert(`Compartir: ${item.title}`);
                                      }}
                                    >
                                      <FaShare className="me-1" />
                                      Compartir
                                    </Button>
                                    <Button 
                                      variant="outline-info" 
                                      size="sm" 
                                      className="flex-grow-1"
                                      onClick={() => {
                                        alert(`Descargar: ${item.title}`);
                                      }}
                                    >
                                      <FaDownload className="me-1" />
                                      PDF
                                    </Button>
                                  </div>
                                </div>
                              </Card.Body>
                            </Card>
                          </Col>
                        ))}
                      </Row>
                    )}
                  </div>
                </Tab>

                <Tab eventKey="featured" title="Destacadas">
                  <div className="p-4">
                    {featuredNews.length === 0 ? (
                      <Alert variant="info" className="text-center">
                        <FaStar className="me-2" />
                        No hay noticias destacadas en este momento.
                      </Alert>
                    ) : (
                      <Row>
                        {featuredNews.map((item) => (
                          <Col key={item.id} md={6} lg={4} className="mb-4">
                            <Card className="h-100 border-0 shadow-sm news-card">
                              {item.image && (
                                <div className="position-relative">
                                  <img 
                                    src={item.image} 
                                    alt={item.title}
                                    className="card-img-top"
                                    style={{ height: '200px', objectFit: 'cover' }}
                                  />
                                  <Badge 
                                    bg="danger" 
                                    className="position-absolute top-0 start-0 m-2"
                                  >
                                    <FaStar className="me-1" />
                                    Destacada
                                  </Badge>
                                </div>
                              )}
                              <Card.Body className="d-flex flex-column">
                                <div className="mb-2">
                                  <Badge bg={getCategoryColor(item.category)} className="me-2">
                                    <FaTag className="me-1" />
                                    {item.category}
                                  </Badge>
                                  <small className="text-muted">
                                    <FaCalendarAlt className="me-1" />
                                    {formatDate(item.date)}
                                  </small>
                                </div>
                                <h5 className="card-title text-primary">{item.title}</h5>
                                <p className="card-text text-muted flex-grow-1">
                                  {item.excerpt}
                                </p>
                                <div className="mt-auto">
                                  <Button 
                                    variant="primary" 
                                    className="w-100 mb-2"
                                    onClick={() => {
                                      alert(`Ver noticia destacada: ${item.title}`);
                                    }}
                                  >
                                    <FaEye className="me-2" />
                                    Leer Más
                                  </Button>
                                </div>
                              </Card.Body>
                            </Card>
                          </Col>
                        ))}
                      </Row>
                    )}
                  </div>
                </Tab>

                <Tab eventKey="recent" title="Recientes">
                  <div className="p-4">
                    {recentNews.length === 0 ? (
                      <Alert variant="info" className="text-center">
                        <FaCalendarAlt className="me-2" />
                        No hay noticias recientes esta semana.
                      </Alert>
                    ) : (
                      <Row>
                        {recentNews.map((item) => (
                          <Col key={item.id} md={6} lg={4} className="mb-4">
                            <Card className="h-100 border-0 shadow-sm news-card">
                              {item.image && (
                                <img 
                                  src={item.image} 
                                  alt={item.title}
                                  className="card-img-top"
                                  style={{ height: '200px', objectFit: 'cover' }}
                                />
                              )}
                              <Card.Body className="d-flex flex-column">
                                <div className="mb-2">
                                  <Badge bg={getCategoryColor(item.category)} className="me-2">
                                    <FaTag className="me-1" />
                                    {item.category}
                                  </Badge>
                                  <small className="text-muted">
                                    <FaCalendarAlt className="me-1" />
                                    {formatDate(item.date)}
                                  </small>
                                </div>
                                <h5 className="card-title text-primary">{item.title}</h5>
                                <p className="card-text text-muted flex-grow-1">
                                  {item.excerpt}
                                </p>
                                <div className="mt-auto">
                                  <Button 
                                    variant="outline-primary" 
                                    className="w-100 mb-2"
                                    onClick={() => {
                                      alert(`Ver noticia reciente: ${item.title}`);
                                    }}
                                  >
                                    <FaEye className="me-2" />
                                    Leer Más
                                  </Button>
                                </div>
                              </Card.Body>
                            </Card>
                          </Col>
                        ))}
                      </Row>
                    )}
                  </div>
                </Tab>
              </Tabs>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Información adicional */}
      <Row className="mt-5">
        <Col>
          <Card className="border-0 shadow-sm">
            <Card.Body className="text-center">
              <h4 className="text-primary mb-3">Mantente Informado</h4>
              <p className="text-muted mb-4">
                Suscríbete a nuestro boletín informativo para recibir las últimas noticias directamente en tu correo.
              </p>
              <div className="row">
                <div className="col-md-4">
                  <div className="p-3">
                    <FaNewspaper className="text-primary mb-2" size={24} />
                    <h6>Noticias Actualizadas</h6>
                    <p className="small text-muted mb-0">
                      Información oficial<br />
                      Actualizada diariamente
                    </p>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="p-3">
                    <FaShare className="text-success mb-2" size={24} />
                    <h6>Comparte con Otros</h6>
                    <p className="small text-muted mb-0">
                      Difunde la información<br />
                      Mantén a otros informados
                    </p>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="p-3">
                    <FaDownload className="text-info mb-2" size={24} />
                    <h6>Descarga Documentos</h6>
                    <p className="small text-muted mb-0">
                      Comunicados oficiales<br />
                      En formato PDF
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

export default NoticiasComunicados;
