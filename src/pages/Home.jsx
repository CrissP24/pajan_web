import React, { useState, useEffect } from 'react';
import './Home.css';
import { Link } from 'react-router-dom';
import contentManagementService from '../services/contentManagementService';
import newsManagementService from '../services/newsManagementService';

const Home = () => {
  const [content, setContent] = useState([]);
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingNews, setLoadingNews] = useState(true);

  useEffect(() => {
    loadContent();
    loadNews();
  }, []);

  const loadContent = async () => {
    try {
      const data = await contentManagementService.getContentBySection('inicio');
      // Filtrar solo contenido publicado
      const publishedContent = data.filter(item => item.published);
      setContent(publishedContent);
    } catch (err) {
      console.error('Error cargando contenido:', err);
      setContent([]);
    } finally {
      setLoading(false);
    }
  };

  const loadNews = async () => {
    try {
      const data = await newsManagementService.getPublishedNews();
      // Ordenar por fecha descendente y tomar solo las primeras 6
      const sortedNews = data
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 6);
      setNews(sortedNews);
    } catch (err) {
      console.error('Error cargando noticias:', err);
      setNews([]);
    } finally {
      setLoadingNews(false);
    }
  };

  return (
    <div className="home-page" id="main-content" role="main" tabIndex="-1">
      {/* Hero Section con imagen responsiva */}
      <section className="hero-section">
        <div className="hero-image-container">
          <img 
            src="/imagen/inicio.png" 
            alt="GAD Municipal de Paján" 
            className="hero-image"
          />
        </div>
      </section>

      {/* Sección de contenido dinámico */}
      <section className="content-section">
        <div className="container">
          {loading ? (
            <div className="loading-container">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Cargando...</span>
              </div>
              <p className="mt-3">Cargando contenido...</p>
            </div>
          ) : Array.isArray(content) && content.length > 0 ? (
            <div className="dynamic-content">
              {content.map((item, index) => (
                <div key={item.id || index} className="content-block">
                  {item.title && <h2 className="content-title">{item.title}</h2>}
                  {item.image && (
                    <div className="content-image-container">
                      <img 
                        src={item.image} 
                        alt={item.title || 'Imagen de contenido'} 
                        className="content-image"
                      />
                    </div>
                  )}
                  {item.body && (
                    <div className="content-body" dangerouslySetInnerHTML={{ __html: item.body }} />
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="default-content">
              <h2 className="section-title">Bienvenidos al GAD Municipal de Paján</h2>
              <div className="row">
                <div className="col-lg-8">
                  <p className="lead">
                    El Gobierno Autónomo Descentralizado Municipal de Paján es una institución 
                    comprometida con el desarrollo integral de nuestro cantón, trabajando 
                    incansablemente para mejorar la calidad de vida de todos nuestros ciudadanos.
                  </p>
                  <p>
                    Nuestra misión es promover el desarrollo sostenible, la participación ciudadana 
                    y la prestación de servicios públicos de calidad, siempre con transparencia 
                    y eficiencia en la gestión municipal.
                  </p>
                  <div className="features-grid">
                    <div className="feature-item">
                      <div className="feature-icon">🏛️</div>
                      <h4>Gestión Transparente</h4>
                      <p>Administración pública con total transparencia y rendición de cuentas.</p>
                    </div>
                    <div className="feature-item">
                      <div className="feature-icon">🤝</div>
                      <h4>Participación Ciudadana</h4>
                      <p>Fomentamos la participación activa de la comunidad en las decisiones municipales.</p>
                    </div>
                    <div className="feature-item">
                      <div className="feature-icon">🌱</div>
                      <h4>Desarrollo Sostenible</h4>
                      <p>Promovemos el desarrollo económico, social y ambiental sostenible.</p>
                    </div>
                  </div>
                </div>
                <div className="col-lg-4">
                  <div className="info-card">
                    <h4>Información de Contacto</h4>
                    <div className="contact-info">
                      <p><strong>Dirección:</strong> Av. Principal, Paján</p>
                      <p><strong>Teléfono:</strong> (04) 2XX-XXXX</p>
                      <p><strong>Email:</strong> info@gadpajan.gob.ec</p>
                      <p><strong>Horario:</strong> Lunes a Viernes 8:00 - 17:00</p>
                    </div>
                    <button className="btn btn-primary w-100 mt-3">Contactar</button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Sección de servicios destacados */}
      <section className="services-section">
        <div className="container">
          <h2 className="section-title text-center">Nuestros Servicios</h2>
          <div className="row">
            <div className="col-md-4">
              <div className="service-card">
                <div className="service-icon">🏠</div>
                <h4>Gestión Municipal</h4>
                <p>Servicios administrativos y de gestión municipal para todos los ciudadanos.</p>
                <a href="/seccion/servicios" className="btn btn-outline-primary">Más información</a>
              </div>
            </div>
            <div className="col-md-4">
              <div className="service-card">
                <div className="service-icon">📋</div>
                <h4>Tramites en Línea</h4>
                <p>Realiza tus trámites municipales de forma rápida y segura desde tu hogar.</p>
                <a href="/seccion/tramites" className="btn btn-outline-primary">Acceder</a>
              </div>
            </div>
            <div className="col-md-4">
              <div className="service-card">
                <div className="service-icon">📰</div>
                <h4>Noticias y Comunicados</h4>
                <p>Mantente informado sobre las últimas noticias y comunicados oficiales.</p>
                <a href="/seccion/noticias" className="btn btn-outline-primary">Ver noticias</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sección de Transparencia y Rendición de Cuentas - Acceso Directo */}
      <section className="transparency-section">
        <div className="container">
          <h2 className="section-title text-center">Transparencia y Rendición de Cuentas</h2>
          <p className="text-center mb-4">
            Acceso directo a la información pública y documentos de rendición de cuentas del GAD Municipal de Paján
          </p>
          <div className="row">
            <div className="col-md-6">
              <div className="transparency-card">
                <div className="transparency-icon">📊</div>
                <h4>Rendición de Cuentas</h4>
                <p>
                  Informes anuales de rendición de cuentas organizados por fases: 
                  Planificación, Evaluación, Deliberación Pública y Seguimiento.
                </p>
                <Link to="/seccion/rendicion-cuentas" className="btn btn-primary w-100">
                  Ver Rendición de Cuentas
                </Link>
              </div>
            </div>
            <div className="col-md-6">
              <div className="transparency-card">
                <div className="transparency-icon">🔍</div>
                <h4>Transparencia LOTAIP</h4>
                <p>
                  Información pública obligatoria según la Ley Orgánica de Transparencia y 
                  Acceso a la Información Pública (LOTAIP).
                </p>
                <Link to="/seccion/transparencia" className="btn btn-primary w-100">
                  Ver Transparencia LOTAIP
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sección de Noticias */}
      <section className="news-section">
        <div className="container">
          <h2 className="section-title text-center">Noticias y Comunicados</h2>
          {loadingNews ? (
            <div className="loading-container">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Cargando...</span>
              </div>
              <p className="mt-3">Cargando noticias...</p>
            </div>
          ) : Array.isArray(news) && news.length > 0 ? (
            <div className="row">
              {news.map((item, index) => (
                <div key={item.id || index} className="col-md-6 col-lg-4 mb-4">
                  <div className="card h-100 shadow-sm">
                    {item.image && (
                      <img 
                        src={item.image} 
                        alt={item.title} 
                        className="card-img-top"
                        style={{height: '200px', objectFit: 'cover'}}
                      />
                    )}
                    <div className="card-body d-flex flex-column">
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <span className="badge bg-primary">{item.category || 'General'}</span>
                        {item.featured && <span className="badge bg-danger">Destacada</span>}
                      </div>
                      <h5 className="card-title">{item.title}</h5>
                      <p className="card-text text-muted flex-grow-1">{item.excerpt}</p>
                      <div className="mt-auto">
                        <small className="text-muted">
                          {new Date(item.date).toLocaleDateString('es-ES', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </small>
                        <div className="mt-2">
                          <a href="#" className="btn btn-outline-primary btn-sm">Leer más</a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-news">
              <p className="text-center text-muted">No hay noticias disponibles en este momento.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home; 