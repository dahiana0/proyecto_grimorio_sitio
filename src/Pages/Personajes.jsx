import React from "react";
import Header from "../Components/Header";
import TituloPersonajes from "../Components/TituloPersonajes";
import CardGrande from "../Components/CardGrande";
import Footer from "../Components/footer";
import "../Styles/css.css";

export const Personajes = () => {
  return (
    <>
      <Header />

      {/* Título */}
      <div
        className="personajes-titulo"
        data-aos="fade-down"
        data-aos-duration="1000"
      >
        <TituloPersonajes />
      </div>

      {/* Tarjetas */}
      <div className="personajes-container d-flex justify-content-center py-2">
        <div className="personajes-grid d-flex flex-wrap justify-content-center gap-4">

          <div
            data-aos="fade-up"
            data-aos-delay="100"
            data-aos-duration="900"
          >
            <CardGrande
              nombre="STEPHEN JONES"
              rol="EL ESCÉPTICO"
              descripcion="Un hombre racional que no cree en lo sobrenatural..."
              imagen="./stephen.jpeg"
              tipo="Protagonista"
              rasgo="Racional"
              ruta="/step"
            />
          </div>

          <div
            data-aos="fade-up"
            data-aos-delay="250"
            data-aos-duration="900"
          >
            <CardGrande
              nombre="GEORGE ROGERS"
              rol="EL CURADOR"
              descripcion="Dueño del museo de cera..."
              imagen="./rogers.jpeg"
              tipo="Antagonista"
              rasgo="Obsesivo"
              ruta="/rogers"
            />
          </div>

          <div
            data-aos="fade-up"
            data-aos-delay="400"
            data-aos-duration="900"
          >
            <CardGrande
              nombre="ORABONA"
              rol="EL ENIGMA"
              descripcion="El socio silencioso de Rogers. Misterioso y raro..."
              imagen="./orabona.png"
              tipo="Misterioso"
              rasgo="Aliado"
              ruta="/orabona"
            />
          </div>

          <div
            data-aos="fade-up"
            data-aos-delay="550"
            data-aos-duration="900"
          >
            <CardGrande
              nombre="CTHULHU"
              rol="EL HORROR"
              descripcion="Un ser informe y tentacular. El verdadero secreto del museo…"
              imagen="./monstruo.png"
              tipo="Cósmico"
              rasgo="Entidad"
              ruta="/cthulhu"
            />
          </div>

        </div>
      </div>

      <Footer />
    </>
  );
};