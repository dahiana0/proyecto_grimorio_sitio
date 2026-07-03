import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../Styles/SofiaGuia.css";

export function SofiaGuia() {
  const navigate = useNavigate();

  const dialogos = [
    {
      texto: "Bienvenido a Grimorio.",
      audio: "/audios/bienvenida.mp3",
    },
    {
      texto:
        "A continuación entrarás en una aventura donde cada paso revela secretos prohibidos.",
      audio: "/audios/mensaje2.mp3",
    },
    {
      texto: "Este no es un museo común...",
      audio: "/audios/mensaje3.mp3",
    },
    {
      texto: "Aquí las historias te observan. Atrévete a continuar.",
      audio: "/audios/mensaje4.mp3",
    },
  ];

  const [actual, setActual] = useState(0);
  const [mostrarBoton, setMostrarBoton] = useState(false);
  const [iniciado, setIniciado] = useState(false);

  const audioRef = useRef(null);

  // Sonido del botón
  const sonidoBoton = useRef(new Audio("./audios/sonidoboton.ogg"));

  const reproducirSonido = () => {
    sonidoBoton.current.currentTime = 0;
    sonidoBoton.current.play().catch(() => {});
  };

  const irAlInicio = () => {
    reproducirSonido();

    setTimeout(() => {
      navigate("/");
    }, 150);
  };

  const explorarMuseo = () => {
    reproducirSonido();

    setTimeout(() => {
      navigate("/explorar-museo");
    }, 150);
  };

  useEffect(() => {
    if (!iniciado) return;

    const audio = audioRef.current;

    if (!audio) return;

    audio.pause();
    audio.currentTime = 0;
    audio.src = dialogos[actual].audio;

    audio.play().catch(console.error);

    return () => {
      audio.pause();
      audio.currentTime = 0;
    };
  }, [actual, iniciado]);

  const iniciarHistoria = () => {
    if (iniciado) return;
    setIniciado(true);
  };

  const siguienteDialogo = () => {
    if (actual < dialogos.length - 1) {
      setActual((prev) => prev + 1);
    } else {
      setMostrarBoton(true);
    }
  };

  return (
    <div className="container-sofia">

      <button
        className="back-btn"
        onClick={irAlInicio}
      >
        Volver al inicio
      </button>

      <div className="character" onClick={iniciarHistoria}>

        <img
          className="base-guia"
          src="/base.png"
          alt="Base"
        />

        <img
          className="guia-img"
          src="/guia-grimorio.webp"
          alt="Guía Grimorio"
        />

      </div>

      <div className="dialogues">

        {!iniciado ? (
          <div className="speech-box aparecer">
            <p>Toca la guía para iniciar...</p>
          </div>
        ) : (
          <div key={actual} className="speech-box aparecer">
            <p>{dialogos[actual].texto}</p>
          </div>
        )}

        <audio
          ref={audioRef}
          src={dialogos[actual].audio}
          preload="auto"
          onEnded={siguienteDialogo}
        />

        <button
          className={`start-btn ${mostrarBoton ? "mostrar" : ""}`}
          onClick={explorarMuseo}
        >
          Explorar Museo
        </button>

      </div>

    </div>
  );
}

export default SofiaGuia;