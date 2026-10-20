import React from "react";
import Header from "../Components/Header";
import TituloPersonajes from "../Components/TituloPersonajes";
import CarruselPersonajes from "../Components/Carruselpersonajes";
import Footer from "../Components/footer";
import "../Styles/Carruselpersonajes.css";

const personajes = [
  {
    nombre: "Stephen Jones",
    imagen: "./stephen.jpeg",
    svg: "./stephen.svg",
    rig: "stephen",
    ruta: "/step",
  },
  {
    nombre: "George Rogers",
    imagen: "./rogers.jpeg",
    svg: "./rogers (1).svg",
    rig: "rogers",
    ruta: "/rogers",
  },
  {
    nombre: "Orabona",
    imagen: "./orabona.png",
    svg: "./orabona.svg",
    rig: "orabona",
    ruta: "/orabona",
  },
  {
    nombre: "Cthulhu",
    imagen: "./monstruo.png",
    svg: "./cthulhu.svg",
    rig: "cthulhu",
    ruta: "/cthulhu",
  },
];

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

      <div
        className="personajes-galeria"
        data-aos="fade-up"
        data-aos-duration="900"
      >
        <CarruselPersonajes personajes={personajes} />
      </div>

      <Footer />
    </>
  );
};

export default Personajes;