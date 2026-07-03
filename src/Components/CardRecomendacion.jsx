import React from "react";
import "../Styles/css.css";

const CardRecomendacion = ({
  imagen,
  titulo,
  autor,
  anio,
  descripcion,
  delay = 0,
}) => {
  return (
    <div
      className="card-recomendacion d-flex"
      data-aos="fade-up"
      data-aos-duration="900"
      data-aos-delay={delay}
    >
      <img
        src={imagen}
        alt={titulo}
        className="card-recomendacion-img"
      />

      <div className="d-flex flex-column">

        <h3 className="card-recomendacion-title">
          {titulo}
        </h3>

        <p className="card-recomendacion-meta">
          {autor} · {anio}
        </p>

        <p className="card-recomendacion-desc">
          {descripcion}
        </p>

      </div>
    </div>
  );
};

export default CardRecomendacion;