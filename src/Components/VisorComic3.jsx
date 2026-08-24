import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import LotieCap3 from "./LotieCap3";

import "../Styles/visorCap1.css";

export default function VisorComic3({
  numeroCapitulo = "III",
  tituloCapitulo = "CAPÍTULO 3",
}) {
  const navigate = useNavigate();

  const videoRef = useRef(null);
  const audioRef = useRef(null);

  const [index, setIndex] = useState(0);

  const [play, setPlay] = useState(false);
  const [showControls, setShowControls] = useState(true);

  const [volumen, setVolumen] = useState(true);

  const [mostrarSubtitulo, setMostrarSubtitulo] = useState(true);
  const [subtituloActual, setSubtituloActual] = useState("");

  // =========================
  // SUBTÍTULOS CAPÍTULO 3
  // =========================

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
      texto:
        "Cada paso lo acerca más al origen de aquello que lo persigue.",
    },
    {
      inicio: 16.76,
      fin: 22.19,
      texto:
        "El silencio se rompe y una presencia desconocida vuelve a aparecer.",
    },
    {
      inicio: 22.2,
      fin: 29.91,
      texto:
        "Steven comprende que escapar ya no será tan sencillo como pensaba.",
    },
    {
      inicio: 30.36,
      fin: 33.63,
      texto:
        "Ahora debe enfrentarse a lo que ha estado buscando.",
    },
  ];

  const subtitulosPorEscena = {
    0: subtitulosCap3,
    1: [],
  };

  // =========================
  // ESCENAS
  // =========================

  const escenas = [
    {
      tipo: "lottie",
      componente: <LotieCap3 />,
      audio: "/audios/cap3.wav",
    },
    {
      tipo: "video",
      video: "/Capitulo3V.mp4",
    },
  ];

  // =========================
  // ACTUALIZAR SUBTÍTULOS
  // =========================

  const actualizarSubtitulo = () => {
    if (!audioRef.current) return;

    const tiempo = audioRef.current.currentTime;

    const subtitulos = subtitulosPorEscena[index] || [];

    const subtitulo = subtitulos.find(
      (s) => tiempo >= s.inicio && tiempo <= s.fin
    );

    setSubtituloActual(subtitulo ? subtitulo.texto : "");
  };

  // =========================
  // CAMBIO DE ESCENA
  // =========================

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
      audioRef.current.muted = !volumen;

      audioRef.current.play().catch((error) => {
        console.log(
          "El audio no pudo reproducirse automáticamente:",
          error
        );
      });
    }
  }, [index]);

  // =========================
  // VOLUMEN
  // =========================

  useEffect(() => {
    if (!audioRef.current) return;

    audioRef.current.muted = !volumen;
  }, [volumen]);

  // =========================
  // SIGUIENTE
  // =========================

  const siguiente = () => {
    if (index < escenas.length - 1) {
      setIndex(index + 1);
      setPlay(false);
      setSubtituloActual("");
    }
  };

  // =========================
  // ANTERIOR
  // =========================

  const anterior = () => {
    if (index > 0) {
      setIndex(index - 1);
      setPlay(false);
      setSubtituloActual("");
    }
  };

  // =========================
  // PLAY / PAUSA
  // =========================

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

  // =========================
  // CAMBIAR VOLUMEN
  // =========================

  const cambiarVolumen = () => {
    const nuevoVolumen = !volumen;

    setVolumen(nuevoVolumen);

    if (audioRef.current) {
      audioRef.current.muted = !nuevoVolumen;
    }

    if (videoRef.current) {
      videoRef.current.muted = !nuevoVolumen;
    }
  };

  // =========================
  // SUBTÍTULOS
  // =========================

  const cambiarSubtitulos = () => {
    setMostrarSubtitulo((prev) => !prev);
  };

  return (
    <div className="visor-container">

      {/* =========================
          BARRA SUPERIOR
      ========================= */}

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

            <span className="visor-cap">
              CAPÍTULO {numeroCapitulo}
            </span>

            <span className="visor-title">
              — {tituloCapitulo}
            </span>

          </div>

        </div>

        {/* =========================
            ICONOS
        ========================= */}

        <div className="d-flex align-items-center gap-3">

          <img
            onClick={cambiarVolumen}
            src={
              volumen
                ? "./volume-2 (2).svg"
                : "./volume-3.svg"
            }
            alt="Volumen"
            className={`visor-icon ${!volumen ? "off" : ""}`}
          />

          <img
            onClick={cambiarSubtitulos}
            src={
              mostrarSubtitulo
                ? "./subtitles.svg"
                : "./subtitles-off.svg"
            }
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

      {/* =========================
          ESCENA
      ========================= */}

      <div className="visor-scene">

        {/* =========================
            LOTTIE
        ========================= */}

        {escenas[index].tipo === "lottie" && (

          <div className="visor-lottie">

            {escenas[index].componente}

          </div>

        )}

        {/* =========================
            VIDEO
        ========================= */}

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
              muted={!volumen}
              onPlay={() => setPlay(true)}
              onPause={() => setPlay(false)}
            >

              <source
                src={escenas[index].video}
                type="video/mp4"
              />

              Tu navegador no soporta videos HTML5.

            </video>

            {/* =========================
                CONTROLES VIDEO
            ========================= */}

            <div
              className={`visor-controls ${
                showControls ? "show" : ""
              }`}
            >

              <div className="visor-controls-bottom">

                {/* RETROCEDER */}

                <button
                  className="video-btn"
                  onClick={() => {

                    if (videoRef.current) {

                      videoRef.current.currentTime =
                        Math.max(
                          0,
                          videoRef.current.currentTime - 10
                        );

                    }

                  }}
                >

                  <img
                    src="/icons8-rewind-50.png"
                    alt="Retroceder"
                  />

                </button>

                {/* PLAY / PAUSA */}

                <button
                  className="video-btn play-btn"
                  onClick={handlePlayPause}
                >

                  <img
                    src={
                      play
                        ? "/icons8-pause-50.png"
                        : "/icons8-play-50.png"
                    }
                    alt="Play/Pause"
                  />

                </button>

                {/* AVANZAR */}

                <button
                  className="video-btn"
                  onClick={() => {

                    if (videoRef.current) {

                      videoRef.current.currentTime += 10;

                    }

                  }}
                >

                  <img
                    src="/icons8-fast-forward-50.png"
                    alt="Avanzar"
                  />

                </button>

              </div>

            </div>

          </div>

        )}

        {/* =========================
            SUBTÍTULOS
        ========================= */}

        {mostrarSubtitulo &&
          escenas[index].tipo === "lottie" &&
          subtituloActual && (

            <div className="visor-sub">

              <p>
                {subtituloActual}
              </p>

            </div>

          )}

        {/* =========================
            FLECHA ANTERIOR
        ========================= */}

        <img
          onClick={anterior}
          src="./circle-chevron-left.svg"
          alt="Anterior"
          className={`visor-arrow left ${
            index === 0 ? "disabled" : ""
          }`}
        />

        {/* =========================
            FLECHA SIGUIENTE
        ========================= */}

        <img
          onClick={siguiente}
          src="./circle-chevron-right.svg"
          alt="Siguiente"
          className={`visor-arrow right ${
            index === escenas.length - 1
              ? "disabled"
              : ""
          }`}
        />

      </div>

      {/* =========================
          PUNTOS
      ========================= */}

      <div className="visor-dots">

        {escenas.map((_, i) => (

          <div
            key={i}
            className={`dot ${
              index === i ? "active" : ""
            }`}
          />

        ))}

      </div>

      {/* =========================
          AUDIO
      ========================= */}

      <audio
        ref={audioRef}
        onTimeUpdate={actualizarSubtitulo}
      />

    </div>
  );
}