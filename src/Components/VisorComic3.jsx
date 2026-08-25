import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import LotieCap3 from "./LotieCap3";

import "../Styles/visorCap1.css";

// Duración de la transición a oscuro entre escenas (ms).
// Debe coincidir con el "transition" definido en .visor-scene-content en el CSS.
const DURACION_TRANSICION = 350;

export default function VisorComic3({
  numeroCapitulo = "III",
  tituloCapitulo = "CAPÍTULO 3",
}) {
  const navigate = useNavigate();

  const videoRef = useRef(null);
  const audioRef = useRef(null);

  // ---------------------------------------------------------------------
  // Estado
  // ---------------------------------------------------------------------
  const [index, setIndex] = useState(0);

  const [play, setPlay] = useState(false);
  const [showControls, setShowControls] = useState(true);

  // Volumen manual (0 a 1) y visibilidad de la ventanita del slider
  const [nivelVolumen, setNivelVolumen] = useState(1);
  const [mostrarPanelVolumen, setMostrarPanelVolumen] = useState(false);
  const volumenPrevioRef = useRef(1);

  const [mostrarSubtitulo, setMostrarSubtitulo] = useState(true);
  const [subtituloActual, setSubtituloActual] = useState("");

  // Controla el fundido a oscuro al cambiar de escena
  const [transicionando, setTransicionando] = useState(false);

  // ---------------------------------------------------------------------
  // Datos: subtítulos por escena
  // ---------------------------------------------------------------------
  const subtitulosCap3 = [
    {
      inicio: 0.48,
      fin: 6.71,
      texto:
        "Steven continúa adentrándose en un lugar donde nada parece ser lo que aparenta.",
    },
    {
      inicio: 6.72,
      fin: 11.99,
      texto:
        "Las sombras esconden secretos que comienzan a revelar una verdad inquietante.",
    },
    {
      inicio: 12.0,
      fin: 16.75,
      texto: "Cada paso lo acerca más al origen de aquello que lo persigue.",
    },
    {
      inicio: 16.76,
      fin: 22.19,
      texto: "El silencio se rompe y una presencia desconocida vuelve a aparecer.",
    },
    {
      inicio: 22.2,
      fin: 29.91,
      texto: "Steven comprende que escapar ya no será tan sencillo como pensaba.",
    },
    {
      inicio: 30.36,
      fin: 33.63,
      texto: "Ahora debe enfrentarse a lo que ha estado buscando.",
    },
  ];

  const subtitulosPorEscena = {
    0: subtitulosCap3,
    1: [],
  };

  // ---------------------------------------------------------------------
  // Datos: escenas del capítulo
  // ---------------------------------------------------------------------
  const escenas = [
    { tipo: "lottie", componente: <LotieCap3 />, audio: "/audios/cap3.wav" },
    { tipo: "video", video: "/Capitulo3V.mp4" },
  ];

  // ---------------------------------------------------------------------
  // Subtítulos: sincronización con el audio
  // ---------------------------------------------------------------------
  const actualizarSubtitulo = () => {
    if (!audioRef.current) return;

    const tiempo = audioRef.current.currentTime;
    const subtitulos = subtitulosPorEscena[index] || [];

    const subtitulo = subtitulos.find(
      (s) => tiempo >= s.inicio && tiempo <= s.fin
    );

    setSubtituloActual(subtitulo ? subtitulo.texto : "");
  };

  useEffect(() => {
    const escenaActual = escenas[index];

    // Detener video
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }

    // Detener audio anterior
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }

    setPlay(false);
    setSubtituloActual("");

    // Reproducir audio de la escena Lottie
    if (escenaActual.tipo === "lottie" && escenaActual.audio) {
      audioRef.current.src = escenaActual.audio;
      audioRef.current.currentTime = 0;
      audioRef.current.volume = nivelVolumen;

      audioRef.current.play().catch((error) => {
        console.log("El audio no pudo reproducirse automáticamente:", error);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index]);

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = nivelVolumen;
    if (videoRef.current) videoRef.current.volume = nivelVolumen;
  }, [nivelVolumen]);

  // ---------------------------------------------------------------------
  // Navegación entre escenas, con transición a oscuro
  // ---------------------------------------------------------------------
  const cambiarEscena = (nuevoIndex) => {
    if (nuevoIndex < 0 || nuevoIndex > escenas.length - 1) return;
    if (nuevoIndex === index) return;

    // 1) Se oscurece la escena actual (fade-out)
    setTransicionando(true);

    setTimeout(() => {
      // 2) Se cambia el contenido mientras está oscuro
      setIndex(nuevoIndex);
      setPlay(false);
      setSubtituloActual("");

      // 3) Aparece la nueva escena (fade-in)
      setTransicionando(false);
    }, DURACION_TRANSICION);
  };

  const siguiente = () => cambiarEscena(index + 1);
  const anterior = () => cambiarEscena(index - 1);

  // ---------------------------------------------------------------------
  // Video: play / pause
  // ---------------------------------------------------------------------
  const handlePlayPause = () => {
    if (!videoRef.current) return;

    if (videoRef.current.paused) {
      videoRef.current.play();
      setPlay(true);
    } else {
      videoRef.current.pause();
      setPlay(false);
    }
  };

  // ---------------------------------------------------------------------
  // Volumen: slider manual + mute con el ícono
  // ---------------------------------------------------------------------
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

  // ---------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------
  return (
    <div className="visor-container">
      {/* Barra superior: título del capítulo + íconos de opciones */}
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

      {/* Escenario: lottie o video, con transición a oscuro entre escenas */}
      <div className="visor-scene">
        <div
          className={`visor-scene-content ${
            transicionando ? "fade-out" : "fade-in"
          }`}
        >
          {escenas[index].tipo === "lottie" && (
            <div className="visor-lottie">{escenas[index].componente}</div>
          )}

          {escenas[index].tipo === "video" && (
            <div
              className="visor-video-wrapper"
              onMouseEnter={() => setShowControls(true)}
              onMouseLeave={() => setShowControls(false)}
            >
              <video
                ref={videoRef}
                className="visor-video"
                autoPlay
                playsInline
                muted={nivelVolumen === 0}
                onPlay={() => setPlay(true)}
                onPause={() => setPlay(false)}
              >
                <source src={escenas[index].video} type="video/mp4" />
                Tu navegador no soporta videos HTML5.
              </video>

              <div className={`visor-controls ${showControls ? "show" : ""}`}>
                <div className="visor-controls-bottom">
                  <button
                    className="video-btn"
                    onClick={() => {
                      if (videoRef.current) {
                        videoRef.current.currentTime = Math.max(
                          0,
                          videoRef.current.currentTime - 10
                        );
                      }
                    }}
                  >
                    <img src="/icons8-rewind-50.png" alt="Retroceder" />
                  </button>

                  <button className="video-btn play-btn" onClick={handlePlayPause}>
                    <img
                      src={play ? "/icons8-pause-50.png" : "/icons8-play-50.png"}
                      alt="Play/Pause"
                    />
                  </button>

                  <button
                    className="video-btn"
                    onClick={() => {
                      if (videoRef.current) {
                        videoRef.current.currentTime += 10;
                      }
                    }}
                  >
                    <img src="/icons8-fast-forward-50.png" alt="Avanzar" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {mostrarSubtitulo &&
            escenas[index].tipo === "lottie" &&
            subtituloActual && (
              <div className="visor-sub">
                <p>{subtituloActual}</p>
              </div>
            )}
        </div>
      </div>

      {/* Navegación inferior: flecha izquierda + barra de progreso + flecha derecha */}
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

      <audio ref={audioRef} onTimeUpdate={actualizarSubtitulo} />
    </div>
  );
}