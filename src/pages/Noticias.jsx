import React from "react";

const Noticias = () => (
  <div className="container mt-4">
    <h2>Noticias y Comunicados</h2>
    <hr />
    <div className="row">
      <div className="col-md-8">
        <div className="card mb-4">
          <div className="card-body">
            <h5 className="card-title">Nuevo Sistema de Entrega de Gas</h5>
            <p className="text-muted">Fecha: 20 de Enero, 2024</p>
            <p>
              El GAD Municipal de Paján implementa un nuevo sistema de entrega de gas 
              que mejorará la eficiencia y seguridad del servicio.
            </p>
          </div>
        </div>
        <div className="card mb-4">
          <div className="card-body">
            <h5 className="card-title">Inauguración de Nuevas Oficinas</h5>
            <p className="text-muted">Fecha: 18 de Enero, 2024</p>
            <p>
              Se inauguran las nuevas oficinas municipales con mejor infraestructura 
              para atender a la ciudadanía.
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default Noticias;
