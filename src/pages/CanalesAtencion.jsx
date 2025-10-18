import React from "react";

const CanalesAtencion = () => (
  <div className="container mt-4">
    <h2>Canales de Atención</h2>
    <hr />
    <div className="row">
      <div className="col-md-6 mb-4">
        <div className="card">
          <div className="card-body">
            <h5 className="card-title">Atención Presencial</h5>
            <p><strong>Dirección:</strong> Av. Principal, Paján</p>
            <p><strong>Horario:</strong> Lunes a Viernes 8:00 - 17:00</p>
            <p><strong>Teléfono:</strong> (04) 2XX-XXXX</p>
          </div>
        </div>
      </div>
      <div className="col-md-6 mb-4">
        <div className="card">
          <div className="card-body">
            <h5 className="card-title">Atención Digital</h5>
            <p><strong>Email:</strong> info@gadpajan.gob.ec</p>
            <p><strong>WhatsApp:</strong> 09X XXX XXXX</p>
            <p><strong>Redes Sociales:</strong> Facebook, Twitter, Instagram</p>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default CanalesAtencion;
