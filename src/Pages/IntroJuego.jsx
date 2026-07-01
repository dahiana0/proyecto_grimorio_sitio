import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../Styles/juego.css";

const datos = [
  { titulo: "Nuevos Comentarios", clase: "nuevos" },
  { titulo: "Más Populares", clase: "populares" },
  { titulo: "Comentarios Antiguos", clase: "antiguos" },
];

export const IntroJuego = () => {
  const navigate = useNavigate();
  const [selectedDoor, setSelectedDoor] = useState(null);

  const pickDoor = (door) => {
    setSelectedDoor(door);
    navigate("/juego");
  };

  return (
    <div id="juego">
      <button 
        onClick={() => navigate("/")}
        title="Volver al inicio"
        style={{
          position: "fixed",
          top: "20px",
          left: "20px",
          border: "1px solid #ffffff",
          padding: "8px 16px",
          borderRadius: "8px",
          color: "#ffffff",
          fontSize: "12px",
          letterSpacing: "1px",
          fontFamily: "rxx",
          backgroundColor: "#ffffff1a",
          cursor: "pointer",
          zIndex: 1000,
        }}
      >
        ← VOLVER AL INICIO
      </button>
      <div id="tablero" className="tablero">
        <div className="contenedor titulo">
          <h1>Sección de Comentarios</h1>
          <p>
            En el museo de Grimorio, queremos leer tu opinión. Explora los
            testimonios de otros visitantes.
          </p>
        </div>

        <div className="contenedor objetivo">
          <h2>Objetivo</h2>
          <p>
            Explorar los testimonios de otros visitantes para descubrir nuevas
            pistas y perspectivas sobre los misterios del museo.
          </p>
        </div>

        <div className="contenedor foto">
          <img src="/castilloComen.png" alt="Museo Grimorio" />
        </div>

        {datos.map((item) => (
          <div key={item.clase} className={`contenedor comentarios ${item.clase}`}>
            <h2>{item.titulo}</h2>
          </div>
        ))}

        <div
          className="contenedor boton-comentario"
          role="button"
          tabIndex={0}
          onClick={() => pickDoor(1)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") pickDoor(1);
          }}
        >
          HAZ TU COMENTARIO
        </div>
      </div>
    </div>
  );
};

export default IntroJuego;
