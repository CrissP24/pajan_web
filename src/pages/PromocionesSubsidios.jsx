import React from "react";

const PromocionesSubsidios = () => (
  <div className="container mt-4">
    <h2>Promociones y Subsidios</h2>
    <hr />
    <div className="row">
      <div className="col-md-6 mb-4">
        <div className="card">
          <div className="card-body">
            <h5 className="card-title">Subsidio para Familias Vulnerables</h5>
            <p>Programa de apoyo para familias de bajos recursos económicos.</p>
            <h6>Requisitos:</h6>
            <ul>
              <li>Cédula de identidad</li>
              <li>Certificado de pobreza</li>
              <li>Comprobante de domicilio</li>
            </ul>
          </div>
        </div>
      </div>
      <div className="col-md-6 mb-4">
        <div className="card">
          <div className="card-body">
            <h5 className="card-title">Promociones Especiales</h5>
            <p>Descuentos en fechas festivas y eventos especiales del cantón.</p>
            <h6>Próximas promociones:</h6>
            <ul>
              <li>Día de la Madre: 10% descuento</li>
              <li>Fiestas de Paján: 15% descuento</li>
              <li>Navidad: 20% descuento</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default PromocionesSubsidios;
