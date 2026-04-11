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

      <div className="personajes-titulo pt-6">
        <TituloPersonajes />
      </div>

      <div className="personajes-container d-flex justify-content-center py-5">
        <div className="personajes-grid d-flex flex-wrap justify-content-center gap-4">
          
          <CardGrande
            nombre="STEPHEN JONES"
            rol="EL ESCÉPTICO"
            descripcion="Un hombre racional que no cree en lo sobrenatural..."
            imagen="./stephen.jpg"
            tipo="Protagonista"
            rasgo="Racional"
            ruta="/step"
          />

          <CardGrande
            nombre="GEORGE ROGERS"
            rol="EL CURADOR"
            descripcion="Dueño del museo de cera..."
            imagen="./rogers.jpg"
            tipo="Antagonista"
            rasgo="Obsesivo"
            ruta="/rogers"
          />

          <CardGrande
            nombre="ORABONA"
            rol="EL ENIGMA"
            descripcion="El socio silencioso de Rogers. Misterioso y raro..."
            imagen="./orabona.jpg"
            tipo="Misterioso"
            rasgo="Aliado"
            ruta="/orabona"
          />

          <CardGrande
            nombre="CTHULHU"
            rol="EL HORROR"
            descripcion="Un ser informe y tentacular. El verdadero secreto del museo…"
            imagen="./cthulhu.jpg"
            tipo="Cósmico"
            rasgo="Entidad"
            ruta="/cthulhu"
          />
        </div>
      </div>

      <Footer />
    </>
  );
};