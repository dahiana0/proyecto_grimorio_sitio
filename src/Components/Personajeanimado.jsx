import React, { useEffect, useRef, useState } from "react";

/**
 * PersonajeAnimado: personaje SVG animado dentro de una tarjeta.
 * TODO está en este archivo (ya no hace falta Animarpersonaje.jsx).
 *
 * Props:
 *  - src:    ruta del svg (en /public), ej. "./stephen.svg"
 *  - rig:    "orabona" | "stephen" | "rogers" | "cthulhu"
 *  - nombre: texto alternativo
 *  - imagen: imagen de respaldo si el SVG no carga
 *
 * El cursor NO afecta al personaje: se mueve solo (parpadea, respira,
 * mira a los lados y mueve un poco la cabeza y las cejas).
 */

// ---------- Cada personaje: encuadre y partes que se mueven ----------
// caja = [x, y, ancho, alto] -> lo que se ve del dibujo (de la cabeza a la cintura).
// Para ver MÁS cuerpo: sube el último número (alto). Para ver menos: bájalo.
const RIGS = {
  orabona: {
    unit: 1,
    caja: [61, -14, 220, 367],
    fondo: "radial-gradient(circle at 50% 35%, #4b5b52, #1b2620 80%)",
    build(q) {
      const cara = q("Cara_1");
      const k = [...cara.firstElementChild.children]; // 0 pelo,1 ojos,2-3 párpados,4 boca,5 nariz,6-7 cejas
      return {
        head: { els: [cara], pivot: [167, 138] },
        eyes: [{ els: [k[1], k[2], k[3]] }],
        brows: [{ el: k[6], s: -1 }, { el: k[7], s: 1 }],
        mouth: k[4],
        nose: k[5],
      };
    },
  },

  stephen: {
    unit: 1,
    caja: [-11, -18, 266, 443],
    fondo: "radial-gradient(circle at 50% 35%, #55606b, #1c2229 80%)",
    build(q) {
      const ids = ["Oreja_Derecha", "Oreja_Izquierda", "Cabeza", "Nariz", "Ceja_Derecha",
        "Ceja_Izquierda", "Boca", "Ojo_Izquierdo", "Ojo_Derecho", "Gafas", "Pelo"];
      return {
        head: { els: ids.map(q), pivot: [122, 172] }, // el cuello se queda quieto
        eyes: [{ els: [q("Ojo_Derecho")] }, { els: [q("Ojo_Izquierdo")] }],
        gaze: 0.6,
        brows: [{ el: q("Ceja_Derecha"), s: -1 }, { el: q("Ceja_Izquierda"), s: 1 }],
        mouth: q("Boca"),
        nose: q("Nariz"),
      };
    },
  },

  rogers: {
    unit: 1,
    caja: [70, -20, 256, 427],
    fondo: "radial-gradient(circle at 50% 35%, #5e5546, #221e17 80%)",
    build(q) {
      const cabeza = q("Cabeza");
      const k = [...cabeza.children];
      return {
        head: { els: [cabeza], pivot: [196, 146] },
        eyes: [{ els: [k[108]] }, { els: [k[94]] }],
        gaze: 0.8,
        brows: [{ el: k[90], s: -1 }, { el: k[115], s: 1 }],
        mouth: k[83],
      };
    },
  },

  cthulhu: {
    unit: 10, // el SVG es ~10 veces más grande que los otros
    caja: [861, -80, 1800, 3000], // borra esta línea para verlo completo con alas
    fondo: "radial-gradient(circle at 50% 35%, #3f5560, #101a20 80%)",
    build(q) {
      const p = [...q("Capa_1-2").firstElementChild.children];
      const cabeza = p[10];
      const k = [...cabeza.children];
      const tent = (i, amp, ph) => {
        const b = k[i].getBBox();
        return { el: k[i], pivot: [b.x + b.width / 2, b.y + 40], amp, f: 1.3, ph };
      };
      return {
        head: { els: [cabeza], pivot: [1760, 1900] },
        eyes: [{ els: [k[13], k[23]] }, { els: [k[28], k[29]] }],
        gaze: 0.7,
        brows: [],
        // alas y tentáculos
        sway: [
          { el: p[0], pivot: [2150, 1100], amp: 2.2, f: 1.1, ph: 0 },
          { el: p[1], pivot: [1380, 1100], amp: -2.2, f: 1.1, ph: 0 },
          tent(4, 3, 0), tent(5, 3, 1), tent(11, 3, 2), tent(19, 3, 3), tent(26, 3, 4),
          tent(16, 2, 1.5), tent(17, 2, 2.5), tent(21, 2, 0.5), tent(30, 2, 3.5),
        ],
      };
    },
  },
};

// ---------- Prepara el texto del SVG ----------
// - Prefija ids y clases para que los 4 SVG no se pisen entre sí.
// - Aplica el encuadre (mitad del cuerpo) y el difuminado de abajo.
//   Esto se hace aquí, así que funciona aunque la animación falle.
const ESTILO_SVG =
  "display:block;width:100%;height:100%;" +
  "-webkit-mask-image:linear-gradient(to bottom,#000 60%,transparent 93%);" +
  "mask-image:linear-gradient(to bottom,#000 60%,transparent 93%);";

function prepararSvg(texto, rig) {
  const caja = RIGS[rig]?.caja;
  return texto
    .replace(/<\?xml[^>]*\?>/, "")
    .replace(/cls-/g, `${rig}-cls-`)
    .replace(/\bid="([^"]+)"/g, `id="${rig}-$1"`)
    .replace(/url\(#([^)]+)\)/g, `url(#${rig}-$1)`)
    .replace(/(xlink:)?href="#([^"]+)"/g, `$1href="#${rig}-$2"`)
    .replace(/<svg\b([^>]*)>/, (m, attrs) => {
      const limpio = attrs
        .replace(/\sviewBox="[^"]*"/, "")
        .replace(/\spreserveAspectRatio="[^"]*"/, "")
        .replace(/\sstyle="[^"]*"/, "")
        .replace(/\s(width|height)="[^"]*"/g, "");
      const vb = caja ? ` viewBox="${caja.join(" ")}" preserveAspectRatio="xMidYMin slice"` : "";
      return `<svg${limpio}${vb} style="${ESTILO_SVG}">`;
    });
}

// ---------- Animación (todo se mueve solo, sin cursor) ----------
const NO_MOVER = ["defs", "style", "title"];

function animarPersonaje(root, rigNombre) {
  const rig = RIGS[rigNombre];
  const svg = root.querySelector("svg");
  if (!rig || !svg) return () => {};

  const q = (n) => svg.querySelector(`[id="${rigNombre}-${n}"]`);
  const cfg = rig.build(q);
  const u = rig.unit;

  // Todo el dibujo dentro de un grupo para poder "respirar"
  const cuerpo = document.createElementNS("http://www.w3.org/2000/svg", "g");
  [...svg.children]
    .filter((n) => !NO_MOVER.includes(n.localName))
    .forEach((n) => cuerpo.appendChild(n));
  svg.appendChild(cuerpo);
  const vb = svg.viewBox.baseVal;
  const base = [vb.x + vb.width / 2, vb.y + vb.height];

  const reducir = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
  if (reducir) return () => {};

  const originales = new Map();
  const guardar = (el) => originales.set(el, el.getAttribute("transform") || "");
  const headEls = cfg.head.els;
  const fueraDeCabeza = (el) => !headEls.some((h) => h === el || h.contains(el));
  const centro = (els, fy = 0.5) => {
    let x1 = 1e9, y1 = 1e9, x2 = -1e9, y2 = -1e9;
    els.forEach((e) => {
      const b = e.getBBox();
      x1 = Math.min(x1, b.x); y1 = Math.min(y1, b.y);
      x2 = Math.max(x2, b.x + b.width); y2 = Math.max(y2, b.y + b.height);
    });
    return [(x1 + x2) / 2, y1 + (y2 - y1) * fy];
  };

  const ojos = (cfg.eyes || []).map((e) => ({ ...e, c: centro(e.els, 0.55) }));
  const cejas = (cfg.brows || []).map((b) => ({ ...b, c: centro([b.el]) }));
  const boca = cfg.mouth ? { el: cfg.mouth, c: centro([cfg.mouth]) } : null;
  const sway = cfg.sway || [];
  const gaze = cfg.gaze ?? 1;

  headEls.forEach(guardar);
  ojos.forEach((o) => o.els.forEach(guardar));
  cejas.forEach((b) => guardar(b.el));
  [boca?.el, cfg.nose, ...sway.map((s) => s.el)].filter(Boolean).forEach(guardar);

  const poner = (el, propio, cabeza) =>
    el.setAttribute("transform", `${originales.get(el)} ${fueraDeCabeza(el) ? cabeza : ""} ${propio}`);

  let gx = 0, gy = 0, gtx = 0, gty = 0; // hacia dónde miran
  let parpadeo = 0, proximo = 1.5, proximaMirada = 2, proximaCeja = 4, ceja = 0;
  let raf = 0, visible = true;
  const t0 = performance.now();
  const lerp = (a, b, t) => a + (b - a) * t;

  const io = typeof IntersectionObserver !== "undefined"
    ? new IntersectionObserver(([e]) => (visible = e.isIntersecting))
    : null;
  io?.observe(root);

  const frame = (now) => {
    raf = requestAnimationFrame(frame);
    if (document.hidden || !visible) return;
    const t = (now - t0) / 1000;

    // mirada que cambia sola
    if (t > proximaMirada) {
      gtx = (Math.random() - 0.5) * 1.6;
      gty = (Math.random() - 0.5) * 0.7;
      proximaMirada = t + 1.5 + Math.random() * 3;
    }
    gx = lerp(gx, gtx, 0.05);
    gy = lerp(gy, gty, 0.05);

    // parpadeo
    if (t > proximo) { parpadeo = 1; proximo = t + 2 + Math.random() * 3; }
    parpadeo = Math.max(0, parpadeo - 0.09);
    const cerrado = parpadeo > 0 ? Math.sin((1 - parpadeo) * Math.PI) : 0;

    // de vez en cuando sube las cejas
    if (t > proximaCeja) { ceja = 1; proximaCeja = t + 4 + Math.random() * 5; }
    ceja = Math.max(0, ceja - 0.012);
    const sorpresa = Math.sin(Math.min(1, ceja) * Math.PI) * 0.5;

    // respiración
    const resp = Math.sin(t * 1.6);
    cuerpo.setAttribute("transform",
      `translate(${base[0]} ${base[1]}) scale(1 ${1 + resp * 0.004}) translate(${-base[0]} ${-base[1]})`);

    // cabeza: movimiento muy suave (no se deforma)
    const rot = Math.sin(t * 0.6) * 0.5 + gx * 0.3;
    const dy = (resp * 0.5 - sorpresa * 2) * u;
    const H = `translate(${gx * 0.3 * u} ${dy}) rotate(${rot} ${cfg.head.pivot[0]} ${cfg.head.pivot[1]})`;
    headEls.forEach((el) => el.setAttribute("transform", `${originales.get(el)} ${H}`));

    // ojos: parpadeo + mirada
    const ey = Math.max(0.06, 1 - cerrado * 0.94) * (1 + sorpresa * 0.25);
    ojos.forEach((o) =>
      o.els.forEach((el) =>
        poner(el, `translate(${gx * 1.6 * gaze * u} ${gy * gaze * u}) translate(${o.c[0]} ${o.c[1]}) scale(1 ${ey}) translate(${-o.c[0]} ${-o.c[1]})`, H)));

    // cejas
    const by = (-sorpresa * 7 + Math.sin(t * 0.6) * 0.4) * u;
    cejas.forEach((b) =>
      poner(b.el, `translate(0 ${by}) rotate(${b.s * sorpresa * 3} ${b.c[0]} ${b.c[1]})`, H));

    // boca y nariz
    if (boca) poner(boca.el,
      `translate(${boca.c[0]} ${boca.c[1]}) scale(${1 + sorpresa * 0.1} ${1 + resp * 0.05 + sorpresa * 0.6}) translate(${-boca.c[0]} ${-boca.c[1]})`, H);
    if (cfg.nose) poner(cfg.nose, `translate(${gx * 0.4 * u} 0)`, H);

    // alas / tentáculos
    sway.forEach((s) =>
      poner(s.el, `rotate(${s.amp * Math.sin(t * s.f + s.ph)} ${s.pivot[0]} ${s.pivot[1]})`, H));
  };
  raf = requestAnimationFrame(frame);

  return () => {
    cancelAnimationFrame(raf);
    io?.disconnect();
  };
}

// ---------- Componente ----------
export const PersonajeAnimado = ({ src, rig, nombre, imagen }) => {
  const caja = useRef(null);
  const [html, setHtml] = useState("");
  const [fallo, setFallo] = useState(false);

  useEffect(() => {
    let vivo = true;
    fetch(src)
      .then((r) => r.text())
      .then((t) => {
        if (!vivo) return;
        if (t.includes("<svg")) setHtml(prepararSvg(t, rig));
        else {
          console.warn(`PersonajeAnimado: no se encontró ${src} (¿está en la carpeta public/?)`);
          setFallo(true);
        }
      })
      .catch(() => vivo && setFallo(true));
    return () => {
      vivo = false;
    };
  }, [src, rig]);

  useEffect(() => {
    if (!html || !caja.current) return;
    try {
      return animarPersonaje(caja.current, rig);
    } catch (e) {
      // si la animación falla, el personaje se queda quieto (pero visible y recortado)
      console.error("No se pudo animar", rig, e);
    }
  }, [html, rig]);

  // Si no se encuentra el .svg, se muestra la imagen normal
  if (fallo && imagen) {
    return <img src={imagen} alt={nombre} className="carrusel-card-img" draggable="false" />;
  }

  return (
    <div
      ref={caja}
      className="carrusel-card-img personaje-animado"
      role="img"
      aria-label={nombre}
      style={{
        display: "block",
        overflow: "hidden",
        background: RIGS[rig]?.fondo,
        transform: "none", // sin zoom al pasar el cursor
        transition: "none",
      }}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};

export default PersonajeAnimado;