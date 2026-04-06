import React from "react";
import "../Styles/css.css";

export const OrabonaDescripcion = () => {
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
           Misterioso
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
             Aliado
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
            EL ENIGMA
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
          ORABONA
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
            "El socio silencioso de Rogers. Misterioso y enigmático, siempre parece saber más de lo que muestra."
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
           Orabona llegó al museo hace décadas, nadie sabe exactamente cuándo. Algunos dicen que fue el primer asistente del padre de Rogers, otros creen que estuvo allí antes que cualquier miembro de la familia. Habla poco, pero cuando lo hace, sus palabras tienen un peso que hiela la sangre. Conoce cada rincón del museo, cada secreto oculto tras sus paredes. Su lealtad a Rogers parece inquebrantable, pero hay momentos en que sus ojos revelan algo más.
          </p>
        </div>
      </div>
    </div>
  );
};

export default OrabonaDescripcion;

