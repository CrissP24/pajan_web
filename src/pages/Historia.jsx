import React from 'react';
import './Section.css';

const Historia = () => {
  return (
    <div className="section-page">
      <div className="container mt-5">
        <div className="row">
          <div className="col-lg-10 mx-auto">
            <h1 className="section-title text-center mb-5">Historia del Cantón Paján</h1>
            
            {/* Orígenes */}
            <div className="content-card mb-5">
              <div className="card-header-custom">
                <h2 className="card-title-custom">
                  <span className="icon">🏛️</span>
                  Orígenes y Fundación
                </h2>
              </div>
              <div className="card-body-custom">
                <p className="lead">
                  El cantón Paján, ubicado en la provincia de Manabí, tiene una rica historia 
                  que se remonta a épocas prehispánicas, cuando las culturas indígenas habitaron 
                  estas tierras fértiles y prósperas.
                </p>
                <p>
                  Según los registros históricos, Paján fue fundado oficialmente el 15 de octubre 
                  de 1852, durante el gobierno del Dr. José María Urbina. Su nombre proviene de 
                  la lengua indígena local y significa "tierra fértil" o "lugar de abundancia", 
                  haciendo referencia a la riqueza natural de la región.
                </p>
                <p>
                  Los primeros habitantes de la zona fueron comunidades indígenas que se dedicaban 
                  principalmente a la agricultura, la pesca y el comercio, aprovechando la 
                  estratégica ubicación geográfica y los recursos naturales disponibles.
                </p>
              </div>
            </div>

            {/* Desarrollo Histórico */}
            <div className="content-card mb-5">
              <div className="card-header-custom">
                <h2 className="card-title-custom">
                  <span className="icon">📜</span>
                  Desarrollo Histórico
                </h2>
              </div>
              <div className="card-body-custom">
                <div className="timeline">
                  <div className="timeline-item">
                    <div className="timeline-date">1852</div>
                    <div className="timeline-content">
                      <h4>Fundación Oficial</h4>
                      <p>Paján es fundado oficialmente como parroquia civil, marcando el inicio de su desarrollo institucional.</p>
                    </div>
                  </div>
                  
                  <div className="timeline-item">
                    <div className="timeline-date">1897</div>
                    <div className="timeline-content">
                      <h4>Primera Iglesia</h4>
                      <p>Se construye la primera iglesia católica, consolidando la identidad religiosa de la comunidad.</p>
                    </div>
                  </div>
                  
                  <div className="timeline-item">
                    <div className="timeline-date">1920</div>
                    <div className="timeline-content">
                      <h4>Desarrollo Comercial</h4>
                      <p>Paján se convierte en un importante centro comercial de la región, facilitando el intercambio de productos.</p>
                    </div>
                  </div>
                  
                  <div className="timeline-item">
                    <div className="timeline-date">1945</div>
                    <div className="timeline-content">
                      <h4>Mejoras en Infraestructura</h4>
                      <p>Se construyen las primeras calles pavimentadas y se mejora la infraestructura básica del cantón.</p>
                    </div>
                  </div>
                  
                  <div className="timeline-item">
                    <div className="timeline-date">1960</div>
                    <div className="timeline-content">
                      <h4>Expansión Agrícola</h4>
                      <p>El cantón experimenta un auge en la producción agrícola, especialmente en cultivos de cacao y café.</p>
                    </div>
                  </div>
                  
                  <div className="timeline-item">
                    <div className="timeline-date">1980</div>
                    <div className="timeline-content">
                      <h4>Modernización</h4>
                      <p>Se inicia un proceso de modernización con la llegada de servicios básicos como electricidad y agua potable.</p>
                    </div>
                  </div>
                  
                  <div className="timeline-item">
                    <div className="timeline-date">2000</div>
                    <div className="timeline-content">
                      <h4>Desarrollo Tecnológico</h4>
                      <p>Se implementan las primeras tecnologías de comunicación y se mejora el acceso a la información.</p>
                    </div>
                  </div>
                  
                  <div className="timeline-item">
                    <div className="timeline-date">2020</div>
                    <div className="timeline-content">
                      <h4>Era Digital</h4>
                      <p>Paján entra en la era digital con la implementación de servicios electrónicos y gobierno digital.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Cultura y Tradiciones */}
            <div className="content-card mb-5">
              <div className="card-header-custom">
                <h2 className="card-title-custom">
                  <span className="icon">🎭</span>
                  Cultura y Tradiciones
                </h2>
              </div>
              <div className="card-body-custom">
                <div className="row">
                  <div className="col-md-6 mb-4">
                    <h4>🎪 Fiestas Patronales</h4>
                    <p>
                      Las fiestas en honor a la Virgen del Carmen, patrona del cantón, 
                      se celebran cada año en julio con procesiones, misas y actividades culturales 
                      que reúnen a toda la comunidad.
                    </p>
                  </div>
                  <div className="col-md-6 mb-4">
                    <h4>🍽️ Gastronomía Local</h4>
                    <p>
                      La gastronomía pajaneña se caracteriza por sus platos típicos como 
                      el viche, el ceviche de camarón, el encebollado y los deliciosos 
                      dulces tradicionales elaborados con productos locales.
                    </p>
                  </div>
                  <div className="col-md-6 mb-4">
                    <h4>🎵 Música y Danza</h4>
                    <p>
                      La música tradicional incluye el amorfino, el pasillo y la marimba, 
                      que se interpretan en las celebraciones y eventos culturales del cantón.
                    </p>
                  </div>
                  <div className="col-md-6 mb-4">
                    <h4>🏺 Artesanías</h4>
                    <p>
                      Los artesanos pajaneños elaboran hermosas piezas en madera, 
                      cerámica y tejidos que reflejan la identidad cultural de la región.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Personajes Ilustres */}
            <div className="content-card">
              <div className="card-header-custom">
                <h2 className="card-title-custom">
                  <span className="icon">👑</span>
                  Personajes Ilustres
                </h2>
              </div>
              <div className="card-body-custom">
                <div className="row">
                  <div className="col-md-6 mb-4">
                    <div className="personaje-card">
                      <h4>Dr. José María Urbina</h4>
                      <p className="text-muted">Fundador del Cantón</p>
                      <p>
                        Presidente de la República que firmó el decreto de fundación 
                        de Paján el 15 de octubre de 1852.
                      </p>
                    </div>
                  </div>
                  <div className="col-md-6 mb-4">
                    <div className="personaje-card">
                      <h4>Don Manuel Paján</h4>
                      <p className="text-muted">Primer Alcalde</p>
                      <p>
                        Primer alcalde del cantón, quien lideró los esfuerzos iniciales 
                        para el desarrollo de la comunidad.
                      </p>
                    </div>
                  </div>
                  <div className="col-md-6 mb-4">
                    <div className="personaje-card">
                      <h4>Prof. María González</h4>
                      <p className="text-muted">Educadora Destacada</p>
                      <p>
                        Pionera en la educación del cantón, fundó la primera escuela 
                        pública y dedicó su vida a la enseñanza.
                      </p>
                    </div>
                  </div>
                  <div className="col-md-6 mb-4">
                    <div className="personaje-card">
                      <h4>Don Carlos Mendoza</h4>
                      <p className="text-muted">Comerciante Visionario</p>
                      <p>
                        Impulsor del desarrollo comercial del cantón, estableció 
                        las primeras rutas comerciales con otras regiones.
                      </p>
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

export default Historia; 