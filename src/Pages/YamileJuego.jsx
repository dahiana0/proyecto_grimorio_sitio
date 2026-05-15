import React, { useState } from "react";
import "../Styles/juego.css";

const Juego = () => {
  const [correctDoor, setCorrectDoor] = useState(() =>
    Math.ceil(Math.random() * 5),
  );
  const [selectedDoor, setSelectedDoor] = useState(null);
  const [result, setResult] = useState(null);
  const [attempts, setAttempts] = useState(0);

  const pickDoor = (door) => {
    if (result) return;
    setSelectedDoor(door);
    setAttempts((value) => value + 1);

    if (door === correctDoor) {
      setResult("victoria");
    } else {
      setResult("derrota");
    }
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
          QUE OBJETOS FUERON DIFERENTES <br></br>
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
          {[1, 2, 3, 4, 5].map((door) => (
            <button
              key={door}
              type="button"
              className={`juego-puerta ${selectedDoor === door ? "seleccionada" : ""}`}
              onClick={() => pickDoor(door)}
            >
              PUERTA {door}
            </button>
          ))}
        </div>

        {result && (
          <div className={`juego-resultado ${result}`}>
            <h2 className={`juego-resultado-titulo ${result}`}>
              {result === "victoria"
                ? "¡Has encontrado el Grimorio!"
                : "Has caído en una trampa infernal..."}
            </h2>
            <p className="juego-resultado-mensaje">
              {result === "victoria"
                ? `Seleccionaste la puerta ${selectedDoor} y escapaste del museo.`
                : `La puerta ${selectedDoor} te llevó a un pasillo maldito. Intenta de nuevo.`}
            </p>
            <p className="juego-intentos">Intentos: {attempts}</p>
            <button type="button" className="juego-reiniciar" onClick={restart}>
              Reiniciar juego
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Juego;
