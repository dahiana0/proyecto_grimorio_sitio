import React, {
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Link, useNavigate } from "react-router-dom";
import "../Styles/MapaCapitulo.css";


const cacheSvg = new Map();

const cargarSvg = (src) => {
  if (!cacheSvg.has(src)) {
    const promesa = fetch(src)
      .then((r) => {
        if (!r.ok) throw new Error("SVG no encontrado: " + src);
        return r.text();
      })
      .catch((error) => {
        cacheSvg.delete(src);
        throw error;
      });
    cacheSvg.set(src, promesa);
  }
  return cacheSvg.get(src);
};

const prepararSvg = (texto, uid, duracion, retraso) => {
  let raw = texto.replace(/cls-/g, `${uid}-cls-`);


  raw = raw.replace(
    /font-family:\s*RingbearerMedium,\s*Ringbearer;/g,
    "font-family: RingbearerMedium, Ringbearer, pieces, serif;"
  );

  const ids = [...raw.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]);
  ids.forEach((id) => {
    raw = raw
      .split(`id="${id}"`).join(`id="${uid}-${id}"`)
      .split(`url(#${id})`).join(`url(#${uid}-${id})`)
      .split(`href="#${id}"`).join(`href="#${uid}-${id}"`);
  });

  const doc = new DOMParser().parseFromString(raw, "image/svg+xml");
  const svg = doc.documentElement;
  if (!svg || svg.nodeName.toLowerCase() !== "svg") return null;

  svg.removeAttribute("width");
  svg.removeAttribute("height");


  svg.querySelectorAll("filter").forEach((f) => {
    if (!f.hasAttribute("width")) {
      f.setAttribute("filterUnits", "userSpaceOnUse");
      f.setAttribute("x", "-80");
      f.setAttribute("y", "-120");
      f.setAttribute("width", "240");
      f.setAttribute("height", "240");
    }
  });

  const formas = [
    ...svg.querySelectorAll("path, line, polyline, polygon, circle, ellipse, rect"),
  ].filter((el) => !el.closest("defs, clipPath, mask, filter"));


  const paso = Math.min(0.12, (duracion * 0.6) / Math.max(formas.length, 1));
  const durTrazo = duracion * 0.4;

  formas.forEach((el, i) => {
    el.classList.add("trazo");
    el.style.animationDelay = `${retraso + i * paso}s`;
    el.style.animationDuration = `${durTrazo}s`;
  });

  svg.querySelectorAll("text").forEach((el) => {
    el.classList.add("trazo-texto");
    el.style.animationDelay = `${retraso + duracion * 0.7}s`;
    el.style.animationDuration = `${Math.max(duracion * 0.3, 0.3)}s`;
  });

  return svg.outerHTML;
};

const SvgDibujado = ({
  src,
  fallback,
  alt = "",
  className = "",
  activo = true,
  duracion = 3,
  retraso = 0,
}) => {
  const uid = "s" + useId().replace(/[^a-zA-Z0-9]/g, "");
  const [html, setHtml] = useState(null);
  const [fallo, setFallo] = useState(false);

  useEffect(() => {
    let vivo = true;

    cargarSvg(src)
      .then((texto) => {
        if (!vivo) return;
        const resultado = prepararSvg(texto, uid, duracion, retraso);
        if (resultado) setHtml(resultado);
        else setFallo(true);
      })
      .catch(() => vivo && setFallo(true));

    return () => {
      vivo = false;
    };
  }, [src, uid, duracion, retraso]);


  const ref = useRef(null);

  useLayoutEffect(() => {
    const cont = ref.current;
    if (!cont || !html) return;

    cont.querySelectorAll(".trazo").forEach((el) => {
      let largo = 1;
      try {
        largo = el.getTotalLength();
      } catch (e) {

      }
      el.style.setProperty("--len", String(Math.ceil(largo) + 1));
    });
  }, [html]);

  if (fallo) {
    return fallback ? (
      <img
        src={fallback}
        alt={alt}
        className={`svg-fallback ${className} ${activo ? "dibujando" : ""}`}
      />
    ) : null;
  }

  return (
    <div
      role={alt ? "img" : undefined}
      aria-label={alt || undefined}
      aria-hidden={alt ? undefined : true}
      ref={ref}
      className={`svg-dibujo ${className} ${activo ? "dibujando" : ""}`}
      dangerouslySetInnerHTML={{ __html: html || "" }}
    />
  );
};


const MarcoTrazo = ({ activo, radio = 12, duracion = 1.2, retraso = 0 }) => (
  <svg
    className={`marco-trazo ${activo ? "dibujando" : ""}`}
    aria-hidden="true"
  >
    <rect
      x="0"
      y="0"
      width="100%"
      height="100%"
      rx={radio}
      ry={radio}
      pathLength="1"
      style={{
        animationDuration: `${duracion}s`,
        animationDelay: `${retraso}s`,
      }}
    />
  </svg>
);


const MAPA_SVG = "/mapa3.svg";
const VIEWBOX = { w: 1530, h: 1015 };
const DURACION_MAPA = 3;

const T_BOTONES = DURACION_MAPA * 1000;


let animacionYaVista = false;

const mapaYaVisto = () => animacionYaVista;


const OBJETOS = {

  1: [
    "tablero", "calavera", "step", "libro", "libroC",
    "edificio", "stepCamina", "rejas",
    "lampara1", "lampara2", "lampara3",
    "telarana1", "telarana2",
    "monstruo1", "monstruo2", "monstruo3", "monstruo4",
  ],

  2: [
    "estatua1", "estatua3", "estatua4", "estatua5", "estatua6",
    "rata",
    "lampara1C", "lampara2C", "lampara3C",
  ],

  3: [
    "antorcha1", "antorcha2", "antorcha3", "antorcha4",
    "puerta",
    "telarana1", "telarana2", "telarana3", "telarana4",
    "moustro1", "moustro2", "moustro3", "moustro4",
  ],

  4: [
    "antorcha1", "antorcha2", "antorcha3", "antorcha4",
    "puerta",
    "telarana1", "telarana2", "telarana3", "telarana4",
    "moustro1", "moustro2", "moustro3", "moustro4",
  ],

  5: [

    "edificio", "rejas", "stepCamina",

    "cera1", "cera2", "cera3", "cera4", "cera5", "cera6",
    "telarana1", "telarana2", "telarana3", "candelabro",

    "manchas",
    "cuadro1", "cuadro2", "cuadro3", "cuadro4", "cuadro5", "cuadro6", "cuadro7", "cuadro8",
    "hueso1", "hueso2", "hueso3", "hueso4", "hueso5", "hueso6",
    "antorcha1", "antorcha2", "antorcha3", "antorcha4",

    "lampara5d", "estatua1", "estatua2", "estatua3", "estatua4",
    "rata", "monstruo5d", "step5d",

    "pintura1", "pintura2", "paso", "huesos5e", "monstruo5e",
    "roges", "step5e", "lampara5e",

    "mancha1", "mancha2", "puerta5f", "silla5f", "libros5f", "pergaminos5f", "lampara5f",
  ],
};


const RUTA_SVG = "/pppp1111.svg";



const PUNTOS_POS = { x: 318, y: 241, escala: 0.95 };

const DIST_CORTE = 45;


const PRIMER_NODO = 1;
const RUTA = [
  { hasta: 2, grupos: [0, 1] },
  { hasta: 3, grupos: [2] },
  { hasta: 4, grupos: [5] },
  { hasta: 5, grupos: [4], invertir: true },
  { hasta: 1, grupos: [3], invertir: true },
];

const SEG_PUNTO = 0.03;
const SEG_NODO = 0.35;


const HORARIO_BASE = {
  dots: null,
  nodos: { 1: 0, 2: 0.3, 3: 0.6, 4: 0.9, 5: 1.2 },
  duracion: 1.7,
};

const cargarPuntos = async (src) => {
  const r = await fetch(src);
  if (!r.ok) throw new Error("SVG de puntos no encontrado: " + src);

  const doc = new DOMParser().parseFromString(await r.text(), "image/svg+xml");
  const svg = doc.documentElement;
  const [, , w, h] = svg.getAttribute("viewBox").split(/[\s,]+/).map(Number);

  const circulos = [...svg.querySelectorAll("circle")].map((c) => ({
    cx: parseFloat(c.getAttribute("cx")),
    cy: parseFloat(c.getAttribute("cy")),
    r: parseFloat(c.getAttribute("r")),
  }));

  const grupos = [];
  circulos.forEach((c, i) => {
    const anterior = circulos[i - 1];
    if (
      !anterior ||
      Math.hypot(c.cx - anterior.cx, c.cy - anterior.cy) > DIST_CORTE
    ) {
      grupos.push([c]);
    } else {
      grupos[grupos.length - 1].push(c);
    }
  });

  return { grupos, w, h };
};


const construirHorario = (grupos) => {
  const dots = grupos.map((g) => new Array(g.length).fill(0));
  const nodos = {};
  let t = 0;

  nodos[PRIMER_NODO] = t;
  t += SEG_NODO;

  RUTA.forEach((tramo) => {
    tramo.grupos.forEach((g) => {
      const total = grupos[g].length;

      for (let i = 0; i < total; i++) {
        const orden = tramo.invertir ? total - 1 - i : i;
        dots[g][i] = t + orden * SEG_PUNTO;
      }

      t += total * SEG_PUNTO;
    });

    if (nodos[tramo.hasta] === undefined) {
      nodos[tramo.hasta] = t;
      t += SEG_NODO;
    }
  });

  return { dots, nodos, duracion: t };
};

export const MapaCapitulos = () => {
  const navigate = useNavigate();


  const capitulos = [
    {
      id: 1,
      titulo: "Umbral",
      descripcion:
        "Stephen Jones llega al misterioso Museo George Rogers decidido a descubrir la verdad detrás de los extraños sucesos que rodean el lugar. Sin imaginarlo, cruza el umbral hacia un mundo donde la razón deja de tener sentido.",
      imagen: "/cap1_1.svg",
      icono: "/cap1_1.svg",
      ruta: "/cap-uno",
      pos: { x: 314, y: 242 },
      tamano: 1,
      tamanoPanel: 1,
      objetos: OBJETOS[1],
    },
    {
      id: 2,
      titulo: "Reliquias",
      descripcion:
        "En las salas prohibidas del museo, Stephen encuentra antiguas reliquias y figuras inquietantes que esconden un oscuro pasado. Cada descubrimiento lo acerca más a un secreto que nunca debió ser revelado.",
      imagen: "/cap2_1.svg",
      icono: "/cap2_1.svg",
      ruta: "/cap-dos",
      pos: { x: 754, y: 225 },
      tamano: 1,
      tamanoPanel: 1,
      objetos: OBJETOS[2],
    },
    {
      id: 3,
      titulo: "Presagio",
      descripcion:
        "Lo inexplicable comienza a manifestarse. Sombras, presencias y fenómenos sobrenaturales anuncian que una fuerza ancestral ha despertado, convirtiendo la investigación en una auténtica pesadilla.",
      imagen: "/cap3_1.svg",
      icono: "/cap3_1.svg",
      ruta: "/cap-tres",
      pos: { x: 1195, y: 254 },
      tamano: 1,
      tamanoPanel: 1,
      objetos: OBJETOS[3],
    },
    {
      id: 4,
      titulo: "Ritual",
      descripcion:
        "Rogers revela su verdadero propósito y somete a Stephen a un antiguo ritual. Mientras el museo cobra vida con extraños cánticos y entidades ocultas, escapar se convierte en su única esperanza.",
      imagen: "/cap4_1.svg",
      icono: "/cap4_1.svg",
      ruta: "/cap-cuatro",
      pos: { x: 814, y: 718 },
      tamano: 1,
      tamanoPanel: 1,
      objetos: OBJETOS[4],
    },
    {
      id: 5,
      titulo: "Revelacíon",
      descripcion:
        "Rogers revela su verdadero propósito y somete a Stephen a un antiguo ritual. Mientras el museo cobra vida con extraños cánticos y entidades ocultas, escapar se convierte en su única esperanza.",
      imagen: "/cap5_2.svg",
      icono: "/cap5_2.svg",
      ruta: "/cap-cinco",
      pos: { x: 326, y: 750 },
      tamano: 1.8, // 
      tamanoPanel: 1.4,
      objetos: OBJETOS[5],
    },
  ];

  const [capituloActivo, setCapituloActivo] = useState(capitulos[0]);


  const [capituloPanel, setCapituloPanel] = useState(capitulos[0]);
  const [saliendo, setSaliendo] = useState(false);
  const [cambios, setCambios] = useState(0);
  const [barrido, setBarrido] = useState(0);
  const [direccion, setDireccion] = useState(1);
  const timerPanel = useRef(null);

  useEffect(() => () => clearTimeout(timerPanel.current), []);


  const [saltar] = useState(mapaYaVisto);
  const [fase, setFase] = useState(saltar ? 3 : 0);


  const [ruta, setRuta] = useState(null);

  useEffect(() => {
    let vivo = true;

    cargarPuntos(RUTA_SVG)
      .then((r) => vivo && setRuta(r))
      .catch(() => { });

    return () => {
      vivo = false;
    };
  }, []);

  const horario = useMemo(
    () =>
      ruta && ruta.grupos.length === 6
        ? construirHorario(ruta.grupos)
        : HORARIO_BASE,
    [ruta]
  );

  const retrasoNodo = (id, i) => horario.nodos[id] ?? i * 0.3;


  const inicio = useRef(performance.now());

  useEffect(() => {
    const t1 = T_BOTONES;
    const t2 = T_BOTONES + (horario.duracion + 0.3) * 1000;
    const t3 = t2 + 700;
    const transcurrido = performance.now() - inicio.current;

    const timers = [
      [1, t1],
      [2, t2],
      [3, t3],
    ].map(([f, t]) =>
      setTimeout(
        () => setFase((a) => Math.max(a, f)),
        Math.max(0, t - transcurrido)
      )
    );

    return () => timers.forEach(clearTimeout);
  }, [horario.duracion]);


  useEffect(() => {
    if (fase >= 1) animacionYaVista = true;
  }, [fase]);


  const [interacciones, setInteracciones] = useState([]);

  useEffect(() => {
    const cargarInteracciones = () => {
      const datos = localStorage.getItem("grimorio");
      setInteracciones(datos ? JSON.parse(datos) : []);
    };

    cargarInteracciones();

    window.addEventListener("grimorioActualizado", cargarInteracciones);

    return () => {
      window.removeEventListener("grimorioActualizado", cargarInteracciones);
    };
  }, []);

  const calcularProgreso = (capitulo) => {
    const objetos = capitulo.objetos || [];


    const idsGuardados = new Set(
      interacciones
        .filter((item) => (item.capitulo ?? 1) === capitulo.id)
        .map((item) => item.id)
    );

    const encontrados = objetos.filter((id) => idsGuardados.has(id)).length;

    return { encontrados, total: objetos.length };
  };

  const progresoActivo = calcularProgreso(capituloPanel);
  const misionCompleta =
    progresoActivo.total > 0 && progresoActivo.encontrados === progresoActivo.total;
  const porcentajeActivo =
    progresoActivo.total > 0
      ? Math.round((progresoActivo.encontrados / progresoActivo.total) * 100)
      : 0;


  const escalaPanel = capituloPanel.tamanoPanel ?? 1;
  const extraMargen = Math.max(0, escalaPanel - 1) * 42;


  const indiceActivo = capitulos.findIndex((c) => c.id === capituloActivo.id);
  const indicePrevio = useRef(indiceActivo);

  useEffect(() => {
    indicePrevio.current = indiceActivo;
  }, [indiceActivo]);


  const sonidoBoton = useRef(new Audio("./audios/sonidoboton.ogg"));

  const reproducirSonido = () => {
    sonidoBoton.current.currentTime = 0;
    sonidoBoton.current.play().catch(() => { });
  };

  const seleccionarCapitulo = (capitulo) => {
    reproducirSonido();
    if (capitulo.id === capituloActivo.id) return;

    setDireccion(capitulo.id > capituloActivo.id ? 1 : -1);
    setCapituloActivo(capitulo);


    setSaliendo(true);
    setBarrido((b) => b + 1);


    clearTimeout(timerPanel.current);
    timerPanel.current = setTimeout(() => {
      setCapituloPanel(capitulo);
      setCambios((c) => c + 1);
      setSaliendo(false);
    }, 420);
  };

  const irAlCapitulo = () => {
    reproducirSonido();

    setTimeout(() => {
      navigate(capituloActivo.ruta);
    }, 150);
  };

  return (
    <div className={`Container-mapa ${saltar ? "sin-animacion" : ""}`}>
      <div className="contenedor-mapa-pagina">
        <div className="header-mapa">

          <Link to="/" className="btn-volver" onClick={reproducirSonido}>
            <span className="btn-volver-flecha" aria-hidden="true">
              ←
            </span>
            Volver al inicio
          </Link>

          <div className="titulo-lado">
            <h1 className="titulo-mapa" aria-label="Grimorio">
              {"Grimorio".split("").map((letra, i) => (
                <span
                  key={i}
                  className="letra"
                  aria-hidden="true"
                  style={{ animationDelay: `${0.15 + i * 0.09}s` }}
                >
                  {letra}
                </span>
              ))}
            </h1>

            <div className="subtitulo-mapa">
              <span className="texto-sub">Mapa  Del Museo</span>
            </div>
          </div>
        </div>

        <div className="contenido-principal">

          <div className={`barra-capitulos ${fase >= 2 ? "visible" : ""}`}>
            <MarcoTrazo activo={fase >= 2} radio={12} duracion={1.1} />

            {capitulos.map((capitulo, i) => {
              const progreso = calcularProgreso(capitulo);

              return (
                <div
                  key={capitulo.id}
                  className={`item-capitulo ${capituloActivo.id === capitulo.id ? "seleccionado" : ""
                    }`}
                  style={{
                    "--retraso": `${0.5 + i * 0.1}s`,
                    "--escala": capitulo.tamano ?? 1,
                  }}
                  onClick={() => seleccionarCapitulo(capitulo)}
                >
                  <SvgDibujado
                    src={capitulo.icono}
                    fallback={capitulo.imagen}
                    alt=""
                    className="icono-barra"
                    activo={fase >= 2}
                    duracion={1.2}
                    retraso={0.4 + i * 0.1}
                  />

                  <p>{capitulo.titulo}</p>

                  {progreso.total > 0 && (
                    <span
                      className={`mini-progreso ${progreso.encontrados === progreso.total
                          ? "mini-progreso-completo"
                          : ""
                        }`}
                    >
                      {progreso.encontrados}/{progreso.total}
                    </span>
                  )}


                  {i < capitulos.length - 1 && (
                    <span
                      aria-hidden="true"
                      className={`tramo-recorrido ${i < indiceActivo ? "lleno" : ""
                        }`}
                      style={{
                        "--delay": `${(i < indiceActivo
                            ? Math.max(0, i - indicePrevio.current)
                            : Math.max(0, indicePrevio.current - 1 - i)) * 0.35
                          }s`,
                      }}
                    />
                  )}
                </div>
              );
            })}
          </div>

          <div className="zona-mapa">

            <div
              className="mapa"
              style={{ aspectRatio: `${VIEWBOX.w} / ${VIEWBOX.h}` }}
            >
              <SvgDibujado
                src={MAPA_SVG}
                alt="Mapa del museo"
                className={`mapa-svg ${fase >= 1 ? "completo" : ""}`}
                duracion={DURACION_MAPA}
              />

              {ruta && (
                <svg
                  className={`ruta-puntos ${fase >= 1 ? "activa" : ""}`}
                  viewBox={`0 0 ${ruta.w} ${ruta.h}`}
                  aria-hidden="true"
                  style={{
                    left: `${(PUNTOS_POS.x / VIEWBOX.w) * 100}%`,
                    top: `${(PUNTOS_POS.y / VIEWBOX.h) * 100}%`,
                    width: `${((ruta.w * PUNTOS_POS.escala) / VIEWBOX.w) * 100}%`,
                    aspectRatio: `${ruta.w} / ${ruta.h}`,
                  }}
                >
                  {ruta.grupos.map((grupo, g) =>
                    grupo.map((p, i) => (
                      <circle
                        key={`${g}-${i}`}
                        className="punto-ruta"
                        cx={p.cx}
                        cy={p.cy}
                        r={p.r}
                        style={{
                          animationDelay: `${horario.dots?.[g]?.[i] ?? 0.5}s`,
                        }}
                      />
                    ))
                  )}
                </svg>
              )}

              {capitulos.map((capitulo, i) => (
                <button
                  key={capitulo.id}
                  type="button"
                  aria-label={`Capítulo ${capitulo.id}: ${capitulo.titulo}`}
                  className={`btn-mapa ${fase >= 1 ? "visible" : ""} ${capituloActivo.id === capitulo.id ? "activo" : ""
                    }`}
                  style={{
                    left: `${(capitulo.pos.x / VIEWBOX.w) * 100}%`,
                    top: `${(capitulo.pos.y / VIEWBOX.h) * 100}%`,
                    "--escala": capitulo.tamano ?? 1,
                    "--retraso": `${retrasoNodo(capitulo.id, i)}s`,
                  }}
                  onClick={() => seleccionarCapitulo(capitulo)}
                >
                  <SvgDibujado
                    src={capitulo.icono}
                    fallback={capitulo.imagen}
                    alt={capitulo.titulo}
                    className="icono-mapa"
                    activo={fase >= 1}
                    duracion={1.2}
                    retraso={retrasoNodo(capitulo.id, i)}
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="panel-capitulo">
            <div className={`panel-contenido ${fase >= 3 ? "visible" : ""}`}>
              <MarcoTrazo activo={fase >= 3} radio={14} duracion={1.4} />


              {barrido > 0 && (
                <div className="panel-scan" key={barrido} aria-hidden="true" />
              )}


              <div
                className={`panel-interior ${cambios > 0 ? "cambio" : ""} ${saliendo ? "saliendo" : ""
                  }`}
                style={{ "--dir": direccion }}
                key={capituloPanel.id}
              >
                <div
                  className="imagen-panel"
                  style={{
                    "--escala": escalaPanel,
                    margin: `${extraMargen}px 0 ${10 + extraMargen}px`,
                  }}
                >
                  <SvgDibujado
                    src={capituloPanel.icono}
                    fallback={capituloPanel.imagen}
                    alt={capituloPanel.titulo}
                    className="icono-capitulo-panel"
                    activo={fase >= 3}
                    duracion={1.2}
                    retraso={0.5}
                  />
                </div>

                <h2 className="titulo-panel">{capituloPanel.titulo}</h2>

                <div className="linea"></div>

                <p className="descripcion-panel">{capituloPanel.descripcion}</p>

                {progresoActivo.total > 0 ? (
                  <div className="mision-capitulo">
                    <p className="mision-titulo">
                      <img
                        src="./mision.svg"
                        alt=""
                        className="icono-mision"
                      />
                      Misión Del Capítulo
                    </p>

                    <p className="mision-texto">
                      Encuentra todos los objetos interactivos del capítulo.
                    </p>

                    <span className="mision-contador">
                      <b>{progresoActivo.encontrados}</b> / {progresoActivo.total}{" "}
                      Encontrados
                    </span>


                    <div
                      className={`mision-medidor ${misionCompleta ? "completo" : ""
                        }`}
                      style={{ "--pct": `${porcentajeActivo}%` }}
                    >
                      <div className="mision-emblema" aria-hidden="true">
                        <span className="mision-emblema-anillo" />
                        <span className="mision-emblema-nucleo" />
                      </div>

                      <div
                        className="mision-barra"
                        role="progressbar"
                        aria-valuemin={0}
                        aria-valuemax={progresoActivo.total}
                        aria-valuenow={progresoActivo.encontrados}
                      >
                        <div className="mision-barra-interior">
                          <div className="mision-pista">
                            <div className="mision-barra-fill" />

                            {porcentajeActivo > 0 && porcentajeActivo < 100 && (
                              <span
                                className="mision-chispa"
                                aria-hidden="true"
                              />
                            )}

                            {Array.from({
                              length: Math.max(
                                0,
                                Math.min(progresoActivo.total, 12) - 1
                              ),
                            }).map((_, m) => (
                              <span
                                key={m}
                                className="mision-marca"
                                aria-hidden="true"
                                style={{
                                  left: `${((m + 1) /
                                      Math.min(progresoActivo.total, 12)) *
                                    100
                                    }%`,
                                }}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    {misionCompleta && (
                      <p className="mision-completa">✔ ¡Misión completada!</p>
                    )}

                    <Link
                      to="/archivo"
                      className="mision-link"
                      onClick={reproducirSonido}
                    >
                      Ver mi Grimorio
                    </Link>
                  </div>
                ) : (
                  <p className="mision-proximamente">
                    Este capítulo aún no está disponible para explorar.
                  </p>
                )}

                <button className="btn-vermas" onClick={irAlCapitulo}>
                  Ver Más
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapaCapitulos;