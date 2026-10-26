import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import lottie from "lottie-web";
import "../Styles/barraControles.css";

/*
  Barra de controles compartida por los visores (VisorCapitulo, VisorComic2..5).

  - Píldora lateral (izquierda, vertical): volumen · archivo · subtítulos
  - Barra de subtítulos (pegada debajo de la pantalla, como la barra de arriba)
  - Píldora inferior (centrada): ⏮ anterior | ▶/⏸ pausa-despausa | siguiente ⏭

  Además exporta el CONTROL GLOBAL (useControlGlobal) que pausa / silencia
  TODA la escena: videos, audios (new Audio), animaciones CSS, animaciones
  element.animate() y Lotties.
*/

/* ==========================================================================
   CAPÍTULOS: rutas y transición para pasar de un capítulo a otro
   sin volver al mapa.

   >>> CAMBIA ESTAS RUTAS por las que tengas en tu App.jsx / router <<<
   El orden es: [capítulo I, II, III, IV, V]
   ========================================================================== */
export const RUTAS_CAPITULOS = [
  "/visor-1",
  "/visor-2",
  "/visor-3",
  "/visor-4",
  "/visor-5",
];
const DURACION_CORTINA = 700; // ms que tarda en oscurecerse / aclararse

// Se activa al salir de un capítulo: el siguiente arranca desde negro y aclara
let vieneDeCapitulo = false;

export function useCambioCapitulo() {
  const navigate = useNavigate();
  const [opacidad, setOpacidad] = useState(vieneDeCapitulo ? 1 : 0);
  const [cambiando, setCambiando] = useState(false);
  const timerRef = useRef(null);

  // Si llegamos desde otro capítulo: aclarar desde negro
  useEffect(() => {
    if (!vieneDeCapitulo) return;
    let r2 = 0;
    const r1 = requestAnimationFrame(() => {
      r2 = requestAnimationFrame(() => {
        vieneDeCapitulo = false;
        setOpacidad(0);
      });
    });
    return () => {
      cancelAnimationFrame(r1);
      cancelAnimationFrame(r2);
    };
  }, []);

  useEffect(() => () => clearTimeout(timerRef.current), []);

  // Oscurece la pantalla y, cuando está negra, cambia de capítulo
  const irA = (ruta) => {
    if (!ruta || cambiando) return;
    setCambiando(true);
    setOpacidad(1);
    timerRef.current = setTimeout(() => {
      vieneDeCapitulo = true;
      navigate(ruta);
    }, DURACION_CORTINA);
  };

  const cortina = (
    <div
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        background: "#000",
        zIndex: 1000,
        opacity: opacidad,
        pointerEvents: opacidad > 0 ? "auto" : "none",
        transition: `opacity ${DURACION_CORTINA}ms ease`,
      }}
    />
  );

  return { cortina, irA, cambiando };
}

/* ==========================================================================
   CONTROL GLOBAL DE PAUSA Y SILENCIO
   ========================================================================== */

export const estadoControl = { activo: false, pausado: false, silenciado: false };

const medios = new Set();          // todos los audio/video que han sonado
const pausadosAqui = new Set();    // los que pausó (o difirió) esta barra
const animsPausadas = new Set();   // animaciones CSS / element.animate pausadas
const lottiesPausados = new Set(); // Lotties pausados
const temporizadores = new Set();  // temporizadores pausables (ver "esperar")

/* Temporizador que se DETIENE con la pausa y sigue donde iba al reanudar.
   Se usa igual que setTimeout:  const t = esperar(() => {...}, 3000);
   y se cancela con:             cancelarEspera(t);                      */
export const esperar = (fn, ms) => {
  const t = { restante: ms, inicio: 0, id: null, corriendo: false };
  t.lanzar = () => {
    if (t.corriendo) return; // ya está corriendo: no se duplica
    t.corriendo = true;
    t.inicio = performance.now();
    t.id = setTimeout(() => {
      t.corriendo = false;
      temporizadores.delete(t);
      fn();
    }, Math.max(0, t.restante));
  };
  temporizadores.add(t);
  if (!estadoControl.pausado) t.lanzar();
  return t;
};

export const cancelarEspera = (t) => {
  if (!t) return;
  clearTimeout(t.id);
  t.corriendo = false;
  temporizadores.delete(t);
};

// Llamar al cambiar de escena (antes de setIndex)
export const reiniciarControl = () => {
  temporizadores.forEach((t) => {
    clearTimeout(t.id);
    t.corriendo = false;
  });
  temporizadores.clear();
  medios.clear();
  pausadosAqui.clear();
  animsPausadas.clear();
  lottiesPausados.clear();
};

// Se intercepta play() UNA sola vez, al cargar el módulo. Así también se
// registran los medios que arrancan en el primer render de la escena.
const proto = typeof HTMLMediaElement !== "undefined" ? HTMLMediaElement.prototype : null;
const playOriginal = proto ? proto.__playOriginal || proto.play : null;

if (proto) {
  proto.__playOriginal = playOriginal;

  proto.play = function (...args) {
    if (!estadoControl.activo) return playOriginal.apply(this, args);

    if (!medios.has(this)) {
      medios.add(this);
      this.addEventListener("ended", () => medios.delete(this), { once: true });
    }

    if (this instanceof HTMLAudioElement) this.muted = estadoControl.silenciado;

    // En pausa: no suena, queda en espera hasta reanudar
    if (estadoControl.pausado) {
      pausadosAqui.add(this);
      return Promise.resolve();
    }

    return playOriginal.apply(this, args);
  };
}

// El fundido a oscuro entre escenas nunca se pausa; todo lo demás sí
const esFundido = (el) =>
  !!(el && el.classList && el.classList.contains("visor-scene-content"));

export function useControlGlobal(pausado, silenciado) {
  // Se actualiza en el render para que play() siempre vea el valor actual
  estadoControl.pausado = pausado;
  estadoControl.silenciado = silenciado;

  // Se activa antes que los efectos de las escenas hijas
  useLayoutEffect(() => {
    estadoControl.activo = true;
    return () => {
      estadoControl.activo = false;
      estadoControl.pausado = false;
      estadoControl.silenciado = false;
      reiniciarControl();
    };
  }, []);

  // Silencio (solo audios; los videos ya van muted)
  useEffect(() => {
    medios.forEach((m) => {
      if (m instanceof HTMLAudioElement) m.muted = silenciado;
    });
    document.querySelectorAll("audio").forEach((a) => {
      a.muted = silenciado;
    });
  }, [silenciado]);

  // Pausa / reanudar
  useEffect(() => {
    if (!playOriginal) return;

    if (pausado) {
      medios.forEach((m) => {
        if (!m.paused && !m.ended) {
          m.pause();
          pausadosAqui.add(m);
        }
      });

      // Respaldo: cualquier video/audio de la escena que siga sonando o moviéndose
      document.querySelectorAll(".visor-scene video, .visor-scene audio").forEach((m) => {
        if (!m.paused && !m.ended) {
          m.pause();
          pausadosAqui.add(m);
        }
      });

      document.getAnimations().forEach((a) => {
        const el = a.effect && a.effect.target;
        if (esFundido(el)) return;
        if (a.playState === "running" && el && el.closest && el.closest(".visor-scene")) {
          a.pause();
          animsPausadas.add(a);
        }
      });

      lottie.getRegisteredAnimations().forEach((l) => {
        if (!l.isPaused) {
          l.pause();
          lottiesPausados.add(l);
        }
      });

      const ahora = performance.now();
      temporizadores.forEach((t) => {
        if (!t.corriendo) return;
        clearTimeout(t.id);
        t.restante -= ahora - t.inicio;
        t.corriendo = false;
      });
    } else {
      temporizadores.forEach((t) => t.lanzar());

      pausadosAqui.forEach((m) => playOriginal.call(m).catch(() => {}));
      pausadosAqui.clear();

      animsPausadas.forEach((a) => {
        try {
          if (a.playState === "paused") a.play();
        } catch (_) {}
      });
      animsPausadas.clear();

      lottiesPausados.forEach((l) => l.play());
      lottiesPausados.clear();
    }
  }, [pausado]);
}

/* ==========================================================================
   ICONOS — aquí se cambian las rutas. Cada línea es "nombre": "ruta".
   La ruta empieza con "/" y es relativa a la carpeta public.
     public/volumen.svg          ->  "/volumen.svg"
     public/iconos/volumen.svg   ->  "/iconos/volumen.svg"
   Si un icono no se ve, cambia SOLO su línea.
   (el "siguiente" usa el mismo "anterior", volteado con CSS)
   ========================================================================== */
const ICONOS = {
  "volumen":     "/volumen.svg",
  "sin-volumen": "/sin-volumen.svg",
  "archivo":     "/archivo.svg",
  "subtitulos":  "/subtitulos.svg",          // ojo: activar / ocultar subtítulos
  "pausa":       "/pausa.svg",
  "despausa":    "/despausa.svg",
  "anterior":    "/anterior.svg",
  "inicio":      "/InicioI.svg",   // volver al inicio (solo capítulo 5, última escena)
};

const ICONO = (nombre) => ICONOS[nombre];

/* ==========================================================================
   BOTÓN "VOLVER AL INICIO"
   Mismo estilo que los demás iconos de la barra (halo + brillo que late).
   Se usa solo en el último capítulo, en su última escena:
       {ultimaEscena && <BotonInicio disabled={cambiando} />}
   El icono se cambia arriba, en ICONOS → "inicio".
   ========================================================================== */
export function BotonInicio({ disabled = false }) {
  const navigate = useNavigate();

  return (
    <button
      type="button"
      className="bc-btn bc-inicio"
      aria-label="Volver al inicio"
      title="Volver al inicio"
      disabled={disabled}
      onClick={() => navigate("/")}
    >
      <img src={ICONO("inicio")} alt="" className="bc-ico bc-pop" draggable="false" />
    </button>
  );
}

export default function BarraControles({
  index,
  total,
  onAnterior,
  onSiguiente,
  onIr,
  reproduciendo,
  onAlternarPausa,
  nivelVolumen,
  onAlternarMute,
  mostrarSubtitulo,
  onAlternarSubtitulos,
  subtitulo,                 // texto del subtítulo actual (string). Se muestra dentro de la barra inferior

  /* --- Opcionales: solo los usa el VisorCapitulo nuevo --- */
  tiempo,                    // { actual, total, valor, max, activa, titulo, onChange, onConfirm }
  onSaltar,                  // (segundos) => void  (adelantar / retroceder)
  saltoSegundos = 5,
  puedeSaltar = true,
  bloqueado = false,         // true durante transiciones: desactiva anterior/siguiente
  siguienteDeshabilitado,    // si se omite: index === total - 1
  siguienteDestacado = false,// brilla más (ej. "Siguiente capítulo")
  tituloSiguiente = "Escena siguiente",
}) {
  const navigate = useNavigate();

  const sinVolumen = nivelVolumen === 0;

  return (
    <>
      {/* ---------- Barra de subtítulos: continúa la ventana por debajo, como la barra de arriba ----------
          Va justo después de la pantalla del visor. Siempre existe (aunque no haya texto)
          para que la ventana no cambie de alto. */}
      <div className="bc-subbar" aria-live="polite">
        {mostrarSubtitulo && subtitulo ? <p>{subtitulo}</p> : null}
      </div>

      {/* ---------- Píldora lateral: volumen · archivo · subtítulos ---------- */}
      <div className="bc-side">
        {/* Volumen: un clic silencia / activa el sonido */}
        <button
          type="button"
          className={`bc-btn bc-float ${sinVolumen ? "bc-off" : ""}`}
          style={{ "--d": "0s" }}
          aria-label={sinVolumen ? "Activar sonido" : "Silenciar"}
          onClick={onAlternarMute}
        >
          <img
            key={sinVolumen ? "mute" : "vol"}
            src={ICONO(sinVolumen ? "sin-volumen" : "volumen")}
            alt=""
            className="bc-ico bc-pop"
            draggable="false"
          />
        </button>

        {/* Archivo / interacciones guardadas */}
        <button
          type="button"
          className="bc-btn bc-float"
          style={{ "--d": "-1.1s" }}
          aria-label="Interacciones guardadas"
          onClick={() => navigate("/archivo")}
        >
          <img src={ICONO("archivo")} alt="" className="bc-ico" draggable="false" />
        </button>

        {/* Subtítulos */}
        <button
          type="button"
          className={`bc-btn bc-float ${!mostrarSubtitulo ? "bc-off" : ""}`}
          style={{ "--d": "-2.2s" }}
          aria-label="Subtítulos"
          aria-pressed={mostrarSubtitulo}
          onClick={onAlternarSubtitulos}
        >
          <img src={ICONO("subtitulos")} alt="" className="bc-ico" draggable="false" />
          {!mostrarSubtitulo && <span className="bc-slash" aria-hidden="true" />}
        </button>
      </div>

      {/* ---------- Píldora inferior: anterior · pausa · siguiente ---------- */}
      <div className={`bc-bottom ${tiempo ? "bc-bottom--dos" : ""}`}>
        {/* Barra de tiempo (solo en el visor nuevo) */}
        {tiempo && (
          <div className="bc-timeline">
            <span className="bc-time">{tiempo.actual}</span>
            <input
              type="range"
              className="bc-bar"
              min="0"
              max={tiempo.max || 1}
              step="0.1"
              value={Math.min(tiempo.valor, tiempo.max || 1)}
              disabled={!tiempo.activa}
              style={{
                "--v": `${tiempo.max > 0 ? Math.min(100, (tiempo.valor / tiempo.max) * 100) : 0}%`,
              }}
              aria-label="Progreso de la escena"
              title={tiempo.titulo}
              onChange={tiempo.onChange}
              onPointerUp={tiempo.onConfirm}
              onTouchEnd={tiempo.onConfirm}
              onKeyUp={tiempo.onConfirm}
              onBlur={tiempo.onConfirm}
            />
            <span className="bc-time">{tiempo.total}</span>
          </div>
        )}

        <div className="bc-row">
          <div className="bc-group">
            <button
              type="button"
              className="bc-btn bc-btn--prev"
              aria-label="Escena anterior"
              onClick={onAnterior}
              disabled={index === 0 || bloqueado}
            >
              <img src={ICONO("anterior")} alt="" className="bc-ico" draggable="false" />
            </button>

            {onSaltar && (
              <button
                type="button"
                className="bc-chip"
                aria-label={`Retroceder ${saltoSegundos} segundos`}
                onClick={() => onSaltar(-saltoSegundos)}
                disabled={!puedeSaltar}
              >
                −{saltoSegundos}s
              </button>
            )}

            <button
              type="button"
              className={`bc-btn bc-play ${reproduciendo ? "bc-playing" : "bc-paused"}`}
              aria-label={reproduciendo ? "Pausar" : "Reproducir"}
              onClick={onAlternarPausa}
            >
              <span className="bc-aro" aria-hidden="true" />
              <img
                key={reproduciendo ? "pausa" : "despausa"}
                src={ICONO(reproduciendo ? "pausa" : "despausa")}
                alt=""
                className="bc-ico bc-pop"
                draggable="false"
              />
            </button>

            {onSaltar && (
              <button
                type="button"
                className="bc-chip"
                aria-label={`Adelantar ${saltoSegundos} segundos`}
                onClick={() => onSaltar(saltoSegundos)}
                disabled={!puedeSaltar}
              >
                +{saltoSegundos}s
              </button>
            )}

            <button
              type="button"
              className={`bc-btn bc-btn--next ${siguienteDestacado ? "bc-destacado" : ""}`}
              aria-label={tituloSiguiente}
              onClick={onSiguiente}
              disabled={
                (siguienteDeshabilitado !== undefined ? siguienteDeshabilitado : index === total - 1) ||
                bloqueado
              }
            >
              <img src={ICONO("anterior")} alt="" className="bc-ico bc-flip" draggable="false" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}