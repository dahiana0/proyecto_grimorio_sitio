import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../Styles/SofiaGuia.css";

const ICONO_ALERTA = "/alertaaaaa.svg";

const dialogos = [
  {
    texto: "Bienvenido a Grimorio.",
    audio: "./guia/1.wav",
  },
  {
    texto:
      "A continuación entrarás en una aventura donde cada paso revela secretos prohibidos.",
    audio: "./guia/2.wav",
  },
  {
    texto: "Este no es un museo común...",
    audio: "./guia/3.wav",
  },
  {
    texto: "Aquí las historias te observan. Atrévete a continuar.",
    audio: "./guia/4.wav",
  },
];


const UMBRAL_DESCARTE = 130;


function IconoMarco({ children, pulsa = false }) {
  return (
    <div className={`icono-marco ${pulsa ? "sg-palpita" : ""}`}>
      {children}
    </div>
  );
}

export function SofiaGuia() {
  const navigate = useNavigate();

  const [actual, setActual] = useState(0);
  const [letras, setLetras] = useState(0);
  const [mostrarBoton, setMostrarBoton] = useState(false);
  const [iniciado, setIniciado] = useState(false);
  const [iconoOk, setIconoOk] = useState(true);

  /* Arrastre de la tarjeta del frente */
  const [arrastre, setArrastre] = useState({ x: 0, y: 0, activo: false });
  const inicioArrastre = useRef({ x: 0, y: 0 });

  const audioRef = useRef(null);
  const sonidoBoton = useRef(null);


  const contenedorRef = useRef(null);
  const pilaRef = useRef(null);


  useEffect(() => {
    sonidoBoton.current = new Audio("./audios/sonidoboton.ogg");
    sonidoBoton.current.volume = 0.35;
  }, []);

  const reproducirSonido = () => {
    if (!sonidoBoton.current) return;
    sonidoBoton.current.currentTime = 0;
    sonidoBoton.current.play().catch(() => { });
  };

  const detenerVoz = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  };

  const irA = (ruta) => {
    reproducirSonido();
    detenerVoz();
    setTimeout(() => navigate(ruta), 150);
  };


  const alMoverEscena = (e) => {
    const cont = contenedorRef.current;
    if (!cont) return;
    const r = cont.getBoundingClientRect();
    const x = e.clientX - r.left;
    const y = e.clientY - r.top;
    const mx = (x / r.width) * 2 - 1;
    const my = (y / r.height) * 2 - 1;

    const pila = pilaRef.current;
    if (pila) {
      const pr = pila.getBoundingClientRect();
      const gx = Math.min(Math.max(((e.clientX - pr.left) / pr.width) * 100, 0), 100);
      const gy = Math.min(Math.max(((e.clientY - pr.top) / pr.height) * 100, 0), 100);
      pila.style.setProperty("--ry", `${(mx * 7).toFixed(2)}deg`);
      pila.style.setProperty("--rx", `${(-my * 5).toFixed(2)}deg`);
      pila.style.setProperty("--gx", `${gx.toFixed(1)}%`);
      pila.style.setProperty("--gy", `${gy.toFixed(1)}%`);
    }
  };

  const alSalirEscena = () => {
    const pila = pilaRef.current;
    if (pila) {
      pila.style.setProperty("--rx", "0deg");
      pila.style.setProperty("--ry", "0deg");
    }
  };


  useEffect(() => {
    setArrastre({ x: 0, y: 0, activo: false });
  }, [actual]);


  useEffect(() => {
    if (!iniciado) return;

    const audio = audioRef.current;
    if (!audio) return;

    audio.pause();
    audio.currentTime = 0;
    audio.src = dialogos[actual].audio;
    audio.play().catch(console.error);

    return () => {
      audio.pause();
      audio.currentTime = 0;
    };
  }, [actual, iniciado]);


  useEffect(() => {
    if (!iniciado) return;

    const audio = audioRef.current;
    const texto = dialogos[actual].texto;
    const t0 = performance.now();
    let raf;

    setLetras(0);

    const tick = () => {
      const dur = audio?.duration;
      let progreso;

      if (Number.isFinite(dur) && dur > 0) {

        progreso = audio.currentTime / (dur * 0.9);
      } else {

        progreso = (performance.now() - t0) / (texto.length * 55);
      }

      setLetras(Math.min(texto.length, Math.ceil(progreso * texto.length)));
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [actual, iniciado]);

  const iniciarHistoria = () => {
    if (iniciado) return;
    setIniciado(true);
  };

  const siguiente = () => {
    if (actual < dialogos.length - 1) {
      setActual((prev) => prev + 1);
    } else {
      setLetras(dialogos[actual].texto.length);
      setMostrarBoton(true);
    }
  };


  const alPresionar = (e) => {
    if (!iniciado) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    inicioArrastre.current = { x: e.clientX, y: e.clientY };
    setArrastre({ x: 0, y: 0, activo: true });
  };

  const alMover = (e) => {
    if (!arrastre.activo) return;
    setArrastre({
      x: e.clientX - inicioArrastre.current.x,
      y: e.clientY - inicioArrastre.current.y,
      activo: true,
    });
  };

  const alSoltar = () => {
    if (!arrastre.activo) return;

    const distancia = Math.hypot(arrastre.x, arrastre.y);
    setArrastre({ x: 0, y: 0, activo: false });


    if (distancia > UMBRAL_DESCARTE && actual < dialogos.length - 1) {
      reproducirSonido();
      setActual((prev) => prev + 1);
    }
  };

  return (
    <div
      ref={contenedorRef}
      className="container-sofia"
      onPointerMove={alMoverEscena}
      onPointerLeave={alSalirEscena}
    >

      <button className="boton-neon back-btn" onClick={() => irA("/")}>
        Volver al inicio
      </button>

      <button
        className="boton-neon skip-btn"
        onClick={() => irA("/explorar-museo")}
      >
        Omitir intro
      </button>


      <div className="sg-escenario">
        <div className="sg-pila" ref={pilaRef}>
          {dialogos.map((d, i) => {
            const offset = i - actual;
            const esFrente = offset === 0;
            const pasada = offset < 0;
            const lejos = offset > 3;

            const clases = [
              "tarjeta-alerta",
              esFrente ? "sg-frente" : "",
              pasada ? "sg-pasada" : "",
              lejos ? "sg-lejos" : "",
              esFrente && arrastre.activo ? "sg-arrastrando" : "",
              esFrente && !iniciado ? "sg-esperando" : "",
            ]
              .filter(Boolean)
              .join(" ");

            const estilo = {
              "--o": Math.max(offset, 0),
              zIndex: dialogos.length - Math.abs(offset),
            };

            if (esFrente && arrastre.activo) {
              estilo.transform = `translate(${arrastre.x}px, ${arrastre.y}px) rotate(${arrastre.x / 28
                }deg)`;
            }

            return (
              <article
                key={i}
                className={clases}
                style={estilo}
                onClick={esFrente && !iniciado ? iniciarHistoria : undefined}
                onPointerDown={esFrente ? alPresionar : undefined}
                onPointerMove={esFrente ? alMover : undefined}
                onPointerUp={esFrente ? alSoltar : undefined}
                onPointerCancel={esFrente ? alSoltar : undefined}
                onLostPointerCapture={esFrente ? alSoltar : undefined}
              >
                <header className="tarjeta-cabecera">
                  <IconoMarco pulsa={esFrente}>
                    {iconoOk ? (
                      <img
                        src={ICONO_ALERTA}
                        alt=""
                        draggable="false"
                        onError={() => setIconoOk(false)}
                      />
                    ) : (
                      <span className="icono-respaldo">!</span>
                    )}
                  </IconoMarco>
                </header>

                <div className="tarjeta-cuerpo">
                  {esFrente && !iniciado ? (
                    <p className="texto-guia">Toca la alerta para iniciar…</p>
                  ) : (
                    <p className="texto-guia">
                      {pasada
                        ? d.texto
                        : esFrente
                          ? d.texto
                            .slice(0, letras)
                            .split("")
                            .map((c, k) => (
                              <span key={k} className="sg-letra">
                                {c}
                              </span>
                            ))
                          : ""}
                      {esFrente && iniciado && letras < d.texto.length && (
                        <span className="sg-cursor" />
                      )}
                    </p>
                  )}
                </div>

                {esFrente && iniciado && (
                  <footer className="tarjeta-pie">
                    {dialogos.map((_, k) => (
                      <span
                        key={k}
                        className={`sg-punto ${k === actual ? "sg-activo" : ""}`}
                      />
                    ))}
                  </footer>
                )}
              </article>
            );
          })}
        </div>

        <audio ref={audioRef} preload="auto" onEnded={siguiente} />

        <button
          className={`boton-neon start-btn ${mostrarBoton ? "mostrar" : ""}`}
          onClick={() => irA("/explorar-museo")}
        >
          Explorar Museo
        </button>
      </div>
    </div>
  );
}

export default SofiaGuia;