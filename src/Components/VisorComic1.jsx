import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import LootieKarol from "./LootieKarol";
import LootieParte2 from "./LootieParte2";
import LootieParte3 from "./LootieParte3";

import BarraControles, { useControlGlobal, reiniciarControl, useCambioCapitulo, RUTAS_CAPITULOS, esperar, cancelarEspera } from "./Barracontroles";
import "../Styles/visorCap1.css";

const DURACION_TRANSICION = 350;

const AUDIO_PARTE3_TRAMO_B = "/audios/Narrador_2.mp3";

const VIDEO_CAP1 = "/videos/capitulo1.webm";

const CAPITULO = 0;

// Subtítulos (fuera del componente para que no se recreen en cada render)
const subtitulosKarol = [
  { inicio: 0.44, fin: 4.55, texto: "Steven Jones, un hombre de razón," },
  { inicio: 4.56, fin: 10.47, texto: "criado entre académicos, aprendió que todo tiene una explicación," },
  { inicio: 10.48, fin: 16.51, texto: "para él los mitos no existen, hasta que encontró un informe," },
  { inicio: 16.52, fin: 24.15, texto: "el museo de George Rogers, un lugar lleno de rumores y sucesos inexplicables." },
  { inicio: 24.16, fin: 30.83, texto: "Steven no cree en lo sobrenatural, pero cree en la verdad, y ahora va a buscarla." },
];

const subtitulosParte2 = [
  { inicio: 0.4, fin: 7.47, texto: "El Museo de George Rogers ha sido durante años un lugar rodeado de rumores" },
  { inicio: 7.48, fin: 13.55, texto: "historias extrañas y sucesos que nadie ha podido explicar," },
  { inicio: 13.56, fin: 18.23, texto: "muchos han intentado entenderlo y han fallado." },
  { inicio: 18.24, fin: 23.63, texto: "Hoy, Stephen Jones llega decidido a descubrir la verdad," },
  { inicio: 23.64, fin: 30.99, texto: "convencido de que todo tiene una explicación, incluso aquello que parece impocible." },
];

const subtitulosParte3 = [
  { inicio: 0.4, fin: 7.03, texto: "En el corazón del museo donde lo extraño toma forma," },
  { inicio: 7.04, fin: 12.87, texto: "Stephen Jones, finalmente se enfrenta al hombre detrás de todo." },
];

const subtitulosParte3B = [
  { inicio: 0.68, fin: 8.55, texto: "George Rogers, el guardián de secretos que muchos han intentado revelar sin éxito." },
];

const subtitulosPorEscena = {
  0: subtitulosKarol,
  1: subtitulosParte2,
  2: subtitulosParte3,
};

export default function VisorCapitulo({
  numeroCapitulo = "I",
  tituloCapitulo = "Umbral",
}) {
  const navigate = useNavigate();

  const videoRef = useRef(null);
  const audioRef = useRef(null);

  const tramoNarradorRef = useRef("A");

  const respaldoTimersRef = useRef([]);
  const limpiarRespaldo = () => {
    respaldoTimersRef.current.forEach(cancelarEspera);
    respaldoTimersRef.current = [];
  };

  const reintentoRef = useRef(null);

  const cancelarReintento = () => {
    if (reintentoRef.current) {
      window.removeEventListener("pointerdown", reintentoRef.current);
      window.removeEventListener("keydown", reintentoRef.current);
      reintentoRef.current = null;
    }
  };

  const reproducirConReintento = (alFallar) => {
    const audio = audioRef.current;
    if (!audio) return;

    cancelarReintento();

    audio.play().catch((error) => {
      if (error && error.name === "AbortError") return;

      if (error && error.name === "NotAllowedError") {
        const reintentar = () => {
          cancelarReintento();
          if (audioRef.current) audioRef.current.play().catch(() => { });
        };
        reintentoRef.current = reintentar;
        window.addEventListener("pointerdown", reintentar, { once: true });
        window.addEventListener("keydown", reintentar, { once: true });
        return;
      }

      // El audio no cargó (ruta mala, archivo no encontrado en Vercel, etc.)
      console.error("No se pudo reproducir el audio:", audio.src, error);
      if (alFallar) alFallar(error);
    });
  };

  const [index, setIndex] = useState(0);

  const [, setAudioSonando] = useState(false);
  const [mostrarSubtitulo, setMostrarSubtitulo] = useState(true);

  const [nivelVolumen, setNivelVolumen] = useState(1);
  const volumenPrevioRef = useRef(1);

  const [play, setPlay] = useState(false);
  const [showControls, setShowControls] = useState(true);

  const [pausaUsuario, setPausaUsuario] = useState(false);
  useControlGlobal(pausaUsuario, nivelVolumen === 0);

  const { cortina, irA, cambiando } = useCambioCapitulo();
  const rutaSiguiente = RUTAS_CAPITULOS[CAPITULO + 1];
  const rutaAnterior = RUTAS_CAPITULOS[CAPITULO - 1];

  const [subtituloActual, setSubtituloActual] = useState("");
  const [subtituloDialogo, setSubtituloDialogo] = useState("");

  const [transicionando, setTransicionando] = useState(false);

  // Cuando el narrador toma el relevo de los diálogos, se limpian los
  // subtítulos de respaldo para que no se pisen
  const pausarNarrador = () => {
    cancelarReintento();
    limpiarRespaldo();
    if (audioRef.current) audioRef.current.pause();
    setSubtituloActual("");
  };

  // Respaldo: muestra los subtítulos con temporizadores si el audio no se pudo reproducir
  const mostrarSubtitulosSinAudio = (lista) => {
    limpiarRespaldo();
    lista.forEach((s) => {
      respaldoTimersRef.current.push(
        esperar(() => setSubtituloActual(s.texto), s.inicio * 1000),
        esperar(() => setSubtituloActual(""), s.fin * 1000)
      );
    });
  };

  const reanudarNarrador = () => {
    const audio = audioRef.current;
    if (!audio) return;

    tramoNarradorRef.current = "B";
    audio.src = AUDIO_PARTE3_TRAMO_B;
    audio.currentTime = 0;

    reproducirConReintento(() => mostrarSubtitulosSinAudio(subtitulosParte3B));
  };

  const escenas = [
    { tipo: "lottie", componente: <LootieKarol />, audio: "/audios/Cap1P1.wav" },
    { tipo: "lottie", componente: <LootieParte2 />, audio: "/audios/Cap1P2.wav" },
    {
      tipo: "lottie",
      componente: (
        <LootieParte3
          volumen={nivelVolumen}
          onDialogoInicio={pausarNarrador}
          onDialogoFin={reanudarNarrador}
          onSubtitulo={setSubtituloDialogo}
        />
      ),
      audio: "/audios/Narrador_1.mp3",
    },
    { tipo: "video", video: VIDEO_CAP1 },
  ];

  const actualizarSubtitulo = () => {
    if (!audioRef.current) return;

    const tiempo = audioRef.current.currentTime;

    let subtitulos = subtitulosPorEscena[index] || [];
    if (index === 2 && tramoNarradorRef.current === "B") {
      subtitulos = subtitulosParte3B;
    }

    const subtitulo = subtitulos.find(
      (s) => tiempo >= s.inicio && tiempo <= s.fin
    );

    setSubtituloActual(subtitulo ? subtitulo.texto : "");
  };

  useEffect(() => {
    if (!audioRef.current) return;

    setSubtituloDialogo("");
    tramoNarradorRef.current = "A";
    limpiarRespaldo();
    cancelarReintento();

    const escenaActual = escenas[index];

    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }

    if (escenaActual.tipo === "lottie" && escenaActual.audio) {
      audioRef.current.src = escenaActual.audio;
      audioRef.current.currentTime = 0;

      reproducirConReintento(() =>
        mostrarSubtitulosSinAudio(subtitulosPorEscena[index] || [])
      );
    } else {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setSubtituloActual("");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index]);

  useEffect(() => {
    return () => {
      limpiarRespaldo();
      cancelarReintento();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = nivelVolumen;
    if (videoRef.current) videoRef.current.volume = nivelVolumen;
  }, [nivelVolumen]);

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

  const cambiarEscena = (nuevoIndex) => {
    if (nuevoIndex < 0 || nuevoIndex > escenas.length - 1) return;
    if (nuevoIndex === index) return;

    setTransicionando(true);

    setTimeout(() => {
      reiniciarControl();
      setPausaUsuario(false);
      setIndex(nuevoIndex);
      setPlay(false);

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
          className={`visor-scene-content ${transicionando ? "fade-out" : "fade-in"}`}
        >
          {escenas[index].tipo === "lottie" ? (
            <div className="visor-lottie">{escenas[index].componente}</div>
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
        subtitulo={escenas[index].tipo === "lottie" ? (subtituloDialogo || subtituloActual) : ""}
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