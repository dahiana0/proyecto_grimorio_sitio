import React from "react";
import VisorComic5 from "./VisorComic5";

const PaginaComic5 = () => {
  const imagenes = [
    {
      imagen: "./public/scene1-2.jpg",
      subtitulo: "En la sala de reliquias, los artefactos vibran con una energía desconocida.",
    },
    {
      imagen: "./CAP-2-1.jpg",
      subtitulo: "Los susurros se hacen más fuertes. Alguien — o algo — te llama.",
    },
    {
      imagen: "./CAP-2-3.jpg",
      subtitulo: "y vuelta atrás. Los secretos del museo te han atrapado.",
    },
  ];

  return <VisorComic5 imagenes={imagenes} />;
};

export default PaginaComic5;