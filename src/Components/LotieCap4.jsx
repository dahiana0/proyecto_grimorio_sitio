import { useEffect, useRef, useState } from "react";
import LottieModule from "lottie-react";

import moustro1 from "../assets/moustro1.json";
import moustro2 from "../assets/moustro2.json";
import moustro3 from "../assets/moustro3.json";
import moustro4 from "../assets/moustro4.json";

import "../Styles/LotieCap4.css";

const Lottie = LottieModule.default;

// ====== ORDEN DE PERSONAJES ======
// persistir: true -> se queda visible en su último fotograma
// junto: true     -> arranca al mismo tiempo que el clip anterior
// (silla y corre NO van aquí: entran por el evento del segundo T_CORTE de "camina")
const SECUENCIA = [
  { id: "espalda",  persistir: false },
  { id: "frente",   persistir: false, junto: true }, // entra a la vez que espalda
  { id: "pelea",    persistir: false },
  { id: "amarrado", persistir: false },
  { id: "camina",   persistir: false, junto: true }, // entra a la vez que amarrado
];

// Segundo del video "camina" en el que aparece la silla,
// desaparece amarrado y entra corre
const T_CORTE = 13;

// Último índice del grupo que arranca en "inicio" (incluye los "junto")
const finDeGrupo = (inicio) => {
  let fin = inicio;
  while (SECUENCIA[fin + 1]?.junto) fin++;
  return fin;
};

// ====== AUDIOS DE PERSONAJES (pon tus archivos en /public) ======
// Cada audio suena mientras dura la animación de su personaje.
// espalda y frente comparten UN solo audio de pasos (va en "espalda").
const AUDIOS_PERSONAJES = {
  espalda:  { src: "./Pasos Normales  Normal Steps Sound Effect (HD).mp3", volumen: 0.6, loop: true  }, // pasos (espalda + frente)
  pelea:    { src: "./Sonidos de golpes y peleas.mp3",           volumen: 0.8, loop: false }, // sonido de la pelea
  amarrado: { src: "./respiracion.mp3",     volumen: 0.7, loop: true  }, // respiración agitada
  camina:   { src: "./Sonido de Susurro Tenebroso - Efecto de Sonido.mp3",        volumen: 0.6, loop: true  }, // susurros
  corre:    { src: "./freesound_community-pasos-rapidos-loseta-29459.mp3",   volumen: 0.7, loop: true  }, // pasos rápidos
};

// ====== AUDIOS DE INTERACCIÓN ======
const AUDIO_ANTORCHA = "./anto.mp3";
const AUDIO_PUERTA = "./Puerta.mp3";
const VOLUMEN_ANTORCHA = 0.8;
const VOLUMEN_PUERTA = 1;

const LotieCap4 = () => {
  const moustro1Ref = useRef(null);
  const moustro2Ref = useRef(null);
  const moustro3Ref = useRef(null);
  const moustro4Ref = useRef(null);

  const telarana1Ref = useRef(null);
  const telarana2Ref = useRef(null);
  const telarana3Ref = useRef(null);
  const telarana4Ref = useRef(null);

  const puertaRef = useRef(null);
  const puertaAbiertaRef = useRef(false);

  // Personajes (un ref por video)
  const stepEspaldaRef = useRef(null);
  const stepFrenteRef = useRef(null);
  const stepPeleaRef = useRef(null);
  const stepAmarradoRef = useRef(null);
  const stepCaminaRef = useRef(null);
  const stepSillaRef = useRef(null);
  const stepCorreRef = useRef(null);

  const clipRefs = [
    stepEspaldaRef,
    stepFrenteRef,
    stepPeleaRef,
    stepAmarradoRef,
    stepCaminaRef,
    stepSillaRef,
    stepCorreRef,
  ];

  const [actual, setActual] = useState(0);

  // Evento del segundo 13 de "camina"
  const [corte, setCorte] = useState(false);
  const corteRef = useRef(false);
  const [caminaFin, setCaminaFin] = useState(false);
  const [correFin, setCorreFin] = useState(false);

  // Audios de los personajes (uno por id)
  const audiosRef = useRef({});

  // Reproduce un efecto de sonido (uno nuevo cada vez: permite clics seguidos)
  const sonar = (src, volumen = 1) => {
    const a = new Audio(src);
    a.volume = volumen;
    a.play().catch(() => {});
  };

  // Inicia el audio de un personaje desde el principio
  const sonarClip = (id) => {
    const a = audiosRef.current[id];
    if (!a) return;

    a.currentTime = 0;
    a.play().catch(() => {});
  };

  // Detiene el audio de un personaje
  const pararClip = (id) => {
    const a = audiosRef.current[id];
    if (!a) return;

    a.pause();
    a.currentTime = 0;
  };

  const animarLottie = (ref) => {
    if (!ref.current) return;

    ref.current.stop();
    ref.current.play();
  };

  const reproducirVideo = (ref) => {
    if (ref.current) {
      ref.current.pause();
      ref.current.currentTime = 0;
      ref.current.play().catch(() => {});
    }
  };

  const mostrarFinal = (ref) => {
    const v = ref.current;
    if (!v) return;

    if (Number.isFinite(v.duration)) {
      v.currentTime = Math.max(v.duration - 0.05, 0);
    } else {
      v.currentTime = 1e101;
    }
  };

  const mostrarInicio = (ref) => {
    if (ref.current) ref.current.currentTime = 0.01;
  };

  const abrirPuerta = () => {
    const v = puertaRef.current;
    if (!v || puertaAbiertaRef.current) return;

    puertaAbiertaRef.current = true;

    sonar(AUDIO_PUERTA, VOLUMEN_PUERTA); // 🔊 sonido de la puerta

    v.currentTime = 0;
    v.play().catch(() => {});
  };

  // Balanceo de antorcha: reinicia la animación CSS en cada clic
  const moverAntorcha = (e) => {
    const el = e.currentTarget;

    sonar(AUDIO_ANTORCHA, VOLUMEN_ANTORCHA); // 🔊 sonido de la antorcha

    el.classList.remove("antorcha-mover-cap4");
    void el.offsetWidth;
    el.classList.add("antorcha-mover-cap4");
  };

  // Al terminar un clip: si todo el grupo actual terminó, apaga sus audios y avanza
  const alTerminarClip = (i) => {
    const fin = finDeGrupo(actual);
    if (i < actual || i > fin) return;

    // Los videos que no existen cuentan como terminados
    const todosTerminaron = clipRefs
      .slice(actual, fin + 1)
      .every((r) => !r.current || r.current.ended);

    if (!todosTerminaron) return;

    for (let j = actual; j <= fin; j++) {
      pararClip(SECUENCIA[j].id);
    }

    if (fin < SECUENCIA.length - 1) {
      setActual(fin + 1);
    }
  };

  // En el segundo T_CORTE de "camina": aparece silla, se va amarrado, entra corre
  const alActualizarCamina = (e) => {
    if (corteRef.current) return;
    if (e.currentTarget.currentTime < T_CORTE) return;

    corteRef.current = true;
    setCorte(true);

    reproducirVideo(stepSillaRef);
    reproducirVideo(stepCorreRef);

    pararClip("amarrado"); // amarrado desaparece: se corta su respiración
    sonarClip("corre");    // entra corre: pasos rápidos
  };

  const grupoActivo = (i) => i >= actual && i <= finDeGrupo(actual);

  // Visibilidad de cada personaje
  // 3 = amarrado, 4 = camina, 5 = silla, 6 = corre
  const clipVisible = (i) => {
    if (i === 3) return grupoActivo(3) && !corte;
    if (i === 4) return grupoActivo(4) && !caminaFin;
    if (i === 5) return corte;
    if (i === 6) return corte && !correFin;

    return grupoActivo(i) || (SECUENCIA[i].persistir && i < actual);
  };

  // Crea los audios de los personajes una sola vez
  useEffect(() => {
    const audios = {};

    Object.entries(AUDIOS_PERSONAJES).forEach(([id, cfg]) => {
      const a = new Audio(cfg.src);
      a.loop = cfg.loop;
      a.volume = cfg.volumen;
      audios[id] = a;
    });

    audiosRef.current = audios;

    return () => {
      Object.values(audios).forEach((a) => a.pause());
    };
  }, []);

  // Cada vez que cambia el grupo actual: reproduce sus videos y sus audios a la vez
  useEffect(() => {
    const fin = finDeGrupo(actual);

    for (let j = actual; j <= fin; j++) {
      reproducirVideo(clipRefs[j]);
      sonarClip(SECUENCIA[j].id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [actual]);

  return (
    <div className="contenedor-escena-cap4">
      <div className="escenacap4">
        <div className="escena-interna-cap4">
          <img
            className="fondo4"
            src="/Cap 3.png"
            alt="Escenario capítulo 4"
          />

          {/* ANTORCHAS */}
          <img
            className="antorcha-cap4 antorcha-fondo-cap4 antorcha1-cap4"
            src="/antorcha1.png"
            alt="Antorcha 1"
            onClick={moverAntorcha}
            onAnimationEnd={(e) => e.currentTarget.classList.remove("antorcha-mover-cap4")}
          />

          <img
            className="antorcha-cap4 antorcha-fondo-cap4 antorcha2-cap4"
            src="/antorcha2.png"
            alt="Antorcha 2"
            onClick={moverAntorcha}
            onAnimationEnd={(e) => e.currentTarget.classList.remove("antorcha-mover-cap4")}
          />

          <img
            className="antorcha-cap4 antorcha-frente-cap4 antorcha3-cap4"
            src="/antorcha3.png"
            alt="Antorcha 3"
            onClick={moverAntorcha}
            onAnimationEnd={(e) => e.currentTarget.classList.remove("antorcha-mover-cap4")}
          />

          <img
            className="antorcha-cap4 antorcha-frente-cap4 antorcha4-cap4"
            src="/antorcha4.png"
            alt="Antorcha 4"
            onClick={moverAntorcha}
            onAnimationEnd={(e) => e.currentTarget.classList.remove("antorcha-mover-cap4")}
          />

          {/* PUERTA */}
          <video
            ref={puertaRef}
            className="puerta-cap4"
            muted
            playsInline
            preload="auto"
            onLoadedMetadata={() => mostrarInicio(puertaRef)}
            onClick={abrirPuerta}
          >
            <source src="/Puerta.webm" type="video/webm" />
          </video>

          {/* TELARAÑAS */}
          <video
            ref={telarana1Ref}
            className="telarana-cap4 telarana-fondo-cap4 telarana1c-cap4"
            muted
            playsInline
            preload="auto"
            onLoadedMetadata={() => mostrarFinal(telarana1Ref)}
            onClick={() => reproducirVideo(telarana1Ref)}
          >
            <source src="./telaraña1c.webm" type="video/webm" />
          </video>

          <video
            ref={telarana2Ref}
            className="telarana-cap4 telarana-fondo-cap4 telarana2c-cap4"
            muted
            playsInline
            preload="auto"
            onLoadedMetadata={() => mostrarFinal(telarana2Ref)}
            onClick={() => reproducirVideo(telarana2Ref)}
          >
            <source src="./telaraña2c.webm" type="video/webm" />
          </video>

          <video
            ref={telarana3Ref}
            className="telarana-cap4 telarana-frente-cap4 telarana3c-cap4"
            muted
            playsInline
            preload="auto"
            onLoadedMetadata={() => mostrarFinal(telarana3Ref)}
            onClick={() => reproducirVideo(telarana3Ref)}
          >
            <source src="./telaraña3c .webm" type="video/webm" />
          </video>

          <video
            ref={telarana4Ref}
            className="telarana-cap4 telarana-frente-cap4 telarana4c-cap4"
            muted
            playsInline
            preload="auto"
            onLoadedMetadata={() => mostrarFinal(telarana4Ref)}
            onClick={() => reproducirVideo(telarana4Ref)}
          >
            <source src="/telaraña4c .webm" type="video/webm" />
          </video>

          {/* MONSTRUOS (Lottie) */}
          <div
            className="moustro-cap4 moustro1c-cap4"
            onClick={() => animarLottie(moustro1Ref)}
          >
            <Lottie
              lottieRef={moustro1Ref}
              animationData={moustro1}
              autoplay={false}
              loop={false}
            />
          </div>

          <div
            className="moustro-cap4 moustro2c-cap4"
            onClick={() => animarLottie(moustro2Ref)}
          >
            <Lottie
              lottieRef={moustro2Ref}
              animationData={moustro2}
              autoplay={false}
              loop={false}
            />
          </div>

          <div
            className="moustro-cap4 moustro3c-cap4"
            onClick={() => animarLottie(moustro3Ref)}
          >
            <Lottie
              lottieRef={moustro3Ref}
              animationData={moustro3}
              autoplay={false}
              loop={false}
            />
          </div>

          <div
            className="moustro-cap4 moustro4c-cap4"
            onClick={() => animarLottie(moustro4Ref)}
          >
            <Lottie
              lottieRef={moustro4Ref}
              animationData={moustro4}
              autoplay={false}
              loop={false}
            />
          </div>

          {/* PERSONAJES */}
          <video
            ref={stepEspaldaRef}
            className={`step-cap4 stepespalda-cap4 ${clipVisible(0) ? "visible-cap4" : ""}`}
            muted
            playsInline
            preload="auto"
            onEnded={() => alTerminarClip(0)}
          >
            <source src="./stepespaldacap4.webm" type="video/webm" />
          </video>

          <video
            ref={stepFrenteRef}
            className={`step-cap4 rogersfrente-cap4 ${clipVisible(1) ? "visible-cap4" : ""}`}
            muted
            playsInline
            preload="auto"
            onEnded={() => alTerminarClip(1)}
          >
            <source src="./rogersfrentecap4.webm" type="video/webm" />
          </video>

          <video
            ref={stepPeleaRef}
            className={`step-cap4 pelea-cap4 ${clipVisible(2) ? "visible-cap4" : ""}`}
            muted
            playsInline
            preload="auto"
            onEnded={() => alTerminarClip(2)}
          >
            <source src="./peleastep-rogers.webm" type="video/webm" />
          </video>

          {/* Amarrado: entra con camina y desaparece en el segundo 13 de camina */}
          <video
            ref={stepAmarradoRef}
            className={`step-cap4 stepamarrado-cap4 ${clipVisible(3) ? "visible-cap4" : ""}`}
            muted
            playsInline
            preload="auto"
            onEnded={() => alTerminarClip(3)}
          >
            <source src="./stepamarrado.webm" type="video/webm" />
          </video>

          {/* Camina (17 s): marca el evento del segundo 13 */}
          <video
            ref={stepCaminaRef}
            className={`step-cap4 rogerscamina-cap4 ${clipVisible(4) ? "visible-cap4" : ""}`}
            muted
            playsInline
            preload="auto"
            onTimeUpdate={alActualizarCamina}
            onEnded={() => {
              setCaminaFin(true);
              pararClip("camina");
              alTerminarClip(4);
            }}
          >
            <source src="./rogerscamina.webm" type="video/webm" />
          </video>

          {/* Silla: aparece en el segundo 13 y se queda */}
          <video
            ref={stepSillaRef}
            className={`step-cap4 silla-cap4 ${clipVisible(5) ? "visible-cap4" : ""}`}
            muted
            playsInline
            preload="auto"
          >
            <source src="./sillaycuerda.webm" type="video/webm" />
          </video>

          {/* Corre: entra en el segundo 13 junto con la silla */}
          <video
            ref={stepCorreRef}
            className={`step-cap4 rogerscorre-cap4 ${clipVisible(6) ? "visible-cap4" : ""}`}
            muted
            playsInline
            preload="auto"
            onEnded={() => {
              setCorreFin(true);
              pararClip("corre");
            }}
          >
            <source src="./rogerscorre.webm" type="video/webm" />
          </video>
        </div>
      </div>
    </div>
  );
};

export default LotieCap4;