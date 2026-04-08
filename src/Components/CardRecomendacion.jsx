import React from "react";
import "../Styles/css.css";

const CardRecomendacion = ({
  imagen,
  titulo,
  autor,
  anio,
  descripcion,
}) => {
  return (
    <div
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-8px) scale(1.02)";
        e.currentTarget.style.boxShadow =
          "0 0 20px rgba(191, 167, 106, 0.4)";
        e.currentTarget.style.border = "1px solid #bfa76a";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0) scale(1)";
        e.currentTarget.style.boxShadow = "none";
        e.currentTarget.style.border = "1px solid #2a3a38";
      }}
      style={{
        display: "flex",
        gap: "15px",
        padding: "15px",
        borderRadius: "12px",
        border: "1px solid #2a3a38",
        backgroundColor: "#0f1716",
        width: "100%",
        maxWidth: "360px",

       
        transition: "all 0.3s ease",
      }}
    >
      <img
        src={imagen}
        alt={titulo}
        style={{
          width: "80px",
          height: "120px",
          objectFit: "cover",
          borderRadius: "6px",
        }}
      />

      <div style={{ display: "flex", flexDirection: "column" }}>
        <h3
          style={{
            color: "#fff",
            fontFamily: "haus",
            fontSize: "16px",
            marginBottom: "5px",
          }}
        >
          {titulo}
        </h3>

        <p
          style={{
            color: "#bfa76a",
            fontSize: "11px",
            fontFamily: "monospace",
            marginBottom: "8px",
          }}
        >
          {autor} · {anio}
        </p>

        <p
          style={{
            color: "#ccc",
            fontSize: "12px",
            fontFamily: "monospace",
            lineHeight: "1.4",
          }}
        >
          {descripcion}
        </p>
      </div>
    </div>
  );
};

export default CardRecomendacion;