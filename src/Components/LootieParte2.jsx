import LottieModule from "lottie-react";
import { useRef } from "react";

import edificio from "../assets/edificio.json"; 
import rejas from "../assets/rejas.json";
import "../Styles/LootieParte2.css";

const Lottie = LottieModule.default;

const LootieParte2 = () => {
  const edificioRef = useRef(null); 
  const rejasRef = useRef(null);
  const videoRef = useRef(null);

  const animarEdificio = () => {
    edificioRef.current?.stop();
    edificioRef.current?.play();
  }; 

  const animarRejas = () => {
    rejasRef.current?.stop();
    rejasRef.current?.play();
  };

  const animarVideo = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play();
    }
  };

  return (
    <div className="escena">

      <img className="fondo2" src="/fondo2.png" />
      <img className="nube1" src="/nube1.png" />
      <img className="nube2" src="/nube2.png" />
      <img className="nube3" src="/nube3.png" />
      <img className="nube4" src="/nube4.png" />

      <video
        ref={videoRef}
        className="step2"
        muted
        playsInline
        onClick={animarVideo}
      >
        <source src="/CompRecorte.webm" type="video/webm" />
        Your browser does not support the video tag.
      </video>

      <div className="edificio" onClick={animarEdificio}>
        <Lottie
          lottieRef={edificioRef}
          animationData={edificio}
          autoplay={false}
          loop={false}
        />
      </div> 

      <div className="rejas" onClick={animarRejas}>
        <Lottie
          lottieRef={rejasRef}
          animationData={rejas}
          autoplay={false}
          loop={false}
        />
      </div>
    </div>
  );
};

export default LootieParte2;