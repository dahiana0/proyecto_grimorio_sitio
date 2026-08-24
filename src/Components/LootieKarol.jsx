import { useRef, useEffect } from "react";
import LottieModule from "lottie-react";
import GuardarInteraccion from "./GuardarInteraccion";

import tableroo from "../assets/tablero.json";
import calabera from "../assets/calavera.json";
import step from "../assets/step1.json";
import libroM from "../assets/libro mesa.json";
import libroc from "../assets/libro cae.json";

import "../Styles/LootieKarol.css";

const Lottie = LottieModule.default;

const LootieKarol = () => {

  const tableroRef = useRef(null);
  const calaveraRef = useRef(null);
  const stepRef = useRef(null);
  const libroRef = useRef(null);
  const libroCRef = useRef(null);



  const sonidoTablero = useRef(new Audio("/audios/tablero.mp3"));
  const sonidoCalavera = useRef(new Audio("/audios/calavera.mp3"));
  const sonidoLibro = useRef(new Audio("/audios/libro.mp3"));



  useEffect(() => {
    sonidoTablero.current.volume = 0.20;
    sonidoCalavera.current.volume = 0.20;
    sonidoLibro.current.volume = 0.35;
  }, []);



  const animarTablero = () => {

    sonidoTablero.current.currentTime = 0;
    sonidoTablero.current.play();

    tableroRef.current?.stop();
    tableroRef.current?.play();

    GuardarInteraccion(
      "tablero",
      "Tablero de investigación",
      "tablero"
    );
  };



  const animarCalavera = () => {

    sonidoCalavera.current.currentTime = 0;
    sonidoCalavera.current.play();

    calaveraRef.current?.stop();
    calaveraRef.current?.play();

    GuardarInteraccion(
      "calavera",
      "Calavera",
      "calavera"
    );
  };



  const animarStep = () => {

    stepRef.current?.stop();
    stepRef.current?.play();

    GuardarInteraccion(
      "step",
      "Step",
      "step"
    );
  };



  const animarLibro = () => {

    sonidoLibro.current.currentTime = 0;
    sonidoLibro.current.play();

    libroRef.current?.stop();
    libroRef.current?.play();

    GuardarInteraccion(
      "libro",
      "Libro antiguo",
      "libro"
    );
  };



  const animarLibroC = () => {

    libroCRef.current?.stop();
    libroCRef.current?.play();

    GuardarInteraccion(
      "libroC",
      "Libro caído",
      "libroC"
    );
  };

  return (

    <div className="escena1">

      <div className="camara">

        <img
          className="fondo"
          src="/Escenario-Oficina-Step-Final-1.png"
          alt="Fondo"
        />


        <div
          className="tablero"
          onClick={animarTablero}
        >
          <Lottie
            lottieRef={tableroRef}
            animationData={tableroo}
            autoplay={false}
            loop={false}
          />
        </div>


        <div
          className="calavera"
          onClick={animarCalavera}
        >
          <Lottie
            lottieRef={calaveraRef}
            animationData={calabera}
            autoplay={false}
            loop={false}
          />
        </div>

        <div
          className="step"
          onClick={animarStep}
        >
          <Lottie
            lottieRef={stepRef}
            animationData={step}
            autoplay={false}
            loop={false}
          />
        </div>


        <div
          className="libro"
          onClick={animarLibro}
        >
          <Lottie
            lottieRef={libroRef}
            animationData={libroM}
            autoplay={false}
            loop={false}
          />
        </div>


        <div
          className="libroC"
          onClick={animarLibroC}
        >
          <Lottie
            lottieRef={libroCRef}
            animationData={libroc}
            autoplay={false}
            loop={false}
          />
        </div>

      </div>

    </div>

  );
};

export default LootieKarol;