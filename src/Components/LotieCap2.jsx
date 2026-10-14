import { useEffect, useRef, useState } from "react";
import LottieModule from "lottie-react";

import estatua1 from "../assets/estatua1.json";
import estatua3 from "../assets/estatua3.json";
import estatua4 from "../assets/estatua4.json";
import estatua5 from "../assets/estatua5.json";
import estatua6 from "../assets/estatua6.json";

import rata from "../assets/rata.json";

import "../Styles/LotieCap2.css";
const Lottie = LottieModule.default;


const ESPALDA_FIN_MS = 10000;
const FRENTE_INICIO_MS = 12500;
const FRENTE2_INICIO_MS = 25000;


const MARGEN_CABEZA = 0.06;
const PECHO_FRAC = 0.6;
const ANCHO_MAX = 0.85;


const SONIDOS = {
  rata: { src: "./Rat - Sound Effect  ProSounds.mp3", volumen: 1, loop: false }, // clic en la rata
  estatua1: { src: "./Arrastrar silla_ efecto de sonido.mp3", volumen: 1, loop: false }, // clic en la estatua 1
  pasosEspalda: { src: "./Pasos Normales  Normal Steps Sound Effect (HD).mp3", volumen: 1, loop: true },  // stepCap2Espalda
  pasosFrente2: { src: "./Pasos Normales  Normal Steps Sound Effect (HD).mp3", volumen: 1, loop: true },  // stepCap2Frente2
};

const LotieCap2 = () => {
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


  const audiosRef = useRef({});

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
    if (!cam || !v) return;

    const camW = cam.offsetWidth;
    const camH = cam.offsetHeight;

    const vLeft = v.offsetLeft;
    const vTop = v.offsetTop;
    const vW = v.offsetWidth;
    const vH = v.offsetHeight;

    if (!camW || !camH || !vW || !vH) return;


    const zonaArriba = vTop - vH * MARGEN_CABEZA;
    const zonaAbajo = vTop + vH * PECHO_FRAC;
    const zonaAlto = zonaAbajo - zonaArriba;


    const zoomPorAlto = camH / zonaAlto;
    const zoomPorAncho = (camW * ANCHO_MAX) / vW;
    const zoom = Math.max(1.2, Math.min(zoomPorAlto, zoomPorAncho, 6));


    const x = vLeft + vW / 2;
    const y = zonaArriba + camH / (2 * zoom);

    cam.style.setProperty("--cara-zoom", zoom.toFixed(3));
    cam.style.setProperty("--cara-x", `${x}px`);
    cam.style.setProperty("--cara-y", `${y}px`);
  };

  useEffect(() => {
    calcularEncuadre();
    window.addEventListener("resize", calcularEncuadre);
    return () => window.removeEventListener("resize", calcularEncuadre);
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
  };

  const animarEstatua3 = () => {
    animarLottie(estatua3Ref);
  };

  const animarEstatua4 = () => {
    animarLottie(estatua4Ref);
  };

  const animarEstatua5 = () => {
    animarLottie(estatua5Ref);
  };

  const animarEstatua6 = () => {
    animarLottie(estatua6Ref);
  };

  const animarRata = () => {
    animarLottie(rataRef);
    reproducirSonido("rata");
  };

  const claseFrente2 = frente2Termino
    ? "stepCap2Frente2 stepCap2Frente2Fin"
    : "stepCap2Frente2";

  return (
    <div className="contenedor-escena">
      <div className="escenacap2">
        <div
          ref={camaraRef}
          className="camaraCapitulo2"
          data-camara="Cámara Capítulo 2"
        >
          <img
            className="fondo"
            src="/ESC CAP 2.png"
            alt="Escenario capítulo 2"
          />

          <div className="estatua estatua1" onClick={animarEstatua1}>
            <Lottie
              lottieRef={estatua1Ref}
              animationData={estatua1}
              autoplay={false}
              loop={false}
            />
          </div>

          <div className="estatua estatua3" onClick={animarEstatua3}>
            <Lottie
              lottieRef={estatua3Ref}
              animationData={estatua3}
              autoplay={false}
              loop={false}
            />
          </div>

          <div className="estatua estatua4" onClick={animarEstatua4}>
            <Lottie
              lottieRef={estatua4Ref}
              animationData={estatua4}
              autoplay={false}
              loop={false}
            />
          </div>

          <div className="estatua estatua5" onClick={animarEstatua5}>
            <Lottie
              lottieRef={estatua5Ref}
              animationData={estatua5}
              autoplay={false}
              loop={false}
            />
          </div>

          <div className="estatua estatua6" onClick={animarEstatua6}>
            <Lottie
              lottieRef={estatua6Ref}
              animationData={estatua6}
              autoplay={false}
              loop={false}
            />
          </div>

          <div className="rata" onClick={animarRata}>
            <Lottie
              lottieRef={rataRef}
              animationData={rata}
              autoplay={false}
              loop={true}
            />
          </div>

          <img
            className="lampara lampara1C"
            src="/lampara1.png"
            alt="Lámpara 1"
          />

          <img
            className="lampara lampara2C"
            src="/lampara1.png"
            alt="Lámpara 2"
          />

          <img
            className="lampara lampara3C"
            src="/lampara1.png"
            alt="Lámpara 3"
          />


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
            <source src="/Comp 2.webm" type="video/webm" />
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
            <source src="./Comp 3.webm" type="video/webm" />
          </video>
        </div>
      </div>
    </div>
  );
};

export default LotieCap2;