import React from "react";
import Header from "../Components/Header";
import Footer from "../Components/footer";
import CardCapitulo from "../Components/CardCapitulo";
import VolverInicio from "../Components/VolverInicio";
import TituloCapitulos from "../Components/TituloCapitulos";
import "../Styles/css.css";

export const ExplorarMuseo = () => {
  return (
    <>
      <div className="explorar-header container-fluid py-5 px-4">
        <VolverInicio />
        <TituloCapitulos />
      </div>

      <div className="explorar-cards container-fluid d-flex flex-wrap justify-content-center gap-4 py-5">
        <CardCapitulo
          capitulo="CAPÍTULO I"
          titulo="LA ENTRADA"
          descripcion="Un visitante nocturno llega al museo..."
          imagen="./Cap-1.jpg"
          ruta="/cap-uno"
        />

        <CardCapitulo
          capitulo="CAPÍTULO II"
          titulo="LAS RELIQUIAS"
          descripcion="En lo más profundo del museo..."
          imagen="./Cap-2.jpg"
          ruta="/cap-dos"
        />

        <CardCapitulo
          capitulo="CAPÍTULO III"
          titulo="EL DESPERTAR"
          descripcion="La línea entre la cera y la carne..."
          imagen="./Cap-3.jpg"
          ruta="/cap-tres"
        />

        <CardCapitulo
          capitulo="CAPÍTULO IV"
          titulo="EL RITUAL"
          descripcion="Bajo el museo, una cámara secreta..."
          imagen="./Cap-4.jpg"
          ruta="/cap-cuatro"
        />

        <CardCapitulo
          capitulo="CAPÍTULO V"
          titulo="LA ABOMINACIÓN"
          descripcion="Lo que fue invocado ha despertado..."
          imagen="./Cap-5.jpg"
          ruta="/cap-cinco"
        />
      </div>
    </>
  );
};