import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import Header from "../Components/Header"; // menú lateral
import "../Styles/testimonios.css";
import { getStoredComments } from "../utils/commentsStorage";

/* ==================================================================
   AJUSTA AQUÍ
================================================================== */
const DIAS_NUEVOS = 10; // un comentario es "nuevo" durante estos días

const RUTAS = {
  inicio: "/",
  hacerComentario: "/juego",
  nuevos: "/comentariosCompletos/nuevos",
  antiguos: "/comentariosCompletos/antiguos",
};

// ★ ICONO DEL BOTÓN "Haz tu comentario" ★
// Pon aquí la ruta de tu icono (svg, png...) que esté en la carpeta public.
// Mientras esté en null se ve una estrellita como marcador de posición.
const ICONO_CTA = null; // ej. "./iconos/comentar.svg"

/* ---------- utilidades ---------- */
// Número estable a partir del id: así cada ficha tiene SIEMPRE la misma
// inclinación y desfase (no cambian cada vez que se vuelve a dibujar).
const semilla = (id) => {
  const txt = String(id);
  let h = 2166136261;
  for (let i = 0; i < txt.length; i++) {
    h ^= txt.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
};

const formatoFecha = (iso) => {
  const f = new Date(iso);
  if (Number.isNaN(f.getTime())) return "";
  return f
    .toLocaleDateString("es-CO", { day: "2-digit", month: "short", year: "numeric" })
    .replace(/\./g, "");
};

const plural = (n, uno, varios) => `${n} ${n === 1 ? uno : varios}`;

/* ---------- Ficha: un comentario que se puede arrastrar ---------- */
const Ficha = ({ c, num, orden, tipo, limites, capa, reducir }) => {
  const [abierta, setAbierta] = useState(false);
  const [z, setZ] = useState(1);

  const s = semilla(c.id);
  const giro = ((s % 70) - 35) / 10; // -3.5° a 3.5°
  const desfase = ((s >> 5) % 4) * 14; // baja unas fichas más que otras
  const brillo = "rgba(26,217,109,.5)";

  return (
    <motion.article
      className={`tm-ficha tm-ficha--${tipo}${abierta ? " tm-ficha--abierta" : ""}`}
      style={{ marginTop: desfase, zIndex: z }}
      drag
      dragConstraints={limites}
      dragElastic={0.12}
      dragTransition={{ bounceStiffness: 260, bounceDamping: 22, power: 0.22 }}
      onDragStart={() => setZ(++capa.current)}
      onTap={() => {
        setZ(++capa.current);
        setAbierta((v) => !v);
      }}
      initial={reducir ? false : { opacity: 0, y: 34, rotate: giro + 7, scale: 0.95, filter: "blur(6px)" }}
      animate={{ opacity: 1, y: 0, rotate: giro, scale: 1, filter: "blur(0px)" }}
      transition={{ duration: 0.75, delay: reducir ? 0 : 0.45 + orden * 0.09, ease: [0.2, 0.8, 0.2, 1] }}
      whileHover={{ scale: 1.035, rotate: giro * 0.3 }}
      whileDrag={{
        scale: 1.07,
        rotate: 0,
        cursor: "grabbing",
        boxShadow: `0 20px 38px rgba(0,0,0,.65), 0 0 26px ${brillo}`,
      }}
    >
      <span className="tm-chincheta" aria-hidden="true" />
      <p className="tm-ficha-num">Ficha Nº {String(num).padStart(3, "0")}</p>
      <h3 className="tm-ficha-nombre">{c.name}</h3>
      <p className="tm-ficha-texto">{c.message}</p>
      <p className="tm-ficha-fecha">{formatoFecha(c.createdAt)}</p>
    </motion.article>
  );
};

/* ---------- Vitrina: la zona de nuevos o antiguos ---------- */
const Vitrina = ({ tipo, titulo, sub, ruta, items, numeros, retraso, reducir }) => {
  const navigate = useNavigate();
  const campo = useRef(null);
  const capa = useRef(1); // la última ficha tocada queda encima

  return (
    <motion.section
      className={`tm-vitrina tm-vitrina--${tipo}`}
      initial={reducir ? false : { opacity: 0, y: 40, filter: "blur(8px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{ duration: 0.9, delay: retraso, ease: [0.2, 0.8, 0.2, 1] }}
    >
      <header className="tm-vitrina-cab">
        <div>
          <h2 className="tm-vitrina-titulo">{titulo}</h2>
          <p className="tm-vitrina-sub">{sub}</p>
        </div>
        <span className="tm-contador" aria-label={plural(items.length, "comentario", "comentarios")}>
          {items.length}
        </span>
      </header>

      <div className="tm-campo" ref={campo}>
        {items.length === 0 ? (
          <div className="tm-vacio">
            <span className="tm-sigilo" aria-hidden="true">✧</span>
            <p>
              {tipo === "nuevos"
                ? "Todavía no hay testimonios recientes. Sé el primero en dejar el tuyo."
                : `Aquí se guardarán los testimonios con más de ${DIAS_NUEVOS} días.`}
            </p>
          </div>
        ) : (
          items.map((c, i) => (
            <Ficha
              key={c.id}
              c={c}
              num={numeros.get(c.id)}
              orden={i}
              tipo={tipo}
              limites={campo}
              capa={capa}
              reducir={reducir}
            />
          ))
        )}
      </div>

      <button className="tm-ver" onClick={() => navigate(ruta)}>
        Ver todos ➜
      </button>
    </motion.section>
  );
};

export const IntroJuego = () => {
  const navigate = useNavigate();
  const reducir = useReducedMotion();
  const [comments, setComments] = useState(() => getStoredComments());
  const [referenceTime] = useState(() => Date.now());

  useEffect(() => {
    const alActualizar = (event) => {
      if (Array.isArray(event.detail)) setComments(event.detail);
    };
    window.addEventListener("grimorio-comments-updated", alActualizar);
    return () => window.removeEventListener("grimorio-comments-updated", alActualizar);
  }, []);

  const { nuevos, antiguos, numeros } = useMemo(() => {
    const limite = DIAS_NUEVOS * 24 * 60 * 60 * 1000;
    const hora = (c) => new Date(c.createdAt).getTime();
    const lista = Array.isArray(comments) ? comments : [];

    // El número de ficha sigue el orden en que se escribieron
    const porFecha = [...lista].sort((a, b) => hora(a) - hora(b));
    const nums = new Map(porFecha.map((c, i) => [c.id, i + 1]));

    const recientes = lista
      .filter((c) => referenceTime - hora(c) <= limite)
      .sort((a, b) => hora(b) - hora(a));
    const viejos = lista
      .filter((c) => referenceTime - hora(c) > limite)
      .sort((a, b) => hora(b) - hora(a));

    return { nuevos: recientes, antiguos: viejos, numeros: nums };
  }, [comments, referenceTime]);

  const hayFichas = nuevos.length + antiguos.length > 0;

  return (
    <>
    <Header />
    <main className="tm-page">
      <header className="tm-cabecera">
        <motion.h1
          className="tm-titulo"
          initial={reducir ? false : { opacity: 0, y: 18, filter: "blur(10px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 1, delay: 0.15, ease: [0.2, 0.8, 0.2, 1] }}
        >
          Libro de visitas
        </motion.h1>

        <motion.p
          className="tm-texto"
          initial={reducir ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.55 }}
        >
          En el museo de Grimorio queremos leer tu opinión. Explora los testimonios de
          otros visitantes: cada ficha se puede mover y apilar a tu gusto.
        </motion.p>

        <motion.button
          className="tm-cta"
          onClick={() => navigate(RUTAS.hacerComentario)}
          initial={reducir ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.75 }}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.97 }}
        >
          <span className="tm-cta-anillo" aria-hidden="true">
            {ICONO_CTA ? <img src={ICONO_CTA} alt="" /> : "✧"}
          </span>
          Haz tu comentario
        </motion.button>

        {hayFichas && (
          <motion.p
            className="tm-pista"
            initial={reducir ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.6 }}
          >
            Arrastra las fichas · toca una para leerla completa
          </motion.p>
        )}
      </header>

      <section className="tm-tablero" aria-label="Comentarios de los visitantes">
        <Vitrina
          tipo="nuevos"
          titulo="Nuevos"
          sub={`Últimos ${DIAS_NUEVOS} días`}
          ruta={RUTAS.nuevos}
          items={nuevos}
          numeros={numeros}
          retraso={0.35}
          reducir={reducir}
        />
        <Vitrina
          tipo="antiguos"
          titulo="Antiguos"
          sub={`Más de ${DIAS_NUEVOS} días`}
          ruta={RUTAS.antiguos}
          items={antiguos}
          numeros={numeros}
          retraso={0.5}
          reducir={reducir}
        />
      </section>
    </main>
    </>
  );
};

export default IntroJuego;