import React, { useState, useEffect } from "react";
import "../Styles/css.css";

export const InicioHistoriaBasada = () => {
  const imagenes = ["./Cerrado.png", "./Abierto .png"];

  const [index, setIndex] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    const intervalo = setInterval(() => {
      setFade(false);

      setTimeout(() => {
        setIndex((prev) => (prev + 1) % imagenes.length);
        setFade(true);
      }, 400);
    }, 2000);

    return () => clearInterval(intervalo);
  }, []);

  return (
    <div className="historia-container d-flex justify-content-center align-items-center">

      <div className="historia-content d-flex align-items-center justify-content-center">

        <img
          src={imagenes[index]}
          alt="Libro animado"
          className={`historia-img ${fade ? "fade-in" : "fade-out"}`}
        />

        <div className="historia-text">
          <p className="historia-subtitle">
            HISTORIA BASADA EN
          </p>

          <h1 className="historia-title">
            "EL HORROR EN EL MUSEO" 1933
          </h1>

          <p className="historia-desc">
            Inspirado en el relato de H. P. Lovecraft y Hazel Heald, esta
            historia nos lleva a un inquietante museo de cera donde nada es lo
            que parece. Las figuras, demasiado reales, parecen observarte…
            y esconden un secreto perturbador: quizá no siempre fueron solo cera.
          </p>
        </div>

      </div>
    </div>
  );
};

export default InicioHistoriaBasada;