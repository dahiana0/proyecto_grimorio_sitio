import { useRef, useEffect, useState } from "react";
import "../Styles/LotieCap5D.css";

// true = muestra los cuadros de clic en rojo para calibrarlos
// false = invisibles (versión final)
const DEBUG = false;

/* ---------------------------------------------------------------------
   VIDEOS DE LA ESCENA (de atrás hacia adelante)
   nombre   = identificador
   clase    = clase CSS
   src      = archivo de video en public/
   sonido   = audio que suena junto con el video (ruta en public/)
   volumen  = volumen del sonido (0 a 1)
   auto     = true si se reproduce solo al aparecer la escena
   cortar   = true si el sonido se detiene cuando termina el video
--------------------------------------------------------------------- */
const VIDEOS = [
  { nombre: "estatua1", clase: "estatua1-5d", src: "/cera1c.webm" },
  { nombre: "estatua2", clase: "estatua2-5d", src: "/cera2c.webm" },
  { nombre: "estatua3", clase: "estatua3-5d", src: "/cera3c.webm" },
  { nombre: "estatua4", clase: "estatua4-5d", src: "/cera4c.webm" },
  {
    nombre: "rata",
    clase: "rata5d",
    src: "/Rata5c.webm",
    sonido: "/Rat - Sound Effect  ProSounds.mp3",
    volumen: 0.5,
  },
  {
    nombre: "monstruo",
    clase: "monstruo5d",
    src: "/chull.webm",
    sonido: "/audios/RUGIDO CRIATURA.mp3",
    volumen: 0.6,
    auto: true,
  },
  {
    nombre: "step",
    clase: "step5d",
    src: "/step5D.webm",
    sonido: "/audios/pasos.mp3",
    volumen: 0.4,
    auto: true,
    cortar: true,
  },
];

const LotieCap5D = () => {

  const escenaRef = useRef(null);

  // Referencias a todos los videos
  const videoRefs = useRef({});

  // Audios (uno por video que tenga sonido)
  const audioRefs = useRef({});

  // Lámpara: se activa al hacer clic (balanceo + resplandor)
  const [lamparaActiva, setLamparaActiva] = useState(false);

  // Crear los audios una sola vez
  useEffect(() => {
    VIDEOS.forEach((v) => {
      if (v.sonido) {
        const audio = new Audio(v.sonido);
        audio.volume = v.volumen ?? 1;
        audioRefs.current[v.nombre] = audio;
      }
    });

    return () => {
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
    <div className={`escena5d${DEBUG ? " debug" : ""}`} ref={escenaRef}>

      {/* Fondo: imagen */}
      <img className="fondo5d" src="./Fondo5d.png" alt="" />

      {/* ===== Lámpara: clic = se mueve y resplandece ===== */}
      <div className="anim5d lampara5d">
        {/* Solo visual: no recibe clics */}
        <div className="vista5d">
          <img
            src="./lampara1.png"
            alt=""
            className={lamparaActiva ? "lampara5d--activa" : ""}
            onAnimationEnd={() => setLamparaActiva(false)}
          />
        </div>
        {/* Cuadro de clic propio, dentro de su objeto */}
        <div className="hitbox5d" onClick={() => setLamparaActiva(true)}>
          <span className="pista5d" />
        </div>
      </div>

      {/* ===== Estatuas, rata, monstruo y Step (todos con clic) ===== */}
      {VIDEOS.map((v) => (
        <div key={v.nombre} className={`anim5d ${v.clase}`}>
          <div className="vista5d">
            <video
              ref={(el) => (videoRefs.current[v.nombre] = el)}
              muted
              playsInline
              preload="auto"
              onEnded={() => alTerminar(v)}
            >
              <source src={v.src} type="video/webm" />
            </video>
          </div>
          <div className="hitbox5d" onClick={() => reproducirVideo(v.nombre)}>
            <span className="pista5d" />
          </div>
        </div>
      ))}

    </div>
  );
};

export default LotieCap5D;