import React from "react";
import "../Styles/css.css";

export const CardInfoS = ({ titulo, texto, imagen, derecha = false }) => {
  return (
    <div className="card-infos-container">

      <div
        className={`card-infos-content d-flex align-items-center justify-content-center ${
          derecha ? "flex-row-reverse" : "flex-row"
        }`}
      >

       
        <div className="card-infos-icon">
          <img src={imagen} alt="icono" className="card-infos-img" />
        </div>

        
        <div
          className={`card-infos-text ${
            derecha ? "text-end" : "text-start"
          }`}
        >
          <h3 className="card-infos-title">
            {titulo}
          </h3>

          <p className="card-infos-desc">
            {texto}
          </p>
        </div>

      </div>
    </div>
  );
};

export default CardInfoS;