import React from "react";
import Header from "../Components/Header";
import TituloPersonajes from "../Components/TituloPersonajes";
import CardGrande from "../Components/CardGrande";
import Footer from "../Components/footer";
import "../Styles/Personajes.css";

export const Personajes = () => {
  return (
    <>
      <Header />

      <div
        className="personajes-titulo"
        data-aos="fade-down"
        data-aos-duration="1000"
      >
        <TituloPersonajes />
      </div>

      <div className="personajes-container d-flex justify-content-center py-2">
        <div className="personajes-grid d-flex flex-wrap justify-content-center gap-4">

          <div
            data-aos="fade-up"
            data-aos-delay="100"
            data-aos-duration="900"
          >
            <CardGrande
              nombre="Stephen Jones"
              descripcion="Un hombre racional que no cree en lo sobrenatural..."
              imagen="./stephen.jpeg"
              ruta="/step"
            />
          </div>

          <div
            data-aos="fade-up"
            data-aos-delay="250"
            data-aos-duration="900"
          >
            <CardGrande
              nombre="George Rogers"
              descripcion="Dueño del museo de cera..."
              imagen="./rogers.jpeg"
              ruta="/rogers"
            />
          </div>

          <div
            data-aos="fade-up"
            data-aos-delay="400"
            data-aos-duration="900"
          >
            <CardGrande
              nombre="Orabona"
              descripcion="El socio silencioso de Rogers. Misterioso y raro..."
              imagen="./orabona.png"
              ruta="/orabona"
            />
          </div>

          <div
            data-aos="fade-up"
            data-aos-delay="550"
            data-aos-duration="900"
          >
            <CardGrande
              nombre="Cthulhu"
              descripcion="Un ser informe y tentacular. El verdadero secreto del museo…"
              imagen="./monstruo.png"
              ruta="/cthulhu"
            />
          </div>

        </div>
      </div>m

      <Footer />
    </>
  );
};