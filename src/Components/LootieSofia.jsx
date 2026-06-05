import LottieModule from "lottie-react";
import osoSofia from '../assets/oso-S.json'
import { useRef } from "react";

const Lottie = LottieModule.default;

export const LootieSofia = () => {

  const lottieRef = useRef()

  const reproducir = () => {
    lottieRef.current.stop()
    lottieRef.current.play()
  }
  return (
    <>
      <div onClick={reproducir}>
        <Lottie
          lottieRef={lottieRef}
          animationData={osoSofia}
          loop={false}
          autoplay={false}
          style={{
            width: 500,
            height: 500
          }}
        />
      </div>
    </>
  )
}
