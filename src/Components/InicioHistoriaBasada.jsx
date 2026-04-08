import React, { useState, useEffect } from "react";

export const InicioHistoriaBasada = () => {
  const imagenes = [
    "./Libro1.png",
    "./Libro2.png",
  ];

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
    <div
      style={{
        width: "100%",
        minHeight: "70vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#040f08",
        padding: "60px 40px",
      }}
    >
      
      <div
        style={{
          width: "100%",
          maxWidth: "1100px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "60px",
        }}
      >
       
        <img
          src={imagenes[index]}
          alt="Libro animado"
          style={{
            width: "300px",
            height: "auto",
            objectFit: "contain",
            opacity: fade ? 1 : 0,
            transition: "opacity 0.5s ease-in-out",
          }}
        />

       
        <div style={{ color: "#e8e6e3", maxWidth: "500px" }}>
          <p
            style={{
              letterSpacing: "6px",
              fontSize: "13px",
              color: "#bfa76a",
              marginBottom: "15px",
              fontFamily: "monospace",
            }}
          >
            HISTORIA BASADA EN
          </p>

          <h1
            style={{
              fontSize: "40px",
              marginBottom: "20px",
              fontFamily: "haus",
              color: "#ffffff",
              textShadow: "0 0 6px #ffffff",
            }}
          >
            "EL HORROR EN EL MUSEO" 1933
          </h1>

          <p
            style={{
              fontSize: "18px",
              lineHeight: "1.8",
              color: "#cfcfcf",
              fontFamily: "monospace ",
            }}
          >
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