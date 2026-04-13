import React from "react";
import { Link } from "react-router-dom";
import "../Styles/css.css";

export const Header = () => {
  return (
    <nav
      className="navbar navbar-expand-lg mainmenu"
      style={{
        background: "transparent",
        position: "absolute",
        width: "100%",
        zIndex: "10",
        fontFamily: "haus",
      }}
    >
      <div className="container">

     
        <Link
          className="navbar-brand"
          to="/"
          style={{
            color: "#ffffff",
            letterSpacing: "3px",
            fontSize: "30px",
            textShadow: "0 0 6px #fff",
          }}
        >
          GRIMORIO
        </Link>

      
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

    
        <div className="collapse navbar-collapse" id="navbarNav">
          <div className="ms-auto d-flex flex-column flex-lg-row align-items-center gap-3">

            <Link className="nav-link" to="/" style={{ color: "#fff" }}>
              INICIO
            </Link>

            <Link className="nav-link" to="/sobrenosotros" style={{ color: "#fff" }}>
              SOBRE NOSOTROS
            </Link>

            <Link className="nav-link" to="/personajes" style={{ color: "#fff" }}>
              PERSONAJES
            </Link>

            <Link className="nav-link" to="/recomendaciones" style={{ color: "#fff" }}>
              RECOMENDACIONES
            </Link>

            <Link
              to="/explorarmuseo"
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
                alt="icono"
                style={{
                  width: "16px",
                  height: "16px",
                  objectFit: "contain",
                }}
              />
              EXPLORAR MUSEO
            </Link>

          </div>
        </div>

      </div>
    </nav>
  );
};

export default Header;