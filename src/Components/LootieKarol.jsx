import { useRef, useEffect, useState } from "react";
import LottieModule from "lottie-react";
import GuardarInteraccion from "./GuardarInteraccion";

import tableroo from "../assets/tablero.json";
import calabera from "../assets/calavera.json";
import step from "../assets/step1.json";
import libroM from "../assets/libro mesa.json";
import libroc from "../assets/libro cae.json";

import "../Styles/LootieKarol.css";


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

const ANCHO = 1500;
const ALTO = 836;

const DEBUG = false;

const SONIDOS = {
  tablero: { src: "/audios/tablero.mp3", volumen: 0.2 },
  calavera: { src: "/audios/calavera.mp3", volumen: 0.2 },
  libro: { src: "/audios/libro.mp3", volumen: 0.35 },
};

const LootieKarol = () => {
  const contenedorRef = useRef(null);
  const [escala, setEscala] = useState(1);

  const tableroRef = useRef(null);
  const calaveraRef = useRef(null);
  const stepRef = useRef(null);
  const libroRef = useRef(null);
  const libroCRef = useRef(null);

  // Precarga los sonidos para que suenen al instante al hacer clic
  useEffect(() => {
    Object.values(SONIDOS).forEach((s) => precargar(s.src));
  }, []);

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

  const animarTablero = () => {
    reproducir(SONIDOS.tablero.src, { volumen: SONIDOS.tablero.volumen });

    tableroRef.current?.stop();
    tableroRef.current?.play();

    GuardarInteraccion("tablero", "Tablero de investigación", "tablero");
  };

  const animarCalavera = () => {
    reproducir(SONIDOS.calavera.src, { volumen: SONIDOS.calavera.volumen });

    calaveraRef.current?.stop();
    calaveraRef.current?.play();

    GuardarInteraccion("calavera", "Calavera", "calavera");
  };

  const animarStep = () => {
    stepRef.current?.stop();
    stepRef.current?.play();

    GuardarInteraccion("step", "Step", "step");
  };

  const animarLibro = () => {
    reproducir(SONIDOS.libro.src, { volumen: SONIDOS.libro.volumen });

    libroRef.current?.stop();
    libroRef.current?.play();

    GuardarInteraccion("libro", "Libro antiguo", "libro");
  };

  const animarLibroC = () => {
    libroCRef.current?.stop();
    libroCRef.current?.play();

    GuardarInteraccion("libroC", "Libro caído", "libroC");
  };

  const objetos = [
    { clase: "tablero", lottieRef: tableroRef, data: tableroo, onClick: animarTablero },
    { clase: "calavera", lottieRef: calaveraRef, data: calabera, onClick: animarCalavera },
    { clase: "step", lottieRef: stepRef, data: step, onClick: animarStep },
    { clase: "libro", lottieRef: libroRef, data: libroM, onClick: animarLibro },
    { clase: "libroC", lottieRef: libroCRef, data: libroc, onClick: animarLibroC },
  ];

  return (
    <div className="escena1" ref={contenedorRef}>
      <div
        className="escenario"
        style={{ transform: `translate(-50%, -50%) scale(${escala})` }}
      >
        <div className={`camara${DEBUG ? " debug" : ""}`}>
          <img
            className="fondo"
            src="/Escenario-Oficina-Step-Final-1.png"
            alt="Fondo"
          />

          {objetos.map(({ clase, lottieRef, data, onClick }) => (
            <div key={clase} className={`anim ${clase}`}>
              <div className="vista">
                <Lottie
                  lottieRef={lottieRef}
                  animationData={data}
                  autoplay={false}
                  loop={false}
                />
              </div>

              <div className="hitbox" onClick={onClick}>
                <span className="pista" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LootieKarol;