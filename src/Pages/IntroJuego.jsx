import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../Styles/juego.css";
import { getStoredComments } from "../utils/commentsStorage";

const datos = [
  { titulo: "Nuevos Comentarios", clase: "nuevos", ruta: "/comentariosCompletos/nuevos" },
  { titulo: "Comentarios Antiguos", clase: "antiguos", ruta: "/comentariosCompletos/antiguos" },
];

export const IntroJuego = () => {
  const navigate = useNavigate();
  const [comments, setComments] = useState(() => getStoredComments());
  const [referenceTime] = useState(() => Date.now());

  useEffect(() => {
    const handleCommentsUpdated = (event) => {
      if (Array.isArray(event.detail)) {
        setComments(event.detail);
      }
    };

    window.addEventListener("grimorio-comments-updated", handleCommentsUpdated);
    return () => window.removeEventListener("grimorio-comments-updated", handleCommentsUpdated);
  }, []);

  const tenDaysMs = 10 * 24 * 60 * 60 * 1000;
  const now = referenceTime;

  const comentariosRecientes = comments.filter((comment) => {
    const fechaComentario = new Date(comment.createdAt).getTime();
    return now - fechaComentario <= tenDaysMs;
  });

  const comentariosAntiguos = comments.filter((comment) => {
    const fechaComentario = new Date(comment.createdAt).getTime();
    return now - fechaComentario > tenDaysMs;
  });

  const pickDoor = () => {
    navigate("/juego");
  };

  const openComentarios = (ruta) => {
    if (ruta) {
      navigate(ruta);
    }
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
      <div id="tablero1" className="tablero1">
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
          <img src="/personajesComen.png" alt="Museo Grimorio" />
        </div>

        <div className="contenedor foto">
          <img src="/castilloComen.png" alt="Museo Grimorio" />
        </div>

        {datos.map((item) => (
          <div
            key={item.clase}
            className={`contenedor comentarios ${item.clase}`}
            role={item.ruta ? "button" : undefined}
            tabIndex={item.ruta ? 0 : undefined}
            onClick={() => openComentarios(item.ruta)}
            onKeyDown={(e) => {
              if (item.ruta && (e.key === "Enter" || e.key === " ")) {
                openComentarios(item.ruta);
              }
            }}
          >
            <h2>{item.titulo}</h2>
            {item.clase === "nuevos" && (
              <p>
                {comentariosRecientes.length} comentario{comentariosRecientes.length === 1 ? "" : "s"} nuevos
              </p>
            )}
            {item.clase === "antiguos" && (
              <p>
                {comentariosAntiguos.length} comentario{comentariosAntiguos.length === 1 ? "" : "s"} antiguos
              </p>
            )}
          </div>
        ))}

        <div
          className="contenedor boton-comentario"
          role="button"
          tabIndex={0}
          onClick={() => pickDoor()}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") pickDoor();
          }}
        >
          HAZ TU COMENTARIO
        </div>
      </div>
    </div>
  );
};

export default IntroJuego;
