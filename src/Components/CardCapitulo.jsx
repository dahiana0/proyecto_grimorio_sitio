import React from "react";
import { useNavigate } from "react-router-dom";
import "../Styles/css.css";

export const CardCapitulo = ({
  titulo,
  descripcion,
  imagen,
  capitulo = "CAPÍTULO I",
  ruta,
}) => {
  const navigate = useNavigate();

  return (
    <div className="card-capitulo">


      <img src={imagen} alt={titulo} className="card-img" />


      <div className="card-overlay"></div>


      <div className="card-badge">
        {capitulo}
      </div>


      <div className="card-content text-white">

        <h3 className="card-title">
          {titulo}
        </h3>

        <p className="card-text">
          {descripcion}
        </p>

        <button
          onClick={() => navigate(ruta)}
          className="card-btn w-100"
        >
          ▶ VER AHORA
        </button>

      </div>
    </div>
  );
};

export default CardCapitulo;