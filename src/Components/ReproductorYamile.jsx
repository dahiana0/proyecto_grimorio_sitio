import React, { useRef, useState } from "react";

export const ReproductorYamile = () => {
  const [mostrarMensaje, setMostrarMensaje] = useState(false);
  const [detener, setDetener] = useState(false);

  const videoRef = useRef(null);
  const handlePlay = () => {
    videoRef.current.play();
  };
  const handlePause = () => {
    videoRef.current.pause();
  };
  const handleAvanzar = () => {
    videoRef.current.currentTime = 6;
  };

  const handleContinuar = () => {
    setMostrarMensaje(false);
    videoRef.current.play();
  };
  const handleUpdate = () => {
    if (videoRef.current.currentTime >= 5 && !detener) {
      videoRef.current.pause();
      setMostrarMensaje(true);
      setDetener(true);
    }
  };

  return (
    <>
      <h1> Reproductor interactivo</h1>
      <video ref={videoRef} width={700} onTimeUpdate={handleUpdate}>
        <source
          src="https://www.w3schools.com/Html/mov_bbb.mp4"
          type="video/mp4"
        />
      </video>

      {mostrarMensaje && <h2>Video Detenenido en el seg. 5 😘</h2>}

      <div>
        <button onClick={handlePlay}>Play</button>
        <button onClick={handlePause}>Pause</button>
        <button onClick={handleAvanzar}>Ir al seg 6</button>
        <button onClick={handleContinuar}>Continuar</button>
      </div>
    </>
  );
};
