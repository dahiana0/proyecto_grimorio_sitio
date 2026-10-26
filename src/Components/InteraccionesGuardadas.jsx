import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  AnimatePresence,
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
} from "framer-motion";
import LottieModule from "lottie-react";

import tablero from "../assets/tablero.json";
import calavera from "../assets/calavera.json";
import step from "../assets/step1.json";
import libroMesa from "../assets/libro mesa.json";
import libroCae from "../assets/libro cae.json";
import edificio from "../assets/edificio.json";
import rejas from "../assets/rejas.json";
import estatua1 from "../assets/estatua1.json";
import estatua3 from "../assets/estatua3.json";
import estatua4 from "../assets/estatua4.json";
import estatua5 from "../assets/estatua5.json";
import estatua6 from "../assets/estatua6.json";
import rata from "../assets/rata.json";
import moustro1 from "../assets/moustro1.json";
import moustro2 from "../assets/moustro2.json";
import moustro3 from "../assets/moustro3.json";
import moustro4 from "../assets/moustro4.json";

// Escenas reales de cada capítulo (las mismas del inicio)
import LootieKarol from "../Components/LootieKarol";
import LotieCap2 from "../Components/LotieCap2";
import LotieCap3 from "../Components/LotieCap3";
import LotieCap4 from "../Components/LotieCap4";
import LotieCap5A from "../Components/LotieCap5A";

import Header from "../Components/Header"; // <- ajusta la ruta si es distinta

import "../Styles/archivoMuro.css";
import "../Styles/css.css";

const Lottie = LottieModule.default;

// Registro de animaciones Lottie (tipo "lottie")
const animaciones = {
  tablero,
  calavera,
  step,
  libro: libroMesa,
  libroC: libroCae,
  edificio,
  rejas,
  estatua1,
  estatua3,
  estatua4,
  estatua5,
  estatua6,
  rata,
  moustro1,
  moustro2,
  moustro3,
  moustro4,
};

/* ==================================================================
   AJUSTA AQUÍ
================================================================== */
const capitulos = [
  { numero: 1, titulo: "Capítulo 1", subtitulo: "Umbral", ruta: "/cap-uno", Escena: LootieKarol, foco: { x: 0.5, y: 0.6 }, zoom: 1 },
  { numero: 2, titulo: "Capítulo 2", subtitulo: "Reliquias", ruta: "/cap-dos", Escena: LotieCap2, foco: { x: 0.5, y: 0.6 }, zoom: 1 },
  { numero: 3, titulo: "Capítulo 3", subtitulo: "Presagio", ruta: "/cap-tres", Escena: LotieCap3, foco: { x: 0.5, y: 0.6 }, zoom: 1 },
  { numero: 4, titulo: "Capítulo 4", subtitulo: "Ritual", ruta: "/cap-cuatro", Escena: LotieCap4, foco: { x: 0.5, y: 0.6 }, zoom: 1 },
  { numero: 5, titulo: "Capítulo 5", subtitulo: "", ruta: "/cap-cinco", Escena: LotieCap5A, foco: { x: 0.5, y: 0.6 }, zoom: 1 },
];

// Posición "esparcida" de cada carta: altura (dy), inclinación (rot), flote
const DISPOSICION = [
  { dy: 10, rot: -3, delay: -1, dur: 6 },
  { dy: 70, rot: 2.5, delay: -3, dur: 7 },
  { dy: -10, rot: -2, delay: -5, dur: 5.5 },
  { dy: 60, rot: 3, delay: -2, dur: 6.5 },
  { dy: 20, rot: -2.5, delay: -4, dur: 7.5 },
];

const RUTA_COMIC = "/visor-1";

const ESCENA_ANCHO = 1500;
const ESCENA_ALTO = 836;
const EASE = [0.2, 0.9, 0.25, 1];

/* ---------- Texto que entra letra por letra ---------- */
const Letras = ({ texto, retraso = 0, paso = 0.035, className = "" }) => {
  const reducir = useReducedMotion();
  let n = 0;
  return (
    <span className={className} aria-label={texto}>
      {texto.split(" ").map((palabra, i, arr) => (
        <span key={i} aria-hidden="true">
          <span className="arq-palabra">
            {palabra.split("").map((l, j) => (
              <motion.span
                key={j}
                className="arq-letra"
                initial={reducir ? false : { opacity: 0, y: 28, rotateX: -80 }}
                animate={{ opacity: 1, y: 0, rotateX: 0 }}
                transition={{ delay: retraso + n++ * paso, duration: 0.6, ease: EASE }}
              >
                {l}
              </motion.span>
            ))}
          </span>
          {i < arr.length - 1 && " "}
        </span>
      ))}
    </span>
  );
};

/* ---------- Número que cuenta hasta su valor ---------- */
const Numero = ({ valor }) => {
  const mv = useMotionValue(0);
  const [txt, setTxt] = useState(0);

  useEffect(() => {
    const ctl = animate(mv, valor, { duration: 0.9, ease: "easeOut" });
    const off = mv.on("change", (v) => setTxt(Math.round(v)));
    return () => {
      ctl.stop();
      off();
    };
  }, [valor, mv]);

  return <>{txt}</>;
};

/* ---------- Arte de una ficha según su tipo ---------- */
const FichaArte = ({ item }) => {
  const tipo = item.tipo ?? "lottie"; // las guardadas antes no tienen tipo

  if (tipo === "video" && item.src) {
    return (
      <video
        className="arq-fichaMedia"
        src={item.src}
        autoPlay
        loop
        muted
        playsInline
      />
    );
  }

  if (tipo === "css" && item.src) {
    return (
      <img
        className={`arq-fichaMedia arq-css-${item.imagen}`}
        src={item.src}
        alt={item.nombre}
      />
    );
  }

  return animaciones[item.imagen] ? (
    <Lottie
      animationData={animaciones[item.imagen]}
      autoplay
      loop
      style={{ width: "100%", height: "100%" }}
    />
  ) : null;
};

/* ---------- Miniatura: la escena real ajustada para llenar toda la carta ---------- */
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
      const left = clamp(w / 2 - (a.x + foco.x * a.w) * k, w - (a.x + a.w) * k, -a.x * k);
      const top = clamp(h / 2 - (a.y + foco.y * a.h) * k, h - (a.y + a.h) * k, -a.y * k);
      setM({ k, left, top });
    };

    // Zona REAL del dibujo: un svg de Lottie es más grande que su dibujo
    const zonaDibujo = (n) => {
      const r = n.getBoundingClientRect();
      if (n instanceof SVGSVGElement && n.viewBox && n.viewBox.baseVal.width) {
        const vb = n.viewBox.baseVal;
        const f = Math.min(r.width / vb.width, r.height / vb.height);
        const w = vb.width * f;
        const h = vb.height * f;
        return { left: r.left + (r.width - w) / 2, top: r.top + (r.height - h) / 2, width: w, height: h };
      }
      return r;
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
            const r = zonaDibujo(n);
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
    const t = [300, 900, 2000, 4000].map((ms) => setTimeout(medir, ms));

    let pendiente;
    const mo = new MutationObserver(() => {
      clearTimeout(pendiente);
      pendiente = setTimeout(medir, 150);
    });
    mo.observe(el, { childList: true, subtree: true });

    return () => {
      ro.disconnect();
      mo.disconnect();
      clearTimeout(pendiente);
      t.forEach(clearTimeout);
    };
  }, [foco.x, foco.y, zoom]);

  return (
    <div className="arq-escenaCaja" ref={caja} aria-hidden="true">
      {m.k > 0 && (
        <div className="arq-escenaZoom">
          <div
            className="arq-escenaVista"
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

/* ==================================================================
   PÁGINA
================================================================== */
const InteraccionesGuardadas = () => {
  const navigate = useNavigate();
  const muroRef = useRef(null);
  const arrastrando = useRef(false);
  const contadorZ = useRef(1);
  const ultimo = useRef(1);

  const [interacciones, setInteracciones] = useState([]);
  const [capituloActivo, setCapituloActivo] = useState(null);
  const [origen, setOrigen] = useState({ dx: 0, dy: 0 });
  const [confirmando, setConfirmando] = useState(false);
  const [z, setZ] = useState({});

  useEffect(() => {
    const cargar = () => {
      const datos = localStorage.getItem("grimorio");
      setInteracciones(
        datos
          ? JSON.parse(datos).map((item) => ({ ...item, capitulo: item.capitulo ?? 1 }))
          : []
      );
    };
    cargar();
    window.addEventListener("grimorioActualizado", cargar);
    return () => window.removeEventListener("grimorioActualizado", cargar);
  }, []);

  // Las escenas traen efectos de sonido: aquí no deben sonar
  useEffect(() => {
    const original = HTMLAudioElement.prototype.play;
    HTMLAudioElement.prototype.play = function () {
      // El clic del menú (Header) sí suena; los efectos de las escenas no
      if (this.src && this.src.includes("sonidoboton")) {
        return original.apply(this, arguments);
      }
      return Promise.resolve();
    };
    return () => {
      HTMLAudioElement.prototype.play = original;
    };
  }, []);

  // Escape cierra primero la confirmación y luego el panel
  useEffect(() => {
    if (!capituloActivo && !confirmando) return;
    const alTeclear = (e) => {
      if (e.key !== "Escape") return;
      if (confirmando) setConfirmando(false);
      else setCapituloActivo(null);
    };
    window.addEventListener("keydown", alTeclear);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", alTeclear);
      document.body.style.overflow = "";
    };
  }, [capituloActivo, confirmando]);

  const guardarLista = (lista) => {
    setInteracciones(lista);
    localStorage.setItem("grimorio", JSON.stringify(lista));
  };

  const eliminarInteraccion = (id, capitulo) =>
    guardarLista(
      interacciones.filter((i) => !(i.id === id && i.capitulo === capitulo))
    );

  const confirmarBorrado = () => {
    if (capituloActivo) {
      guardarLista(interacciones.filter((i) => i.capitulo !== capituloActivo));
    } else {
      localStorage.removeItem("grimorio");
      setInteracciones([]);
    }
    setConfirmando(false);
  };

  const obtenerFecha = (fecha) =>
    fecha
      ? new Date(fecha).toLocaleDateString("es-CO", {
          day: "numeric",
          month: "long",
          year: "numeric",
        })
      : "";

  const contarPorCapitulo = (n) => interacciones.filter((i) => i.capitulo === n).length;

  const traerAlFrente = (idx) => {
    contadorZ.current += 1;
    setZ((prev) => ({ ...prev, [idx]: contadorZ.current }));
  };

  // El panel nace desde la carta que tocaste
  const abrirCapitulo = (el, numero) => {
    const r = el.getBoundingClientRect();
    setOrigen({
      dx: r.left + r.width / 2 - window.innerWidth / 2,
      dy: r.top + r.height / 2 - window.innerHeight / 2,
    });
    setCapituloActivo(numero);
  };

  if (capituloActivo) ultimo.current = capituloActivo;
  const capData = capitulos.find((c) => c.numero === (capituloActivo ?? ultimo.current));
  const visibles = interacciones.filter((i) => i.capitulo === capData.numero);
  const conHallazgos = capitulos.filter((c) => contarPorCapitulo(c.numero) > 0).length;
  const ultima = [...interacciones].sort(
    (x, y) => new Date(y.fecha) - new Date(x.fecha)
  )[0];
  const aBorrar = capituloActivo ? visibles.length : interacciones.length;

  return (
    <main className="arq-arch">
      <Header />

      <div className="arq-archContenido">
        {/* ---------- Encabezado centrado ---------- */}
        <header className="arq-archHead">
          <h1 className="arq-archTitulo">
            <Letras texto="Interacciones guardadas" retraso={0.2} />
          </h1>

          <motion.p
            className="arq-archSub"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.6, ease: EASE }}
          >
            Cada capítulo del Grimorio guarda lo que vas descubriendo. Muévelos,
            apílalos y abre el que quieras revisar.
          </motion.p>

          <motion.button
            className="arq-portal"
            onClick={() => navigate(RUTA_COMIC)}
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.4, duration: 0.6, ease: EASE }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.96 }}
          >
            <span className="arq-portalAnillo" aria-hidden="true">✧</span>
            Volver al cómic
          </motion.button>

          <motion.p
            className="arq-archHint"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.7, duration: 0.6 }}
          >
            Arrastra las cartas · Toca una para abrir su archivo
          </motion.p>
        </header>

        {/* ---------- Resumen ---------- */}
        <div className="arq-stats">
          {[
            { etiqueta: "Guardadas", valor: <Numero valor={interacciones.length} /> },
            { etiqueta: "Capítulos con hallazgos", valor: `${conHallazgos} / ${capitulos.length}` },
            { etiqueta: "Último hallazgo", valor: ultima ? ultima.nombre : "Aún ninguno", texto: true },
          ].map((st, i) => (
            <motion.div
              key={st.etiqueta}
              className="arq-stat"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 + i * 0.12, duration: 0.6, ease: EASE }}
            >
              <span className="arq-meta">{st.etiqueta}</span>
              <strong className={st.texto ? "arq-statTexto" : ""}>{st.valor}</strong>
            </motion.div>
          ))}
        </div>

        {/* ---------- Escenario con las cartas ---------- */}
        <motion.section
          className="arq-escenario"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8, ease: EASE }}
        >
          <div className="arq-escenarioCabeza">
            <div>
              <h2 className="arq-escenarioTitulo">Capítulos</h2>
              <span className="arq-meta">Tus archivos por capítulo</span>
            </div>
            <span className="arq-insignia">{capitulos.length}</span>
          </div>

          <div className="arq-muro" ref={muroRef}>
            <div className="arq-muroInterno">
              {capitulos.map((cap, idx) => {
                const d = DISPOSICION[idx];
                const total = contarPorCapitulo(cap.numero);

                return (
                  <div
                    key={cap.numero}
                    className="arq-celda"
                    style={{
                      "--dy": `${d.dy}px`,
                      "--delay": `${d.delay}s`,
                      "--dur": `${d.dur}s`,
                      zIndex: z[idx] || 1,
                    }}
                  >
                    <div className="arq-flota">
                      <motion.figure
                        className={`arq-cartaFigura ${total > 0 ? "arq-conContenido" : ""}`}
                        role="button"
                        tabIndex={0}
                        aria-label={`Abrir ${cap.titulo}, ${total} interacciones`}
                        initial={{ opacity: 0, y: 70, scale: 0.88, rotate: d.rot + 6 }}
                        animate={{ opacity: 1, y: 0, scale: 1, rotate: d.rot }}
                        transition={{ delay: 0.5 + idx * 0.13, duration: 0.8, ease: EASE }}
                        drag
                        dragConstraints={muroRef}
                        dragElastic={0.12}
                        dragMomentum={false}
                        whileHover={{ scale: 1.04 }}
                        whileDrag={{ scale: 1.07, rotate: 0 }}
                        onDragStart={() => {
                          arrastrando.current = true;
                          traerAlFrente(idx);
                        }}
                        onDragEnd={() => {
                          setTimeout(() => (arrastrando.current = false), 60);
                        }}
                        onTap={(e) => {
                          if (arrastrando.current) return;
                          const carta = e.target.closest(".arq-cartaFigura");
                          if (carta) abrirCapitulo(carta, cap.numero);
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            abrirCapitulo(e.currentTarget, cap.numero);
                          }
                        }}
                      >
                        {/* La carta: solo la escena */}
                        <div className="arq-cartaMarco">
                          <div className="arq-cartaArte">
                            <EscenaMiniatura Escena={cap.Escena} foco={cap.foco} zoom={cap.zoom} />
                            <span className="arq-brillo" aria-hidden="true" />
                          </div>
                        </div>

                        {/* La información: debajo de la carta */}
                        <figcaption className="arq-pie">
                          <span className="arq-pieNumero">{cap.numero}</span>
                          <span className="arq-pieTexto">
                            <span className="arq-pieTitulo">{cap.titulo}</span>
                            {cap.subtitulo && <span className="arq-pieSub">{cap.subtitulo}</span>}
                          </span>
                          <span className="arq-pieCuenta">
                            <i className="arq-punto" />
                            {total} {total === 1 ? "interacción" : "interacciones"}
                          </span>
                          <span className="arq-pieAbrir">Abrir archivo ➜</span>
                        </figcaption>
                      </motion.figure>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="arq-escenarioPie">
            {interacciones.length > 0 ? (
              <button className="arq-dashLink" onClick={() => setConfirmando(true)}>
                Vaciar Grimorio ✕
              </button>
            ) : (
              <span className="arq-meta">Aún no hay interacciones guardadas</span>
            )}
          </div>
        </motion.section>
      </div>

      {/* ---------- Archivo del capítulo ---------- */}
      <AnimatePresence>
        {capituloActivo && (
          <motion.div
            key="arq-visor"
            className="arq-visor"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={(e) => e.target === e.currentTarget && setCapituloActivo(null)}
          >
            <motion.div
              className="arq-panel"
              role="dialog"
              aria-label={`Archivo de ${capData.titulo}`}
              initial={{ opacity: 0, x: origen.dx, y: origen.dy, scale: 0.15 }}
              animate={{ opacity: 1, x: 0, y: 0, scale: 1 }}
              exit={{ opacity: 0, x: origen.dx, y: origen.dy, scale: 0.15 }}
              transition={{ type: "spring", stiffness: 170, damping: 22 }}
            >
              <div className="arq-panelCabecera">
                <div>
                  <h2 className="arq-panelTitulo">
                    <Letras texto={capData.titulo} retraso={0.25} paso={0.04} />
                  </h2>
                  <motion.p
                    className="arq-meta"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6, duration: 0.5 }}
                  >
                    {capData.subtitulo ? `${capData.subtitulo} · ` : ""}
                    {visibles.length} {visibles.length === 1 ? "interacción" : "interacciones"}
                  </motion.p>
                </div>

                <div className="arq-archAcciones">
                  <button className="arq-dashLink" onClick={() => navigate(capData.ruta)}>
                    Ir al capítulo ➜
                  </button>
                  {visibles.length > 0 && (
                    <button className="arq-btnNeon" onClick={() => setConfirmando(true)}>
                      Vaciar
                    </button>
                  )}
                  <button className="arq-btnNeon" onClick={() => setCapituloActivo(null)}>
                    Cerrar
                  </button>
                </div>
              </div>

              {visibles.length === 0 ? (
                <motion.div
                  className="arq-vacio"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                >
                  <h3>Este capítulo está vacío</h3>
                  <p>Vuelve al cómic e interactúa con los objetos.</p>
                </motion.div>
              ) : (
                <div className="arq-fichas">
                  <AnimatePresence mode="popLayout">
                    {visibles.map((item, k) => (
                      <motion.div
                        key={`${item.capitulo}-${item.id}`}
                        layout
                        initial={{ opacity: 0, y: 34, scale: 0.9 }}
                        animate={{
                          opacity: 1,
                          y: 0,
                          scale: 1,
                          transition: { delay: 0.35 + k * 0.08, duration: 0.55, ease: EASE },
                        }}
                        exit={{ opacity: 0, scale: 0.8, y: -12 }}
                        transition={{ duration: 0.35, ease: EASE }}
                      >
                        <figure className="arq-ficha">
                          <div className="arq-fichaMarco">
                            <div className="arq-fichaArte">
                              <FichaArte item={item} />
                            </div>
                          </div>
                          <figcaption className="arq-fichaPie">
                            <span className="arq-fichaNombre">{item.nombre}</span>
                            <span className="arq-fichaFecha">{obtenerFecha(item.fecha)}</span>
                            <button
                              className="arq-btnQuitar"
                              onClick={() => eliminarInteraccion(item.id, item.capitulo)}
                            >
                              Quitar ✕
                            </button>
                          </figcaption>
                        </figure>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ---------- Confirmación ---------- */}
      <AnimatePresence>
        {confirmando && (
          <motion.div
            key="confirm"
            className="arq-confirmFondo"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={(e) => e.target === e.currentTarget && setConfirmando(false)}
          >
            <motion.div
              className="arq-confirmCaja"
              role="alertdialog"
              aria-labelledby="confirmTitulo"
              initial={{ opacity: 0, y: 30, scale: 0.92 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.94 }}
              transition={{ duration: 0.4, ease: EASE }}
            >
              <h2 id="confirmTitulo">
                {capituloActivo ? `¿Vaciar el capítulo ${capituloActivo}?` : "¿Vaciar el Grimorio?"}
              </h2>
              <p>
                Se borrarán <strong>{aBorrar}</strong>{" "}
                {aBorrar === 1 ? "interacción guardada" : "interacciones guardadas"}. Esta acción
                no se puede deshacer.
              </p>
              <div className="arq-confirmBotones">
                <button className="arq-confirmCancelar" onClick={() => setConfirmando(false)} autoFocus>
                  Cancelar
                </button>
                <button className="arq-confirmBorrar" onClick={confirmarBorrado}>
                  Sí, borrar
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
};

export default InteraccionesGuardadas;