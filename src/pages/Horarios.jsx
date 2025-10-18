import React from "react";

const Horarios = () => (
  <div className="container mt-4">
    <h2>Horarios de Atención</h2>
    <hr />
    <div className="row">
      <div className="col-md-6 mb-4">
        <div className="card">
          <div className="card-body">
            <h5 className="card-title">Atención al Público</h5>
            <ul>
              <li><strong>Lunes a Viernes:</strong> 8:00 AM - 5:00 PM</li>
              <li><strong>Sábados:</strong> 8:00 AM - 12:00 PM</li>
              <li><strong>Domingos:</strong> Cerrado</li>
            </ul>
          </div>
        </div>
      </div>
      <div className="col-md-6 mb-4">
        <div className="card">
          <div className="card-body">
            <h5 className="card-title">Entrega de Gas</h5>
            <ul>
              <li><strong>Lunes a Viernes:</strong> 8:00 AM - 6:00 PM</li>
              <li><strong>Sábados:</strong> 8:00 AM - 2:00 PM</li>
              <li><strong>Domingos:</strong> No hay servicio</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default Horarios;
