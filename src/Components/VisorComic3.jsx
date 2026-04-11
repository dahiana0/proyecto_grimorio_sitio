import React, { useState } from "react";
import "../Styles/css.css";
import { useNavigate } from "react-router-dom";

export const VisorComic3 = ({
  imagenes,
  numeroCapitulo = " III",
  tituloCapitulo = "El Despertar",
}) => {
  const navigate = useNavigate();
  const [index, setIndex] = useState(0);
  const [mostrarSubtitulo, setMostrarSubtitulo] = useState(true);
  const [volumen, setVolumen] = useState(true);

  const siguiente = () => {
    if (index < imagenes.length - 1) {
      setIndex(index + 1);
    }
  };

  const anterior = () => {
    if (index > 0) {
      setIndex(index - 1);
    }
  };

  return (
    <div className="visor-container">

      <div className="visor-header">

        <div className="visor-left">

          <button
            onClick={() => navigate("/explorar-museo")}
            className="visor-btn"
          >
            ← CAPÍTULOS
          </button>

          <div className="visor-divider"></div>

          <div className="visor-info">
            <span className="visor-capitulo">
              CAPÍTULO {numeroCapitulo}
            </span>

            <span className="visor-titulo">
              — {tituloCapitulo}
            </span>
          </div>
        </div>

        <div className="visor-icons">
          <img
            onClick={() => setVolumen(!volumen)}
            src={volumen ? "./volume-2 (2).svg" : "./volume-3.svg"}
            alt="volumen"
            className={`visor-icon ${!volumen ? "off" : ""}`}
          />

          <img
            onClick={() => setMostrarSubtitulo(!mostrarSubtitulo)}
            src={
              mostrarSubtitulo
                ? "./subtitles.svg"
                : "./subtitles-off.svg"
            }
            alt="subtitulos"
            className={`visor-icon ${!mostrarSubtitulo ? "off" : ""}`}
          />
        </div>
      </div>

      <div className="visor-imagen-container">
        <img
          src={imagenes[index].imagen}
          alt="imagen"
          className="visor-imagen"
        />

        {mostrarSubtitulo && (
          <div className="visor-subtitulo">
            <p>{imagenes[index].subtitulo}</p>
          </div>
        )}

        <img
          onClick={anterior}
          src="./circle-chevron-left.svg"
          alt="anterior"
          className={`visor-arrow left ${index === 0 ? "disabled" : ""}`}
        />

        <img
          onClick={siguiente}
          src="./circle-chevron-right.svg"
          alt="siguiente"
          className={`visor-arrow right ${
            index === imagenes.length - 1 ? "disabled" : ""
          }`}
        />
      </div>

      <div className="visor-dots">
        <div className={`dot ${index === 0 ? "active" : ""}`}></div>
        <div className={`dot ${index === 1 ? "active" : ""}`}></div>
        <div className={`dot ${index === 2 ? "active" : ""}`}></div>
      </div>
    </div>
  );
};

export default VisorComic3;