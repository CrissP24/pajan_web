import React from "react";

const PuntosVenta = () => (
  <div className="container mt-4">
    <h2>Puntos de Venta</h2>
    <hr />
    <div className="row">
      <div className="col-md-6 mb-4">
        <div className="card">
          <div className="card-body">
            <h5 className="card-title">Oficina Principal</h5>
            <p><strong>Dirección:</strong> Av. Principal, Paján</p>
            <p><strong>Horario:</strong> Lunes a Viernes 8:00 - 17:00</p>
            <p><strong>Teléfono:</strong> (04) 2XX-XXXX</p>
          </div>
        </div>
      </div>
      <div className="col-md-6 mb-4">
        <div className="card">
          <div className="card-body">
            <h5 className="card-title">Punto de Venta Secundario</h5>
            <p><strong>Dirección:</strong> Centro Comercial Paján</p>
            <p><strong>Horario:</strong> Lunes a Sábado 9:00 - 18:00</p>
            <p><strong>Teléfono:</strong> (04) 2XX-XXXX</p>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default PuntosVenta;
