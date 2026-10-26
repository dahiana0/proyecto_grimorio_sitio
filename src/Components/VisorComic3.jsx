import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import LotieCap3 from "./LotieCap3";

import BarraControles, { useControlGlobal, reiniciarControl, useCambioCapitulo, RUTAS_CAPITULOS } from "./Barracontroles";
import "../Styles/visorCap1.css";

// Duración de la transición a oscuro entre escenas (ms).
// Debe coincidir con el "transition" definido en .visor-scene-content en el CSS.
const DURACION_TRANSICION = 350;

// Posición de este capítulo en RUTAS_CAPITULOS (0 = capítulo I)
const CAPITULO = 2;

export default function VisorComic3({
  numeroCapitulo = "III",
  tituloCapitulo = "Presagio",
}) {
  const navigate = useNavigate();

  const videoRef = useRef(null);
  const audioRef = useRef(null);

  // ---------------------------------------------------------------------
  // Estado
  // ---------------------------------------------------------------------
  const [index, setIndex] = useState(0);

  // Eventos del <audio> (ya no se usa para el botón de pausa)
  const [, setAudioSonando] = useState(false);

  const [play, setPlay] = useState(false);
  const [showControls, setShowControls] = useState(true);

  // Volumen manual (0 a 1) y visibilidad de la ventanita del slider
  const [nivelVolumen, setNivelVolumen] = useState(1);
  const volumenPrevioRef = useRef(1);

  // Pausa general de la escena (audio + videos + animaciones)
  const [pausaUsuario, setPausaUsuario] = useState(false);
  useControlGlobal(pausaUsuario, nivelVolumen === 0);

  // Cambio de capítulo con transición a negro (sin pasar por el mapa)
  const { cortina, irA, cambiando } = useCambioCapitulo();
  const rutaSiguiente = RUTAS_CAPITULOS[CAPITULO + 1];
  const rutaAnterior = RUTAS_CAPITULOS[CAPITULO - 1];

  const [mostrarSubtitulo, setMostrarSubtitulo] = useState(true);
  const [subtituloActual, setSubtituloActual] = useState("");

  // Controla el fundido a oscuro al cambiar de escena
  const [transicionando, setTransicionando] = useState(false);

  // ---------------------------------------------------------------------
  // Datos: subtítulos por escena
  // ---------------------------------------------------------------------
  const subtitulosCap3 = [
    {
      inicio: 0.36,
      fin: 6.15,
      texto: "Algunos secretos no desaparecen, solo cambian de guardián.",
    },
    {
      inicio: 6.16,
      fin: 12.39,
      texto:
        "Stephen creyó haber dejado todo atrás, pero hay lugares que no olvidan,",
    },
    {
      inicio: 12.4,
      fin: 16.07,
      texto: "y presencias que nunca se van.",
    },
    {
      inicio: 16.08,
      fin: 22.71,
      texto:
        "Ha regresado, no por valentía, sino por esa inquietud que no lo deja en paz,",
    },
    {
      inicio: 22.72,
      fin: 26.75,
      texto: "esa sensación de que algo quedó incompleto.",
    },
    {
      inicio: 26.76,
      fin: 29.91,
      texto: "Busca respuestas, pero en este lugar.",
    },
    {
      inicio: 30.36,
      fin: 34.47,
      texto: "Las respuestas siempre tienen un precio,",
    },
    {
      inicio: 34.48,
      fin: 39.95,
      texto: "no está solo, hay alguien más, una presencia que observa.",
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
    { tipo: "video", video: "/Capitulo 3 video.mp4" },
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
      reiniciarControl();
      setPausaUsuario(false);
      setIndex(nuevoIndex);
      setPlay(false);
      setSubtituloActual("");

      // 3) Aparece la nueva escena (fade-in)
      setTransicionando(false);
    }, DURACION_TRANSICION);
  };

  const ultimaEscena = index === escenas.length - 1;
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

  // ---------------------------------------------------------------------
  // Pausa / reanudar (video, o escena completa: narración + animaciones)
  // ---------------------------------------------------------------------
  const reproduciendo =
    escenas[index].tipo === "video" ? play : !pausaUsuario;

  const alternarPausa = () => {
    if (escenas[index].tipo === "video") {
      handlePlayPause();
      return;
    }
    setPausaUsuario((p) => !p);
  };

  // ---------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------
  return (
    <div className="visor-container">
      {cortina}

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

        {/* Saltar de capítulo sin volver al mapa */}
        <div className="d-flex align-items-center gap-2">
          {rutaAnterior && (
            <button
              onClick={() => irA(rutaAnterior)}
              className="visor-btn"
              disabled={cambiando}
            >
              ← CAP. ANTERIOR
            </button>
          )}
          {rutaSiguiente && (
            <button
              onClick={() => irA(rutaSiguiente)}
              className="visor-btn"
              disabled={cambiando}
            >
              SIGUIENTE CAP. →
            </button>
          )}
        </div>
      </div>

      {/* Escenario: lottie o video, con transición a oscuro entre escenas */}
      <div
        className="visor-scene"
        style={pausaUsuario ? { pointerEvents: "none" } : undefined}
      >
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

        </div>
      </div>

      {/* Barra de controles: anterior / pausa / siguiente + progreso + volumen + subtítulos */}
      <BarraControles
        index={index}
        total={escenas.length}
        onAnterior={anterior}
        onSiguiente={ultimaEscena && rutaSiguiente ? () => irA(rutaSiguiente) : siguiente}
        siguienteDeshabilitado={ultimaEscena && !rutaSiguiente}
        siguienteDestacado={ultimaEscena && !!rutaSiguiente}
        tituloSiguiente={ultimaEscena && rutaSiguiente ? "Siguiente capítulo" : "Escena siguiente"}
        bloqueado={cambiando}
        onIr={cambiarEscena}
        reproduciendo={reproduciendo}
        onAlternarPausa={alternarPausa}
        nivelVolumen={nivelVolumen}
        onCambiarVolumen={cambiarNivelVolumen}
        onAlternarMute={alternarMute}
        mostrarSubtitulo={mostrarSubtitulo}
        onAlternarSubtitulos={() => setMostrarSubtitulo((v) => !v)}
        subtitulo={(escenas[index].tipo === "lottie" ? subtituloActual : "")}
      />

      <audio ref={audioRef}
        onPlay={() => setAudioSonando(true)}
        onPause={() => setAudioSonando(false)} onTimeUpdate={actualizarSubtitulo} />
    </div>
  );
}