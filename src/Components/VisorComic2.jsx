import React, { useState } from "react";
import "../Styles/css.css";

export const VisorComic2 = ({
  imagenes,
  numeroCapitulo = " II",
  tituloCapitulo = "Las Reliquias",
}) => {
  const [index, setIndex] = useState(0);
  const [mostrarSubtitulo, setMostrarSubtitulo] = useState(true);
  const [volumen, setVolumen] = useState(true);

  const siguiente = () => {
    if (index < imagenes.length - 1) {
      setIndex(index + 1);
    }
  };

  const anterior = () => {
    if (index > 0) {
      setIndex(index - 1);
    }
  };

  return (
    <div
      style={{
        width: "100%",
        backgroundColor: "#0b0f0e",
        padding: "20px",
      }}
    >
     
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "10px",
        }}
      >
      
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          
          <div
            style={{
              color: "#bfa76a",
              fontFamily: "monospace",
              cursor: "pointer",
            }}
          >
            ← CAPÍTULOS
          </div>

          <div
            style={{
              width: "1px",
              height: "15px",
              backgroundColor: "#444",
            }}
          ></div>

          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <span
              style={{
                color: "#888",
                fontFamily: "monospace",
                fontSize: "11px",
                letterSpacing: "2px",
              }}
            >
              CAPÍTULO {numeroCapitulo}
            </span>

            <span
              style={{
                color: "#fff",
                fontFamily: "haus",
                fontSize: "15px",
              }}
            >
              — {tituloCapitulo}
            </span>
          </div>
        </div>

       
        <div style={{ display: "flex", gap: "15px" }}>
          <img
            onClick={() => setVolumen(!volumen)}
            src={volumen ? "./volume-2 (2).svg" : "./volume-3.svg"}
            alt="volumen"
            style={{
              width: "22px",
              cursor: "pointer",
              opacity: volumen ? 1 : 0.5,
            }}
          />

          <img
            onClick={() => setMostrarSubtitulo(!mostrarSubtitulo)}
            src={
              mostrarSubtitulo
                ? "./subtitles.svg"
                : "./subtitles-off.svg"
            }
            alt="subtitulos"
            style={{
              width: "22px",
              cursor: "pointer",
              opacity: mostrarSubtitulo ? 1 : 0.5,
            }}
          />
        </div>
      </div>

     
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "500px",
          borderRadius: "12px",
          overflow: "hidden",
        }}
      >
        <img
          src={imagenes[index].imagen}
          alt="imagen"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />

        
        {mostrarSubtitulo && (
          <div
            style={{
              position: "absolute",
              bottom: "40px",
              left: "50%",
              transform: "translateX(-50%)",
              backgroundColor: "rgba(0,0,0,0.7)",
              padding: "15px 25px",
              borderRadius: "10px",
              color: "#fff",
              fontFamily: "monospace",
              textAlign: "center",
              maxWidth: "600px",
            }}
          >
            <p>{imagenes[index].subtitulo}</p>
          </div>
        )}

        
        <img
          onClick={anterior}
          src="./circle-chevron-left.svg" 
          alt="anterior"
          style={{
            position: "absolute",
            left: "15px",
            top: "50%",
            transform: "translateY(-50%)",
            width: "40px",
            cursor: "pointer",
            opacity: index === 0 ? 0.3 : 1,
          }}
        />

        
        <img
          onClick={siguiente}
          src="./circle-chevron-right.svg" 
          alt="siguiente"
          style={{
            position: "absolute",
            right: "15px",
            top: "50%",
            transform: "translateY(-50%)",
            width: "40px",
            cursor: "pointer",
            opacity: index === imagenes.length - 1 ? 0.3 : 1,
          }}
        />
      </div>

  
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "8px",
          marginTop: "15px",
        }}
      >
        <div
          style={{
            width: "8px",
            height: "8px",
            borderRadius: "50%",
            backgroundColor: index === 0 ? "#bfa76a" : "#444",
          }}
        ></div>

        <div
          style={{
            width: "8px",
            height: "8px",
            borderRadius: "50%",
            backgroundColor: index === 1 ? "#bfa76a" : "#444",
          }}
        ></div>

        <div
          style={{
            width: "8px",
            height: "8px",
            borderRadius: "50%",
            backgroundColor: index === 2 ? "#bfa76a" : "#444",
          }}
        ></div>
      </div>
    </div>
  );
};

export default VisorComic2;