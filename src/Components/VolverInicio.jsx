import React from "react";
import { useNavigate } from "react-router-dom";

export const VolverInicio = () => {
  const navigate = useNavigate();
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
        onClick={() => navigate("/")}
        style={{
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
        ← VOLVER AL INICIO
      </button>
    </div>
  );
};

export default VolverInicio;