import LottieModule from "lottie-react";
import { useRef, useEffect } from "react";

/* import estatua1 from "../assets/estatua1d.json"; // TODO: ajusta los nombres de tus JSON
import estatua2 from "../assets/estatua2d.json";
import estatua3 from "../assets/estatua3d.json";
import estatua4 from "../assets/estatua4d.json";
import rata from "../assets/rata.json"; */
import "../Styles/LotieCap5D.css";

const Lottie = LottieModule.default;

const LotieCap5D = () => {

  /* const estatua1Ref = useRef(null);
  const estatua2Ref = useRef(null);
  const estatua3Ref = useRef(null);
  const estatua4Ref = useRef(null);
  const rataRef = useRef(null);

  const monstruoRef = useRef(null);
  const stepRef = useRef(null);

  const sonidoAmbiente = useRef(new Audio("/audios/ambiente.mp3"));
  const sonidoPasos = useRef(new Audio("/audios/pasos.mp3")); */

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

  
 /*  const animarEstatua1 = () => {
    estatua1Ref.current?.stop();
    estatua1Ref.current?.play();
  };

  const animarEstatua2 = () => {
    estatua2Ref.current?.stop();
    estatua2Ref.current?.play();
  };

  const animarEstatua3 = () => {
    estatua3Ref.current?.stop();
    estatua3Ref.current?.play();
  };

  const animarEstatua4 = () => {
    estatua4Ref.current?.stop();
    estatua4Ref.current?.play();
  };
 */

 /*  const animarRata = () => {
    rataRef.current?.stop();
    rataRef.current?.play();
  };
 */

  /* const reproducirVideo = (videoRef, conPasos) => {
    if (conPasos) {
      sonidoPasos.current.currentTime = 0;
      sonidoPasos.current.play().catch(() => { });
    }

    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play();
    }
  };
 */
 /*  const animarMonstruo = () => reproducirVideo(monstruoRef, false);
  const animarStep = () => reproducirVideo(stepRef, true);
 */
  return (

    <div className="escena5d">

      <div className="camara5d">

        {/* Fondo: imagen */}
        <img className="fondo5d" src="./Fondo5d.png" alt="" />

      {/*   <img className="lampara5d" src="/lampara5d.png" alt="" /> */}

   
       {/*  <div className="estatua1-5d" onClick={animarEstatua1}>
          <Lottie
            lottieRef={estatua1Ref}
            animationData={estatua1}
            autoplay={false}
            loop={false}
          />
        </div>

        <div className="estatua2-5d" onClick={animarEstatua2}>
          <Lottie
            lottieRef={estatua2Ref}
            animationData={estatua2}
            autoplay={false}
            loop={false}
          />
        </div>

        <div className="estatua3-5d" onClick={animarEstatua3}>
          <Lottie
            lottieRef={estatua3Ref}
            animationData={estatua3}
            autoplay={false}
            loop={false}
          />
        </div>

        <div className="estatua4-5d" onClick={animarEstatua4}>
          <Lottie
            lottieRef={estatua4Ref}
            animationData={estatua4}
            autoplay={false}
            loop={false}
          />
        </div>

       
        <div className="rata5d" onClick={animarRata}>
          <Lottie
            lottieRef={rataRef}
            animationData={rata}
            autoplay={false}
            loop={false}
          />
        </div>

      
        <video
          ref={monstruoRef}
          className="monstruo5d"
          muted
          playsInline
          onClick={animarMonstruo}
        >
          <source src="/Monstruo5d.webm" type="video/webm" />
        </video>

        <video
          ref={stepRef}
          className="step5d"
          muted
          playsInline
          onClick={animarStep}
        >
          <source src="/StepCap5d.webm" type="video/webm" />
        </video>
 */}
      </div>

    </div>

  );

};

export default LotieCap5D;