import LottieMoudule from "lottie-react";
import peloticaKarol from "../assets/data-Karol.json"
import { useRef } from "react";

const Lottie = LottieMoudule.default;


export const LootieKarol = () => {
  const lottieRef = useRef()

  const reproducir =() =>{
    lottieRef.current.stop()
    lottieRef.current.play()
  }
  return (
  
    <div onClick={reproducir}>
        <Lottie
        lottieRef={lottieRef}
        animationData={peloticaKarol}
        loop={false}
        style={{width:500, height: 500}}
        />
    </div>
  );
};