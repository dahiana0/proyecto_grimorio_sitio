import { useRef, useEffect } from "react";
import GuardarInteraccion from "./GuardarInteraccion";
import "../Styles/LotieCap5B.css";

// Número de capítulo con el que se guardan las interacciones
const CAPITULO = 5;

// true = muestra los cuadros de clic en rojo para calibrarlos
// false = invisibles (versión final)
const DEBUG = false;

/* ---------------------------------------------------------------------
   AUDIOS (rutas dentro de public/)
   Cambia aquí los nombres de tus archivos.
--------------------------------------------------------------------- */
const AUDIO_PASOS = "/audios/pasos.mp3";   // suena mientras Step baja
const AUDIO_CINTA = "/audios/cinta.mp3";     // suena cuando se rasga la cinta

const VOLUMEN_PASOS = 0.4;
const VOLUMEN_CINTA = 0.7;

/* ---------------------------------------------------------------------
   TIEMPOS (ms)
   Todo arranca al cargar la escena: la cinta (24 s) y Step bajando.
   Step llega a la cinta en T_CINTA, cuando la cinta se abre.
--------------------------------------------------------------------- */
const T_CINTA = 21000;          // segundo 21: la cinta cae y Step pasa por ahí
const DURACION_BAJADA = 30000;  // cuánto tarda Step en llegar hasta abajo

/* ---------------------------------------------------------------------
   TAMAÑO DE STEP (se cambia SOLO AQUÍ)
   ANCHO_STEP = ancho en pantalla, en % del ancho de la escena.
   Más grande: 18  |  más pequeño: 12
--------------------------------------------------------------------- */
const ANCHO_STEP = 15;
const ALTO_STEP_PCT = ANCHO_STEP * 2.6; // solo para centrar la cámara

// Momento (0 a 1) en que Step está sobre la cinta
const O_CINTA = T_CINTA / DURACION_BAJADA;

/* ---------------------------------------------------------------------
   RECORRIDO (% de la escena)
   o = momento de la bajada (0 a 1)
   x, y = posición de los PIES de Step
   s = zoom de la cámara
--------------------------------------------------------------------- */
const PUNTOS = [
  { o: 0,              x: 50.5, y: 66, s: 1.8 },
  { o: O_CINTA * 0.5,  x: 50.5, y: 71, s: 1.7 },
  { o: O_CINTA,        x: 50.5, y: 79, s: 1.5 },  // sobre la cinta
  { o: 0.85,           x: 50.5, y: 88, s: 1.3 },
  { o: 1,              x: 50.5, y: 95, s: 1 },
];

const MUESTRAS = 60;
const RECORRIDO = Array.from({ length: MUESTRAS + 1 }, (_, i) => {
  const o = i / MUESTRAS;
  let k = 0;
  while (k < PUNTOS.length - 2 && o > PUNTOS[k + 1].o) k++;
  const a = PUNTOS[k];
  const b = PUNTOS[k + 1];
  const t = (o - a.o) / (b.o - a.o);
  const lerp = (p, q) => p + (q - p) * t;
  const s = lerp(a.s, b.s);
  return {
    o,
    x: lerp(a.x, b.x),
    y: lerp(a.y, b.y),
    s,
    w: ANCHO_STEP / s,
    h: ALTO_STEP_PCT / s,
  };
});

const camaraTransform = (x, y, s) => {
  let tx = 50 - s * x;
  let ty = 50 - s * y;
  tx = Math.min(0, Math.max(100 * (1 - s), tx));
  ty = Math.min(0, Math.max(100 * (1 - s), ty));
  return `translate(${tx}%, ${ty}%) scale(${s})`;
};

const LotieCap5B = () => {

  const camaraRef = useRef(null);

  // Videos
  const lamparaRef = useRef(null);
  const telarana1Ref = useRef(null);
  const telarana2Ref = useRef(null);
  const telarana3Ref = useRef(null);
  const cintaRef = useRef(null);
  const stepRef = useRef(null);

  // Audios
  const sonidoPasos = useRef(new Audio(AUDIO_PASOS));
  const sonidoCinta = useRef(new Audio(AUDIO_CINTA));

  // Reproducir un video desde el inicio
  const reproducirVideo = (ref) => {
    if (ref.current) {
      ref.current.currentTime = 0;
      ref.current.play().catch(() => {});
    }
  };

  useEffect(() => {
    const pasos = sonidoPasos.current;
    const cintaSonido = sonidoCinta.current;
    const step = stepRef.current;
    const camara = camaraRef.current;

    pasos.volume = VOLUMEN_PASOS;
    cintaSonido.volume = VOLUMEN_CINTA;
    pasos.loop = true;

    // Todo arranca al mismo tiempo: cinta (24 s), Step bajando y pasos
    reproducirVideo(cintaRef);
    reproducirVideo(stepRef);
    pasos.currentTime = 0;
    pasos.play().catch(() => {});

    // Sonido de la cinta al rasgarse
    const timerCinta = setTimeout(() => {
      cintaSonido.currentTime = 0;
      cintaSonido.play().catch(() => {});
    }, T_CINTA);

    const opciones = {
      duration: DURACION_BAJADA,
      easing: "linear",
      fill: "forwards",
    };

    const animStep = step.animate(
      RECORRIDO.map((p) => ({
        offset: p.o,
        left: `${p.x}%`,
        top: `${p.y}%`,
        width: `${p.w}%`,
      })),
      opciones
    );

    const animCamara = camara.animate(
      RECORRIDO.map((p) => ({
        offset: p.o,
        transform: camaraTransform(p.x, p.y - p.h / 2, p.s),
      })),
      opciones
    );

    // Al llegar abajo, Step se queda quieto y los pasos se detienen
    animStep.onfinish = () => {
      step.pause();
      pasos.pause();
    };

    return () => {
      clearTimeout(timerCinta);
      animStep.cancel();
      animCamara.cancel();
      pasos.pause();
      cintaSonido.pause();
    };
  }, []);

  // Animación de las ceras (imágenes): reinicia la clase para poder repetirla.
  // El clic llega por el cuadro de clic; la que se anima es la imagen de la cera.
  const animarCera = (e, id, nombre, src) => {
    const img = e.currentTarget.closest(".anim5b")?.querySelector("img");
    if (!img) return;
    img.classList.remove("animar");
    void img.offsetWidth; // fuerza reflow para reiniciar la animación
    img.classList.add("animar");

    // Animación CSS: se guarda con su imagen y se anima en el archivo
    GuardarInteraccion(id, nombre, "cera", CAPITULO, "css", src);
  };

  const activarVideo = (ref, id, nombre, src) => {
    reproducirVideo(ref);
    GuardarInteraccion(id, nombre, id, CAPITULO, "video", src);
  };

  // Objetos con clic: cada uno tiene su animación + su propio cuadro de clic
  const ceras = [
    { id: "cera1", nombre: "Cera 1", clase: "cera1-5b", src: "./cera1.png" }, // fondo
    { id: "cera2", nombre: "Cera 2", clase: "cera2-5b", src: "./cera2.png" },
    { id: "cera3", nombre: "Cera 3", clase: "cera3-5b", src: "./cera3.png" }, // mitad
    { id: "cera4", nombre: "Cera 4", clase: "cera4-5b", src: "./cera4 .png" },
    { id: "cera5", nombre: "Cera 5", clase: "cera5-5b", src: "./cera5.png" }, // frente
    { id: "cera6", nombre: "Cera 6", clase: "cera6-5b", src: "./cera6.png" },
  ];

  const telaranas = [
    { id: "telarana1", nombre: "Telaraña 1", clase: "telarana1-5b", ref: telarana1Ref, src: "/Telarana1Cap5b.webm" },
    { id: "telarana2", nombre: "Telaraña 2", clase: "telarana2-5b", ref: telarana2Ref, src: "/Telarana2Cap5b.webm" },
    { id: "telarana3", nombre: "Telaraña 3", clase: "telarana3-5b", ref: telarana3Ref, src: "/Telarana3Cap5b.webm" },
  ];

  return (
    <div className="escena5b">

      {/* Cámara: todo lo de adentro se mueve y hace zoom */}
      <div className={`camara5b${DEBUG ? " debug" : ""}`} ref={camaraRef}>

        <img className="fondo5b" src="./Fondo5b.png" alt="" />

        {/* ===== Ceras (imagen + animación CSS al tocar) ===== */}
        {ceras.map(({ id, nombre, clase, src }) => (
          <div key={clase} className={`anim5b cera5b ${clase}`}>
            {/* Solo visual: no recibe clics */}
            <div className="vista5b">
              <img src={src} alt="" />
            </div>
            {/* Cuadro de clic propio, dentro de su objeto */}
            <div
              className="hitbox5b"
              onClick={(e) => animarCera(e, id, nombre, src)}
            >
              <span className="pista5b" />
            </div>
          </div>
        ))}

        {/* Cinta policial (video de 24 s): cae en el segundo 21 */}
        <video
          ref={cintaRef}
          className="cinta5b"
          muted
          playsInline
        >
          <source src="./cintas.webm" type="video/webm" />
        </video>

        {/* ===== Telarañas (videos) ===== */}
        {telaranas.map(({ id, nombre, clase, ref, src }) => (
          <div key={clase} className={`anim5b telarana5b ${clase}`}>
            <div className="vista5b">
              <video ref={ref} muted playsInline>
                <source src={src} type="video/webm" />
              </video>
            </div>
            <div
              className="hitbox5b"
              onClick={() => activarVideo(ref, id, nombre, src)}
            >
              <span className="pista5b" />
            </div>
          </div>
        ))}

        {/* ===== Candelabro (video) ===== */}
        <div className="anim5b lampara5b">
          <div className="vista5b">
            <video ref={lamparaRef} muted playsInline>
              <source src="./candelabro..webm" type="video/webm" />
            </video>
          </div>
          <div
            className="hitbox5b"
            onClick={() =>
              activarVideo(lamparaRef, "candelabro", "Candelabro", "./candelabro..webm")
            }
          >
            <span className="pista5b" />
          </div>
        </div>

        {/* Step (video): baja solo desde el inicio (no se le hace clic) */}
        <video
          ref={stepRef}
          className="step5b"
          muted
          playsInline
          loop
        >
          <source src="./stepC5B.webm" type="video/webm" />
        </video>

      </div>

    </div>
  );
};

export default LotieCap5B;