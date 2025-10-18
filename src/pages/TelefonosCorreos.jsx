import React from "react";

const TelefonosCorreos = () => (
  <div className="container mt-4">
    <h2>Teléfonos y Correos</h2>
    <hr />
    <div className="row">
      <div className="col-md-6 mb-4">
        <div className="card">
          <div className="card-body">
            <h5 className="card-title">Información General</h5>
            <p><strong>Teléfono:</strong> (04) 2XX-XXXX</p>
            <p><strong>Email:</strong> info@gadpajan.gob.ec</p>
            <p><strong>WhatsApp:</strong> 09X XXX XXXX</p>
          </div>
        </div>
      </div>
      <div className="col-md-6 mb-4">
        <div className="card">
          <div className="card-body">
            <h5 className="card-title">Servicio de Gas</h5>
            <p><strong>Teléfono:</strong> (04) 2XX-XXXX</p>
            <p><strong>Email:</strong> gas@gadpajan.gob.ec</p>
            <p><strong>Emergencias:</strong> (04) 2XX-XXXX</p>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default TelefonosCorreos;
