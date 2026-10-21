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

  // Los números romanos son <text> con la fuente Ringbearer. Si esa fuente
  // no está cargada en la página, se usa "pieces" y luego una serif.
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

  // Que el último trazo termine cuando termina la duración total
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

  // Mide el largo REAL de cada trazo (no depende de pathLength, que no
  // todos los navegadores respetan en circle/line/polygon/rect).
  const ref = useRef(null);

  useLayoutEffect(() => {
    const cont = ref.current;
    if (!cont || !html) return;

    cont.querySelectorAll(".trazo").forEach((el) => {
      let largo = 1;
      try {
        largo = el.getTotalLength();
      } catch (e) {
        /* forma sin largo medible: se deja el valor por defecto */
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

// =========================================================================
// MarcoTrazo: borde rectangular que se dibuja solo (tarjeta y barra)
// =========================================================================
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

// =========================================================================
// Constantes de la secuencia de aparición (en ms)
// =========================================================================
const MAPA_SVG = "/mapa3.svg";
const VIEWBOX = { w: 1530, h: 1015 };
const DURACION_MAPA = 4; // segundos que tarda en dibujarse el mapa

const T_BOTONES = DURACION_MAPA * 1000;

// =========================================================================
// RUTA DE PUNTOS (pppp1111.svg)
// =========================================================================
// Pon el archivo en /public. Los círculos se agrupan solos en "tramos"
// (cada vez que hay un salto grande entre un punto y el siguiente).
// Con tu archivo salen 6 grupos, en este orden:
//   0 y 1 -> de I a II (cortado por la pared)    2 -> II a III
//   3 -> I y V (vertical)   4 -> V y IV (abajo)   5 -> III y IV (derecha)
const RUTA_SVG = "/pppp1111.svg";

// Dónde cae el SVG de puntos sobre el mapa, en unidades del viewBox del
// mapa (1530 x 1015). Si se ve corrido, mueve x / y; si se ve más grande
// o más pequeño, cambia escala.
const PUNTOS_POS = { x: 318, y: 241, escala: 0.95 };

const DIST_CORTE = 45; // salto mínimo para considerar que empieza otro grupo

// Orden del recorrido. "invertir" = los puntos se recorren al revés de como
// vienen en el archivo. El último tramo (V -> I) cierra el circuito; si no
// lo quieres, bórralo de la lista.
const PRIMER_NODO = 1;
const RUTA = [
  { hasta: 2, grupos: [0, 1] },
  { hasta: 3, grupos: [2] },
  { hasta: 4, grupos: [5] },
  { hasta: 5, grupos: [4], invertir: true },
  { hasta: 1, grupos: [3], invertir: true },
];

const SEG_PUNTO = 0.04; // segundos entre un punto y el siguiente
const SEG_NODO = 0.45; // segundos que se toma cada capítulo en aparecer

// Respaldo si el SVG de puntos no carga: los capítulos salen escalonados
const HORARIO_BASE = {
  dots: null,
  nodos: { 1: 0, 2: 0.35, 3: 0.7, 4: 1.05, 5: 1.4 },
  duracion: 2,
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

// Calcula en qué segundo aparece cada punto y cada capítulo.
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

  // ---------------------------------------------------------------------
  // Datos de los capítulos
  // ---------------------------------------------------------------------
  // "objetos": ids que cada Lootie del capítulo guarda con GuardarInteraccion.
  // "icono": SVG propio del botón (ponlos en /public/iconos/). Mientras no
  //          exista el archivo se usa "imagen" como respaldo.
  // "pos": posición del botón dentro del mapa, en coordenadas del viewBox
  //        del SVG (1530 x 1015). Ajústalas a tu gusto.
  // "tamano": multiplicador del tamaño del icono en el mapa y la barra.
  // "tamanoPanel": multiplicador del icono en la tarjeta (otro tamaño base).
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
      objetos: ["tablero", "calavera", "step", "libro", "libroC"],
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
      objetos: [],
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
      objetos: [],
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
      objetos: [],
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
      tamano: 1.8, // el icono del cap. 5 se ve más pequeño: súbelo o bájalo a gusto
      tamanoPanel: 1.4, // escala del icono en la tarjeta: ajústala hasta que se vea igual que los demás
      objetos: [],
    },
  ];

  const [capituloActivo, setCapituloActivo] = useState(capitulos[0]);

  // La tarjeta va un paso detrás del capítulo activo: primero sale el
  // contenido viejo (saliendo) y luego entra el nuevo (capituloPanel).
  const [capituloPanel, setCapituloPanel] = useState(capitulos[0]);
  const [saliendo, setSaliendo] = useState(false);
  const [cambios, setCambios] = useState(0);
  const [barrido, setBarrido] = useState(0);
  const [direccion, setDireccion] = useState(1); // 1 = adelante, -1 = atrás
  const timerPanel = useRef(null);

  useEffect(() => () => clearTimeout(timerPanel.current), []);

  // ---------------------------------------------------------------------
  // Secuencia: 0 = dibujando mapa · 1 = botones · 2 = barra · 3 = tarjeta
  // ---------------------------------------------------------------------
  const [fase, setFase] = useState(0);

  // Ruta de puntos + horario de aparición (capítulos y puntos)
  const [ruta, setRuta] = useState(null);

  useEffect(() => {
    let vivo = true;

    cargarPuntos(RUTA_SVG)
      .then((r) => vivo && setRuta(r))
      .catch(() => {});

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

  // fase 1 = recorrido · 2 = barra (al terminar el recorrido) · 3 = tarjeta
  const inicio = useRef(performance.now());

  useEffect(() => {
    const t1 = T_BOTONES;
    const t2 = T_BOTONES + (horario.duracion + 0.4) * 1000;
    const t3 = t2 + 900;
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

  // ---------------------------------------------------------------------
  // Interacciones guardadas (Grimorio)
  // ---------------------------------------------------------------------
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
    const idsGuardados = interacciones.map((item) => item.id);
    const encontrados = objetos.filter((id) => idsGuardados.includes(id)).length;

    return { encontrados, total: objetos.length };
  };

  const progresoActivo = calcularProgreso(capituloPanel);
  const misionCompleta =
    progresoActivo.total > 0 && progresoActivo.encontrados === progresoActivo.total;
  const porcentajeActivo =
    progresoActivo.total > 0
      ? Math.round((progresoActivo.encontrados / progresoActivo.total) * 100)
      : 0;

  // Escala del icono dentro de la tarjeta y compensación del margen
  // (un transform: scale no ocupa espacio, así que se agrega margen).
  const escalaPanel = capituloPanel.tamanoPanel ?? 1;
  const extraMargen = Math.max(0, escalaPanel - 1) * 42;

  // Índice del capítulo activo y del anterior: sirven para que la línea de
  // puntos de la barra avance (o retroceda) tramo por tramo.
  const indiceActivo = capitulos.findIndex((c) => c.id === capituloActivo.id);
  const indicePrevio = useRef(indiceActivo);

  useEffect(() => {
    indicePrevio.current = indiceActivo;
  }, [indiceActivo]);

  // Sonido
  const sonidoBoton = useRef(new Audio("./audios/sonidoboton.ogg"));

  const reproducirSonido = () => {
    sonidoBoton.current.currentTime = 0;
    sonidoBoton.current.play().catch(() => {});
  };

  const seleccionarCapitulo = (capitulo) => {
    reproducirSonido();
    if (capitulo.id === capituloActivo.id) return;

    setDireccion(capitulo.id > capituloActivo.id ? 1 : -1);
    setCapituloActivo(capitulo);

    // 1) sale el contenido viejo + barrido de luz
    setSaliendo(true);
    setBarrido((b) => b + 1);

    // 2) a mitad del barrido entra el nuevo
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
    <div className="Container-mapa">
      <div className="contenedor-mapa-pagina">
        <div className="header-mapa">
          {/* Botón volver: cambia to="/" si tu inicio tiene otra ruta.
              Borra el botón viejo (App / Layout) o saldrán dos. */}
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
          {/* ------- BARRA VERTICAL DE CAPÍTULOS (al lado del mapa) ------- */}
          <div className={`barra-capitulos ${fase >= 2 ? "visible" : ""}`}>
            <MarcoTrazo activo={fase >= 2} radio={12} duracion={1.1} />

            {capitulos.map((capitulo, i) => {
              const progreso = calcularProgreso(capitulo);

              return (
                <div
                  key={capitulo.id}
                  className={`item-capitulo ${
                    capituloActivo.id === capitulo.id ? "seleccionado" : ""
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
                      className={`mini-progreso ${
                        progreso.encontrados === progreso.total
                          ? "mini-progreso-completo"
                          : ""
                      }`}
                    >
                      {progreso.encontrados}/{progreso.total}
                    </span>
                  )}

                  {/* Tramo de puntos encendido hacia el siguiente capítulo */}
                  {i < capitulos.length - 1 && (
                    <span
                      aria-hidden="true"
                      className={`tramo-recorrido ${
                        i < indiceActivo ? "lleno" : ""
                      }`}
                      style={{
                        "--delay": `${
                          (i < indiceActivo
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
            {/* ---------------- MAPA (solo trazo) ---------------- */}
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
                  className={`btn-mapa ${fase >= 1 ? "visible" : ""} ${
                    capituloActivo.id === capitulo.id ? "activo" : ""
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

          {/* ---------------- TARJETA DEL CAPÍTULO ---------------- */}
          <div className="panel-capitulo">
            <div className={`panel-contenido ${fase >= 3 ? "visible" : ""}`}>
              <MarcoTrazo activo={fase >= 3} radio={14} duracion={1.4} />

              {/* Barrido de luz cada vez que se cambia de capítulo */}
              {barrido > 0 && (
                <div className="panel-scan" key={barrido} aria-hidden="true" />
              )}

              {/* key: al cambiar de capítulo se remonta y el contenido entra */}
              <div
                className={`panel-interior ${cambios > 0 ? "cambio" : ""} ${
                  saliendo ? "saliendo" : ""
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
                        src="/Icono-Mision.png"
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

                    {/* Medidor estilo barra de habilidad: emblema + barra con punta */}
                    <div
                      className={`mision-medidor ${
                        misionCompleta ? "completo" : ""
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
                                  left: `${
                                    ((m + 1) /
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