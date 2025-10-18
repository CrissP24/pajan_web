import React from "react";

const Comunicados = () => (
  <div className="container mt-4">
    <h2>Comunicados Oficiales</h2>
    <hr />
    <div className="row">
      <div className="col-md-8">
        <div className="card mb-4">
          <div className="card-body">
            <h5 className="card-title">Comunicado Importante - Suspensión de Servicios</h5>
            <p className="text-muted">Fecha: 15 de Enero, 2024</p>
            <p>
              Se informa a la ciudadanía que debido a trabajos de mantenimiento, 
              el servicio de gas estará suspendido el próximo martes 20 de enero 
              de 8:00 AM a 2:00 PM en el sector centro.
            </p>
          </div>
        </div>
        <div className="card mb-4">
          <div className="card-body">
            <h5 className="card-title">Nuevos Horarios de Atención</h5>
            <p className="text-muted">Fecha: 10 de Enero, 2024</p>
            <p>
              A partir del 15 de enero, nuestras oficinas atenderán al público 
              de lunes a viernes de 8:00 AM a 5:00 PM.
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default Comunicados;
