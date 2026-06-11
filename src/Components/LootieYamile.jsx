import LottieModule  from "lottie-react";
import peloticaYamile from "../assets/data-oso-yamile.json";
import { useRef } from "react";

const Lottie = LottieModule.default;
export const LootieYamile = () => {

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
          animationData={peloticaYamile}
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
