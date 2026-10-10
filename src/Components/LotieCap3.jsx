import { useEffect, useRef } from "react";
import LottieModule from "lottie-react";

import moustro1 from "../assets/moustro1.json";
import moustro2 from "../assets/moustro2.json";
import moustro3 from "../assets/moustro3.json";
import moustro4 from "../assets/moustro4.json";

import "../Styles/LotieCap3.css";

const Lottie = LottieModule.default;

// ====== TIEMPOS (segundos) ======
const T_LLEGA = 14.21;      // llega a moustro1c y empieza el zoom
const T_ZOOM_IN = 1.0;      // cuánto tarda en acercarse
const T_ZOOM_OUT = 21.18;   // empieza a alejarse
const T_FIN = 22.02;        // duración total del step

// ====== AJUSTES ======
const ZOOM = 1.8;           // nivel de zoom (más bajo = personaje se ve más pequeño)
const CINTURA = 0.55;       // 0 = cabeza, 1 = pies: el encuadre se corta a esta altura del personaje
const CAMINAR = true;       // false si el video ya trae el movimiento
const SEPARACION_X = 45;    // px a la izquierda del monstruo donde se detiene (menos = más cerca)
const AJUSTE_Y = 80;        // px que baja el punto final (más alto = más abajo)

// ====== AUDIOS (pon aquí tus archivos, en la carpeta public/audios/) ======
const AUDIO_PASOS = "./Sonido de pasos.mp3";       // se repite mientras camina
const AUDIO_ANTORCHA = "./anto.mp3"; // al hacer clic en una antorcha
const AUDIO_PUERTA = "./Puerta.mp3";     // al tocar la puerta
const VOLUMEN_PASOS = 0.6;
const VOLUMEN_ANTORCHA = 0.8;
const VOLUMEN_PUERTA = 1;

const clamp01 = (v) => Math.min(1, Math.max(0, v));
const ease = (x) =>
  x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;

const LotieCap3 = () => {
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

  const stepCap3Ref = useRef(null);

  // Audio de pasos
  const pasosAudioRef = useRef(null);

  // Cámara
  const escenaRef = useRef(null);
  const camaraCap3Ref = useRef(null);
  const moustro1WrapRef = useRef(null);

  // Reproduce un efecto de sonido (uno nuevo cada vez: permite clics seguidos)
  const sonar = (src, volumen = 1) => {
    const a = new Audio(src);
    a.volume = volumen;
    a.play().catch(() => {});
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

    el.classList.remove("antorcha-mover");
    void el.offsetWidth;
    el.classList.add("antorcha-mover");
  };

  // Al montar: el step se reproduce solo + cámara/caminata sincronizadas
  useEffect(() => {
    reproducirVideo(stepCap3Ref);

    // 🔊 Audio de pasos (en bucle, solo suena mientras camina)
    const pasos = new Audio(AUDIO_PASOS);
    pasos.loop = true;
    pasos.volume = VOLUMEN_PASOS;
    pasosAudioRef.current = pasos;

    let raf;

    const tick = () => {
      const step = stepCap3Ref.current;
      const cam = camaraCap3Ref.current;
      const escena = escenaRef.current;
      const m = moustro1WrapRef.current;

      if (step && cam && escena && m) {
        const t = step.currentTime;
        const W = escena.clientWidth;
        const H = escena.clientHeight;

        // ---------- PASOS: suenan solo mientras camina ----------
        const caminando = t < T_LLEGA && !step.paused && !step.ended;

        if (caminando && pasos.paused) {
          pasos.play().catch(() => {});
        } else if (!caminando && !pasos.paused) {
          pasos.pause();
          pasos.currentTime = 0;
        }

        // centro del monstruo 1 (offset* no se afecta por transform)
        const mx = m.offsetLeft + m.offsetWidth / 2;

        // ---------- CAMINATA (0 → 14.21) ----------
        const stopX = mx - SEPARACION_X;
        const dy = Math.min(0, -(H - (m.offsetTop + m.offsetHeight) - 1) + AJUSTE_Y);

        if (CAMINAR) {
          const w = clamp01(t / T_LLEGA);
          const dx = stopX - W / 2;

          step.style.transform = `translate(calc(-50% + ${dx * w}px), ${dy * w}px)`;
        }

        // ---------- CÁMARA CAP 3 ----------
        let p = 0;

        if (t >= T_ZOOM_OUT) {
          p = 1 - ease(clamp01((t - T_ZOOM_OUT) / (T_FIN - T_ZOOM_OUT)));
        } else if (t >= T_LLEGA) {
          p = ease(clamp01((t - T_LLEGA) / T_ZOOM_IN));
        }

        // Posición final del personaje (donde se detiene)
        const stepH = step.offsetHeight;
        const piesY = H - 1 + dy;
        const cinturaY = piesY - stepH * (1 - CINTURA);

        // Encuadre final: horizontal entre personaje y monstruo,
        // vertical con el borde de abajo a la altura de la cintura
        const fx = (stopX + mx) / 2;
        const fy = cinturaY - H / (2 * ZOOM);

        let txF = W / 2 - ZOOM * fx;
        let tyF = H / 2 - ZOOM * fy;
        txF = Math.min(0, Math.max(W - W * ZOOM, txF));
        tyF = Math.min(0, Math.max(H - H * ZOOM, tyF));

        const s = 1 + (ZOOM - 1) * p;
        const tx = txF * p;
        const ty = tyF * p;

        cam.style.transform = `translate(${tx}px, ${ty}px) scale(${s})`;
      }

      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      pasos.pause();
    };
  }, []);

  return (
    <div className="contenedor-escena">
      <div className="escenacap3" ref={escenaRef}>
        <div className="camara-cap-3" ref={camaraCap3Ref}>
          <img
            className="fondo3"
            src="/Cap 3.png"
            alt="Escenario capítulo 3"
          />

          <img
            className="antorcha antorcha-fondo antorcha1"
            src="/antorcha1.png"
            alt="Antorcha 1"
            onClick={moverAntorcha}
            onAnimationEnd={(e) => e.currentTarget.classList.remove("antorcha-mover")}
          />

          <img
            className="antorcha antorcha-fondo antorcha2"
            src="/antorcha2.png"
            alt="Antorcha 2"
            onClick={moverAntorcha}
            onAnimationEnd={(e) => e.currentTarget.classList.remove("antorcha-mover")}
          />

          <img
            className="antorcha antorcha-frente antorcha3"
            src="/antorcha3.png"
            alt="Antorcha 3"
            onClick={moverAntorcha}
            onAnimationEnd={(e) => e.currentTarget.classList.remove("antorcha-mover")}
          />

          <img
            className="antorcha antorcha-frente antorcha4"
            src="/antorcha4.png"
            alt="Antorcha 4"
            onClick={moverAntorcha}
            onAnimationEnd={(e) => e.currentTarget.classList.remove("antorcha-mover")}
          />

          <video
            ref={puertaRef}
            className="puerta"
            muted
            playsInline
            preload="auto"
            onLoadedMetadata={() => mostrarInicio(puertaRef)}
            onClick={abrirPuerta}
          >
            <source src="/Puerta.webm" type="video/webm" />
          </video>

          <video
            ref={telarana1Ref}
            className="telarana telarana-fondo telarana1c"
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
            className="telarana telarana-fondo telarana2c"
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
            className="telarana telarana-frente telarana3c"
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
            className="telarana telarana-frente telarana4c"
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
            ref={moustro1WrapRef}
            className="moustro moustro1c"
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
            className="moustro moustro2c"
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
            className="moustro moustro3c"
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
            className="moustro moustro4c"
            onClick={() => animarLottie(moustro4Ref)}
          >
            <Lottie
              lottieRef={moustro4Ref}
              animationData={moustro4}
              autoplay={false}
              loop={false}
            />
          </div>

          {/* STEP (personaje) */}
          <video
            ref={stepCap3Ref}
            className="step-cap-3"
            muted
            playsInline
            preload="auto"
          >
            <source src="./stepcap3.webm" type="video/webm" />
          </video>
        </div>
      </div>
    </div>
  );
};

export default LotieCap3;