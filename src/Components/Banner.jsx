import React from "react";
import "../Styles/css.css";


export const Banner = () => {
  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100vh",
        backgroundImage: "url('./Fondoinicio.png')", 
        backgroundSize: "cover",
        backgroundPosition: "center",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >

    
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          background: `
            linear-gradient(
              to bottom,
              rgba(0,0,0,0.7) 0%,
              rgba(0,0,0,0.6) 40%,
              rgba(0,0,0,0.85) 70%,
              #0b0f0e 100%
            )
          `,
          zIndex: 1,
        }}
      />

    
      <div
        style={{
          position: "relative",
          zIndex: 2,
          textAlign: "center",
          color: "#ffffff",
          maxWidth: "700px",
          padding: "20px",
        }}
      >

        <p
          style={{
            letterSpacing: "5px",
            fontSize: "18px",
            marginBottom: "20px",
            fontFamily:"mono",
          }}
        >
          SI TE ATREVES A ENTRAR
        </p>

        <h1
          style={{
            fontSize: "120px",
            fontFamily: "'haus'",
            marginBottom: "20px",
            textShadow:"0 0 8px #fff",
          }}
        >
          GRIMORIO
        </h1>

        <p
          style={{
            fontSize: "18px",
            lineHeight: "1.6",
            marginBottom: "30px",
            fontFamily:"mono"
          }}
        >
           Explora el Museo del Horror de Grimorio…
           y adéntrate en una historia que desafía la realidad,
           donde cada página revela secretos ocultos,
           y cada paso te acerca a algo que nunca debiste encontrar.
        </p>

        <button
          style={{
            border: "1px solid #ffffff",
            padding: "10px 25px",
            background: "transparent",
            color: "#ffffff",
            borderRadius: "6px",
            letterSpacing: "2px",
            cursor: "pointer",
            fontFamily:"haus",
            textShadow:"0 0 6px #fff",
          }}
        >
          EXPLORAR MUSEO
        </button>

      </div>
    </div>
  );
};



export default Banner;