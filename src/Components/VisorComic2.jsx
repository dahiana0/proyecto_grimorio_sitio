import React, { useState } from "react";
import "../Styles/css.css";
import { useNavigate } from "react-router-dom";

export const VisorComic2 = ({
  imagenes,
  numeroCapitulo = " II",
  tituloCapitulo = "Las Reliquias",
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

      <div className="visor-top d-flex justify-content-between align-items-center">

        <div className="d-flex align-items-center gap-2">

          <button
            onClick={() => navigate("/explorar-museo")}
            className="visor-btn"
          >
            ← CAPÍTULOS
          </button>

          <div className="visor-line"></div>

          <div className="d-flex align-items-center gap-1">
            <span className="visor-cap">
              CAPÍTULO {numeroCapitulo}
            </span>

            <span className="visor-title">
              — {tituloCapitulo}
            </span>
          </div>
        </div>

        <div className="d-flex gap-3">
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

      <div className="visor-img-container">

        <img
          src={imagenes[index].imagen}
          alt="imagen"
          className="visor-img"
        />

        {mostrarSubtitulo && (
          <div className="visor-sub">
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

export default VisorComic2;