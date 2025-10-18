import React from "react";

const Servicios = () => (
  <div className="container mt-4">
    <h2>Servicios Municipales</h2>
    <hr />
    <div className="row">
      <div className="col-md-6 mb-4">
        <div className="card h-100">
          <div className="card-body">
            <h5 className="card-title">Entrega de Gas a Domicilio</h5>
            <p className="card-text">
              Ofrecemos el servicio de entrega de gas a domicilio para todos los sectores del cantón. 
              Solicita tu cilindro llamando al (04) 2XX-XXXX o a través de nuestra página web.
            </p>
          </div>
        </div>
      </div>
      <div className="col-md-6 mb-4">
        <div className="card h-100">
          <div className="card-body">
            <h5 className="card-title">Trámites en Línea</h5>
            <p className="card-text">
              Realiza tus trámites municipales de manera rápida y segura desde la comodidad de tu hogar. 
              Disponibles: certificados, pagos, solicitudes y más.
            </p>
          </div>
        </div>
      </div>
      <div className="col-md-6 mb-4">
        <div className="card h-100">
          <div className="card-body">
            <h5 className="card-title">Atención Ciudadana</h5>
            <p className="card-text">
              Nuestro equipo está disponible para atender tus consultas, quejas y sugerencias en nuestras oficinas y canales digitales.
            </p>
          </div>
        </div>
      </div>
      <div className="col-md-6 mb-4">
        <div className="card h-100">
          <div className="card-body">
            <h5 className="card-title">Mantenimiento de Infraestructura</h5>
            <p className="card-text">
              Trabajamos constantemente en el mantenimiento y mejora de calles, parques y espacios públicos para el bienestar de todos.
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default Servicios;
