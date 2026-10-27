import { useEffect, useRef, useState } from "react";
import LottieModule from "lottie-react";
import GuardarInteraccion from "./GuardarInteraccion";

import estatua1 from "../assets/estatua1.json";
import estatua3 from "../assets/estatua3.json";
import estatua4 from "../assets/estatua4.json";
import estatua5 from "../assets/estatua5.json";
import estatua6 from "../assets/estatua6.json";

import rata from "../assets/rata.json";

import "../Styles/LotieCap2.css";
const Lottie = LottieModule.default;


const CAPITULO = 2;


const ANCHO = 1500;
const ALTO = 836;


const DEBUG = false;

const ESPALDA_FIN_MS = 10000;
const FRENTE_INICIO_MS = 12500;
const FRENTE2_INICIO_MS = 25000;


const ZOOM_CARA = 2.6;
const CARA_FRAC = 0.22;
const SONIDOS = {
  rata: { src: "./Rat - Sound Effect  ProSounds.mp3", volumen: 1, loop: false },
  estatua1: { src: "./Arrastrar silla_ efecto de sonido.mp3", volumen: 1, loop: false },
  pasosEspalda: { src: "./Pasos Normales  Normal Steps Sound Effect (HD).mp3", volumen: 1, loop: true },
  pasosFrente2: { src: "./Pasos Normales  Normal Steps Sound Effect (HD).mp3", volumen: 1, loop: true },
};

const LotieCap2 = () => {
  const contenedorRef = useRef(null);
  const [escala, setEscala] = useState(1);

  const estatua1Ref = useRef(null);
  const estatua3Ref = useRef(null);
  const estatua4Ref = useRef(null);
  const estatua5Ref = useRef(null);
  const estatua6Ref = useRef(null);

  const rataRef = useRef(null);

  const camaraRef = useRef(null);

  const stepCap2EspaldaRef = useRef(null);
  const stepCap2FrenteRef = useRef(null);
  const stepCap2Frente2Ref = useRef(null);

  const [frente2Termino, setFrente2Termino] = useState(false);
  const [lamparasActivas, setLamparasActivas] = useState({});

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

  const obtenerAudio = (clave) => {
    const cfg = SONIDOS[clave];
    if (!cfg || !cfg.src) return null;

    if (!audiosRef.current[clave]) {
      const audio = new Audio(cfg.src);
      audio.preload = "auto";
      audio.loop = cfg.loop;
      audio.volume = cfg.volumen;
      audiosRef.current[clave] = audio;
    }
    return audiosRef.current[clave];
  };

  const reproducirSonido = (clave, reiniciar = true) => {
    const audio = obtenerAudio(clave);
    if (!audio) return;

    if (!reiniciar && !audio.paused) return;

    audio.pause();
    audio.currentTime = 0;
    audio.play().catch(() => { });
  };

  const detenerSonido = (clave) => {
    const audio = audiosRef.current[clave];
    if (!audio) return;

    audio.pause();
    audio.currentTime = 0;
  };

  useEffect(() => {
    const audios = audiosRef.current;
    return () => Object.keys(audios).forEach(detenerSonido);
  }, []);

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


  const calcularEncuadre = () => {
    const cam = camaraRef.current;
    const v = stepCap2FrenteRef.current;
    if (!cam || !v || !v.videoWidth) return;


    const vW = v.offsetWidth;
    const vH = vW * (v.videoHeight / v.videoWidth);
    const vLeft = v.offsetLeft;
    const bottom = parseFloat(getComputedStyle(v).bottom) || 0;
    const vTop = cam.offsetHeight - bottom - vH;


    const x = vLeft + vW / 2;
    const y = vTop + vH * CARA_FRAC;

    cam.style.setProperty("--cara-zoom", ZOOM_CARA);
    cam.style.setProperty("--cara-x", `${x}px`);
    cam.style.setProperty("--cara-y", `${y}px`);
  };

  useEffect(() => {
    calcularEncuadre();
  }, []);

  useEffect(() => {
    const timers = [];

    reproducirVideo(stepCap2EspaldaRef);

    timers.push(
      setTimeout(() => {
        stepCap2EspaldaRef.current?.pause();
      }, ESPALDA_FIN_MS)
    );

    timers.push(
      setTimeout(() => {
        calcularEncuadre();
        reproducirVideo(stepCap2FrenteRef);
      }, FRENTE_INICIO_MS)
    );

    timers.push(
      setTimeout(() => {
        stepCap2FrenteRef.current?.pause();
        reproducirVideo(stepCap2Frente2Ref);
      }, FRENTE2_INICIO_MS)
    );

    return () => timers.forEach(clearTimeout);
  }, []);

  const animarEstatua1 = () => {
    animarLottie(estatua1Ref);
    reproducirSonido("estatua1");
    GuardarInteraccion("estatua1", "Estatua 1", "estatua1", CAPITULO, "lottie");
  };

  const animarEstatua3 = () => {
    animarLottie(estatua3Ref);
    GuardarInteraccion("estatua3", "Estatua 3", "estatua3", CAPITULO, "lottie");
  };

  const animarEstatua4 = () => {
    animarLottie(estatua4Ref);
    GuardarInteraccion("estatua4", "Estatua 4", "estatua4", CAPITULO, "lottie");
  };

  const animarEstatua5 = () => {
    animarLottie(estatua5Ref);
    GuardarInteraccion("estatua5", "Estatua 5", "estatua5", CAPITULO, "lottie");
  };

  const animarEstatua6 = () => {
    animarLottie(estatua6Ref);
    GuardarInteraccion("estatua6", "Estatua 6", "estatua6", CAPITULO, "lottie");
  };

  const animarRata = () => {
    animarLottie(rataRef);
    reproducirSonido("rata");
    GuardarInteraccion("rata", "Rata", "rata", CAPITULO, "lottie");
  };


  const moverLampara = (clase, nombre) => {
    setLamparasActivas((prev) => ({ ...prev, [clase]: false }));
    setTimeout(() => {
      setLamparasActivas((prev) => ({ ...prev, [clase]: true }));
      setTimeout(
        () => setLamparasActivas((prev) => ({ ...prev, [clase]: false })),
        1200
      );
    }, 10);


    GuardarInteraccion(clase, nombre, "lampara", CAPITULO, "css", "/lampara1.png");
  };

  const claseFrente2 = frente2Termino
    ? "stepCap2Frente2 stepCap2Frente2Fin"
    : "stepCap2Frente2";


  const estatuas = [
    { clase: "estatua1", lottieRef: estatua1Ref, data: estatua1, onClick: animarEstatua1 },
    { clase: "estatua3", lottieRef: estatua3Ref, data: estatua3, onClick: animarEstatua3 },
    { clase: "estatua4", lottieRef: estatua4Ref, data: estatua4, onClick: animarEstatua4 },
    { clase: "estatua5", lottieRef: estatua5Ref, data: estatua5, onClick: animarEstatua5 },
    { clase: "estatua6", lottieRef: estatua6Ref, data: estatua6, onClick: animarEstatua6 },
  ];

  const lamparas = [
    { clase: "lampara1C", nombre: "Lámpara 1" },
    { clase: "lampara2C", nombre: "Lámpara 2" },
    { clase: "lampara3C", nombre: "Lámpara 3" },
  ];

  return (
    <div className="contenedor-escena visorCap2" ref={contenedorRef}>
      <div
        className="escenario2"
        style={{ transform: `translate(-50%, -50%) scale(${escala})` }}
      >
        <div className="escenacap2">
          <div
            ref={camaraRef}
            className={`camaraCapitulo2${DEBUG ? " debug" : ""}`}
            data-camara="Cámara Capítulo 2"
          >
            <img
              className="fondoCap2"
              src="/ESC CAP 2.png"
              alt="Escenario capítulo 2"
            />


            {estatuas.map(({ clase, lottieRef, data, onClick }) => (
              <div key={clase} className={`anim forma ${clase}`}>
                <div className="vista" onClick={onClick}>
                  <Lottie
                    lottieRef={lottieRef}
                    animationData={data}
                    autoplay={false}
                    loop={false}
                  />
                </div>
                <span className="pista" />
              </div>
            ))}


            <div className="anim rata">
              <div className="vista">
                <Lottie
                  lottieRef={rataRef}
                  animationData={rata}
                  autoplay={false}
                  loop={true}
                />
              </div>
              <div className="hitbox" onClick={animarRata}>
                <span className="pista" />
              </div>
            </div>


            {lamparas.map(({ clase, nombre }) => (
              <div
                key={clase}
                className={`anim ${clase}${lamparasActivas[clase] ? " lamparaActiva" : ""}`}
              >
                <div className="vista">

                  <span className="luzLampara" />
                  <img
                    src="/lampara1.png"
                    alt=""
                    className={lamparasActivas[clase] ? "moverLampara" : ""}
                  />
                </div>
                <div className="hitbox" onClick={() => moverLampara(clase, nombre)}>
                  <span className="pista" />
                </div>
              </div>
            ))}

            <video
              ref={stepCap2EspaldaRef}
              className="stepCap2Espalda"
              muted
              playsInline
              preload="auto"
              onPlaying={() => reproducirSonido("pasosEspalda", false)}
              onPause={() => detenerSonido("pasosEspalda")}
              onEnded={() => detenerSonido("pasosEspalda")}
            >
              <source src="./step correccion 1.webm" type="video/webm" />
            </video>

            <video
              ref={stepCap2FrenteRef}
              className="stepCap2Frente"
              muted
              playsInline
              preload="auto"
              onLoadedMetadata={calcularEncuadre}
            >
              <source src="./De Frente.webm" type="video/webm" />
            </video>

            <video
              ref={stepCap2Frente2Ref}
              className={claseFrente2}
              muted
              playsInline
              preload="auto"
              onPlaying={() => reproducirSonido("pasosFrente2", false)}
              onPause={() => detenerSonido("pasosFrente2")}
              onEnded={() => {
                detenerSonido("pasosFrente2");
                setFrente2Termino(true);
              }}
            >
              <source src="./step correcion 2.webm" type="video/webm" />
            </video>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LotieCap2;