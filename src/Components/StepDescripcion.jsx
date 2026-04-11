import React from "react";
import "../Styles/css.css";
import { useNavigate } from "react-router-dom";

export const StepDescripcion = () => {
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
            src="./stephen.jpg"
            alt="Stephen Jones"
            className="cthulhu-img"
          />

          <div className="mt-2">
            <span className="cthulhu-tag me-2">Protagonista</span>
            <span className="cthulhu-tag">Racional</span>
          </div>
        </div>

        <div className="cthulhu-text">

          <p className="cthulhu-subtitle">
            EL ESCÉPTICO
          </p>

          <h1 className="cthulhu-title">
            STEPHEN JONES
          </h1>

          <p className="cthulhu-quote">
            "Un hombre racional y culto que no cree en lo sobrenatural… hasta que el museo le demuestra lo contrario."
          </p>

          <div className="cthulhu-line"></div>

          <p className="cthulhu-desc">
            Stephen Jones es un periodista y escritor reconocido por su pensamiento crítico y su escepticismo absoluto. Criado en una familia académica de Boston, siempre buscó respuestas racionales a los misterios del mundo. Cuando recibe una invitación anónima para visitar un museo de cera en una ciudad costera olvidada, su curiosidad lo lleva a aceptar. Lo que encuentra allí desafía todo lo que creía saber. Las figuras de cera parecen demasiado reales, los pasillos parecen cambiar de forma, y una presencia antigua lo acecha desde las sombras. A medida que descubre la verdad detrás del museo, Stephen debe enfrentarse a la posibilidad de que la razón no puede explicar todo lo que existe en el universo.
          </p>

        </div>
      </div>
    </div>
  );
};

export default StepDescripcion;