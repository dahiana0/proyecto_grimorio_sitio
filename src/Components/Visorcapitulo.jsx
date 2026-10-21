import React, { useState, useRef, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";

import { CAPITULOS } from "./capitulos";
import * as motorEscena from "./motorEscena";

import "../Styles/visorCap1.css";
import "../Styles/visorGrimorio.css";

const { motor, raw } = motorEscena;

// Tiempos (ms) de las transiciones. Deben coincidir con visorGrimorio.css
const T_SALIDA = 350;
const T_ENTRADA = 450;
const T_PORTAL = 1000;
const T_TARJETA = 1300;

// Cuántos segundos mueven los botones de adelantar y retrasar
const SALTO_SEGUNDOS = 5;

// Tamaño de diseño de las escenas. Por debajo de este ancho se escalan completas.
const ANCHO_BASE = 1480;
const ALTO_BASE = 650;

const formatear = (s) => {
  if (s === null || s === undefined || !Number.isFinite(s)) return "--:--";
  const t = Math.max(0, Math.floor(s));
  return `${Math.floor(t / 60)}:${String(t % 60).padStart(2, "0")}`;
};

/* ------------------------------ iconos ---------------------------------- */
const Svg = ({ children, fill }) => (
  <svg
    viewBox="0 0 24 24"
    width="22"
    height="22"
    fill={fill ? "currentColor" : "none"}
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    {children}
  </svg>
);
const IcoPlay = () => <Svg fill><path d="M8 5l12 7-12 7z" /></Svg>;
const IcoPausa = () => <Svg fill><rect x="6" y="5" width="4" height="14" rx="1" /><rect x="14" y="5" width="4" height="14" rx="1" /></Svg>;
const IcoAnterior = () => <Svg><path d="M6 5v14" /><path d="M19 5l-9 7 9 7z" /></Svg>;
const IcoSiguiente = () => <Svg><path d="M18 5v14" /><path d="M5 5l9 7-9 7z" /></Svg>;
const IcoAtras = () => <Svg><path d="M11 6l-7 6 7 6z" /><path d="M20 6l-7 6 7 6z" /></Svg>;
const IcoAdelante = () => <Svg><path d="M13 6l7 6-7 6z" /><path d="M4 6l7 6-7 6z" /></Svg>;

const Boton = ({ tip, onClick, disabled, grande, destacado, children }) => (
  <button
    type="button"
    className={`gv-btn ${grande ? "gv-btn--grande" : ""} ${destacado ? "gv-btn--destacado" : ""}`}
    data-tip={tip}
    aria-label={tip}
    onClick={onClick}
    disabled={disabled}
  >
    {children}
  </button>
);

/* ======================================================================== */

export default function VisorCapitulo({
  capituloInicial = 0,
  numeroCapitulo, // compatibilidad con las rutas antiguas
}) {
  const navigate = useNavigate();

  const inicio = numeroCapitulo
    ? Math.max(0, CAPITULOS.findIndex((c) => c.numero === numeroCapitulo))
    : capituloInicial;

  const [capIdx, setCapIdx] = useState(inicio);
  const [index, setIndex] = useState(0);
  const [clave, setClave] = useState(0); // fuerza el remontaje de la escena
  const [listo, setListo] = useState(false);

  const capitulo = CAPITULOS[capIdx];
  const escena = capitulo.escenas[index];
  const esVideo = escena.tipo === "video";
  const hayCapSiguiente = capIdx < CAPITULOS.length - 1;

  const [nivelVolumen, setNivelVolumen] = useState(1);
  const [mostrarPanelVolumen, setMostrarPanelVolumen] = useState(false);
  const volumenPrevioRef = useRef(1);
  const [mostrarSubtitulo, setMostrarSubtitulo] = useState(true);
  const [subtituloActual, setSubtituloActual] = useState("");
  const [subtituloDialogo, setSubtituloDialogo] = useState("");

  const [transicion, setTransicion] = useState(""); // "" | salida | entrada | portal
  const [tarjeta, setTarjeta] = useState(false);
  const [indicador, setIndicador] = useState(null);
  const [fin, setFin] = useState(false);
  const [duracionAudio, setDuracionAudio] = useState(null);
  const [reloj, setReloj] = useState({ t: 0, pausado: false, dur: null });
  const [escala, setEscala] = useState(1);
  const [arrastre, setArrastre] = useState(null);

  const audioRef = useRef(null);
  const videoRef = useRef(null);
  const marcoRef = useRef(null);
  const lienzoRef = useRef(null);
  const bloqueado = useRef(false);
  const tramoRef = useRef("A");
  const fallbackRef = useRef(null);
  const reintentoRef = useRef(null);
  const indicadorTimer = useRef(null);

  const escenaRef = useRef(escena);
  escenaRef.current = escena;
  const duracion = esVideo
    ? reloj.dur
    : escena.duracion !== undefined
    ? escena.duracion
    : duracionAudio;
  const duracionRef = useRef(duracion);
  duracionRef.current = duracion;

  /* ------------------ motor: se instala antes de montar escenas ---------- */
  useEffect(() => {
    motorEscena.instalar();
    motorEscena.excluir(audioRef.current);
    setListo(true);
    return () => {
      raw.clearTimeout(indicadorTimer.current);
      motorEscena.desinstalar();
    };
  }, []);

  useEffect(() => {
    motorEscena.fijarRaiz(lienzoRef.current);
  });

  /* ------------------------- escala del escenario ------------------------ */
  useEffect(() => {
    const el = marcoRef.current;
    if (!el || typeof ResizeObserver === "undefined") return;
    const medir = () => setEscala(Math.min(1, el.clientWidth / ANCHO_BASE));
    medir();
    const ro = new ResizeObserver(medir);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  /* ----------------------------- narrador -------------------------------- */
  const cancelarReintento = () => {
    if (reintentoRef.current) {
      window.removeEventListener("pointerdown", reintentoRef.current);
      window.removeEventListener("keydown", reintentoRef.current);
      reintentoRef.current = null;
    }
  };

  // Si el navegador bloquea el audio, arranca con el primer clic o tecla
  const reproducirNarrador = (alFallar) => {
    const audio = audioRef.current;
    if (!audio) return;
    cancelarReintento();
    const p = audio.play();
    if (!p || !p.catch) return;
    p.catch((error) => {
      if (error && error.name === "AbortError") return;
      if (error && error.name === "NotAllowedError") {
        const reintentar = () => {
          cancelarReintento();
          if (audioRef.current) audioRef.current.play().catch(() => {});
        };
        reintentoRef.current = reintentar;
        window.addEventListener("pointerdown", reintentar, { once: true });
        window.addEventListener("keydown", reintentar, { once: true });
        return;
      }
      console.error("No se pudo reproducir el audio:", error);
      if (alFallar) alFallar(error);
    });
  };

  const pausarNarrador = () => {
    cancelarReintento();
    if (audioRef.current) audioRef.current.pause();
    setSubtituloActual("");
  };

  const entrarTramoB = () => {
    const audio = audioRef.current;
    const tb = escenaRef.current.tramoB;
    if (!audio || !tb) return;
    tramoRef.current = "B";
    fallbackRef.current = null;
    audio.src = tb.audio;
    audio.currentTime = 0;
    // Si el audio no existe, el subtítulo se muestra igual con el reloj de la escena
    reproducirNarrador(() => {
      fallbackRef.current = { t0: motorEscena.tiempo() };
    });
  };

  const reanudarNarrador = () => entrarTramoB();

  // Coloca el narrador en el instante t de la escena (tras adelantar/retrasar)
  const sincronizarNarrador = (t) => {
    const a = audioRef.current;
    const esc = escenaRef.current;
    if (!a || !esc.audio) return;
    const tb = esc.tramoB;

    let src = esc.audio;
    let pos = t;
    let tramo = "A";
    if (tb && tb.inicio != null && t >= tb.inicio) {
      src = tb.audio;
      pos = t - tb.inicio;
      tramo = "B";
    }
    tramoRef.current = tramo;
    fallbackRef.current = null;

    const aplicar = () => {
      const dur = a.duration;
      if (Number.isFinite(dur) && pos >= dur) {
        a.pause();
        return;
      }
      a.currentTime = pos;
      reproducirNarrador();
    };

    if (a.getAttribute("src") !== src) {
      a.src = src;
      a.addEventListener("loadedmetadata", aplicar, { once: true });
    } else {
      aplicar();
    }
  };

  const fnRef = useRef({});
  fnRef.current = { pausarNarrador, reanudarNarrador, sincronizarNarrador };

  // Enlaces estables para escenas con lógica propia (parte 3 del capítulo I)
  const enlaces = useRef({
    pausarNarrador: () => fnRef.current.pausarNarrador(),
    reanudarNarrador: () => fnRef.current.reanudarNarrador(),
    setSubtituloDialogo: (t) => setSubtituloDialogo(t),
  }).current;

  useEffect(() => {
    motor.alSaltar = (t) => fnRef.current.sincronizarNarrador(t);
    return () => {
      motor.alSaltar = null;
    };
  }, []);

  // Al cambiar de escena o capítulo arranca su narrador
  useEffect(() => {
    if (!listo) return;
    const audio = audioRef.current;
    if (!audio) return;

    setSubtituloDialogo("");
    setSubtituloActual("");
    setFin(false);
    setDuracionAudio(null);
    setReloj({ t: 0, pausado: false, dur: null });
    tramoRef.current = "A";
    fallbackRef.current = null;
    cancelarReintento();

    const esc = escenaRef.current;
    if (esc.tipo === "lottie" && esc.audio) {
      audio.src = esc.audio;
      audio.currentTime = 0;
      reproducirNarrador();
    } else {
      audio.pause();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clave, listo]);

  useEffect(() => {
    return () => {
      cancelarReintento();
      if (audioRef.current) audioRef.current.pause();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const actualizarSubtitulo = () => {
    const audio = audioRef.current;
    const esc = escenaRef.current;
    if (!audio || !esc.subs) return;
    const lista = tramoRef.current === "B" && esc.tramoB ? esc.tramoB.subs : esc.subs;
    const s = lista.find((x) => audio.currentTime >= x.inicio && audio.currentTime <= x.fin);
    setSubtituloActual(s ? s.texto : "");
  };

  /* --------------- reloj: sondeo por fotograma (sin re-render) ----------- */
  useEffect(() => {
    if (!listo) return;
    let ultimo = "";
    return motorEscena.suscribir(() => {
      const esc = escenaRef.current;
      let t;
      let pausado;
      let dur = null;

      if (esc.tipo === "video") {
        const v = videoRef.current;
        if (!v) return;
        t = v.currentTime;
        pausado = v.paused;
        dur = Number.isFinite(v.duration) ? v.duration : null;
      } else {
        t = motorEscena.tiempo();
        pausado = motorEscena.estaPausado();

        // Segundo audio del narrador con entrada programada (Orabona)
        const tb = esc.tramoB;
        if (tb && tb.inicio != null && tramoRef.current === "A" && !pausado && t >= tb.inicio) {
          entrarTramoB();
        }
        // Subtítulos de respaldo si el audio del tramo B no existe
        if (fallbackRef.current && tb) {
          const tt = t - fallbackRef.current.t0;
          const s = tb.subs.find((x) => tt >= x.inicio && tt <= x.fin);
          setSubtituloActual(s ? s.texto : "");
        }
      }

      const k = `${Math.round(t * 10)}|${pausado}|${dur}`;
      if (k !== ultimo) {
        ultimo = k;
        setReloj({ t, pausado, dur });
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listo]);

  /* ------------------------------ volumen -------------------------------- */
  useEffect(() => {
    motorEscena.fijarVolumen(nivelVolumen);
    if (audioRef.current) audioRef.current.volume = nivelVolumen;
    if (videoRef.current) videoRef.current.volume = nivelVolumen;
  }, [nivelVolumen, clave]);

  const alternarMute = () => {
    if (nivelVolumen > 0) {
      volumenPrevioRef.current = nivelVolumen;
      setNivelVolumen(0);
    } else {
      setNivelVolumen(volumenPrevioRef.current || 1);
    }
  };

  /* --------------------- transiciones y navegación ----------------------- */
  const cambiarEscena = (nuevo) => {
    if (bloqueado.current) return;
    if (nuevo < 0 || nuevo > capitulo.escenas.length - 1 || nuevo === index) return;
    bloqueado.current = true;
    setTransicion("salida");

    raw.setTimeout(() => {
      motorEscena.reiniciar(); // detiene todo lo de la escena anterior
      setIndex(nuevo);
      setClave((c) => c + 1);
      setTransicion("entrada");
      raw.setTimeout(() => {
        setTransicion("");
        bloqueado.current = false;
      }, T_ENTRADA);
    }, T_SALIDA);
  };

  const cambiarCapitulo = (nuevo) => {
    if (bloqueado.current || nuevo < 0 || nuevo > CAPITULOS.length - 1) return;
    bloqueado.current = true;
    setTransicion("portal");
    setTarjeta(true);

    raw.setTimeout(() => {
      motorEscena.reiniciar();
      setCapIdx(nuevo);
      setIndex(0);
      setClave((c) => c + 1);

      raw.setTimeout(() => {
        setTarjeta(false);
        setTransicion("entrada");
        raw.setTimeout(() => {
          setTransicion("");
          bloqueado.current = false;
        }, T_ENTRADA);
      }, T_TARJETA - T_PORTAL);
    }, T_PORTAL);
  };

  const esUltima = index === capitulo.escenas.length - 1;
  const siguiente = () => {
    if (!esUltima) cambiarEscena(index + 1);
    else if (hayCapSiguiente) cambiarCapitulo(capIdx + 1);
  };
  const anterior = () => cambiarEscena(index - 1);

  /* ------------------------ pausa, saltos y barra ------------------------ */
  const mostrarIndicador = (texto) => {
    setIndicador({ texto, k: Date.now() });
    raw.clearTimeout(indicadorTimer.current);
    indicadorTimer.current = raw.setTimeout(() => setIndicador(null), 800);
  };

  const alternarPausa = () => {
    if (esVideo) {
      const v = videoRef.current;
      if (!v) return;
      if (v.paused) v.play();
      else v.pause();
      return;
    }
    if (motorEscena.estaPausado()) motorEscena.reanudar();
    else motorEscena.pausar();
  };

  const puedeSaltar = esVideo || escena.saltar !== false;

  const irAInstante = (destino) => {
    if (esVideo) {
      const v = videoRef.current;
      if (v) v.currentTime = Math.max(0, Math.min(destino, v.duration || destino));
    } else {
      if (escena.saltar === false) return;
      const d = duracionRef.current;
      motorEscena.irA(d != null ? Math.min(destino, d) : destino);
    }
    setFin(false);
  };

  const saltar = (dt) => {
    if (!puedeSaltar) return;
    const t = esVideo ? videoRef.current?.currentTime || 0 : motorEscena.tiempo();
    irAInstante(t + dt);
    mostrarIndicador(dt > 0 ? `+${dt} s` : `−${-dt} s`);
  };

  const confirmarBarra = () => {
    if (arrastre !== null) {
      irAInstante(arrastre);
      setArrastre(null);
    }
  };

  // Atajos de teclado: espacio, flechas
  const atajosRef = useRef({});
  atajosRef.current = { alternarPausa, saltar };
  useEffect(() => {
    const alTecla = (e) => {
      const tag = (e.target.tagName || "").toLowerCase();
      if (tag === "input" || tag === "textarea") return;
      if (e.code === "Space") {
        e.preventDefault();
        atajosRef.current.alternarPausa();
      } else if (e.code === "ArrowRight") atajosRef.current.saltar(SALTO_SEGUNDOS);
      else if (e.code === "ArrowLeft") atajosRef.current.saltar(-SALTO_SEGUNDOS);
    };
    window.addEventListener("keydown", alTecla);
    return () => window.removeEventListener("keydown", alTecla);
  }, []);

  /* ------------------------------- render -------------------------------- */
  const nodoEscena = useMemo(
    () => (escena.tipo === "lottie" ? escena.render(enlaces) : null),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [clave]
  );

  const escalado = escala < 1;
  const altoEscenario = escalado ? Math.round(ALTO_BASE * escala) : ALTO_BASE;
  const lienzoEstilo = escalado
    ? { width: ANCHO_BASE, height: ALTO_BASE, transform: `scale(${escala})`, transformOrigin: "top left" }
    : { width: "100%", height: "100%" };

  const valorBarra = arrastre !== null ? arrastre : reloj.t;
  const maxBarra = duracion != null ? duracion : 0;
  const progreso = maxBarra > 0 ? Math.min(100, (valorBarra / maxBarra) * 100) : 0;
  const barraActiva = puedeSaltar && maxBarra > 0;

  const etiquetaSiguiente = !esUltima
    ? "Escena siguiente"
    : hayCapSiguiente
    ? "Siguiente capítulo"
    : "No hay más escenas";

  return (
    <div className="visor-container">
      {/* Barra superior */}
      <div className="visor-top d-flex justify-content-between align-items-center">
        <div className="d-flex align-items-center gap-2">
          <button onClick={() => navigate("/explorar-museo")} className="visor-btn">
            ← CAPÍTULOS
          </button>
          <div className="visor-line"></div>
          <div className="d-flex align-items-center gap-1">
            <span className="visor-cap">CAPÍTULO {capitulo.numero}</span>
            <span className="visor-title">— {capitulo.titulo}</span>
          </div>
          <div className="visor-line"></div>
          <span className="gv-escena-nombre">
            Escena {index + 1} de {capitulo.escenas.length} · {escena.nombre}
          </span>
        </div>

        <div className="d-flex align-items-center gap-3">
          <img
            onClick={() => navigate("/archivo")}
            src="./Archivo.png"
            alt="Interacciones guardadas"
            className="visor-iconnn"
          />
        </div>
      </div>

      {/* Escenario */}
      <div className="gv-marco" ref={marcoRef}>
        <div className="gv-escenario" style={{ height: altoEscenario }}>
          <div
            className={`gv-contenido ${
              transicion === "salida" || transicion === "portal" ? "gv-oculto" : ""
            }`}
          >
            {esVideo ? (
              <video
                key={clave}
                ref={videoRef}
                className="gv-video"
                autoPlay
                playsInline
                muted={nivelVolumen === 0}
                onEnded={() => setFin(true)}
              >
                <source src={escena.video} type="video/mp4" />
                Tu navegador no soporta videos HTML5.
              </video>
            ) : (
              <div
                className={`gv-lienzo ${reloj.pausado ? "gv-lienzo--pausa" : ""}`}
                ref={lienzoRef}
                style={lienzoEstilo}
              >
                {listo && <React.Fragment key={clave}>{nodoEscena}</React.Fragment>}
              </div>
            )}

            {mostrarSubtitulo && !esVideo && (subtituloDialogo || subtituloActual) && (
              <div className="visor-sub">
                <p>{subtituloDialogo || subtituloActual}</p>
              </div>
            )}
          </div>

          {/* Pausa: velo suave (las interacciones se detienen mientras tanto) */}
          {reloj.pausado && !transicion && (
            <div className="gv-pausa" aria-hidden="true">
              <span>En pausa</span>
            </div>
          )}

          {indicador && (
            <div className="gv-indicador" key={indicador.k}>
              {indicador.texto}
            </div>
          )}

          {/* Final de escena: acceso al siguiente capítulo sin salir */}
          {fin && esUltima && !transicion && (
            <div className="gv-fin">
              {hayCapSiguiente ? (
                <>
                  <p>
                    Capítulo {CAPITULOS[capIdx + 1].numero} · {CAPITULOS[capIdx + 1].titulo}
                  </p>
                  <button className="gv-fin-btn" onClick={() => cambiarCapitulo(capIdx + 1)}>
                    Continuar historia
                  </button>
                </>
              ) : (
                <>
                  <p>Fin del capítulo {capitulo.numero}</p>
                  <div className="gv-fin-acciones">
                    <button className="gv-fin-btn" onClick={() => cambiarCapitulo(capIdx)}>
                      Repetir capítulo
                    </button>
                    <button className="gv-fin-btn gv-fin-btn--suave" onClick={() => navigate("/explorar-museo")}>
                      Ir a capítulos
                    </button>
                  </div>
                </>
              )}
            </div>
          )}

          {/* Transiciones: luz que recorre el marco + partículas */}
          <div className={`gv-velo ${transicion ? `gv-velo--${transicion}` : ""}`} aria-hidden="true">
            <span className="gv-luz" />
            {Array.from({ length: 14 }).map((_, i) => (
              <span key={i} className="gv-particula" style={{ "--i": i }} />
            ))}
          </div>

          {tarjeta && (
            <div className="gv-tarjeta" aria-live="polite">
              <span className="gv-tarjeta-num">Capítulo {CAPITULOS[Math.min(capIdx + 1, CAPITULOS.length - 1)].numero}</span>
              <span className="gv-tarjeta-titulo">{CAPITULOS[Math.min(capIdx + 1, CAPITULOS.length - 1)].titulo}</span>
            </div>
          )}
        </div>
      </div>

      {/* Barra de controles */}
      <div className="gv-dock">
        <div className="gv-controles">
          <Boton tip="Escena anterior" onClick={anterior} disabled={index === 0 || !!transicion}>
            <IcoAnterior />
          </Boton>
          <Boton
            tip={puedeSaltar ? `Retroceder ${SALTO_SEGUNDOS} s` : "Esta escena no admite saltos"}
            onClick={() => saltar(-SALTO_SEGUNDOS)}
            disabled={!puedeSaltar}
          >
            <IcoAtras />
          </Boton>
          <Boton grande tip={reloj.pausado ? "Reproducir" : "Pausar"} onClick={alternarPausa}>
            {reloj.pausado ? <IcoPlay /> : <IcoPausa />}
          </Boton>
          <Boton
            tip={puedeSaltar ? `Adelantar ${SALTO_SEGUNDOS} s` : "Esta escena no admite saltos"}
            onClick={() => saltar(SALTO_SEGUNDOS)}
            disabled={!puedeSaltar}
          >
            <IcoAdelante />
          </Boton>
          <Boton
            tip={etiquetaSiguiente}
            onClick={siguiente}
            disabled={(esUltima && !hayCapSiguiente) || !!transicion}
            destacado={esUltima && hayCapSiguiente}
          >
            <IcoSiguiente />
          </Boton>
        </div>

        <div className="gv-tiempo">
          <span className="gv-reloj">{formatear(valorBarra)}</span>
          <input
            type="range"
            className="gv-barra"
            min="0"
            max={maxBarra || 1}
            step="0.1"
            value={Math.min(valorBarra, maxBarra || 1)}
            disabled={!barraActiva}
            style={{ "--gv-prog": `${progreso}%` }}
            aria-label="Progreso de la escena"
            title={
              !puedeSaltar
                ? "Esta escena no admite saltos en el tiempo"
                : maxBarra > 0
                ? "Arrastra para cambiar el instante"
                : "La duración de esta escena no está definida"
            }
            onChange={(e) => setArrastre(parseFloat(e.target.value))}
            onPointerUp={confirmarBarra}
            onTouchEnd={confirmarBarra}
            onKeyUp={confirmarBarra}
            onBlur={confirmarBarra}
          />
          <span className="gv-reloj">{formatear(maxBarra > 0 ? maxBarra : null)}</span>
        </div>

        <div className="gv-extras">
          <div
            className="visor-volume-wrapper gv-volumen"
            onMouseEnter={() => setMostrarPanelVolumen(true)}
            onMouseLeave={() => setMostrarPanelVolumen(false)}
          >
            {mostrarPanelVolumen && (
              <div className="visor-volume-panel gv-volumen-panel">
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={nivelVolumen}
                  onChange={(e) => setNivelVolumen(parseFloat(e.target.value))}
                  className="visor-volume-slider"
                  aria-label="Volumen"
                />
              </div>
            )}
            <img
              onClick={alternarMute}
              src={nivelVolumen === 0 ? "./volume-3.svg" : "./volume-2 (2).svg"}
              alt="Volumen"
              className={`visor-icon ${nivelVolumen === 0 ? "off" : ""}`}
            />
          </div>
          <img
            onClick={() => setMostrarSubtitulo((v) => !v)}
            src={mostrarSubtitulo ? "./subtitles.svg" : "./subtitles-off.svg"}
            alt="Subtítulos"
            className={`visor-icon ${!mostrarSubtitulo ? "off" : ""}`}
          />
        </div>
      </div>

      {/* Escenas del capítulo */}
      <div className="visor-bottom-nav">
        <div className="visor-progress-track">
          {capitulo.escenas.map((_, i) => (
            <div key={i} className="visor-progress-step">
              <button
                onClick={() => cambiarEscena(i)}
                className={`visor-progress-number ${i < index ? "completed" : ""} ${
                  i === index ? "active" : ""
                }`}
                aria-label={`Ir a la escena ${i + 1}`}
              >
                {String(i + 1).padStart(2, "0")}
              </button>
              {i < capitulo.escenas.length - 1 && (
                <div className={`visor-progress-line ${i < index ? "completed" : ""}`} />
              )}
            </div>
          ))}
        </div>
      </div>

      <audio
        ref={audioRef}
        onTimeUpdate={actualizarSubtitulo}
        onLoadedMetadata={(e) => {
          if (tramoRef.current === "A" && Number.isFinite(e.currentTarget.duration)) {
            setDuracionAudio(e.currentTarget.duration);
          }
        }}
        onEnded={() => {
          const esc = escenaRef.current;
          if (esc.tramoB && tramoRef.current === "A") return; // aún falta el tramo B
          setSubtituloActual("");
          setFin(true);
        }}
      />
    </div>
  );
}