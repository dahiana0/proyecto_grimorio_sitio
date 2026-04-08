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
      <div className="container d-flex justify-content-between align-items-center">

        
        <a
          className="navbar-brand"
          to="/inicio"
          style={{
            color: "#ffffff",
            letterSpacing: "3px",
            fontSize :"30px",
            textShadow:"0 0 6px #fff"
          }}
        >
          GRIMORIO
        </a>

      
        <div className="d-flex align-items-center gap-4">

          <Link
            className="nav-link"
            to="/"
            style={{ color: "#ffffff", fontSize:"18px" }}
          >
            INICIO
          </Link>

          <Link
            className="nav-link"
            to="/sobrenosotros"
            style={{ color: "#ffffff", fontSize:"18px",}} 
          >
            SOBRE NOSOTROS
          </Link>

          <Link
            className="nav-link"
            to="/personajes"
            style={{ color: "#ffffff",fontSize:"18px" }}  
          >
            PERSONAJES
          </Link>

          <Link
            className="nav-link"
            to="/Recomendaciones"
            style={{ color: "#ffffff",fontSize:"18px" }}
          >
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
              fontSize: "14px",
              letterSpacing: "1px",
              fontSize:"18px",
              textShadow:"0 0 6px #fff",
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
    </nav>
  );
};

export default Header;