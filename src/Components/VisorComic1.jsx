import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import LootieKarol from "./LootieKarol";
import LootieParte2 from "./LootieParte2";
import LootieParte3 from "./LootieParte3";

import "../Styles/visorCap1.css";

export default function VisorCapitulo({
  numeroCapitulo = "I",
  tituloCapitulo = "UMBRAL",
}) {
  const navigate = useNavigate();

  const videoRef = useRef(null);
  const audioRef = useRef(null);

  const [index, setIndex] = useState(0);
  const [mostrarSubtitulo, setMostrarSubtitulo] = useState(true);
  const [volumen, setVolumen] = useState(true);

  const [play, setPlay] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showControls, setShowControls] = useState(true);

  const [subtituloActual, setSubtituloActual] = useState("");

  const subtitulosKarol = [
    {
      inicio: 0.44,
      fin: 4.55,
      texto: "Steven Jones, un hombre de razón,",
    },
    {
      inicio: 4.56,
      fin: 10.47,
      texto:
        "criado entre académicos, aprendió que todo tiene una explicación,",
    },
    {
      inicio: 10.48,
      fin: 16.51,
      texto:
        "para él los mitos no existen, hasta que encontró un informe,",
    },
    {
      inicio: 16.52,
      fin: 24.15,
      texto:
        "el museo de George Rogers, un lugar lleno de rumores y sucesos inexplicables.",
    },
    {
      inicio: 24.16,
      fin: 30.83,
      texto:
        "Steven no cree en lo sobrenatural, pero cree en la verdad, y ahora va a buscarla.",
    },
  ];

  const subtitulosParte2 = [
    {
      inicio: 0.4,
      fin: 7.47,
      texto:
        "El Museo de George Rogers ha sido durante años un lugar rodeado de rumores",
    },
    {
      inicio: 7.48,
      fin: 13.55,
      texto:
        "historias extrañas y sucesos que nadie ha podido explicar,",
    },
    {
      inicio: 13.56,
      fin: 18.23,
      texto: "muchos han intentado entenderlo y han fallado.",
    },
    {
      inicio: 18.24,
      fin: 23.63,
      texto:
        "Hoy, Stephen Jones llega decidido a descubrir la verdad,",
    },
    {
      inicio: 23.64,
      fin: 30.99,
      texto:
        "convencido de que todo tiene una explicación, incluso aquello que parece impocible.",
    },
  ];

  const subtitulosParte3 = [];

  const subtitulosPorEscena = {
    0: subtitulosKarol,
    1: subtitulosParte2,
    2: subtitulosParte3,
  };

  const escenas = [
    {
      tipo: "lottie",
      componente: <LootieKarol />,
      audio: "/audios/Cap1P1.wav",
    },
    {
      tipo: "lottie",
      componente: <LootieParte2 />,
      audio: "/audios/Cap1P2.wav",
    },
    {
      tipo: "lottie",
      componente: <LootieParte3 />,
      audio: "/audios/Cap1P3.wav",
    },
    {
      tipo: "video",
      video: "/Capitulo1V.mp4",
    },
  ];

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
    if (!audioRef.current) return;

    const escenaActual = escenas[index];

    if (escenaActual.tipo === "lottie" && escenaActual.audio) {
      audioRef.current.src = escenaActual.audio;
      audioRef.current.currentTime = 0;

      audioRef.current.play().catch((error) => {
        console.log("El audio no pudo reproducirse automáticamente:", error);
      });
    } else {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setSubtituloActual("");
    }
  }, [index]);

  useEffect(() => {
    if (!audioRef.current) return;

    audioRef.current.muted = !volumen;
  }, [volumen]);

  const siguiente = () => {
    if (index < escenas.length - 1) {
      setIndex(index + 1);
      setPlay(false);
      setProgress(0);
    }
  };

  const anterior = () => {
    if (index > 0) {
      setIndex(index - 1);
      setPlay(false);
      setProgress(0);
    }
  };

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

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;

    const value =
      (videoRef.current.currentTime / videoRef.current.duration) * 100;

    setProgress(value || 0);
  };

  const handleProgressChange = (e) => {
    if (!videoRef.current) return;

    const value = e.target.value;

    setProgress(value);

    videoRef.current.currentTime =
      (value / 100) * videoRef.current.duration;
  };

  return (
    <div className="visor-container">

     
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

      
        <div className="d-flex align-items-center gap-3">

          {/* VOLUMEN */}
          <img
            onClick={() => setVolumen(!volumen)}
            src={
              volumen
                ? "./volume-2 (2).svg"
                : "./volume-3.svg"
            }
            alt="Volumen"
            className={`visor-icon ${!volumen ? "off" : ""}`}
          />

        
          <img
            onClick={() =>
              setMostrarSubtitulo(!mostrarSubtitulo)
            }
            src={
              mostrarSubtitulo
                ? "./subtitles.svg"
                : "./subtitles-off.svg"
            }
            alt="Subtítulos"
            className={`visor-icon ${
              !mostrarSubtitulo ? "off" : ""
            }`}
          />

         
          <img
            onClick={() =>
              navigate("/archivo")
            }
            src="./Archivo.png"
            alt="Interacciones guardadas"
            className="visor-iconnn"
          />

        </div>
      </div>

   
      <div className="visor-scene">

        {escenas[index].tipo === "lottie" ? (

          <div className="visor-lottie">
            {escenas[index].componente}
          </div>

        ) : (

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
              onTimeUpdate={handleTimeUpdate}
              onPlay={() => setPlay(true)}
              onPause={() => setPlay(false)}
            >
              <source
                src={escenas[index].video}
                type="video/mp4"
              />
            </video>

     
            <div
              className={`visor-controls ${
                showControls ? "show" : ""
              }`}
            >

              <div className="visor-controls-bottom">

          
                <button
                  className="video-btn"
                  onClick={() => {
                    if (videoRef.current) {
                      videoRef.current.currentTime -= 10;
                    }
                  }}
                >
                  <img
                    src="/icons8-rewind-50.png"
                    alt="Retroceder"
                  />
                </button>

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

  
        {mostrarSubtitulo &&
          escenas[index].tipo === "lottie" && (
            <div className="visor-sub">
              <p>{subtituloActual}</p>
            </div>
          )}

        <img
          onClick={anterior}
          src="./circle-chevron-left.svg"
          alt="Anterior"
          className={`visor-arrow left ${
            index === 0 ? "disabled" : ""
          }`}
        />

  
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

      {/* PUNTOS */}
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

      {/* AUDIO */}
      <audio
        ref={audioRef}
        onTimeUpdate={actualizarSubtitulo}
      />

    </div>
  );
}