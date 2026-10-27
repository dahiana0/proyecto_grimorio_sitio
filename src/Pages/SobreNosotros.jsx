import React, { useEffect, useRef, useState } from "react";
import {
  motion,
  useInView,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import Header from "../Components/Header";
import Footer from "../Components/footer";
import "../Styles/SobreNosotros.css";




const PILARES = [
  {
    titulo: "Misión",
    icono: "/mision.svg",
    texto:
      "Transformar la lectura en una experiencia interactiva, visual e inmersiva que conecte con los jóvenes a través de historias de terror, fantasía y misterio, fomentando el interés por la literatura de una manera innovadora y entretenida.",
  },
  {
    titulo: "Visión",
    icono: "/vision.svg",
    texto:
      "Ser una marca reconocida por innovar la forma de leer en entornos digitales, creando experiencias narrativas que inspiren a nuevas generaciones a explorar la lectura desde la creatividad, la emoción y la participación.",
  },
  {
    titulo: "Propósito",
    icono: "/proposito.svg",
    texto:
      "Fomentar la lectura digital inmersiva. Llevar a los jóvenes más allá del simple acto de leer un texto: que se sientan parte de la historia.",
  },
  {
    titulo: "Inspiración",
    icono: "/inspiracion.svg",
    texto:
      "Basado en «El Horror del Museo» (1933) de H.P. Lovecraft & Hazel Heald. Lo prohibido cobra vida en una experiencia interactiva.",
  },
];


const DOCUMENTOS = [
  {
    titulo: "Guía de estilos",
    desc: "Colores, tipografías y reglas visuales.",
    pdf: "/01_Guia_de_Estilos_Grimorio (1)_compressed.pdf",
    portada: "/guia.png",
  },
  {
    titulo: "Manual de marca",
    desc: "La identidad de Grimorio y cómo usarla.",
    pdf: "/02_Manual_de_Marca_Grimorio_compressed.pdf",
    portada: "/Manual.png",
  },
  {
    titulo: "Pitchbook",
    desc: "La propuesta del proyecto en pocas páginas.",
    pdf: "/Pitchbook_Grimorio_compressed.pdf",
    portada: "/pich.png",
  },
  {
    titulo: "Sistema de iconos",
    desc: "Todos los iconos y su uso.",
    pdf: "/03_Sistema_de_Iconos_Grimorio (1)_compressed.pdf",
    portada: "/iconos.png",
  },
];


const EQUIPO = [
  {
    nombre: "Sofía Amaya Reyes",
    rol: "Diseñadora principal",
    descripcion:
      "Experta en arte gótico y diseño UI/UX. Crea la identidad visual y la experiencia inmersiva.",
    imagen: "/amaya.svg",
  },
  {
    nombre: "Yamile Arias Pérez",
    rol: "Artista conceptual",
    descripcion: "Creadora del estilo visual oscuro de Grimorio.",
    imagen: "/yamile.svg",
  },
  {
    nombre: "Karol Dahiana Usuga",
    rol: "Desarrolladora líder",
    descripcion: "Encargada del desarrollo técnico del proyecto.",
    imagen: "/karol.svg",
  },
];

const SUAVE = [0.2, 0.8, 0.2, 1];


const Pilar = ({ p, i, reducir }) => (
  <motion.article
    className={`sn-pilar sn-pilar--${i % 2 === 0 ? "izq" : "der"}`}
    initial={reducir ? false : { opacity: 0, y: 56, filter: "blur(8px)" }}
    whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
    viewport={{ once: true, amount: 0.35 }}
    transition={{ duration: 0.9, ease: SUAVE }}
  >

    <motion.div
      className="sn-nodo-caja"
      drag
      dragSnapToOrigin
      dragElastic={0.5}
      whileDrag={{ scale: 1.12, cursor: "grabbing" }}
    >
      <div className="sn-nodo" style={{ "--d": `${i * 0.7}s` }}>
        <img className="sn-nodo-img" src={p.icono} alt="" draggable="false" />
      </div>
    </motion.div>

    <motion.div
      className="sn-pilar-texto"
      drag
      dragSnapToOrigin
      dragElastic={0.4}
      whileDrag={{ scale: 1.03, cursor: "grabbing" }}
    >
      <h2 className="sn-pilar-titulo">{p.titulo}</h2>
      <p>{p.texto}</p>
    </motion.div>
  </motion.article>
);

const Hilo = ({ reducir }) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 75%", "end 60%"],
  });
  const avance = useSpring(scrollYProgress, { stiffness: 110, damping: 28 });

  return (
    <section className="sn-hilo" ref={ref} aria-label="Misión, visión, propósito e inspiración">
      <div className="sn-hilo-linea" aria-hidden="true">
        <motion.span style={{ scaleY: reducir ? 1 : avance }} />
      </div>
      {PILARES.map((p, i) => (
        <Pilar key={p.titulo} p={p} i={i} reducir={reducir} />
      ))}
    </section>
  );
};


const Polaroid = ({ d, i, total, reducir }) => {
  const [falla, setFalla] = useState(false);
  const arrastro = useRef(false);
  const inclina = (i - (total - 1) / 2) * 4;
  const f = (i + 0.5) / total;
  const curva = 4 * f * (1 - f);
  const conPortada = d.portada && !falla;

  return (

    <div className="sn-polo-caja" style={{ marginTop: `calc(${curva} * var(--sag))` }}>
      <span className="sn-clip" aria-hidden="true" />

      <motion.div
        className="sn-polo-entra"
        style={{ originY: 0 }}
        initial={reducir ? false : { opacity: 0, y: -110, rotate: inclina * 3 }}
        whileInView={{ opacity: 1, y: 0, rotate: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ type: "spring", stiffness: 55, damping: 7, mass: 1.2, delay: i * 0.16 }}
      >

        <motion.div
          className="sn-polo-arrastre"
          drag
          dragSnapToOrigin
          dragElastic={0.35}
          onDragStart={() => {
            arrastro.current = true;
          }}
          onDragEnd={() => setTimeout(() => (arrastro.current = false), 80)}
          whileDrag={{ scale: 1.05, cursor: "grabbing" }}
        >
          <a
            className="sn-polo"
            href={d.pdf}
            draggable={false}
            onClick={(ev) => {
              if (arrastro.current) ev.preventDefault();
            }}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Abrir ${d.titulo} en PDF`}
            style={{ "--tilt": `${inclina}deg`, "--d": `${i * -0.9}s` }}
          >
            <div className="sn-polo-tarjeta">
              <div className="sn-polo-portada">
                {conPortada ? (
                  <img src={d.portada} alt="" draggable="false" onError={() => setFalla(true)} />
                ) : (
                  <div className="sn-portada-muestra" aria-hidden="true">
                    <span className="sn-pm-num">{String(i + 1).padStart(2, "0")}</span>
                    <span className="sn-pm-sigilo">✧</span>
                  </div>
                )}
                <span className="sn-polo-pdf">PDF</span>
              </div>

              <div className="sn-polo-pie">
                <h3>{d.titulo}</h3>
                <p>{d.desc}</p>
                <span className="sn-polo-abrir">
                  Abrir PDF <span aria-hidden="true">➜</span>
                </span>
              </div>
            </div>
          </a>
        </motion.div>
      </motion.div>
    </div>
  );
};

const Documentacion = ({ reducir }) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 90%", "end 70%"],
  });
  const progreso = useSpring(scrollYProgress, { stiffness: 100, damping: 26 });
  const barrido = useTransform(progreso, [0, 0.25], [0, 1]);

  return (
    <section className="sn-docs" ref={ref} aria-label="Documentación">
      <motion.div
        className="sn-telon"
        aria-hidden="true"
        style={reducir ? undefined : { scaleX: barrido }}
      />

      <header className="sn-docs-cab">
        <motion.h2
          className="sn-titulo sn-titulo--medio"
          initial={reducir ? false : { opacity: 0, letterSpacing: "0.3em", filter: "blur(10px)" }}
          whileInView={{ opacity: 1, letterSpacing: "0em", filter: "blur(0px)" }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 1.2, ease: SUAVE }}
        >
          Documentación
        </motion.h2>
        <p className="sn-texto">
          Los papeles detrás de Grimorio, colgados de una cuerda. Toca uno para abrir el PDF.
        </p>
      </header>

      <div className="sn-cuerda-zona">
        <svg className="sn-cuerda" viewBox="0 0 1000 120" preserveAspectRatio="none" aria-hidden="true">
          <path d="M0,0 Q500,120 1000,0" />
        </svg>
        {DOCUMENTOS.map((d, i) => (
          <Polaroid key={d.titulo} d={d} i={i} total={DOCUMENTOS.length} reducir={reducir} />
        ))}
      </div>
    </section>
  );
};


const limitar = (v, a, b) => Math.min(b, Math.max(a, v));

const Credencial = ({ p, i, empujon, reducir }) => {
  const caja = useRef(null);
  const pendulo = useRef(null);
  const lag = useRef(null);
  const motor = useRef(null);
  const toque = useRef({ px: 0, py: 0, x: 0, y: 0, t: 0, mov: false, desfase: 0 });
  const [volteada, setVolteada] = useState(false);
  const [agarrada, setAgarrada] = useState(false);
  const visible = useInView(caja, { once: true, amount: 0.3 });


  useEffect(() => {
    const e = { th: 0, om: 0, drag: false, target: 0, raf: 0, last: 0 };

    const pinta = () => {
      if (pendulo.current) pendulo.current.style.transform = `rotate(${e.th}rad)`;

      if (lag.current) lag.current.style.transform = `rotate(${limitar(-e.om * 0.04, -0.45, 0.45)}rad)`;
    };

    const paso = (ahora) => {
      const dt = Math.max(0.001, Math.min((ahora - e.last) / 1000, 0.033));
      e.last = ahora;

      if (e.drag) {
        const antes = e.th;
        e.th += (e.target - e.th) * Math.min(1, dt * 22);
        e.om = e.om * 0.6 + ((e.th - antes) / dt) * 0.4;
      } else {
        const a = -26 * Math.sin(e.th) - 1.0 * e.om; // gravedad + rozamiento
        e.om += a * dt;
        e.th += e.om * dt;
      }
      pinta();

      if (!e.drag && Math.abs(e.th) < 0.002 && Math.abs(e.om) < 0.01) {
        e.th = 0;
        e.om = 0;
        pinta();
        e.raf = 0;
        return;
      }
      e.raf = requestAnimationFrame(paso);
    };

    const arranca = () => {
      if (!e.raf) {
        e.last = performance.now();
        e.raf = requestAnimationFrame(paso);
      }
    };

    motor.current = { e, arranca };
    return () => cancelAnimationFrame(e.raf);
  }, []);


  useEffect(() => {
    if (!visible || reducir || !motor.current) return;
    const { e, arranca } = motor.current;
    e.th = (i % 2 ? -1 : 1) * 0.6;
    e.om = 0;
    arranca();
  }, [visible, reducir, i]);


  useEffect(() => {
    if (!empujon || !motor.current) return;
    const { e, arranca } = motor.current;
    setVolteada(false);
    e.om += (Math.random() < 0.5 ? -1 : 1) * (6 + Math.random() * 3);
    arranca();
  }, [empujon]);

  const apunta = (ev) => {
    const s = toque.current;
    const dx = ev.clientX - s.px;
    const dy = Math.max(ev.clientY - s.py, 40);
    motor.current.e.target = limitar(Math.atan2(-dx, dy) + s.desfase, -1.3, 1.3);
  };

  const alBajar = (ev) => {
    if (!motor.current) return;
    const { e, arranca } = motor.current;
    ev.currentTarget.setPointerCapture?.(ev.pointerId);

    const r = caja.current.getBoundingClientRect();
    const s = toque.current;
    s.px = r.left + r.width / 2;
    s.py = r.top;
    s.x = ev.clientX;
    s.y = ev.clientY;
    s.t = performance.now();
    s.mov = false;
    s.desfase = 0;


    const dx = ev.clientX - s.px;
    const dy = Math.max(ev.clientY - s.py, 40);
    s.desfase = e.th - Math.atan2(-dx, dy);

    e.drag = true;
    e.target = e.th;
    setAgarrada(true);
    arranca();
  };

  const alMover = (ev) => {
    if (!motor.current?.e.drag) return;
    const s = toque.current;
    if (Math.hypot(ev.clientX - s.x, ev.clientY - s.y) > 6) s.mov = true;
    apunta(ev);
  };

  const alSoltar = (ev, cancelado = false) => {
    if (!motor.current?.e.drag) return;
    const { e, arranca } = motor.current;
    const s = toque.current;
    e.drag = false;
    e.om = limitar(e.om, -10, 10);
    setAgarrada(false);
    ev.currentTarget.releasePointerCapture?.(ev.pointerId);
    if (!cancelado && !s.mov && performance.now() - s.t < 500) setVolteada((v) => !v);
    arranca();
  };

  return (
    <div
      ref={caja}
      className={`sn-cred${visible ? " sn-cred--visible" : ""}${agarrada ? " sn-cred--agarrada" : ""}`}
    >
      <div className="sn-cred-pendulo" ref={pendulo}>
        <div className="sn-correa" aria-hidden="true">
          <span>✧</span>
          <span>✧</span>
          <span>✧</span>
        </div>
        <div className="sn-gancho" aria-hidden="true">
          <i />
          <b />
        </div>

        <div className="sn-cred-lag" ref={lag}>
          <div
            className={`sn-cred-giro${volteada ? " sn-cred-giro--volteada" : ""}`}
            role="button"
            tabIndex={0}
            aria-label={`Credencial de ${p.nombre}. Toca para girarla`}
            onPointerDown={alBajar}
            onPointerMove={alMover}
            onPointerUp={(ev) => alSoltar(ev)}
            onPointerCancel={(ev) => alSoltar(ev, true)}
            onKeyDown={(ev) => {
              if (ev.key === "Enter" || ev.key === " ") {
                ev.preventDefault();
                setVolteada((v) => !v);
              }
            }}
          >
            <div className="sn-cred-cara sn-cred-frente">
              <span className="sn-ranura" aria-hidden="true" />
              <div className="sn-cred-foto">
                <img src={p.imagen} alt={p.nombre} draggable="false" />
              </div>
              <div className="sn-cred-pie">
                <h3>{p.nombre}</h3>
                <p>{p.rol}</p>
              </div>
            </div>

            <div className="sn-cred-cara sn-cred-dorso">
              <span className="sn-ranura" aria-hidden="true" />
              <h3>{p.nombre}</h3>
              <p className="sn-cred-rol">{p.rol}</p>
              <p className="sn-cred-desc">{p.descripcion}</p>
              <span className="sn-cred-volver">Toca para volver</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Equipo = ({ reducir }) => {
  const [empujon, setEmpujon] = useState(0);

  return (
    <section className="sn-equipo" aria-label="Equipo">
      <header className="sn-docs-cab">
        <motion.h2
          className="sn-titulo sn-titulo--medio"
          initial={reducir ? false : { opacity: 0, y: 18, filter: "blur(10px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 1, ease: SUAVE }}
        >
          Guardianas de Grimorio
        </motion.h2>
        <p className="sn-texto">
          Agarra una credencial y suéltala para verla balancearse · toca para girarla
        </p>
      </header>

      <div className="sn-escenario">
        {EQUIPO.map((p, i) => (
          <Credencial key={p.nombre} p={p} i={i} empujon={empujon} reducir={reducir} />
        ))}
      </div>

      <button type="button" className="sn-reacomodar" onClick={() => setEmpujon((n) => n + 1)}>
        Dale un empujón
      </button>
    </section>
  );
};


export const SobreNosotros = () => {
  const reducir = useReducedMotion();

  return (
    <>
      <Header />
      <main className="sn-page">
        <header className="sn-hero">
          <motion.h1
            className="sn-titulo"
            initial={reducir ? false : { opacity: 0, y: 18, filter: "blur(10px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 1, delay: 0.15, ease: SUAVE }}
          >
            Donde lo oculto se revela
          </motion.h1>
          <motion.p
            className="sn-texto"
            initial={reducir ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            Grimorio surge como una respuesta a las problemáticas que enfrentan los jóvenes con
            la lectura tradicional. No es una simple adaptación visual, sino una reinterpretación
            interactiva, estética y emocional.
          </motion.p>
        </header>

        <Hilo reducir={reducir} />
        <Documentacion reducir={reducir} />
        <Equipo reducir={reducir} />
      </main>
      <Footer />
    </>
  );
};

export default SobreNosotros;