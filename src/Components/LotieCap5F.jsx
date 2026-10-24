import { useRef, useEffect } from "react";
import "../Styles/LotieCap5F.css";

// true = muestra los cuadros de clic en rojo para calibrarlos
// false = invisibles (versión final)
const DEBUG = false;

// Esta escena solo maneja los sonidos de la puerta y la silla.

// ---------------------------------------------------------------------
// Sonidos de la puerta y la silla
// Cada número es el segundo de la animación (de 30 s) en el que suena el sonido.
// Tiempos leídos de la línea de tiempo de After Effects.
// Los archivos van en public/audios/ (cambia el nombre si se llaman distinto).
// ---------------------------------------------------------------------
const SONIDO_PUERTA = {
  src: "/audios/Sonido Puerta Abierta y Cerrada (1).mp3",
  tiempos: [0, 9.16, 17.1, 25.8],
};

const SONIDO_SILLA = {
  src: "/audios/Arrastrar silla_ efecto de sonido_.mp3",
  tiempos: [0, 7.55, 14.6, 21.9],
};

// volumen: 0 a 1 (slider / mute del visor)
const LotieCap5F = ({ volumen = 1 }) => {
  // Videos que se reproducen al tocar
  const sillaRef = useRef(null);
  const librosRef = useRef(null);
  const puertaRef = useRef(null);
  const pergaminosRef = useRef(null);

  // Videos de personajes (se reproducen solos)
  const stepRef = useRef(null);
  const orabonaRef = useRef(null);

  // Imágenes animadas al tocar: lámpara y manchas
  const lamparaRef = useRef(null);
  const mancha1Ref = useRef(null);
  const mancha2Ref = useRef(null);

  // Animación actual de cada imagen (para poder reiniciarla en cada click)
  const animacionesRef = useRef({});

  // Volumen siempre actualizado y control de los sonidos de puerta / silla
  const volumenRef = useRef(volumen);
  volumenRef.current = volumen;

  // Sonidos que están sonando ahora y próximo sonido pendiente de cada animación
  const sonandoRef = useRef({ puerta: new Set(), silla: new Set() });
  const proximoRef = useRef({ puerta: 0, silla: 0 });

  // Reproducir un video desde el inicio
  const reproducirVideo = (ref) => {
    if (ref.current) {
      ref.current.currentTime = 0;
      ref.current.play().catch(() => {});
    }
  };

  // Corta los sonidos de una animación y vuelve a esperar el primero
  const reiniciarSonidos = (clave) => {
    proximoRef.current[clave] = 0;
    sonandoRef.current[clave].forEach((a) => a.pause());
    sonandoRef.current[clave].clear();
  };

  // Reproduce un sonido (una copia nueva cada vez, por si se solapan)
  const tocarSonido = (clave, src) => {
    const a = new Audio(src);
    a.volume = volumenRef.current;
    sonandoRef.current[clave].add(a);
    a.addEventListener("ended", () => sonandoRef.current[clave].delete(a));
    a.play().catch(() => {});
  };

  // Al tocar puerta o silla: se reinician sus sonidos y su animación
  const tocarAnimacion = (clave, ref) => {
    reiniciarSonidos(clave);
    reproducirVideo(ref);
  };

  // Volumen del visor (slider / mute) también para los sonidos en curso
  useEffect(() => {
    Object.values(sonandoRef.current).forEach((set) =>
      set.forEach((a) => {
        a.volume = volumen;
      })
    );
  }, [volumen]);

  // Step y Orabona arrancan al cargar la escena
  useEffect(() => {
    reproducirVideo(stepRef);
    reproducirVideo(orabonaRef);

    // Dispara cada sonido cuando la animación llega a su segundo
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

    // Al salir de la escena se cancelan sonidos y animaciones de imágenes
    return () => {
      cancelAnimationFrame(raf);
      reiniciarSonidos("puerta");
      reiniciarSonidos("silla");
      Object.values(animacionesRef.current).forEach((anim) => anim.cancel());
    };
  }, []);

  // Lanza una animación sobre una imagen. Si se toca mientras aún se
  // mueve, corta la anterior y arranca de nuevo desde cero (cada click).
  const lanzarAnimacion = (nombre, ref, keyframes, opciones) => {
    const el = ref.current;
    if (!el) return;

    if (animacionesRef.current[nombre]) animacionesRef.current[nombre].cancel();
    animacionesRef.current[nombre] = el.animate(keyframes, opciones);
  };

  // Lámpara: balanceo + resplandor
  // (el centrado horizontal lo hace el contenedor, por eso no hay translateX aquí)
  const animarLampara = () => {
    lanzarAnimacion(
      "lampara",
      lamparaRef,
      [
        { transform: "rotate(0deg)",    filter: "brightness(1)   drop-shadow(0 0 10px rgba(255, 200, 100, .5))", offset: 0 },
        { transform: "rotate(8deg)",    filter: "brightness(1.5) drop-shadow(0 0 40px rgba(255, 210, 120, 1))",  offset: 0.15 },
        { transform: "rotate(-6deg)",   filter: "brightness(1.4) drop-shadow(0 0 34px rgba(255, 210, 120, .9))", offset: 0.3 },
        { transform: "rotate(4deg)",    filter: "brightness(1.3) drop-shadow(0 0 26px rgba(255, 205, 110, .8))", offset: 0.45 },
        { transform: "rotate(-2.5deg)", filter: "brightness(1.2) drop-shadow(0 0 20px rgba(255, 200, 100, .7))", offset: 0.6 },
        { transform: "rotate(1deg)",    filter: "brightness(1.1) drop-shadow(0 0 14px rgba(255, 200, 100, .6))", offset: 0.8 },
        { transform: "rotate(0deg)",    filter: "brightness(1)   drop-shadow(0 0 10px rgba(255, 200, 100, .5))", offset: 1 },
      ],
      { duration: 3500, easing: "ease-out" }
    );
  };

  // Manchas: efecto de derrame (se contrae y se expande como líquido)
  const animarMancha = (nombre, ref) => {
    lanzarAnimacion(
      nombre,
      ref,
      [
        { transform: "scale(1, 1)",       filter: "brightness(1)",   offset: 0 },
        { transform: "scale(0.85, 0.8)",  filter: "brightness(0.8)", offset: 0.15 },
        { transform: "scale(1.25, 1.1)",  filter: "brightness(1.2)", offset: 0.45 },
        { transform: "scale(1.15, 1.05)", filter: "brightness(1.1)", offset: 0.7 },
        { transform: "scale(1, 1)",       filter: "brightness(1)",   offset: 1 },
      ],
      { duration: 1600, easing: "ease-out" }
    );
  };

  // Objetos con clic: cada uno tiene su animación + su propio cuadro de clic
  const manchas = [
    { clase: "mancha1-5f", ref: mancha1Ref, src: "./Mancha1 .png", nombre: "mancha1" },
    { clase: "mancha2-5f", ref: mancha2Ref, src: "./Mancha2 .png", nombre: "mancha2" },
  ];

  const videos = [
    { clase: "puerta5f",     ref: puertaRef,     src: "./Puerta5f.webm",  onClick: () => tocarAnimacion("puerta", puertaRef) },
    { clase: "silla5f",      ref: sillaRef,      src: "./silla.webm",     onClick: () => tocarAnimacion("silla", sillaRef) },
    { clase: "libros5f",     ref: librosRef,     src: "./Libros.webm",    onClick: () => reproducirVideo(librosRef) },
    { clase: "pergaminos5f", ref: pergaminosRef, src: "./periodico.webm", onClick: () => reproducirVideo(pergaminosRef) },
  ];

  return (
    <div className={`escena5f${DEBUG ? " debug" : ""}`}>
      {/* Fondo */}
      <img className="fondo5f" src="./Escenario5F.png" alt="" />

      {/* ===== Manchas del piso (derrame al tocar) ===== */}
      {manchas.map(({ clase, ref, src, nombre }) => (
        <div key={clase} className={`anim5f mancha5f ${clase}`}>
          {/* Solo visual: no recibe clics */}
          <div className="vista5f">
            <img ref={ref} src={src} alt="" />
          </div>
          {/* Cuadro de clic propio, dentro de su objeto */}
          <div className="hitbox5f" onClick={() => animarMancha(nombre, ref)}>
            <span className="pista5f" />
          </div>
        </div>
      ))}

      {/* ===== Puerta, silla, libros y pergaminos (videos al tocar) ===== */}
      {videos.map(({ clase, ref, src, onClick }) => (
        <div key={clase} className={`anim5f ${clase}`}>
          <div className="vista5f">
            <video ref={ref} muted playsInline>
              <source src={src} type="video/webm" />
            </video>
          </div>
          <div className="hitbox5f" onClick={onClick}>
            <span className="pista5f" />
          </div>
        </div>
      ))}

      {/* ===== Lámpara (imagen): resplandor constante y balanceo en cada click ===== */}
      <div className="anim5f lampara5f">
        <div className="vista5f">
          <img ref={lamparaRef} src="./Lampara5F.png" alt="" />
        </div>
        <div className="hitbox5f" onClick={animarLampara}>
          <span className="pista5f" />
        </div>
      </div>

      {/* Orabona (video sin sonido, una sola vez; la voz la pone el visor) */}
      <video
        ref={orabonaRef}
        className="orabona5f"
        muted
        playsInline
      >
        <source src="./orabona.webm" type="video/webm" />
      </video>

      {/* Step (video) */}
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