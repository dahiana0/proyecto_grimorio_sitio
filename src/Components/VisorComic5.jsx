import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import LotieCap5A from "./LotieCap5A";
import LotieCap5B from "./LotieCap5B";
import LotieCap5F from "./LotieCap5F.jsx"; // Orabona (escena 3)
import LotieCap5C from "./LotieCap5C";
import LotieCap5D from "./LotieCap5D";
import LotieCap5E from "./LotieCap5E";
import "../Styles/visorCap1.css";

const DURACION_TRANSICION = 350;

// Orabona (escena 3): el audio 1 suena al entrar a la escena y el audio 2
// entra INICIO_ORABONA_2 segundos después de que arranca el audio 1.
const AUDIO_ORABONA_1 = "/audios/ora1.wav";
const AUDIO_ORABONA_2 = "/audios/ora2.wav";
const INICIO_ORABONA_2 = 19.18;

// Audio de la puerta (LotieCap5C, escena 4).
// Copia tu archivo a public/audios/ y cambia solo el nombre aquí.
const AUDIO_5C = "/audios/AUDIO_5C.wav";

export default function VisorComic5({
  numeroCapitulo = "V",
  tituloCapitulo = "La Abominación",
}) {
  const navigate = useNavigate();

  // Audio del narrador
  const audioRef = useRef(null);

  // Tramo del narrador: "A" (primer audio de la escena) o "B" (segundo audio).
  // Es un ref para que siempre tenga el valor actual al sincronizar subtítulos.
  const tramoRef = useRef("A");

  // Temporizador que lanza el audio 2 de Orabona
  const timerTramoBRef = useRef(null);
  const limpiarTimerTramoB = () => {
    if (timerTramoBRef.current) {
      clearTimeout(timerTramoBRef.current);
      timerTramoBRef.current = null;
    }
  };

  const [index, setIndex] = useState(0);

  const [nivelVolumen, setNivelVolumen] = useState(1);
  const [mostrarPanelVolumen, setMostrarPanelVolumen] = useState(false);
  const volumenPrevioRef = useRef(1);

  const [mostrarSubtitulo, setMostrarSubtitulo] = useState(true);
  const [subtituloActual, setSubtituloActual] = useState("");

  const [transicionando, setTransicionando] = useState(false);

  // true si el navegador bloqueó la reproducción automática
  const [audioBloqueado, setAudioBloqueado] = useState(false);

  // La clave es el índice de la escena (empieza en 0).
  // Son los subtítulos del PRIMER audio de cada escena.
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
      {
        inicio: 0.36,
        fin: 6.63,
        texto: "Algunos secretos no desaparecen, solo cambian de guardián.",
      },
      {
        inicio: 6.64,
        fin: 13.15,
        texto:
          "Steven ha regresado, guiado por preguntas que nunca tuvieron respuesta,",
      },
      {
        inicio: 13.16,
        fin: 17.87,
        texto: "pero este lugar ya no es el mismo, hay algo más,",
      },
      {
        inicio: 17.88,
        fin: 25.75,
        texto:
          "una presencia que observa, que espera, que parece conocer cada paso que da.",
      },
      {
        inicio: 25.76,
        fin: 29.91,
        texto: "No es casualidad que esté aquí, nunca lo fue.",
      },
      {
        inicio: 30.36,
        fin: 33.19,
        texto: "Cada puerta, cada susurro,",
      },
      {
        inicio: 33.2,
        fin: 38.39,
        texto: "cada sombra lo ha estado guiando hacia este momento.",
      },
    ],
    // Escena 3: Orabona, audio 1 (tiempos relativos al inicio de ora1.wav)
    2: [
      {
        inicio: 0.32,
        fin: 5.99,
        texto: "Es una pena, no cree, tanta belleza acumulando polvo.",
      },
      {
        inicio: 6.0,
        fin: 10.99,
        texto: "Rogers no está, se ha ido de viaje, Jones,",
      },
      {
        inicio: 11.0,
        fin: 17.51,
        texto: "pero sabía que vendría, sabía que esa estatua no le dejaría dormir.",
      },
    ],
    // Escena 4: puerta (LotieCap5C)
    3: [
      {
        inicio: 0.48,
        fin: 5.31,
        texto: "Al final de cada camino siempre hay una puerta,",
      },
      {
        inicio: 5.32,
        fin: 9.15,
        texto: "y algunas nunca debieron abrirse.",
      },
      {
        inicio: 9.16,
        fin: 12.35,
        texto: "Stephen ha llegado hasta aquí siguiendo la verdad,",
      },
      {
        inicio: 12.36,
        fin: 17.27,
        texto: "guiado por respuestas que parecían estar al alcance de su mano,",
      },
      {
        inicio: 17.28,
        fin: 22.63,
        texto: "pero lo que está a punto de encontrar no es una simple explicación,",
      },
      {
        inicio: 22.64,
        fin: 29.91,
        texto: "es el origen de todo aquello que intentó negar, la raíz de un misterio que nunca",
      },
    ],
    // Escena 5: LotieCap5D
    4: [
      {
        inicio: 0.52,
        fin: 5.15,
        texto: "No todo lo que parece muerto lo está,",
      },
      {
        inicio: 5.16,
        fin: 10.51,
        texto: "en el corazón del museo, el silencio pesa más que nunca,",
      },
      {
        inicio: 10.52,
        fin: 16.39,
        texto: "como si las paredes guardaran recuerdos que se resisten desaparecer,",
      },
      {
        inicio: 16.4,
        fin: 19.79,
        texto: "la verdad finalmente se revela,",
      },
      {
        inicio: 19.8,
        fin: 25.27,
        texto: "pero no es una explicación, es una advertencia.",
      },
      {
        inicio: 25.28,
        fin: 29.91,
        texto: "Steven ha llegado demasiado lejos, siguiendo pistas que lo...",
      },
      {
        inicio: 30.2,
        fin: 33.11,
        texto: "empujaron hasta este punto sin retorno.",
      },
    ],
    // Escena 6: LotieCap5E
    5: [
      {
        inicio: 0.28,
        fin: 4.27,
        texto: "Hay verdades que la mente no puede soportar,",
      },
      {
        inicio: 4.28,
        fin: 9.59,
        texto: "y horrores que no necesitan moverse para destruirlo todo.",
      },
      {
        inicio: 9.6,
        fin: 17.03,
        texto: "Stephen buscó respuestas durante tanto tiempo, convencido de que podría",
      },
      {
        inicio: 17.04,
        fin: 22.51,
        texto: "pero lo único que encontró fue el final de su propia razón.",
      },
      {
        inicio: 22.52,
        fin: 26.21,
        texto: "Cada paso lo acercó más a algo que no debía ve",
      },
      {
        inicio: 26.22,
        fin: 29.91,
        texto: "r, a una realidad que rompe cualquier lógica.",
      },
    ],
  };

  // Subtítulos del SEGUNDO audio (tramo B) de las escenas que lo tienen.
  // Sus tiempos son relativos al inicio de ese audio.
  const subtitulosTramoB = {
    // Escena 3: Orabona, audio 2 (ora2.wav)
    2: [
      {
        inicio: 0.48,
        fin: 8.27,
        texto: "Dicen que está maldita, una palabra tonta para algo tan poderoso.",
      },
      {
        inicio: 8.28,
        fin: 14.51,
        texto: "Rogers la entiende, él me autorizó mostrarle el camino.",
      },
      {
        inicio: 14.52,
        fin: 18.51,
        texto: "Acompáñeme. Ella lo está esperando.",
      },
    ],
  };

  // Cada escena tiene su animación y su audio de narrador
  // Los archivos van en: public/audios/
  // "tramoB": segundo audio que entra N segundos después de arrancar el primero
  const escenas = [
    { tipo: "lottie", componente: <LotieCap5A />, audio: "/audios/NarradorCP1.wav" },
    { tipo: "lottie", componente: <LotieCap5B />, audio: "/audios/Narrador 5-2.wav" },
    {
      // Orabona
      tipo: "lottie",
      componente: <LotieCap5F />,
      audio: AUDIO_ORABONA_1,
      tramoB: { audio: AUDIO_ORABONA_2, inicio: INICIO_ORABONA_2 },
    },
    // Puerta (5C): subtítulos en la clave 3 de subtitulosPorEscena
    { tipo: "lottie", componente: <LotieCap5C />, audio: "/audios/Narrador5c.wav" },
    { tipo: "lottie", componente: <LotieCap5D />, audio: "/audios/narrador5D.wav" },
    { tipo: "lottie", componente: <LotieCap5E />, audio: "/audios/Narrador5E.wav" },
  ];

  // Sincroniza el subtítulo con el tiempo actual del audio
  const actualizarSubtitulo = () => {
    if (!audioRef.current) return;

    const tiempo = audioRef.current.currentTime;

    // Si está sonando el tramo B se usa su lista; si no, la del primer audio
    let subtitulos = subtitulosPorEscena[index] || [];
    if (tramoRef.current === "B" && subtitulosTramoB[index]) {
      subtitulos = subtitulosTramoB[index];
    }

    const subtitulo = subtitulos.find(
      (s) => tiempo >= s.inicio && tiempo <= s.fin
    );

    setSubtituloActual(subtitulo ? subtitulo.texto : "");
  };

  // Programa el segundo audio de la escena (si lo tiene).
  // Se cuenta desde que el primer audio realmente arranca.
  const programarTramoB = (escena) => {
    if (!escena || !escena.tramoB || timerTramoBRef.current) return;

    const { audio: srcB, inicio } = escena.tramoB;

    timerTramoBRef.current = setTimeout(() => {
      timerTramoBRef.current = null;
      const audio = audioRef.current;
      if (!audio) return;

      tramoRef.current = "B";
      audio.src = srcB;
      audio.currentTime = 0;
      audio.volume = volumenActualRef.current;
      audio.play().catch((error) => {
        console.log("No se pudo reproducir el segundo audio:", error);
        setAudioBloqueado(true);
      });
    }, inicio * 1000);
  };

  // Volumen siempre actualizado para usarlo dentro de temporizadores
  const volumenActualRef = useRef(1);
  volumenActualRef.current = nivelVolumen;

  // Intenta reproducir el audio; si el navegador lo bloquea, muestra el botón
  const reproducirAudio = () => {
    if (!audioRef.current) return;

    audioRef.current
      .play()
      .then(() => {
        setAudioBloqueado(false);
        // Al arrancar el primer audio se empieza a contar el segundo
        if (tramoRef.current === "A") programarTramoB(escenas[index]);
      })
      .catch((error) => {
        console.log("El audio no pudo reproducirse automáticamente:", error);
        setAudioBloqueado(true);
      });
  };

  // Al cambiar de escena: reinicia y reproduce el audio de la nueva
  useEffect(() => {
    const escenaActual = escenas[index];

    limpiarTimerTramoB();
    tramoRef.current = "A";

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

  // Al salir del visor se cancela el temporizador pendiente
  useEffect(() => {
    return () => limpiarTimerTramoB();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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