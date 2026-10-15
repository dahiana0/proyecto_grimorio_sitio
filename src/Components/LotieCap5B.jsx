import { useRef, useEffect } from "react";
import "../Styles/LotieCap5B.css";

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

  // Animación de las ceras (imágenes): reinicia la clase para poder repetirla
  const animarCera = (e) => {
    const el = e.currentTarget;
    el.classList.remove("animar");
    void el.offsetWidth; // fuerza reflow para reiniciar la animación
    el.classList.add("animar");
  };

  return (
    <div className="escena5b">

      {/* Cámara: todo lo de adentro se mueve y hace zoom */}
      <div className="camara5b" ref={camaraRef}>

        <img className="fondo5b" src="./Fondo5b.png" alt="" />

        {/* Ceras (imágenes con animación al tocar) */}
        {/* Fondo */}
        <img className="cera1-5b" src="./cera1.png" alt="" onClick={animarCera} />
        <img className="cera2-5b" src="./cera2.png" alt="" onClick={animarCera} />
        {/* Mitad */}
        <img className="cera3-5b" src="./cera3.png" alt="" onClick={animarCera} />
        <img className="cera4-5b" src="./cera4 .png" alt="" onClick={animarCera} />
        {/* Frente */}
        <img className="cera5-5b" src="./cera5.png" alt="" onClick={animarCera} />
        <img className="cera6-5b" src="./cera6.png" alt="" onClick={animarCera} />

        {/* Cinta policial (video de 24 s): cae en el segundo 21 */}
        <video
          ref={cintaRef}
          className="cinta5b"
          muted
          playsInline
        >
          <source src="./cintas.webm" type="video/webm" />
        </video>

        {/* Telarañas (videos) */}
        <video
          ref={telarana1Ref}
          className="telarana1-5b"
          muted
          playsInline
          onClick={() => reproducirVideo(telarana1Ref)}
        >
          <source src="/Telarana1Cap5b.webm" type="video/webm" />
        </video>

        <video
          ref={telarana2Ref}
          className="telarana2-5b"
          muted
          playsInline
          onClick={() => reproducirVideo(telarana2Ref)}
        >
          <source src="/Telarana2Cap5b.webm" type="video/webm" />
        </video>

        <video
          ref={telarana3Ref}
          className="telarana3-5b"
          muted
          playsInline
          onClick={() => reproducirVideo(telarana3Ref)}
        >
          <source src="/Telarana3Cap5b.webm" type="video/webm" />
        </video>

        {/* Candelabro (video) */}
        <video
          ref={lamparaRef}
          className="lampara5b"
          muted
          playsInline
          onClick={() => reproducirVideo(lamparaRef)}
        >
          <source src="./candelabro..webm" type="video/webm" />
        </video>

        {/* Step (video): baja solo desde el inicio */}
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