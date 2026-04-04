import React from "react";
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
          href="/"
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

          <a
            className="nav-link"
            href="/"
            style={{ color: "#ffffff", fontSize:"18px" }}
          >
            INICIO
          </a>

          <a
            className="nav-link"
            href="/about"
            style={{ color: "#ffffff", fontSize:"18px",}} 
          >
            SOBRE NOSOTROS
          </a>

          <a
            className="nav-link"
            href="/personajes"
            style={{ color: "#ffffff",fontSize:"18px" }}  
          >
            PERSONAJES
          </a>

          <a
            className="nav-link"
            href="/recomendaciones"
            style={{ color: "#ffffff",fontSize:"18px" }}
          >
            RECOMENDACIONES
          </a>

          <a
            href="/explorar"
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
          </a>

        </div>
      </div>
    </nav>
  );
};

export default Header;