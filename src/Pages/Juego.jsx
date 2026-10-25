import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Header from "../Components/Header"; // menú lateral
import "../Styles/testimonios.css";
import { getStoredComments, persistComments, subscribeToComments } from "../utils/commentsStorage";

// ★ ICONO DEL BOTÓN "Publicar comentario" ★
// Pon aquí la ruta de tu icono (svg, png...) que esté en la carpeta public.
// Mientras esté en null se ve una estrellita como marcador de posición.
const ICONO_CTA = null; // ej. "./iconos/publicar.svg"

const MAX_NOMBRE = 40;
const MAX_MENSAJE = 600;

const formatoFecha = (fecha) =>
  fecha
    .toLocaleDateString("es-CO", { day: "2-digit", month: "short", year: "numeric" })
    .replace(/\./g, "");

export const Juego = () => {
  const navigate = useNavigate();
  const reducir = useReducedMotion();
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [comments, setComments] = useState(() => getStoredComments());
  const [enviado, setEnviado] = useState(false);
  const temporizador = useRef(null);

  useEffect(() => {
    const unsubscribe = subscribeToComments((nextComments) => {
      setComments(Array.isArray(nextComments) ? nextComments : []);
    });
    return unsubscribe;
  }, []);

  useEffect(() => () => clearTimeout(temporizador.current), []);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!name.trim() || !message.trim()) return;

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

    // Aviso de que la ficha ya quedó en el libro
    setEnviado(true);
    clearTimeout(temporizador.current);
    temporizador.current = setTimeout(() => setEnviado(false), 6000);
  };

  const handleBackToIntro = (event) => {
    event?.preventDefault();
    event?.stopPropagation();

    try {
      if (window.history.length > 1) {
        window.history.back();
        return;
      }
    } catch (error) {
      console.error("No se pudo volver con el historial del navegador", error);
    }

    navigate("/intro-juego", { replace: true });
  };

  const puedePublicar = name.trim() && message.trim();
  const numeroFicha = comments.length + 1;

  return (
    <>
      <Header />
      <main className="tm-page">
        <div className="tm-barra">
          <button type="button" className="tm-volver" onClick={handleBackToIntro} title="Volver">
            <span className="tm-volver-flecha" aria-hidden="true">←</span>
            Volver
          </button>
        </div>

        <header className="tm-cabecera">
          <motion.h1
            className="tm-titulo"
            initial={reducir ? false : { opacity: 0, y: 18, filter: "blur(10px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 1, delay: 0.15, ease: [0.2, 0.8, 0.2, 1] }}
          >
            Deja tu huella
          </motion.h1>

          <motion.p
            className="tm-texto"
            initial={reducir ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Comparte tu opinión sobre Grimorio. Tu comentario se guardará como una ficha
            en el libro de visitas, junto a la de los demás visitantes.
          </motion.p>
        </header>

        <section className="tm-formulario">
          <motion.div
            className="tm-vitrina"
            initial={reducir ? false : { opacity: 0, y: 40, filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.9, delay: 0.35, ease: [0.2, 0.8, 0.2, 1] }}
          >
            <form className="tm-form" onSubmit={handleSubmit}>
              <div className="tm-campo-form">
                <label htmlFor="name">Nombre</label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  maxLength={MAX_NOMBRE}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Tu nombre"
                  autoComplete="name"
                />
              </div>

              <div className="tm-campo-form">
                <label htmlFor="message">Comentario</label>
                <textarea
                  id="message"
                  value={message}
                  maxLength={MAX_MENSAJE}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Escribe tu comentario aquí"
                />
                <span className="tm-car">
                  {message.length} / {MAX_MENSAJE}
                </span>
              </div>

              <motion.button
                className="tm-cta"
                type="submit"
                disabled={!puedePublicar}
                whileHover={puedePublicar ? { scale: 1.04 } : undefined}
                whileTap={puedePublicar ? { scale: 0.97 } : undefined}
              >
                <span className="tm-cta-anillo" aria-hidden="true">
                  {ICONO_CTA ? <img src={ICONO_CTA} alt="" /> : "✧"}
                </span>
                Publicar comentario
              </motion.button>

              <AnimatePresence>
                {enviado && (
                  <motion.p
                    className="tm-exito"
                    role="status"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4 }}
                  >
                    Tu ficha ya está en el libro de visitas.
                    <button type="button" className="tm-ver" onClick={() => navigate("/intro-juego")}>
                      Verla ➜
                    </button>
                  </motion.p>
                )}
              </AnimatePresence>
            </form>
          </motion.div>

          {/* Vista previa: cómo se verá la ficha */}
          <motion.aside
            className="tm-previa"
            aria-label="Vista previa de tu ficha"
            initial={reducir ? false : { opacity: 0, y: 30, rotate: 4, filter: "blur(6px)" }}
            animate={{ opacity: 1, y: 0, rotate: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.9, delay: 0.6, ease: [0.2, 0.8, 0.2, 1] }}
          >
            <p className="tm-previa-titulo">Así se verá tu ficha</p>
            <article className="tm-ficha tm-ficha--nuevos tm-ficha--previa">
              <span className="tm-chincheta" aria-hidden="true" />
              <p className="tm-ficha-num">Ficha Nº {String(numeroFicha).padStart(3, "0")}</p>
              <h3 className="tm-ficha-nombre">
                {name.trim() || <span className="tm-vacia">Tu nombre</span>}
              </h3>
              <p className="tm-ficha-texto">
                {message.trim() || <span className="tm-vacia">Aquí aparecerá tu comentario…</span>}
              </p>
              <p className="tm-ficha-fecha">{formatoFecha(new Date())}</p>
            </article>
          </motion.aside>
        </section>
      </main>
    </>
  );
};

export default Juego;