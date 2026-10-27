import { useEffect, useRef, useState } from "react";
import LottieModule from "lottie-react";
import GuardarInteraccion from "./GuardarInteraccion";

import moustro1 from "../assets/moustro1.json";
import moustro2 from "../assets/moustro2.json";
import moustro3 from "../assets/moustro3.json";
import moustro4 from "../assets/moustro4.json";

import "../Styles/LotieCap4.css";

const Lottie = LottieModule.default;


const CAPITULO = 4;


const ANCHO = 1500;
const ALTO = 836;


const DEBUG = false;

const SECUENCIA = [
  { id: "espalda", persistir: false },
  { id: "frente", persistir: false, junto: true },
  { id: "pelea", persistir: false },
  { id: "amarrado", persistir: false },
  { id: "camina", persistir: false, junto: true },
];

const T_CORTE = 13;

const finDeGrupo = (inicio) => {
  let fin = inicio;
  while (SECUENCIA[fin + 1]?.junto) fin++;
  return fin;
};

// Todos los audios están en public/audios/ (rutas absolutas, sin espacios)
const AUDIOS_PERSONAJES = {
  espalda: { src: "/audios/pasos-normales.mp3", volumen: 0.6, loop: true },
  pelea: { src: "/audios/pelea.mp3", volumen: 0.8, loop: false },
  amarrado: { src: "/audios/respiracion.mp3", volumen: 0.7, loop: true },
  camina: { src: "/audios/susurro.mp3", volumen: 0.6, loop: true },
  corre: { src: "/audios/pasos-rapidos.mp3", volumen: 0.7, loop: true },
};

const AUDIO_ANTORCHA = "/audios/anto.mp3";
const AUDIO_PUERTA = "/audios/Puerta.mp3";
const VOLUMEN_ANTORCHA = 0.8;
const VOLUMEN_PUERTA = 1;


const rutaAbsoluta = (src) => (src.startsWith("./") ? src.slice(1) : src);

const LotieCap4 = () => {
  const contenedorRef = useRef(null);
  const [escala, setEscala] = useState(1);

  const moustro1Ref = useRef(null);
  const moustro2Ref = useRef(null);
  const moustro3Ref = useRef(null);
  const moustro4Ref = useRef(null);

  const telarana1Ref = useRef(null);
  const telarana2Ref = useRef(null);
  const telarana3Ref = useRef(null);
  const telarana4Ref = useRef(null);

  const puertaRef = useRef(null);

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


  const [corte, setCorte] = useState(false);
  const corteRef = useRef(false);
  const [caminaFin, setCaminaFin] = useState(false);
  const [correFin, setCorreFin] = useState(false);

  const audiosRef = useRef({});


  useEffect(() => {
    const el = contenedorRef.current;
    if (!el) return;

    const ajustar = () => {
      const { width, height } = el.getBoundingClientRect();
      if (!width || !height) return;
      setEscala(Math.min(width / ANCHO, height / ALTO));
    };

    ajustar();
    const ro = new ResizeObserver(ajustar);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const sonar = (src, volumen = 1) => {
    const a = new Audio(src);
    a.volume = volumen;
    a.play().catch(() => { });
  };

  const sonarClip = (id) => {
    const a = audiosRef.current[id];
    if (!a) return;

    a.currentTime = 0;
    a.play().catch(() => { });
  };

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
      ref.current.play().catch(() => { });
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
    if (!v) return;


    if (!v.paused && !v.ended) return;

    sonar(AUDIO_PUERTA, VOLUMEN_PUERTA);

    v.currentTime = 0;
    v.play().catch((err) => console.error("No se pudo reproducir la puerta:", err));

    GuardarInteraccion("puerta", "Puerta", "puerta", CAPITULO, "video", "/Puerta.webm");
  };


  const moverAntorcha = (e, id, nombre, src) => {
    const img = e.currentTarget.closest(".anim-cap4")?.querySelector("img");
    if (!img) return;

    sonar(AUDIO_ANTORCHA, VOLUMEN_ANTORCHA);

    img.classList.remove("antorcha-mover-cap4");
    void img.offsetWidth;
    img.classList.add("antorcha-mover-cap4");


    GuardarInteraccion(id, nombre, "antorcha", CAPITULO, "css", src);
  };

  const animarMonstruo = (ref, id, nombre) => {
    animarLottie(ref);
    GuardarInteraccion(id, nombre, id, CAPITULO, "lottie");
  };

  const activarTelarana = (ref, id, nombre, src) => {
    reproducirVideo(ref);
    GuardarInteraccion(id, nombre, id, CAPITULO, "video", rutaAbsoluta(src));
  };

  const alTerminarClip = (i) => {
    const fin = finDeGrupo(actual);
    if (i < actual || i > fin) return;

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

  const alActualizarCamina = (e) => {
    if (corteRef.current) return;
    if (e.currentTarget.currentTime < T_CORTE) return;

    corteRef.current = true;
    setCorte(true);

    reproducirVideo(stepSillaRef);
    reproducirVideo(stepCorreRef);

    pararClip("amarrado");
    sonarClip("corre");
  };

  const grupoActivo = (i) => i >= actual && i <= finDeGrupo(actual);

  const clipVisible = (i) => {
    if (i === 3) return grupoActivo(3) && !corte;
    if (i === 4) return grupoActivo(4) && !caminaFin;
    if (i === 5) return corte;
    if (i === 6) return corte && !correFin;

    return grupoActivo(i) || (SECUENCIA[i].persistir && i < actual);
  };

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

  useEffect(() => {
    const fin = finDeGrupo(actual);

    for (let j = actual; j <= fin; j++) {
      reproducirVideo(clipRefs[j]);
      sonarClip(SECUENCIA[j].id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [actual]);


  const antorchas = [
    { id: "antorcha1", nombre: "Antorcha 1", clase: "antorcha-fondo-cap4 antorcha1-cap4", src: "/antorcha1.png", alt: "Antorcha 1" },
    { id: "antorcha2", nombre: "Antorcha 2", clase: "antorcha-fondo-cap4 antorcha2-cap4", src: "/antorcha2.png", alt: "Antorcha 2" },
    { id: "antorcha3", nombre: "Antorcha 3", clase: "antorcha-frente-cap4 antorcha3-cap4", src: "/antorcha3.png", alt: "Antorcha 3" },
    { id: "antorcha4", nombre: "Antorcha 4", clase: "antorcha-frente-cap4 antorcha4-cap4", src: "/antorcha4.png", alt: "Antorcha 4" },
  ];

  const telaranas = [
    { id: "telarana1", nombre: "Telaraña 1", clase: "telarana-fondo-cap4 telarana1c-cap4", ref: telarana1Ref, src: "/telaraña1c.webm" },
    { id: "telarana2", nombre: "Telaraña 2", clase: "telarana-fondo-cap4 telarana2c-cap4", ref: telarana2Ref, src: "/telaraña2c.webm" },
    { id: "telarana3", nombre: "Telaraña 3", clase: "telarana-frente-cap4 telarana3c-cap4", ref: telarana3Ref, src: "/telaraña3c .webm" },
    { id: "telarana4", nombre: "Telaraña 4", clase: "telarana-frente-cap4 telarana4c-cap4", ref: telarana4Ref, src: "/telaraña4c .webm" },
  ];

  const monstruos = [
    { id: "moustro1", nombre: "Monstruo 1", clase: "moustro1c-cap4", lottieRef: moustro1Ref, data: moustro1 },
    { id: "moustro2", nombre: "Monstruo 2", clase: "moustro2c-cap4", lottieRef: moustro2Ref, data: moustro2 },
    { id: "moustro3", nombre: "Monstruo 3", clase: "moustro3c-cap4", lottieRef: moustro3Ref, data: moustro3 },
    { id: "moustro4", nombre: "Monstruo 4", clase: "moustro4c-cap4", lottieRef: moustro4Ref, data: moustro4 },
  ];

  return (
    <div className="contenedor-escena-cap4" ref={contenedorRef}>
      <div
        className="escenarioCap4"
        style={{ transform: `translate(-50%, -50%) scale(${escala})` }}
      >
        <div className="escenacap4">
          <div className={`escena-interna-cap4${DEBUG ? " debug" : ""}`}>
            <img
              className="fondo4"
              src="/Cap 3.png"
              alt="Escenario capítulo 4"
            />


            {antorchas.map(({ id, nombre, clase, src, alt }) => (
              <div key={src} className={`anim-cap4 antorcha-cap4 ${clase}`}>
                <div className="vista-cap4">
                  <img
                    src={src}
                    alt={alt}
                    onAnimationEnd={(e) =>
                      e.currentTarget.classList.remove("antorcha-mover-cap4")
                    }
                  />
                </div>
                <div
                  className="hitbox-cap4"
                  onClick={(e) => moverAntorcha(e, id, nombre, src)}
                >
                  <span className="pista-cap4" />
                </div>
              </div>
            ))}


            <div className="anim-cap4 puerta-cap4">
              <div className="vista-cap4">
                <video
                  ref={puertaRef}
                  muted
                  playsInline
                  preload="auto"
                  onLoadedMetadata={() => mostrarInicio(puertaRef)}
                >
                  <source src="/Puerta.webm" type="video/webm" />
                </video>
              </div>
              <div className="hitbox-cap4" onClick={abrirPuerta}>
                <span className="pista-cap4" />
              </div>
            </div>


            {telaranas.map(({ id, nombre, clase, ref, src }) => (
              <div key={src} className={`anim-cap4 telarana-cap4 ${clase}`}>
                <div className="vista-cap4">
                  <video
                    ref={ref}
                    muted
                    playsInline
                    preload="auto"
                    onLoadedMetadata={() => mostrarFinal(ref)}
                  >
                    <source src={src} type="video/webm" />
                  </video>
                </div>
                <div
                  className="hitbox-cap4"
                  onClick={() => activarTelarana(ref, id, nombre, src)}
                >
                  <span className="pista-cap4" />
                </div>
              </div>
            ))}


            {monstruos.map(({ id, nombre, clase, lottieRef, data }) => (
              <div key={clase} className={`anim-cap4 moustro-cap4 ${clase}`}>
                <div className="vista-cap4">
                  <Lottie
                    lottieRef={lottieRef}
                    animationData={data}
                    autoplay={false}
                    loop={false}
                  />
                </div>
                <div
                  className="hitbox-cap4"
                  onClick={() => animarMonstruo(lottieRef, id, nombre)}
                >
                  <span className="pista-cap4" />
                </div>
              </div>
            ))}


            <video
              ref={stepEspaldaRef}
              className={`step-cap4 stepespalda-cap4 ${clipVisible(0) ? "visible-cap4" : ""}`}
              muted
              playsInline
              preload="auto"
              onEnded={() => alTerminarClip(0)}
            >
              <source src="/step correcion 3.webm" type="video/webm" />
            </video>

            <video
              ref={stepFrenteRef}
              className={`step-cap4 rogersfrente-cap4 ${clipVisible(1) ? "visible-cap4" : ""}`}
              muted
              playsInline
              preload="auto"
              onEnded={() => alTerminarClip(1)}
            >
              <source src="/rogersfrentecap4.webm" type="video/webm" />
            </video>

            <video
              ref={stepPeleaRef}
              className={`step-cap4 pelea-cap4 ${clipVisible(2) ? "visible-cap4" : ""}`}
              muted
              playsInline
              preload="auto"
              onEnded={() => alTerminarClip(2)}
            >
              <source src="/peleastep-rogers.webm" type="video/webm" />
            </video>

            <video
              ref={stepAmarradoRef}
              className={`step-cap4 stepamarrado-cap4 ${clipVisible(3) ? "visible-cap4" : ""}`}
              muted
              playsInline
              preload="auto"
              onEnded={() => alTerminarClip(3)}
            >
              <source src="/stepamarrado.webm" type="video/webm" />
            </video>

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
              <source src="/rogerscamina.webm" type="video/webm" />
            </video>

            <video
              ref={stepSillaRef}
              className={`step-cap4 silla-cap4 ${clipVisible(5) ? "visible-cap4" : ""}`}
              muted
              playsInline
              preload="auto"
            >
              <source src="/sillaycuerda.webm" type="video/webm" />
            </video>

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
              <source src="/rogerscorre.webm" type="video/webm" />
            </video>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LotieCap4;