import React, { useState } from "react";
import "../Styles/SofiaGuia.css"
import { div } from "motion/react-m";

export function SofiaGuia() {
  return (
    
    <div className="container-sofia">

      {/* Personaje */}
      <div className="character">
        <img src="/guia-grimorio.webp" alt="Personaje" />
      </div>

      {/* Diálogos */}
      <div className="dialogues">

        <div className="speech-box">
          <p>Bienvenido a Grimorio.</p>
        </div>

        <div className="speech-box">
          <p>
            A continuación entrarás en una aventura donde
          </p>
        </div>

        <div className="speech-box">
          <p>
            Cada paso revela secretos prohibidos
            <br />
            Este no es un museo
          </p>
        </div>

        <div className="speech-box">
          <p>
            Común... aquí, las historias te observan.
            Atrévete a continuar.
          </p>
        </div>

        {/* Botón */}
        <button className="start-btn">
          Iniciar el recorrido
        </button>

      </div>
    </div>
  );
}
