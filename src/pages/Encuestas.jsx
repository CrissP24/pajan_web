import React from "react";

const Encuestas = () => (
  <div className="container mt-4">
    <h2>Encuestas y Opiniones del Usuario</h2>
    <hr />
    <div className="row">
      <div className="col-md-8">
        <h4>Encuesta de Satisfacción</h4>
        <p>Ayúdanos a mejorar nuestros servicios participando en nuestras encuestas.</p>
        <div className="alert alert-info">
          <strong>Encuesta Actual:</strong> Satisfacción con el servicio de gas a domicilio
        </div>
        <button className="btn btn-primary">Participar en la Encuesta</button>
      </div>
      <div className="col-md-4">
        <div className="card">
          <div className="card-body">
            <h5 className="card-title">Resultados Anteriores</h5>
            <p>Consulta los resultados de encuestas anteriores para ver cómo hemos mejorado.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default Encuestas;
