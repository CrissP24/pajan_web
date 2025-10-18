import React from 'react';
import './Section.css';

const MisionVision = () => {
  return (
    <div className="section-page">
      <div className="container mt-5">
        <div className="row">
          <div className="col-lg-8 mx-auto">
            <h1 className="section-title text-center mb-5">Misión y Visión</h1>
            
            {/* Misión */}
            <div className="content-card mb-5">
              <div className="card-header-custom">
                <h2 className="card-title-custom">
                  <span className="icon">🎯</span>
                  Nuestra Misión
                </h2>
              </div>
              <div className="card-body-custom">
                <p className="lead">
                  El Gobierno Autónomo Descentralizado Municipal de Paján tiene como misión 
                  promover el desarrollo integral y sostenible del cantón, garantizando la 
                  prestación de servicios públicos de calidad, fomentando la participación 
                  ciudadana y el bienestar de todos sus habitantes.
                </p>
                <p>
                  Nos comprometemos a:
                </p>
                <ul className="mission-list">
                  <li>Gestionar eficientemente los recursos municipales</li>
                  <li>Promover el desarrollo económico local</li>
                  <li>Mejorar la infraestructura y servicios básicos</li>
                  <li>Fomentar la participación ciudadana activa</li>
                  <li>Proteger el medio ambiente y los recursos naturales</li>
                  <li>Garantizar la transparencia en la gestión pública</li>
                </ul>
              </div>
            </div>

            {/* Visión */}
            <div className="content-card mb-5">
              <div className="card-header-custom">
                <h2 className="card-title-custom">
                  <span className="icon">🔮</span>
                  Nuestra Visión
                </h2>
              </div>
              <div className="card-body-custom">
                <p className="lead">
                  Ser reconocidos como un cantón modelo en la gestión municipal, 
                  caracterizado por su desarrollo sostenible, innovación en servicios 
                  públicos, participación ciudadana activa y alta calidad de vida 
                  para todos sus habitantes.
                </p>
                <p>
                  Aspiramos a:
                </p>
                <ul className="vision-list">
                  <li>Ser un referente de excelencia en la administración pública</li>
                  <li>Lograr el desarrollo económico sostenible del cantón</li>
                  <li>Mejorar significativamente la calidad de vida de nuestros ciudadanos</li>
                  <li>Fomentar la innovación y el emprendimiento local</li>
                  <li>Consolidar una comunidad participativa y comprometida</li>
                  <li>Ser un cantón ambientalmente responsable y resiliente</li>
                </ul>
              </div>
            </div>

            {/* Valores */}
            <div className="content-card">
              <div className="card-header-custom">
                <h2 className="card-title-custom">
                  <span className="icon">💎</span>
                  Nuestros Valores
                </h2>
              </div>
              <div className="card-body-custom">
                <div className="row">
                  <div className="col-md-6 mb-4">
                    <div className="value-item">
                      <h4>🏛️ Transparencia</h4>
                      <p>Actuamos con honestidad y rendimos cuentas a la ciudadanía en todas nuestras acciones.</p>
                    </div>
                  </div>
                  <div className="col-md-6 mb-4">
                    <div className="value-item">
                      <h4>🤝 Participación</h4>
                      <p>Fomentamos la participación activa de todos los sectores de la comunidad.</p>
                    </div>
                  </div>
                  <div className="col-md-6 mb-4">
                    <div className="value-item">
                      <h4>⚡ Eficiencia</h4>
                      <p>Optimizamos el uso de recursos para brindar servicios de calidad.</p>
                    </div>
                  </div>
                  <div className="col-md-6 mb-4">
                    <div className="value-item">
                      <h4>🌱 Sostenibilidad</h4>
                      <p>Promovemos el desarrollo que respeta y protege el medio ambiente.</p>
                    </div>
                  </div>
                  <div className="col-md-6 mb-4">
                    <div className="value-item">
                      <h4>👥 Inclusión</h4>
                      <p>Garantizamos que todos los ciudadanos tengan acceso a nuestros servicios.</p>
                    </div>
                  </div>
                  <div className="col-md-6 mb-4">
                    <div className="value-item">
                      <h4>🎯 Compromiso</h4>
                      <p>Nos dedicamos completamente al servicio y bienestar de nuestra comunidad.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MisionVision; 