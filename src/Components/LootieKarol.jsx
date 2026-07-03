import { useRef } from "react";
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

  
  const animarTablero = () => {

    tableroRef.current?.stop();
    tableroRef.current?.play();

    GuardarInteraccion(
      "tablero",
      "Tablero de investigación",
      "tablero"
    );

  };



  const animarCalavera = () => {

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

    <div className="escena">

      <div className="camara">

        <img
          className="fondo"
          src="/Escenario-Oficina-Step-Final-1.png"
          alt="Fondo"
        />

        {/* TABLERO */}
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

        {/* CALAVERA */}
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

        {/* STEP */}
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

        {/* LIBRO */}
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

        {/* LIBRO CAÍDO */}
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