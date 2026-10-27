import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import PersonajeAnimado from "../Components/Personajeanimado";
import "../Styles/dashboard.css";

import LootieKarol from "../Components/LootieKarol";
import LotieCap2 from "../Components/LotieCap2";
import LotieCap3 from "../Components/LotieCap3";
import LotieCap4 from "../Components/LotieCap4";
import LotieCap5A from "../Components/LotieCap5A";


const IMG_AUTOR = "./autor-animado.svg";
const IMG_LIBRO_CERRADO = "./Cerrado.png";
const IMG_LIBRO_ABIERTO = "./Abierto .png";


const PDF_LIBRO = "./Horror en el museo - Lovecraft, H. P.pdf";


const ICONOS = {
  libro: null,
  personajes: null,
  autor: null,
  animaciones: null,
};

const RUTAS = {
  autor: "https://es.wikipedia.org/wiki/H._P._Lovecraft",
  personajes: "/personajes",
  animaciones: "/capitulos",
};


const PERSONAJES = [
  { nombre: "Stephen", imagen: "./stephen.jpeg", svg: "./stephen.svg", rig: "stephen" },
  { nombre: "Rogers", imagen: "./rogers.jpeg", svg: "./rogers (1).svg", rig: "rogers" },
  { nombre: "Orabona", imagen: "./orabona.png", svg: "./orabona.svg", rig: "orabona" },
  { nombre: "Cthulhu", imagen: "./monstruo.png", svg: "./cthulhu.svg", rig: "cthulhu" },
];


const ANIMACIONES = [
  { titulo: "Capítulo 1", subtitulo: "Umbral", Escena: LootieKarol, foco: { x: 0.5, y: 0.6 }, zoom: 1 },
  { titulo: "Capítulo 2", subtitulo: "Reliquias", Escena: LotieCap2, foco: { x: 0.5, y: 0.6 }, zoom: 1 },
  { titulo: "Capítulo 3", subtitulo: "Presagio", Escena: LotieCap3, foco: { x: 0.5, y: 0.6 }, zoom: 1 },
  { titulo: "Capítulo 4", subtitulo: "Ritual", Escena: LotieCap4, foco: { x: 0.5, y: 0.6 }, zoom: 1 },
  { titulo: "Capítulo 5", subtitulo: "", Escena: LotieCap5A, foco: { x: 0.5, y: 0.6 }, zoom: 1 },
];


const ESCENA_ANCHO = 1500;
const ESCENA_ALTO = 836;

const TEXTOS_AUTOR = [
  "Escritor estadounidense de terror y ciencia ficción. Su idea del horror cósmico: lo más aterrador es lo poco que entendemos del universo.",
  "Nació el 20 de agosto de 1890 en Providence, Rhode Island, y vivió casi toda su vida allí.",
  "Publicó sobre todo en revistas pulp como Weird Tales, con muy poco dinero a cambio.",
  "Creó el universo de Cthulhu y los Grandes Antiguos, que otros autores siguieron ampliando.",
  "Escribió miles de cartas a otros autores; muchas de sus ideas circularon así.",
  "Murió el 15 de marzo de 1937, casi sin reconocimiento en vida. Hoy es un referente del género.",
];


const IconoTitulo = ({ src, tipo }) => (
  <span className={`dash-icono dash-icono--${tipo}`} aria-hidden="true">
    <span className="dash-icono-halo" />
    {src ? <img src={src} alt="" /> : <span className="dash-icono-estrella">✧</span>}
  </span>
);


const Tarjeta = ({
  titulo,
  icono,
  tipo,
  desde = "left",
  delay = 0,
  inclina = 1,
  children,
  className = "",
}) => {
  const dir = desde === "left" ? 1 : -1;
  return (
    <motion.section
      className={`dash-card ${className}`}
      initial={{ opacity: 0, x: desde === "left" ? -50 : 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8, delay, ease: "easeOut" }}
      whileHover={{
        x: dir * 12,
        y: -3,
        rotate: dir * inclina * 0.8,
        scale: 1.015,
        transition: { type: "spring", stiffness: 220, damping: 16 },
      }}
    >
      <h2 className="dash-card-titulo">
        <IconoTitulo src={icono} tipo={tipo} />
        {titulo}
      </h2>
      {children}
    </motion.section>
  );
};


const LibroAnimado = () => {
  const [abierto, setAbierto] = useState(false);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rotX = useSpring(useTransform(my, [-0.5, 0.5], [12, -12]), { stiffness: 120, damping: 14 });
  const rotY = useSpring(useTransform(mx, [-0.5, 0.5], [-16, 16]), { stiffness: 120, damping: 14 });

  const mover = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  };

  return (
    <motion.button
      className="dash-libro"
      style={{ rotateX: rotX, rotateY: rotY }}
      onPointerMove={mover}
      onPointerEnter={() => setAbierto(true)}
      onPointerLeave={() => {
        mx.set(0);
        my.set(0);
        setAbierto(false);
      }}
      onClick={() => setAbierto((a) => !a)}
      aria-label="Libro: toca para abrir o cerrar"
      animate={{ y: [0, -8, 0] }}
      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
    >
      <motion.img
        src={IMG_LIBRO_CERRADO}
        alt=""
        className="dash-libro-img"
        animate={{ opacity: abierto ? 0 : 1, scale: abierto ? 0.9 : 1 }}
        transition={{ duration: 0.4 }}
      />
      <motion.img
        src={IMG_LIBRO_ABIERTO}
        alt=""
        className="dash-libro-img"
        animate={{ opacity: abierto ? 1 : 0, scale: abierto ? 1.1 : 0.9 }}
        transition={{ duration: 0.4 }}
      />
    </motion.button>
  );
};


const AutorInteractivo = () => {
  const navigate = useNavigate();
  const [i, setI] = useState(0);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const x = useSpring(useTransform(mx, [-0.5, 0.5], [-8, 8]), { stiffness: 120, damping: 14 });
  const y = useSpring(useTransform(my, [-0.5, 0.5], [-6, 6]), { stiffness: 120, damping: 14 });

  const mover = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  };

  return (
    <div className="dash-autor">
      <motion.button
        className="dash-autor-circulo"
        style={{ x, y }}
        onPointerMove={mover}
        onPointerLeave={() => {
          mx.set(0);
          my.set(0);
        }}
        onClick={() => setI((n) => (n + 1) % TEXTOS_AUTOR.length)}
        whileTap={{ scale: 0.94 }}
        aria-label="Autor: toca para ver otro dato"
      >
        {IMG_AUTOR ? (
          <img src={IMG_AUTOR} alt="H. P. Lovecraft" />
        ) : (
          <svg viewBox="0 0 120 150" role="img" aria-label="Silueta del autor">
            <circle cx="60" cy="52" r="24" fill="none" stroke="#1ad96d" strokeWidth="3" />
            <path d="M14 150 C16 108 38 92 60 92 C82 92 104 108 106 150 Z" fill="none" stroke="#1ad96d" strokeWidth="3" />
            <circle cx="51" cy="50" r="3" fill="#1ad96d" />
            <circle cx="69" cy="50" r="3" fill="#1ad96d" />
          </svg>
        )}
      </motion.button>

      <div className="dash-autor-texto">
        <p className="dash-autor-nombre">H. P. Lovecraft</p>
        <p className="dash-autor-anios">1890 – 1937 · Providence, EE. UU.</p>
        <AnimatePresence mode="wait">
          <motion.p
            key={i}
            className="dash-card-p"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
          >
            {TEXTOS_AUTOR[i]}
          </motion.p>
        </AnimatePresence>
        <button
          className="dash-link"
          onClick={() =>
            /^https?:\/\//.test(RUTAS.autor)
              ? window.open(RUTAS.autor, "_blank", "noopener")
              : navigate(RUTAS.autor)
          }
        >
          Leer más ➜
        </button>
      </div>
    </div>
  );
};


const Ojos = ({ cfg }) => {
  const caja = useRef(null);

  useEffect(() => {
    const mover = (e) => {
      if (!caja.current) return;
      caja.current.querySelectorAll(".dash-ojo").forEach((ojo) => {
        const r = ojo.getBoundingClientRect();
        const dx = e.clientX - (r.left + r.width / 2);
        const dy = e.clientY - (r.top + r.height / 2);
        const ang = Math.atan2(dy, dx);
        const d = Math.min(3, Math.hypot(dx, dy) / 40);
        ojo.firstChild.style.transform = `translate(${Math.cos(ang) * d}px, ${Math.sin(ang) * d}px)`;
      });
    };
    window.addEventListener("pointermove", mover);
    return () => window.removeEventListener("pointermove", mover);
  }, []);

  return (
    <div ref={caja} className="dash-ojos" aria-hidden="true">
      {[-1, 1].map((lado) => (
        <span
          key={lado}
          className="dash-ojo"
          style={{ left: `${cfg.x + (lado * cfg.sep) / 2}%`, top: `${cfg.y}%` }}
        >
          <i />
        </span>
      ))}
    </div>
  );
};


const PersonajeArte = ({ nombre }) => {
  const p = {
    fill: "rgba(26,217,109,.07)",
    stroke: "rgba(26,217,109,.65)",
    strokeWidth: 2,
    strokeLinejoin: "round",
    strokeLinecap: "round",
  };
  const hombros = "M8 130 C10 94 30 82 50 82 C70 82 90 94 92 130 Z";

  return (
    <svg viewBox="0 0 100 130" aria-hidden="true">
      {nombre === "Step" && (
        <>
          <path {...p} d={hombros} />
          <path {...p} d="M42 82 L50 96 L58 82" />
          <circle {...p} cx="50" cy="44" r="22" />
          <path {...p} d="M28 40 C28 20 44 14 56 17 C70 20 74 30 72 40 C66 32 52 28 28 40 Z" />
        </>
      )}

      {nombre === "Rogers" && (
        <>
          <path {...p} d={hombros} />
          <path {...p} d="M50 92 L37 85 L37 99 Z M50 92 L63 85 L63 99 Z" />
          <circle {...p} cx="50" cy="50" r="22" />
          <rect {...p} x="32" y="8" width="36" height="20" rx="2" />
          <path {...p} strokeWidth={3} d="M22 28 H78" />
          <path {...p} d="M36 59 C44 55 50 59 50 59 C50 59 56 55 64 59 C58 64 52 61 50 61 C48 61 42 64 36 59 Z" />
        </>
      )}

      {nombre === "Orabona" && (
        <>
          <path {...p} d="M16 130 C14 70 28 14 50 14 C72 14 86 70 84 130 Z" />
          <path {...p} d="M50 68 V130" />
          <ellipse cx="50" cy="46" rx="15" ry="19" fill="#020a07" stroke="rgba(26,217,109,.65)" strokeWidth="2" />
          <circle {...p} cx="50" cy="98" r="8" />
          <path {...p} d="M50 92 L53 101 L45 95 L55 95 L47 101 Z" />
        </>
      )}

      {nombre === "Cthulhu" && (
        <>
          <path {...p} d="M32 52 C6 30 2 72 14 102 C22 86 28 76 36 66 Z" />
          <path {...p} d="M68 52 C94 30 98 72 86 102 C78 86 72 76 64 66 Z" />
          <path {...p} d="M24 130 C26 100 38 90 50 90 C62 90 74 100 76 130" />
          <circle {...p} cx="50" cy="38" r="24" />
          {[36, 43, 50, 57, 64].map((x, k) => (
            <path
              key={x}
              {...p}
              fill="none"
              className="dash-tentaculo"
              style={{ animationDelay: `${k * 0.35}s` }}
              d={`M${x} 60 C${x - 6} 80 ${x + 6} 100 ${x} 124`}
            />
          ))}
        </>
      )}
    </svg>
  );
};

const EscenaMiniatura = ({ Escena, foco = { x: 0.5, y: 0.5 }, zoom = 1 }) => {
  const caja = useRef(null);
  const escena = useRef(null);
  const arte = useRef({ x: 0, y: 0, w: ESCENA_ANCHO, h: ESCENA_ALTO });
  const [m, setM] = useState({ k: 0, left: 0, top: 0 });

  useEffect(() => {
    const el = caja.current;
    if (!el) return;

    const clamp = (v, min, max) => Math.min(max, Math.max(min, v));

    const colocar = () => {
      const w = el.clientWidth;
      const h = el.clientHeight;
      if (!w || !h) return;
      const a = arte.current;
      const k = Math.max(w / a.w, h / a.h) * zoom;
      // El dibujo siempre cubre el panel: nunca quedan bordes vacíos
      const left = clamp(w / 2 - (a.x + foco.x * a.w) * k, w - (a.x + a.w) * k, -a.x * k);
      const top = clamp(h / 2 - (a.y + foco.y * a.h) * k, h - (a.y + a.h) * k, -a.y * k);
      setM({ k, left, top });
    };


    const medir = () => {
      const st = escena.current;
      if (st) {
        const sr = st.getBoundingClientRect();
        if (sr.width) {
          const esc = sr.width / ESCENA_ANCHO;
          let mejor = null;
          let area = 0;
          st.querySelectorAll("svg, canvas, img, video").forEach((n) => {
            const r = n.getBoundingClientRect();
            if (r.width * r.height > area) {
              area = r.width * r.height;
              mejor = r;
            }
          });
          if (mejor && mejor.width > 40 && mejor.height > 40) {
            arte.current = {
              x: (mejor.left - sr.left) / esc,
              y: (mejor.top - sr.top) / esc,
              w: mejor.width / esc,
              h: mejor.height / esc,
            };
          }
        }
      }
      colocar();
    };

    colocar();
    const ro = new ResizeObserver(medir);
    ro.observe(el);
    // Las animaciones tardan un momento en dibujarse: se vuelve a medir
    const t = [300, 900, 2000, 4000].map((ms) => setTimeout(medir, ms));
    return () => {
      ro.disconnect();
      t.forEach(clearTimeout);
    };
  }, [foco.x, foco.y, zoom]);

  return (
    <div className="dash-escena-caja" ref={caja} aria-hidden="true">
      {m.k > 0 && (
        <div className="dash-escena-zoom">
          <div
            className="dash-escena"
            ref={escena}
            style={{ transform: `scale(${m.k})`, left: m.left, top: m.top }}
          >
            <Escena />
          </div>
        </div>
      )}
    </div>
  );
};


const CintaAnimaciones = () => {
  const cinta = useRef(null);
  const [inicio, setInicio] = useState(0);
  const [visibles, setVisibles] = useState(3);
  const n = ANIMACIONES.length;


  useEffect(() => {
    const el = cinta.current;
    if (!el) return;
    const ajustar = () => setVisibles(el.clientWidth < 300 ? 2 : 3);
    ajustar();
    const ro = new ResizeObserver(ajustar);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const items = Array.from({ length: visibles }, (_, k) => (inicio + k) % n);

  return (
    <div className="dash-cinta-fila">
      <button className="dash-flecha" onClick={() => setInicio((v) => (v - 1 + n) % n)} aria-label="Anterior">
        ‹
      </button>

      <div className="dash-cinta" ref={cinta}>
        <div className="dash-cinta-items" style={{ gridTemplateColumns: `repeat(${visibles}, minmax(0, 1fr))` }}>
          <AnimatePresence mode="popLayout" initial={false}>
            {items.map((idx) => {
              const a = ANIMACIONES[idx];
              return (
                <motion.div
                  key={idx}
                  layout
                  className="dash-frame"
                  role="img"
                  aria-label={a.titulo}
                  initial={{ opacity: 0, x: 24 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -24 }}
                  transition={{ duration: 0.3 }}
                >
                  <EscenaMiniatura Escena={a.Escena} foco={a.foco} zoom={a.zoom} />
                  <span className="dash-frame-nombre">
                    <strong>
                      {a.titulo}
                      {a.subtitulo ? ` · ${a.subtitulo}` : ""}
                    </strong>
                  </span>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>

      <button className="dash-flecha" onClick={() => setInicio((v) => (v + 1) % n)} aria-label="Siguiente">
        ›
      </button>
    </div>
  );
};

export const InicioDashboard = () => {
  const navigate = useNavigate();
  const sonido = useRef(new Audio("./audios/sonidoboton.ogg"));


  useEffect(() => {
    const original = HTMLAudioElement.prototype.play;
    const boton = sonido.current;

    HTMLAudioElement.prototype.play = function () {
      if (this === boton) return original.apply(this, arguments);
      return Promise.resolve();
    };

    return () => {
      HTMLAudioElement.prototype.play = original;
    };
  }, []);

  const entrarAlMuseo = () => {
    sonido.current.currentTime = 0;
    sonido.current.play().catch(() => { });
    setTimeout(() => navigate("/guia"), 150);
  };

  const abrirPdf = () => window.open(PDF_LIBRO, "_blank", "noopener");

  return (
    <main className="dash">

      <Tarjeta
        titulo="El libro"
        icono={ICONOS.libro}
        tipo="libro"
        desde="left"
        delay={0.15}
        inclina={1}
        className="dash-a"
      >
        <div className="dash-libro-fila">
          <div className="dash-libro-caja">
            <LibroAnimado />
          </div>
          <div className="dash-libro-info">
            <h3 className="dash-libro-titulo">El horror en el museo</h3>
            <p className="dash-meta">H. P. Lovecraft &amp; Hazel Heald · 1933</p>
            <p className="dash-card-p">
              Un relato de terror sobre un museo de cera de Londres, famoso por
              sus figuras de criaturas monstruosas. Su dueño, Georges Rogers,
              presume de que sus piezas no son simples esculturas, y un
              visitante curioso acaba descubriendo el secreto que se esconde
              detrás de ellas, ligado a los mitos de Cthulhu.
            </p>
            <button className="dash-link" onClick={abrirPdf}>
              Leer más ➜
            </button>
          </div>
        </div>
      </Tarjeta>

      <Tarjeta
        titulo="Personajes"
        icono={ICONOS.personajes}
        tipo="personajes"
        desde="left"
        delay={0.3}
        inclina={-1}
        className="dash-b"
      >
        <div className="dash-pers">
          {PERSONAJES.map((p, k) => (
            <div key={p.nombre} className="dash-pers-item">
              <span className="dash-pers-img">
                {p.svg && p.rig ? (
                  <span className="dash-pers-animado">
                    <PersonajeAnimado
                      src={p.svg}
                      rig={p.rig}
                      nombre={p.nombre}
                      imagen={p.imagen}
                    />
                  </span>
                ) : p.img ? (
                  <>
                    <img src={p.img} alt={p.nombre} />
                    {p.ojos && <Ojos cfg={p.ojos} />}
                  </>
                ) : (
                  <span
                    className="dash-pers-lienzo"
                    style={{ animationDelay: `${k * 0.6}s` }}
                    role="img"
                    aria-label={`Vista previa de ${p.nombre}`}
                  >
                    <PersonajeArte nombre={p.nombre} />
                    <Ojos cfg={p.ojos} />
                  </span>
                )}
              </span>
              <span className="dash-pers-nombre">{p.nombre}</span>
            </div>
          ))}
        </div>
        <button className="dash-link" onClick={() => navigate(RUTAS.personajes)}>
          Conocerlos ➜
        </button>
      </Tarjeta>


      <motion.div
        className="dash-centro"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
      >
        <div className="dash-niebla" aria-hidden="true" />
        <h1 className="dash-titulo">Grimorio</h1>
        <p className="dash-sub">Una experiencia entre páginas</p>
        <p className="dash-texto">
          Un cómic interactivo basado en "El horror en el museo". Recorre el
          museo, conoce a sus personajes y descubre qué se esconde detrás de
          las figuras de cera.
        </p>
        <motion.button
          className="dash-portal"
          onClick={entrarAlMuseo}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.96 }}
        >
          <span className="dash-portal-anillo" aria-hidden="true">✧</span>
          Explorar museo
        </motion.button>
      </motion.div>


      <Tarjeta
        titulo="El autor"
        icono={ICONOS.autor}
        tipo="autor"
        desde="right"
        delay={0.15}
        inclina={-1}
        className="dash-c"
      >
        <AutorInteractivo />
      </Tarjeta>

      <Tarjeta
        titulo="Animaciones"
        icono={ICONOS.animaciones}
        tipo="animaciones"
        desde="right"
        delay={0.3}
        inclina={1}
        className="dash-d"
      >
        <CintaAnimaciones />
        <button className="dash-link" onClick={() => navigate(RUTAS.animaciones)}>
          Ver todas ➜
        </button>
      </Tarjeta>
    </main>
  );
};

export default InicioDashboard;