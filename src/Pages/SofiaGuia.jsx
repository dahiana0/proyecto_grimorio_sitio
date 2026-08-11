import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../Styles/SofiaGuia.css";

export function SofiaGuia() {
  const navigate = useNavigate();

  const dialogos = [
    {
      texto: "Bienvenido a Grimorio.",
      audio: "./guia/1.wav",
    },
    {
      texto:
        "A continuación entrarás en una aventura donde cada paso revela secretos prohibidos.",
      audio: "./guia/2.wav",
    },
    {
      texto: "Este no es un museo común...",
      audio: "./guia/3.wav",
    },
    {
      texto: "Aquí las historias te observan. Atrévete a continuar.",
      audio: "./guia/4.wav",
    },
  ];

  const [actual, setActual] = useState(0);
  const [mostrarBoton, setMostrarBoton] = useState(false);
  const [iniciado, setIniciado] = useState(false);

  const audioRef = useRef(null);



  const sonidoBoton = useRef(new Audio("./audios/sonidoboton.ogg"));

  useEffect(() => {
    sonidoBoton.current.volume = 0.35;
  }, []);

  const reproducirSonido = () => {
    sonidoBoton.current.currentTime = 0;
    sonidoBoton.current.play().catch(() => { });
  };



  const irAlInicio = () => {
    reproducirSonido();

    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }

    setTimeout(() => {
      navigate("/");
    }, 150);
  };



  const omitirIntro = () => {
    reproducirSonido();

    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }

    setTimeout(() => {
      navigate("/explorar-museo");
    }, 150);
  };



  const explorarMuseo = () => {
    reproducirSonido();

    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }

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

      <button
        className="skip-btn"
        onClick={omitirIntro}
      >
        Omitir intro
      </button>



      <div
        className="character"
        onClick={iniciarHistoria}
      >

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