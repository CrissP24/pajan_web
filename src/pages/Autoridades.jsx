import React from "react";

const Autoridades = () => (
    <div className="container mt-4">
        <h2>Autoridades y Responsables</h2>
        <hr />
        <div className="row">
            <div className="col-md-4">
                <div className="card mb-3">
                    <img src="/imagen/logo.png" className="card-img-top" alt="Alcalde" />
                    <div className="card-body">
                        <h5 className="card-title">Ing. Juan Pérez</h5>
                        <p className="card-text">Alcalde de Paján</p>
                    </div>
                </div>
            </div>
            <div className="col-md-4">
                <div className="card mb-3">
                    <img src="/imagen/logo.png" className="card-img-top" alt="Vicealcaldesa" />
                    <div className="card-body">
                        <h5 className="card-title">Dra. María López</h5>
                        <p className="card-text">Vicealcaldesa</p>
                    </div>
                </div>
            </div>
            <div className="col-md-4">
                <div className="card mb-3">
                    <img src="/imagen/logo.png" className="card-img-top" alt="Director Financiero" />
                    <div className="card-body">
                        <h5 className="card-title">Eco. Pedro Sánchez</h5>
                        <p className="card-text">Director Financiero</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
);

export default Autoridades;