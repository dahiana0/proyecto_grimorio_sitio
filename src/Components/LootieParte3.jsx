import { useEffect, useRef, useState } from "react";
import "../Styles/LootieParte3.css";


const DIALOGOS = [
  {
    src: "./Step 1 .wav",
    inicio: 5.7,
    subs: [
      { inicio: 0.4, fin: 6.03, texto: "Así que tú eres, Rogers, el hombre detrás de este lugar." },
      { inicio: 6.04, fin: 12.63, texto: "Dime la verdad, todo esto es un fraude o hay algo que estás ocultando." },
    ],
  },
  {
    src: "./Rogers 2 .wav",
    inicio: 18.4,
    subs: [
      { inicio: 0.44, fin: 4.99, texto: "Depende, qué es lo que quieres encontrar, Steven," },
      { inicio: 5.0, fin: 8.95, texto: "una mentira o algo que no puedas explicar." },
    ],
  },
  {
    src: "./Step 3.wav",
    inicio: 27.5,
    subs: [
      { inicio: 0.44, fin: 4.19, texto: "No juego con historias, estoy aquí por respuestas." },
    ],
  },
  {
    src: "./Rogers 4.wav",
    inicio: 32.2,
    subs: [
      { inicio: 0.48, fin: 8.03, texto: "Entonces quédate, pasa una noche aquí y descúbrelo por ti mismo." },
    ],
  },
  {
    src: "./Step 5.wav",
    inicio: 40.5,
    subs: [
      { inicio: 0.36, fin: 1.15, texto: "Acepto." },
    ],
  },
];


const LootieParte3 = ({
  volumen = 1,
  onDialogoInicio,
  onDialogoFin,
  onSubtitulo,
}) => {
  const [lampara1Activa, setLampara1Activa] = useState(false);
  const [lampara2Activa, setLampara2Activa] = useState(false);
  const [lampara3Activa, setLampara3Activa] = useState(false);


  const [fase, setFase] = useState("lado");

  const telarana1Ref = useRef(null);
  const telarana2Ref = useRef(null);

  const monstruo1Ref = useRef(null);
  const monstruo2Ref = useRef(null);
  const monstruo3Ref = useRef(null);
  const monstruo4Ref = useRef(null);

  const stepFrenteRef = useRef(null);
  const stepEspaldasRef = useRef(null);
  const stepLadoRef = useRef(null);

  const pasosRef = useRef(null);

  const audiosRef = useRef([]);
  const timersRef = useRef([]);
  const dialogosIniciados = useRef(false);
  const finNotificado = useRef(false);


  const callbacksRef = useRef({});
  callbacksRef.current = { onDialogoInicio, onDialogoFin, onSubtitulo };
  const volumenRef = useRef(volumen);
  volumenRef.current = volumen;

  const reproducirVideo = (ref) => {
    if (ref.current) {
      ref.current.pause();
      ref.current.currentTime = 0;
      ref.current.play();
    }
  };


  const notificarFinDialogos = () => {
    if (finNotificado.current) return;
    finNotificado.current = true;
    callbacksRef.current.onSubtitulo?.("");
    callbacksRef.current.onDialogoFin?.();
  };


  const programarDialogos = () => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];

    DIALOGOS.forEach((d, i) => {
      // Inicio del diálogo: audio + aviso al visor (solo el primero)
      timersRef.current.push(
        setTimeout(() => {
          if (i === 0) callbacksRef.current.onDialogoInicio?.();

          const audio = audiosRef.current[i];
          if (audio) {
            audio.currentTime = 0;
            audio.play().catch((e) =>
              console.error("Falló el diálogo", i, d.src, e)
            );
          }
        }, d.inicio * 1000)
      );

      // Subtítulos: aparecen y desaparecen en su momento exacto
      d.subs.forEach((s) => {
        timersRef.current.push(
          setTimeout(() => {
            callbacksRef.current.onSubtitulo?.(s.texto);
          }, (d.inicio + s.inicio) * 1000)
        );

        timersRef.current.push(
          setTimeout(() => {
            callbacksRef.current.onSubtitulo?.("");
          }, (d.inicio + s.fin) * 1000)
        );
      });
    });


    const ultimo = DIALOGOS[DIALOGOS.length - 1];
    const ultimoFin = ultimo.subs[ultimo.subs.length - 1].fin;
    timersRef.current.push(
      setTimeout(notificarFinDialogos, (ultimo.inicio + ultimoFin + 1.5) * 1000)
    );
  };


  const alEmpezarStepFrente = () => {
    if (dialogosIniciados.current) return;
    dialogosIniciados.current = true;
    programarDialogos();
  };


  const alEmpezarStepLado = () => {
    const pasos = pasosRef.current;
    if (pasos) {
      pasos.volume = volumenRef.current;
      pasos.currentTime = 0;
      pasos.play().catch(() => { });
    }
  };


  const alTerminarStepLado = () => {
    if (pasosRef.current) pasosRef.current.pause();
    setFase("zoom");
  };

  useEffect(() => {
    dialogosIniciados.current = false;
    finNotificado.current = false;

    audiosRef.current = DIALOGOS.map((d, i) => {
      const audio = new Audio(d.src);
      audio.preload = "auto";
      audio.volume = volumenRef.current;

      audio.onerror = () =>
        console.error("No se pudo cargar el audio del diálogo:", d.src);


      audio.onended = () => {
        if (i === DIALOGOS.length - 1) notificarFinDialogos();
      };

      return audio;
    });

    const video = stepLadoRef.current;
    if (video) {
      video.currentTime = 0;
      video.play().catch(() => { });
    }

    // Al salir de la escena, todo se detiene
    return () => {
      if (pasosRef.current) pasosRef.current.pause();
      timersRef.current.forEach(clearTimeout);
      timersRef.current = [];
      audiosRef.current.forEach((a) => a.pause());
      callbacksRef.current.onSubtitulo?.("");
    };
  }, []);


  useEffect(() => {
    audiosRef.current.forEach((a) => {
      a.volume = volumen;
    });
    if (pasosRef.current) pasosRef.current.volume = volumen;
  }, [volumen]);

  const alTerminarZoomCamara = (e) => {
    if (e.target !== e.currentTarget) return;
    if (e.propertyName !== "transform") return;
    if (fase !== "zoom") return;

    setFase("frente");
    reproducirVideo(stepFrenteRef);
  };

  const moverLampara1 = () => {
    setLampara1Activa(false);
    setTimeout(() => {
      setLampara1Activa(true);
      setTimeout(() => setLampara1Activa(false), 600);
    }, 10);
  };

  const moverLampara2 = () => {
    setLampara2Activa(false);
    setTimeout(() => {
      setLampara2Activa(true);
      setTimeout(() => setLampara2Activa(false), 600);
    }, 10);
  };

  const moverLampara3 = () => {
    setLampara3Activa(false);
    setTimeout(() => {
      setLampara3Activa(true);
      setTimeout(() => setLampara3Activa(false), 600);
    }, 10);
  };

  const camaraConZoom = fase === "zoom" || fase === "frente";

  return (
    <div className="escena3">
      <div
        className={`camaraEscena3 ${camaraConZoom ? "camaraEscena3Zoom" : ""}`}
        onTransitionEnd={alTerminarZoomCamara}
      >
        <img className="fondo3" src="/Fondo3.png" alt="" />

        <img
          src="/lampara1.png"
          alt=""
          className={`lampara1 ${lampara1Activa ? "moverLampara" : ""}`}
          onClick={moverLampara1}
        />
        <img
          src="/lampara1.png"
          alt=""
          className={`lampara2 ${lampara2Activa ? "moverLampara" : ""}`}
          onClick={moverLampara2}
        />
        <img
          src="/lampara1.png"
          alt=""
          className={`lampara3 ${lampara3Activa ? "moverLampara" : ""}`}
          onClick={moverLampara3}
        />

        <video
          ref={telarana1Ref}
          className="telarana1"
          muted
          playsInline
          preload="auto"
          onClick={() => reproducirVideo(telarana1Ref)}
        >
          <source src="/telarana1.webm" type="video/webm" />
        </video>

        <video
          ref={telarana2Ref}
          className="telarana2"
          muted
          playsInline
          preload="auto"
          onClick={() => reproducirVideo(telarana2Ref)}
        >
          <source src="/telarana2.webm" type="video/webm" />
        </video>

        <video
          ref={monstruo1Ref}
          className="monstruo1"
          muted
          playsInline
          preload="auto"
          onClick={() => reproducirVideo(monstruo1Ref)}
        >
          <source src="/monstruo1.webm" type="video/webm" />
        </video>

        <video
          ref={monstruo2Ref}
          className="monstruo2"
          muted
          playsInline
          preload="auto"
          onClick={() => reproducirVideo(monstruo2Ref)}
        >
          <source src="/monstruo2.webm" type="video/webm" />
        </video>

        <video
          ref={monstruo3Ref}
          className="monstruo3"
          muted
          playsInline
          preload="auto"
          onClick={() => reproducirVideo(monstruo3Ref)}
        >
          <source src="/monstruo3.webm" type="video/webm" />
        </video>

        <video
          ref={monstruo4Ref}
          className="monstruo4"
          muted
          playsInline
          preload="auto"
          onClick={() => reproducirVideo(monstruo4Ref)}
        >
          <source src="/monstruo4.webm" type="video/webm" />
        </video>

        <video
          ref={stepFrenteRef}
          className="stepFrente"
          muted
          playsInline
          preload="auto"
          onPlaying={alEmpezarStepFrente}
        >
          <source src="./step-frente.webm" type="video/webm" />
        </video>

        <video
          ref={stepLadoRef}
          className="stepLado"
          muted
          playsInline
          preload="auto"
          onPlaying={alEmpezarStepLado}
          onEnded={alTerminarStepLado}
        >
          <source src="./step-lado.webm" type="video/webm" />
        </video>


        <audio ref={pasosRef} src="./Sonido de pasos.mp3" loop preload="auto" />
      </div>
    </div>
  );
};

export default LootieParte3;