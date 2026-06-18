import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../Styles/juego.css";
import heroImg from "../../public/puerta1.svg";

export const IntroJuego = () => {
  const navigate = useNavigate();
  const [correctDoor, setCorrectDoor] = useState(() =>
    Math.ceil(Math.random() * 5),
  );
  const [selectedDoor, setSelectedDoor] = useState(null);
  const [result, setResult] = useState(null);
  const [attempts, setAttempts] = useState(0);

  const pickDoor = (door) => {
    navigate("/juego");
  };

  const restart = () => {
    setCorrectDoor(Math.ceil(Math.random() * 5));
    setSelectedDoor(null);
    setResult(null);
    setAttempts(0);
  };

  return (
    <div id="juego">
      <div className="juego-container">
        <h1 className="juego-titulo">
          {" "}
          Sección De<br></br>
          Comentarios
        </h1>
        <br />
        <br />
        <p className="juego-subtitulo">
          En el museo de Grimorio, Queremos leer tu opinión.
        </p>
        <p className="juego-subtitulo">
         Dejanos leer tu escalofriante opinión <br></br> 
        </p>

        <div className="juego-puertas">
          <div className="puertas-row top">
            {[1].map((door) => (
              <img
                key={door}
                src={heroImg}
                alt={`PUERTA ${door}`}
                className={`puerta-img ${selectedDoor === door ? "seleccionada" : ""}`}
                onClick={() => pickDoor(door)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};


