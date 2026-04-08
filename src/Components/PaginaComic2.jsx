import React from "react";
import VisorComic2 from "./VisorComic2";

const PaginaComic2 = () => {
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

  return <VisorComic2 imagenes={imagenes} />;
};

export default PaginaComic2;