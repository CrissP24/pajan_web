import React from 'react';
import './Section.css';

const Organigrama = () => {
  return (
    <div className="section-page">
      <div className="container mt-5">
        <div className="row">
          <div className="col-lg-10 mx-auto">
            <h1 className="section-title text-center mb-5">Estructura Organizativa</h1>
            
            {/* Introducción */}
            <div className="content-card mb-5">
              <div className="card-header-custom">
                <h2 className="card-title-custom">
                  <span className="icon">🏛️</span>
                  Estructura del GAD Municipal de Paján
                </h2>
              </div>
              <div className="card-body-custom">
                <p className="lead">
                  El Gobierno Autónomo Descentralizado Municipal de Paján cuenta con una 
                  estructura organizativa moderna y eficiente, diseñada para brindar 
                  servicios de calidad a la ciudadanía y promover el desarrollo integral del cantón.
                </p>
                <p>
                  Nuestra organización está conformada por diferentes direcciones y departamentos 
                  que trabajan de manera coordinada para cumplir con los objetivos institucionales 
                  y las necesidades de la comunidad pajaneña.
                </p>
              </div>
            </div>

            {/* Organigrama Visual */}
            <div className="content-card mb-5">
              <div className="card-header-custom">
                <h2 className="card-title-custom">
                  <span className="icon">📊</span>
                  Organigrama Institucional
                </h2>
              </div>
              <div className="card-body-custom">
                <div className="organigrama-container">
                  {/* Alcalde */}
                  <div className="org-level-1">
                    <div className="org-position alcalde">
                      <h4>🏛️ Alcalde</h4>
                      <p>Dr. Juan Carlos Mendoza</p>
                      <small>Autoridad Ejecutiva</small>
                    </div>
                  </div>

                  {/* Vicealcalde */}
                  <div className="org-level-2">
                    <div className="org-position vicealcalde">
                      <h4>👨‍💼 Vicealcalde</h4>
                      <p>Ing. María Elena González</p>
                      <small>Subrogante Legal</small>
                    </div>
                  </div>

                  {/* Direcciones Principales */}
                  <div className="org-level-3">
                    <div className="org-row">
                      <div className="org-position direccion">
                        <h4>📋 Secretaría General</h4>
                        <p>Abg. Roberto Silva</p>
                        <small>Gestión Administrativa</small>
                      </div>
                      <div className="org-position direccion">
                        <h4>💰 Finanzas</h4>
                        <p>Econ. Patricia López</p>
                        <small>Gestión Financiera</small>
                      </div>
                      <div className="org-position direccion">
                        <h4>🏗️ Obras Públicas</h4>
                        <p>Ing. Carlos Ramírez</p>
                        <small>Infraestructura</small>
                      </div>
                    </div>
                  </div>

                  {/* Subdirecciones */}
                  <div className="org-level-4">
                    <div className="org-row">
                      <div className="org-position subdireccion">
                        <h4>👥 Recursos Humanos</h4>
                        <p>Lic. Ana Martínez</p>
                      </div>
                      <div className="org-position subdireccion">
                        <h4>📊 Planificación</h4>
                        <p>Ing. Luis Torres</p>
                      </div>
                      <div className="org-position subdireccion">
                        <h4>🌱 Gestión Ambiental</h4>
                        <p>Biól. Carmen Ruiz</p>
                      </div>
                      <div className="org-position subdireccion">
                        <h4>🚔 Seguridad Ciudadana</h4>
                        <p>Cmdt. Pedro Vargas</p>
                      </div>
                      <div className="org-position subdireccion">
                        <h4>🏥 Salud</h4>
                        <p>Dr. Elena Morales</p>
                      </div>
                      <div className="org-position subdireccion">
                        <h4>🎓 Educación</h4>
                        <p>Lic. Jorge Herrera</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Funciones por Dirección */}
            <div className="content-card mb-5">
              <div className="card-header-custom">
                <h2 className="card-title-custom">
                  <span className="icon">⚙️</span>
                  Funciones Principales
                </h2>
              </div>
              <div className="card-body-custom">
                <div className="row">
                  <div className="col-md-6 mb-4">
                    <div className="function-card">
                      <h4>📋 Secretaría General</h4>
                      <ul>
                        <li>Gestión administrativa y legal</li>
                        <li>Coordinación interinstitucional</li>
                        <li>Gestión documental</li>
                        <li>Relaciones públicas</li>
                      </ul>
                    </div>
                  </div>
                  <div className="col-md-6 mb-4">
                    <div className="function-card">
                      <h4>💰 Dirección de Finanzas</h4>
                      <ul>
                        <li>Gestión presupuestaria</li>
                        <li>Control de ingresos y gastos</li>
                        <li>Administración tributaria</li>
                        <li>Contabilidad municipal</li>
                      </ul>
                    </div>
                  </div>
                  <div className="col-md-6 mb-4">
                    <div className="function-card">
                      <h4>🏗️ Dirección de Obras Públicas</h4>
                      <ul>
                        <li>Construcción y mantenimiento vial</li>
                        <li>Infraestructura municipal</li>
                        <li>Gestión de proyectos</li>
                        <li>Control de calidad</li>
                      </ul>
                    </div>
                  </div>
                  <div className="col-md-6 mb-4">
                    <div className="function-card">
                      <h4>🌱 Gestión Ambiental</h4>
                      <ul>
                        <li>Protección ambiental</li>
                        <li>Gestión de residuos</li>
                        <li>Educación ambiental</li>
                        <li>Control de contaminación</li>
                      </ul>
                    </div>
                  </div>
                  <div className="col-md-6 mb-4">
                    <div className="function-card">
                      <h4>🚔 Seguridad Ciudadana</h4>
                      <ul>
                        <li>Protección ciudadana</li>
                        <li>Control de tránsito</li>
                        <li>Prevención de delitos</li>
                        <li>Coordinación policial</li>
                      </ul>
                    </div>
                  </div>
                  <div className="col-md-6 mb-4">
                    <div className="function-card">
                      <h4>🏥 Salud Municipal</h4>
                      <ul>
                        <li>Salud pública</li>
                        <li>Control sanitario</li>
                        <li>Prevención de enfermedades</li>
                        <li>Gestión de emergencias</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Información de Contacto */}
            <div className="content-card">
              <div className="card-header-custom">
                <h2 className="card-title-custom">
                  <span className="icon">📞</span>
                  Información de Contacto
                </h2>
              </div>
              <div className="card-body-custom">
                <div className="row">
                  <div className="col-md-6">
                    <h4>📍 Dirección</h4>
                    <p>Av. Principal s/n, Paján - Manabí</p>
                    
                    <h4>📞 Teléfonos</h4>
                    <p>Central: (05) 2-XXX-XXX</p>
                    <p>Alcaldía: (05) 2-XXX-XXX</p>
                    
                    <h4>📧 Correo Electrónico</h4>
                    <p>info@gadpajan.gob.ec</p>
                  </div>
                  <div className="col-md-6">
                    <h4>🕒 Horarios de Atención</h4>
                    <p>Lunes a Viernes: 8:00 AM - 5:00 PM</p>
                    <p>Sábados: 8:00 AM - 12:00 PM</p>
                    
                    <h4>🌐 Redes Sociales</h4>
                    <p>Facebook: GAD Municipal Paján</p>
                    <p>Twitter: @GADPajan</p>
                    <p>Instagram: @gadpajan</p>
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

export default Organigrama; 