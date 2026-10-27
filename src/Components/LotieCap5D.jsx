import { useRef, useEffect, useState } from "react";
import GuardarInteraccion from "./GuardarInteraccion";
import "../Styles/LotieCap5D.css";


const CAPITULO = 5;


const DEBUG = false;


const VIDEOS = [
  { nombre: "estatua1", id: "estatua1", titulo: "Estatua 1", clase: "estatua1-5d", src: "/cera1c.webm" },
  { nombre: "estatua2", id: "estatua2", titulo: "Estatua 2", clase: "estatua2-5d", src: "/cera2c.webm" },
  { nombre: "estatua3", id: "estatua3", titulo: "Estatua 3", clase: "estatua3-5d", src: "/cera3c.webm" },
  { nombre: "estatua4", id: "estatua4", titulo: "Estatua 4", clase: "estatua4-5d", src: "/cera4c.webm" },
  {
    nombre: "rata",
    id: "rata",
    titulo: "Rata",
    clase: "rata5d",
    src: "/Rata5c.webm",
    sonido: "/Rat - Sound Effect  ProSounds.mp3",
    volumen: 0.5,
  },
  {
    nombre: "monstruo",
    id: "monstruo5d",
    titulo: "Monstruo",
    clase: "monstruo5d",
    src: "/chull.webm",
    sonido: "/audios/RUGIDO CRIATURA.mp3",
    volumen: 0.6,
    auto: true,
  },
  {
    nombre: "step",
    id: "step5d",
    titulo: "Step",
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


  const videoRefs = useRef({});


  const audioRefs = useRef({});

  const [lamparaActiva, setLamparaActiva] = useState(false);


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
          audio.play().catch(() => { });
        }
      })
      .catch(() => { });
  };


  const clicVideo = (v) => {
    reproducirVideo(v.nombre);
    GuardarInteraccion(v.id, v.titulo, v.id, CAPITULO, "video", v.src);
  };


  const alTerminar = (v) => {
    if (!v.cortar) return;
    const audio = audioRefs.current[v.nombre];
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }
  };


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


  const clicLampara = () => {
    setLamparaActiva(true);
    GuardarInteraccion("lampara5d", "Lámpara 1", "lampara", CAPITULO, "css", "/lampara1.png");
  };

  return (
    <div className={`escena5d${DEBUG ? " debug" : ""}`} ref={escenaRef}>


      <img className="fondo5d" src="./Fondo5d.png" alt="" />


      <div className="anim5d lampara5d">

        <div className="vista5d">
          <img
            src="./lampara1.png"
            alt=""
            className={lamparaActiva ? "lampara5d--activa" : ""}
            onAnimationEnd={() => setLamparaActiva(false)}
          />
        </div>

        <div className="hitbox5d" onClick={clicLampara}>
          <span className="pista5d" />
        </div>
      </div>


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
          <div className="hitbox5d" onClick={() => clicVideo(v)}>
            <span className="pista5d" />
          </div>
        </div>
      ))}

    </div>
  );
};

export default LotieCap5D;