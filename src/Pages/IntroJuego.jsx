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
          QUE OBJETOS FUERON DIFERENTE<br></br>
          EN LOS CAPITULOS
        </h1>
        <br />
        <br />
        <p className="juego-subtitulo">
          En el museo de Grimorio, Te presentamos nuestro juego.
        </p>
        <p className="juego-subtitulo">
          Con las pistas que se te dieron en los capitulos deberas adivinar que
          objetos fueron diferentes en cada capitulo, <br></br> elige sabiamente
          y encuentra el Grimorio para escapar del museo. ¡Buena suerte!
        </p>

        <div className="juego-puertas">
          <div className="puertas-row top">
            {[1, 2, 3].map((door) => (
              <img
                key={door}
                src={heroImg}
                alt={`PUERTA ${door}`}
                className={`puerta-img ${selectedDoor === door ? "seleccionada" : ""}`}
                onClick={() => pickDoor(door)}
              />
            ))}
          </div>

          <div className="puertas-row bottom">
            {[4, 5].map((door) => (
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

        {result && (
          <div className={`juego-resultado ${result}`}>
            <h2 className={`juego-resultado-titulo ${result}`}>
              {result === "victoria"
                ? "¡Has encontrado el Objeto!"
                : "Has caído en una trampa infernal..."}
            </h2>
            <p className="juego-resultado-mensaje">
              {result === "victoria"
                ? `Seleccionaste la puerta ${selectedDoor} y escapaste del museo.`
                : `La puerta ${selectedDoor} te llevó a un pasillo maldito. Intenta de nuevo.`}
            </p>
            <p className="juego-intentos">Intentos: {attempts}</p>
            <img
              src={heroImg}
              alt="Reiniciar juego"
              className="juego-reiniciar-img"
              onClick={restart}
            />
          </div>
        )}
      </div>
    </div>
  );
};


