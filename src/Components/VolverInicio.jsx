import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";

export const VolverInicio = () => {
  const navigate = useNavigate();

  // Sonido del botón
  const sonidoBoton = useRef(new Audio("./audios/sonidoboton.ogg"));

  const volverAlInicio = () => {
    sonidoBoton.current.currentTime = 0;
    sonidoBoton.current.play().catch(() => {});

    setTimeout(() => {
      navigate("/");
    }, 150);
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "10px",
        cursor: "pointer",
        marginBottom: "40px",
      }}
    >
      <button
        onClick={volverAlInicio}
        style={{
          top: "20px",
          left: "20px",
          border: "1px solid #ffffff",
          padding: "8px 16px",
          borderRadius: "8px",
          color: "#ffffff",
          fontSize: "12px",
          letterSpacing: "1px",
          fontFamily:"rxx",
          backgroundColor:"#ffffff1a"
        }}
      >
        ← VOLVER AL INICIO
      </button>
    </div>
  );
};

export default VolverInicio;