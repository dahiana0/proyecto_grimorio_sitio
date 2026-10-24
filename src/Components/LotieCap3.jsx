import { useEffect, useRef, useState } from "react";
import LottieModule from "lottie-react";

import moustro1 from "../assets/moustro1.json";
import moustro2 from "../assets/moustro2.json";
import moustro3 from "../assets/moustro3.json";
import moustro4 from "../assets/moustro4.json";

import "../Styles/LotieCap3.css";

const Lottie = LottieModule.default;

// Tamaño de diseño de la escena (igual que las demás escenas)
const ANCHO = 1500;
const ALTO = 836;

// true = muestra los cuadros de clic en rojo para calibrarlos
// false = invisibles (versión final)
const DEBUG = false;

const T_LLEGA = 14.21;
const T_ZOOM_IN = 1.0;
const T_ZOOM_OUT = 21.18;
const T_FIN = 22.02;

const ZOOM = 1.8;
const CINTURA = 0.55;
const CAMINAR = true;
const SEPARACION_X = 45;
const AJUSTE_Y = 80;

const AUDIO_PASOS = "./Sonido de pasos.mp3";
const AUDIO_ANTORCHA = "./anto.mp3";
const AUDIO_PUERTA = "./Puerta.mp3";
const VOLUMEN_PASOS = 0.6;
const VOLUMEN_ANTORCHA = 0.8;
const VOLUMEN_PUERTA = 1;

const clamp01 = (v) => Math.min(1, Math.max(0, v));
const ease = (x) =>
  x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;

const LotieCap3 = () => {
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
  const puertaAbiertaRef = useRef(false);

  const stepCap3Ref = useRef(null);

  const pasosAudioRef = useRef(null);

  const escenaRef = useRef(null);
  const camaraCap3Ref = useRef(null);
  const moustro1WrapRef = useRef(null);

  // Ajusta la escala al tamaño del visor
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
    if (!v || puertaAbiertaRef.current) return;

    puertaAbiertaRef.current = true;

    sonar(AUDIO_PUERTA, VOLUMEN_PUERTA);

    v.currentTime = 0;
    v.play().catch(() => { });
  };

  // El clic llega por el cuadro de clic; la que se mueve es la imagen de la antorcha
  const moverAntorcha = (e) => {
    const img = e.currentTarget.closest(".anim")?.querySelector("img");
    if (!img) return;

    sonar(AUDIO_ANTORCHA, VOLUMEN_ANTORCHA);

    img.classList.remove("antorcha-mover");
    void img.offsetWidth;
    img.classList.add("antorcha-mover");
  };

  useEffect(() => {
    reproducirVideo(stepCap3Ref);

    // Audio de pasos (en bucle, solo suena mientras camina)
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
        // Medidas del lienzo (no cambian con la escala del visor)
        const W = escena.clientWidth;
        const H = escena.clientHeight;

        const caminando = t < T_LLEGA && !step.paused && !step.ended;

        if (caminando && pasos.paused) {
          pasos.play().catch(() => { });
        } else if (!caminando && !pasos.paused) {
          pasos.pause();
          pasos.currentTime = 0;
        }

        const mx = m.offsetLeft + m.offsetWidth / 2;

        const stopX = mx - SEPARACION_X;
        const dy = Math.min(0, -(H - (m.offsetTop + m.offsetHeight) - 1) + AJUSTE_Y);

        if (CAMINAR) {
          const w = clamp01(t / T_LLEGA);
          const dx = stopX - W / 2;

          step.style.transform = `translate(calc(-50% + ${dx * w}px), ${dy * w}px)`;
        }

        let p = 0;

        if (t >= T_ZOOM_OUT) {
          p = 1 - ease(clamp01((t - T_ZOOM_OUT) / (T_FIN - T_ZOOM_OUT)));
        } else if (t >= T_LLEGA) {
          p = ease(clamp01((t - T_LLEGA) / T_ZOOM_IN));
        }

        const stepH = step.offsetHeight;
        const piesY = H - 1 + dy;
        const cinturaY = piesY - stepH * (1 - CINTURA);

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

        // Mientras la cámara se acerca se ocultan los punticos (los clics siguen activos)
        cam.dataset.zoom = p > 0.02 ? "1" : "0";
      }

      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      pasos.pause();
    };
  }, []);

  // Objetos con clic: cada uno tiene su animación + su propio cuadro de clic
  const antorchas = [
    { clase: "antorcha-fondo antorcha1", src: "/antorcha1.png", alt: "Antorcha 1" },
    { clase: "antorcha-fondo antorcha2", src: "/antorcha2.png", alt: "Antorcha 2" },
    { clase: "antorcha-frente antorcha3", src: "/antorcha3.png", alt: "Antorcha 3" },
    { clase: "antorcha-frente antorcha4", src: "/antorcha4.png", alt: "Antorcha 4" },
  ];

  const telaranas = [
    { clase: "telarana-fondo telarana1c", ref: telarana1Ref, src: "./telaraña1c.webm" },
    { clase: "telarana-fondo telarana2c", ref: telarana2Ref, src: "./telaraña2c.webm" },
    { clase: "telarana-frente telarana3c", ref: telarana3Ref, src: "./telaraña3c .webm" },
    { clase: "telarana-frente telarana4c", ref: telarana4Ref, src: "/telaraña4c .webm" },
  ];

  const monstruos = [
    { clase: "moustro1c", lottieRef: moustro1Ref, data: moustro1, wrapRef: moustro1WrapRef },
    { clase: "moustro2c", lottieRef: moustro2Ref, data: moustro2 },
    { clase: "moustro3c", lottieRef: moustro3Ref, data: moustro3 },
    { clase: "moustro4c", lottieRef: moustro4Ref, data: moustro4 },
  ];

  return (
    <div className="contenedor-escena visorCap3" ref={contenedorRef}>
      <div
        className="escenarioCap3"
        style={{ transform: `translate(-50%, -50%) scale(${escala})` }}
      >
        <div className="escenacap3" ref={escenaRef}>
          <div
            className={`camara-cap-3${DEBUG ? " debug" : ""}`}
            ref={camaraCap3Ref}
          >
            <img
              className="fondoCap3"
              src="/Cap 3.png"
              alt="Escenario capítulo 3"
            />

            {/* ===== Antorchas ===== */}
            {antorchas.map(({ clase, src, alt }) => (
              <div key={src} className={`anim antorcha ${clase}`}>
                <div className="vista">
                  <img
                    src={src}
                    alt={alt}
                    onAnimationEnd={(e) =>
                      e.currentTarget.classList.remove("antorcha-mover")
                    }
                  />
                </div>
                <div className="hitbox" onClick={moverAntorcha}>
                  <span className="pista" />
                </div>
              </div>
            ))}

            {/* ===== Puerta ===== */}
            <div className="anim puerta">
              <div className="vista">
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
              <div className="hitbox" onClick={abrirPuerta}>
                <span className="pista" />
              </div>
            </div>

            {/* ===== Telarañas ===== */}
            {telaranas.map(({ clase, ref, src }) => (
              <div key={src} className={`anim telarana ${clase}`}>
                <div className="vista">
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
                <div className="hitbox" onClick={() => reproducirVideo(ref)}>
                  <span className="pista" />
                </div>
              </div>
            ))}

            {/* ===== Monstruos ===== */}
            {monstruos.map(({ clase, lottieRef, data, wrapRef }) => (
              <div
                key={clase}
                ref={wrapRef}
                className={`anim moustro ${clase}`}
              >
                <div className="vista">
                  <Lottie
                    lottieRef={lottieRef}
                    animationData={data}
                    autoplay={false}
                    loop={false}
                  />
                </div>
                <div className="hitbox" onClick={() => animarLottie(lottieRef)}>
                  <span className="pista" />
                </div>
              </div>
            ))}

            {/* ===== Step (no se le hace clic) ===== */}
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
    </div>
  );
};

export default LotieCap3;