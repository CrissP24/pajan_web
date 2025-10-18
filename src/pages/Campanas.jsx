import React from "react";

const Campanas = () => (
  <div className="container mt-4">
    <h2>Campañas Informativas</h2>
    <hr />
    <div className="row">
      <div className="col-md-6 mb-4">
        <div className="card">
          <div className="card-body">
            <h5 className="card-title">Campaña de Seguridad</h5>
            <p><strong>Período:</strong> Enero - Marzo 2024</p>
            <p>Campaña de concientización sobre el uso seguro del gas doméstico y prevención de accidentes.</p>
          </div>
        </div>
      </div>
      <div className="col-md-6 mb-4">
        <div className="card">
          <div className="card-body">
            <h5 className="card-title">Campaña Ambiental</h5>
            <p><strong>Período:</strong> Abril - Junio 2024</p>
            <p>Campaña de reciclaje y cuidado del medio ambiente en el cantón.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default Campanas;
