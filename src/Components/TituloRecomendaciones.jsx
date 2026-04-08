import React from "react";

const TituloRecomendaciones = () => {
  return (
    <div
      style={{
        marginBottom: "40px",
        textAlign: "center", 
      }}
    >
      <p
        style={{
          color: "#bfa76a",
          letterSpacing: "4px",
          fontSize: "12px",
          fontFamily: "monospace",
        }}
      >
        MÁS ALLÁ DEL GRIMORIO
      </p>

      <h1
        style={{
          color: "#eaeaea",
          fontFamily: "haus",
          fontSize: "42px",
          margin: "10px 0",
          textShadow:"0 0 6px #fff"
        }}
      >
        LECTURAS RECOMENDADAS
      </h1>

      <p
        style={{
          color: "#aaa",
          fontFamily: "monospace",
          fontSize: "14px",
          maxWidth: "500px",
          margin: "0 auto", // 
        }}
      >
        Explora más historias del universo lovecraftiano que expandirán los horrores que ya conoces.
      </p>
    </div>
  );
};

export default TituloRecomendaciones;