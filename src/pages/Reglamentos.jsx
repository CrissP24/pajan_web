import React from "react";

const Reglamentos = () => (
  <div className="container mt-4">
    <h2>Reglamentos Internos y Normativa</h2>
    <hr />
    <div className="row">
      <div className="col-md-6 mb-4">
        <div className="card">
          <div className="card-body">
            <h5 className="card-title">Reglamento Orgánico</h5>
            <p>Reglamento que establece la organización y funcionamiento del GAD Municipal.</p>
            <button className="btn btn-primary">Ver Documento</button>
          </div>
        </div>
      </div>
      <div className="col-md-6 mb-4">
        <div className="card">
          <div className="card-body">
            <h5 className="card-title">Ordenanzas Municipales</h5>
            <p>Ordenanzas vigentes que regulan diferentes aspectos de la vida municipal.</p>
            <button className="btn btn-primary">Ver Documentos</button>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default Reglamentos;
