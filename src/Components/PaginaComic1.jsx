import React from "react";
import VisorComic1 from "./VisorComic1";

const PaginaComic1 = () => {
  const imagenes = [
    {
      imagen: "./scene1.jpg",
      subtitulo: "Una noche fría. El museo de cera abre sus puertas...",
    },
    {
      imagen: "./scene2.jpg",
      subtitulo: "El visitante cruza el umbral...",
    },
    {
      imagen: "./scene3.jpg",
      subtitulo: "Algo oscuro observa desde dentro...",
    },
  ];

  return <VisorComic1 imagenes={imagenes} />;
};

export default PaginaComic1;