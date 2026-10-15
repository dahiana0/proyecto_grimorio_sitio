import { useRef, useEffect } from "react";
import "../Styles/LotieCap5F.css";

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
  const animarLampara = () => {
    lanzarAnimacion(
      "lampara",
      lamparaRef,
      [
        { transform: "translateX(-50%) rotate(0deg)",    filter: "brightness(1)   drop-shadow(0 0 10px rgba(255, 200, 100, .5))", offset: 0 },
        { transform: "translateX(-50%) rotate(8deg)",    filter: "brightness(1.5) drop-shadow(0 0 40px rgba(255, 210, 120, 1))",  offset: 0.15 },
        { transform: "translateX(-50%) rotate(-6deg)",   filter: "brightness(1.4) drop-shadow(0 0 34px rgba(255, 210, 120, .9))", offset: 0.3 },
        { transform: "translateX(-50%) rotate(4deg)",    filter: "brightness(1.3) drop-shadow(0 0 26px rgba(255, 205, 110, .8))", offset: 0.45 },
        { transform: "translateX(-50%) rotate(-2.5deg)", filter: "brightness(1.2) drop-shadow(0 0 20px rgba(255, 200, 100, .7))", offset: 0.6 },
        { transform: "translateX(-50%) rotate(1deg)",    filter: "brightness(1.1) drop-shadow(0 0 14px rgba(255, 200, 100, .6))", offset: 0.8 },
        { transform: "translateX(-50%) rotate(0deg)",    filter: "brightness(1)   drop-shadow(0 0 10px rgba(255, 200, 100, .5))", offset: 1 },
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
        { transform: "translateX(-50%) scale(1, 1)",       filter: "brightness(1)",   offset: 0 },
        { transform: "translateX(-50%) scale(0.85, 0.8)",  filter: "brightness(0.8)", offset: 0.15 },
        { transform: "translateX(-50%) scale(1.25, 1.1)",  filter: "brightness(1.2)", offset: 0.45 },
        { transform: "translateX(-50%) scale(1.15, 1.05)", filter: "brightness(1.1)", offset: 0.7 },
        { transform: "translateX(-50%) scale(1, 1)",       filter: "brightness(1)",   offset: 1 },
      ],
      { duration: 1600, easing: "ease-out" }
    );
  };

  return (
    <div className="escena5f">
      {/* Fondo */}
      <img className="fondo5f" src="./Escenario5F.png" alt="" />

      {/* Manchas del piso (imágenes con animación de derrame en cada click) */}
      <img
        ref={mancha1Ref}
        className="mancha1-5f"
        src="./Mancha1 .png"
        alt=""
        onClick={() => animarMancha("mancha1", mancha1Ref)}
      />
      <img
        ref={mancha2Ref}
        className="mancha2-5f"
        src="./Mancha2 .png"
        alt=""
        onClick={() => animarMancha("mancha2", mancha2Ref)}
      />

      {/* Puerta (video al tocar) */}
      <video
        ref={puertaRef}
        className="puerta5f"
        muted
        playsInline
        onClick={() => tocarAnimacion("puerta", puertaRef)}
      >
        <source src="./Puerta5f.webm" type="video/webm" />
      </video>

      {/* Silla (video al tocar) */}
      <video
        ref={sillaRef}
        className="silla5f"
        muted
        playsInline
        onClick={() => tocarAnimacion("silla", sillaRef)}
      >
        <source src="./silla.webm" type="video/webm" />
      </video>

      {/* Libros (video al tocar) */}
      <video
        ref={librosRef}
        className="libros5f"
        muted
        playsInline
        onClick={() => reproducirVideo(librosRef)}
      >
        <source src="./Libros.webm" type="video/webm" />
      </video>

      {/* Pergaminos (video al tocar) */}
      <video
        ref={pergaminosRef}
        className="pergaminos5f"
        muted
        playsInline
        onClick={() => reproducirVideo(pergaminosRef)}
      >
        <source src="./periodico.webm" type="video/webm" />
      </video>

      {/* Lámpara (imagen): resplandor constante y balanceo en cada click */}
      <img
        ref={lamparaRef}
        className="lampara5f"
        src="./Lampara5F.png"
        alt=""
        onClick={animarLampara}
      />

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