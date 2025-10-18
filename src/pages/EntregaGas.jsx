import React from "react";

const EntregaGas = () => (
  <div className="container mt-4">
    <h2>Entrega de Gas a Domicilio</h2>
    <hr />
    <div className="row">
      <div className="col-md-8">
        <h4>Servicio de Entrega</h4>
        <p>
          El GAD Municipal de Paján ofrece el servicio de entrega de gas a domicilio para todos los sectores del cantón, 
          garantizando un servicio seguro y confiable para toda la comunidad.
        </p>
        <h5>Horarios de Entrega:</h5>
        <ul>
          <li>Lunes a Viernes: 8:00 AM - 6:00 PM</li>
          <li>Sábados: 8:00 AM - 2:00 PM</li>
          <li>Domingos: No hay servicio</li>
        </ul>
        <h5>Zonas de Cobertura:</h5>
        <p>Todos los sectores del cantón Paján y comunidades aledañas.</p>
      </div>
      <div className="col-md-4">
        <div className="card">
          <div className="card-body">
            <h5 className="card-title">Contacto</h5>
            <p>Teléfono: (04) 2XX-XXXX</p>
            <p>WhatsApp: 09X XXX XXXX</p>
            <p>Email: gas@gadpajan.gob.ec</p>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default EntregaGas;
