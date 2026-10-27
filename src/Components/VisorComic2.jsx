import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import LotieCap2 from "./LotieCap2";

import BarraControles, { useControlGlobal, reiniciarControl, useCambioCapitulo, RUTAS_CAPITULOS } from "./Barracontroles";
import "../Styles/visorCap1.css";


const DURACION_TRANSICION = 350;


const CAPITULO = 1;

export default function VisorComic2({
  numeroCapitulo = "II",
  tituloCapitulo = "Reliquias",
}) {
  const navigate = useNavigate();

  const videoRef = useRef(null);
  const audioRef = useRef(null);


  const [index, setIndex] = useState(0);


  const [, setAudioSonando] = useState(false);

  const [play, setPlay] = useState(false);
  const [showControls, setShowControls] = useState(true);


  const [nivelVolumen, setNivelVolumen] = useState(1);
  const volumenPrevioRef = useRef(1);


  const [pausaUsuario, setPausaUsuario] = useState(false);
  useControlGlobal(pausaUsuario, nivelVolumen === 0);


  const { cortina, irA, cambiando } = useCambioCapitulo();
  const rutaSiguiente = RUTAS_CAPITULOS[CAPITULO + 1];
  const rutaAnterior = RUTAS_CAPITULOS[CAPITULO - 1];

  const [mostrarSubtitulo, setMostrarSubtitulo] = useState(true);
  const [subtituloActual, setSubtituloActual] = useState("");


  const [transicionando, setTransicionando] = useState(false);


  const subtitulosCap = [
    { inicio: 0.48, fin: 6.71, texto: "Steven cruzó un límite donde la curiosidad deja de ser segura," },
    { inicio: 6.72, fin: 11.99, texto: "se enfrenta a algo inexplicable que lo observa en la oscuridad," },
    { inicio: 12.0, fin: 16.75, texto: "cada paso lo acerca más a una verdad peligrosa," },
    { inicio: 16.76, fin: 22.19, texto: "el ambiente se vuelve pesado y las sombras parecen seguirlo," },
    { inicio: 22.2, fin: 29.91, texto: "el miedo ya no es una idea, es una presencia constante, ahora no solo busca." },
    { inicio: 30.36, fin: 33.63, texto: "Estas, lucha por sobrevivir." },
  ];

  const subtitulosPorEscena = {
    0: subtitulosCap,
    1: [],
  };


  const escenas = [
    { tipo: "lottie", componente: <LotieCap2 />, audio: "/audios/cap2.wav" },
    { tipo: "video", video: "/videos/capitulo2.webm" },
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
    const escenaActual = escenas[index];


    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }


    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }

    setPlay(false);
    setSubtituloActual("");


    if (escenaActual.tipo === "lottie" && escenaActual.audio) {
      audioRef.current.src = escenaActual.audio;
      audioRef.current.currentTime = 0;
      audioRef.current.volume = nivelVolumen;

      audioRef.current.play().catch((error) => {
        console.log("El audio no pudo reproducirse automáticamente:", error);
      });
    }

  }, [index]);

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = nivelVolumen;
    if (videoRef.current) videoRef.current.volume = nivelVolumen;
  }, [nivelVolumen]);


  const cambiarEscena = (nuevoIndex) => {
    if (nuevoIndex < 0 || nuevoIndex > escenas.length - 1) return;
    if (nuevoIndex === index) return;


    setTransicionando(true);

    setTimeout(() => {

      reiniciarControl();
      setPausaUsuario(false);
      setIndex(nuevoIndex);
      setPlay(false);
      setSubtituloActual("");


      setTransicionando(false);
    }, DURACION_TRANSICION);
  };

  const ultimaEscena = index === escenas.length - 1;
  const siguiente = () => cambiarEscena(index + 1);
  const anterior = () => cambiarEscena(index - 1);


  const handlePlayPause = () => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      video.play().catch((error) => console.error("No se pudo reproducir el video:", error));
    } else {
      video.pause();
    }
  };


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


  const reproduciendo =
    escenas[index].tipo === "video" ? play : !pausaUsuario;

  const alternarPausa = () => {
    if (escenas[index].tipo === "video") {
      handlePlayPause();
      return;
    }
    setPausaUsuario((p) => !p);
  };


  return (
    <div className="visor-container">
      {cortina}


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


      <div
        className="visor-scene"
        style={pausaUsuario ? { pointerEvents: "none" } : undefined}
      >
        <div
          className={`visor-scene-content ${transicionando ? "fade-out" : "fade-in"
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
                preload="auto"
                muted={nivelVolumen === 0}
                onPlay={() => setPlay(true)}
                onPause={() => setPlay(false)}
              >
                <source src={escenas[index].video} type="video/webm" />
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
        subtitulo={escenas[index].tipo === "lottie" ? subtituloActual : ""}
      />

      <audio
        ref={audioRef}
        onPlay={() => setAudioSonando(true)}
        onPause={() => setAudioSonando(false)}
        onTimeUpdate={actualizarSubtitulo}
      />
    </div>
  );
}