import React from "react";
import "../Styles/css.css";

const TituloPersonajes = () => {
  return (
    <div style={{ textAlign: "center", marginBottom: "50px" }}>
      <p
        style={{
          color: "#bfa76a",
          letterSpacing: "4px",
          fontSize: "12px",
          fontFamily: "monospace",
        }}
      >
        ARCHIVO DE PERSONAJES
      </p>

      <h1
        style={{
          color: "#eaeaea",
          fontFamily: "haus",
          fontSize: "48px",
          margin: "10px 0",
           textShadow:"0 0 8px #fff",
        }}
      >
        CONOCE A LOS PERSONAJES
      </h1>

      <p
        style={{
          color: "#aaa",
          fontFamily: "monospace",
          fontSize: "14px",
          maxWidth: "600px",
          margin: "0 auto",
        }}
      >
        Descubre el trasfondo y los secretos ocultos de los personajes que habitan nuestras historias.
      </p>
    </div>
  );
};

export default TituloPersonajes;