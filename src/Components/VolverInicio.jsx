import React from "react";

export const VolverInicio = ({ onClick }) => {
  return (
    <div
      onClick={onClick}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "10px",
        cursor: "pointer",
        marginBottom: "40px",
      }}
    >
      
      <span
        style={{
          color: "#cfcfcf",
          fontSize: "18px",
          fontFamily: "monospace",
        }}
      >
        ✕
      </span>

      
      <span
        style={{
          color: "#cfcfcf",
          fontSize: "13px",
          letterSpacing: "2px",
          fontFamily: "monospace",
        }}
      >
        VOLVER AL INICIO
      </span>
    </div>
  );
};

export default VolverInicio;