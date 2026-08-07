import React from "react";
import "../Styles/css.css";

const CardRecomendacion = ({
  imagen,
  titulo,
  autor,
  anio,
  descripcion,
  pdf,
  delay = 0,
}) => {
  const abrirPDF = () => {
    window.open(pdf, "_blank");
  };

  return (
    <div
      className="card-recomendacion d-flex"
      data-aos="fade-up"
      data-aos-duration="900"
      data-aos-delay={delay}
      onClick={abrirPDF}
      style={{ cursor: "pointer" }}
      role="button"
      tabIndex="0"
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          abrirPDF();
        }
      }}
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