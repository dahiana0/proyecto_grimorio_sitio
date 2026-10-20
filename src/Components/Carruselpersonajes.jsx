import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import PersonajeAnimado from "./Personajeanimado";
import "../Styles/Carruselpersonajes.css";

/**
 * Galería de personajes:
 *  - Cuando la galería entra en pantalla, las tarjetas aparecen solas, una tras otra y despacio
 *    (ya no dependen del scroll).
 *  - Cuando terminan de aparecer: hover con brillo, nombre debajo y clic en la tarjeta para ver más.
 *
 * Props: personajes: [{ nombre, imagen, svg, rig, ruta }]
 *  - Si el personaje tiene "svg" y "rig", se muestra animado; si no, usa "imagen".
 */

// Colores de las tarjetas: una verde, otra morada (se alternan solas).
// "accent" y "rgb" controlan el borde, el resplandor y el nombre; "fondo" es el fondo de la tarjeta.
const TONOS = [
  {
    accent: "#1ad96d",
    rgb: "26, 217, 109",
    fondo: "radial-gradient(circle at 50% 30%, #1f8a55 0%, #0b3321 55%, #04140c 100%)",
  },
  {
    accent: "#a35cff",
    rgb: "163, 92, 255",
    fondo: "radial-gradient(circle at 50% 30%, #6d41c9 0%, #2b1763 55%, #0e0624 100%)",
  },
];

// Ajustes de la aparición (en segundos)
const ENTRADA = 0.45; // espera entre una tarjeta y la siguiente
const DURACION = 1.5; // lo que tarda en aparecer cada tarjeta

export const CarruselPersonajes = ({ personajes = [] }) => {
  const navigate = useNavigate();
  const [activo, setActivo] = useState(0);
  const [visible, setVisible] = useState(false); // la galería ya entró en pantalla
  const [abierto, setAbierto] = useState(false); // ya terminaron de aparecer
  const contenedor = useRef(null);
  const audioRef = useRef(null);
  const n = personajes.length;

  // Las tarjetas empiezan a aparecer cuando la galería entra en pantalla
  useEffect(() => {
    const el = contenedor.current;
    if (!el || !n) return;
    if (typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setVisible(true);
          io.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [n]);

  // Se activan hover y clics cuando la última tarjeta terminó de aparecer
  useEffect(() => {
    if (!visible) return;
    const reducir = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    const ms = reducir ? 0 : ((n - 1) * ENTRADA + DURACION) * 1000;
    const id = setTimeout(() => setAbierto(true), ms);
    return () => clearTimeout(id);
  }, [visible, n]);

  if (!n) return null;

  const reproducirSonido = () => {
    if (!audioRef.current) {
      audioRef.current = new Audio("./audios/sonidoboton.ogg");
    }
    audioRef.current.currentTime = 0;
    audioRef.current.play().catch(() => {});
  };

  const verMas = (ruta) => {
    reproducirSonido();
    setTimeout(() => navigate(ruta), 150);
  };

  // Destello según el mouse (la inclinación 3D solo se usa en tarjetas con imagen normal)
  const mover = (e, animado) => {
    const el = e.currentTarget;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    if (!animado) {
      el.style.setProperty("--ry", `${x * 14}deg`);
      el.style.setProperty("--rx", `${y * -14}deg`);
    }
    el.style.setProperty("--mx", `${(x + 0.5) * 100}%`);
    el.style.setProperty("--my", `${(y + 0.5) * 100}%`);
  };

  const salir = (e) => {
    e.currentTarget.style.setProperty("--ry", "0deg");
    e.currentTarget.style.setProperty("--rx", "0deg");
  };

  return (
    <div
      ref={contenedor}
      className={`carrusel ${visible ? "is-visible" : ""} ${abierto ? "is-open" : ""}`}
      role="group"
      aria-label="Personajes"
    >
      {personajes.map((p, i) => {
        const esActiva = i === activo;
        const tono = TONOS[i % TONOS.length];

        return (
          <div
            key={p.nombre}
            className="carrusel-slot"
            style={{
              "--delay": `${i * ENTRADA}s`,
              "--dur": `${DURACION}s`,
              "--rot-in": `${i % 2 === 0 ? -5 : 5}deg`, // cada tarjeta llega con un giro distinto
              "--accent": tono.accent,
              "--accent-rgb": tono.rgb,
              "--card-bg": tono.fondo,
            }}
          >
            <div
              className={`carrusel-card ${esActiva ? "is-active" : ""}`}
              tabIndex={abierto ? 0 : -1}
              role="link"
              aria-label={`Ver más de ${p.nombre}`}
              onClick={() => abierto && verMas(p.ruta)}
              onKeyDown={(e) => e.key === "Enter" && abierto && verMas(p.ruta)}
              onMouseEnter={() => abierto && setActivo(i)}
              onFocus={() => abierto && setActivo(i)}
              onMouseMove={(e) => mover(e, Boolean(p.svg && p.rig))}
              onMouseLeave={salir}
              aria-current={esActiva}
            >
              <div className="carrusel-card-marco">
                {p.svg && p.rig ? (
                  <PersonajeAnimado
                    src={p.svg}
                    rig={p.rig}
                    nombre={p.nombre}
                    imagen={p.imagen}
                  />
                ) : (
                  <img
                    src={p.imagen}
                    alt={p.nombre}
                    className="carrusel-card-img"
                    draggable="false"
                  />
                )}
                <span className="carrusel-card-brillo" />
              </div>
            </div>

            {/* Nombre debajo de la tarjeta; al hacer clic en la tarjeta se ve más */}
            <div
              className={`carrusel-nombre ${esActiva ? "is-active" : ""}`}
              onClick={() => abierto && verMas(p.ruta)}
            >
              {p.nombre}
              {esActiva && abierto && (
                <span className="carrusel-nombre-hint">Toca la tarjeta para ver más</span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default CarruselPersonajes;