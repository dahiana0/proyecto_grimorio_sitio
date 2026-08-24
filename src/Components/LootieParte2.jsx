import LottieModule from "lottie-react";
import { useRef, useEffect } from "react";

import edificio from "../assets/edificio.json";
import rejas from "../assets/rejas.json";
import "../Styles/LootieParte2.css";

const Lottie = LottieModule.default;

const LootieParte2 = () => {

  const edificioRef = useRef(null);
  const rejasRef = useRef(null);
  const videoRef = useRef(null);

  const sonidoAmbiente = useRef(new Audio("/audios/ambiente.mp3"));
  const sonidoRejas = useRef(new Audio("/audios/rejas.mp3"));
  const sonidoPasos = useRef(new Audio("/audios/pasos.mp3"));

  useEffect(() => {


    sonidoAmbiente.current.volume = 0.15;
    sonidoRejas.current.volume = 0.35;
    sonidoPasos.current.volume = 0.40;

    sonidoAmbiente.current.loop = true;

    const iniciarAmbiente = () => {
      sonidoAmbiente.current.play().catch(() => { });
      window.removeEventListener("click", iniciarAmbiente);
    };

    window.addEventListener("click", iniciarAmbiente);

    return () => {
      sonidoAmbiente.current.pause();
      sonidoAmbiente.current.currentTime = 0;
      window.removeEventListener("click", iniciarAmbiente);
    };

  }, []);


  const animarEdificio = () => {
    edificioRef.current?.stop();
    edificioRef.current?.play();
  };


  const animarRejas = () => {

    sonidoRejas.current.currentTime = 0;
    sonidoRejas.current.play();

    rejasRef.current?.stop();
    rejasRef.current?.play();

  };



  const animarVideo = () => {

    sonidoPasos.current.currentTime = 0;
    sonidoPasos.current.play();

    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play();
    }

  };

  return (

    <div className="escena2">

      <div className="camara">

        <img className="fondo2" src="/fondo2.png" alt="" />

        <img className="nube1" src="/nube1.png" alt="" />
        <img className="nube2" src="/nube2.png" alt="" />
        <img className="nube3" src="/nube3.png" alt="" />
        <img className="nube4" src="/nube4.png" alt="" />

        <video
          ref={videoRef}
          className="step2"
          muted
          playsInline
          onClick={animarVideo}
        >
          <source src="/CompRecorte.webm" type="video/webm" />
        </video>

        <div
          className="edificio"
          onClick={animarEdificio}
        >
          <Lottie
            lottieRef={edificioRef}
            animationData={edificio}
            autoplay={false}
            loop={false}
          />
        </div>

        <div
          className="rejas"
          onClick={animarRejas}
        >
          <Lottie
            lottieRef={rejasRef}
            animationData={rejas}
            autoplay={false}
            loop={false}
          />
        </div>

      </div>

    </div>

  );

};

export default LootieParte2;