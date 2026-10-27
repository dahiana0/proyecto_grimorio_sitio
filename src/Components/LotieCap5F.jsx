import { useRef, useEffect } from "react";
import GuardarInteraccion from "./GuardarInteraccion";
import "../Styles/LotieCap5F.css";


const CAPITULO = 5;


const DEBUG = false;


const SONIDO_PUERTA = {
  src: "/audios/Sonido Puerta Abierta y Cerrada (1).mp3",
  tiempos: [0, 9.16, 17.1, 25.8],
};

const SONIDO_SILLA = {
  src: "/audios/Arrastrar silla_ efecto de sonido_.mp3",
  tiempos: [0, 7.55, 14.6, 21.9],
};


const LotieCap5F = ({ volumen = 1 }) => {

  const sillaRef = useRef(null);
  const librosRef = useRef(null);
  const puertaRef = useRef(null);
  const pergaminosRef = useRef(null);


  const stepRef = useRef(null);
  const orabonaRef = useRef(null);


  const lamparaRef = useRef(null);
  const mancha1Ref = useRef(null);
  const mancha2Ref = useRef(null);


  const animacionesRef = useRef({});


  const volumenRef = useRef(volumen);
  volumenRef.current = volumen;


  const sonandoRef = useRef({ puerta: new Set(), silla: new Set() });
  const proximoRef = useRef({ puerta: 0, silla: 0 });


  const reproducirVideo = (ref) => {
    if (ref.current) {
      ref.current.currentTime = 0;
      ref.current.play().catch(() => { });
    }
  };


  const reiniciarSonidos = (clave) => {
    proximoRef.current[clave] = 0;
    sonandoRef.current[clave].forEach((a) => a.pause());
    sonandoRef.current[clave].clear();
  };


  const tocarSonido = (clave, src) => {
    const a = new Audio(src);
    a.volume = volumenRef.current;
    sonandoRef.current[clave].add(a);
    a.addEventListener("ended", () => sonandoRef.current[clave].delete(a));
    a.play().catch(() => { });
  };


  const tocarAnimacion = (clave, ref) => {
    reiniciarSonidos(clave);
    reproducirVideo(ref);
  };


  useEffect(() => {
    Object.values(sonandoRef.current).forEach((set) =>
      set.forEach((a) => {
        a.volume = volumen;
      })
    );
  }, [volumen]);


  useEffect(() => {
    reproducirVideo(stepRef);
    reproducirVideo(orabonaRef);


    const sonidos = [
      { clave: "puerta", ref: puertaRef, ...SONIDO_PUERTA },
      { clave: "silla", ref: sillaRef, ...SONIDO_SILLA },
    ];

    let raf;
    const vigilarSonidos = () => {
      sonidos.forEach(({ clave, ref, src, tiempos }) => {
        const v = ref.current;
        if (!v || v.paused) return;

        const t = v.currentTime;
        while (
          proximoRef.current[clave] < tiempos.length &&
          tiempos[proximoRef.current[clave]] <= t
        ) {
          tocarSonido(clave, src);
          proximoRef.current[clave] += 1;
        }
      });
      raf = requestAnimationFrame(vigilarSonidos);
    };
    raf = requestAnimationFrame(vigilarSonidos);


    return () => {
      cancelAnimationFrame(raf);
      reiniciarSonidos("puerta");
      reiniciarSonidos("silla");
      Object.values(animacionesRef.current).forEach((anim) => anim.cancel());
    };
  }, []);


  const lanzarAnimacion = (nombre, ref, keyframes, opciones) => {
    const el = ref.current;
    if (!el) return;

    if (animacionesRef.current[nombre]) animacionesRef.current[nombre].cancel();
    animacionesRef.current[nombre] = el.animate(keyframes, opciones);
  };


  const animarLampara = () => {
    lanzarAnimacion(
      "lampara",
      lamparaRef,
      [
        { transform: "rotate(0deg)", filter: "brightness(1)   drop-shadow(0 0 10px rgba(255, 200, 100, .5))", offset: 0 },
        { transform: "rotate(8deg)", filter: "brightness(1.5) drop-shadow(0 0 40px rgba(255, 210, 120, 1))", offset: 0.15 },
        { transform: "rotate(-6deg)", filter: "brightness(1.4) drop-shadow(0 0 34px rgba(255, 210, 120, .9))", offset: 0.3 },
        { transform: "rotate(4deg)", filter: "brightness(1.3) drop-shadow(0 0 26px rgba(255, 205, 110, .8))", offset: 0.45 },
        { transform: "rotate(-2.5deg)", filter: "brightness(1.2) drop-shadow(0 0 20px rgba(255, 200, 100, .7))", offset: 0.6 },
        { transform: "rotate(1deg)", filter: "brightness(1.1) drop-shadow(0 0 14px rgba(255, 200, 100, .6))", offset: 0.8 },
        { transform: "rotate(0deg)", filter: "brightness(1)   drop-shadow(0 0 10px rgba(255, 200, 100, .5))", offset: 1 },
      ],
      { duration: 3500, easing: "ease-out" }
    );


    GuardarInteraccion("lampara5f", "Lámpara 3", "lampara", CAPITULO, "css", "./Lampara5F.png");
  };


  const animarMancha = (nombre, ref, titulo, src) => {
    lanzarAnimacion(
      nombre,
      ref,
      [
        { transform: "scale(1, 1)", filter: "brightness(1)", offset: 0 },
        { transform: "scale(0.85, 0.8)", filter: "brightness(0.8)", offset: 0.15 },
        { transform: "scale(1.25, 1.1)", filter: "brightness(1.2)", offset: 0.45 },
        { transform: "scale(1.15, 1.05)", filter: "brightness(1.1)", offset: 0.7 },
        { transform: "scale(1, 1)", filter: "brightness(1)", offset: 1 },
      ],
      { duration: 1600, easing: "ease-out" }
    );


    GuardarInteraccion(nombre, titulo, "mancha", CAPITULO, "css", src);
  };


  const manchas = [
    { clase: "mancha1-5f", ref: mancha1Ref, src: "./Mancha1 .png", nombre: "mancha1", titulo: "Mancha 1" },
    { clase: "mancha2-5f", ref: mancha2Ref, src: "./Mancha2 .png", nombre: "mancha2", titulo: "Mancha 2" },
  ];


  const videos = [
    { id: "puerta5f", titulo: "Puerta", clase: "puerta5f", ref: puertaRef, src: "./Puerta5f.webm", onClick: () => tocarAnimacion("puerta", puertaRef) },
    { id: "silla5f", titulo: "Silla", clase: "silla5f", ref: sillaRef, src: "./silla.webm", onClick: () => tocarAnimacion("silla", sillaRef) },
    { id: "libros5f", titulo: "Libros", clase: "libros5f", ref: librosRef, src: "./Libros.webm", onClick: () => reproducirVideo(librosRef) },
    { id: "pergaminos5f", titulo: "Pergaminos", clase: "pergaminos5f", ref: pergaminosRef, src: "./periodico.webm", onClick: () => reproducirVideo(pergaminosRef) },
  ];

  return (
    <div className={`escena5f${DEBUG ? " debug" : ""}`}>

      <img className="fondo5f" src="./Escenario5F.png" alt="" />


      {manchas.map(({ clase, ref, src, nombre, titulo }) => (
        <div key={clase} className={`anim5f mancha5f ${clase}`}>

          <div className="vista5f">
            <img ref={ref} src={src} alt="" />
          </div>

          <div
            className="hitbox5f"
            onClick={() => animarMancha(nombre, ref, titulo, src)}
          >
            <span className="pista5f" />
          </div>
        </div>
      ))}


      {videos.map(({ id, titulo, clase, ref, src, onClick }) => (
        <div key={clase} className={`anim5f ${clase}`}>
          <div className="vista5f">
            <video ref={ref} muted playsInline>
              <source src={src} type="video/webm" />
            </video>
          </div>
          <div
            className="hitbox5f"
            onClick={() => {
              onClick();
              GuardarInteraccion(id, titulo, id, CAPITULO, "video", src);
            }}
          >
            <span className="pista5f" />
          </div>
        </div>
      ))}


      <div className="anim5f lampara5f">
        <div className="vista5f">
          <img ref={lamparaRef} src="./Lampara5F.png" alt="" />
        </div>
        <div className="hitbox5f" onClick={animarLampara}>
          <span className="pista5f" />
        </div>
      </div>


      <video
        ref={orabonaRef}
        className="orabona5f"
        muted
        playsInline
      >
        <source src="./orabona.webm" type="video/webm" />
      </video>


      <video
        ref={stepRef}
        className="step5f"
        muted
        playsInline
        loop
      >
        <source src="./step5f.webm" type="video/webm" />
      </video>
    </div>
  );
};

export default LotieCap5F;