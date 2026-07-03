import React from "react";
import Header from "../Components/Header";
import BannerSobreNosotros from "../Components/BannerSobreNosotros";
import Footer from "../Components/footer";
import CardInfoS from "../Components/CardInfoS";
import CardEquipoFlip from "../Components/CardEquipoFlip";
import TituloEquipo from "../Components/TituloEquipo";
import "../Styles/css.css";

export const SobreNosotros = () => {
  return (
    <>
      <Header />
      <br />

      {/* Banner */}
      <div data-aos="fade-down">
        <BannerSobreNosotros />
      </div>

      {/* Misión */}
      <div data-aos="fade-right">
        <CardInfoS
          titulo="Misión"
          texto="Crear experiencias digitales interactivas que despierten el interés de los jóvenes por la lectura, integrando elementos visuales, sonoros y narrativos."
          imagen="./Libro.png"
        />
      </div>

      {/* Visión */}
      <div data-aos="fade-left">
        <CardInfoS
          titulo="Visión"
          texto="Convertirnos en una plataforma referente de lectura alternativa en Latinoamérica, donde la literatura pueda reimaginarse en formatos inmersivos."
          imagen="./Ojo.png"
          derecha={true}
        />
      </div>

      {/* Propósito */}
      <div data-aos="fade-right">
        <CardInfoS
          titulo="Propósito"
          texto="Fomentar la lectura digital inmersiva. Llevar a los jóvenes más allá del simple acto de leer un texto — que se sientan parte de la historia."
          imagen="./Brujula.png"
        />
      </div>

      {/* Inspiración */}
      <div data-aos="fade-left">
        <CardInfoS
          titulo="Inspiración"
          texto="Basado en 'El Horror del Museo' (1933) de H.P. Lovecraft & Hazel Heald. Lo prohibido cobra vida en una experiencia interactiva."
          imagen="./Brillo.png"
          derecha={true}
        />
      </div>

      {/* Título */}
      <div data-aos="fade-up">
        <TituloEquipo />
      </div>

      {/* Equipo */}
      <div className="equipo-container d-flex justify-content-center flex-wrap gap-4 mt-5 align-items-start">
        <div data-aos="fade-up" data-aos-delay="100">
          <CardEquipoFlip
            nombre="Sofía Amaya Reyes"
            rol="DISEÑADORA PRINCIPAL"
            descripcion="Experta en arte gótico y diseño UI/UX. Crea la identidad visual y la experiencia inmersiva."
            imagen="./Sofia.jpeg"
            iniciales="SA"
          />
        </div>

        <div data-aos="fade-up" data-aos-delay="300">
          <CardEquipoFlip
            nombre="Yamile Arias Pérez"
            rol="ARTISTA CONCEPTUAL"
            descripcion="Creadora del estilo visual oscuro de Grimorio."
            imagen="./Yamile.jpeg"
            iniciales="YA"
          />
        </div>

        <div data-aos="fade-up" data-aos-delay="500">
          <CardEquipoFlip
            nombre="Karol Dahiana Usuga"
            rol="DESARROLLADORA LÍDER"
            descripcion="Encargada del desarrollo técnico del proyecto."
            imagen="./Karol.jpeg"
            iniciales="KU"
          />
        </div>
      </div>

      <Footer />
    </>
  );
};