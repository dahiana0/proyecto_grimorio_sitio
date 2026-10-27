import LottieModule from "lottie-react";
import { useRef, useEffect } from "react";
import GuardarInteraccion from "./GuardarInteraccion";

import edificio from "../assets/edificio.json";
import rejas from "../assets/rejas.json";
import "../Styles/LootieParte2.css";

const Lottie = LottieModule.default;

const FRAME_REJA_ABIERTA = 100;
const ESPERA_CERRAR = 400;
const TIEMPO_MAXIMO_PAUSA = 8000;
const DEBUG_FRAMES = false;
const DEBUG = false;

const LootieParte2 = () => {
  const edificioRef = useRef(null);
  const rejasRef = useRef(null);
  const videoRef = useRef(null);

  const abriendo = useRef(false);
  const yaCamino = useRef(false);
  const rejaPausada = useRef(false);
  const stepTermino = useRef(false);

  const timers = useRef({ cerrar: null, seguro: null });

  const audios = useRef(null);
  if (audios.current === null) {
    audios.current = {
      ambiente: new Audio("/audios/ambiente.mp3"),
      rejas: new Audio("/audios/rejas.mp3"),
      pasos: new Audio("/audios/pasos.mp3"),
    };
  }

  const limpiarTimers = () => {
    clearTimeout(timers.current.cerrar);
    clearTimeout(timers.current.seguro);
  };

  useEffect(() => {
    const { ambiente, rejas: sRejas, pasos } = audios.current;

    ambiente.volume = 0.15;
    sRejas.volume = 0.35;
    pasos.volume = 0.4;
    ambiente.loop = true;

    const iniciarAmbiente = () => {
      ambiente.play().catch(() => {});
      window.removeEventListener("click", iniciarAmbiente);
    };

    window.addEventListener("click", iniciarAmbiente);

    return () => {
      ambiente.pause();
      ambiente.currentTime = 0;
      limpiarTimers();
      window.removeEventListener("click", iniciarAmbiente);
    };
  }, []);

  const animarEdificio = () => {
    edificioRef.current?.stop();
    edificioRef.current?.play();

    GuardarInteraccion("edificio", "Edificio", "edificio", 1, "lottie");
  };

  const animarVideo = () => {
    if (yaCamino.current) return;
    yaCamino.current = true;

    audios.current.pasos.currentTime = 0;
    audios.current.pasos.play().catch(() => {});

    const el = videoRef.current;
    if (el) {
      el.currentTime = 0;
      el.play().catch(() => {});

      el.classList.remove("oculto", "camina");
      void el.offsetWidth;
      el.classList.add("camina");
    }

    GuardarInteraccion(
      "stepCamina",
      "Step caminando",
      "stepCamina",
      1,
      "video",
      "/caminado2.webm"
    );
  };

  const animarRejas = () => {
    if (abriendo.current) return;
    abriendo.current = true;
    yaCamino.current = false;
    rejaPausada.current = false;
    stepTermino.current = false;
    limpiarTimers();

    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
      videoRef.current.classList.remove("camina", "oculto");
    }
    audios.current.pasos.pause();
    audios.current.pasos.currentTime = 0;

    audios.current.rejas.currentTime = 0;
    audios.current.rejas.play().catch(() => {});

    rejasRef.current?.stop();
    rejasRef.current?.play();

    GuardarInteraccion("rejas", "Rejas", "rejas", 1, "lottie");
  };

  const detenerVideo = () => {
    videoRef.current?.pause();
    videoRef.current?.classList.add("oculto");
    audios.current.pasos.pause();
  };

  const reanudarReja = () => {
    if (!rejaPausada.current) return;
    rejaPausada.current = false;
    clearTimeout(timers.current.seguro);
    rejasRef.current?.play();
    audios.current.rejas.play().catch(() => {});
  };

  const alTerminarVideo = () => {
    audios.current.pasos.pause();
    videoRef.current?.classList.add("oculto");
    stepTermino.current = true;
    clearTimeout(timers.current.cerrar);
    timers.current.cerrar = setTimeout(reanudarReja, ESPERA_CERRAR);
  };

  const revisarFrame = ({ currentTime }) => {
    if (DEBUG_FRAMES) console.log("frame reja:", Math.round(currentTime));

    if (
      currentTime >= FRAME_REJA_ABIERTA &&
      !rejaPausada.current &&
      !yaCamino.current &&
      !stepTermino.current
    ) {
      rejaPausada.current = true;
      rejasRef.current?.pause();
      audios.current.rejas.pause();

      animarVideo();

      clearTimeout(timers.current.seguro);
      timers.current.seguro = setTimeout(reanudarReja, TIEMPO_MAXIMO_PAUSA);
    }
  };

  const alTerminarRejas = () => {
    detenerVideo();
    rejaPausada.current = false;
    abriendo.current = false;
    limpiarTimers();
  };

  return (
    <div className="escena2">
      <div className={`camara${DEBUG ? " debug" : ""}`}>
        <img className="fondo2" src="/Fondo5a.png" alt="" />

        <img className="nube1" src="/nube1.png" alt="" />
        <img className="nube2" src="/nube2.png" alt="" />
        <img className="nube3" src="/nube3.png" alt="" />
        <img className="nube4" src="/nube4.png" alt="" />

        <video
          ref={videoRef}
          className="step2"
          muted
          playsInline
          onLoadedMetadata={(e) => {
            e.target.style.setProperty("--dur", `${e.target.duration}s`);
          }}
          onEnded={alTerminarVideo}
        >
          <source src="/caminado2.webm" type="video/webm" />
        </video>

        <div className="anim edificio">
          <div className="vista">
            <Lottie
              lottieRef={edificioRef}
              animationData={edificio}
              autoplay={false}
              loop={false}
              rendererSettings={{ preserveAspectRatio: "none" }}
            />
          </div>

          <div className="hitbox" onClick={animarEdificio}>
            <span className="pista" />
          </div>
        </div>

        <div className="anim rejas">
          <div className="vista">
            <Lottie
              lottieRef={rejasRef}
              animationData={rejas}
              autoplay={false}
              loop={false}
              onEnterFrame={revisarFrame}
              onComplete={alTerminarRejas}
              rendererSettings={{ preserveAspectRatio: "none" }}
            />
          </div>

          <div className="hitbox" onClick={animarRejas}>
            <span className="pista" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LootieParte2;