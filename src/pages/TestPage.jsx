import React from 'react';

const TestPage = () => {
  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col-md-12">
          <div className="card">
            <div className="card-body text-center">
              <h1 className="card-title text-primary">✅ Frontend Funcionando</h1>
              <p className="card-text">
                Si puedes ver esta página, el frontend está funcionando correctamente.
              </p>
              <div className="alert alert-success">
                <strong>Estado:</strong> React está renderizando correctamente
              </div>
              <div className="mt-3">
                <a href="/" className="btn btn-primary me-2">Ir al Inicio</a>
                <a href="/login" className="btn btn-outline-primary">Ir al Login</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestPage;
