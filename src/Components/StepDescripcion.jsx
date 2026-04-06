import React from "react";
import "../Styles/css.css";

export const StepDescripcion = () => {
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100vh",
        background: "#040f08(0,0,0,0.95)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 9999,
        padding: "40px",
      }}
    >
     
      <div
        style={{
          position: "absolute",
          top: "20px",
          left: "20px",
          border: "1px solid #ffffff",
          padding: "8px 16px",
          borderRadius: "8px",
          color: "#ffffff",
          fontSize: "12px",
          letterSpacing: "1px",
          fontFamily:"haus",
          backgroundColor:"#ffffff1a"
        }}
      >
        ← VOLVER A PERSONAJES
      </div>

     
      <div
        style={{
          position: "absolute",
          top: "20px",
          right: "20px",
          fontSize: "18px",
          color: "#fff",
        }}
      >
        ✕
      </div>

     
      <div
        style={{
          display: "flex",
          gap: "60px",
          maxWidth: "1200px",
          width: "100%",
          color: "white",
          alignItems: "center",
        }}
      >
       
        <div>
          <img
            src="./stephen.jpg"
            alt="Stephen Jones"
            style={{
              width: "300px",
              borderRadius: "12px",
              border: "1px solid #2a3a38",
            }}
          />

          <div style={{ marginTop: "12px" }}>
            <span
              style={{
                border: "1px solid #bfa76a",
                padding: "4px 10px",
                marginRight: "6px",
                borderRadius: "20px",
                fontSize: "13px",
                color: "#bfa76a",
                 fontFamily:"mono",
              }}
            >
              Protagonista
            </span>

            <span
              style={{
                border: "1px solid #bfa76a",
                padding: "4px 10px",
                borderRadius: "20px",
                fontSize: "13px",
                color: "#bfa76a",
                 fontFamily:"mono",
              }}
            >
              Racional
            </span>
          </div>
        </div>

       
        <div style={{ flex: 1 }}>
          
          <p
            style={{
              color: "#bfa76a",
              fontSize: "13px",
              letterSpacing: "3px",
              marginBottom: "8px",
              fontFamily:"mono",
            }}
          >
            EL ESCÉPTICO
          </p>

         
          <h1
            style={{
              fontSize: "45px",
              letterSpacing: "2px",
              marginBottom: "20px",
              fontFamily:"haus",
              textShadow: "0 0 6px #ffffff",

            }}
          >
            STEPHEN JONES
          </h1>

          
          <p
            style={{
              fontStyle: "italic",
              color: "#cfcfcf",
              marginBottom: "20px",
              lineHeight: "1.6",
              fontFamily:"mono",
            }}
          >
            "Un hombre racional y culto que no cree en lo sobrenatural… hasta que el museo le demuestra lo contrario."
          </p>

        
          <div
            style={{
              width: "40px",
              height: "1px",
              background: "#555",
              marginBottom: "20px",
            }}
          ></div>

         
          <p
            style={{
              lineHeight: "1.8",
              color: "#ddd",
              fontSize: "16px",
              fontFamily:"mono",
            }}
          >
           Stephen Jones es un periodista y escritor reconocido por su pensamiento crítico y su escepticismo absoluto. Criado en una familia académica de Boston, siempre buscó respuestas racionales a los misterios del mundo. Cuando recibe una invitación anónima para visitar un museo de cera en una ciudad costera olvidada, su curiosidad lo lleva a aceptar. Lo que encuentra allí desafía todo lo que creía saber. Las figuras de cera parecen demasiado reales, los pasillos parecen cambiar de forma, y una presencia antigua lo acecha desde las sombras. A medida que descubre la verdad detrás del museo, Stephen debe enfrentarse a la posibilidad de que la razón no puede explicar todo lo que existe en el universo.
          </p>
        </div>
      </div>
    </div>
  );
};

export default StepDescripcion;

