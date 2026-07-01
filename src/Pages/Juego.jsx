import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../Styles/juego.css";

export const Juego = () => {
  const navigate = useNavigate();
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
      <button
        onClick={() => navigate("/intro-juego")}
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
          display: "inline-flex",
          width: "fit-content",
          whiteSpace: "nowrap",
        }}
      >
        ← VOLVER
      </button>

      <h1 className="comentarios-titulo">Sección de comentarios</h1>
      <p className="comentarios-descripcion">
        Comparte tu opinión sobre Grimorio y lee los comentarios de otros
        visitantes.
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
    </section>
  );
};

