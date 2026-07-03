import LottieModule from "lottie-react";
import { useRef } from "react";

/* import lampara1 from "../assets/lampara1.json";
import lampara2 from "../assets/lampara2.json";

import monstruo1 from "../assets/monstruo1.json";
import monstruo2 from "../assets/monstruo2.json";
import monstruo3 from "../assets/monstruo3.json";
import monstruo4 from "../assets/monstruo4.json";

import telarana1 from "../assets/telarana1.json";
import telarana2 from "../assets/telarana2.json";

import stepFrente from "../assets/stepFrente.json";
import stepEspaldas from "../assets/stepEspaldas.json";
import stepLado from "../assets/stepLado.json";

import roges from "../assets/roges.json"; */

import "../Styles/LootieParte3.css";

const Lottie = LottieModule.default;

const LootieParte3 = () => {
/*   const lampara1Ref = useRef(null);
  const lampara2Ref = useRef(null);

  const monstruo1Ref = useRef(null);
  const monstruo2Ref = useRef(null);
  const monstruo3Ref = useRef(null);
  const monstruo4Ref = useRef(null);

  const telarana1Ref = useRef(null);
  const telarana2Ref = useRef(null);

  const stepFrenteRef = useRef(null);
  const stepEspaldasRef = useRef(null);
  const stepLadoRef = useRef(null);

  const rogesRef = useRef(null); */

  const reproducir = (ref) => {
    ref.current?.stop();
    ref.current?.play();
  };

  return (
    <div className="escena">

      <img
        className="fondo3"
        src="/Fondo3.png"
        alt=""
      />

{/*       <div
        className="lampara1"
        onClick={() => reproducir(lampara1Ref)}
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
        onClick={() => reproducir(lampara2Ref)}
      >
        <Lottie
          lottieRef={lampara2Ref}
          animationData={lampara2}
          autoplay={false}
          loop={false}
        />
      </div>

      <div
        className="monstruo1"
        onClick={() => reproducir(monstruo1Ref)}
      >
        <Lottie
          lottieRef={monstruo1Ref}
          animationData={monstruo1}
          autoplay={false}
          loop={false}
        />
      </div>

      <div
        className="monstruo2"
        onClick={() => reproducir(monstruo2Ref)}
      >
        <Lottie
          lottieRef={monstruo2Ref}
          animationData={monstruo2}
          autoplay={false}
          loop={false}
        />
      </div>

      <div
        className="monstruo3"
        onClick={() => reproducir(monstruo3Ref)}
      >
        <Lottie
          lottieRef={monstruo3Ref}
          animationData={monstruo3}
          autoplay={false}
          loop={false}
        />
      </div>

      <div
        className="monstruo4"
        onClick={() => reproducir(monstruo4Ref)}
      >
        <Lottie
          lottieRef={monstruo4Ref}
          animationData={monstruo4}
          autoplay={false}
          loop={false}
        />
      </div>

      <div
        className="telarana1"
        onClick={() => reproducir(telarana1Ref)}
      >
        <Lottie
          lottieRef={telarana1Ref}
          animationData={telarana1}
          autoplay={false}
          loop={false}
        />
      </div>

      <div
        className="telarana2"
        onClick={() => reproducir(telarana2Ref)}
      >
        <Lottie
          lottieRef={telarana2Ref}
          animationData={telarana2}
          autoplay={false}
          loop={false}
        />
      </div>

      <div
        className="stepFrente"
        onClick={() => reproducir(stepFrenteRef)}
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
        onClick={() => reproducir(stepEspaldasRef)}
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
        onClick={() => reproducir(stepLadoRef)}
      >
        <Lottie
          lottieRef={stepLadoRef}
          animationData={stepLado}
          autoplay={false}
          loop={false}
        />
      </div>

      <div
        className="roges"
        onClick={() => reproducir(rogesRef)}
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