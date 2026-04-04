import React from "react";
import "../Styles/css.css";
import Header from "./Header";

export const BannerSobreNosotros = () => {
  return (
    
    <div
      style={{
        width: "100%",
        padding: "100px 20px",
        
        display: "flex",
        justifyContent: "center",
      }}
    >
      <div style={{ maxWidth: "900px", color: "#fff" }}>
        <p
          style={{
            letterSpacing: "6px",
            color: "#bfa76a",
            fontSize: "18px",
            marginBottom: "20px",
            fontFamily: "mono",
          }}
        >
          SOBRE NOSOTROS
        </p>

        <h1
          style={{
            fontSize: "50px",
            marginBottom: "25px",
            fontFamily: "haus",
            textShadow:"0 0 6px #fff"
          }}
        >
          DONDE LO OCULTO SE REVELA
        </h1>

        <p
          style={{
            fontSize: "20px",
            lineHeight: "1.8",
            color: "#cfcfcf",
            fontFamily: "mono",
            maxWidth: "600px",
            
          }}
        >
          Grimorio surge como una respuesta a las problemáticas que enfrentan los jóvenes con la lectura tradicional. No es una simple adaptación visual, sino una reinterpretación interactiva, estética y emocional.
        </p>
      </div>
    </div>
  );
};

export default BannerSobreNosotros;