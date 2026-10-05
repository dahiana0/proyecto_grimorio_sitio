import LottieModule from "lottie-react";
import { useRef, useEffect } from "react";

/* import cuadro1 from "../assets/cuadro1.json"; // TODO: ajusta los nombres de tus JSON
import cuadro2 from "../assets/cuadro2.json";
import cuadro3 from "../assets/cuadro3.json";
import cuadro4 from "../assets/cuadro4.json";
import cuadro5 from "../assets/cuadro5.json";
import cuadro6 from "../assets/cuadro6.json";
import cuadro7 from "../assets/cuadro7.json";
import cuadro8 from "../assets/cuadro8.json";
import huesos from "../assets/huesos.json";
import manchas from "../assets/manchas.json";
import puerta from "../assets/puerta.json"; */
import "../Styles/LotieCap5C.css";

const Lottie = LottieModule.default;

const LotieCap5C = () => {

 /*  const cuadro1Ref = useRef(null);
  const cuadro2Ref = useRef(null);
  const cuadro3Ref = useRef(null);
  const cuadro4Ref = useRef(null);
  const cuadro5Ref = useRef(null);
  const cuadro6Ref = useRef(null);
  const cuadro7Ref = useRef(null);
  const cuadro8Ref = useRef(null);
  const huesosRef = useRef(null);
  const manchasRef = useRef(null);
  const puertaRef = useRef(null);

  const stepEspalda1Ref = useRef(null);
  const orabonaRef = useRef(null);
  const stepEspalda2Ref = useRef(null);

  const sonidoAmbiente = useRef(new Audio("/audios/ambiente.mp3"));
  const sonidoPasos = useRef(new Audio("/audios/pasos.mp3")); */

 /*  useEffect(() => {

    sonidoAmbiente.current.volume = 0.15;
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
      sonidoPasos.current.pause();
      window.removeEventListener("click", iniciarAmbiente);
    };

  }, []); */

 
 /*  const animarCuadro1 = () => {
    cuadro1Ref.current?.stop();
    cuadro1Ref.current?.play();
  };

  const animarCuadro2 = () => {
    cuadro2Ref.current?.stop();
    cuadro2Ref.current?.play();
  };

  const animarCuadro3 = () => {
    cuadro3Ref.current?.stop();
    cuadro3Ref.current?.play();
  };

  const animarCuadro4 = () => {
    cuadro4Ref.current?.stop();
    cuadro4Ref.current?.play();
  };

  const animarCuadro5 = () => {
    cuadro5Ref.current?.stop();
    cuadro5Ref.current?.play();
  };

  const animarCuadro6 = () => {
    cuadro6Ref.current?.stop();
    cuadro6Ref.current?.play();
  };

  const animarCuadro7 = () => {
    cuadro7Ref.current?.stop();
    cuadro7Ref.current?.play();
  };

  const animarCuadro8 = () => {
    cuadro8Ref.current?.stop();
    cuadro8Ref.current?.play();
  }; */

 
 /*  const animarHuesos = () => {
    huesosRef.current?.stop();
    huesosRef.current?.play();
  };

  const animarManchas = () => {
    manchasRef.current?.stop();
    manchasRef.current?.play();
  };

  const animarPuerta = () => {
    puertaRef.current?.stop();
    puertaRef.current?.play();
  }; */


  /* const reproducirVideo = (videoRef, conPasos) => {
    if (conPasos) {
      sonidoPasos.current.currentTime = 0;
      sonidoPasos.current.play().catch(() => { });
    }

    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play();
    }
  };

  const animarStepEspalda1 = () => reproducirVideo(stepEspalda1Ref, true);
  const animarOrabona = () => reproducirVideo(orabonaRef, false);
  const animarStepEspalda2 = () => reproducirVideo(stepEspalda2Ref, true);
 */
  return (

    <div className="escena5c">

      <div className="camara5c">

  
        <img className="fondo5c" src="./Fondo5c.png" alt="" />

     
       {/*  <img className="antorcha1-5c" src="/antorcha1.png" alt="" />
        <img className="antorcha2-5c" src="/antorcha2.png" alt="" />
 */}
      
       {/*  <div className="manchas5c" onClick={animarManchas}>
          <Lottie
            lottieRef={manchasRef}
            animationData={manchas}
            autoplay={false}
            loop={false}
          />
        </div>

  
        <div className="cuadro1-5c" onClick={animarCuadro1}>
          <Lottie
            lottieRef={cuadro1Ref}
            animationData={cuadro1}
            autoplay={false}
            loop={false}
          />
        </div>

        <div className="cuadro2-5c" onClick={animarCuadro2}>
          <Lottie
            lottieRef={cuadro2Ref}
            animationData={cuadro2}
            autoplay={false}
            loop={false}
          />
        </div>

        <div className="cuadro3-5c" onClick={animarCuadro3}>
          <Lottie
            lottieRef={cuadro3Ref}
            animationData={cuadro3}
            autoplay={false}
            loop={false}
          />
        </div>

        <div className="cuadro4-5c" onClick={animarCuadro4}>
          <Lottie
            lottieRef={cuadro4Ref}
            animationData={cuadro4}
            autoplay={false}
            loop={false}
          />
        </div>

        <div className="cuadro5-5c" onClick={animarCuadro5}>
          <Lottie
            lottieRef={cuadro5Ref}
            animationData={cuadro5}
            autoplay={false}
            loop={false}
          />
        </div>

        <div className="cuadro6-5c" onClick={animarCuadro6}>
          <Lottie
            lottieRef={cuadro6Ref}
            animationData={cuadro6}
            autoplay={false}
            loop={false}
          />
        </div>

        <div className="cuadro7-5c" onClick={animarCuadro7}>
          <Lottie
            lottieRef={cuadro7Ref}
            animationData={cuadro7}
            autoplay={false}
            loop={false}
          />
        </div>

        <div className="cuadro8-5c" onClick={animarCuadro8}>
          <Lottie
            lottieRef={cuadro8Ref}
            animationData={cuadro8}
            autoplay={false}
            loop={false}
          />
        </div>

      
        <div className="huesos5c" onClick={animarHuesos}>
          <Lottie
            lottieRef={huesosRef}
            animationData={huesos}
            autoplay={false}
            loop={false}
          />
        </div>

       
        <div className="puerta5c" onClick={animarPuerta}>
          <Lottie
            lottieRef={puertaRef}
            animationData={puerta}
            autoplay={false}
            loop={false}
          />
        </div>

        <video
          ref={stepEspalda1Ref}
          className="step-espalda1-5c"
          muted
          playsInline
          onClick={animarStepEspalda1}
        >
          <source src="/StepEspalda1-5c.webm" type="video/webm" />
        </video>

      
        <video
          ref={orabonaRef}
          className="orabona5c"
          muted
          playsInline
          onClick={animarOrabona}
        >
          <source src="/OrabonaEspalda5c.webm" type="video/webm" />
        </video>

  
        <video
          ref={stepEspalda2Ref}
          className="step-espalda2-5c"
          muted
          playsInline
          onClick={animarStepEspalda2}
        >
          <source src="/StepEspalda2-5c.webm" type="video/webm" />
        </video> */}

      </div>

    </div>

  );

};

export default LotieCap5C;