import React from "react";

const Actividades = () => (
  <div className="container mt-4">
    <h2>Actividades en la Comunidad</h2>
    <hr />
    <div className="row">
      <div className="col-md-6 mb-4">
        <div className="card">
          <div className="card-body">
            <h5 className="card-title">Fiestas de Paján 2024</h5>
            <p><strong>Fecha:</strong> 15-20 de Julio</p>
            <p>Celebración de las fiestas patronales con actividades culturales, deportivas y sociales.</p>
          </div>
        </div>
      </div>
      <div className="col-md-6 mb-4">
        <div className="card">
          <div className="card-body">
            <h5 className="card-title">Campaña de Limpieza</h5>
            <p><strong>Fecha:</strong> 5 de Junio</p>
            <p>Campaña de limpieza y concientización ambiental en todo el cantón.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default Actividades;
