import React, { useRef } from "react";
import { NavLink, Link } from "react-router-dom";
import "../Styles/css.css";
import "../Styles/Header.css";

// Cada item: ruta, texto que se ve al desplegar e icono (ponle tus propios SVG)
const ITEMS = [
  { to: "/", label: "Inicio", icon: "/InicioI.svg" },
  { to: "/sobrenosotros", label: "Sobre Nosotros", icon: "/SobreNosotros.svg" },
  { to: "/personajes", label: "Personajes", icon: "/Personajes.svg" },
  { to: "/Recomendaciones", label: "Recomendaciones", icon: "/recomendacioness.svg" },
  { to: "/intro-juego", label: "Comentarios", icon: "/comentarioss.svg" },
  { to: "/archivo", label: "Archivo", icon: "/archivooo.svg" },
];

export const Header = () => {
  const sonidoBoton = useRef(new Audio("./audios/sonidoboton.ogg"));

  const reproducirSonido = () => {
    sonidoBoton.current.currentTime = 0;
    sonidoBoton.current.play().catch(() => {});
  };

  return (
    <nav className="sidebar" aria-label="Menú principal">
      {/* Logo: insignia cuando está cerrado, logo completo cuando se despliega */}
      <Link
        to="/"
        className="sidebar__logo"
        onClick={reproducirSonido}
        aria-label="Inicio"
      >
        <img src="./Icono logoo.svg" alt="" className="sidebar__logo-mini" />
        <img src="./Logo.svg" alt="Logo" className="sidebar__logo-full" />
      </Link>

      <ul className="sidebar__list">
        {ITEMS.map(({ to, label, icon }, i) => (
          <li key={to}>
            <NavLink
              to={to}
              onClick={reproducirSonido}
              className={({ isActive }) =>
                "sidebar__link" + (isActive ? " sidebar__link--active" : "")
              }
              style={{ "--d": `${i * 0.4}s` }} /* desfasa el latido de cada icono */
            >
              <img src={icon} alt="" className="sidebar__icon" />
              <span className="sidebar__label">{label}</span>
            </NavLink>
          </li>
        ))}
      </ul>

      {/* Botón destacado al fondo: pon aquí tu icono del museo */}
      <Link
        to="/guia"
        onClick={reproducirSonido}
        className="sidebar__link sidebar__link--cta"
      >
        <span className="sidebar__aro" aria-hidden="true" />
        <img src="/comicccc.svg" alt="" className="sidebar__icon" />
        <span className="sidebar__label">Explorar Museo</span>
      </Link>
    </nav>
  );
};

export default Header;