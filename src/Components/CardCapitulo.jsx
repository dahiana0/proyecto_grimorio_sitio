import React from "react";

export const CardCapitulo = ({
  titulo,
  descripcion,
  imagen,
  capitulo = "CAPÍTULO I",
}) => {
  return (
    <div
      style={{
        width: "280px",
        height: "420px", 
        borderRadius: "14px",
        overflow: "hidden",
        border: "1px solid #2a3a38",
        position: "relative",
      }}
    >
      
      <img
        src={imagen}
        alt={titulo}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          position: "absolute",
        }}
      />

      
      <div
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          background:
            "linear-gradient(to top, rgba(0,0,0,0.95) 20%, rgba(0,0,0,0.6) 50%, transparent 100%)",
        }}
      />

      
      <div
        style={{
          position: "absolute",
          top: "15px",
          left: "15px",
          backgroundColor: "#5a3d24",
          padding: "6px 14px",
          borderRadius: "20px",
          fontSize: "11px",
          color: "#fff",
          fontFamily: "monospace",
          zIndex: 2,
        }}
      >
        {capitulo}
      </div>

      
      <div
        style={{
          position: "absolute",
          bottom: "0",
          width: "100%",
          padding: "20px",
          zIndex: 2,
        }}
      >
        <h3
          style={{
            color: "#fff",
            fontFamily: "haus",
            marginBottom: "10px",
          }}
        >
          {titulo}
        </h3>

        <p
          style={{
            color: "#cfcfcf",
            fontSize: "13px",
            fontFamily: "monospace",
            lineHeight: "1.6",
            marginBottom: "20px",
          }}
        >
          {descripcion}
        </p>

      
        <div
          style={{
            width: "100%",
            padding: "12px",
            borderRadius: "6px",
            backgroundColor: "#3a3727",
            color: "#fff",
            textAlign: "center",
            fontSize: "15px",
            fontFamily: "haus",
            cursor: "pointer",
          }}
        >
          ▶ VER AHORA
        </div>
      </div>
    </div>
  );
};

export default CardCapitulo;