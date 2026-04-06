import React from "react";
import "../Styles/css.css";

export const RogersDescripcion = () => {
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
            src="./rogers.jpg"
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
             Antagonista
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
             Obsesivo
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
            EL CURADOR
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
           GEORGE ROGERS
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
            "Dueño del museo de cera. Fascinado desde niño por embalsamar y preservar, su pasión roza lo macabro."
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
           George Rogers heredó el museo de su padre, un taxidermista excéntrico que dedicó su vida a preservar la belleza en la muerte. Desde niño, George mostró una fascinación perturbadora por la frontera entre lo vivo y lo inerte. Estudió química y anatomía, perfeccionando técnicas de preservación que superaban cualquier método conocido. Sus figuras de cera son tan realistas que visitantes han jurado verlas respirar. Pero el secreto de su arte no es la cera: Rogers descubrió un antiguo grimorio que contiene rituales para atrapar la esencia vital de los seres vivos.
          </p>
        </div>
      </div>
    </div>
  );
};

export default RogersDescripcion;

