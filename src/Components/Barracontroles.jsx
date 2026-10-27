import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import lottie from "lottie-web";
import "../Styles/barraControles.css";

export const RUTAS_CAPITULOS = [
  "/visor-1",
  "/visor-2",
  "/visor-3",
  "/visor-4",
  "/visor-5",
];
const DURACION_CORTINA = 700;


let vieneDeCapitulo = false;

export function useCambioCapitulo() {
  const navigate = useNavigate();
  const [opacidad, setOpacidad] = useState(vieneDeCapitulo ? 1 : 0);
  const [cambiando, setCambiando] = useState(false);
  const timerRef = useRef(null);


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



export const estadoControl = { activo: false, pausado: false, silenciado: false };

const medios = new Set();
const pausadosAqui = new Set();
const animsPausadas = new Set();
const lottiesPausados = new Set();
const temporizadores = new Set();


export const esperar = (fn, ms) => {
  const t = { restante: ms, inicio: 0, id: null, corriendo: false };
  t.lanzar = () => {
    if (t.corriendo) return; 
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

    
    if (estadoControl.pausado) {
      pausadosAqui.add(this);
      return Promise.resolve();
    }

    return playOriginal.apply(this, args);
  };
}


const esFundido = (el) =>
  !!(el && el.classList && el.classList.contains("visor-scene-content"));

export function useControlGlobal(pausado, silenciado) {

  estadoControl.pausado = pausado;
  estadoControl.silenciado = silenciado;


  useLayoutEffect(() => {
    estadoControl.activo = true;
    return () => {
      estadoControl.activo = false;
      estadoControl.pausado = false;
      estadoControl.silenciado = false;
      reiniciarControl();
    };
  }, []);


  useEffect(() => {
    medios.forEach((m) => {
      if (m instanceof HTMLAudioElement) m.muted = silenciado;
    });
    document.querySelectorAll("audio").forEach((a) => {
      a.muted = silenciado;
    });
  }, [silenciado]);


  useEffect(() => {
    if (!playOriginal) return;

    if (pausado) {
      medios.forEach((m) => {
        if (!m.paused && !m.ended) {
          m.pause();
          pausadosAqui.add(m);
        }
      });


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

      pausadosAqui.forEach((m) => playOriginal.call(m).catch(() => { }));
      pausadosAqui.clear();

      animsPausadas.forEach((a) => {
        try {
          if (a.playState === "paused") a.play();
        } catch (_) { }
      });
      animsPausadas.clear();

      lottiesPausados.forEach((l) => l.play());
      lottiesPausados.clear();
    }
  }, [pausado]);
}


const ICONOS = {
  "volumen": "/volumen.svg",
  "sin-volumen": "/sin-volumen.svg",
  "archivo": "/archivo.svg",
  "subtitulos": "/subtitulos.svg",
  "pausa": "/pausa.svg",
  "despausa": "/despausa.svg",
  "anterior": "/anterior.svg",
  "inicio": "/InicioI.svg",
};

const ICONO = (nombre) => ICONOS[nombre];


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
  subtitulo,


  tiempo,
  onSaltar,
  puedeSaltar = true,
  bloqueado = false,
  siguienteDeshabilitado,
  siguienteDestacado = false,
  tituloSiguiente = "Escena siguiente",
}) {
  const navigate = useNavigate();

  const sinVolumen = nivelVolumen === 0;

  return (
    <>

      <div className="bc-subbar" aria-live="polite">
        {mostrarSubtitulo && subtitulo ? <p>{subtitulo}</p> : null}
      </div>


      <div className="bc-side">

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


        <button
          type="button"
          className="bc-btn bc-float"
          style={{ "--d": "-1.1s" }}
          aria-label="Interacciones guardadas"
          onClick={() => navigate("/archivo")}
        >
          <img src={ICONO("archivo")} alt="" className="bc-ico" draggable="false" />
        </button>


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


      <div className={`bc-bottom ${tiempo ? "bc-bottom--dos" : ""}`}>
        
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