import React from "react";
import "../Styles/MapaCapitulo.css";
export const MapaCapitulos = () => {
  return (
    <>
    <div className="Container-mapa">
      <h1 className="titulo-mapa">
        Grimorio
        <span>Mapa Del Museo</span>
      </h1>

      <div className="mapa">

        <img
          className="img-mapa"
          src="/Mapa-Grimorio.png"
          alt=""
        />
        <img className="btn-mapa btn1" src="/Capitilo-1-img.png" alt="" />

        <img className="btn-mapa btn2" src="/Capitulo-2-img.png" alt="" />

        <img className="btn-mapa btn3" src="/Capitulo-3-img.png" alt="" />

        <img className="btn-mapa btn4" src="/Capitulo-5-img.png" alt="" />

        <img className="btn-mapa btn5" src="/Capitulo-4.png" alt="" />

      </div>

      <div className="banner-capitulos">

        <div className="capitulo-banner">
          <img src="/Capitilo-1-img.png" alt="" />
          <p>La Entrada</p>
        </div>

        <div className="capitulo-banner">
          <img src="/Capitulo-2-img.png" alt="" />
          <p>Susurros en la Sala</p>
        </div>

        <div className="capitulo-banner">
          <img src="/Capitulo-3-img.png" alt="" />
          <p>El Vigilante</p>
        </div>

        <div className="capitulo-banner">
          <img src="/Capitulo-4.png" alt="" />
          <p>La Sala Prohibida</p>
        </div>

        <div className="capitulo-banner">
          <img src="/Capitulo-5-img.png" alt="" />
          <p>El Final del Grimorio</p>
        </div>

      </div>

      </div>
    </>
  );
};