import React from "react";

const PreciosGas = () => (
  <div className="container mt-4">
    <h2>Precios de Gas Actualizados</h2>
    <hr />
    <div className="row">
      <div className="col-md-8">
        <div className="card">
          <div className="card-body">
            <h5 className="card-title">Tarifas Vigentes</h5>
            <table className="table">
              <thead>
                <tr>
                  <th>Tipo de Cilindro</th>
                  <th>Capacidad</th>
                  <th>Precio</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Doméstico</td>
                  <td>15 kg</td>
                  <td>$2.50</td>
                </tr>
                <tr>
                  <td>Industrial</td>
                  <td>45 kg</td>
                  <td>$7.50</td>
                </tr>
                <tr>
                  <td>Pequeño</td>
                  <td>11 kg</td>
                  <td>$1.85</td>
                </tr>
              </tbody>
            </table>
            <p><small>Precios regulados por ARCERNNR - Última actualización: Enero 2024</small></p>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default PreciosGas;
