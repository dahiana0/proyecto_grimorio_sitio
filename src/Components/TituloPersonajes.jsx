import React from "react";
import "../Styles/TituloPersonajes.css";

/**
 * Título de la página de personajes, animado:
 *  - el título aparece letra por letra y luego late suavemente (siempre en verde)
 *  - subtítulo que aparece suave
 */
const TITULO = "Conoce A Los Personajes";
const SUBTITULO =
  "Descubre el trasfondo y los secretos ocultos de los personajes que habitan nuestras historias.";

export const TituloPersonajes = () => {
  let n = 0; // contador para escalonar las letras

  return (
    <header className="tp">
      <h1 className="tp-titulo" aria-label={TITULO}>
        {TITULO.split(" ").map((palabra, w) => (
          <span className="tp-palabra" key={w} aria-hidden="true">
            {[...palabra].map((letra, l) => (
              <span className="tp-letra" key={l} style={{ "--i": n++ }}>
                {letra}
              </span>
            ))}
          </span>
        ))}
      </h1>

      <p className="tp-sub">{SUBTITULO}</p>
    </header>
  );
};

export default TituloPersonajes;