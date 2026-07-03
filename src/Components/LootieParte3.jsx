import LottieModule from "lottie-react";
import { useRef } from "react";

/* import lampara1 from "../assets/lampara1.json";
import lampara2 from "../assets/lampara2.json";

import stepFrente from "../assets/stepFrente.json";
import stepEspaldas from "../assets/stepEspaldas.json";
import stepLado from "../assets/stepLado.json";

import roges from "../assets/roges.json"; */

import "../Styles/LootieParte3.css";

const Lottie = LottieModule.default;

const LootieParte3 = () => {
  /* const lampara1Ref = useRef(null);
  const lampara2Ref = useRef(null);

  const stepFrenteRef = useRef(null);
  const stepEspaldasRef = useRef(null);
  const stepLadoRef = useRef(null);

  const rogesRef = useRef(null);
 */
  const monstruo1Ref = useRef(null);
  /* const monstruo2Ref = useRef(null);
  const monstruo3Ref = useRef(null);
  const monstruo4Ref = useRef(null);

  const telarana1Ref = useRef(null);
  const telarana2Ref = useRef(null); */

  const reproducirLottie = (ref) => {
    ref.current?.stop();
    ref.current?.play();
  };

  const reproducirVideo = (ref) => {
    if (ref.current) {
      ref.current.pause();
      ref.current.currentTime = 0;
      ref.current.play();
    }
  };

  return (
    <div className="escena">

      <img
        className="fondo3"
        src="/Fondo3.png"
        alt=""
      />

  

      {/* <div
        className="lampara1"
        onClick={() => reproducirLottie(lampara1Ref)}
      >
        <Lottie
          lottieRef={lampara1Ref}
          animationData={lampara1}
          autoplay={false}
          loop={false}
        />
      </div>

      <div
        className="lampara2"
        onClick={() => reproducirLottie(lampara2Ref)}
      >
        <Lottie
          lottieRef={lampara2Ref}
          animationData={lampara2}
          autoplay={false}
          loop={false}
        />
      </div> */}

      

      {/* <video
        ref={telarana1Ref}
        className="telarana1"
        muted
        playsInline
        preload="auto"
        onClick={() => reproducirVideo(telarana1Ref)}
      >
        <source src="/telarana1.webm" type="video/webm" />
      </video>

      <video
        ref={telarana2Ref}
        className="telarana2"
        muted
        playsInline
        preload="auto"
        onClick={() => reproducirVideo(telarana2Ref)}
      >
        <source src="/telarana2.webm" type="video/webm" />
      </video> */}

   

      <video
        ref={monstruo1Ref}
        className="monstruo1"
        muted
        playsInline
        preload="auto"
        onClick={() => reproducirVideo(monstruo1Ref)}
      >
        <source src="/monstruo1.webm" type="video/webm" />
      </video>

      {/* <video
        ref={monstruo2Ref}
        className="monstruo2"
        muted
        playsInline
        preload="auto"
        onClick={() => reproducirVideo(monstruo2Ref)}
      >
        <source src="/monstruo2.webm" type="video/webm" />
      </video>

      <video
        ref={monstruo3Ref}
        className="monstruo3"
        muted
        playsInline
        preload="auto"
        onClick={() => reproducirVideo(monstruo3Ref)}
      >
        <source src="/monstruo3.webm" type="video/webm" />
      </video>

      <video
        ref={monstruo4Ref}
        className="monstruo4"
        muted
        playsInline
        preload="auto"
        onClick={() => reproducirVideo(monstruo4Ref)}
      >
        <source src="/monstruo4.webm" type="video/webm" />
      </video> */}

      {/* STEPS */}

      {/* <div
        className="stepFrente"
        onClick={() => reproducirLottie(stepFrenteRef)}
      >
        <Lottie
          lottieRef={stepFrenteRef}
          animationData={stepFrente}
          autoplay={false}
          loop={false}
        />
      </div>

      <div
        className="stepEspaldas"
        onClick={() => reproducirLottie(stepEspaldasRef)}
      >
        <Lottie
          lottieRef={stepEspaldasRef}
          animationData={stepEspaldas}
          autoplay={false}
          loop={false}
        />
      </div>

      <div
        className="stepLado"
        onClick={() => reproducirLottie(stepLadoRef)}
      >
        <Lottie
          lottieRef={stepLadoRef}
          animationData={stepLado}
          autoplay={false}
          loop={false}
        />
      </div> */}

      {/* ROGER */}

      {/* <div
        className="roges"
        onClick={() => reproducirLottie(rogesRef)}
      >
        <Lottie
          lottieRef={rogesRef}
          animationData={roges}
          autoplay={false}
          loop={false}
        />
      </div> */}

    </div>
  );
};

export default LootieParte3;