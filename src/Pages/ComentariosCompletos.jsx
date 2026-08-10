import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../Styles/juego.css";
import { getStoredComments, persistComments, subscribeToComments } from "../utils/commentsStorage";

export const ComentariosCompletos = () => {
  const navigate = useNavigate();
  const { tipo } = useParams();
  const [comments, setComments] = useState([]);
  const [commentsLoaded, setCommentsLoaded] = useState(false);
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editText, setEditText] = useState("");

  useEffect(() => {
    setComments(getStoredComments());
    setCommentsLoaded(true);

    const unsubscribe = subscribeToComments((nextComments) => {
      setComments(nextComments);
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    if (!commentsLoaded) return;
    persistComments(comments);
  }, [comments, commentsLoaded]);

  const tenDaysMs = 10 * 24 * 60 * 60 * 1000;
  const now = Date.now();

  const comentariosRecientes = comments
    .filter((comment) => now - new Date(comment.createdAt).getTime() <= tenDaysMs)
    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

  const comentariosAntiguos = comments
    .filter((comment) => now - new Date(comment.createdAt).getTime() > tenDaysMs)
    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

  const mostrarNuevos = tipo === "nuevos";
  const mostrarAntiguos = tipo === "antiguos";

  const tituloPagina = mostrarNuevos
    ? "Nuevos comentarios"
    : mostrarAntiguos
    ? "Comentarios antiguos"
    : "Comentarios";

  const descripcionPagina = mostrarNuevos
    ? "Mira sólo los comentarios recientes de los últimos 10 días."
    : mostrarAntiguos
    ? "Mira sólo los comentarios que tienen más de 10 días."
    : "Revisa todas las opiniones de los visitantes y navega entre comentarios nuevos y antiguos del museo Grimorio.";

  const handleDeleteComment = (commentId) => {
    setComments((currentComments) =>
      currentComments.filter((comment) => comment.id !== commentId)
    );
  };

  const startEditing = (comment) => {
    setEditingCommentId(comment.id);
    setEditText(comment.message);
  };

  const cancelEditing = () => {
    setEditingCommentId(null);
    setEditText("");
  };

  const saveEditedComment = (commentId) => {
    if (!editText.trim()) return;

    setComments((currentComments) =>
      currentComments.map((comment) =>
        comment.id === commentId
          ? {
              ...comment,
              message: editText.trim(),
              createdAt: new Date().toISOString(),
            }
          : comment
      )
    );

    setEditingCommentId(null);
    setEditText("");
  };

  const resendComment = (commentId) => {
    setComments((currentComments) =>
      currentComments.map((comment) =>
        comment.id === commentId
          ? {
              ...comment,
              createdAt: new Date().toISOString(),
            }
          : comment
      )
    );
  };

  const renderCommentCard = (comment) => (
    <div key={comment.id} className="comentario-item">
      <div className="comentario-header">
        <strong>{comment.name}</strong>
        <div className="comentario-actions">
          <button
            type="button"
            className="comentario-accion"
            onClick={() => startEditing(comment)}
          >
            Editar
          </button>
          <button
            type="button"
            className="comentario-eliminar"
            onClick={() => handleDeleteComment(comment.id)}
          >
            Borrar
          </button>
        </div>
      </div>

      {editingCommentId === comment.id ? (
        <div className="comentario-editar">
          <textarea
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            placeholder="Edita tu comentario"
          />
          <div className="comentario-editar-actions">
            <button type="button" className="comentario-accion" onClick={() => saveEditedComment(comment.id)}>
              Guardar
            </button>
            <button type="button" className="comentario-accion" onClick={cancelEditing}>
              Cancelar
            </button>
          </div>
        </div>
      ) : (
        <>
          <p>{comment.message}</p>
          <small>{new Date(comment.createdAt).toLocaleString()}</small>
        </>
      )}
    </div>
  );

  const comentarioBienvenida = {
    id: "bienvenida-comentarios",
    name: "¡Bienvenido(a) a este espacio llamado Grimorio",
    message:
      "Nos alegra que hayas decidido dejar tu huella en Grimorio. Este proyecto interactivo cobra vida gracias a cada persona que comparte sus ideas, opiniones y experiencias. Este es el primer comentario de una comunidad que esperamos siga creciendo. Te invitamos a participar con respeto, curiosidad y creatividad. Cada mensaje, reflexión o sugerencia nos ayuda a mejorar y a construir una experiencia aún más envolvente para todos. Gracias por ser parte de Grimorio. ¡Que este sea el comienzo de muchas conversaciones memorables!",
    createdAt: new Date().toISOString(),
  };

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

      <div className="contenedor contenedor-comentarios-completos">
        <h1 className="comentarios-titulo">{tituloPagina}</h1>
        <p className="comentarios-descripcion">{descripcionPagina}</p>

        {mostrarNuevos && (
          <div className="comentarios-lista">
            <div className="comentarios-lista-titulo">Nuevos comentarios</div>
            <div className="comentarios-container">
              <div className="comentario-item comentario-item-pinned">
                <div className="comentario-header">
                  <strong>{comentarioBienvenida.name}</strong>
                  <span className="comentario-ancla">Anclado</span>
                </div>
                <p>{comentarioBienvenida.message}</p>
                <small>Mensaje de bienvenida</small>
              </div>

              {comentariosRecientes.length > 0 ? (
                comentariosRecientes.map((comment) => renderCommentCard(comment))
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
              <div className="comentario-item comentario-item-pinned">
                <div className="comentario-header">
                  <strong>{comentarioBienvenida.name}</strong>
                  <span className="comentario-ancla">Anclado</span>
                </div>
                <p>{comentarioBienvenida.message}</p>
                <small>Mensaje de bienvenida</small>
              </div>

              {comentariosAntiguos.length > 0 ? (
                comentariosAntiguos.map((comment) => renderCommentCard(comment))
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
                <div className="comentario-item comentario-item-pinned">
                  <div className="comentario-header">
                    <strong>{comentarioBienvenida.name}</strong>
                    <span className="comentario-ancla">Anclado</span>
                  </div>
                  <p>{comentarioBienvenida.message}</p>
                  <small>Mensaje de bienvenida</small>
                </div>

                {comentariosRecientes.length > 0 ? (
                  comentariosRecientes.map((comment) => renderCommentCard(comment))
                ) : (
                  <p>No hay comentarios nuevos todavía.</p>
                )}
              </div>
            </div>

            <div className="comentarios-lista">
              <div className="comentarios-lista-titulo">Comentarios antiguos</div>
              <div className="comentarios-container">
                <div className="comentario-item comentario-item-pinned">
                  <div className="comentario-header">
                    <strong>{comentarioBienvenida.name}</strong>
                    <span className="comentario-ancla">Anclado</span>
                  </div>
                  <p>{comentarioBienvenida.message}</p>
                  <small>Mensaje de bienvenida</small>
                </div>

                {comentariosAntiguos.length > 0 ? (
                  comentariosAntiguos.map((comment) => renderCommentCard(comment))
                ) : (
                  <p>No hay comentarios antiguos.</p>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  );
};
