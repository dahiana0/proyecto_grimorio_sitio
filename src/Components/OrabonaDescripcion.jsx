import React from "react";
import "../Styles/css.css";
import { useNavigate } from "react-router-dom";

export const OrabonaDescripcion = () => {
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
            src="./orabona.jpg"
            alt="Orabona"
            className="cthulhu-img"
          />

          <div className="mt-2">
            <span className="cthulhu-tag me-2">Misterioso</span>
            <span className="cthulhu-tag">Aliado</span>
          </div>
        </div>

        <div className="cthulhu-text">

          <p className="cthulhu-subtitle">
            EL ENIGMA
          </p>

          <h1 className="cthulhu-title">
            ORABONA
          </h1>

          <p className="cthulhu-quote">
            "El socio silencioso de Rogers. Misterioso y enigmático, siempre parece saber más de lo que muestra."
          </p>

          <div className="cthulhu-line"></div>

          <p className="cthulhu-desc">
            Orabona llegó al museo hace décadas, nadie sabe exactamente cuándo. Algunos dicen que fue el primer asistente del padre de Rogers, otros creen que estuvo allí antes que cualquier miembro de la familia. Habla poco, pero cuando lo hace, sus palabras tienen un peso que hiela la sangre. Conoce cada rincón del museo, cada secreto oculto tras sus paredes. Su lealtad a Rogers parece inquebrantable, pero hay momentos en que sus ojos revelan algo más.
          </p>

        </div>
      </div>
    </div>
  );
};

export default OrabonaDescripcion;