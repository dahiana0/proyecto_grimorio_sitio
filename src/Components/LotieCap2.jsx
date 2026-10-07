import { useRef } from "react";
import LottieModule from "lottie-react";

import estatua1 from "../assets/estatua1.json";
import estatua3 from "../assets/estatua3.json";
import estatua4 from "../assets/estatua4.json";
import estatua5 from "../assets/estatua5.json";
import estatua6 from "../assets/estatua6.json";

import rata from "../assets/rata.json";

import "../Styles/LotieCap2.css";
const Lottie = LottieModule.default;

const LotieCap2 = () => {
  const estatua1Ref = useRef(null);
  const estatua3Ref = useRef(null);
  const estatua4Ref = useRef(null);
  const estatua5Ref = useRef(null);
  const estatua6Ref = useRef(null);

  const rataRef = useRef(null);

  // Steps (video)
  const stepEspaldaCap2Ref = useRef(null);
  const stepFrenteCap2Ref = useRef(null);
  const stepEspalda2Cap2Ref = useRef(null);

  const animarLottie = (ref) => {
    if (!ref.current) return;

    ref.current.stop();
    ref.current.play();
  };

  const reproducirVideo = (ref) => {
    if (!ref.current) return;

    ref.current.currentTime = 0;
    ref.current.play();
  };

  const animarEstatua1 = () => {
    animarLottie(estatua1Ref);
  };

  const animarEstatua3 = () => {
    animarLottie(estatua3Ref);
  };

  const animarEstatua4 = () => {
    animarLottie(estatua4Ref);
  };

  const animarEstatua5 = () => {
    animarLottie(estatua5Ref);
  };

  const animarEstatua6 = () => {
    animarLottie(estatua6Ref);
  };

  const animarRata = () => {
    animarLottie(rataRef);
  };

  return (
    <div className="contenedor-escena">
      <div className="escenacap2">
        <img
          className="fondo"
          src="/ESC CAP 2.png"
          alt="Escenario capítulo 2"
        />

        <div className="estatua estatua1" onClick={animarEstatua1}>
          <Lottie
            lottieRef={estatua1Ref}
            animationData={estatua1}
            autoplay={false}
            loop={false}
          />
        </div>

        <div className="estatua estatua3" onClick={animarEstatua3}>
          <Lottie
            lottieRef={estatua3Ref}
            animationData={estatua3}
            autoplay={false}
            loop={false}
          />
        </div>

        <div className="estatua estatua4" onClick={animarEstatua4}>
          <Lottie
            lottieRef={estatua4Ref}
            animationData={estatua4}
            autoplay={false}
            loop={false}
          />
        </div>

        <div className="estatua estatua5" onClick={animarEstatua5}>
          <Lottie
            lottieRef={estatua5Ref}
            animationData={estatua5}
            autoplay={false}
            loop={false}
          />
        </div>

        <div className="estatua estatua6" onClick={animarEstatua6}>
          <Lottie
            lottieRef={estatua6Ref}
            animationData={estatua6}
            autoplay={false}
            loop={false}
          />
        </div>

        <div className="rata" onClick={animarRata}>
          <Lottie
            lottieRef={rataRef}
            animationData={rata}
            autoplay={false}
            loop={true}
          />
        </div>

        <img
          className="lampara lampara1C"
          src="/lampara1.png"
          alt="Lámpara 1"
        />

        <img
          className="lampara lampara2C"
          src="/lampara1.png"
          alt="Lámpara 2"
        />

        <img
          className="lampara lampara3C"
          src="/lampara1.png"
          alt="Lámpara 3"
        />

        {/* Step espalda */}
        <video
          ref={stepEspaldaCap2Ref}
          className="step stepEspaldaCap2"
          muted
          playsInline
          preload="auto"
          onClick={() => reproducirVideo(stepEspaldaCap2Ref)}
        >
          <source src="/step-espalda.webm" type="video/webm" />
        </video>

        {/* Step frente */}
        <video
          ref={stepFrenteCap2Ref}
          className="step stepFrenteCap2"
          muted
          playsInline
          preload="auto"
          onClick={() => reproducirVideo(stepFrenteCap2Ref)}
        >
          <source src="/step-frente.webm" type="video/webm" />
        </video>

        {/* Segundo step espalda (despues del step frente) */}
        <video
          ref={stepEspalda2Cap2Ref}
          className="step stepEspalda2Cap2"
          muted
          playsInline
          preload="auto"
          onClick={() => reproducirVideo(stepEspalda2Cap2Ref)}
        >
          <source src="/step-espalda.webm" type="video/webm" />
        </video>
      </div>
    </div>
  );
};

export default LotieCap2;