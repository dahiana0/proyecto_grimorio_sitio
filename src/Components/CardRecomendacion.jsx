import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import "../Styles/Recomendaciones.css";
import "../Styles/css.css";

const CardRecomendacion = ({
  imagen,
  titulo,
  autor,
  anio,
  descripcion,
  pdf,
  indice = 0,
  total = 6,
}) => {
  const [abierto, setAbierto] = useState(false);

  // Cerrar con Escape y bloquear el scroll mientras el modal está abierto
  useEffect(() => {
    if (!abierto) return;

    const onKey = (e) => e.key === "Escape" && setAbierto(false);
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [abierto]);

  const abrirPDF = () => window.open(pdf, "_blank");

  const angulo = (360 / total) * indice;

  return (
    <>
      {/* Posición fija en el anillo */}
      <div className="item-orbita" style={{ "--angulo": `${angulo}deg` }}>
        {/* Contra-rotación: mantiene la portada de frente */}
        <div className="contra">
          {/* Flotación suave */}
          <button
            type="button"
            className="portada-flotante"
            style={{ animationDelay: `${indice * 0.5}s` }}
            onClick={() => setAbierto(true)}
            aria-label={`Ver información de ${titulo}`}
          >
            <img src={imagen} alt={titulo} className="portada-img" />
          </button>
        </div>
      </div>

      {/* Modal en portal para que no le afecten los transform 3D */}
      {abierto &&
        createPortal(
          <div className="reco-overlay" onClick={() => setAbierto(false)}>
            <div
              className="reco-modal"
              onClick={(e) => e.stopPropagation()}
              role="dialog"
              aria-modal="true"
              aria-label={titulo}
            >
              <button
                type="button"
                className="reco-modal-close"
                onClick={() => setAbierto(false)}
                aria-label="Cerrar"
              >
                ✕
              </button>

              <img src={imagen} alt={titulo} className="reco-modal-img" />

              <div className="reco-modal-info">
                <h3 className="card-recomendacion-title">{titulo}</h3>
                <p className="card-recomendacion-meta">
                  {autor} · {anio}
                </p>
                <p className="card-recomendacion-desc">{descripcion}</p>

                <button
                  type="button"
                  className="reco-btn-pdf"
                  onClick={abrirPDF}
                >
                  Ver libro en PDF
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
};

export default CardRecomendacion;