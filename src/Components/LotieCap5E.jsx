import LottieModule from "lottie-react";
import { useRef, useEffect } from "react";

/* import pintura1 from "../assets/pintura1e.json"; // TODO: ajusta los nombres de tus JSON
import pintura2 from "../assets/pintura2e.json";
import huesos from "../assets/huesos5e.json"; */
import "../Styles/LotieCap5E.css";

const Lottie = LottieModule.default;

const LotieCap5E = () => {

  /* const pintura1Ref = useRef(null);
  const pintura2Ref = useRef(null);
  const huesosRef = useRef(null);

  // Personajes (videos)
  const step5eRef = useRef(null);
  const roges5eRef = useRef(null);
  const monstruo5eRef = useRef(null);

  const sonidoAmbiente = useRef(new Audio("/audios/ambiente.mp3"));
  const sonidoPasos = useRef(new Audio("/audios/pasos.mp3"));
 */
  /* useEffect(() => {

    sonidoAmbiente.current.volume = 0.15;
    sonidoPasos.current.volume = 0.40;

    sonidoAmbiente.current.loop = true;

    const iniciarAmbiente = () => {
      sonidoAmbiente.current.play().catch(() => { });
      window.removeEventListener("click", iniciarAmbiente);
    };

    window.addEventListener("click", iniciarAmbiente);

    return () => {
      sonidoAmbiente.current.pause();
      sonidoAmbiente.current.currentTime = 0;
      sonidoPasos.current.pause();
      window.removeEventListener("click", iniciarAmbiente);
    };

  }, []); */

 
  /* const animarPintura1 = () => {
    pintura1Ref.current?.stop();
    pintura1Ref.current?.play();
  };

  const animarPintura2 = () => {
    pintura2Ref.current?.stop();
    pintura2Ref.current?.play();
  };

  // Huesos
  const animarHuesos = () => {
    huesosRef.current?.stop();
    huesosRef.current?.play();
  };

  const reproducirVideo = (videoRef, conPasos) => {
    if (conPasos) {
      sonidoPasos.current.currentTime = 0;
      sonidoPasos.current.play().catch(() => { });
    }

    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play();
    }
  }; */

 /*  const animarStep5e = () => reproducirVideo(step5eRef, true);
  const animarRoges5e = () => reproducirVideo(roges5eRef, false);
  const animarMonstruo5e = () => reproducirVideo(monstruo5eRef, false); */

  return (

    <div className="escena5e">

      <div className="camara5e">

      
        <img className="fondo5e" src="./Fondo5e.png" alt="" />

   
        {/* <img className="lampara5e" src="/lampara5e.png" alt="" /> */}

       
        {/* <div className="pintura1-5e" onClick={animarPintura1}>
          <Lottie
            lottieRef={pintura1Ref}
            animationData={pintura1}
            autoplay={false}
            loop={false}
          />
        </div>

        <div className="pintura2-5e" onClick={animarPintura2}>
          <Lottie
            lottieRef={pintura2Ref}
            animationData={pintura2}
            autoplay={false}
            loop={false}
          />
        </div>

       
        <div className="huesos5e" onClick={animarHuesos}>
          <Lottie
            lottieRef={huesosRef}
            animationData={huesos}
            autoplay={false}
            loop={false}
          />
        </div>

  
        <video
          ref={step5eRef}
          className="step5e"
          muted
          playsInline
          onClick={animarStep5e}
        >
          <source src="/Step5e.webm" type="video/webm" />
        </video>

       
        <video
          ref={roges5eRef}
          className="roges5e"
          muted
          playsInline
          onClick={animarRoges5e}
        >
          <source src="/Roges5e.webm" type="video/webm" />
        </video>

       
        <video
          ref={monstruo5eRef}
          className="monstruo5e"
          muted
          playsInline
          onClick={animarMonstruo5e}
        >
          <source src="/Monstruo5e.webm" type="video/webm" />
        </video>
 */}
      </div>

    </div>

  );

};

export default LotieCap5E;