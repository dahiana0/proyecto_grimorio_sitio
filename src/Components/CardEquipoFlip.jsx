import React, { useState } from "react";


export const CardEquipoFlip = ({
  nombre,
  rol,
  descripcion,
  imagen,
  iniciales = "SA",
  colorFondo = "#bfa76a",
  colorBorde = "#bfa76a",
  colorIniciales = "#000",
}) => {
  const [flip, setFlip] = useState(false);

  return (
    
    <div

      onClick={() => setFlip(!flip)}
      style={{
        width: "260px",
        height: "380px",
        perspective: "1000px",
        cursor: "pointer",
      }}
    >
      <div
        style={{
          width: "100%",
          height: "100%",
          position: "relative",
          transformStyle: "preserve-3d",
          transition: "transform 0.6s",
          transform: flip ? "rotateY(180deg)" : "rotateY(0deg)",
        }}
      >
        
        <div
          style={{
            position: "absolute",
            width: "100%",
            height: "100%",
            backfaceVisibility: "hidden",
            borderRadius: "12px",
            overflow: "hidden",
            border: "1px solid #2a3a38",
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
              bottom: "0",
              width: "100%",
              padding: "15px",
              background:
                "linear-gradient(to top, rgba(0,0,0,0.9), transparent)",
            }}
          >
            <h3 style={{ color: "#fff", fontFamily: "haus" }}>
              {nombre}
            </h3>

            <p
              style={{
                color: "#bfa76a",
                fontFamily: "mono",
                fontSize: "12px",
              }}
            >
              {rol}
            </p>
          </div>
        </div>

      
        <div
          style={{
            position: "absolute",
            width: "100%",
            height: "100%",
            backfaceVisibility: "hidden",
            borderRadius: "12px",
            backgroundColor: "#111817",
            border: "1px solid #2a3a38",
            transform: "rotateY(180deg)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "25px",
            textAlign: "center",
          }}
        >
          <div
            style={{
              width: "55px",
              height: "55px",
              borderRadius: "50%",
              backgroundColor: colorFondo,
              border: `2px solid ${colorBorde}`,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              marginBottom: "15px",
            }}
          >
            <span
              style={{
                color: colorIniciales,
                fontFamily: "haus",
                fontSize: "18px",
              }}
            >
              {iniciales}
            </span>
          </div>

          <h3 style={{ color: "#fff", fontFamily: "haus" }}>
            {nombre}
          </h3>

          <p
            style={{
              color: "#bfa76a",
              fontFamily: "mono",
              fontSize: "15px",
              marginBottom: "15px",
            }}
          >
            {rol}
          </p>

          <p
            style={{
              color: "#cfcfcf",
              fontFamily: "mono",
              fontSize: "14px",
              lineHeight: "1.6",
            }}
          >
            {descripcion}
          </p>
        </div>
      </div>
    </div>
  );
};

export default CardEquipoFlip;