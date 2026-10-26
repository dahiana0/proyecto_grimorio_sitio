import { useRef, useEffect } from "react";
import GuardarInteraccion from "./GuardarInteraccion";
import "../Styles/LotieCap5C.css";

// Número de capítulo con el que se guardan las interacciones
const CAPITULO = 5;

// true = muestra los cuadros de clic en rojo para calibrarlos
// false = invisibles (versión final)
const DEBUG = false;

/* ---------------------------------------------------------------------
   AUDIO (ruta dentro de public/)
   Pon tus archivos de sonido con estos nombres o cambia las rutas.
--------------------------------------------------------------------- */
const AUDIO_PASOS = "/audios/pasos.mp3";   // pasos mientras camina
const VOLUMEN_PASOS = 0.4;

const AUDIO_CINTA = "/audios/cinta.mp3";   // cuando caen las cintas
const VOLUMEN_CINTA = 0.8;

const AUDIO_ANTORCHA = "./anto.mp3";
const VOLUMEN_ANTORCHA = 0.8;

/* ---------------------------------------------------------------------
   LÍNEA DE TIEMPO (segundos desde el inicio de la secuencia)
   Todo lo que ocurre en la escena se calcula a partir de este reloj.
--------------------------------------------------------------------- */
const T = {
  CAMINA_FIN: 21,        // fin del paseo; Orabona empieza a desaparecer
  ORABONA_FADE_FIN: 22.5,
  ZOOM_IN_FIN: 26,       // el zoom hacia Step y la puerta empieza en 21
  PUERTA: 26.8,          // arranca la apertura de la puerta y caen las cintas
  ENTRA_INI: 28,         // Step camina hacia el interior
  ENTRA_FIN: 34,
  STEP_FADE_INI: 31.5,   // Step se desvanece mientras entra
  STEP_FADE_FIN: 33.5,
  ZOOM_OUT_INI: 35,      // pausa con la puerta abierta y se retira el zoom
  ZOOM_OUT_FIN: 39.5,
  FIN: 40,
};

/* Segundo del video puerta5c2.webm en el que la puerta empieza a abrirse */
const PUERTA_VIDEO_ABRE = 21;

/* ---------------------------------------------------------------------
   POSICIONES (fracciones de la escena)
   x = centro horizontal (0.5 = mitad)
   y = desplazamiento vertical (negativo = sube, en fracción del alto)
   s = escala | o = opacidad
   Cada punto es [segundo, valor, "s"]; "s" = movimiento suave, sin "s" = lineal.
--------------------------------------------------------------------- */
const BASE_X = { orabona: 0.45, step: 0.55 };

const PISTAS = {
  orabona: {
    x: [[0, 0.45], [7.46, 0.4536], [13.75, 0.4571], [19.92, 0.4597], [21, 0.46]],
    y: [[0, 0], [7.46, -0.139], [13.75, -0.271], [19.92, -0.372], [21, -0.385]],
    s: [[0, 1], [7.46, 0.838], [13.75, 0.683], [19.92, 0.566], [21, 0.55]],
    o: [[21, 1], [22.5, 0, "s"]],
  },
  step: {
    // 0–21 s: camina hasta quedar justo frente a la puerta
    // 21–28 s: quieto frente a la puerta
    // 28–34 s: entra por la puerta
    x: [[0, 0.55], [7.46, 0.5338], [13.75, 0.5183], [19.92, 0.5066], [21, 0.505],
        [28, 0.505], [34, 0.5]],
    y: [[0, 0], [7.46, -0.139], [13.75, -0.271], [19.92, -0.372], [21, -0.385],
        [28, -0.385], [34, -0.444]],
    s: [[0, 1], [7.46, 0.838], [13.75, 0.683], [19.92, 0.566], [21, 0.55],
        [28, 0.55], [34, 0.42]],
    o: [[31.5, 1], [33.5, 0, "s"]],
  },
  // Zoom: se acerca a Step y a la puerta
  camara: [[0, 1], [21, 1.05], [26, 2.2, "s"], [35, 2.2], [39.5, 1, "s"]],
};

/* Interpolación entre puntos clave */
const suave = (k) => k * k * (3 - 2 * k);

const valor = (t, pts) => {
  if (t <= pts[0][0]) return pts[0][1];
  for (let i = 1; i < pts.length; i++) {
    const [t1, v1, tipo] = pts[i];
    const [t0, v0] = pts[i - 1];
    if (t <= t1) {
      let k = (t - t0) / (t1 - t0);
      if (tipo === "s") k = suave(k);
      return v0 + (v1 - v0) * k;
    }
  }
  return pts[pts.length - 1][1];
};

/* Caída de las cintas por gravedad (tau = segundos desde que se sueltan) */
const caidaCinta = (t) => {
  const tau = Math.max(0, t - T.PUERTA);
  const k = Math.min(tau / 1.5, 1);
  const g = k * k; // acelera como al caer
  return {
    dx: 0.012 * k,
    dy: 0.2 * g,
    rot: 28 * g,
    sy: 1 - 0.35 * g, // se "aplasta" al quedar sobre el suelo
    o: tau < 1.5 ? 1 : 1 - Math.min((tau - 1.5) / 1, 1),
  };
};

/* ---------------------------------------------------------------------
   VIDEOS DE LA ESCENA
   nombre = identificador | titulo = nombre que se ve en el archivo
   clase = clase CSS | src = archivo en public/
   auto = true si lo controla la secuencia (no responde al clic)
--------------------------------------------------------------------- */
const VIDEOS = [
  // Fondo y decorado (de atrás hacia adelante)
  { nombre: "manchas", titulo: "Manchas", clase: "manchas5c", src: "/Manchas .webm" },
  { nombre: "cuadro1", titulo: "Cuadro 1", clase: "cuadro1-5c", src: "/Cuadro1.webm" },
  { nombre: "cuadro2", titulo: "Cuadro 2", clase: "cuadro2-5c", src: "/Cuadro2.webm" },
  { nombre: "cuadro3", titulo: "Cuadro 3", clase: "cuadro3-5c", src: "/Cuadro3.webm" },
  { nombre: "cuadro4", titulo: "Cuadro 4", clase: "cuadro4-5c", src: "/Cuadro4.webm" },
  { nombre: "cuadro5", titulo: "Cuadro 5", clase: "cuadro5-5c", src: "/Cuadro5.webm" },
  { nombre: "cuadro6", titulo: "Cuadro 6", clase: "cuadro6-5c", src: "/Cuadro6.webm" },
  { nombre: "cuadro7", titulo: "Cuadro 7", clase: "cuadro7-5c", src: "/Cuadro7.webm" },
  { nombre: "cuadro8", titulo: "Cuadro 8", clase: "cuadro8-5c", src: "/Cuadro8.webm" },
  { nombre: "puerta", clase: "puerta5c", src: "/puerta5c2.webm", auto: true },
  { nombre: "cinta", clase: "cinta5c", src: "/cintaspolicia.webm", auto: true },
  // Personajes
  { nombre: "stepEspalda1", clase: "step-espalda1-5c", src: "/step5c.webm", auto: true },
  { nombre: "orabona", clase: "orabona5c", src: "/orabona5c.webm", auto: true },
];

/* ---------------------------------------------------------------------
   HUESOS (imágenes PNG con fondo transparente, en public/)
   Al tocarlos saltan, giran y rebotan (animación en el CSS).
--------------------------------------------------------------------- */
const HUESOS = [
  { nombre: "hueso1", titulo: "Hueso 1", clase: "hueso1-5c", src: "/Hueso1.png" },
  { nombre: "hueso2", titulo: "Hueso 2", clase: "hueso2-5c", src: "/Hueso2.png" },
  { nombre: "hueso3", titulo: "Hueso 3", clase: "hueso3-5c", src: "/Hueso3.png" },
  { nombre: "hueso4", titulo: "Hueso 4", clase: "hueso4-5c", src: "/Hueso4.png" },
  { nombre: "hueso5", titulo: "Hueso 5", clase: "hueso5-5c", src: "/Hueso5.png" },
  { nombre: "hueso6", titulo: "Hueso 6", clase: "hueso6-5c", src: "/Hueso6.png" },
];

/* ---------------------------------------------------------------------
   ANTORCHAS (mismas imágenes que el capítulo 3, clases propias del 5C)
   Se acomodan con posición y tamaño en el CSS (.antorcha1-5c ... .antorcha4-5c)
--------------------------------------------------------------------- */
const ANTORCHAS = [
  { nombre: "antorcha1", titulo: "Antorcha 1", clase: "antorcha5c antorcha5c-fondo antorcha1-5c", src: "/antorcha1.png" },
  { nombre: "antorcha2", titulo: "Antorcha 2", clase: "antorcha5c antorcha5c-fondo antorcha2-5c", src: "/antorcha2.png" },
  { nombre: "antorcha3", titulo: "Antorcha 3", clase: "antorcha5c antorcha5c-frente antorcha3-5c", src: "/antorcha3.png" },
  { nombre: "antorcha4", titulo: "Antorcha 4", clase: "antorcha5c antorcha5c-frente antorcha4-5c", src: "/antorcha4.png" },
];

/* activo = true cuando debe poder empezar la secuencia.
   Si la ligas a tu botón "Activar narración", pásale ese estado:
   <LotieCap5C activo={narracionActiva} /> */
const LotieCap5C = ({ activo = true }) => {

  const escenaRef = useRef(null);
  const camaraRef = useRef(null);
  const videoRefs = useRef({});

  /* ---------------- Secuencia cinematográfica ---------------- */
  useEffect(() => {
    if (!activo) return;

    const escena = escenaRef.current;
    const camara = camaraRef.current;
    const v = videoRefs.current;

    // Sonidos de la secuencia
    const pasos = new Audio(AUDIO_PASOS);
    pasos.volume = VOLUMEN_PASOS;
    pasos.loop = true;

    const sonidoCinta = new Audio(AUDIO_CINTA);
    sonidoCinta.volume = VOLUMEN_CINTA;

    let raf = 0;
    let cancelado = false;
    let iniciada = false;
    let puertaIniciada = false;
    let cintaSonada = false;
    let t0 = 0;

    // Pasos: suenan mientras caminan (0–21 s) y cuando Step entra (28–33.5 s).
    // Si el navegador bloquea el primer intento, se reintenta en el siguiente frame.
    const actualizarPasos = (t) => {
      const debe = t < T.CAMINA_FIN || (t >= T.ENTRA_INI && t < T.STEP_FADE_FIN);
      if (debe && pasos.paused) {
        pasos.play().catch(() => {});
      }
      if (!debe && !pasos.paused) {
        pasos.pause();
        pasos.currentTime = 0;
      }
    };

    // Mueve un personaje: posición, escala y opacidad
    const mover = (el, baseX, p, t, W, H) => {
      if (!el) return;
      const dx = (valor(t, p.x) - baseX) * W;
      const dy = valor(t, p.y) * H;
      const s = valor(t, p.s);
      el.style.transform = `translateX(-50%) translate(${dx}px, ${dy}px) scale(${s})`;
      el.style.opacity = valor(t, p.o);
    };

    const aplicar = (t) => {
      const W = escena.clientWidth;
      const H = escena.clientHeight;

      // Cámara
      const zoom = valor(t, PISTAS.camara);
      camara.style.transform = `scale(${zoom})`;

      // Con el zoom cerrado se ocultan los punticos (los clics siguen activos)
      camara.dataset.zoom = zoom > 1.1 ? "1" : "0";

      // Personajes
      mover(v.orabona, BASE_X.orabona, PISTAS.orabona, t, W, H);
      mover(v.stepEspalda1, BASE_X.step, PISTAS.step, t, W, H);

      // Mantener los videos de los personajes alineados con el reloj
      ["stepEspalda1", "orabona"].forEach((n) => {
        const vid = v[n];
        if (vid && !vid.paused && !vid.ended && Math.abs(vid.currentTime - t) > 0.4) {
          vid.currentTime = t;
        }
      });

      // Puerta: salta al momento de apertura de su video (seg. 21) cuando caen las cintas
      if (t >= T.PUERTA && !puertaIniciada && v.puerta) {
        puertaIniciada = true;
        v.puerta.currentTime = PUERTA_VIDEO_ABRE;
        v.puerta.play().catch(() => {});
      }

      // Sonido de la cinta: una sola vez cuando empieza a caer
      if (t >= T.PUERTA && !cintaSonada) {
        cintaSonada = true;
        sonidoCinta.currentTime = 0;
        sonidoCinta.play().catch(() => {});
      }

      // Cintas: caen por gravedad
      if (v.cinta) {
        const c = caidaCinta(t);
        v.cinta.style.transform =
          `translateX(-50%) translate(${c.dx * W}px, ${c.dy * H}px) rotate(${c.rot}deg) scaleY(${c.sy})`;
        v.cinta.style.opacity = c.o;
      }

      actualizarPasos(t);
    };

    const frame = (ahora) => {
      if (cancelado) return;
      const t = (ahora - t0) / 1000;
      if (t >= T.FIN) {
        aplicar(T.FIN);
        pasos.pause();
        return;
      }
      aplicar(t);
      raf = requestAnimationFrame(frame);
    };

    const arrancar = async () => {
      ["stepEspalda1", "orabona"].forEach((n) => {
        if (v[n]) v[n].currentTime = 0;
      });
      await Promise.allSettled(
        ["stepEspalda1", "orabona"].map((n) => v[n] && v[n].play())
      );
      if (cancelado) return;
      t0 = performance.now(); // el reloj empieza cuando los videos ya corren
      raf = requestAnimationFrame(frame);
    };

    // Empieza cuando la escena está visible
    let observer;
    if ("IntersectionObserver" in window) {
      observer = new IntersectionObserver(
        ([e]) => {
          if (e.isIntersecting && !iniciada) {
            iniciada = true;
            observer.disconnect();
            arrancar();
          }
        },
        { threshold: 0.5 }
      );
      observer.observe(escena);
    } else {
      iniciada = true;
      arrancar();
    }

    return () => {
      cancelado = true;
      cancelAnimationFrame(raf);
      if (observer) observer.disconnect();
      pasos.pause();
      pasos.currentTime = 0;
      sonidoCinta.pause();
      sonidoCinta.currentTime = 0;
    };
  }, [activo]);

  // Reproducir un video decorativo desde el inicio (clic) y guardarlo
  const reproducirVideo = (vd) => {
    const video = videoRefs.current[vd.nombre];
    if (video) {
      video.currentTime = 0;
      video.play().catch(() => {});
    }

    GuardarInteraccion(vd.nombre, vd.titulo, vd.nombre, CAPITULO, "video", vd.src);
  };

  // El clic llega por el cuadro de clic; la que se anima es la imagen del objeto
  const imagenDe = (e) => e.currentTarget.closest(".anim5c")?.querySelector("img");

  // Animar un hueso (se puede repetir en cada clic)
  const animarHueso = (e, h) => {
    const img = imagenDe(e);
    if (!img) return;
    img.classList.remove("hueso-animando");
    void img.offsetWidth; // reinicia la animación
    img.classList.add("hueso-animando");

    GuardarInteraccion(h.nombre, h.titulo, "hueso", CAPITULO, "css", h.src);
  };

  const terminarAnimacion = (e) => {
    e.currentTarget.classList.remove("hueso-animando");
  };

  // Sonido de la antorcha (igual que en el capítulo 3)
  const sonar = (src, volumen = 1) => {
    const a = new Audio(src);
    a.volume = volumen;
    a.play().catch(() => {});
  };

  // Mover una antorcha (se puede repetir en cada clic)
  const moverAntorcha = (e, a) => {
    const img = imagenDe(e);
    if (!img) return;
    sonar(AUDIO_ANTORCHA, VOLUMEN_ANTORCHA);
    img.classList.remove("antorcha5c-mover");
    void img.offsetWidth; // reinicia la animación
    img.classList.add("antorcha5c-mover");

    GuardarInteraccion(a.nombre, a.titulo, "antorcha", CAPITULO, "css", a.src);
  };

  const terminarAntorcha = (e) => {
    e.currentTarget.classList.remove("antorcha5c-mover");
  };

  const videosConClic = VIDEOS.filter((vd) => !vd.auto);
  const videosAuto = VIDEOS.filter((vd) => vd.auto);

  return (
    <div className="escena5c" ref={escenaRef}>
      <div className={`camara5c${DEBUG ? " debug" : ""}`} ref={camaraRef}>

        <img className="fondo5c" src="./Fondo5c.png" alt="" />

        {/* ===== Manchas y cuadros (videos con clic) ===== */}
        {videosConClic.map((vd) => (
          <div
            key={vd.nombre}
            className={`anim5c ${vd.nombre === "manchas" ? "" : "cuadro5c "}${vd.clase}`}
          >
            {/* Solo visual: no recibe clics */}
            <div className="vista5c">
              <video
                ref={(el) => (videoRefs.current[vd.nombre] = el)}
                muted
                playsInline
                preload="auto"
              >
                <source src={vd.src} type="video/webm" />
              </video>
            </div>
            {/* Cuadro de clic propio, dentro de su objeto */}
            <div className="hitbox5c" onClick={() => reproducirVideo(vd)}>
              <span className="pista5c" />
            </div>
          </div>
        ))}

        {/* ===== Huesos (animación CSS) ===== */}
        {HUESOS.map((h) => (
          <div key={h.nombre} className={`anim5c hueso5c ${h.clase}`}>
            <div className="vista5c">
              <img
                src={h.src}
                alt=""
                draggable={false}
                onAnimationEnd={terminarAnimacion}
              />
            </div>
            <div className="hitbox5c" onClick={(e) => animarHueso(e, h)}>
              <span className="pista5c" />
            </div>
          </div>
        ))}

        {/* ===== Antorchas (animación CSS) ===== */}
        {ANTORCHAS.map((a) => (
          <div key={a.nombre} className={`anim5c ${a.clase}`}>
            <div className="vista5c">
              <img
                src={a.src}
                alt=""
                draggable={false}
                onAnimationEnd={terminarAntorcha}
              />
            </div>
            <div className="hitbox5c" onClick={(e) => moverAntorcha(e, a)}>
              <span className="pista5c" />
            </div>
          </div>
        ))}

        {/* ===== Puerta, cinta y personajes (los controla la secuencia, sin clic) ===== */}
        {videosAuto.map((vd) => (
          <video
            key={vd.nombre}
            ref={(el) => (videoRefs.current[vd.nombre] = el)}
            className={vd.clase}
            muted
            playsInline
            preload="auto"
          >
            <source src={vd.src} type="video/webm" />
          </video>
        ))}

      </div>
    </div>
  );
};

export default LotieCap5C;