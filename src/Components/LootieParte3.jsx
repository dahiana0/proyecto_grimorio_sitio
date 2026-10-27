import { useEffect, useRef, useState } from "react";
import GuardarInteraccion from "./GuardarInteraccion";
import "../Styles/LootieParte3.css";

// ---------- Sonidos (Web Audio API, funciona en Brave) ----------
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
// ---------------------------------------------------------------


const ANCHO = 1500;
const ALTO = 836;

const DEBUG = false;

const S_PASOS = "/Sonido de pasos.mp3";

const DIALOGOS = [
  {
    src: "/Step 1 .wav",
    inicio: 5.7,
    subs: [
      { inicio: 0.4, fin: 6.03, texto: "Así que tú eres, Rogers, el hombre detrás de este lugar." },
      { inicio: 6.04, fin: 12.63, texto: "Dime la verdad, todo esto es un fraude o hay algo que estás ocultando." },
    ],
  },
  {
    src: "/Rogers 2 .wav",
    inicio: 18.4,
    subs: [
      { inicio: 0.44, fin: 4.99, texto: "Depende, qué es lo que quieres encontrar, Steven," },
      { inicio: 5.0, fin: 8.95, texto: "una mentira o algo que no puedas explicar." },
    ],
  },
  {
    src: "/Step 3.wav",
    inicio: 27.5,
    subs: [
      { inicio: 0.44, fin: 4.19, texto: "No juego con historias, estoy aquí por respuestas." },
    ],
  },
  {
    src: "/Rogers 4.wav",
    inicio: 32.2,
    subs: [
      { inicio: 0.48, fin: 8.03, texto: "Entonces quédate, pasa una noche aquí y descúbrelo por ti mismo." },
    ],
  },
  {
    src: "/Step 5.wav",
    inicio: 40.5,
    subs: [
      { inicio: 0.36, fin: 1.15, texto: "Acepto." },
    ],
  },
];

const LootieParte3 = ({
  volumen = 1,
  onDialogoInicio,
  onDialogoFin,
  onSubtitulo,
}) => {
  const contenedorRef = useRef(null);
  const [escala, setEscala] = useState(1);

  const [lampara1Activa, setLampara1Activa] = useState(false);
  const [lampara2Activa, setLampara2Activa] = useState(false);
  const [lampara3Activa, setLampara3Activa] = useState(false);

  const [fase, setFase] = useState("lado");

  const telarana1Ref = useRef(null);
  const telarana2Ref = useRef(null);

  const monstruo1Ref = useRef(null);
  const monstruo2Ref = useRef(null);
  const monstruo3Ref = useRef(null);
  const monstruo4Ref = useRef(null);

  const stepFrenteRef = useRef(null);
  const stepEspaldasRef = useRef(null);
  const stepLadoRef = useRef(null);

  // Ahora guardan "handles" de sonidos.js, no elementos <audio>
  const pasosRef = useRef(null);
  const audiosRef = useRef([]);

  const timersRef = useRef([]);
  const dialogosIniciados = useRef(false);
  const finNotificado = useRef(false);

  const callbacksRef = useRef({});
  callbacksRef.current = { onDialogoInicio, onDialogoFin, onSubtitulo };
  const volumenRef = useRef(volumen);
  volumenRef.current = volumen;

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

  const reproducirVideo = (ref) => {
    if (ref.current) {
      ref.current.pause();
      ref.current.currentTime = 0;
      ref.current.play();
    }
  };

  const notificarFinDialogos = () => {
    if (finNotificado.current) return;
    finNotificado.current = true;
    callbacksRef.current.onSubtitulo?.("");
    callbacksRef.current.onDialogoFin?.();
  };

  const programarDialogos = () => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];

    DIALOGOS.forEach((d, i) => {
      timersRef.current.push(
        setTimeout(() => {
          if (i === 0) callbacksRef.current.onDialogoInicio?.();

          audiosRef.current[i]?.stop();
          audiosRef.current[i] = reproducir(d.src, {
            volumen: volumenRef.current,
          });
        }, d.inicio * 1000)
      );

      d.subs.forEach((s) => {
        timersRef.current.push(
          setTimeout(() => {
            callbacksRef.current.onSubtitulo?.(s.texto);
          }, (d.inicio + s.inicio) * 1000)
        );

        timersRef.current.push(
          setTimeout(() => {
            callbacksRef.current.onSubtitulo?.("");
          }, (d.inicio + s.fin) * 1000)
        );
      });
    });

    const ultimo = DIALOGOS[DIALOGOS.length - 1];
    const ultimoFin = ultimo.subs[ultimo.subs.length - 1].fin;
    timersRef.current.push(
      setTimeout(notificarFinDialogos, (ultimo.inicio + ultimoFin + 1.5) * 1000)
    );
  };

  const alEmpezarStepFrente = () => {
    if (dialogosIniciados.current) return;
    dialogosIniciados.current = true;
    programarDialogos();
  };

  const alEmpezarStepLado = () => {
    pasosRef.current?.stop();
    pasosRef.current = reproducir(S_PASOS, {
      volumen: volumenRef.current,
      loop: true,
    });
  };

  const alTerminarStepLado = () => {
    pasosRef.current?.stop();
    setFase("zoom");
  };

  useEffect(() => {
    dialogosIniciados.current = false;
    finNotificado.current = false;

    precargar(S_PASOS);
    DIALOGOS.forEach((d) => precargar(d.src));
    audiosRef.current = [];

    const video = stepLadoRef.current;
    if (video) {
      video.currentTime = 0;
      video.play().catch(() => {});
    }

    return () => {
      pasosRef.current?.stop();
      timersRef.current.forEach(clearTimeout);
      timersRef.current = [];
      audiosRef.current.forEach((a) => a?.stop());
      callbacksRef.current.onSubtitulo?.("");
    };
  }, []);

  useEffect(() => {
    audiosRef.current.forEach((a) => a?.volumen(volumen));
    pasosRef.current?.volumen(volumen);
  }, [volumen]);

  const alTerminarZoomCamara = (e) => {
    if (e.target !== e.currentTarget) return;
    if (e.propertyName !== "transform") return;
    if (fase !== "zoom") return;

    setFase("frente");
    reproducirVideo(stepFrenteRef);
  };

  const moverLampara1 = () => {
    setLampara1Activa(false);
    setTimeout(() => {
      setLampara1Activa(true);
      setTimeout(() => setLampara1Activa(false), 600);
    }, 10);
  };

  const moverLampara2 = () => {
    setLampara2Activa(false);
    setTimeout(() => {
      setLampara2Activa(true);
      setTimeout(() => setLampara2Activa(false), 600);
    }, 10);
  };

  const moverLampara3 = () => {
    setLampara3Activa(false);
    setTimeout(() => {
      setLampara3Activa(true);
      setTimeout(() => setLampara3Activa(false), 600);
    }, 10);
  };

  const camaraConZoom = fase === "zoom" || fase === "frente";

  const lamparas = [
    { clase: "lampara1", nombre: "Lámpara 1", activa: lampara1Activa, onClick: moverLampara1 },
    { clase: "lampara2", nombre: "Lámpara 2", activa: lampara2Activa, onClick: moverLampara2 },
    { clase: "lampara3", nombre: "Lámpara 3", activa: lampara3Activa, onClick: moverLampara3 },
  ];

  const videos = [
    { clase: "telarana1", nombre: "Telaraña 1", ref: telarana1Ref, src: "/telarana1.webm" },
    { clase: "telarana2", nombre: "Telaraña 2", ref: telarana2Ref, src: "/telarana2.webm" },
    { clase: "monstruo1", nombre: "Monstruo 1", ref: monstruo1Ref, src: "/monstruo1.webm" },
    { clase: "monstruo2", nombre: "Monstruo 2", ref: monstruo2Ref, src: "/monstruo2.webm" },
    { clase: "monstruo3", nombre: "Monstruo 3", ref: monstruo3Ref, src: "/monstruo3.webm" },
    { clase: "monstruo4", nombre: "Monstruo 4", ref: monstruo4Ref, src: "/monstruo4.webm" },
  ];

  return (
    <div className="escena3" ref={contenedorRef}>
      <div
        className="escenario3"
        style={{ transform: `translate(-50%, -50%) scale(${escala})` }}
      >
        <div
          className={`camaraEscena3${camaraConZoom ? " camaraEscena3Zoom" : ""}${DEBUG ? " debug" : ""}`}
          onTransitionEnd={alTerminarZoomCamara}
        >
          <img className="fondo3" src="/Fondo3.png" alt="" />

          {lamparas.map(({ clase, nombre, activa, onClick }) => (
            <div key={clase} className={`anim ${clase}`}>
              <div className="vista">
                <img
                  src="/lampara1.png"
                  alt=""
                  className={activa ? "moverLampara" : ""}
                />
              </div>
              <div
                className="hitbox"
                onClick={() => {
                  onClick();
                  GuardarInteraccion(clase, nombre, "lampara", 1, "css", "/lampara1.png");
                }}
              >
                <span className="pista" />
              </div>
            </div>
          ))}

          {videos.map(({ clase, nombre, ref, src }) => (
            <div key={clase} className={`anim ${clase}`}>
              <div className="vista">
                <video ref={ref} muted playsInline preload="auto">
                  <source src={src} type="video/webm" />
                </video>
              </div>
              <div
                className="hitbox"
                onClick={() => {
                  reproducirVideo(ref);
                  GuardarInteraccion(clase, nombre, clase, 1, "video", src);
                }}
              >
                <span className="pista" />
              </div>
            </div>
          ))}

          <video
            ref={stepFrenteRef}
            className="stepFrente"
            muted
            playsInline
            preload="auto"
            onPlaying={alEmpezarStepFrente}
          >
            <source src="/step-frente.webm" type="video/webm" />
          </video>

          <video
            ref={stepLadoRef}
            className="stepLado"
            muted
            playsInline
            preload="auto"
            onPlaying={alEmpezarStepLado}
            onEnded={alTerminarStepLado}
          >
            <source src="/step-lado.webm" type="video/webm" />
          </video>
        </div>
      </div>
    </div>
  );
};

export default LootieParte3;