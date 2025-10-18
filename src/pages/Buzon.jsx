import React, { useState } from 'react';
import './Section.css';

const Buzon = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    tipo: 'sugerencia',
    asunto: '',
    mensaje: '',
    anonimo: false
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aquí se enviaría la información al backend
    console.log('Datos del formulario:', formData);
    setSubmitted(true);
    setFormData({
      nombre: '',
      email: '',
      telefono: '',
      tipo: 'sugerencia',
      asunto: '',
      mensaje: '',
      anonimo: false
    });
  };

  return (
    <div className="section-page">
      <div className="container mt-5">
        <div className="row">
          <div className="col-lg-8 mx-auto">
            <h1 className="section-title text-center mb-5">Buzón de Quejas y Sugerencias</h1>
            
            {/* Introducción */}
            <div className="content-card mb-5">
              <div className="card-header-custom">
                <h2 className="card-title-custom">
                  <span className="icon">📮</span>
                  Tu Voz es Importante
                </h2>
              </div>
              <div className="card-body-custom">
                <p className="lead">
                  En el GAD Municipal de Paján valoramos tu opinión y nos comprometemos 
                  a escuchar las necesidades de nuestra comunidad. Este buzón es un 
                  espacio para que puedas expresar tus quejas, sugerencias, denuncias 
                  o felicitaciones.
                </p>
                <p>
                  Cada mensaje será revisado y atendido por nuestro equipo, y nos 
                  comprometemos a responder en un plazo máximo de 5 días hábiles.
                </p>
              </div>
            </div>

            {/* Formulario */}
            <div className="content-card mb-5">
              <div className="card-header-custom">
                <h2 className="card-title-custom">
                  <span className="icon">✍️</span>
                  Envía tu Mensaje
                </h2>
              </div>
              <div className="card-body-custom">
                {submitted ? (
                  <div className="success-message">
                    <div className="success-icon">✅</div>
                    <h3>¡Mensaje Enviado Exitosamente!</h3>
                    <p>
                      Gracias por tu participación. Hemos recibido tu mensaje y nos 
                      pondremos en contacto contigo pronto. Tu opinión es valiosa 
                      para mejorar nuestros servicios.
                    </p>
                    <button 
                      className="btn btn-primary"
                      onClick={() => setSubmitted(false)}
                    >
                      Enviar Otro Mensaje
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="contact-form">
                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <label className="form-label">Nombre Completo *</label>
                        <input
                          type="text"
                          className="form-control"
                          name="nombre"
                          value={formData.nombre}
                          onChange={handleChange}
                          required
                          disabled={formData.anonimo}
                        />
                      </div>
                      <div className="col-md-6 mb-3">
                        <label className="form-label">Correo Electrónico *</label>
                        <input
                          type="email"
                          className="form-control"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          disabled={formData.anonimo}
                        />
                      </div>
                    </div>

                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <label className="form-label">Teléfono</label>
                        <input
                          type="tel"
                          className="form-control"
                          name="telefono"
                          value={formData.telefono}
                          onChange={handleChange}
                          disabled={formData.anonimo}
                        />
                      </div>
                      <div className="col-md-6 mb-3">
                        <label className="form-label">Tipo de Mensaje *</label>
                        <select
                          className="form-select"
                          name="tipo"
                          value={formData.tipo}
                          onChange={handleChange}
                          required
                        >
                          <option value="sugerencia">Sugerencia</option>
                          <option value="queja">Queja</option>
                          <option value="denuncia">Denuncia</option>
                          <option value="felicitacion">Felicitación</option>
                          <option value="consulta">Consulta</option>
                        </select>
                      </div>
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Asunto *</label>
                      <input
                        type="text"
                        className="form-control"
                        name="asunto"
                        value={formData.asunto}
                        onChange={handleChange}
                        required
                        placeholder="Resumen breve de tu mensaje"
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Mensaje *</label>
                      <textarea
                        className="form-control"
                        name="mensaje"
                        value={formData.mensaje}
                        onChange={handleChange}
                        rows="6"
                        required
                        placeholder="Describe detalladamente tu queja, sugerencia o consulta..."
                      ></textarea>
                    </div>

                    <div className="mb-4">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          name="anonimo"
                          id="anonimo"
                          checked={formData.anonimo}
                          onChange={handleChange}
                        />
                        <label className="form-check-label" htmlFor="anonimo">
                          Enviar de forma anónima
                        </label>
                      </div>
                      <small className="text-muted">
                        Si marcas esta opción, no necesitas llenar los campos de identificación personal.
                      </small>
                    </div>

                    <div className="text-center">
                      <button type="submit" className="btn btn-primary btn-lg">
                        📤 Enviar Mensaje
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>

            {/* Información Adicional */}
            <div className="content-card mb-5">
              <div className="card-header-custom">
                <h2 className="card-title-custom">
                  <span className="icon">ℹ️</span>
                  Información Importante
                </h2>
              </div>
              <div className="card-body-custom">
                <div className="row">
                  <div className="col-md-6 mb-4">
                    <div className="info-card">
                      <h4>⏰ Tiempo de Respuesta</h4>
                      <p>
                        Nos comprometemos a responder todos los mensajes en un plazo 
                        máximo de 5 días hábiles.
                      </p>
                    </div>
                  </div>
                  <div className="col-md-6 mb-4">
                    <div className="info-card">
                      <h4>🔒 Confidencialidad</h4>
                      <p>
                        Todos los mensajes son tratados con absoluta confidencialidad 
                        y respeto a la privacidad.
                      </p>
                    </div>
                  </div>
                  <div className="col-md-6 mb-4">
                    <div className="info-card">
                      <h4>📞 Contacto Directo</h4>
                      <p>
                        Para casos urgentes, puedes contactarnos directamente al 
                        teléfono: (05) 2-XXX-XXX
                      </p>
                    </div>
                  </div>
                  <div className="col-md-6 mb-4">
                    <div className="info-card">
                      <h4>📧 Seguimiento</h4>
                      <p>
                        Recibirás un número de seguimiento para consultar el estado 
                        de tu solicitud.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Tipos de Mensajes */}
            <div className="content-card">
              <div className="card-header-custom">
                <h2 className="card-title-custom">
                  <span className="icon">📋</span>
                  Tipos de Mensajes que Atendemos
                </h2>
              </div>
              <div className="card-body-custom">
                <div className="row">
                  <div className="col-md-6 mb-4">
                    <div className="message-type-card">
                      <h4>💡 Sugerencias</h4>
                      <p>
                        Ideas y propuestas para mejorar nuestros servicios, 
                        infraestructura o gestión municipal.
                      </p>
                    </div>
                  </div>
                  <div className="col-md-6 mb-4">
                    <div className="message-type-card">
                      <h4>⚠️ Quejas</h4>
                      <p>
                        Manifestaciones de inconformidad sobre la calidad de 
                        servicios o atención recibida.
                      </p>
                    </div>
                  </div>
                  <div className="col-md-6 mb-4">
                    <div className="message-type-card">
                      <h4>🚨 Denuncias</h4>
                      <p>
                        Reportes sobre irregularidades, corrupción o malas 
                        prácticas en la gestión municipal.
                      </p>
                    </div>
                  </div>
                  <div className="col-md-6 mb-4">
                    <div className="message-type-card">
                      <h4>👏 Felicitaciones</h4>
                      <p>
                        Reconocimientos por el buen trabajo realizado por 
                        funcionarios o áreas municipales.
                      </p>
                    </div>
                  </div>
                  <div className="col-md-6 mb-4">
                    <div className="message-type-card">
                      <h4>❓ Consultas</h4>
                      <p>
                        Preguntas sobre trámites, servicios o información 
                        general del municipio.
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

export default Buzon; 