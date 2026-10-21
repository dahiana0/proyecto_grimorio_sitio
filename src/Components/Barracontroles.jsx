import React from "react";
import { useNavigate } from "react-router-dom";
import "../Styles/barraControles.css";

/*
  Barra de controles compartida por los visores (VisorCapitulo, VisorComic2..5).

  - Píldora lateral (izquierda, vertical): volumen · archivo · subtítulos
  - Píldora inferior (centrada): ⏮ anterior | ▶/⏸ pausa-despausa | siguiente ⏭
*/

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
  "subtitulos":  "/subtitulos.svg",
  "pausa":       "/pausa.svg",
  "despausa":    "/despausa.svg",
  "anterior":    "/anterior.svg",
};

const ICONO = (nombre) => ICONOS[nombre];

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