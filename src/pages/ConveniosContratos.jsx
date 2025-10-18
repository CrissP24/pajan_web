import React from "react";

const ConveniosContratos = () => (
  <div className="container mt-4">
    <h2>Convenios y Contratos Públicos</h2>
    <hr />
    <div className="row">
      <div className="col-md-6 mb-4">
        <div className="card">
          <div className="card-body">
            <h5 className="card-title">Convenios Interinstitucionales</h5>
            <ul>
              <li>Convenio con Ministerio de Salud</li>
              <li>Convenio con Ministerio de Educación</li>
              <li>Convenio con SENAGUA</li>
              <li>Convenio con Ministerio de Transporte</li>
            </ul>
          </div>
        </div>
      </div>
      <div className="col-md-6 mb-4">
        <div className="card">
          <div className="card-body">
            <h5 className="card-title">Contratos Públicos</h5>
            <p>Información sobre contratos públicos vigentes y procesos de contratación.</p>
            <p>Para más información, contacta a la Dirección de Compras Públicas.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default ConveniosContratos;
