import React from "react";

const InformesGestion = () => (
  <div className="container mt-4">
    <h2>Informes de Gestión</h2>
    <hr />
    <div className="row">
      <div className="col-md-6 mb-4">
        <div className="card">
          <div className="card-body">
            <h5 className="card-title">Informe Anual 2023</h5>
            <p>Resumen de las actividades y logros del GAD Municipal durante el año 2023.</p>
            <button className="btn btn-primary">Descargar PDF</button>
          </div>
        </div>
      </div>
      <div className="col-md-6 mb-4">
        <div className="card">
          <div className="card-body">
            <h5 className="card-title">Informe Semestral 2024</h5>
            <p>Informe de gestión correspondiente al primer semestre del año 2024.</p>
            <button className="btn btn-primary">Descargar PDF</button>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default InformesGestion;
