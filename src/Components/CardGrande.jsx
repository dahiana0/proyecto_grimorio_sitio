import React from "react";
import "../Styles/css.css";

export const CardGrande = ({
  nombre,
  rol,
  descripcion,
  imagen,
  tipo,
  rasgo,
}) => {
  return (
    <div
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-10px) scale(1.02)";
        e.currentTarget.style.boxShadow =
          "0 0 25px rgba(191, 167, 106, 0.5)";
        e.currentTarget.style.border = "1px solid #bfa76a";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0) scale(1)";
        e.currentTarget.style.boxShadow = "none";
        e.currentTarget.style.border = "1px solid #2a3a38";
      }}
      style={{
        width: "260px",
        height: "350px",
        borderRadius: "12px",
        overflow: "hidden",
        position: "relative",
        border: "1px solid #2a3a38",
        cursor: "pointer",

        
        transition: "all 0.3s ease",
      }}
    >
      <img
        src={imagen}
        alt={nombre}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
        }}
      />

      <div
        style={{
          position: "absolute",
          bottom: 0,
          width: "100%",
          padding: "15px",
          background:
            "linear-gradient(to top, rgba(0,0,0,0.95), transparent)",
        }}
      >
        <p
          style={{
            color: "#bfa76a",
            fontSize: "11px",
            letterSpacing: "2px",
            fontFamily: "monospace",
            marginBottom: "5px",
          }}
        >
          {rol}
        </p>

        <h2
          style={{
            color: "#fff",
            fontSize: "16px",
            fontFamily: "haus",
            marginBottom: "6px",
          }}
        >
          {nombre}
        </h2>

        <p
          style={{
            color: "#ccc",
            fontSize: "12px",
            lineHeight: "1.4",
            fontFamily: "monospace",
            marginBottom: "15px",
          }}
        >
          {descripcion}
        </p>

        <div
          style={{
            display: "flex",
            gap: "8px",
            marginBottom: "10px",
          }}
        >
          <span
            style={{
              padding: "4px 10px",
              borderRadius: "20px",
              border: "1px solid #bfa76a",
              color: "#bfa76a",
              fontSize: "12px",
              fontFamily: "monospace",
            }}
          >
            {tipo}
          </span>

          <span
            style={{
              padding: "4px 10px",
              borderRadius: "20px",
              border: "1px solid #bfa76a",
              color: "#bfa76a",
              fontSize: "12px",
              fontFamily: "monospace",
            }}
          >
            {rasgo}
          </span>
        </div>

        <button
          style={{
            padding: "6px 12px",
            borderRadius: "6px",
            border: "1px solid #bfa76a",
            background: "rgba(191,167,106,0.1)",
            color: "#bfa76a",
            fontSize: "11px",
            cursor: "pointer",
            fontFamily: "haus",
          }}
        >
          VER MÁS
        </button>
      </div>
    </div>
  );
};

export default CardGrande;