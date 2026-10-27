import { useRef, useEffect, useState } from "react";
import GuardarInteraccion from "./GuardarInteraccion";
import "../Styles/LotieCap5E.css";


const CAPITULO = 5;


const DEBUG = false;


const TIEMPO_ZOOM = 15.13;


const VIDEOS = [
  { nombre: "pintura1", id: "pintura1", titulo: "Pintura 1", clase: "pintura1-5e", src: "/pintura 1 .webm" },
  { nombre: "pintura2", id: "pintura2", titulo: "Pintura 2", clase: "pintura2-5e", src: "/pintura 2 .webm" },
  { nombre: "paso", id: "paso", titulo: "Pisadas", clase: "paso5e", src: "/pisadas.webm" },
  { nombre: "huesos", id: "huesos5e", titulo: "Huesos", clase: "huesos5e", src: "/Huesos5E.webm" },
  {
    nombre: "monstruo",
    id: "monstruo5e",
    titulo: "Monstruo",
    clase: "monstruo5e",
    src: "/monstruo 2.webm",
    sonido: "/audios/RUGIDO CRIATURA.mp3",
    volumen: 0.6,
  },
  { nombre: "roges", id: "roges", titulo: "Rogers", clase: "roges5e", src: "/muerto.webm" },
  {
    nombre: "step",
    id: "step5e",
    titulo: "Step",
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

  const videoRefs = useRef({});


  const audioRefs = useRef({});


  const [zoom, setZoom] = useState(false);
  const zoomHecho = useRef(false);
  const rafRef = useRef(null);


  const [lamparaActiva, setLamparaActiva] = useState(false);


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


  const vigilarStep = () => {
    const video = videoRefs.current.step;
    if (!video || video.paused || video.ended) return;

    if (video.currentTime >= TIEMPO_ZOOM) {
      zoomHecho.current = true;


      const audio = audioRefs.current.step;
      if (audio) {
        audio.pause();
        audio.currentTime = 0;
      }


      setZoom(true);
      return;
    }

    rafRef.current = requestAnimationFrame(vigilarStep);
  };


  const alIniciar = (v) => {
    if (v.nombre !== "step") return;
    zoomHecho.current = false;
    setZoom(false);
    cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(vigilarStep);
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
    GuardarInteraccion("lampara5e", "Lámpara 2", "lampara", CAPITULO, "css", "/lampara1.png");
  };

  return (
    <div className="escena5e" ref={escenaRef}>


      <div
        className={`camara5e${zoom ? " camara5e--zoom" : ""}${DEBUG ? " debug" : ""}`}
        onAnimationEnd={(e) => {

          if (e.target === e.currentTarget) setZoom(false);
        }}
      >


        <img className="fondo5e" src="./Fondo5e.png" alt="" />


        {VIDEOS.map((v) => (
          <div key={v.nombre} className={`anim5e ${v.clase}`}>

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

            <div className="hitbox5e" onClick={() => clicVideo(v)}>
              <span className="pista5e" />
            </div>
          </div>
        ))}


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
          <div className="hitbox5e" onClick={clicLampara}>
            <span className="pista5e" />
          </div>
        </div>

      </div>

    </div>
  );
};

export default LotieCap5E;