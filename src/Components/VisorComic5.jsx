import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import LotieCap5A from "./LotieCap5A";
import LotieCap5B from "./LotieCap5B";
import LotieCap5C from "./LotieCap5C";
import LotieCap5D from "./LotieCap5D";
import LotieCap5E from "./LotieCap5E";
import "../Styles/visorCap1.css";

const DURACION_TRANSICION = 350;

export default function VisorComic5({
  numeroCapitulo = "V",
  tituloCapitulo = "La Abominación",
}) {
  const navigate = useNavigate();

  // Audio del narrador
  const audioRef = useRef(null);

  const [index, setIndex] = useState(0);

  const [nivelVolumen, setNivelVolumen] = useState(1);
  const [mostrarPanelVolumen, setMostrarPanelVolumen] = useState(false);
  const volumenPrevioRef = useRef(1);

  const [mostrarSubtitulo, setMostrarSubtitulo] = useState(true);
  const [subtituloActual, setSubtituloActual] = useState("");

  const [transicionando, setTransicionando] = useState(false);

  // true si el navegador bloqueó la reproducción automática
  const [audioBloqueado, setAudioBloqueado] = useState(false);

  const subtitulosPorEscena = {
    0: [
      {
        inicio: 0.48,
        fin: 7.27,
        texto:
          "Algunos lugares no se olvidan y algunas verdades no se pueden dejar atrás,",
      },
      {
        inicio: 7.28,
        fin: 12.59,
        texto: "a pesar de todo lo ocurrido, Stephen ha regresado,",
      },
      {
        inicio: 12.6,
        fin: 20.15,
        texto:
          "no por respuestas, sino porque hay algo que aún lo llama, algo que no ha terminado",
      },
      {
        inicio: 20.16,
        fin: 25.23,
        texto: "cada paso que da lo acerca más a aquello que intentó enterrar,",
      },
      {
        inicio: 25.24,
        fin: 28.31,
        texto: "y que nunca debió sobrevivir.",
      },
      {
        inicio: 28.32,
        fin: 32.91,
        texto: "Esta vez, no hay dudas, no hay escapatoria.",
      },
    ],
    1: [
      { inicio: 0.5, fin: 5.0, texto: "Texto del subtítulo 1 de la escena 2." },
    ],
    2: [
      { inicio: 0.5, fin: 5.0, texto: "Texto del subtítulo 1 de la escena 3." },
    ],
    3: [
      { inicio: 0.5, fin: 5.0, texto: "Texto del subtítulo 1 de la escena 4." },
    ],
    4: [
      { inicio: 0.5, fin: 5.0, texto: "Texto del subtítulo 1 de la escena 5." },
    ],
  };

  // Cada escena tiene su animación y su audio de narrador
  // Los archivos van en: public/audios/
  const escenas = [
    { tipo: "lottie", componente: <LotieCap5A />, audio: "/audios/NarradorCP1.wav" },
    { tipo: "lottie", componente: <LotieCap5B />, audio: "/audios/cap5-2.wav" },
    { tipo: "lottie", componente: <LotieCap5C />, audio: "/audios/cap5-3.wav" },
    { tipo: "lottie", componente: <LotieCap5D />, audio: "/audios/cap5-4.wav" },
    { tipo: "lottie", componente: <LotieCap5E />, audio: "/audios/cap5-5.wav" },
  ];

  // Sincroniza el subtítulo con el tiempo actual del audio
  const actualizarSubtitulo = () => {
    if (!audioRef.current) return;

    const tiempo = audioRef.current.currentTime;
    const subtitulos = subtitulosPorEscena[index] || [];

    const subtitulo = subtitulos.find(
      (s) => tiempo >= s.inicio && tiempo <= s.fin
    );

    setSubtituloActual(subtitulo ? subtitulo.texto : "");
  };

  // Intenta reproducir el audio; si el navegador lo bloquea, muestra el botón
  const reproducirAudio = () => {
    if (!audioRef.current) return;

    audioRef.current
      .play()
      .then(() => setAudioBloqueado(false))
      .catch((error) => {
        console.log("El audio no pudo reproducirse automáticamente:", error);
        setAudioBloqueado(true);
      });
  };

  // Al cambiar de escena: reinicia y reproduce el audio de la nueva
  useEffect(() => {
    const escenaActual = escenas[index];

    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }

    setSubtituloActual("");

    if (escenaActual.audio && audioRef.current) {
      audioRef.current.src = escenaActual.audio;
      audioRef.current.currentTime = 0;
      audioRef.current.volume = nivelVolumen;
      reproducirAudio();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index]);

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = nivelVolumen;
  }, [nivelVolumen]);

  // Navegación entre escenas, con transición a oscuro
  const cambiarEscena = (nuevoIndex) => {
    if (nuevoIndex < 0 || nuevoIndex > escenas.length - 1) return;
    if (nuevoIndex === index) return;

    setTransicionando(true);

    setTimeout(() => {
      setIndex(nuevoIndex);
      setSubtituloActual("");
      setTransicionando(false);
    }, DURACION_TRANSICION);
  };

  const siguiente = () => cambiarEscena(index + 1);
  const anterior = () => cambiarEscena(index - 1);

  // Volumen: slider manual + mute con el ícono
  const cambiarNivelVolumen = (evento) => {
    setNivelVolumen(parseFloat(evento.target.value));
  };

  const alternarMute = () => {
    if (nivelVolumen > 0) {
      volumenPrevioRef.current = nivelVolumen;
      setNivelVolumen(0);
    } else {
      setNivelVolumen(volumenPrevioRef.current || 1);
    }
  };

  const cambiarSubtitulos = () => {
    setMostrarSubtitulo((prev) => !prev);
  };

  // Render
  return (
    <div className="visor-container">
      {/* Barra superior */}
      <div className="visor-top d-flex justify-content-between align-items-center">
        <div className="d-flex align-items-center gap-2">
          <button
            onClick={() => navigate("/explorar-museo")}
            className="visor-btn"
          >
            ← CAPÍTULOS
          </button>

          <div className="visor-line"></div>

          <div className="d-flex align-items-center gap-1">
            <span className="visor-cap">CAPÍTULO {numeroCapitulo}</span>
            <span className="visor-title">— {tituloCapitulo}</span>
          </div>
        </div>

        <div className="d-flex align-items-center gap-3">
          <div
            className="visor-volume-wrapper"
            onMouseEnter={() => setMostrarPanelVolumen(true)}
            onMouseLeave={() => setMostrarPanelVolumen(false)}
          >
            {mostrarPanelVolumen && (
              <div className="visor-volume-panel">
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={nivelVolumen}
                  onChange={cambiarNivelVolumen}
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
            onClick={cambiarSubtitulos}
            src={mostrarSubtitulo ? "./subtitles.svg" : "./subtitles-off.svg"}
            alt="Subtítulos"
            className={`visor-icon ${!mostrarSubtitulo ? "off" : ""}`}
          />

          <img
            onClick={() => navigate("/archivo")}
            src="./Archivo.png"
            alt="Interacciones guardadas"
            className="visor-iconnn"
          />
        </div>
      </div>

      {/* Escenario: lottie con transición a oscuro */}
      <div className="visor-scene">
        <div
          className={`visor-scene-content ${
            transicionando ? "fade-out" : "fade-in"
          }`}
        >
          <div className="visor-lottie">{escenas[index].componente}</div>

          {mostrarSubtitulo && subtituloActual && (
            <div className="visor-sub">
              <p>{subtituloActual}</p>
            </div>
          )}
        </div>

        {/* Respaldo si el navegador bloquea el autoplay */}
        {audioBloqueado && (
          <button
            onClick={reproducirAudio}
            className="visor-btn"
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              zIndex: 10,
            }}
          >
            ▶ ACTIVAR NARRACIÓN
          </button>
        )}
      </div>

      {/* Navegación inferior */}
      <div className="visor-bottom-nav">
        <button
          onClick={anterior}
          className={`visor-arrow-btn ${index === 0 ? "disabled" : ""}`}
          aria-label="Escena anterior"
        >
          <img src="./circle-chevron-left.svg" alt="" />
        </button>

        <div className="visor-progress-track">
          {escenas.map((_, i) => (
            <div key={i} className="visor-progress-step">
              <button
                onClick={() => cambiarEscena(i)}
                className={`visor-progress-number ${
                  i < index ? "completed" : ""
                } ${i === index ? "active" : ""}`}
              >
                {String(i + 1).padStart(2, "0")}
              </button>

              {i < escenas.length - 1 && (
                <div
                  className={`visor-progress-line ${
                    i < index ? "completed" : ""
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        <button
          onClick={siguiente}
          className={`visor-arrow-btn ${
            index === escenas.length - 1 ? "disabled" : ""
          }`}
          aria-label="Siguiente escena"
        >
          <img src="./circle-chevron-right.svg" alt="" />
        </button>
      </div>

      {/* Audio del narrador */}
      <audio
        ref={audioRef}
        onTimeUpdate={actualizarSubtitulo}
        onEnded={() => setSubtituloActual("")}
      />
    </div>
  );
}