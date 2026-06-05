import LottieModule  from "lottie-react";
import peloticaKarol from "../assets/Oso Animado 1.json";
import { useRef } from "react";

const Lottie = LottieModule.default;
export const LootieKarol = () => {

  const lottieRef = useRef()

  const reproducir=()=>{
    
    lottieRef.current.stop()
    lottieRef.current.play()
  }

  return (
    <>
      <div onClick={reproducir}>
        <Lottie
          lottieRef={lottieRef}
          animationData={peloticaKarol}
          loop={false}
          autoplay={false}
          style={{
            width: 500,
            height: 500,
          }}
        />
      </div>
    </>
  );
};
