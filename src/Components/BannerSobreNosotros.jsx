import React from "react";
import "../Styles/SobreNosotros.css";
import Header from "./Header";

export const BannerSobreNosotros = () => {
  return (
    <div className="sobre-container d-flex justify-content-center align-items-center">

      <div className="sobre-content text-white">

        <h1 className="sobre-title">
          Donde Lo Oculto Se Revela
        </h1>

        <p className="sobre-text">
          Grimorio surge como una respuesta a las problemáticas que enfrentan
          los jóvenes con la lectura tradicional. No es una simple adaptación
          visual, sino una reinterpretación interactiva, estética y emocional.
        </p>

      </div>
    </div>
  );
};

export default BannerSobreNosotros;