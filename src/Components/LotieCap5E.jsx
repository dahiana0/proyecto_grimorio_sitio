import { useRef, useEffect, useState } from "react";
import "../Styles/LotieCap5E.css";

// true = muestra los cuadros de clic en rojo para calibrarlos
// false = invisibles (versión final)
const DEBUG = false;

/* ---------------------------------------------------------------------
   CÁMARA
   TIEMPO_ZOOM = segundo del video de Step en que voltea:
                 se cortan los pasos y arranca el zoom a la cara
--------------------------------------------------------------------- */
const TIEMPO_ZOOM = 15.13;

/* ---------------------------------------------------------------------
   VIDEOS DE LA ESCENA (de atrás hacia adelante)
   nombre   = identificador
   clase    = clase CSS
   src      = archivo de video en public/
   sonido   = audio que suena junto con el video (ruta en public/)
   volumen  = volumen del sonido (0 a 1)
   loop     = true si el sonido se repite mientras dura el video
   auto     = true si se reproduce solo al aparecer la escena
   cortar   = true si el sonido se detiene cuando termina el video
--------------------------------------------------------------------- */
const VIDEOS = [
  { nombre: "pintura1", clase: "pintura1-5e", src: "/pintura 1 .webm" },
  { nombre: "pintura2", clase: "pintura2-5e", src: "/pintura 2 .webm" },
  { nombre: "paso", clase: "paso5e", src: "/pisadas.webm" },
  { nombre: "huesos", clase: "huesos5e", src: "/Huesos5E.webm" },
  {
    nombre: "monstruo",
    clase: "monstruo5e",
    src: "/monstruo 2.webm",
    sonido: "/audios/RUGIDO CRIATURA.mp3",
    volumen: 0.6,
  },
  { nombre: "roges", clase: "roges5e", src: "/muerto.webm" },
  {
    nombre: "step",
    clase: "step5e",
    src: "/step5E.webm",
    sonido: "/audios/pasos.mp3",
    volumen: 0.4,
    loop: true,
    auto: true,
    cortar: true,
  },
];

const LotieCap5E = () => {

  const escenaRef = useRef(null);

  // Referencias a todos los videos
  const videoRefs = useRef({});

  // Audios (uno por video que tenga sonido)
  const audioRefs = useRef({});

  // Cámara: true mientras corre la animación de zoom
  const [zoom, setZoom] = useState(false);
  const zoomHecho = useRef(false);
  const rafRef = useRef(null);

  // Lámpara: se activa al hacer clic (balanceo + resplandor)
  const [lamparaActiva, setLamparaActiva] = useState(false);

  // Crear los audios una sola vez
  useEffect(() => {
    VIDEOS.forEach((v) => {
      if (v.sonido) {
        const audio = new Audio(v.sonido);
        audio.volume = v.volumen ?? 1;
        audio.loop = v.loop ?? false;
        audioRefs.current[v.nombre] = audio;
      }
    });

    return () => {
      cancelAnimationFrame(rafRef.current);
      Object.values(audioRefs.current).forEach((audio) => {
        audio.pause();
        audio.currentTime = 0;
      });
    };
  }, []);

  // Reproducir un video desde el inicio junto con su sonido
  const reproducirVideo = (nombre) => {
    const video = videoRefs.current[nombre];
    if (!video) return;

    video.currentTime = 0;
    video
      .play()
      .then(() => {
        const audio = audioRefs.current[nombre];
        if (audio) {
          audio.currentTime = 0;
          audio.play().catch(() => {});
        }
      })
      .catch(() => {});
  };

  // Detener el sonido cuando termina el video (solo si "cortar" es true)
  const alTerminar = (v) => {
    if (!v.cortar) return;
    const audio = audioRefs.current[v.nombre];
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }
  };

  // Vigila el video de Step. En TIEMPO_ZOOM corta los pasos y dispara
  // el zoom. El video NO se pausa: sigue reproduciéndose normal.
  const vigilarStep = () => {
    const video = videoRefs.current.step;
    if (!video || video.paused || video.ended) return;

    if (video.currentTime >= TIEMPO_ZOOM) {
      zoomHecho.current = true;

      // Los pasos dejan de sonar
      const audio = audioRefs.current.step;
      if (audio) {
        audio.pause();
        audio.currentTime = 0;
      }

      // Zoom a la cara
      setZoom(true);
      return; // ya no hace falta seguir vigilando
    }

    rafRef.current = requestAnimationFrame(vigilarStep);
  };

  // Cada vez que Step empieza (o se repite), se reinicia la cámara
  const alIniciar = (v) => {
    if (v.nombre !== "step") return;
    zoomHecho.current = false;
    setZoom(false);
    cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(vigilarStep);
  };

  // Reproducir solos los videos "auto" cuando la escena se ve en pantalla
  useEffect(() => {
    const escena = escenaRef.current;
    if (!escena) return;

    const observador = new IntersectionObserver(
      ([entrada]) => {
        if (entrada.isIntersecting) {
          VIDEOS.filter((v) => v.auto).forEach((v) => reproducirVideo(v.nombre));
        }
      },
      { threshold: 0.5 }
    );

    observador.observe(escena);
    return () => observador.disconnect();
  }, []);

  return (
    <div className="escena5e" ref={escenaRef}>

      {/* Cámara: todo lo que está dentro se mueve junto */}
      <div
        className={`camara5e${zoom ? " camara5e--zoom" : ""}${DEBUG ? " debug" : ""}`}
        onAnimationEnd={(e) => {
          // Solo reacciona a la animación de la propia cámara
          if (e.target === e.currentTarget) setZoom(false);
        }}
      >

        {/* Fondo: imagen */}
        <img className="fondo5e" src="./Fondo5e.png" alt="" />

        {/* ===== Pinturas, paso, huesos, monstruo, Roges y Step (todos con clic) ===== */}
        {VIDEOS.map((v) => (
          <div key={v.nombre} className={`anim5e ${v.clase}`}>
            {/* Solo visual: no recibe clics */}
            <div className="vista5e">
              <video
                ref={(el) => (videoRefs.current[v.nombre] = el)}
                muted
                playsInline
                preload="auto"
                onPlay={() => alIniciar(v)}
                onEnded={() => alTerminar(v)}
              >
                <source src={v.src} type="video/webm" />
              </video>
            </div>
            {/* Cuadro de clic propio, dentro de su objeto */}
            <div className="hitbox5e" onClick={() => reproducirVideo(v.nombre)}>
              <span className="pista5e" />
            </div>
          </div>
        ))}

        {/* ===== Lámpara: al frente. Clic = se balancea y resplandece ===== */}
        <div className="anim5e lampara5e">
          <div className="vista5e">
            <img
              src="./lampara1.png"
              alt=""
              className={lamparaActiva ? "lampara5e--activa" : ""}
              onAnimationEnd={(e) => {
                e.stopPropagation();
                setLamparaActiva(false);
              }}
            />
          </div>
          <div className="hitbox5e" onClick={() => setLamparaActiva(true)}>
            <span className="pista5e" />
          </div>
        </div>

      </div>

    </div>
  );
};

export default LotieCap5E;