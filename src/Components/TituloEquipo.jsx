import React from "react";

export const TituloEquipo = () => {
  return (
    <div
      style={{
        width: "100%",
        textAlign: "center",
        marginBottom: "60px",
      }}
    >
      {/* TEXTO PEQUEÑO */}
      <p
        style={{
          color: "#bfa76a",
          letterSpacing: "6px",
          fontSize: "18px",
          fontFamily: "mono",
          marginBottom: "15px",
        }}
      >
        NUESTRO EQUIPO
      </p>

      
      <h1
        style={{
          color: "#fff",
          fontFamily: "haus",
          fontSize: "50px",
          letterSpacing: "2px",
          textShadow:"0 0 6px #fff"
        }}
      >
        GUARDIANAS DE GRIMORIO
      </h1>
    </div>
  );
};

export default TituloEquipo;