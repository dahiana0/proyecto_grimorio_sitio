import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import Header from "../Components/Header"; // menú lateral
import "../Styles/testimonios.css";
import { getStoredComments, persistComments, subscribeToComments } from "../utils/commentsStorage";


const RUTAS = {
  volver: "/intro-juego",
  nuevos: "/comentariosCompletos/nuevos",
};

const NOMBRE_MAX = 40;
const MENSAJE_MAX = 500;


const ICONO_CTA = null;

const formatoFecha = (iso) => {
  const f = new Date(iso);
  if (Number.isNaN(f.getTime())) return "";
  return f
    .toLocaleDateString("es-CO", { day: "2-digit", month: "short", year: "numeric" })
    .replace(/\./g, "");
};

export const Juego = () => {
  const navigate = useNavigate();
  const reducir = useReducedMotion();

  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [publicado, setPublicado] = useState(false);
  const [comments, setComments] = useState(() => getStoredComments());

  useEffect(() => {
    const unsubscribe = subscribeToComments((nextComments) => {
      setComments(Array.isArray(nextComments) ? nextComments : []);
    });
    return unsubscribe;
  }, []);

  const puedeEnviar = name.trim().length > 0 && message.trim().length > 0;
  const numeroFicha = (Array.isArray(comments) ? comments.length : 0) + 1;

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!puedeEnviar) return;

    const newComment = {
      id: Date.now(),
      name: name.trim(),
      message: message.trim(),
      createdAt: new Date().toISOString(),
    };

    setComments((currentComments) => {
      const nextComments = [...currentComments, newComment];
      persistComments(nextComments);
      return nextComments;
    });

    setName("");
    setMessage("");
    setPublicado(true);
  };

  const handleBackToIntro = (event) => {
    event?.preventDefault();

    if (window.history.state && window.history.state.idx > 0) {
      navigate(-1);
      return;
    }

    navigate(RUTAS.volver, { replace: true });
  };

  const alEscribir = (setter) => (e) => {
    setter(e.target.value);
    if (publicado) setPublicado(false);
  };

  return (
    <>
      <Header />
      <main className="tm-page">
        <div className="tm-barra">
          <button type="button" className="tm-volver" onClick={handleBackToIntro} title="Volver a comentarios">
            <span className="tm-volver-flecha" aria-hidden="true">←</span>
            Volver
          </button>
        </div>

        <header className="tm-cabecera">
          <motion.h1
            className="tm-titulo tm-titulo--largo"
            initial={reducir ? false : { opacity: 0, y: 18, filter: "blur(10px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 1, delay: 0.15, ease: [0.2, 0.8, 0.2, 1] }}
          >
            Deja tu huella
          </motion.h1>

          <motion.p
            className="tm-texto"
            style={{ marginTop: 18, marginBottom: 0 }}
            initial={reducir ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.45 }}
          >
            Comparte tu opinión sobre Grimorio. Tu comentario se convertirá en una ficha
            del libro de visitas que otros visitantes podrán leer.
          </motion.p>
        </header>

        <motion.section
          className="tm-vitrina tm-formulario"
          style={{ maxWidth: 1040, margin: "0 auto" }}
          initial={reducir ? false : { opacity: 0, y: 40, filter: "blur(8px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.9, delay: 0.3, ease: [0.2, 0.8, 0.2, 1] }}
          aria-label="Formulario de comentario"
        >

          <form className="tm-form" onSubmit={handleSubmit}>
            <div className="tm-campo-form">
              <label htmlFor="name">Nombre</label>
              <input
                id="name"
                type="text"
                value={name}
                maxLength={NOMBRE_MAX}
                onChange={alEscribir(setName)}
                placeholder="Tu nombre"
                autoComplete="name"
              />
              <span className="tm-car">
                {name.length}/{NOMBRE_MAX}
              </span>
            </div>

            <div className="tm-campo-form">
              <label htmlFor="message">Comentario</label>
              <textarea
                id="message"
                value={message}
                maxLength={MENSAJE_MAX}
                onChange={alEscribir(setMessage)}
                placeholder="Escribe tu comentario aquí"
              />
              <span className="tm-car">
                {message.length}/{MENSAJE_MAX}
              </span>
            </div>

            <button type="submit" className="tm-cta" disabled={!puedeEnviar}>
              <span className="tm-cta-anillo" aria-hidden="true">
                {ICONO_CTA ? <img src={ICONO_CTA} alt="" /> : "✧"}
              </span>
              Publicar comentario
            </button>

            {publicado && (
              <p className="tm-exito" role="status">
                ✧ ¡Tu comentario quedó pegado en el libro de visitas!
                <button type="button" className="tm-ver" onClick={() => navigate(RUTAS.nuevos)}>
                  Ver comentarios ➜
                </button>
              </p>
            )}
          </form>


          <aside className="tm-previa" aria-label="Vista previa de tu ficha">
            <p className="tm-previa-titulo">Así se verá tu ficha</p>

            <article className="tm-ficha tm-ficha--previa">
              <span className="tm-chincheta" aria-hidden="true" />
              <p className="tm-ficha-num">Ficha Nº {String(numeroFicha).padStart(3, "0")}</p>
              <h3 className={`tm-ficha-nombre${name.trim() ? "" : " tm-vacia"}`}>
                {name.trim() || "Tu nombre"}
              </h3>
              <p className={`tm-ficha-texto${message.trim() ? "" : " tm-vacia"}`}>
                {message.trim() || "Aquí aparecerá tu comentario…"}
              </p>
              <p className="tm-ficha-fecha">{formatoFecha(new Date().toISOString())}</p>
            </article>
          </aside>
        </motion.section>
      </main>
    </>
  );
};

export default Juego;