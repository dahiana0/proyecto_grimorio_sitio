import React, { useState } from "react";
import "../Styles/css.css";

export const CardEquipoFlip = ({
  nombre,
  rol,
  descripcion,
  imagen,
  iniciales = "SA",
  colorFondo = "#bfa76a",
  colorBorde = "#bfa76a",
  colorIniciales = "#000",
}) => {
  const [flip, setFlip] = useState(false);

  return (
    <div
      className="card-flip-container"
      onClick={() => setFlip(!flip)}
    >
      <div className={`card-flip ${flip ? "flip" : ""}`}>

        <div className="card-flip-front">

          <img src={imagen} alt={nombre} className="card-flip-img" />

          <div className="card-flip-overlay">
            <h3 className="card-flip-title">{nombre}</h3>
            <p className="card-flip-rol">{rol}</p>
          </div>

        </div>

        <div className="card-flip-back text-center">

          <div
            className="card-flip-avatar"
            style={{
              backgroundColor: colorFondo,
              border: `2px solid ${colorBorde}`,
            }}
          >
            <span
              className="card-flip-iniciales"
              style={{ color: colorIniciales }}
            >
              {iniciales}
            </span>
          </div>

          <h3 className="card-flip-title">{nombre}</h3>

          <p className="card-flip-rol mb-2">{rol}</p>

          <p className="card-flip-desc">
            {descripcion}
          </p>

        </div>
      </div>
    </div>
  );
};

export default CardEquipoFlip;