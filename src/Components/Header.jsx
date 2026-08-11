import React, { useRef } from "react";
import { Link } from "react-router-dom";
import "../Styles/css.css";

export const Header = () => {
  const sonidoBoton = useRef(new Audio("./audios/sonidoboton.ogg"));

  const reproducirSonido = () => {
    sonidoBoton.current.currentTime = 0;
    sonidoBoton.current.play().catch(() => {});
  };


  const estiloNav = {
    color: "#fff",
    textDecoration: "none",
  };

  return (
    <nav
      className="navbar navbar-expand-lg mainmenu"
      style={{
        background: "transparent",
        position: "absolute",
        width: "100%",
        zIndex: "10",
        fontFamily: "rxx",
      }}
    >
      <div className="container">

        {/* LOGO */}
        <Link
          className="navbar-brand"
          to="/"
          onClick={reproducirSonido}
          style={{
            color: "#ffffff",
            letterSpacing: "3px",
            fontSize: "30px",
            textShadow: "0 0 6px #fff",
          }}
        >
          <img
            src="./Logo.svg"
            alt="Logo"
            style={{
              width: "170px",
              objectFit: "contain",
              marginRight: "8px",
            }}
          />
        </Link>

        {/* BOTÓN RESPONSIVE */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          onClick={reproducirSonido}
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* MENÚ */}
        <div className="collapse navbar-collapse" id="navbarNav">
          <div className="ms-auto d-flex flex-column flex-lg-row align-items-center gap-3">

            {/* INICIO */}
            <Link
              className="nav-link"
              to="/"
              onClick={reproducirSonido}
              style={estiloNav}
            >
              Inicio
            </Link>

            {/* SOBRE NOSOTROS */}
            <Link
              className="nav-link"
              to="/sobrenosotros"
              onClick={reproducirSonido}
              style={estiloNav}
            >
              Sobre Nosotros
            </Link>

            {/* PERSONAJES */}
            <Link
              className="nav-link"
              to="/personajes"
              onClick={reproducirSonido}
              style={estiloNav}
            >
              Personajes
            </Link>

            {/* RECOMENDACIONES */}
            <Link
              className="nav-link"
              to="/Recomendaciones"
              onClick={reproducirSonido}
              style={estiloNav}
            >
              Recomendaciones
            </Link>

            {/* COMENTARIOS */}
            <Link
              className="nav-link"
              to="/intro-juego"
              onClick={reproducirSonido}
              style={estiloNav}
            >
              Comentarios
            </Link>


             {/* DIARIO */}
            <Link
              to="/archivo"
              onClick={reproducirSonido}
              style={estiloNav}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "7px",
                color: "#ffffff",
                textDecoration: "none",
                letterSpacing: "1px",
                fontSize: "16px",
               
              }}
            >

              Diario
            </Link>

            {/* EXPLORAR MUSEO */}
            <Link
              to="/guia"
              onClick={reproducirSonido}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                border: "1px solid #ffffff",
                padding: "8px 16px",
                borderRadius: "6px",
                color: "#ffffff",
                textDecoration: "none",
                letterSpacing: "1px",
                fontSize: "16px",
                textShadow: "0 0 6px #fff",
              }}
            >
              <img
                src="./book.svg"
                alt="Icono museo"
                style={{
                  width: "16px",
                  height: "16px",
                  objectFit: "contain",
                }}
              />

              Explorar Museo
            </Link>

          </div>
        </div>
      </div>
    </nav>
  );
};

export default Header;