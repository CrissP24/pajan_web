import React from 'react';
import './Section.css';

const DireccionMapa = () => {
  return (
    <div className="section-page">
      <div className="container mt-5">
        <div className="row">
          <div className="col-lg-10 mx-auto">
            <h1 className="section-title text-center mb-5">Dirección y Mapa</h1>
            
            {/* Información de Ubicación */}
            <div className="content-card mb-5">
              <div className="card-header-custom">
                <h2 className="card-title-custom">
                  <span className="icon">📍</span>
                  Ubicación del GAD Municipal
                </h2>
              </div>
              <div className="card-body-custom">
                <div className="row">
                  <div className="col-md-6 mb-4">
                    <div className="location-info">
                      <h4>🏛️ Dirección Principal</h4>
                      <p className="address">
                        <strong>Av. Principal s/n</strong><br />
                        <strong>Paján - Manabí</strong><br />
                        Ecuador
                      </p>
                      
                      <h4>🗺️ Referencias</h4>
                      <ul className="references">
                        <li>Frente al Parque Central</li>
                        <li>Junto a la Iglesia Matriz</li>
                        <li>Cerca del Mercado Municipal</li>
                        <li>A 2 cuadras del Terminal Terrestre</li>
                      </ul>
                    </div>
                  </div>
                  <div className="col-md-6 mb-4">
                    <div className="map-container">
                      <div className="map-placeholder">
                        <div className="map-icon">🗺️</div>
                        <h4>Mapa Interactivo</h4>
                        <p>Aquí se mostrará el mapa de ubicación</p>
                        <button className="btn btn-primary">
                          📍 Ver en Google Maps
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Horarios de Atención */}
            <div className="content-card mb-5">
              <div className="card-header-custom">
                <h2 className="card-title-custom">
                  <span className="icon">🕒</span>
                  Horarios de Atención
                </h2>
              </div>
              <div className="card-body-custom">
                <div className="row">
                  <div className="col-md-6 mb-4">
                    <div className="schedule-card">
                      <h4>📅 Días Hábiles</h4>
                      <div className="schedule-item">
                        <span className="day">Lunes a Viernes:</span>
                        <span className="time">8:00 AM - 5:00 PM</span>
                      </div>
                      <div className="schedule-item">
                        <span className="day">Sábados:</span>
                        <span className="time">8:00 AM - 12:00 PM</span>
                      </div>
                      <div className="schedule-item">
                        <span className="day">Domingos:</span>
                        <span className="time">Cerrado</span>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6 mb-4">
                    <div className="schedule-card">
                      <h4>🍽️ Horario de Almuerzo</h4>
                      <div className="schedule-item">
                        <span className="day">Lunes a Viernes:</span>
                        <span className="time">12:00 PM - 1:00 PM</span>
                      </div>
                      <p className="note">
                        Durante este horario se atienden únicamente casos de emergencia.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Cómo Llegar */}
            <div className="content-card mb-5">
              <div className="card-header-custom">
                <h2 className="card-title-custom">
                  <span className="icon">🚗</span>
                  Cómo Llegar
                </h2>
              </div>
              <div className="card-body-custom">
                <div className="row">
                  <div className="col-md-6 mb-4">
                    <div className="transport-card">
                      <h4>🚌 En Bus</h4>
                      <p>
                        Desde el Terminal Terrestre de Paján, tomar cualquier bus 
                        que pase por el centro de la ciudad. Bajar en el Parque Central 
                        y caminar 2 cuadras hacia el norte.
                      </p>
                      <div className="transport-details">
                        <span><strong>Tiempo estimado:</strong> 5 minutos</span>
                        <span><strong>Costo:</strong> $0.25</span>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6 mb-4">
                    <div className="transport-card">
                      <h4>🚶 A Pie</h4>
                      <p>
                        Desde el centro de Paján, caminar hacia el norte por la 
                        Av. Principal hasta llegar al edificio municipal, ubicado 
                        frente al Parque Central.
                      </p>
                      <div className="transport-details">
                        <span><strong>Tiempo estimado:</strong> 10-15 minutos</span>
                        <span><strong>Distancia:</strong> 1.2 km</span>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6 mb-4">
                    <div className="transport-card">
                      <h4>🚗 En Vehículo</h4>
                      <p>
                        Estacionamiento disponible en el Parque Central y en las 
                        calles aledañas. Se recomienda usar el estacionamiento 
                        municipal ubicado a 1 cuadra del edificio.
                      </p>
                      <div className="transport-details">
                        <span><strong>Estacionamiento:</strong> Gratuito</span>
                        <span><strong>Capacidad:</strong> 50 vehículos</span>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6 mb-4">
                    <div className="transport-card">
                      <h4>🛵 En Moto</h4>
                      <p>
                        Estacionamiento específico para motos disponible en el 
                        costado sur del edificio municipal, con vigilancia 
                        las 24 horas.
                      </p>
                      <div className="transport-details">
                        <span><strong>Estacionamiento:</strong> Gratuito</span>
                        <span><strong>Capacidad:</strong> 30 motos</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Instalaciones */}
            <div className="content-card mb-5">
              <div className="card-header-custom">
                <h2 className="card-title-custom">
                  <span className="icon">🏢</span>
                  Nuestras Instalaciones
                </h2>
              </div>
              <div className="card-body-custom">
                <div className="row">
                  <div className="col-md-4 mb-4">
                    <div className="facility-card">
                      <div className="facility-icon">🏛️</div>
                      <h4>Edificio Principal</h4>
                      <p>
                        Sede administrativa con todas las direcciones municipales, 
                        salón de sesiones y oficina del Alcalde.
                      </p>
                    </div>
                  </div>
                  <div className="col-md-4 mb-4">
                    <div className="facility-card">
                      <div className="facility-icon">🅿️</div>
                      <h4>Estacionamiento</h4>
                      <p>
                        Área de estacionamiento gratuito para visitantes, 
                        con espacios para vehículos y motos.
                      </p>
                    </div>
                  </div>
                  <div className="col-md-4 mb-4">
                    <div className="facility-card">
                      <div className="facility-icon">♿</div>
                      <h4>Accesibilidad</h4>
                      <p>
                        Instalaciones completamente accesibles con rampas, 
                        elevadores y baños adaptados.
                      </p>
                    </div>
                  </div>
                  <div className="col-md-4 mb-4">
                    <div className="facility-card">
                      <div className="facility-icon">🌿</div>
                      <h4>Áreas Verdes</h4>
                      <p>
                        Jardines y áreas de descanso para visitantes, 
                        con bancas y sombra natural.
                      </p>
                    </div>
                  </div>
                  <div className="col-md-4 mb-4">
                    <div className="facility-card">
                      <div className="facility-icon">📞</div>
                      <h4>Centro de Atención</h4>
                      <p>
                        Punto de información y orientación para trámites 
                        y servicios municipales.
                      </p>
                    </div>
                  </div>
                  <div className="col-md-4 mb-4">
                    <div className="facility-card">
                      <div className="facility-icon">🚻</div>
                      <h4>Servicios Higiénicos</h4>
                      <p>
                        Baños públicos limpios y mantenidos, 
                        disponibles para todos los visitantes.
                      </p>
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
                  <div className="col-md-6 mb-4">
                    <div className="contact-info">
                      <h4>📞 Teléfonos</h4>
                      <div className="contact-item">
                        <span className="contact-label">Central:</span>
                        <span className="contact-value">(05) 2-XXX-XXX</span>
                      </div>
                      <div className="contact-item">
                        <span className="contact-label">Alcaldía:</span>
                        <span className="contact-value">(05) 2-XXX-XXX</span>
                      </div>
                      <div className="contact-item">
                        <span className="contact-label">Emergencias:</span>
                        <span className="contact-value">(05) 2-XXX-XXX</span>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6 mb-4">
                    <div className="contact-info">
                      <h4>📧 Correo Electrónico</h4>
                      <div className="contact-item">
                        <span className="contact-label">General:</span>
                        <span className="contact-value">info@gadpajan.gob.ec</span>
                      </div>
                      <div className="contact-item">
                        <span className="contact-label">Alcaldía:</span>
                        <span className="contact-value">alcalde@gadpajan.gob.ec</span>
                      </div>
                      <div className="contact-item">
                        <span className="contact-label">Atención:</span>
                        <span className="contact-value">atencion@gadpajan.gob.ec</span>
                      </div>
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

export default DireccionMapa; 