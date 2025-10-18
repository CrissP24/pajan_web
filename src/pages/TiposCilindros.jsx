import React from "react";

const TiposCilindros = () => (
  <div className="container mt-4">
    <h2>Tipos de Cilindros y Productos</h2>
    <hr />
    <div className="row">
      <div className="col-md-4 mb-4">
        <div className="card">
          <div className="card-body">
            <h5 className="card-title">Cilindro Doméstico</h5>
            <p><strong>Capacidad:</strong> 15 kg</p>
            <p><strong>Uso:</strong> Hogares</p>
            <p><strong>Precio:</strong> $2.50</p>
            <p>Ideal para cocina y calefacción en hogares.</p>
          </div>
        </div>
      </div>
      <div className="col-md-4 mb-4">
        <div className="card">
          <div className="card-body">
            <h5 className="card-title">Cilindro Industrial</h5>
            <p><strong>Capacidad:</strong> 45 kg</p>
            <p><strong>Uso:</strong> Comercios e industrias</p>
            <p><strong>Precio:</strong> $7.50</p>
            <p>Para uso comercial e industrial.</p>
          </div>
        </div>
      </div>
      <div className="col-md-4 mb-4">
        <div className="card">
          <div className="card-body">
            <h5 className="card-title">Cilindro de 11 kg</h5>
            <p><strong>Capacidad:</strong> 11 kg</p>
            <p><strong>Uso:</strong> Hogares pequeños</p>
            <p><strong>Precio:</strong> $1.85</p>
            <p>Para hogares con bajo consumo.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default TiposCilindros;
