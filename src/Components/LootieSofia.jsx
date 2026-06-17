import LottieModule from "lottie-react";
import pinguin from '../assets/pinguino-sofi.json'
import { useRef } from "react";
import '../Styles/lootieSofia.css'
import osoSofia from '../assets/oso-S.json'

const Lottie = LottieModule.default;

export const LootieSofia = () => {

  const lottieRef = useRef()
  const lottieRefP = useRef()

  const reproducir = () => {
    lottieRef.current.stop()
    lottieRef.current.play()
  }
  const reproducirP = () => {
    lottieRefP.current.stop()
    lottieRefP.current.play()
  }
  const lanzarHielo = () => {
    lottieRefP.current.stop()
    lottieRefP.current.playSegments([0,35], true)
  }
  const Bailarp = () => {
    lottieRefP.current.stop()
    lottieRefP.current.playSegments([35,120], true)
  }
  
  return (
    <>
      <div className="screen">
        <img className="fondo" src="fondo.webp" alt=""/>
        <img className= "nube1"src="nube1.webp" alt="" />
        <img className= "nube2"src="nube2.webp" alt="" />
        <img className=" pez-espinas"onClick={Bailarp} src="pezEspinas.svg" alt="" />
        <img className="hielo" onClick={lanzarHielo}src="cuboHielo.svg" alt="" />
      <div className= "oso" onClick={reproducir}>
        <Lottie
          lottieRef={lottieRef}
          animationData={osoSofia}
          loop={false}
          autoplay={false}
        />
      </div> 
      <div className= "pinguin" onClick={reproducirP}>
        <Lottie
          lottieRef={lottieRefP}
          animationData={pinguin}
          loop={false}
          autoplay={false}
        />
      </div>
      </div>

    </>
  )
}
