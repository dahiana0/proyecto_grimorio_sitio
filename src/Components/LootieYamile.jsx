import LottieModule from "lottie-react";
import oso from "../assets/data-oso-yamile.json";
import pinguin from "../assets/pinguino-sofi.json";
import { useRef } from "react";
import "../Styles/lottieyamile.css";

const Lottie = LottieModule.default;

export const LootieYamile = () => {
  const lottieRefOso = useRef();
  const lottieRefPinguin = useRef();

  const reproducirOso = () => {
    lottieRefOso.current.stop();
    lottieRefOso.current.play();
  };

  const reproducirPinguin = () => {
    lottieRefPinguin.current.stop();
    lottieRefPinguin.current.play();
  };

  const lanzarHielo = () => {
    lottieRefPinguin.current.stop();
    lottieRefPinguin.current.playSegments([0, 35], true);
  };

  const lanzarPez = () => {
    lottieRefPinguin.current.stop();
    lottieRefPinguin.current.playSegments([35, 124], true);
  }

  return (
    <>
      <div className="screen">
        <img className="fondo" src="fondo.webp" alt="" />

        <img className="nube1" src="nube1.webp" alt="" />
        <img className="nube2" src="nube2.webp" alt="" />

        <img className="pezM" src="pezEspinas.svg" alt="" onClick={lanzarPez} />

        <img
          className="cuboHielo"
          src="cuboHielo.svg"
          alt=""
          onClick={lanzarHielo}
        />

        <img className="iglu" src="iglu.svg" alt="" />

        <div className="oso" onClick={reproducirOso}>
          <Lottie
            lottieRef={lottieRefOso}
            animationData={oso}
            loop={false}
            autoplay={false}
          />
        </div>

        <div className="pinguin" onClick={reproducirPinguin}>
          <Lottie
            lottieRef={lottieRefPinguin}
            animationData={pinguin}
            loop={false}
            autoplay={false}
          />
        </div>
      </div>
    </>
  );
};
