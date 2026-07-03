import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../Styles/juego.css";

export const ComentariosCompletos = () => {
  const navigate = useNavigate();
  const { tipo } = useParams();
  const [comments, setComments] = useState([]);

  useEffect(() => {
    const savedComments = window.localStorage.getItem("grimorio-comments");
    if (savedComments) {
      try {
        setComments(JSON.parse(savedComments));
      } catch (error) {
        console.error("Error al leer comentarios guardados:", error);
      }
    }
  }, []);

  const threeDaysMs = 3 * 24 * 60 * 60 * 1000;
  const now = Date.now();

  const comentariosRecientes = comments
    .filter((comment) => now - new Date(comment.createdAt).getTime() <= threeDaysMs)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const comentariosAntiguos = comments
    .filter((comment) => now - new Date(comment.createdAt).getTime() > threeDaysMs)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const mostrarNuevos = tipo === "nuevos";
  const mostrarAntiguos = tipo === "antiguos";

  const tituloPagina = mostrarNuevos
    ? "Nuevos comentarios"
    : mostrarAntiguos
    ? "Comentarios antiguos"
    : "Comentarios";

  const descripcionPagina = mostrarNuevos
    ? "Mira sólo los comentarios recientes de los últimos 3 días."
    : mostrarAntiguos
    ? "Mira sólo los comentarios que tienen más de 3 días."
    : "Revisa todas las opiniones de los visitantes y navega entre comentarios nuevos y antiguos del museo Grimorio.";

  return (
    <section id="comentarios-page" className="comentarios-page">
      <button
        onClick={() => navigate("/intro-juego")}
        title="Volver a comentarios"
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
          display: "inline-flex",
          width: "fit-content",
          whiteSpace: "nowrap",
        }}
      >
        ← VOLVER
      </button>

      <h1 className="comentarios-titulo">{tituloPagina}</h1>
      <p className="comentarios-descripcion">{descripcionPagina}</p>

      {mostrarNuevos && (
        <div className="comentarios-lista">
          <div className="comentarios-lista-titulo">Nuevos comentarios</div>
          <div className="comentarios-container">
            {comentariosRecientes.length > 0 ? (
              comentariosRecientes.map((comment) => (
                <div key={comment.id} className="comentario-item">
                  <strong>{comment.name}</strong>
                  <p>{comment.message}</p>
                  <small>{new Date(comment.createdAt).toLocaleString()}</small>
                </div>
              ))
            ) : (
              <p>No hay comentarios nuevos todavía.</p>
            )}
          </div>
        </div>
      )}

      {mostrarAntiguos && (
        <div className="comentarios-lista">
          <div className="comentarios-lista-titulo">Comentarios antiguos</div>
          <div className="comentarios-container">
            {comentariosAntiguos.length > 0 ? (
              comentariosAntiguos.map((comment) => (
                <div key={comment.id} className="comentario-item">
                  <strong>{comment.name}</strong>
                  <p>{comment.message}</p>
                  <small>{new Date(comment.createdAt).toLocaleString()}</small>
                </div>
              ))
            ) : (
              <p>No hay comentarios antiguos.</p>
            )}
          </div>
        </div>
      )}

      {!tipo && (
        <>
          <div className="comentarios-lista">
            <div className="comentarios-lista-titulo">Nuevos comentarios</div>
            <div className="comentarios-container">
              {comentariosRecientes.length > 0 ? (
                comentariosRecientes.map((comment) => (
                  <div key={comment.id} className="comentario-item">
                    <strong>{comment.name}</strong>
                    <p>{comment.message}</p>
                    <small>{new Date(comment.createdAt).toLocaleString()}</small>
                  </div>
                ))
              ) : (
                <p>No hay comentarios nuevos todavía.</p>
              )}
            </div>
          </div>

          <div className="comentarios-lista">
            <div className="comentarios-lista-titulo">Comentarios antiguos</div>
            <div className="comentarios-container">
              {comentariosAntiguos.length > 0 ? (
                comentariosAntiguos.map((comment) => (
                  <div key={comment.id} className="comentario-item">
                    <strong>{comment.name}</strong>
                    <p>{comment.message}</p>
                    <small>{new Date(comment.createdAt).toLocaleString()}</small>
                  </div>
                ))
              ) : (
                <p>No hay comentarios antiguos.</p>
              )}
            </div>
          </div>
        </>
      )}
    </section>
  );
};
