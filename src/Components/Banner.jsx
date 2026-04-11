import React from "react";
import "../Styles/css.css";
import { useNavigate } from "react-router-dom";

export const Banner = () => {
  const navigate = useNavigate();

  return (
    <div className="banner-container d-flex align-items-center justify-content-center">


      <div className="banner-overlay"></div>


      <div className="banner-content text-center text-white">

        <p className="banner-subtitle">
          SI TE ATREVES A ENTRAR
        </p>

        <h1 className="banner-title">
          GRIMORIO
        </h1>

        <p className="banner-text">
          Explora el Museo del Horror de Grimorio…
          y adéntrate en una historia que desafía la realidad,
          donde cada página revela secretos ocultos,
          y cada paso te acerca a algo que nunca debiste encontrar.
        </p>

        <button
          onClick={() => navigate("/explorar-museo")}
          className="banner-btn"
        >
          EXPLORAR MUSEO
        </button>

      </div>
    </div>
  );
};

export default Banner;