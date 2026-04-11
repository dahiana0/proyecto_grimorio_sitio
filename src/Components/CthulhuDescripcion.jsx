import React from "react";
import "../Styles/css.css";
import { useNavigate } from "react-router-dom";

export const CthulhuDescripcion = () => {
  const navigate = useNavigate();

  return (
    <div className="cthulhu-container d-flex justify-content-center align-items-center">

     
      <button
        onClick={() => navigate("/Personajes")}
        className="cthulhu-back-btn"
      >
        ← VOLVER A PERSONAJES
      </button>

      
      <button
        onClick={() => navigate("/")}
        className="cthulhu-close-btn"
      >
        <img src="./x.svg" alt="Cerrar" className="cthulhu-close-img" />
      </button>

     
      <div className="cthulhu-content d-flex align-items-center">

        
        <div>
          <img
            src="./cthulhu.jpg"
            alt="Cthulhu"
            className="cthulhu-img"
          />

          <div className="mt-2">
            <span className="cthulhu-tag me-2">Cósmico</span>
            <span className="cthulhu-tag">Entidad</span>
          </div>
        </div>

        {/* Texto */}
        <div className="cthulhu-text">

          <p className="cthulhu-subtitle">
            EL HORROR
          </p>

          <h1 className="cthulhu-title">
            CTHULHU
          </h1>

          <p className="cthulhu-quote">
            "Un ser informe y tentacular. El verdadero secreto del museo… y la prueba de que algunos horrores no deberían existir."
          </p>

          <div className="cthulhu-line"></div>

          <p className="cthulhu-desc">
            Cthulhu no es simplemente una figura del museo: es la razón de su existencia. 
            La entidad cósmica yace en un sueño eterno en las profundidades del océano, 
            pero su influencia se extiende como tentáculos invisibles a través del tiempo y el espacio. 
            El grimorio que Rogers encontró es un fragmento del Necronomicón, 
            y los rituales que contiene sirven como puente entre nuestra realidad y la dimensión donde Cthulhu aguarda.
          </p>

        </div>
      </div>
    </div>
  );
};

export default CthulhuDescripcion;