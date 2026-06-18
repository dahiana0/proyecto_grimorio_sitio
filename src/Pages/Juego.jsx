import React, { useEffect, useState } from "react";
import "../Styles/juego.css";

export const Juego = () => {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [comments, setComments] = useState([]);

  useEffect(() => {
    const savedComments = window.localStorage.getItem("grimorio-comments");
    if (savedComments) {
      setComments(JSON.parse(savedComments));
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem("grimorio-comments", JSON.stringify(comments));
  }, [comments]);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!name.trim() || !message.trim()) return;

    const newComment = {
      id: Date.now(),
      name: name.trim(),
      message: message.trim(),
      createdAt: new Date().toISOString(),
    };

    setComments([newComment, ...comments]);
    setName("");
    setMessage("");
  };

  return (
    <section id="comentarios-page" className="comentarios-page">
      <div className="comentarios-container">
        <h1 className="comentarios-titulo">Sección de comentarios</h1>
        <p className="comentarios-descripcion">
          Comparte tu opinión sobre Grimorio y lee los comentarios de otros visitantes.
        </p>

        <form className="comentarios-form" onSubmit={handleSubmit}>
          <div className="form-field">
            <label htmlFor="name">Nombre</label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Tu nombre"
            />
          </div>

          <div className="form-field">
            <label htmlFor="message">Comentario</label>
            <textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Escribe tu comentario aquí"
            />
          </div>

          <button className="comentarios-boton" type="submit">
            Publicar comentario
          </button>
        </form>

        <div className="comentarios-lista">
          <h2 className="comentarios-lista-titulo">Comentarios recientes</h2>
          {comments.length === 0 ? (
            <p className="sin-comentarios">Aún no hay comentarios. Sé el primero en escribir.</p>
          ) : (
            comments.map((comment) => (
              <article key={comment.id} className="comentario-card">
                <div className="comentario-meta">
                  <strong>{comment.name}</strong>
                  <span>
                    {new Date(comment.createdAt).toLocaleString("es-ES", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
                <p>{comment.message}</p>
              </article>
            ))
          )}
        </div>
      </div>
    </section>
  );
};

