import React from "react";
import "../Styles/css.css";

export const CardInfoS = ({ titulo, texto, imagen, derecha = false }) => {
  return (
    <div
      style={{
        width: "100%",
        display: "flex",
        justifyContent: "center",
        marginBottom: "80px",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "25px",
          maxWidth: "600px", 
          width: "100%",
          flexDirection: derecha ? "row-reverse" : "row",
          justifyContent: "center",
        }}
      >
        
        <div
          style={{
            width: "70px",
            height: "70px",
            borderRadius: "12px",
            border: "1px solid #d2b87933",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexShrink: 0,
            backgroundColor:"rgba(210, 184, 121, 0.1)"
          }}
        >
          <img src={imagen} alt="icono" style={{ width: "35px" }} />
        </div>

        
        <div
          style={{
            maxWidth: "420px",
            textAlign: derecha ? "right" : "left", 
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
              fontFamily: "monospace",
              fontSize: "14px",
              lineHeight: "1.7",
            }}
          >
            {texto}
          </p>
        </div>
      </div>
    </div>
  );
};

export default CardInfoS;