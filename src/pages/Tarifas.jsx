import React from "react";

const Tarifas = () => (
  <div className="container mt-4">
    <h2>Tarifas y Precios Vigentes</h2>
    <hr />
    <div className="row">
      <div className="col-md-6 mb-4">
        <div className="card">
          <div className="card-body">
            <h5 className="card-title">Precios de Gas Actualizados</h5>
            <ul>
              <li>Cilindro de gas doméstico (15kg): <strong>$2.50</strong></li>
              <li>Cilindro industrial (45kg): <strong>$7.50</strong></li>
            </ul>
            <p className="card-text">
              Los precios están regulados por la Agencia de Regulación y Control de Energía y Recursos Naturales No Renovables.
            </p>
          </div>
        </div>
      </div>
      <div className="col-md-6 mb-4">
        <div className="card">
          <div className="card-body">
            <h5 className="card-title">Promociones y Subsidios</h5>
            <p className="card-text">
              Actualmente contamos con subsidios para familias de bajos recursos y promociones especiales en fechas festivas.
              Consulta los requisitos en nuestras oficinas o en la web.
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default Tarifas;
