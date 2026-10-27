import LottieModule from "lottie-react";
import { useRef, useEffect } from "react";
import GuardarInteraccion from "./GuardarInteraccion";

import edificio from "../assets/edificio.json";
import rejas from "../assets/rejas.json";
import "../Styles/LootieParte2.css";


let _ctx = null;
const _buffers = new Map();
const _cargando = new Map();
const _getCtx = () => {
  if (!_ctx) _ctx = new (window.AudioContext || window.webkitAudioContext)();
  return _ctx;
};
const _desbloquear = () => {
  const c = _getCtx();
  if (c.state === "suspended") c.resume().catch(() => {});
};
["pointerdown", "touchstart", "keydown", "click"].forEach((ev) =>
  document.addEventListener(ev, _desbloquear, { capture: true })
);

const precargar = (src) => {
  const url = encodeURI(src);
  if (_buffers.has(url)) return Promise.resolve(_buffers.get(url));
  if (_cargando.has(url)) return _cargando.get(url);
  const p = fetch(url)
    .then((r) => {
      if (!r.ok) throw new Error(`${r.status} al cargar ${url}`);
      return r.arrayBuffer();
    })
    .then((ab) => _getCtx().decodeAudioData(ab))
    .then((buf) => {
      _buffers.set(url, buf);
      return buf;
    })
    .catch((e) => {
      console.error("No se pudo cargar el sonido:", url, e);
      _cargando.delete(url);
      return null;
    });
  _cargando.set(url, p);
  return p;
};

const reproducir = (src, { volumen = 1, loop = false, desde = 0 } = {}) => {
  const h = { fuente: null, buffer: null, gain: null, t0: 0, desde, parado: false, fin: false };
  h.tiempo = () => {
    if (h.fin) return h.buffer?.duration ?? 0;
    if (!h.fuente) return h.desde;
    return Math.min(h.desde + _ctx.currentTime - h.t0, h.buffer.duration);
  };
  h.stop = () => {
    h.parado = true;
    const t = h.tiempo();
    try { h.fuente?.stop(); } catch {}
    h.fuente = null;
    return t;
  };
  h.volumen = (v) => {
    volumen = v;
    if (h.gain) h.gain.gain.value = v;
  };
  precargar(src).then((buf) => {
    if (!buf || h.parado) return;
    if (!loop && desde >= buf.duration) return;
    const c = _getCtx();
    c.resume().catch(() => {});
    const fuente = c.createBufferSource();
    fuente.buffer = buf;
    fuente.loop = loop;
    const gain = c.createGain();
    gain.gain.value = volumen;
    fuente.connect(gain).connect(c.destination);
    fuente.onended = () => {
      if (h.fuente === fuente) {
        h.fuente = null;
        h.fin = !loop;
      }
    };
    fuente.start(0, loop ? desde % buf.duration : desde);
    h.fuente = fuente;
    h.buffer = buf;
    h.gain = gain;
    h.t0 = c.currentTime;
  });
  return h;
};



const Lottie = LottieModule.default;

const FRAME_REJA_ABIERTA = 100;
const ESPERA_CERRAR = 400;
const TIEMPO_MAXIMO_PAUSA = 8000;
const DEBUG_FRAMES = false;
const DEBUG = false;

const S_AMBIENTE = "/audios/ambiente.mp3";
const S_REJAS = "/audios/rejas.mp3";
const S_PASOS = "/audios/pasos.mp3";

const LootieParte2 = () => {
  const edificioRef = useRef(null);
  const rejasRef = useRef(null);
  const videoRef = useRef(null);

  const abriendo = useRef(false);
  const yaCamino = useRef(false);
  const rejaPausada = useRef(false);
  const stepTermino = useRef(false);

  const timers = useRef({ cerrar: null, seguro: null });

  const sAmbiente = useRef(null);
  const sRejas = useRef(null);
  const sPasos = useRef(null);
  const tiempoRejas = useRef(0);

  const limpiarTimers = () => {
    clearTimeout(timers.current.cerrar);
    clearTimeout(timers.current.seguro);
  };

  useEffect(() => {
    precargar(S_REJAS);
    precargar(S_PASOS);

    // Suena en cuanto el navegador permite audio (primer clic/toque)
    sAmbiente.current = reproducir(S_AMBIENTE, { volumen: 0.15, loop: true });

    return () => {
      sAmbiente.current?.stop();
      sRejas.current?.stop();
      sPasos.current?.stop();
      limpiarTimers();
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

    sPasos.current?.stop();
    sPasos.current = reproducir(S_PASOS, { volumen: 0.4 });

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

    sPasos.current?.stop();

    tiempoRejas.current = 0;
    sRejas.current?.stop();
    sRejas.current = reproducir(S_REJAS, { volumen: 0.35 });

    rejasRef.current?.stop();
    rejasRef.current?.play();

    GuardarInteraccion("rejas", "Rejas", "rejas", 1, "lottie");
  };

  const detenerVideo = () => {
    videoRef.current?.pause();
    videoRef.current?.classList.add("oculto");
    sPasos.current?.stop();
  };

  const reanudarReja = () => {
    if (!rejaPausada.current) return;
    rejaPausada.current = false;
    clearTimeout(timers.current.seguro);
    rejasRef.current?.play();

    sRejas.current?.stop();
    sRejas.current = reproducir(S_REJAS, {
      volumen: 0.35,
      desde: tiempoRejas.current,
    });
  };

  const alTerminarVideo = () => {
    sPasos.current?.stop();
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
      tiempoRejas.current = sRejas.current?.stop() ?? 0;

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