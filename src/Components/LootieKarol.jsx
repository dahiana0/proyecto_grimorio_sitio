import LottieModule from "lottie-react";
import osokarol from "../assets/Oso Animado 1.json";
import pinguin from "../assets/Pinguino-Karol.json"
import { useRef } from "react";
import "../Styles/LootieKarol.css"

const Lottie = LottieModule.default;
export const LootieKarol = () => {

  const lottieRefOso = useRef()
  const lottieRefPinguin = useRef()

  const reproducirOso = () => {

    lottieRefOso.current.stop()
    lottieRefOso.current.play()
  }

  const reproducirPinguin = () => {

    lottieRefPinguin.current.stop()
    lottieRefPinguin.current.play()
  }
  return (
    <>

      <div className="screen">
        <img className="fondo" src="../fondo.webp" alt="" />
        <img className="nube1" src="nube1.webp" alt="" />
        <img className="nube2" src="nube2.webp" alt="" />
        <img className="pezM" src="/pezEspinas.svg" alt="" />
        <img className="hielo" src="/cuboHielo.svg" alt="" />

        <div className="oso" onClick={reproducirOso}>
          <Lottie
            lottieRef={lottieRefOso}
            animationData={osokarol}
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
