import React from "react";

const RedesSociales = () => (
  <div className="container mt-4">
    <h2>Redes Sociales</h2>
    <hr />
    <div className="row">
      <div className="col-md-4 mb-4">
        <div className="card">
          <div className="card-body">
            <h5 className="card-title">Facebook</h5>
            <p>GAD Municipal de Paján</p>
            <p>Síguenos para estar al día con las noticias y eventos del cantón.</p>
          </div>
        </div>
      </div>
      <div className="col-md-4 mb-4">
        <div className="card">
          <div className="card-body">
            <h5 className="card-title">Twitter</h5>
            <p>@GADPajan</p>
            <p>Información rápida y actualizada sobre servicios municipales.</p>
          </div>
        </div>
      </div>
      <div className="col-md-4 mb-4">
        <div className="card">
          <div className="card-body">
            <h5 className="card-title">Instagram</h5>
            <p>@gadpajan</p>
            <p>Imágenes y videos de las actividades y proyectos del municipio.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default RedesSociales;
