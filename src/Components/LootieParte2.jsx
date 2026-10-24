import LottieModule from "lottie-react";
import { useRef, useEffect } from "react";

import edificio from "../assets/edificio.json";
import rejas from "../assets/rejas.json";
import "../Styles/LootieParte2.css";

const Lottie = LottieModule.default;

// 👇 Frame de la reja en el que Step empieza a caminar.
// Pon null para que arranque cuando la reja termine de abrirse.
// (24 fps: 4 s ≈ frame 96. Revisa "fr" en rejas.json si exportaste con otro fps)
const FRAME_INICIO = 60;

// 👇 Frame de la reja en el que Step deja de caminar (cuando se cierra).
// Pon null para que se detenga cuando la reja termine su animación.
const FRAME_DETENER = null;

// true = muestra los cuadros de clic en rojo para calibrarlos
// false = invisibles (versión final)
const DEBUG = false;

const LootieParte2 = () => {
  const edificioRef = useRef(null);
  const rejasRef = useRef(null);
  const videoRef = useRef(null);

  const abriendo = useRef(false); // evita reiniciar mientras la reja se abre
  const yaCamino = useRef(false); // evita lanzar la caminata varias veces

  const sonidoAmbiente = useRef(new Audio("/audios/ambiente.mp3"));
  const sonidoRejas = useRef(new Audio("/audios/rejas.mp3"));
  const sonidoPasos = useRef(new Audio("/audios/pasos.mp3"));

  useEffect(() => {
    const ambiente = sonidoAmbiente.current;

    ambiente.volume = 0.15;
    sonidoRejas.current.volume = 0.35;
    sonidoPasos.current.volume = 0.4;
    ambiente.loop = true;

    const iniciarAmbiente = () => {
      ambiente.play().catch(() => {});
      window.removeEventListener("click", iniciarAmbiente);
    };

    window.addEventListener("click", iniciarAmbiente);

    return () => {
      ambiente.pause();
      ambiente.currentTime = 0;
      window.removeEventListener("click", iniciarAmbiente);
    };
  }, []);

  const animarEdificio = () => {
    edificioRef.current?.stop();
    edificioRef.current?.play();
  };

  const animarVideo = () => {
    if (yaCamino.current) return;
    yaCamino.current = true;

    sonidoPasos.current.currentTime = 0;
    sonidoPasos.current.play().catch(() => {});

    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => {});
    }
  };

  const animarRejas = () => {
    if (abriendo.current) return; // ya se está abriendo, ignora el clic
    abriendo.current = true;
    yaCamino.current = false;

    // Deja a Step quieto en el primer frame
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
    sonidoPasos.current.pause();
    sonidoPasos.current.currentTime = 0;

    sonidoRejas.current.currentTime = 0;
    sonidoRejas.current.play().catch(() => {});

    rejasRef.current?.stop();
    rejasRef.current?.play();
  };

  // Detiene a Step y los pasos (se queda quieto donde está)
  const detenerVideo = () => {
    videoRef.current?.pause();
    sonidoPasos.current.pause();
  };

  // Se ejecuta en cada frame de la reja
  const revisarFrame = ({ currentTime }) => {
    if (FRAME_DETENER !== null && currentTime >= FRAME_DETENER) {
      detenerVideo();
      return;
    }
    if (FRAME_INICIO !== null && currentTime >= FRAME_INICIO) {
      animarVideo();
    }
  };

  // Se ejecuta cuando la reja termina su animación (reja cerrada)
  const alTerminarRejas = () => {
    detenerVideo(); // Step no sigue caminando con la reja cerrada
    abriendo.current = false;
  };

  return (
    <div className="escena2">
      <div className={`camara${DEBUG ? " debug" : ""}`}>
        <img className="fondo2" src="./Fondo5a.png" alt="" />

        <img className="nube1" src="/nube1.png" alt="" />
        <img className="nube2" src="/nube2.png" alt="" />
        <img className="nube3" src="/nube3.png" alt="" />
        <img className="nube4" src="/nube4.png" alt="" />

        <video
          ref={videoRef}
          className="step2"
          muted
          playsInline
          onEnded={() => sonidoPasos.current.pause()}
        >
          <source src="./caminado2.webm" type="video/webm" />
        </video>

        {/* ===== Edificio ===== */}
        <div className="anim edificio">
          {/* Solo visual: no recibe clics */}
          <div className="vista">
            <Lottie
              lottieRef={edificioRef}
              animationData={edificio}
              autoplay={false}
              loop={false}
              rendererSettings={{ preserveAspectRatio: "none" }}
            />
          </div>

          {/* Cuadro de clic propio, dentro de su animación */}
          <div className="hitbox" onClick={animarEdificio}>
            <span className="pista" />
          </div>
        </div>

        {/* ===== Rejas ===== */}
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