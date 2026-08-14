import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

import LotieCap2 from "./LotieCap2";

import "../Styles/visorCap1.css";

export default function VisorComic2({
  numeroCapitulo = "II",
  tituloCapitulo = "RELIQUIAS",
}) {
  const navigate = useNavigate();

  const videoRef = useRef(null);

  const [index, setIndex] = useState(0);
  const [play, setPlay] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [volumen, setVolumen] = useState(true);


  const escenas = [
     {
      tipo: "lottie",
      componente: <LotieCap2/>,
    }, 
    {
      tipo: "video",
      video: "/Capitulo2V.mp4",
    },
  ];



  const siguiente = () => {
    if (index < escenas.length - 1) {
      setIndex(index + 1);
      setPlay(false);

      if (videoRef.current) {
        videoRef.current.pause();
        videoRef.current.currentTime = 0;
      }
    }
  };



  const anterior = () => {
    if (index > 0) {
      setIndex(index - 1);
      setPlay(false);

      if (videoRef.current) {
        videoRef.current.pause();
        videoRef.current.currentTime = 0;
      }
    }
  };



  const handlePlayPause = () => {
    if (!videoRef.current) return;

    if (videoRef.current.paused) {
      videoRef.current.play();
      setPlay(true);
    } else {
      videoRef.current.pause();
      setPlay(false);
    }
  };


  const cambiarVolumen = () => {
    const nuevoVolumen = !volumen;

    setVolumen(nuevoVolumen);

    if (videoRef.current) {
      videoRef.current.muted = !nuevoVolumen;
    }
  };


  return (
    <div className="visor-container">

     

      <div className="visor-top d-flex justify-content-between align-items-center">

        {/* IZQUIERDA */}

        <div className="d-flex align-items-center gap-2">

          <button
            onClick={() => navigate("/explorar-museo")}
            className="visor-btn"
          >
            ← CAPÍTULOS
          </button>

          <div className="visor-line"></div>

          <div className="d-flex align-items-center gap-1">

            <span className="visor-cap">
              CAPÍTULO {numeroCapitulo}
            </span>

            <span className="visor-title">
              — {tituloCapitulo}
            </span>

          </div>

        </div>



        <div className="d-flex align-items-center gap-3">

  

          <img
            onClick={cambiarVolumen}
            src={
              volumen
                ? "./volume-2 (2).svg"
                : "./volume-3.svg"
            }
            alt="Volumen"
            className={`visor-icon ${
              !volumen ? "off" : ""
            }`}
          />


       

          <img
            src="./subtitles-off.svg"
            alt="Subtítulos"
            className="visor-icon off"
          />


       

          <img
            onClick={() => navigate("/archivo")}
            src="./Archivo.png"
            alt="Interacciones guardadas"
            className="visor-iconnn"
          />

        </div>

      </div>


      <div className="visor-scene">


        {escenas[index].tipo === "lottie" && (

          <div className="visor-lottie">

            {escenas[index].componente}

          </div>

        )}


        {escenas[index].tipo === "video" && (

          <div
            className="visor-video-wrapper"
            onMouseEnter={() => setShowControls(true)}
            onMouseLeave={() => setShowControls(false)}
          >

            <video
              ref={videoRef}
              className="visor-video"
              autoPlay
              playsInline
              onPlay={() => setPlay(true)}
              onPause={() => setPlay(false)}
            >

              <source
                src={escenas[index].video}
                type="video/mp4"
              />

              Tu navegador no soporta videos HTML5.

            </video>


            <div
              className={`visor-controls ${
                showControls ? "show" : ""
              }`}
            >

              <div className="visor-controls-bottom">

   

                <button
                  className="video-btn"
                  onClick={() => {

                    if (videoRef.current) {
                      videoRef.current.currentTime -= 10;
                    }

                  }}
                >

                  <img
                    src="/icons8-rewind-50.png"
                    alt="Retroceder"
                  />

                </button>


                {/* PLAY / PAUSA */}

                <button
                  className="video-btn play-btn"
                  onClick={handlePlayPause}
                >

                  <img
                    src={
                      play
                        ? "/icons8-pause-50.png"
                        : "/icons8-play-50.png"
                    }
                    alt="Play/Pause"
                  />

                </button>


          

                <button
                  className="video-btn"
                  onClick={() => {

                    if (videoRef.current) {
                      videoRef.current.currentTime += 10;
                    }

                  }}
                >

                  <img
                    src="/icons8-fast-forward-50.png"
                    alt="Avanzar"
                  />

                </button>

              </div>

            </div>

          </div>

        )}


        <img
          onClick={anterior}
          src="./circle-chevron-left.svg"
          alt="Anterior"
          className={`visor-arrow left ${
            index === 0 ? "disabled" : ""
          }`}
        />


        <img
          onClick={siguiente}
          src="./circle-chevron-right.svg"
          alt="Siguiente"
          className={`visor-arrow right ${
            index === escenas.length - 1
              ? "disabled"
              : ""
          }`}
        />

      </div>


      <div className="visor-dots">

        {escenas.map((_, i) => (

          <div
            key={i}
            className={`dot ${
              index === i ? "active" : ""
            }`}
          />

        ))}

      </div>

    </div>
  );
}