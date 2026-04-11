import React from "react";
import "../Styles/css.css";
import { useNavigate } from "react-router-dom";

export const CardGrande = ({
  nombre,
  rol,
  descripcion,
  imagen,
  tipo,
  rasgo,
  ruta,
}) => {
  const navigate = useNavigate();

  return (
    <div className="card-grande">

      <img src={imagen} alt={nombre} className="card-grande-img" />

      <div className="card-grande-overlay">

        <p className="card-grande-rol">
          {rol}
        </p>

        <h2 className="card-grande-nombre">
          {nombre}
        </h2>

        <p className="card-grande-desc">
          {descripcion}
        </p>

        <div className="d-flex gap-2 mb-2">
          <span className="card-grande-tag">{tipo}</span>
          <span className="card-grande-tag">{rasgo}</span>
        </div>

        <button
          onClick={() => navigate(ruta)}
          className="card-grande-btn"
        >
          VER MÁS
        </button>

      </div>
    </div>
  );
};

export default CardGrande;