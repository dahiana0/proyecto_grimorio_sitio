import LottieModule from "lottie-react";
import { useRef, useEffect } from "react";

/* import edificio from "../assets/edificio.json";
import edificio2 from "../assets/edificio2.json"; // TODO: ajusta el nombre de tu JSON
import rejas from "../assets/rejas.json";
import rejas2 from "../assets/rejas2.json"; // TODO: ajusta el nombre de tu JSON
import cintas from "../assets/cintas.json"; */ // TODO: ajusta el nombre de tu JSON
import "../Styles/LotieCap5A.css"

const Lottie = LottieModule.default;

const LotieCap5A = () => {

 /*  const edificioRef = useRef(null);
  const edificio2Ref = useRef(null);
  const rejasRef = useRef(null);
  const rejas2Ref = useRef(null);
  const cintasRef = useRef(null);
  const videoRef = useRef(null);

  const sonidoAmbiente = useRef(new Audio("/audios/ambiente.mp3"));
  const sonidoRejas = useRef(new Audio("/audios/rejas.mp3"));
  const sonidoPasos = useRef(new Audio("/audios/pasos.mp3")); */

 /*  useEffect(() => {

    sonidoAmbiente.current.volume = 0.15;
    sonidoRejas.current.volume = 0.35;
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
      sonidoRejas.current.pause();
      sonidoPasos.current.pause();
      window.removeEventListener("click", iniciarAmbiente);
    };

  }, []); */

  /* const animarEdificio = () => {
    edificioRef.current?.stop();
    edificioRef.current?.play();
  };

  const animarEdificio2 = () => {
    edificio2Ref.current?.stop();
    edificio2Ref.current?.play();
  };

  const animarRejas = () => {
    sonidoRejas.current.currentTime = 0;
    sonidoRejas.current.play().catch(() => { });

    rejasRef.current?.stop();
    rejasRef.current?.play();
  };

  const animarRejas2 = () => {
    sonidoRejas.current.currentTime = 0;
    sonidoRejas.current.play().catch(() => { });

    rejas2Ref.current?.stop();
    rejas2Ref.current?.play();
  };

  const animarCintas = () => {
    cintasRef.current?.stop();
    cintasRef.current?.play();
  };

  const animarVideo = () => {
    sonidoPasos.current.currentTime = 0;
    sonidoPasos.current.play().catch(() => { });

    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play();
    }
  }; */

  return (

    <div className="escena5a">

      <div className="camara">

      
        <img className="fondo5a" src="./Fondo5a.png" alt="" />

       {/*  <img className="nube1" src="/nube1.png" alt="" />
        <img className="nube2" src="/nube2.png" alt="" />
        <img className="nube3" src="/nube3.png" alt="" />
        <img className="nube4" src="/nube4.png" alt="" /> */}

        {/* <video
          ref={videoRef}
          className="step2"
          muted
          playsInline
          onClick={animarVideo}
        >
          <source src="/CompRecorte.webm" type="video/webm" />
        </video>

        <div className="edificio" onClick={animarEdificio}>
          <Lottie
            lottieRef={edificioRef}
            animationData={edificio}
            autoplay={false}
            loop={false}
          />
        </div>

        <div className="edificio2" onClick={animarEdificio2}>
          <Lottie
            lottieRef={edificio2Ref}
            animationData={edificio2}
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

        <div className="rejas2" onClick={animarRejas2}>
          <Lottie
            lottieRef={rejas2Ref}
            animationData={rejas2}
            autoplay={false}
            loop={false}
          />
        </div>

        <div className="cintas" onClick={animarCintas}>
          <Lottie
            lottieRef={cintasRef}
            animationData={cintas}
            autoplay={false}
            loop={false}
          />
        </div>
 */}
      </div>

    </div>

  );

};

export default LotieCap5A;