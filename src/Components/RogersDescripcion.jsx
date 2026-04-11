import React from "react";
import "../Styles/css.css";
import { useNavigate } from "react-router-dom";

export const RogersDescripcion = () => {
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
            src="./rogers.jpg"
            alt="George Rogers"
            className="cthulhu-img"
          />

          <div className="mt-2">
            <span className="cthulhu-tag me-2">Antagonista</span>
            <span className="cthulhu-tag">Obsesivo</span>
          </div>
        </div>

        <div className="cthulhu-text">

          <p className="cthulhu-subtitle">
            EL CURADOR
          </p>

          <h1 className="cthulhu-title">
            GEORGE ROGERS
          </h1>

          <p className="cthulhu-quote">
            "Dueño del museo de cera. Fascinado desde niño por embalsamar y preservar, su pasión roza lo macabro."
          </p>

          <div className="cthulhu-line"></div>

          <p className="cthulhu-desc">
            George Rogers heredó el museo de su padre, un taxidermista excéntrico que dedicó su vida a preservar la belleza en la muerte. Desde niño, George mostró una fascinación perturbadora por la frontera entre lo vivo y lo inerte. Estudió química y anatomía, perfeccionando técnicas de preservación que superaban cualquier método conocido. Sus figuras de cera son tan realistas que visitantes han jurado verlas respirar. Pero el secreto de su arte no es la cera: Rogers descubrió un antiguo grimorio que contiene rituales para atrapar la esencia vital de los seres vivos.
          </p>

        </div>
      </div>
    </div>
  );
};

export default RogersDescripcion;